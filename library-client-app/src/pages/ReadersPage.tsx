import { useState } from "react";

export default function ReadersPage() {
  const [filter, setFilter] = useState("");
  const [readers] = useState([
    { id: 1, name: "Иванов Иван", category: "Студент", attributes: { вуз: "МГУ", факультет: "Физика" } },
    { id: 2, name: "Петрова Анна", category: "Научный работник", attributes: { организация: "НИИ Химии" } },
  ]);

  const filteredReaders = readers.filter((r) =>
    r.name.toLowerCase().includes(filter.toLowerCase()) ||
    Object.values(r.attributes).some((attr) => attr.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Читатели</h1>
      <input
        type="text"
        placeholder="Поиск по имени, ВУЗу, организации..."
        className="border p-2 rounded w-full max-w-md mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="space-y-4">
        {filteredReaders.map((reader) => (
          <div key={reader.id} className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-medium">{reader.name}</h2>
            <p className="text-sm text-gray-600">Категория: {reader.category}</p>
            <ul className="text-sm text-gray-500 mt-1">
              {Object.entries(reader.attributes).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filteredReaders.length === 0 && <p className="text-gray-500">Нет совпадений.</p>}
      </div>
    </div>
  );
}
