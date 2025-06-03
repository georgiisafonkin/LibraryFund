import { useState } from "react";
import type { Schoolboy } from "../types/readers";

export function ReaderSchoolboyEditForm({
  reader,
  onSave,
  onCancel,
}: {
  reader: Schoolboy;
  onSave: (r: Schoolboy) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(reader.name);
  const [birth_date, setBirthDate] = useState(reader.birth_date);
  const [library_id, setLibraryId] = useState(reader.library_id);
  const [school_addr, setSchoolAddr] = useState(reader.school_addr);
  const [school_class, setSchoolClass] = useState(reader.school_class);

  const handleSubmit = () => {
    onSave({
      ...reader,
      name,
      birth_date,
      library_id,
      school_addr,
      school_class,
    });
  };

  return (
    <div className="space-y-4">
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
          className="border p-1 rounded ml-2"
          type="date"
          value={birth_date.toISOString().slice(0, 10)}
          onChange={(e) => setBirthDate(new Date(e.target.value))}
        />
      </div>

      <div>
        <label>Библиотека:</label>
        <input
          className="border p-1 rounded ml-2"
          type="number"
          value={library_id}
          onChange={(e) => setLibraryId(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Адрес школы:</label>
        <input
          className="border p-1 rounded ml-2"
          value={school_addr}
          onChange={(e) => setSchoolAddr(e.target.value)}
        />
      </div>

      <div>
        <label>Класс:</label>
        <input
          className="border p-1 rounded ml-2"
          value={school_class}
          onChange={(e) => setSchoolClass(Number(e.target.value))}
        />
      </div>

      <div className="space-x-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Сохранить
        </button>
        <button onClick={onCancel} className="bg-gray-300 px-3 py-1 rounded">
          Отмена
        </button>
      </div>
    </div>
  );
}
