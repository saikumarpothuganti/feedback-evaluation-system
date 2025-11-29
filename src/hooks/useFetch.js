import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching data from an API
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @returns {object} - { data, loading, error, refetch }
 */
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url, { ...options, signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name === 'AbortError') return; // silently ignore aborted requests
      setError(err.message || 'Unknown error');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const refetch = () => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  };

  return { data, loading, error, refetch };
}
