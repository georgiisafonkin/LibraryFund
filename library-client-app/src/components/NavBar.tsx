import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "🏠 Главная" },
  { to: "/students", label: "🎓 Студенты" },
  { to: "/scientists", label: "🔬 Учёные" },
  { to: "/teachers", label: "📚 Учителя" },
  { to: "/workers", label: "🛠 Работники" },
  { to: "/schoolboys", label: "🏫 Школьники" },
  { to: "/retirees", label: "👴 Пенсионеры" },
  { to: "/fund", label: "📦 Фонд" },
  { to: "/staff", label: "👥 Сотрудники" },
  { to: "/works", label: "📘 Произведения" },
  { to: "/queries", label: "🔍 Другое" },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md px-6 py-4 overflow-x-auto">
      <ul className="flex space-x-12 whitespace-nowrap text-lg font-medium text-blue-700">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`px-5 py-2 rounded-xl transition-colors ${
                  isActive ? "bg-blue-100 text-blue-900" : "hover:bg-blue-50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
