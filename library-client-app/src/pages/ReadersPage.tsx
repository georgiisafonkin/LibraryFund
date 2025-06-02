import { useEffect, useState } from "react";
import type { Student } from "../types/readers";
import { useReaders } from "../hooks/readers";
import { ReaderStudentEditForm } from "../components/ReaderStudentEditForm"; // Импортируем форму

export default function ReadersPage() {
  const [filter, setFilter] = useState("");
  const HOST = "http://127.0.0.1:8000/";
  const service = "students";
  const { readers, loading, error } = useReaders(HOST, service);

  // Состояние для выбранного читателя для редактирования
  const [editingReader, setEditingReader] = useState<Student | null>(null);
  // Локальная копия списка, чтобы можно было обновлять сразу
  const [localReaders, setLocalReaders] = useState<Student[]>([]);

  // Обновляем локальный список при загрузке данных
  useEffect(() => {
    if (readers.length > 0) setLocalReaders(readers);
  }, [readers]);

  const filteredReaders = localReaders.filter((r) => {
    const filterLower = filter.toLowerCase();
    return (
      r.name.toLowerCase().includes(filterLower) ||
      r.university.toLowerCase().includes(filterLower) ||
      r.faculty.toLowerCase().includes(filterLower) ||
      r.course.toLowerCase().includes(filterLower) ||
      String(r.group_number).toLowerCase().includes(filterLower)
      )
  });

  // Функция для сохранения изменений читателя
  const saveReader = async (updatedReader: Student) => {
    try {
      const params = new URLSearchParams({
        name: updatedReader.name,
        birth_date: updatedReader.birth_date.toISOString().slice(0, 10), // преобразуем Date -> YYYY-MM-DD
        university: updatedReader.university,
        faculty: updatedReader.faculty,
        course: updatedReader.course,
        group_number: updatedReader.group_number.toString(),
      });
  
      const url = `${HOST}readers/students/${updatedReader.id}?${params.toString()}`;
  
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!res.ok) throw new Error("Ошибка при сохранении");
  
      // Обновляем локальный список
      setLocalReaders((prev) =>
        prev.map((r) => (r.id === updatedReader.id ? updatedReader : r))
      );
      setEditingReader(null); // закрываем форму
    } catch (e) {
      alert(`Ошибка: ${(e as Error).message}`);
    }
  };

  if (editingReader) {
    // Показываем форму редактирования, если выбран reader
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Редактирование читателя</h1>
        <ReaderStudentEditForm
          reader={editingReader}
          onSave={saveReader}
          onCancel={() => setEditingReader(null)}
        />
      </div>
    );
  }

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

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-600">Ошибка: {error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredReaders.length === 0 && <p className="text-gray-500">Нет совпадений.</p>}

          {filteredReaders.map((reader) => (
            <div key={reader.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">{reader.name}</h2>
              <button
                className="mb-2 px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => setEditingReader(reader)}
              >
                Редактировать
              </button>
              <ul className="text-sm text-gray-500 mt-1">
                {Object.entries(reader).map(([key, value]) => {
                  if (key === "attributes") return null; // пропускаем здесь

                  const displayValue =
                    value instanceof Date
                      ? value.toLocaleDateString()
                      : typeof value === "object" && value !== null
                      ? JSON.stringify(value)
                      : String(value);

                  return (
                    <li key={key}>
                      <strong>{key}:</strong> {displayValue}
                    </li>
                  );
                })}

                {reader.attributes && Object.entries(reader.attributes).length > 0 && (
                  <>
                    <li>
                      <strong>Attributes:</strong>
                    </li>
                    {Object.entries(reader.attributes).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
