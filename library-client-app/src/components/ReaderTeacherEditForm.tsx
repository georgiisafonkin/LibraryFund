import { useState } from "react";
import type { Teacher } from "../types/readers";

export function ReaderTeacherEditForm({
  reader,
  onSave,
  onCancel,
}: {
  reader: Teacher;
  onSave: (r: Teacher) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(reader.name);
  const [birth_date, setBirthDate] = useState(reader.birth_date);
  const [library_id, setLibraryId] = useState(reader.library_id);
  const [subject, setSubject] = useState(reader.subject);
  const [school_addr, setSchoolAddr] = useState(reader.school_addr);
  const [attributes, setAttributes] = useState(reader.attributes || {});

  const handleAttrChange = (key: string, value: string) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...reader,
      name,
      birth_date,
      library_id,
      subject,
      school_addr,
      attributes,
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
        <label>Библиотека: </label>
        <input
          className="border p-1 rounded ml-2"
          type="number"
          value={library_id}
          onChange={(e) => setLibraryId(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Предмет:</label>
        <input
          className="border p-1 rounded ml-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
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

      {Object.entries(attributes).map(([key, value]) => (
        <div key={key}>
          <label>{key}:</label>
          <input
            className="border p-1 rounded ml-2"
            value={String(value)}
            onChange={(e) => handleAttrChange(key, e.target.value)}
          />
        </div>
      ))}

      <div className="space-x-2">
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-3 py-1 rounded">
          Сохранить
        </button>
        <button onClick={onCancel} className="bg-gray-300 px-3 py-1 rounded">
          Отмена
        </button>
      </div>
    </div>
  );
}
