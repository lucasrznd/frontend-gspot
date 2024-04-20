import { Panel } from 'primereact/panel';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import ModalDelete from '../ModalDelete';
import { formatarParaUppercase, formatarTelefone } from '../../functions/Formatacao';

export default function TableLocutor(props) {
    const [deleteLocutorDialog, setDeleteLocutorDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const deletarLocutor = async () => {
        setDeleteLocutorDialog(false);
        console.log('Locutor deletado');
    }

    const confirmDeleteLocutor = (locutor) => {
        props.setLocutor({ ...locutor });
        setDeleteLocutorDialog(true);
    };

    const hideDeleteLocutorDialog = () => {
        setDeleteLocutorDialog(false);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Locutores</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );

    const acoesTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded onClick={() => props.detalhesLocutor(rowData)} />
                <span style={{ marginBottom: "1rem", marginLeft: "5px", marginRight: "5px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteLocutor(rowData)} />
            </React.Fragment>
        );
    };

    const deleteLocutorFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteLocutorDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarLocutor} />
        </React.Fragment>
    );

    return (
        <div>
            <Panel>
                <Toolbar style={{ marginBottom: "10px" }} start={props.conteudoInicial} />

                <div className="card">
                    <DataTable value={props.locutores} tableStyle={{ minWidth: '50rem' }}
                        paginator globalFilter={globalFilter} header={header}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="{first} de {last} de {totalRecords} locutores"
                        rows={5} emptyMessage="Nenhum locutor encontrado." key="codigo">
                        <Column field="codigo" header="Código" align="center" alignHeader="center"></Column>
                        <Column field="nome" body={(rowData) => formatarParaUppercase(rowData, "nome")} header="Nome" align="center" alignHeader="center"></Column>
                        <Column field="telefone" body={(rowData) => formatarTelefone(rowData)} header="Telefone" align="center" alignHeader="center"></Column>
                        <Column body={acoesTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                    </DataTable>
                </div>
            </Panel>

            <ModalDelete deleteObjetoDialog={deleteLocutorDialog} deleteObjetoFooter={deleteLocutorFooter}
                hideDeleteObjetoDialog={hideDeleteLocutorDialog} objeto={props.locutor} />
        </div>
    )

}