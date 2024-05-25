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
import { formatPhoneNumber } from '../../functions/StringFormat';
import { useCompanyDelete } from '../../hooks/company/useCompanyDelete';
import { errorMsg, warnMsg } from '../../functions/Messages';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCompanyData } from '../../hooks/company/useCompanyData';
import ImageDialog from '../dialog/ImageDialog';

export default function CompanyTable(props) {
    const [company, setCompany] = useState({});
    const [imageVisible, setImageVisible] = useState(false);
    const [deleteCompanyDialog, setDeleteEmpresaDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const { data, isLoading, isError: isFetchError, isSuccess: loadDataSuccess } = useCompanyData();
    const { mutate, isSuccess, isError } = useCompanyDelete();

    const deleteCompany = () => {
        mutate(company.id);

        if (isError) {
            errorMsg(toast, 'Erro ao remover empresa.');
        } else {
            warnMsg(toast, 'Empresa removida com sucesso.');
        }
    }

    useEffect(() => {
        closeModal();
    }, [isSuccess]);

    const confirmDeleteCompany = (company) => {
        setCompany({ ...company });
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
                <Button icon="pi pi-pencil" rounded onClick={() => props.companyDetails(rowData)} />
                <span style={{ marginBottom: "1rem", marginLeft: "5px", marginRight: "5px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteCompany(rowData)} />
            </React.Fragment>
        );
    };

    const imageBody = (rowData) => {
        return <>
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
        setCompany({ ...company, urlImage: rowData });
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
            errorMsg(toast, 'Erro de conexão com servidor.');
        }

        if (loadDataSuccess && Array.isArray(data)) {
            return <div className="card">
                <DataTable value={data} tableStyle={{ minWidth: '50rem' }}
                    paginator globalFilter={globalFilter} header={header}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} de {last} de {totalRecords} empresas"
                    rows={5} emptyMessage="Nenhum empresa encontrado." key="id">
                    <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                    <Column field="name" body={(rowData) => rowData.name.toUpperCase()} header="Nome" align="center" alignHeader="center"></Column>
                    <Column field="phoneNumber" body={(rowData) => formatPhoneNumber(rowData, 'phoneNumber')} header="Telefone" align="center" alignHeader="center"></Column>
                    <Column field="urlImage" body={imageBody} header={imageTableHeader} align="center" alignHeader="center"></Column>
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

            <ImageDialog visible={imageVisible} onHide={closeTableImageDialog} header="Imagem da Empresa" src={company.urlImage} />

            <DeleteDialog deleteObjectDialog={deleteCompanyDialog} hideDeleteDialog={closeModal} deleteObject={deleteCompany}
                hideDeleteObjectDialog={closeModal} object={company} />
        </div>
    )

}