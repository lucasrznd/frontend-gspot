import { Panel } from 'primereact/panel';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import DeleteDialog from '../dialog/DeleteDialog';
import { useSpotDelete } from '../../hooks/spot/useSpotDelete';
import { errorMsg, warnMsg } from '../../functions/Messages';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSpotData } from '../../hooks/spot/useSpotData';
import ImageDialog from '../dialog/ImageDialog';
import { dateFormat, priceFormat } from '../../functions/StringFormat';

export default function SpotTable(props) {
    const [spot, setSpot] = useState({});
    const [imageVisible, setImageVisible] = useState(false);
    const [deleteSpotDialog, setDeleteSpotDialog] = useState(false);
    const [globalFilter] = useState(null);
    const toast = useRef(null);
    const { data, isLoading, isError: isFetchError, isSuccess: loadDataSuccess } = useSpotData();
    const { mutate, isSuccess, isError } = useSpotDelete();

    const deleteSpot = () => {
        mutate(spot.id);

        if (isError) {
            errorMsg(toast, 'Erro ao remover spot.');
        } else {
            warnMsg(toast, 'Spot removido com sucesso.');
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
            {/* <img src={rowData.image} alt="Imagem do Spot" onClick={(e) => openImgDialogAnnouncer(e.target.currentSrc)} className='shadow-4 cursor-pointer border-circle' width='80px' height='80px' /> */}
            <p className='mr-2'>{rowData.company.name.toUpperCase()}</p>
            <Avatar icon="pi pi-building" image={rowData.company.urlImage} onClick={(e) => openImgDialogCompany(e.target.currentSrc)} className="mr-2 shadow-4" shape="circle" />
        </div>
    };

    const imageBodyAnnouncer = (rowData) => {
        return <div className='flex align-items-center justify-content-center'>
            {/* <img src={rowData.image} alt="Imagem do Spot" onClick={(e) => openImgDialogAnnouncer(e.target.currentSrc)} className='shadow-4 cursor-pointer border-circle' width='80px' height='80px' /> */}
            <p className='mr-2'>{rowData.announcer.name.toUpperCase()}</p>
            <Avatar icon="pi pi-building" image={rowData.announcer.urlImage} onClick={(e) => openImgDialogAnnouncer(e.target.currentSrc)} className="shadow-4" shape="circle" />
        </div>
    };

    const openImgDialogCompany = (rowData) => {
        setSpot({ ...spot, urlImage: rowData });
        rowData !== undefined ? setImageVisible(true) : setImageVisible(false)
    }

    const openImgDialogAnnouncer = (rowData) => {
        setSpot({ ...spot, urlImage: rowData });
        rowData !== undefined ? setImageVisible(true) : setImageVisible(false)
    }

    const closeTableImageDialog = () => {
        setImageVisible(false);
    }

    const showDatatable = () => {
        if (isLoading) {
            return <ProgressSpinner />
        }

        if (isFetchError) {
            errorMsg(toast, 'Erro de conexão com o servidor.');
        }

        if (loadDataSuccess && Array.isArray(data)) {
            return <div className="card">
                <DataTable value={data} tableStyle={{ minWidth: '50rem' }}
                    paginator globalFilter={globalFilter} header={header}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} de {last} de {totalRecords} spots"
                    rows={5} emptyMessage="Nenhum spot encontrado." key="id">
                    <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                    <Column field="title" header="Nome" body={(rowData) => rowData.title.toUpperCase()} align="center" alignHeader="center"></Column>
                    <Column field="company.name" header="Empresa" body={(rowData) => imageBodyEmpresa(rowData)} align="center" alignHeader="center"></Column>
                    <Column field="announcer.name" header="Locutor" body={(rowData) => imageBodyAnnouncer(rowData)} align="center" alignHeader="center"></Column>
                    <Column field="date" header="Data" body={(rowData) => dateFormat(rowData, 'date')} align="center" alignHeader="center"></Column>
                    <Column field="duration" header="Duração" align="center" alignHeader="center"></Column>
                    <Column field="price" header="Preço" body={(rowData) => priceFormat(rowData.price)} align="center" alignHeader="center"></Column>
                    <Column body={tableActions} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                </DataTable>
            </div>
        }
        return <div className='flex align-items-center justify-content-center'>
            <i className="pi pi-exclamation-circle mr-2 text-red-500"></i>
            <h2 className='text-red-500'>Erro de conexão com servidor.</h2>
        </div>
    }

    return (
        <div>
            <Toast ref={toast} />
            <Panel>
                <Toolbar style={{ marginBottom: "10px" }} start={props.startContent} />

                {showDatatable()}
            </Panel>

            <ImageDialog visible={imageVisible} onHide={closeTableImageDialog} header="Imagem da Spot" src={spot.urlImage} />

            <DeleteDialog deleteObjectDialog={deleteSpotDialog} hideDeleteDialog={closeModal} deleteObject={deleteSpot}
                hideDeleteObjectDialog={closeModal} object={spot} />
        </div>
    )

}