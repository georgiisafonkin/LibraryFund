import { useEffect, useState } from "react";

interface TopLoanedBook {
  title: string;
  loan_count: number;
}

interface BookCopy {
  inventory_number: number;
  title: string;
}

interface LoanedTitle {
  title: string;
}

export default function WorksPage() {
  const [topBooks, setTopBooks] = useState<TopLoanedBook[]>([]);
  const [copiesByAuthor, setCopiesByAuthor] = useState<BookCopy[]>([]);
  const [copiesByTitle, setCopiesByTitle] = useState<BookCopy[]>([]);
  const [loanedByReader, setLoanedByReader] = useState<LoanedTitle[]>([]);

  const [author, setAuthor] = useState("Лев Толстой");
  const [title, setTitle] = useState("Хоббит");
  const [readerId, setReaderId] = useState(21);
  const [startDate, setStartDate] = useState("1990-01-01");
  const [endDate, setEndDate] = useState("2026-01-01");

  const HOST = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${HOST}/literature/works/top-loaned?limit=10`)
      .then((res) => res.json())
      .then(setTopBooks);
  }, []);

  useEffect(() => {
    fetch(`${HOST}/literature/copies/by-author?author_name=${encodeURIComponent(author)}`)
      .then((res) => res.json())
      .then(setCopiesByAuthor);
  }, [author]);

  useEffect(() => {
    fetch(`${HOST}/literature/copies/by-work-title?title=${encodeURIComponent(title)}`)
      .then((res) => res.json())
      .then(setCopiesByTitle);
  }, [title]);

  useEffect(() => {
    fetch(`${HOST}/literature/loaned-editions?reader_id=${readerId}&start_date=${startDate}&end_date=${endDate}`)
      .then((res) => res.json())
      .then(setLoanedByReader);
  }, [readerId, startDate, endDate]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📖 Произведения и издания</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">🔥 Топ-10 популярных книг</h2>
        <ul className="space-y-1">
          {topBooks.map((book, idx) => (
            <li key={idx} className="border p-2 rounded shadow">
              {book.title} — {book.loan_count} выдач
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🔍 Издания по автору</h2>
        <input
          className="border p-1 rounded mb-2"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <ul className="space-y-1">
          {copiesByAuthor.map((copy) => (
            <li key={copy.inventory_number} className="border p-2 rounded shadow">
              №{copy.inventory_number} — {copy.title}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📗 Издания по названию произведения</h2>
        <input
          className="border p-1 rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ul className="space-y-1">
          {copiesByTitle.map((copy) => (
            <li key={copy.inventory_number} className="border p-2 rounded shadow">
              №{copy.inventory_number} — {copy.title}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📚 Издания, выданные читателю</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            type="number"
            className="border p-1 rounded"
            value={readerId}
            onChange={(e) => setReaderId(Number(e.target.value))}
            placeholder="ID читателя"
          />
          <input
            type="date"
            className="border p-1 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-1 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <ul className="space-y-1">
          {loanedByReader.map((item, idx) => (
            <li key={idx} className="border p-2 rounded shadow">
              {item.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
