import { useEffect, useState } from "react";
import { fetchFavorites, fetchPlaces, getAverageRatingByPlace } from "../services/api";

export const usePlaces = () => {
  const [popular, setPopular] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const [placesResponse, favoritesResponse] = await Promise.all([
          fetchPlaces(),
          fetchFavorites(),
        ]);

        let allPlaces = placesResponse.data;

        const placesWithRating = await Promise.all(
          allPlaces.map(async (place) => {
            try {
              const ratingRes = await getAverageRatingByPlace(place.id);
              return { ...place, averageRating: ratingRes.data ?? null };
            } catch (error) {
              console.error(`Erreur pour le lieu ${place.id}:`, error.message);
              return { ...place, averageRating: null };
            }
          })
        );

        setPlaces(placesWithRating);
        setPopular(placesWithRating.filter(p => p.populaire));
        setRecommended(placesWithRating.filter(p => p.recommande));

        const favIds = favoritesResponse.data.map(f => f.place.id);
        setFavorites(favIds);
      } catch (err) {
        console.error("Erreur lors de l'initialisation :", err.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return { popular, recommended, favorites, setFavorites, loading, places };
};

