import { useState, useEffect, useCallback } from "react";
import type { Teacher } from "../types/readers";

export function useTeachers(host: string, service: string) {
  const [readers, setReaders] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReaders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${host}readers/${service}`, {
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);

      const data = JSON.parse(text);
      const normalized: Teacher[] = data.map((r: any) => ({
        ...r,
        birth_date: new Date(r.birth_date),
        attributes: r.attributes ?? {},
      }));
      setReaders(normalized);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [host, service]);

  useEffect(() => {
    fetchReaders();
  }, [fetchReaders]);

  return { readers, loading, error, refetch: fetchReaders };
}
