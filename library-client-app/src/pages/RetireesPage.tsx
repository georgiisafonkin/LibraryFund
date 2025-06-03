import { useEffect, useState } from "react";
import type { Retiree } from "../types/readers";
import { useRetirees } from "../hooks/useRetirees";
import { ReaderRetireeEditForm } from "../components/ReaderRetireeEditForm";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function RetireesPage() {
  const HOST = "http://127.0.0.1:8000/";
  const service = "readers/retirees";
  const { retirees, loading, error, refetch } = useRetirees();

  const [filter, setFilter] = useState("");
  const [editingRetiree, setEditingRetiree] = useState<Retiree | null>(null);
  const [creatingNewRetiree, setCreatingNewRetiree] = useState(false);
  const [localRetirees, setLocalRetirees] = useState<Retiree[]>([]);

  useEffect(() => {
    if (retirees.length > 0) {
      setLocalRetirees(retirees);
    }
  }, [retirees]);

  const createRetiree = async (newRetiree: Retiree) => {
    try {
      const params = new URLSearchParams({
        name: newRetiree.name,
        birth_date: newRetiree.birth_date.toISOString().slice(0, 10),
        library_id: newRetiree.library_id.toString(),
        organization: newRetiree.organization,
        experience: newRetiree.experience.toString(),
      });

      const url = `${HOST}readers/retiree?${params.toString()}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: "",
      });

      if (!res.ok) throw new Error("Ошибка при создании");

      await refetch();
      setCreatingNewRetiree(false);
    } catch (e) {
      alert(`Ошибка: ${(e as Error).message}`);
    }
  };

  const saveRetiree = async (updatedRetiree: Retiree) => {
    try {
      const params = new URLSearchParams({
        name: updatedRetiree.name,
        birth_date: updatedRetiree.birth_date.toISOString().slice(0, 10),
        organization: updatedRetiree.organization,
        experience: updatedRetiree.experience.toString(),
      });

      const url = `${HOST}readers/retirees/${updatedRetiree.id}?${params.toString()}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Ошибка при сохранении");

      setLocalRetirees((prev) =>
        prev.map((r) => (r.id === updatedRetiree.id ? updatedRetiree : r))
      );
      setEditingRetiree(null);
    } catch (e) {
      alert(`Ошибка: ${(e as Error).message}`);
    }
  };

  const deleteRetiree = async (id: number) => {
    if (!confirm("Удалить этого пенсионера?")) return;

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

  const filteredRetirees = localRetirees.filter((r) => {
    if (!r || !r.name) return false;
    const filterLower = filter.toLowerCase();
    return (
      r.name.toLowerCase().includes(filterLower) ||
      r.organization.toLowerCase().includes(filterLower)
    );
  });

  if (editingRetiree) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Редактирование пенсионера</h1>
        <ReaderRetireeEditForm
          reader={editingRetiree}
          onSave={saveRetiree}
          onCancel={() => setEditingRetiree(null)}
        />
      </div>
    );
  }

  if (creatingNewRetiree) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Новый пенсионер</h1>
        <ReaderRetireeEditForm
          reader={{
            id: 0,
            name: "",
            birth_date: new Date(),
            library_id: 1,
            organization: "",
            experience: 0,
            attributes: {},
          }}
          onSave={createRetiree}
          onCancel={() => setCreatingNewRetiree(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🧓 Пенсионеры</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по имени или организации..."
          className="border p-2 rounded w-full md:max-w-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => setCreatingNewRetiree(true)}
        >
          <FaPlus /> Добавить пенсионера
        </button>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-600">Ошибка: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRetirees.length === 0 && (
            <p className="text-gray-500">Нет совпадений.</p>
          )}

          {filteredRetirees.map((retiree) => (
            <div
              key={retiree.id}
              className="p-4 bg-white rounded-lg shadow border border-gray-200 relative"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{retiree.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingRetiree(retiree)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Редактировать"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteRetiree(retiree.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Удалить"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>id:</strong> {retiree.id}</li>
                <li><strong>Дата рождения:</strong> {retiree.birth_date.toISOString().slice(0, 10)}</li>
                <li><strong>Библиотека:</strong> {retiree.library_id}</li>
                <li><strong>Организация:</strong> {retiree.organization}</li>
                <li><strong>Опыт:</strong> {retiree.experience} лет</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
