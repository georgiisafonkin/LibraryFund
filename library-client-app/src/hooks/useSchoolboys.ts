import { useEffect, useState, useCallback } from "react";
import type { Schoolboy } from "../types/readers";

export function useSchoolboys(HOST: string, service: string) {
  const [schoolboys, setSchoolboys] = useState<Schoolboy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchoolboys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${HOST}${service}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Ошибка при загрузке школьников");
      const data = await res.json();
      setSchoolboys(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [HOST, service]);

  useEffect(() => {
    fetchSchoolboys();
  }, [fetchSchoolboys]);

  return {
    schoolboys,
    loading,
    error,
    refetch: fetchSchoolboys,
  };
}
