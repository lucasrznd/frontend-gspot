import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { errorMsg, successMsg } from "../../functions/Messages";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar } from "primereact/avatar";
import ImageDialog from "../dialog/ImageDialog";
import { isImgUrl } from "../../functions/Validation";
import AnnouncerTable from "./AnnouncerTable";
import { useAnnouncerMutate } from "../../hooks/announcer/useAnnouncerMutate";
import { useAnnouncerPut } from "../../hooks/announcer/useAnnouncerPut";

export default function AnnouncerForm(props) {
    const [visualizarModal, setVisualizarModal] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const toast = useRef(null);
    const { mutate, isSuccess } = useAnnouncerMutate();
    const { mutate: mutatePut } = useAnnouncerPut();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
    });

    const formik = useFormik({
        initialValues: {
            id: undefined,
            name: '', // Initial value of "name" field
            phoneNumber: '', // Initial value of "phoneNumber" field
            urlImage: ''
        },
        validationSchema: validationSchema, // Validation Schema
        onSubmit: async (values, actions) => {
            const data = values;

            if (data.urlImage !== '') {
                if (await isImgUrl(data.urlImage) === false) {
                    errorMsg(toast, 'Link de imagem inválido.');
                    return;
                }
            }

            // If id != null is made a PUT Request, else a POST Request
            data.id !== undefined ? mutatePut(data) : mutate(data);
            closeModalForm();
            actions.resetForm();
            successMsg(toast, 'Locutor salvo com sucesso.');
        },
    });

    useEffect(() => {
        closeModalForm();
    }, [isSuccess]);

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    function newAnnouncer() {
        formik.resetForm();
        formik.values.id = undefined;
        formik.values.name = '';
        formik.values.phoneNumber = '';
        formik.values.urlImage = '';
        setVisualizarModal(true);
    }

    const closeModalForm = () => {
        setVisualizarModal(false);
    }

    const announcerDetails = (announcer) => {
        formik.resetForm();
        formik.values.id = announcer.id;
        formik.values.name = announcer.name;
        formik.values.phoneNumber = announcer.phoneNumber;
        formik.values.urlImage = announcer.urlImage;
        setVisualizarModal(true);
    };

    const closeModal = () => {
        setVisualizarModal(false);
    }

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={newAnnouncer} />
        </React.Fragment>
    );

    const modalFooter = (
        <div>
            <Button label="Salvar" type="submit" icon="pi pi-check" onClick={formik.handleSubmit} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={closeModal} />
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

            <AnnouncerTable startContent={startContent} announcerDetails={announcerDetails} setLocutor={props.setLocutor} />

            <Dialog header="Detalhes do Locutor" visible={visualizarModal} style={{ width: '40vw', minWidth: "40vw" }} breakpoints={{ '960px': '65vw', '641px': '70vw' }} onHide={() => setVisualizarModal(false)}
                footer={modalFooter} draggable={false}>
                <div className="card p-fluid">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="field flex align-items-center justify-content-center">
                            {/* <img src={formik.values.urlImage} alt="Adicione a imagem." onClick={openImageDialog} className='shadow-4 cursor-pointer border-circle' width='80px' height='80px' /> */}
                            <Avatar icon='pi pi-user' image={formik.values.urlImage} onClick={openImageDialog} size="xlarge" className="mr-2 shadow-4" shape="circle" />
                            <ImageDialog visible={imageVisible} onHide={closeImageDialog} header="Imagem do Locutor" src={formik.values.urlImage} />
                        </div>

                        <div className="field">
                            <label htmlFor='name' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
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