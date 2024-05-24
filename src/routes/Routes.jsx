import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import NotFoundPage from "../pages/NotFound";
import CompanyPage from "../pages/Company";
import AnnouncerPage from "../pages/Announcer";
import SpotPage from "../pages/Spot";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/spot" element={<SpotPage />} />
                <Route path="/empresa" element={<CompanyPage />} />
                <Route path="/locutor" element={<AnnouncerPage />} />
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;