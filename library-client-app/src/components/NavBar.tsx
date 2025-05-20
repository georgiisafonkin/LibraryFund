import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex gap-4 text-blue-600">
      <Link to="/">Главная</Link>
      <Link to="/readers">Читатели</Link>
      <Link to="/fund">Фонд</Link>
      <Link to="/staff">Сотрудники</Link>
      <Link to="/works">Произведения</Link>
      <Link to="/queries">Запросы</Link>
    </nav>
  );
}
