import MenuApp from "../components/MenuApp";
import { Helmet, HelmetProvider } from "react-helmet-async";
import FormSpot from "../components/spots/FormSpot";
import Rodape from "../components/Rodape";

export default function PageSpot() {
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{"EducadoraGS - Spots"}</title>
                </Helmet>
            </HelmetProvider>

            <MenuApp />
            <FormSpot />
            <Rodape />
        </div>
    )
}