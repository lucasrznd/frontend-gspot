import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { successMsg } from "../../functions/Messages";
import { useFormik } from 'formik';
import SpotTable from "./SpotTable";
import { AutoComplete } from "primereact/autocomplete";
import { useSpotMutate } from "../../hooks/spot/useSpotMutate";
import { useSpotPut } from "../../hooks/spot/useSpotPut";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { addLocale } from 'primereact/api';
import SearchDialog from "./SearchDialog";
import { Avatar } from "primereact/avatar";
import { useCompanyData } from "../../hooks/company/useCompanyData";
import { useAnnouncerData } from "../../hooks/announcer/useAnnouncerData";
import { useSpotCalculatePrice } from "../../hooks/spot/useSpotCalculatePrice";
import { parseDate } from "../../functions/StringFormat";

export default function SpotForm(props) {
    const [visualizarModal, setVisualizarModal] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const toast = useRef(null);

    const { data: companyData } = useCompanyData();
    const { data: announcerData } = useAnnouncerData();
    const { mutate, isSuccess } = useSpotMutate();
    const { mutate: mutatePut } = useSpotPut();
    const [companyList, setEmpresaList] = useState([]);
    const [announcerList, setLocutorList] = useState([]);

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
        formik.values.title = '';
        formik.values.company = '';
        formik.values.announcer = '';
        formik.values.date = '';
        formik.values.duration = '';
        formik.values.activeContract = false;
        formik.values.price = '';
    }

    const formik = useFormik({
        initialValues: {
            id: undefined,
            title: '',
            company: {},
            announcer: {},
            date: '',
            duration: '',
            activeContract: false,
            price: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.title) {
                errors.title = 'Título é obrigatório.';
            }

            if (Object.keys(data.company).length === 0) {
                errors.company = 'Empresa é obrigatória.';
            }

            if (Object.keys(data.announcer).length === 0) {
                errors.announcer = 'Locutor é obrigatório.';
            }

            if (!data.duration) {
                errors.duration = 'Duração é obrigatória.';
            }

            return errors;
        },
        onSubmit: async (values, actions) => {
            const data = values;

            // If id != null is made a POST Request, else a PUT Request
            data.id !== undefined ? mutatePut(data) : mutate(data);
            closeDialogForm();
            actions.resetForm();
            successMsg(toast, 'Spot salvo com sucesso.');
        },
    });

    const [queryParams, setQueryParams] = useState({
        duration: formik.values.duration === '' ? 0 : formik.values.duration,
        activeContract: formik.values.activeContract
    });

    useEffect(() => {
        closeDialogForm();
    }, [isSuccess]);

    useEffect(() => {
        setQueryParams({
            duration: formik.values.duration === "" ? 0 : formik.values.duration,
            activeContract: formik.values.activeContract
        })
    }, [formik.values.duration, formik.values.activeContract]);

    const { data: spotPrice } = useSpotCalculatePrice(queryParams);

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

    const closeDialogForm = () => {
        setVisualizarModal(false);
    }

    const spotDetails = (spot) => {
        formik.resetForm();

        formik.setFieldValue('id', spot.id);
        formik.setFieldValue('title', spot.title);
        formik.setFieldValue('company', spot.company);
        formik.setFieldValue('announcer', spot.announcer);
        formik.setFieldValue('date', parseDate(spot.date));
        formik.setFieldValue('duration', Number(spot.duration).toFixed(2));
        formik.setFieldValue('activeContract', spot.activeContract);
        formik.setFieldValue('price', spot.price);
        setVisualizarModal(true);
    };

    const closeDialog = () => {
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
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={closeDialog} />
        </div>
    );

    const companyCompleteMethod = (ev) => {
        const filterSuggestions = companyData.filter(e =>
            e.name.toLowerCase().includes(ev.query.toLowerCase())
        );
        setEmpresaList(filterSuggestions);
    };

    const announcerCompleteMethod = (ev) => {
        const filterSugestions = announcerData.filter(l => l.name.toLowerCase().includes(ev.query.toLowerCase()));

        setLocutorList(filterSugestions);
    };

    const companyItemTemplate = (item) => {
        return (
            <div className="flex align-items-center">
                <Avatar icon='pi pi-building' image={item.urlImage}
                    className="mr-2 shadow-4" shape="circle" />
                <div>{item.name.toUpperCase()}</div>
            </div>
        );
    };

    const announcerItemTemplate = (item) => {
        return (
            <div className="flex align-items-center">
                <Avatar icon='pi pi-building' image={item.urlImage}
                    className="mr-2 shadow-4" shape="circle" />
                <div>{item.name.toUpperCase()}</div>
            </div>
        );
    };

    const onChangeDuration = (e) => {
        formik.setFieldValue('duration', e.value);
        setQueryParams({ ...queryParams, duration: Number(e.value).toFixed(2) });
        onChangePrice();
    }

    const onChangeActiveContract = (e) => {
        formik.setFieldValue('activeContract', e.checked);
        onChangePrice();
    }

    const onChangePrice = () => {
        formik.setFieldValue('price', spotPrice);
    }

    return (
        <div>
            <Toast ref={toast} />

            <SpotTable startContent={startContent} spotDetails={spotDetails} setEmpresa={props.setEmpresa}
                toast={toast} searchVisible={searchVisible} closeSearchDialog={closeSearchDialog} formik={formik}
                companyList={companyList} companyCompleteMethod={companyCompleteMethod} announcerList={announcerList}
                announcerCompleteMethod={announcerCompleteMethod} />

            <Dialog header="Detalhes do Spot" visible={visualizarModal} style={{ width: '40vw', minWidth: "40vw" }} breakpoints={{ '960px': '65vw', '641px': '70vw' }} onHide={() => setVisualizarModal(false)}
                footer={modalFooter} draggable={false}>
                <div className="card p-fluid">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="field">
                            <label htmlFor='title' >Título:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-microphone"></i>
                                </span>
                                <InputText
                                    id="title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    className={isFormFieldValid('title') ? "p-invalid uppercase" : "uppercase"}
                                />
                            </div>
                            {getFormErrorMessage('title')}
                        </div>

                        <div className="field">
                            <label htmlFor='company' >Empresa:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <Avatar icon='pi pi-building' image={formik.values.company.urlImage}
                                        className="shadow-4" shape="circle" />
                                </span>
                                <AutoComplete id="company" inputId="id" value={formik.values.company} suggestions={companyList} field="name"
                                    completeMethod={companyCompleteMethod} onChange={(e) => formik.setFieldValue('company', e.value)}
                                    itemTemplate={companyItemTemplate} selectedItemTemplate={(company) => company.name.toUpperCase()}
                                    onBlur={formik.handleBlur}
                                    className={isFormFieldValid('company') ? "p-invalid uppercase" : "uppercase"} />
                            </div>
                            {getFormErrorMessage('company')}
                        </div>

                        <div className="field">
                            <label htmlFor='announcer' >Locutor:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <Avatar icon='pi pi-user' image={formik.values.announcer.urlImage}
                                        className="shadow-4" shape="circle" />
                                </span>
                                <AutoComplete id="announcer" name="announcer" value={formik.values.announcer} suggestions={announcerList} field="name"
                                    completeMethod={announcerCompleteMethod} onChange={(e) => formik.setFieldValue('announcer', e.value)}
                                    itemTemplate={announcerItemTemplate} selectedItemTemplate={(announcer) => announcer.name.toUpperCase()}
                                    onBlur={formik.handleBlur}
                                    className={isFormFieldValid('announcer') ? "p-invalid uppercase" : "uppercase"} />
                            </div>
                            {getFormErrorMessage('announcer')}
                        </div>

                        <div className="field">
                            <label htmlFor='date'>Data:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-calendar"></i>
                                </span>
                                <Calendar id="date" value={formik.values.date} onChange={(e) => formik.setFieldValue('date', new Date(e.value))} dateFormat="dd/mm/yy" locale="pt-BR" />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor='duration'>Duração:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-stopwatch"></i>
                                </span>
                                <InputMask
                                    id="duration"
                                    name="duration"
                                    value={formik.values.duration}
                                    onChange={(e) => onChangeDuration(e)}
                                    mask="9.99"
                                    className={isFormFieldValid('duration') ? "p-invalid uppercase" : "uppercase"} />
                            </div>
                            {getFormErrorMessage('duration')}
                        </div>

                        <div className="field">
                            <div className="flex align-items-stretch flex-wrap">
                                <label htmlFor='activeContract'>Contrato Ativo:</label>
                                <Checkbox onChange={(e) => onChangeActiveContract(e)} checked={formik.values.activeContract}
                                    className="ml-2" />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor='price' >Preço:</label>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-dollar"></i>
                                </span>
                                <InputNumber id="price" value={formik.values.price} onValueChange={onChangePrice}
                                    mode="currency" currency="BRL" locale="pt-BR" disabled />
                            </div>
                        </div>
                    </form>
                </div>
            </Dialog>

            {/* <SearchDialog toast={toast} searchVisible={searchVisible} closeSearchDialog={closeSearchDialog} formik={formik}
                companyList={companyList} companyCompleteMethod={companyCompleteMethod} announcerList={announcerList}
                announcerCompleteMethod={announcerCompleteMethod} /> */}
        </div>
    )
}