import React, { useEffect, useState } from 'react';

function Places() {
  const [lieux, setLieux] = useState([]); // State pour stocker les lieux
  const [loading, setLoading] = useState(true); // Optionnel : pour afficher un loading
  const [error, setError] = useState(null); // Optionnel : pour gérer les erreurs

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const response = await fetch('http://localhost:8083/places'); // Remplace avec ton URL
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        setLieux(data); // On stocke les lieux dans le state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLieux(); // Appel de la fonction
  }, []); // Le tableau vide signifie que ça s'exécute une seule fois (au montage du composant)

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des lieux</h2>
      <ul>
        {lieux.map((lieu, index) => (
          <li key={index}>{lieu.name}</li> // Adapte selon la structure des données
        ))}
      </ul>
    </div>
  );
}

export default Places;
