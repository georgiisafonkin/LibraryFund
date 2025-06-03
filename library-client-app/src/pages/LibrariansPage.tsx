import { useEffect, useState } from "react";

interface ReaderCount {
  id: number;
  name: string;
  total_readers: number;
}

interface Librarian {
  id: number;
  name: string;
}

export default function LibrariansPage() {
  const [startDate, setStartDate] = useState("1990-01-02");
  const [endDate, setEndDate] = useState("2026-02-02");
  const [hallName, setHallName] = useState("Основной зал");
  const [libraryId, setLibraryId] = useState(1);

  const [readerCounts, setReaderCounts] = useState<ReaderCount[]>([]);
  const [librariansByHall, setLibrariansByHall] = useState<Librarian[]>([]);

  const [loadingCounts, setLoadingCounts] = useState(false);
  const [loadingLibrarians, setLoadingLibrarians] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const HOST = "http://127.0.0.1:8000";

  useEffect(() => {
    setLoadingCounts(true);
    setError(null);
    fetch(
      `${HOST}/librarians/reader-counts?start_date=${startDate}&end_date=${endDate}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при загрузке данных о выработках");
        return res.json();
      })
      .then((data: ReaderCount[]) => {
        setReaderCounts(data);
        setLoadingCounts(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoadingCounts(false);
      });
  }, [startDate, endDate]);

  useEffect(() => {
    setLoadingLibrarians(true);
    setError(null);
    const params = new URLSearchParams({
      hall_name: hallName,
      library_id: libraryId.toString(),
    });
    fetch(`${HOST}/librarians/librarians/by-hall?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при загрузке библиотекарей по залу");
        return res.json();
      })
      .then((data: Librarian[]) => {
        setLibrariansByHall(data);
        setLoadingLibrarians(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoadingLibrarians(false);
      });
  }, [hallName, libraryId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📚 Библиотекари
      </h1>

      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <label className="flex flex-col">
          Период с:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-1"
          />
        </label>

        <label className="flex flex-col">
          по:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-1"
          />
        </label>

        <label className="flex flex-col">
          Зал:
          <input
            type="text"
            value={hallName}
            onChange={(e) => setHallName(e.target.value)}
            className="border rounded p-1"
          />
        </label>

        <label className="flex flex-col">
          ID библиотеки:
          <input
            type="number"
            value={libraryId}
            onChange={(e) => setLibraryId(Number(e.target.value))}
            className="border rounded p-1"
            min={1}
          />
        </label>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Левая колонка: выработки */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Выработки библиотекарей</h2>
          {loadingCounts ? (
            <p>Загрузка...</p>
          ) : readerCounts.length === 0 ? (
            <p>Данные не найдены.</p>
          ) : (
            <ul className="space-y-2">
              {readerCounts.map(({ id, name, total_readers }) => (
                <li
                  key={id}
                  className="border rounded p-3 bg-white shadow-sm flex justify-between"
                >
                  <span>{name}</span>
                  <span className="font-semibold">{total_readers}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Правая колонка: библиотекари по залу */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Библиотекари по залу</h2>
          {loadingLibrarians ? (
            <p>Загрузка...</p>
          ) : librariansByHall.length === 0 ? (
            <p>Данные не найдены.</p>
          ) : (
            <ul className="space-y-2">
              {librariansByHall.map(({ id, name }) => (
                <li
                  key={id}
                  className="border rounded p-3 bg-white shadow-sm flex justify-between"
                >
                  <span>{name}</span>
                  <span className="text-gray-500">ID: {id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
