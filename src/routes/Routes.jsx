import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PageSpot from "../pages/Spot";
import PageEmpresa from "../pages/Empresa";
import LocutorPage from "../pages/Locutor";
import HomePage from "../pages/Home";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/spots" element={<PageSpot />} />
                <Route path="/empresa" element={<PageEmpresa />} />
                <Route path="/locutor" element={<LocutorPage />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;