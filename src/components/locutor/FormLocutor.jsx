import React, { useState } from "react";
import { LocutorModel } from "../../models/LocutorModel";
import TableLocutor from "./TableLocutor";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";

export default function FormLocutor(props) {
    const [visualizarModal, setVisualizarModal] = useState(false);

    function novoLocutor() {
        props.setLocutor(new LocutorModel());
        setVisualizarModal(true);
    }

    const salvarLocutorAction = () => {
        setVisualizarModal(false);
    }

    const detalhesLocutor = (locutor) => {
        props.setLocutor({ ...locutor });
        setVisualizarModal(true);
    };

    const fecharModal = () => {
        setVisualizarModal(false);
    }

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoLocutor} />
        </React.Fragment>
    );

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" onClick={salvarLocutorAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharModal} />
        </div>
    );

    return (
        <div>
            <TableLocutor conteudoInicial={conteudoInicial} detalhesLocutor={detalhesLocutor}
                locutor={props.locutor} setLocutor={props.setLocutor} locutores={props.locutores} />

            <Dialog header="Detalhes do Locutor" visible={visualizarModal} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setVisualizarModal(false)}
                footer={rodapeModal} draggable={false}>
                <div className="card p-fluid">
                    <div className="field">
                        <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                        <InputText id="nome" value={props.locutor?.nome} onChange={(e) => props.setLocutor({ ...props.locutor, nome: e.target.value })} />
                    </div>

                    <div className="field">
                        <label htmlFor='telefone' style={{ marginBottom: '0.5rem' }}>Telefone:</label>
                        <InputMask id="telefone" value={props.locutor?.telefone} onChange={(e) => props.setLocutor({ ...props.locutor, telefone: e.target.value })}
                            mask="(99) 9 9999-9999" placeholder="(99) 9 9999-9999" />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}