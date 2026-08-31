import { useState, useEffect } from 'react';
import { TMDBMovie, TMDBPerson } from '../types';
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcoming,
  fetchPopularPeople,
} from '../services/tmdbService';

export function useMovies(category: 'popular' | 'top_rated' | 'upcoming' = 'popular', page = 1) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [people, setPeople] = useState<TMDBPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMoviesData() {
      setLoading(true);
      try {
        let resMovies: TMDBMovie[] = [];
        if (category === 'popular') {
          const res = await fetchPopularMovies(page);
          resMovies = res.results || [];
        } else if (category === 'top_rated') {
          const res = await fetchTopRatedMovies(page);
          resMovies = res.results || [];
        } else if (category === 'upcoming') {
          const res = await fetchUpcoming(page);
          resMovies = res.results || [];
        }

        if (isMounted) {
          setMovies(resMovies);
        }

        // Fetch popular people concurrently
        const peopleRes = await fetchPopularPeople(1);
        if (isMounted && peopleRes.results) {
          setPeople(peopleRes.results);
        }
      } catch (err) {
        console.warn('useMovies fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMoviesData();
    return () => {
      isMounted = false;
    };
  }, [category, page]);

  return {
    movies,
    people,
    loading,
  };
}
