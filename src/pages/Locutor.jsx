import MenuApp from "../components/MenuApp";
import FormLocutor from "../components/locutor/FormLocutor";
import Rodape from "../components/Rodape";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function LocutorPage() {
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{"EducadoraGS - Locutores"}</title>
                </Helmet>
            </HelmetProvider>

            <MenuApp />
            <FormLocutor />
            <Rodape />
        </div>
    )
}