import { useState } from "react";
import MenuApp from "../components/MenuApp";
import FormLocutor from "../components/locutor/FormLocutor";
import { LocutorModel } from "../models/LocutorModel";
import Rodape from "../components/Rodape";

export default function PageLocutor() {
    const [locutor, setLocutor] = useState(new LocutorModel());
    const [locutores, setLocutores] = useState([
        { codigo: 1, nome: "Reginaldo Serra", telefone: "43999999999" },
        { codigo: 2, nome: "Paulo Netto", telefone: "43999999999" },
        { codigo: 3, nome: "Cristiano Soares", telefone: "43999999999" },
        { codigo: 4, nome: "Marcia Soria", telefone: "43999999999" },
        { codigo: 5, nome: "Joao Teodoro", telefone: "43999999999" },
        { codigo: 6, nome: "Nelson Cardoso", telefone: "43999999999" }
    ]);

    return (
        <div>
            <MenuApp />
            <FormLocutor locutor={locutor} setLocutor={setLocutor} locutores={locutores} />
            <Rodape />
        </div>
    )
}