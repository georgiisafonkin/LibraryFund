import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import ReadersPage from "./pages/ReadersPage";
import FundPage from "./pages/FundPage";
import StaffPage from "./pages/StaffPage";
import WorksPage from "./pages/WorksPage";
import QueriesPage from "./pages/QueriesPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <NavBar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/readers" element={<ReadersPage />} />
          <Route path="/fund" element={<FundPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/queries" element={<QueriesPage />} />
        </Routes>
      </div>
    </Router>
  );
}
