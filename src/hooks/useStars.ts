import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';

export function useStars() {
  const stars = useDataStore((state) => state.stars);
  const selectedStarId = useDataStore((state) => state.selectedStarId);
  const loadingData = useDataStore((state) => state.loadingData);
  const setSelectedStarId = useDataStore((state) => state.setSelectedStarId);

  const selectedStar = useMemo(() => {
    return stars.find((s) => s.id === selectedStarId) || stars[0] || null;
  }, [stars, selectedStarId]);

  return {
    stars,
    selectedStarId,
    selectedStar,
    loadingData,
    selectStar: setSelectedStarId,
  };
}
