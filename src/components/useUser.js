import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('Token non trouvé');
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          const err = await response.json();
          console.error('Erreur:', err.message);
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur réseau ou autre:', error);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
