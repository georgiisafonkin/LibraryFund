import { useEffect, useState } from "react";
import type { Student } from "../types/readers";
import { useStudents } from "../hooks/readers";
import { ReaderStudentEditForm } from "../components/ReaderStudentEditForm";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function ReadersPage() {
  const [filter, setFilter] = useState("");
  const HOST = "http://127.0.0.1:8000/";
  const service = "students";
  const { readers, loading, error, refetch } = useStudents(HOST, service);

  const [editingReader, setEditingReader] = useState<Student | null>(null);
  const [creatingNewReader, setCreatingNewReader] = useState(false);
  const [localReaders, setLocalReaders] = useState<Student[]>([]);

  useEffect(() => {
    if (readers.length > 0) setLocalReaders(readers);
  }, [readers]);

  const createReader = async (newReader: Student) => {
    try {
      const params = new URLSearchParams({
        name: newReader.name,
        birth_date: newReader.birth_date.toISOString().slice(0, 10),
        library_id: newReader.library_id.toString(),
        university: newReader.university,
        faculty: newReader.faculty,
        course: newReader.course.toString(),
        group_number: newReader.group_number.toString(),
      });

      const url = `${HOST}readers/student?${params.toString()}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: "",
      });

      if (!res.ok) throw new Error("Ошибка при создании");

      await refetch();
      setCreatingNewReader(false);
    } catch (e) {
      alert(`Ошибка: ${(e as Error).message}`);
    }
  };

  const saveReader = async (updatedReader: Student) => {
    try {
      const params = new URLSearchParams({
        name: updatedReader.name,
        birth_date: updatedReader.birth_date.toISOString().slice(0, 10),
        university: updatedReader.university,
        faculty: updatedReader.faculty,
        course: updatedReader.course,
        group_number: updatedReader.group_number.toString(),
      });

      const url = `${HOST}readers/students/${updatedReader.id}?${params.toString()}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Ошибка при сохранении");

      setLocalReaders((prev) =>
        prev.map((r) => (r.id === updatedReader.id ? updatedReader : r))
      );
      setEditingReader(null);
    } catch (e) {
      alert(`Ошибка: ${(e as Error).message}`);
    }
  };

  const deleteReader = async (id: number) => {
    if (!confirm("Удалить этого читателя?")) return;

    try {
      const res = await fetch(`${HOST}readers/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Ошибка при удалении");

      await refetch();
    } catch (e) {
      alert(`Ошибка: ${(e as Error).message}`);
    }
  };

  const filteredReaders = localReaders.filter((r) => {
    if (!r || !r.name) return false;
    const filterLower = filter.toLowerCase();
    return (
      r.name.toLowerCase().includes(filterLower) ||
      r.university.toLowerCase().includes(filterLower) ||
      r.faculty.toLowerCase().includes(filterLower) ||
      r.course.toLowerCase().includes(filterLower) ||
      String(r.group_number).toLowerCase().includes(filterLower)
    );
  });

  if (editingReader) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Редактирование читателя</h1>
        <ReaderStudentEditForm
          reader={editingReader}
          onSave={saveReader}
          onCancel={() => setEditingReader(null)}
        />
      </div>
    );
  }

  if (creatingNewReader) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Новый читатель</h1>
        <ReaderStudentEditForm
          reader={{
            id: 0,
            name: "",
            birth_date: new Date(),
            library_id: 1,
            university: "",
            faculty: "",
            course: "",
            group_number: 0,
            attributes: {},
          }}
          onSave={createReader}
          onCancel={() => setCreatingNewReader(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Студенты</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по имени, ВУЗу, факультету..."
          className="border p-2 rounded w-full md:max-w-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => setCreatingNewReader(true)}
        >
          <FaPlus /> Добавить студента
        </button>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-600">Ошибка: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredReaders.length === 0 && <p className="text-gray-500">Нет совпадений.</p>}

          {filteredReaders.map((reader) => (
            <div key={reader.id} className="p-4 bg-white rounded-lg shadow relative border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{reader.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingReader(reader)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Редактировать"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteReader(reader.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Удалить"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>id:</strong> {reader.id}</li>
                <li><strong>Библиотека:</strong> {reader.library_id}</li>
                <li><strong>ВУЗ:</strong> {reader.university}</li>
                <li><strong>Факультет:</strong> {reader.faculty}</li>
                <li><strong>Курс:</strong> {reader.course}</li>
                <li><strong>Группа:</strong> {reader.group_number}</li>
                <li><strong>Дата рождения:</strong> {reader.birth_date instanceof Date
                  ? reader.birth_date.toLocaleDateString()
                  : String(reader.birth_date)}</li>
              </ul>

              {reader.attributes && Object.entries(reader.attributes).length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  <strong>Дополнительно:</strong>
                  <ul className="pl-4 list-disc">
                    {Object.entries(reader.attributes).map(([key, value]) => (
                      <li key={key}><strong>{key}:</strong> {String(value)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
