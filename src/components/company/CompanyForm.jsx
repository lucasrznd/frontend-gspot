import React, { useEffect, useRef, useState } from "react";
import TableEmpresa from "./CompanyTable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { errorMsg, successMsg } from "../../functions/Messages";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCompanyMutate } from "../../hooks/company/useCompanyMutate";
import { useCompanyPut } from "../../hooks/company/useCompanyPut";
import { Avatar } from "primereact/avatar";
import ImageDialog from "../dialog/ImageDialog";
import { clearNumber } from "../../functions/StringFormat";
import { isImgUrl } from "../../functions/Validation";

export default function CompanyForm(props) {
    const [visualizarModal, setVisualizarModal] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const toast = useRef(null);
    const { mutate, isSuccess, error } = useCompanyMutate();
    const { mutate: mutatePut } = useCompanyPut();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
    });

    const formik = useFormik({
        initialValues: {
            id: undefined,
            name: '',
            phoneNumber: '',
            urlImage: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, actions) => {
            const data = values;
            data.phoneNumber = clearNumber(data.phoneNumber);

            if (data.urlImage !== '') {
                if (await isImgUrl(data.urlImage) === false) {
                    errorMsg(toast, 'Link de imagem inválido.');
                    return;
                }
            }

            // If id != null is made a POST Request, else a PUT Request
            data.id !== undefined ? mutatePut(data) : mutate(data);

            if (error && error.message === '409') {
                errorMsg(toast, 'Empresa já existente.');
                return;
            }

            closeDialogForm();
            actions.resetForm();
            successMsg(toast, 'Empresa salva com sucesso.');
        },
    });

    useEffect(() => {
        closeDialogForm();
    }, [isSuccess]);

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    function newCompany() {
        formik.resetForm();
        formik.values.id = undefined;
        formik.values.name = '';
        formik.values.phoneNumber = '';
        formik.values.urlImage = '';
        setVisualizarModal(true);
    }

    const closeDialogForm = () => {
        setVisualizarModal(false);
    }

    const companyDetails = (empresa) => {
        formik.resetForm();
        formik.values.id = empresa.id;
        formik.values.name = empresa.name;
        formik.values.phoneNumber = empresa.phoneNumber;
        formik.values.urlImage = empresa.urlImage;
        setVisualizarModal(true);
    };

    const closeDialog = () => {
        setVisualizarModal(false);
    }

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={newCompany} />
        </React.Fragment>
    );

    const modalFooter = (
        <div>
            <Button label="Salvar" type="submit" icon="pi pi-check" onClick={formik.handleSubmit} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={closeDialog} />
        </div>
    );

    const openImageDialog = () => {
        formik.values.urlImage !== '' ? setImageVisible(true) : setImageVisible(false);
    }

    const closeImageDialog = () => {
        setImageVisible(false);
    }

    return (
        <div>
            <Toast ref={toast} />

            <TableEmpresa startContent={startContent} companyDetails={companyDetails} setEmpresa={props.setEmpresa} />

            <Dialog header="Detalhes do Empresa" visible={visualizarModal} style={{ width: '40vw', minWidth: "40vw" }} breakpoints={{ '960px': '65vw', '641px': '70vw' }} onHide={() => setVisualizarModal(false)}
                footer={modalFooter} draggable={false}>
                <div className="card p-fluid">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="field flex align-items-center justify-content-center">
                            {/* <img src={formik.values.urlImage} alt="Adicione a imagem." onClick={openImageDialog} className='shadow-4 cursor-pointer border-circle' width='80px' height='80px' /> */}
                            <Avatar icon='pi pi-building' image={formik.values.urlImage} onClick={openImageDialog} size="xlarge" className="mr-2 shadow-4" shape="circle" />
                            <ImageDialog visible={imageVisible} onHide={closeImageDialog} header="Imagem do Empresa" src={formik.values.urlImage} />
                        </div>

                        <div className="field">
                            <label htmlFor='name' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-building"></i>
                                </span>
                                <InputText
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    className={isFormFieldValid('name') ? "p-invalid uppercase" : "uppercase"}
                                />
                            </div>
                            {getFormErrorMessage('name')}
                        </div>

                        <div className="field">
                            <label htmlFor='phoneNumber' style={{ marginBottom: '0.5rem' }}>Telefone:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-phone"></i>
                                </span>
                                <InputMask
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    mask="(99) 9 9999-9999"
                                    placeholder="(99) 9 9999-9999"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor='urlImage' style={{ marginBottom: '0.5rem' }}>Imagem:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-image"></i>
                                </span>
                                <InputText
                                    id="urlImage"
                                    name="urlImage"
                                    value={formik.values.urlImage}
                                    onChange={formik.handleChange} />
                            </div>
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    )
}