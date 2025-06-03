import { useState, useEffect, useCallback } from "react";
import type { Retiree } from "../types/readers";

const HOST = "http://127.0.0.1:8000/";
const service = "readers/retirees";

export function useRetirees() {
  const [retirees, setRetirees] = useState<Retiree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRetirees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${HOST}${service}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("Ошибка загрузки пенсионеров");
      const data = (await res.json()) as Retiree[];
      // Конвертация дат в Date объекты
      data.forEach((r) => {
        r.birth_date = new Date(r.birth_date);
      });
      setRetirees(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRetirees();
  }, [fetchRetirees]);

  return { retirees, loading, error, refetch: fetchRetirees };
}
