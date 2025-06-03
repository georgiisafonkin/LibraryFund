import { useEffect, useState } from "react";
import type { Worker } from "../types/readers";

export function useWorkers(host: string, service: string) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${host}${service}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);

      // Данные приходят с birth_date строкой, преобразуем в Date
      const data = (await res.json()) as Array<
        Omit<Worker, "birth_date"> & { birth_date: string }
        >;

      setWorkers(
        data.map((w) => ({
          id: w.id,
          name: w.name,
          birth_date: new Date(w.birth_date),
          library_id: w.library_id,
          attributes: w.attributes,
          organization: w.organization,
          position: w.position,
        }))
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [host, service]);

  return { workers, loading, error, refetch: fetchWorkers };
}
