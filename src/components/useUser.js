import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // pour éviter les updates après démontage

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const response = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (isMounted) {
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            const error = await response.json();
            console.error('Erreur API :', error.message);
            setUser(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Erreur réseau :', error);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false; // cleanup pour éviter les memory leaks
    };
  }, []);

  return { user, loading };
}
