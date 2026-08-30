import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';

export function useNews() {
  const news = useDataStore((state) => state.news);
  const activeNewsModalId = useDataStore((state) => state.activeNewsModalId);
  const loadingData = useDataStore((state) => state.loadingData);
  const openNewsModal = useDataStore((state) => state.openNewsModal);
  const closeNewsModal = useDataStore((state) => state.closeNewsModal);

  const activeModalNews = useMemo(() => {
    return news.find((n) => n.id === activeNewsModalId) || null;
  }, [news, activeNewsModalId]);

  return {
    news,
    activeNewsModalId,
    activeModalNews,
    loadingData,
    openNewsModal,
    closeNewsModal,
  };
}
