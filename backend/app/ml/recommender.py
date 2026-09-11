import re
from typing import Any, Dict, List, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models.place import Place


class ContentRecommender:
    """
    Content-Based Recommendation Engine for ApniYatra.
    Uses Scikit-Learn (TF-IDF Vectorization + Cosine Similarity) to match
    traveler preferences, interest tags, and budget limits with heritage places.
    """

    def __init__(self, stop_words: str = "english", ngram_range: tuple = (1, 2)):
        self.vectorizer = TfidfVectorizer(
            stop_words=stop_words,
            ngram_range=ngram_range,
            sublinear_tf=True,
            lowercase=True,
        )
        self.places: List[Place] = []
        self.tfidf_matrix = None
        self.is_fitted = False

    @staticmethod
    def parse_budget_cost(entry_fee_str: Optional[str]) -> float:
        """
        Parses numerical cost from entry fee strings like:
        - 'Free' -> 0.0
        - '₹40 (Indians), ₹600 (Foreigners)' -> 40.0
        - '₹100' -> 100.0
        """
        if not entry_fee_str:
            return 0.0
        s = entry_fee_str.lower().strip()
        if "free" in s or s == "0":
            return 0.0

        matches = re.findall(r"₹\s*(\d+(?:,\d+)?)", entry_fee_str)
        if matches:
            first_num = matches[0].replace(",", "")
            try:
                return float(first_num)
            except ValueError:
                pass

        digits = re.findall(r"\b(\d+)\b", entry_fee_str)
        if digits:
            try:
                return float(digits[0])
            except ValueError:
                pass

        return 0.0

    def _build_place_document(self, place: Place) -> str:
        """
        Synthesizes a rich text document for a Place, weighting critical domain
        features like category, tags, and heritage folklore.
        """
        tags_str = " ".join(place.tags) if isinstance(place.tags, list) else ""
        category_boost = f"{place.category} {place.category}"
        tags_boost = f"{tags_str} {tags_str}"
        name_boost = f"{place.name} {place.name}"
        location = f"{place.city} {place.state}"
        desc = place.description or ""
        folklore = place.folklore_story or ""
        history = place.history_summary or ""

        gem_indicator = "hidden gem secret offbeat undiscovered" if place.is_hidden_gem else "iconic famous monument"

        return f"{name_boost} {category_boost} {tags_boost} {location} {gem_indicator} {desc} {folklore} {history}"

    def fit(self, places: List[Place]) -> "ContentRecommender":
        """Fit the TF-IDF vectorizer over the places directory corpus."""
        if not places:
            self.places = []
            self.tfidf_matrix = None
            self.is_fitted = False
            return self

        self.places = places
        corpus = [self._build_place_document(p) for p in places]
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        self.is_fitted = True
        return self

    def recommend(
        self,
        user_tags: Optional[List[str]] = None,
        query_text: Optional[str] = None,
        max_budget: Optional[float] = None,
        city: Optional[str] = None,
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Matches user tags, search query, and max budget against places using
        cosine similarity. Returns ranked places with score and matching explanation.
        """
        if not self.is_fitted or not self.places:
            return []

        # Construct user interest query document
        tokens: List[str] = []
        if user_tags:
            # Repeat tags for higher signal
            tokens.extend([f"{t} {t}" for t in user_tags])
        if query_text:
            tokens.append(query_text)
        if city:
            tokens.extend([city, city])

        query_doc = " ".join(tokens).strip()
        if not query_doc:
            query_doc = "heritage culture hidden gem"

        query_vec = self.vectorizer.transform([query_doc])

        # Compute cosine similarity between user query and all places
        raw_similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        results: List[Dict[str, Any]] = []

        for idx, place in enumerate(self.places):
            base_score = float(raw_similarities[idx])

            # City match bonus
            if city and city.lower() in place.city.lower():
                base_score += 0.25

            # Budget evaluation
            place_cost = self.parse_budget_cost(place.entry_fee)
            budget_passed = True
            budget_penalty = 1.0

            if max_budget is not None and max_budget > 0:
                if place_cost > max_budget:
                    # Penalize places that exceed the user's max budget
                    budget_passed = False
                    excess_ratio = (place_cost - max_budget) / max_budget
                    budget_penalty = max(0.1, 1.0 - (excess_ratio * 0.5))

            adjusted_score = base_score * budget_penalty

            # Identify matching tags
            matched_tags: List[str] = []
            if user_tags and isinstance(place.tags, list):
                user_tag_set = {t.lower() for t in user_tags}
                for t in place.tags:
                    if t.lower() in user_tag_set or any(ut in t.lower() for ut in user_tag_set):
                        matched_tags.append(t)

            # Generate intuitive match reason
            reasons: List[str] = []
            if matched_tags:
                reasons.append(f"Matched your interests in {', '.join(matched_tags)}")
            if city and city.lower() in place.city.lower():
                reasons.append(f"Located in your destination ({place.city})")
            if place.is_hidden_gem and user_tags and any("hidden" in t.lower() or "gem" in t.lower() for t in user_tags):
                reasons.append("Verified offbeat hidden gem")
            if max_budget is not None:
                if place_cost == 0:
                    reasons.append("Free entry within your budget")
                elif budget_passed:
                    reasons.append(f"Entry cost (₹{place_cost:.0f}) well within max budget of ₹{max_budget:.0f}")

            reason_str = " | ".join(reasons) if reasons else f"Recommended for its {place.category.lower()} heritage"

            # Normalize match percentage (15% to 99%)
            normalized_pct = min(99.0, max(15.0, adjusted_score * 100))

            results.append({
                "place": place,
                "similarity_score": round(adjusted_score, 4),
                "match_percentage": round(normalized_pct, 1),
                "estimated_cost": place_cost,
                "matched_tags": matched_tags,
                "match_reason": reason_str,
                "budget_passed": budget_passed,
            })

        # Rank by adjusted similarity score descending
        results.sort(key=lambda x: x["similarity_score"], reverse=True)

        return results[:top_k]


# Global recommender instance for the application
_recommender_instance: Optional[ContentRecommender] = None


def get_recommender() -> ContentRecommender:
    global _recommender_instance
    if _recommender_instance is None:
        _recommender_instance = ContentRecommender()
    return _recommender_instance
