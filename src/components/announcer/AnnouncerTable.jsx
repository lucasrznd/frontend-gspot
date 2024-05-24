import { Panel } from 'primereact/panel';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import DeleteDialog from '../dialog/DeleteDialog';
import { errorMsg, warnMsg } from '../../functions/Messages';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import ImageDialog from '../dialog/ImageDialog';
import { formatPhoneNumber } from '../../functions/StringFormat';
import { useAnnouncerData } from '../../hooks/announcer/useAnnouncerData';
import { useAnnouncerDelete } from '../../hooks/announcer/useAnnouncerDelete';

export default function AnnouncerTable(props) {
    const [announcer, setAnnouncer] = useState({});
    const [imageVisible, setImageVisible] = useState(false);
    const [deleteAnnouncerDialog, setDeleteAnnouncer] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const { data, isLoading, isError: isFetchError, isSuccess: loadDataSuccess } = useAnnouncerData();
    const { mutate, isSuccess, isError } = useAnnouncerDelete();

    const deleteAnnouncer = () => {
        mutate(announcer.id);

        if (isError) {
            errorMsg(toast, 'Erro ao remover locutor.');
        } else {
            warnMsg(toast, 'Locutor removido com sucesso.');
        }
    }

    useEffect(() => {
        closeModal();
    }, [isSuccess]);

    const confirmDeleteAnnouncer = (announcer) => {
        setAnnouncer({ ...announcer });
        setDeleteAnnouncer(true);
    };

    const closeModal = () => {
        setDeleteAnnouncer(false);
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

    const tableActions = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded onClick={() => props.announcerDetails(rowData)} />
                <span style={{ marginBottom: "1rem", marginLeft: "5px", marginRight: "5px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteAnnouncer(rowData)} />
            </React.Fragment>
        );
    };

    const imageBody = (rowData) => {
        // if (rowData.image === '') {
        //     rowData.image = 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png';
        // }

        return <>
            {/* <img src={rowData.image} alt="Imagem do Locutor" onClick={(e) => openTableImageDialog(e.target.currentSrc)} className='shadow-4 cursor-pointer border-circle' width='80px' height='80px' /> */}
            <Avatar icon="pi pi-user" image={rowData.urlImage} onClick={(e) => openTableImageDialog(e.target.currentSrc)} size="xlarge" className="mr-2 shadow-4" shape="circle" />
        </>
    };

    const imageTableHeader = () => {
        return <div className='flex align-items-center'>
            <p className='mr-1'>Imagem</p>
            <Tag severity='secondary' value="Novo"></Tag>
        </div>
    }

    const openTableImageDialog = (rowData) => {
        setAnnouncer({ ...announcer, urlImage: rowData });
        rowData !== undefined ? setImageVisible(true) : setImageVisible(false)
    }

    const closeTableImageDialog = () => {
        setImageVisible(false);
    }

    const showDatatable = () => {
        if (loadDataSuccess) {
            return <DataTable value={data} tableStyle={{ minWidth: '50rem' }}
                paginator globalFilter={globalFilter} header={header}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} de {last} de {totalRecords} locutores"
                rows={5} emptyMessage="Nenhum locutor encontrado." key="id">
                <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                <Column field="name" body={(rowData) => rowData.name.toUpperCase()} header="Nome" align="center" alignHeader="center"></Column>
                <Column field="phoneNumber" body={(rowData) => formatPhoneNumber(rowData, "phoneNumber")} header="Telefone" align="center" alignHeader="center"></Column>
                <Column field="urlImage" body={imageBody} header={imageTableHeader} align="center" alignHeader="center"></Column>
                <Column body={tableActions} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
            </DataTable>
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
                {isLoading && <ProgressSpinner />}
                {isFetchError && errorMsg(toast, 'Erro de conexão com servidor.')}

                {showDatatable()}
            </Panel>

            <ImageDialog visible={imageVisible} onHide={closeTableImageDialog} header="Imagem do Locutor" src={announcer.urlImage} />

            <DeleteDialog deleteObjectDialog={deleteAnnouncerDialog} hideDeleteDialog={closeModal} deleteObject={deleteAnnouncer}
                hideDeleteObjectDialog={closeModal} object={announcer} />
        </div>
    )

}