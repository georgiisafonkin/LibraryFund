import { useState, useEffect, useCallback } from "react";
import type { Student } from "../types/readers";

export function useReaders(host: string, service: string) {
  const [readers, setReaders] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReaders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const url = `${host}readers/${service}`;

    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);

      const data = JSON.parse(text);
      const normalized: Student[] = data.map((r: any) => ({
        ...r,
        attributes: r.attributes ?? {},
        birth_date: new Date(r.birth_date),
      }));
      setReaders(normalized);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [host, service]);

  // Загружаем при монтировании
  useEffect(() => {
    fetchReaders();
  }, [fetchReaders]);

  return { readers, loading, error, refetch: fetchReaders };
}
