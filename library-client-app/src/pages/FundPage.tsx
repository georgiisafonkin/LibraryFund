import { useEffect, useState } from "react";

interface Operation {
  title: string;
  operation_type: string;
  date: string;
}

interface UnreturnedTitle {
  title: string;
}

export default function FundPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const [shelfId, setShelfId] = useState(1);
  const [unreturnedTitles, setUnreturnedTitles] = useState<UnreturnedTitle[]>([]);

  const fetchOperations = () => {
    fetch(`http://127.0.0.1:8000/literature/inventory/operations?start_date=${startDate}&end_date=${endDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOperations(data);
        } else {
          console.error("Invalid operations data:", data);
          setOperations([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch operations:", error);
        setOperations([]);
      });
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/literature/unreturned-titles-by-shelf?shelf_id=${shelfId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUnreturnedTitles(data);
        } else {
          console.error("Invalid unreturned titles data:", data);
          setUnreturnedTitles([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch unreturned titles:", error);
        setUnreturnedTitles([]);
      });
  }, [shelfId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">📚 Учёт фонда</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Операции */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Операции с фондом</h2>

          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Дата начала:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-48"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Дата окончания:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-48"
              />
            </div>

            <button
              onClick={fetchOperations}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md mt-2 md:mt-0"
            >
              🔍 Показать
            </button>
          </div>

          <div className="space-y-3">
            {operations.length > 0 ? (
              operations.map((op, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow-sm bg-white"
                >
                  <div className="font-semibold text-lg">{op.title}</div>
                  <div className="text-sm text-gray-600">
                    {op.operation_type} — {new Date(op.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">Нет данных об операциях</div>
            )}
          </div>
        </div>

        {/* Невозвращённые издания */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Невозвращённые издания по полке</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">ID полки:</label>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded-md w-32"
              value={shelfId}
              onChange={(e) => setShelfId(Number(e.target.value))}
            />
          </div>

          {unreturnedTitles.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {unreturnedTitles.map((item, index) => (
                <li key={index} className="text-gray-800">{item.title}</li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 italic">Нет невозвращённых изданий</div>
          )}
        </div>
      </div>
    </div>
  );
}
