import { useState, useEffect } from 'react';
import { TMDBMovie, TMDBPerson } from '../types';
import {
  fetchIndianCinema,
  fetchTrendingMovies,
  fetchNowPlaying,
  fetchUpcoming,
  fetchPopularPeople,
} from '../services/tmdbService';

export function useMovies(category: 'indian' | 'trending' | 'now_playing' | 'upcoming' = 'indian') {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [people, setPeople] = useState<TMDBPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMoviesData() {
      setLoading(true);
      try {
        let resMovies: TMDBMovie[] = [];
        if (category === 'indian') {
          const res = await fetchIndianCinema(1, 'popularity.desc', 'hi|ta|te|ml|kn');
          resMovies = res.results || [];
        } else if (category === 'trending') {
          const res = await fetchTrendingMovies('week', 1);
          resMovies = res.results || [];
        } else if (category === 'now_playing') {
          const res = await fetchNowPlaying(1);
          resMovies = res.results || [];
        } else if (category === 'upcoming') {
          const res = await fetchUpcoming(1);
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
  }, [category]);

  return {
    movies,
    people,
    loading,
  };
}
