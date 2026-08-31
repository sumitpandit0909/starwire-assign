import { useState, useEffect } from 'react';
import { TMDBMovie, TMDBPerson } from '../types';
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcoming,
  fetchIndianCinema,
  fetchTrendingMovies,
  fetchNowPlaying,
  fetchPopularPeople,
} from '../services/tmdbService';

const FALLBACK_MOVIES: TMDBMovie[] = [
  {
    id: 1072790,
    title: 'Kalki 2898 AD',
    original_title: 'Kalki 2898 AD',
    overview: 'A modern avatar of Lord Vishnu, believed to have descended to earth to protect the world from evil forces in a futuristic dystopian world.',
    poster_path: '/uY009R878V1b20vW2sM258R6.jpg',
    backdrop_path: '/uY009R878V1b20vW2sM258R6.jpg',
    release_date: '2024-06-27',
    vote_average: 8.8,
    vote_count: 3250,
    popularity: 245.8,
    original_language: 'te',
  },
  {
    id: 940551,
    title: 'Jawan',
    original_title: 'Jawan',
    overview: 'A high-octane action thriller outlining the emotional journey of a man who is set to rectify the wrongs in society.',
    poster_path: '/j9mH1kr9QjWV2a9R1N44H8B2sM2.jpg',
    backdrop_path: '/j9mH1kr9QjWV2a9R1N44H8B2sM2.jpg',
    release_date: '2023-09-07',
    vote_average: 8.6,
    vote_count: 2100,
    popularity: 195.3,
    original_language: 'hi',
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    release_date: '2023-07-21',
    vote_average: 8.9,
    vote_count: 7850,
    popularity: 310.2,
    original_language: 'en',
  },
  {
    id: 572802,
    title: 'Aquaman and the Lost Kingdom',
    original_title: 'Aquaman and the Lost Kingdom',
    overview: 'Black Manta seeks revenge on Aquaman using the mythic Black Trident. To defeat him, Aquaman must forge an unlikely alliance with his brother.',
    poster_path: '/7lTnUd0meT6oxjUyuWsF0qR3Wio.jpg',
    backdrop_path: '/cnqwv5UzDXTVwmeT6oxjUyuWsF0qR3Wio.jpg',
    release_date: '2024-01-12',
    vote_average: 8.4,
    vote_count: 1420,
    popularity: 185.4,
    original_language: 'en',
  },
];

export function useMovies(
  category: 'popular' | 'top_rated' | 'upcoming' | 'indian' | 'trending' | 'now_playing' = 'indian',
  page = 1
) {
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
          const res = await fetchIndianCinema(page);
          resMovies = res.results || [];
        } else if (category === 'trending') {
          const res = await fetchTrendingMovies('week', page);
          resMovies = res.results || [];
        } else if (category === 'now_playing') {
          const res = await fetchNowPlaying(page);
          resMovies = res.results || [];
        } else if (category === 'popular') {
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
          setMovies(resMovies.length > 0 ? resMovies : FALLBACK_MOVIES);
        }

        // Fetch popular people concurrently
        const peopleRes = await fetchPopularPeople(1);
        if (isMounted && peopleRes.results) {
          setPeople(peopleRes.results);
        }
      } catch (err) {
        console.warn('useMovies fetch error:', err);
        if (isMounted) {
          setMovies(FALLBACK_MOVIES);
        }
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
