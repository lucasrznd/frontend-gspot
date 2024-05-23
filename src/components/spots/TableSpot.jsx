import { Panel } from 'primereact/panel';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import DeleteDialog from '../DeleteDialog';
import { formatarData, formatarParaUppercase, formatarPreco } from '../../functions/Formatacao';
import { useSpotDelete } from '../../hooks/spot/useSpotDelete';
import { msgAviso, msgErro } from '../../functions/Mensagens';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSpotData } from '../../hooks/spot/useSpotData';
import ImageDialog from '../ImageDialog';

export default function TableSpot(props) {
    const [spot, setSpot] = useState({});
    const [imageVisible, setImageVisible] = useState(false);
    const [deleteSpotDialog, setDeleteSpotDialog] = useState(false);
    const [globalFilter] = useState(null);
    const toast = useRef(null);
    const { data, isLoading, isError: isFetchError } = useSpotData();
    const { mutate, isSuccess, isError } = useSpotDelete();

    const deleteSpot = () => {
        mutate(spot.id);

        if (isError) {
            msgErro(toast, 'Erro ao remover spot.');
        } else {
            msgAviso(toast, 'Spot removido com sucesso.');
        }
    }

    useEffect(() => {
        closeModal();
    }, [isSuccess]);

    const confirmDeleteSpot = (spot) => {
        setSpot({ ...spot });
        setDeleteSpotDialog(true);
    };

    const closeModal = () => {
        setDeleteSpotDialog(false);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Spots</h4>
        </div>
    );

    const tableActions = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded onClick={() => props.spotDetails(rowData)} />
                <span style={{ marginBottom: "1rem", marginLeft: "5px", marginRight: "5px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteSpot(rowData)} />
            </React.Fragment>
        );
    };

    const imageBodyEmpresa = (rowData) => {
        return <div className='flex align-items-center justify-content-center'>
            {/* <img src={rowData.image} alt="Imagem do Spot" onClick={(e) => openImgDialogLocutor(e.target.currentSrc)} className='shadow-4 cursor-pointer border-circle' width='80px' height='80px' /> */}
            <p className='mr-2'>{rowData.empresa.nome.toUpperCase()}</p>
            <Avatar icon="pi pi-building" image={rowData.empresa.urlImage} onClick={(e) => openImgDialogEmpresa(e.target.currentSrc)} className="mr-2 shadow-4" shape="circle" />
        </div>
    };

    const imageBodyLocutor = (rowData) => {
        return <div className='flex align-items-center justify-content-center'>
            {/* <img src={rowData.image} alt="Imagem do Spot" onClick={(e) => openImgDialogLocutor(e.target.currentSrc)} className='shadow-4 cursor-pointer border-circle' width='80px' height='80px' /> */}
            <p className='mr-2'>{rowData.locutor.nome.toUpperCase()}</p>
            <Avatar icon="pi pi-building" image={rowData.locutor.urlImage} onClick={(e) => openImgDialogLocutor(e.target.currentSrc)} className="shadow-4" shape="circle" />
        </div>
    };

    const openImgDialogEmpresa = (rowData) => {
        setSpot({ ...spot, urlImage: rowData });
        rowData !== undefined ? setImageVisible(true) : setImageVisible(false)
    }

    const openImgDialogLocutor = (rowData) => {
        setSpot({ ...spot, urlImage: rowData });
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
                {isFetchError && msgErro(toast, 'Erro ao carregar spots.')}

                <div className="card">
                    <DataTable value={data} tableStyle={{ minWidth: '50rem' }}
                        paginator globalFilter={globalFilter} header={header}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="{first} de {last} de {totalRecords} spots"
                        rows={5} emptyMessage="Nenhum spot encontrado." key="id">
                        <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                        <Column field="titulo" header="Nome" body={(e) => formatarParaUppercase(e, "titulo")} align="center" alignHeader="center"></Column>
                        <Column field="empresa.nome" header="Empresa" body={(e) => imageBodyEmpresa(e)} align="center" alignHeader="center"></Column>
                        <Column field="locutor.nome" header="Locutor" body={(e) => imageBodyLocutor(e)} align="center" alignHeader="center"></Column>
                        <Column field="data" header="Data" body={(e) => formatarData(e, 'data')} align="center" alignHeader="center"></Column>
                        <Column field="duracao" header="Duração" align="center" alignHeader="center"></Column>
                        <Column field="preco" header="Preço" body={(e) => formatarPreco(e.preco)} align="center" alignHeader="center"></Column>
                        <Column body={tableActions} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                    </DataTable>
                </div>
            </Panel>

            <ImageDialog visible={imageVisible} onHide={closeTableImageDialog} header="Imagem da Spot" src={spot.urlImage} />

            <DeleteDialog deleteObjectDialog={deleteSpotDialog} hideDeleteDialog={closeModal} deleteObject={deleteSpot}
                hideDeleteObjectDialog={closeModal} object={spot} />
        </div>
    )

}