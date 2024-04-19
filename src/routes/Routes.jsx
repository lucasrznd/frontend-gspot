import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PageSpot from "../pages/Spot"
import PageEmpresa from "../pages/Empresa"
import PageLocutor from "../pages/Locutor"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PageSpot />} />
                <Route path="/empresa" element={<PageEmpresa />} />
                <Route path="/locutor" element={<PageLocutor />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;