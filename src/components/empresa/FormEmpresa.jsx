import React, { useEffect, useRef, useState } from "react";
import TableEmpresa from "./TableEmpresa";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { msgErro, msgSucesso } from "../../functions/Mensagens";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEmpresaMutate } from "../../hooks/empresa/useEmpresaMutate";
import { useEmpresaPut } from "../../hooks/empresa/useEmpresaPut";
import { Avatar } from "primereact/avatar";
import ImageDialog from "../ImageDialog";
import { cleanNumber } from "../../functions/Formatacao";
import { isImgUrl } from "../../functions/Validation";

export default function FormEmpresa(props) {
    const [visualizarModal, setVisualizarModal] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const toast = useRef(null);
    const { mutate, isSuccess } = useEmpresaMutate();
    const { mutate: mutatePut } = useEmpresaPut();

    const validationSchema = Yup.object().shape({
        nome: Yup.string().required('Nome é obrigatório'),
    });

    const formik = useFormik({
        initialValues: {
            id: undefined,
            nome: '', // Initial value of "nome" field
            telefone: '', // Initial value of "telefone" field
            urlImage: ''
        },
        validationSchema: validationSchema, // Validation Schema
        onSubmit: async (values, actions) => {
            const data = values;
            data.telefone = cleanNumber(data.telefone);

            if (data.urlImage !== '') {
                if (await isImgUrl(data.urlImage) === false) {
                    msgErro(toast, 'Link de imagem inválido.');
                    return;
                }
            }

            // If id != null is made a POST Request, else a PUT Request
            data.id !== undefined ? mutatePut(data) : mutate(data);
            closeModalForm();
            actions.resetForm();
            msgSucesso(toast, 'Empresa salva com sucesso.');
        },
    });

    useEffect(() => {
        closeModalForm();
    }, [isSuccess]);

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    function newEmpresa() {
        formik.resetForm();
        formik.values.id = undefined;
        formik.values.nome = '';
        formik.values.telefone = '';
        formik.values.urlImage = '';
        setVisualizarModal(true);
    }

    const closeModalForm = () => {
        setVisualizarModal(false);
    }

    const empresaDetails = (empresa) => {
        formik.resetForm();
        formik.values.id = empresa.id;
        formik.values.nome = empresa.nome;
        formik.values.telefone = empresa.telefone;
        formik.values.urlImage = empresa.urlImage;
        setVisualizarModal(true);
    };

    const closeModal = () => {
        setVisualizarModal(false);
    }

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={newEmpresa} />
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

            <TableEmpresa startContent={startContent} empresaDetails={empresaDetails} setEmpresa={props.setEmpresa} />

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
                            <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-building"></i>
                                </span>
                                <InputText
                                    id="nome"
                                    name="nome"
                                    value={formik.values.nome}
                                    onChange={formik.handleChange}
                                    className={isFormFieldValid('nome') ? "p-invalid uppercase" : "uppercase"}
                                />
                            </div>
                            {getFormErrorMessage('nome')}
                        </div>

                        <div className="field">
                            <label htmlFor='telefone' style={{ marginBottom: '0.5rem' }}>Telefone:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-phone"></i>
                                </span>
                                <InputMask
                                    id="telefone"
                                    name="telefone"
                                    value={formik.values.telefone}
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