import MenuApp from "../components/MenuApp";
import Rodape from "../components/Rodape";
import FormEmpresa from "../components/empresa/FormEmpresa";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function EmpresaPage() {
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{"EducadoraGS - Empresas"}</title>
                </Helmet>
            </HelmetProvider>

            <MenuApp />
            <FormEmpresa />
            <Rodape />
        </div>
    )
}