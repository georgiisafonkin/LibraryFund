import { useState } from "react";
import type { Scientist } from "../types/readers";

export function ReaderScientistEditForm({
  reader,
  onSave,
  onCancel,
}: {
  reader: Scientist;
  onSave: (r: Scientist) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(reader.name);
  const [birth_date, setBirthDate] = useState(reader.birth_date);
  const [library_id, setLibraryId] = useState(reader.library_id);
  const [research_topic, setResearchTopic] = useState(reader.research_topic);
  const [organization, setOrganization] = useState(reader.organization);
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
      research_topic,
      organization,
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
        <label>Научная область:</label>
        <input
          className="border p-1 rounded ml-2"
          value={research_topic}
          onChange={(e) => setResearchTopic(e.target.value)}
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
