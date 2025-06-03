import { useState } from "react";
import type { Worker } from "../types/readers";

interface Props {
  reader: Worker;
  onSave: (r: Worker) => void;
  onCancel: () => void;
}

export function ReaderWorkerEditForm({ reader, onSave, onCancel }: Props) {
  const [name, setName] = useState(reader.name);
  const [birth_date, setBirthDate] = useState(reader.birth_date);
  const [library_id, setLibraryId] = useState(reader.library_id);
  const [organization, setOrganization] = useState(reader.organization);
  const [position, setPosition] = useState(reader.position);

  const handleSubmit = () => {
    onSave({
      ...reader,
      name,
      birth_date,
      library_id,
      organization,
      position,
    });
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label>Имя:</label>
        <input
          className="border p-1 rounded ml-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Дата рождения:</label>
        <input
          type="date"
          className="border p-1 rounded ml-2"
          value={birth_date.toISOString().slice(0, 10)}
          onChange={(e) => setBirthDate(new Date(e.target.value))}
        />
      </div>

      <div>
        <label>Библиотека:</label>
        <input
          type="number"
          className="border p-1 rounded ml-2"
          value={library_id}
          onChange={(e) => setLibraryId(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Организация:</label>
        <input
          className="border p-1 rounded ml-2"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </div>

      <div>
        <label>Должность:</label>
        <input
          className="border p-1 rounded ml-2"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>

      <div className="space-x-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Сохранить
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
