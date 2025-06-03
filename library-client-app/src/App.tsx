import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import FundPage from "./pages/FundPage";
import StaffPage from "./pages/StaffPage";
import WorksPage from "./pages/WorksPage";
import QueriesPage from "./pages/QueriesPage";
import ScientistsPage from "./pages/ScientistsPage";
import TeachersPage from "./pages/TeachersPage";
import SchoolboyPage from "./pages/SchoolboyPage";
import WorkerPage from "./pages/WorkerPage";
import RetireesPage from "./pages/RetireesPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <NavBar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/fund" element={<FundPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/queries" element={<QueriesPage />} />
          <Route path="/scientists" element={<ScientistsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/schoolboys" element={<SchoolboyPage />} />
          <Route path="/workers" element={<WorkerPage />} />
          <Route path="/retirees" element={<RetireesPage />} />
        </Routes>
      </div>
    </Router>
  );
}
