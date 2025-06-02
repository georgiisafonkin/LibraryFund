// hooks/readers.ts
import { useState, useEffect } from "react";
import type { Student } from "../types/readers";

export function useReaders(host: string, service: string) {
  const [readers, setReaders] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = `${host}readers/${service}`;

    fetch(url, {
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        return JSON.parse(text);
      })
      .then((data) => {
        // Нормализация данных — убеждаемся, что attributes всегда объект
        const normalized: Student[] = data.map((r: any) => ({
          ...r,
          attributes: r.attributes ?? {},
          birth_date: new Date(r.birth_date),
        }));
        setReaders(normalized);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [host, service]);

  return { readers, loading, error };
}
