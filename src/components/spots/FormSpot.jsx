import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { msgSucesso } from "../../functions/Mensagens";
import { useFormik } from 'formik';
import TableSpot from "./TableSpot";
import { useEmpresaData } from '../../hooks/empresa/useEmpresaData';
import { AutoComplete } from "primereact/autocomplete";
import { useSpotMutate } from "../../hooks/spot/useSpotMutate";
import { useSpotPut } from "../../hooks/spot/useSpotPut";
import { useLocutorData } from '../../hooks/useLocutorData';
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { addLocale } from 'primereact/api';
import SearchDialog from "./SearchDialog";
import { Avatar } from "primereact/avatar";

export default function FormSpot(props) {
    const [visualizarModal, setVisualizarModal] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const toast = useRef(null);

    const { data: empresaData } = useEmpresaData();
    const { data: locutorData } = useLocutorData();
    const { mutate, isSuccess } = useSpotMutate();
    const { mutate: mutatePut } = useSpotPut();
    const [empresaList, setEmpresaList] = useState([]);
    const [locutorList, setLocutorList] = useState([]);

    addLocale('pt-BR', {
        firstDayOfWeek: 0,
        showMonthAfterYear: true,
        dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
        dayNamesShort: ['dom', 'seg', 'ter', 'quar', 'qui', 'sex', 'sab'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
        today: 'Hoje',
        clear: 'Limpar'
    });

    function cleanData() {
        formik.values.id = undefined;
        formik.values.titulo = '';
        formik.values.empresa = '';
        formik.values.locutor = '';
        formik.values.data = '';
        formik.values.duracao = '';
        formik.values.contratoAtivo = false;
        formik.values.preco = '';
    }

    const formik = useFormik({
        initialValues: {
            id: undefined,
            titulo: '',
            empresa: {},
            locutor: {},
            data: '',
            duracao: '',
            contratoAtivo: false,
            preco: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.titulo) {
                errors.titulo = 'Título é obrigatório.';
            }

            if (Object.keys(data.empresa).length === 0) {
                errors.empresa = 'Empresa é obrigatória.';
            }

            if (Object.keys(data.locutor).length === 0) {
                errors.locutor = 'Locutor é obrigatório.';
            }

            if (!data.duracao) {
                errors.duracao = 'Duração é obrigatória.';
            }

            return errors;
        },
        onSubmit: async (values, actions) => {
            const data = values;

            // If id != null is made a POST Request, else a PUT Request
            data.id !== undefined ? mutatePut(data) : mutate(data);
            closeModalForm();
            actions.resetForm();
            msgSucesso(toast, 'Spot salvo com sucesso.');
        },
    });

    useEffect(() => {
        closeModalForm();
    }, [isSuccess]);

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    function newSpot() {
        formik.resetForm();
        cleanData();
        setVisualizarModal(true);
    }

    function newSearch() {
        setSearchVisible(true);
    }

    const closeSearchDialog = () => {
        setSearchVisible(false);
    }

    const closeModalForm = () => {
        setVisualizarModal(false);
    }

    const spotDetails = (spot) => {
        formik.resetForm();

        formik.setFieldValue('id', spot.id);
        formik.setFieldValue('titulo', spot.titulo);
        formik.setFieldValue('empresa', spot.empresa);
        formik.setFieldValue('locutor', spot.locutor);
        formik.setFieldValue('data', new Date(spot.data));
        formik.setFieldValue('duracao', spot.duracao);
        formik.setFieldValue('contratoAtivo', spot.contratoAtivo);
        formik.setFieldValue('preco', spot.preco);
        setVisualizarModal(true);
    };

    const closeModal = () => {
        setVisualizarModal(false);
    }

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={newSpot} />
            <span className="pi pi-ellipsis-v ml-2 mr-2"></span>
            <Button icon="pi pi-search" label='Buscar' onClick={newSearch} />
        </React.Fragment>
    );

    const modalFooter = (
        <div>
            <Button label="Salvar" type="submit" icon="pi pi-check" onClick={formik.handleSubmit} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={closeModal} />
        </div>
    );

    const completeMethodEmpresa = (ev) => {
        const filterSuggestions = empresaData.filter(e =>
            e.nome.toLowerCase().includes(ev.query.toLowerCase())
        );
        setEmpresaList(filterSuggestions);
    };

    const completeMethodLocutor = (ev) => {
        const filterSugestions = locutorData.filter(l => l.nome.toLowerCase().includes(ev.query.toLowerCase()));

        setLocutorList(filterSugestions);
    };

    const itemTemplateEmpresa = (item) => {
        return (
            <div className="flex align-items-center">
                <Avatar icon='pi pi-building' image={item.urlImage}
                    className="mr-2 shadow-4" shape="circle" />
                <div>{item.nome.toUpperCase()}</div>
            </div>
        );
    };

    const itemTemplateLocutor = (item) => {
        return (
            <div className="flex align-items-center">
                <Avatar icon='pi pi-building' image={item.urlImage}
                    className="mr-2 shadow-4" shape="circle" />
                <div>{item.nome.toUpperCase()}</div>
            </div>
        );
    };

    return (
        <div>
            <Toast ref={toast} />

            <TableSpot startContent={startContent} spotDetails={spotDetails} setEmpresa={props.setEmpresa} />

            <Dialog header="Detalhes do Spot" visible={visualizarModal} style={{ width: '40vw', minWidth: "40vw" }} breakpoints={{ '960px': '65vw', '641px': '70vw' }} onHide={() => setVisualizarModal(false)}
                footer={modalFooter} draggable={false}>
                <div className="card p-fluid">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="field">
                            <label htmlFor='titulo' >Título:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-microphone"></i>
                                </span>
                                <InputText
                                    id="titulo"
                                    name="titulo"
                                    value={formik.values.titulo}
                                    onChange={formik.handleChange}
                                    className={isFormFieldValid('titulo') ? "p-invalid uppercase" : "uppercase"}
                                />
                            </div>
                            {getFormErrorMessage('titulo')}
                        </div>

                        <div className="field">
                            <label htmlFor='empresa' >Empresa:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <Avatar icon='pi pi-building' image={formik.values.empresa.urlImage}
                                        className="shadow-4" shape="circle" />
                                </span>
                                <AutoComplete id="empresa" inputId="id" value={formik.values.empresa} suggestions={empresaList} field="nome"
                                    completeMethod={completeMethodEmpresa} onChange={(e) => formik.setFieldValue('empresa', e.value)}
                                    itemTemplate={itemTemplateEmpresa} selectedItemTemplate={(empresa) => empresa.nome.toUpperCase()}
                                    onBlur={formik.handleBlur}
                                    className={isFormFieldValid('empresa') ? "p-invalid uppercase" : "uppercase"} />
                            </div>
                            {getFormErrorMessage('empresa')}
                        </div>

                        <div className="field">
                            <label htmlFor='locutor' >Locutor:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <Avatar icon='pi pi-user' image={formik.values.locutor.urlImage}
                                        className="shadow-4" shape="circle" />
                                </span>
                                <AutoComplete id="locutor.id" name="locutor" value={formik.values.locutor} suggestions={locutorList} field="nome"
                                    completeMethod={completeMethodLocutor} onChange={(e) => formik.setFieldValue('locutor', e.value)}
                                    itemTemplate={itemTemplateLocutor} selectedItemTemplate={(locutor) => locutor.nome.toUpperCase()}
                                    onBlur={formik.handleBlur}
                                    className={isFormFieldValid('locutor') ? "p-invalid uppercase" : "uppercase"} />
                            </div>
                            {getFormErrorMessage('locutor')}
                        </div>

                        <div className="field">
                            <label htmlFor='data'>Data:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-calendar"></i>
                                </span>
                                <Calendar value={formik.values.data} onChange={(e) => formik.setFieldValue('data', e.value)} dateFormat="dd/mm/yy" locale="pt-BR" />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor='duracao'>Duração:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-stopwatch"></i>
                                </span>
                                <InputMask
                                    id="duracao"
                                    name="duracao"
                                    value={formik.values.duracao}
                                    onChange={formik.handleChange}
                                    mask="9.99"
                                    className={isFormFieldValid('duracao') ? "p-invalid uppercase" : "uppercase"} />
                            </div>
                            {getFormErrorMessage('duracao')}
                        </div>

                        <div className="field">
                            <div className="flex align-items-stretch flex-wrap">
                                <label htmlFor='duracao'>Contrato Ativo:</label>
                                <Checkbox onChange={(e) => formik.setFieldValue('contratoAtivo', e.checked)} checked={formik.values.contratoAtivo}
                                    className="ml-2" />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor='preco' >Preço:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-dollar"></i>
                                </span>
                                <InputNumber id="preco" value={formik.values.preco} onValueChange={(e) => formik.setFieldValue('preco', e.value)}
                                    mode="currency" currency="BRL" locale="pt-BR" disabled />
                            </div>
                        </div>
                    </form>
                </div>
            </Dialog>

            <SearchDialog toast={toast} searchVisible={searchVisible} closeSearchDialog={closeSearchDialog} formik={formik}
                empresaList={empresaList} completeMethodEmpresa={completeMethodEmpresa} locutorList={locutorList}
                completeMethodLocutor={completeMethodLocutor} />
        </div>
    )
}