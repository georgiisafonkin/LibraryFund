import { useState } from "react";

interface Reader {
  id?: number;
  name: string;
  birth_date?: string;
  library_id?: number;
  title?: string;
}

const ITEMS_PER_PAGE = 6;

const usePaginated = (readers: Reader[]) => {
  const [page, setPage] = useState(1);
  const maxPage = Math.ceil(readers.length / ITEMS_PER_PAGE);

  const currentItems = readers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const nextPage = () => setPage((p) => Math.min(p + 1, maxPage));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const resetPage = () => setPage(1);

  return { page, maxPage, currentItems, nextPage, prevPage, resetPage };
};

export default function QueriesPage() {
  const [overdueReaders, setOverdueReaders] = useState<Reader[]>([]);
  const [noVisitReaders, setNoVisitReaders] = useState<Reader[]>([]);
  const [librarianReaders, setLibrarianReaders] = useState<Reader[]>([]);
  const [editionLoans, setEditionLoans] = useState<Reader[]>([]);

  const overduePaginate = usePaginated(overdueReaders);
  const noVisitPaginate = usePaginated(noVisitReaders);
  const librarianPaginate = usePaginated(librarianReaders);
  const editionPaginate = usePaginated(editionLoans);

  const [visitStart, setVisitStart] = useState("2020-01-01");
  const [visitEnd, setVisitEnd] = useState("2024-01-01");

  const [librarianId, setLibrarianId] = useState(1);
  const [libStart, setLibStart] = useState("2020-01-01");
  const [libEnd, setLibEnd] = useState("2024-01-01");

  const [workTitle, setWorkTitle] = useState("Хоббит");
  const [workStart, setWorkStart] = useState("2020-01-01");
  const [workEnd, setWorkEnd] = useState("2030-01-01");

  const fetchOverdue = async () => {
    const res = await fetch("http://127.0.0.1:8000/readers/overdue");
    const data = await res.json();
    setOverdueReaders(data);
    overduePaginate.resetPage();
  };

  const fetchNoVisits = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/readers/no-visits?start_date=${visitStart}&end_date=${visitEnd}`
    );
    const data = await res.json();
    setNoVisitReaders(data);
    noVisitPaginate.resetPage();
  };

  const fetchReadersByLibrarian = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/readers/readers-by-librarian?librarian_id=${librarianId}&start_date=${libStart}&end_date=${libEnd}`
    );
    const data = await res.json();
    setLibrarianReaders(data);
    librarianPaginate.resetPage();
  };

  const fetchEditionLoans = async () => {
    const encodedTitle = encodeURIComponent(workTitle);
    const res = await fetch(
      `http://127.0.0.1:8000/readers/edition-loans-by-work-and-date?title=${encodedTitle}&start_date=${workStart}&end_date=${workEnd}`
    );
    const data = await res.json();
    setEditionLoans(data);
    editionPaginate.resetPage();
  };

  const renderReaderCards = (
    paginate: ReturnType<typeof usePaginated>
  ) => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {paginate.currentItems.map((r, idx) => (
          <div key={idx} className="bg-gray-50 border rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold">{r.name}</h3>
            {r.birth_date && (
              <p className="text-sm text-gray-600">
                Дата рождения: {new Date(r.birth_date).toLocaleDateString()}
              </p>
            )}
            {r.library_id && (
              <p className="text-sm text-gray-600">Библиотека: #{r.library_id}</p>
            )}
            {r.title && (
              <p className="text-sm text-gray-700 mt-2 font-medium">📘 {r.title}</p>
            )}
          </div>
        ))}
      </div>
      {paginate.maxPage > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={paginate.prevPage}
            disabled={paginate.page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ← Назад
          </button>
          <span className="px-4 py-2">
            Стр. {paginate.page} из {paginate.maxPage}
          </span>
          <button
            onClick={paginate.nextPage}
            disabled={paginate.page === paginate.maxPage}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Вперёд →
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">🔎 Запросы по читателям</h1>
      <div className="space-y-12">

        {/* Просрочка */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📅 Читатели с просроченными изданиями</h2>
            <button
              onClick={fetchOverdue}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Показать
            </button>
          </div>
          {renderReaderCards(overduePaginate)}
        </section>

        {/* Не посещали */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="text-xl font-semibold">🚫 Не посещали библиотеку</h2>
            <div className="flex gap-2 items-end flex-wrap">
              <div>
                <label className="block text-sm">С:</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={visitStart}
                  onChange={(e) => setVisitStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm">По:</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={visitEnd}
                  onChange={(e) => setVisitEnd(e.target.value)}
                />
              </div>
              <button
                onClick={fetchNoVisits}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Показать
              </button>
            </div>
          </div>
          {renderReaderCards(noVisitPaginate)}
        </section>

        {/* По библиотекарю */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="text-xl font-semibold">👩‍🏫 Обслуженные библиотекарем</h2>
            <div className="flex gap-2 items-end flex-wrap">
              <div>
                <label className="block text-sm">ID библиотекаря:</label>
                <input
                  type="number"
                  className="border p-2 rounded w-24"
                  value={librarianId}
                  onChange={(e) => setLibrarianId(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm">С:</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={libStart}
                  onChange={(e) => setLibStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm">По:</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={libEnd}
                  onChange={(e) => setLibEnd(e.target.value)}
                />
              </div>
              <button
                onClick={fetchReadersByLibrarian}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Показать
              </button>
            </div>
          </div>
          {renderReaderCards(librarianPaginate)}
        </section>

        {/* По произведению */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="text-xl font-semibold">📘 Читатели, получившие произведение</h2>
            <div className="flex gap-2 items-end flex-wrap">
              <div>
                <label className="block text-sm">Произведение:</label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm">С:</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm">По:</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                />
              </div>
              <button
                onClick={fetchEditionLoans}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Показать
              </button>
            </div>
          </div>
          {renderReaderCards(editionPaginate)}
        </section>

      </div>
    </div>
  );
}
