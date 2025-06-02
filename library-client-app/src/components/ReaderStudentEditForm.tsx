import { useState } from "react";
import type { Student } from "../types/readers";

export function ReaderStudentEditForm({
  reader,
  onSave,
  onCancel,
}: {
  reader: Student;
  onSave: (r: Student) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(reader.name);
  const [birth_date, setBirthDate] = useState(reader.birth_date)
  const [library_id, setLibId] = useState(reader.library_id)
  const [university, setUniversity] = useState(reader.university)
  const [faculty, setFaculty] = useState(reader.faculty)
  const [course, setCourse] = useState(reader.course)
  const [group_number, setGroupNumber] = useState(reader.group_number)

  const [attributes, setAttributes] = useState(reader.attributes);

  const handleAttrChange = (key: string, value: string) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...reader,
      name,
      birth_date,
      library_id,
      university,
      faculty,
      course,
      group_number,
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
          value={birth_date.toISOString().slice(0, 10)} // преобразуем Date -> string для input
          onChange={(e) => setBirthDate(new Date(e.target.value))} // string -> Date
        />
      </div>

      <div>
        <label>Библиотека: </label>
        <input
          className="border p-1 rounded ml-2"
          value={library_id}
          onChange={(e) => setLibId(Number(e.target.value))}
        />
      </div>

      <div>
        <label>ВУЗ:</label>
        <input
          className="border p-1 rounded ml-2"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />
      </div>

      <div>
        <label>Факультет:</label>
        <input
          className="border p-1 rounded ml-2"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
        />
      </div>

      <div>
        <label>Курс:</label>
        <input
          className="border p-1 rounded ml-2"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
      </div>

      <div>
        <label>Группа:</label>
        <input
          className="border p-1 rounded ml-2"
          value={group_number}
          onChange={(e) => setGroupNumber(Number(e.target.value))}
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
