import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PageSpot from "../pages/Spot";
import EmpresaPage from "../pages/Empresa";
import LocutorPage from "../pages/Locutor";
import HomePage from "../pages/Home";
import NotFoundPage from "../pages/NotFound";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/spots" element={<PageSpot />} />
                <Route path="/empresa" element={<EmpresaPage />} />
                <Route path="/locutor" element={<LocutorPage />} />
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;