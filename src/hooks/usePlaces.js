import { useEffect, useState } from "react";
import { fetchFavorites, fetchPlaces } from "../services/api";

export const usePlaces = () => {
  const [popular, setPopular] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([])
  useEffect(() => {
    const initialize = async () => {
      try {
        const [placesResponse, favoritesResponse] = await Promise.all([
          fetchPlaces(),
          fetchFavorites(),
        ]);
        const allPlaces = placesResponse.data;
        setPlaces(allPlaces)
        const favIds = favoritesResponse.data.map(f => f.place.id);
        setFavorites(favIds);
        setPopular(allPlaces.filter(p => p.populaire));
        setRecommended(allPlaces.filter(p => p.recommande));
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
