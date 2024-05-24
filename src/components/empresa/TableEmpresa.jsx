import { Panel } from 'primereact/panel';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import DeleteDialog from '../DeleteDialog';
import { formatarParaUppercase, formatarTelefone } from '../../functions/Formatacao';
import { useEmpresaDelete } from '../../hooks/empresa/useEmpresaDelete';
import { msgAviso, msgErro } from '../../functions/Mensagens';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEmpresaData } from '../../hooks/empresa/useEmpresaData';
import ImageDialog from '../ImageDialog';

export default function TableEmpresa(props) {
    const [empresa, setEmpresa] = useState({});
    const [imageVisible, setImageVisible] = useState(false);
    const [deleteEmpresaDialog, setDeleteEmpresaDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const { data, isLoading, isError: isFetchError } = useEmpresaData();
    const { mutate, isSuccess, isError } = useEmpresaDelete();

    const deleteEmpresa = () => {
        mutate(empresa.id);

        if (isError) {
            msgErro(toast, 'Erro ao remover empresa.');
        } else {
            msgAviso(toast, 'Empresa removida com sucesso.');
        }
    }

    useEffect(() => {
        closeModal();
    }, [isSuccess]);

    const confirmDeleteEmpresa = (empresa) => {
        setEmpresa({ ...empresa });
        setDeleteEmpresaDialog(true);
    };

    const closeModal = () => {
        setDeleteEmpresaDialog(false);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Empresas</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );

    const tableActions = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded onClick={() => props.empresaDetails(rowData)} />
                <span style={{ marginBottom: "1rem", marginLeft: "5px", marginRight: "5px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteEmpresa(rowData)} />
            </React.Fragment>
        );
    };

    const imageBody = (rowData) => {
        // if (rowData.image === '') {
        //     rowData.image = 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png';
        // }

        return <>
            {/* <img src={rowData.image} alt="Imagem do Empresa" onClick={(e) => openTableImageDialog(e.target.currentSrc)} className='shadow-4 cursor-pointer border-circle' width='80px' height='80px' /> */}
            <Avatar icon="pi pi-building" image={rowData.urlImage} onClick={(e) => openTableImageDialog(e.target.currentSrc)} size="xlarge" className="mr-2 shadow-4" shape="circle" />
        </>
    };

    const imageTableHeader = () => {
        return <div className='flex align-items-center'>
            <p className='mr-1'>Imagem</p>
            <Tag severity='secondary' value="Novo"></Tag>
        </div>
    }

    const openTableImageDialog = (rowData) => {
        setEmpresa({ ...empresa, urlImage: rowData });
        rowData !== undefined ? setImageVisible(true) : setImageVisible(false)
    }

    const closeTableImageDialog = () => {
        setImageVisible(false);
    }

    return (
        <div>
            <Toast ref={toast} />
            <Panel>
                <Toolbar style={{ marginBottom: "10px" }} start={props.startContent} />

                {isLoading && <ProgressSpinner />}
                {isFetchError && msgErro(toast, 'Erro ao carregar empresas.')}

                <div className="card">
                    <DataTable value={data} tableStyle={{ minWidth: '50rem' }}
                        paginator globalFilter={globalFilter} header={header}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="{first} de {last} de {totalRecords} empresas"
                        rows={5} emptyMessage="Nenhum empresa encontrado." key="id">
                        <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                        <Column field="nome" body={(rowData) => formatarParaUppercase(rowData, "nome")} header="Nome" align="center" alignHeader="center"></Column>
                        <Column field="telefone" body={(rowData) => formatarTelefone(rowData, 'telefone')} header="Telefone" align="center" alignHeader="center"></Column>
                        <Column field="urlImage" body={imageBody} header={imageTableHeader} align="center" alignHeader="center"></Column>
                        <Column body={tableActions} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                    </DataTable>
                </div>
            </Panel>

            <ImageDialog visible={imageVisible} onHide={closeTableImageDialog} header="Imagem da Empresa" src={empresa.urlImage} />

            <DeleteDialog deleteObjectDialog={deleteEmpresaDialog} hideDeleteDialog={closeModal} deleteObject={deleteEmpresa}
                hideDeleteObjectDialog={closeModal} object={empresa} />
        </div>
    )

}