import MenuApp from "../components/menu/MenuApp";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SpotForm from "../components/spot/SpotForm";
import AppFooter from "../components/footer/AppFooter";

export default function SpotPage() {
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{"EducadoraGS - Spots"}</title>
                </Helmet>
            </HelmetProvider>

            <MenuApp />
            <SpotForm />
            <AppFooter />
        </div>
    )
}