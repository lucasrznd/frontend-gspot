import MenuApp from "../components/menu/MenuApp";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CompanyForm from "../components/company/CompanyForm";
import AppFooter from "../components/footer/AppFooter";

export default function CompanyPage() {
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{"EducadoraGS - Empresas"}</title>
                </Helmet>
            </HelmetProvider>

            <MenuApp />
            <CompanyForm />
            <AppFooter />
        </div>
    )
}