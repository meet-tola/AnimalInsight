'use client';

import { useState, useCallback } from 'react';

export interface IdentificationData {
  results: any[];
  accessToken: string;
}

interface UseInsectIdentificationReturn {
  loading: boolean;
  error: string | null;
  identify: (file: File) => Promise<IdentificationData>;
  clearError: () => void;
}

export function useInsectIdentification(): UseInsectIdentificationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const identify = useCallback(async (file: File): Promise<IdentificationData> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || 'Failed to identify insect. Please try again.'
        );
      }

      const data = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error(
          'No insects found in the image. Please try another photo.'
        );
      }

      return {
        results: data.results,
        accessToken: data.accessToken,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    identify,
    clearError,
  };
}
