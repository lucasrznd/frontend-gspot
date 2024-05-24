import MenuApp from "../components/menu/MenuApp";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AnnouncerForm from "../components/announcer/AnnouncerForm";
import AppFooter from "../components/footer/AppFooter";

export default function AnnouncerPage() {
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{"EducadoraGS - Locutores"}</title>
                </Helmet>
            </HelmetProvider>

            <MenuApp />
            <AnnouncerForm />
            <AppFooter />
        </div>
    )
}