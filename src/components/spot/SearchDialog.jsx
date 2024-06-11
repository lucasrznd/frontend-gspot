import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useFormik } from 'formik';
import { Avatar } from "primereact/avatar";
import { infoMsg, warnMsg } from "../../functions/Messages";
import { useSpotSearch } from "../../hooks/spot/useSpotSearch";
import { useEffect, useState } from "react";

export default function SearchDialog(props) {
    const formik = useFormik({
        initialValues: {
            dateRange: '',
            title: '',
            company: {},
            announcer: {},
        },
        validate: (data) => {
            let errors = {};

            if (!data.dateRange) {
                errors.dateRange = 'Intervalo de Data é obrigatório.';
            }

            return errors;
        },
        onSubmit: async (values, actions) => {
            const data = values;

            setQueryParams({ ...queryParams, initialDate: new Date(formik.values.dateRange[0]).toISOString().split('T')[0] });
            setQueryParams({ ...queryParams, finalDate: new Date(formik.values.dateRange[1]).toISOString().split('T')[1] });
            setQueryParams({ ...queryParams, title: data.title });
            setQueryParams({ ...queryParams, companyName: data.company.name });
            setQueryParams({ ...queryParams, announcerName: data.announcer.name });

            props.setSpotList(spotList);

            props.closeSearchDialog();

            spotList.length === 0 ? warnMsg(props.toast, 'Nenhum spot encontrado.') : infoMsg(props.toast, 'Busca realizada com sucesso.');
        },
    });

    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    };

    const [queryParams, setQueryParams] = useState({
        initialDate: formik.values.dateRange[0] === '' || !isValidDate(formik.values.dateRange[0]) ? '' : new Date(formik.values.dateRange[0]).toISOString().split('T')[0],
        finalDate: formik.values.dateRange[1] === '' || !isValidDate(formik.values.dateRange[1]) ? '' : new Date(formik.values.dateRange[1]).toISOString().split('T')[0],
        companyName: formik.values.company.name,
        announcerName: formik.values.announcer.name
    });

    useEffect(() => {
        setQueryParams({
            initialDate: formik.values.dateRange[0] === '' || !isValidDate(formik.values.dateRange[0]) ? '' : new Date(formik.values.dateRange[0]).toISOString().split('T')[0],
            finalDate: formik.values.dateRange[1] === '' || !isValidDate(formik.values.dateRange[1]) ? '' : new Date(formik.values.dateRange[1]).toISOString().split('T')[0],
            companyName: formik.values.company.name,
            announcerName: formik.values.announcer.name
        });
    }, [formik.values.dateRange, formik.values.company, formik.values.announcer]);

    const { data: spotList } = useSpotSearch(queryParams);

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const modalFooter = (
        <div>
            <Button label="Buscar" type="submit" icon="pi pi-check" onClick={formik.handleSubmit} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={props.closeSearchDialog} />
        </div>
    );

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

    return <>
        <Dialog header="Detalhes do Spot" visible={props.searchVisible} style={{ width: '40vw', minWidth: "40vw" }} breakpoints={{ '960px': '65vw', '641px': '70vw' }} onHide={() => props.setSearchVisible(false)}
            footer={modalFooter} draggable={false}>
            <div className="card p-fluid">
                <form onSubmit={formik.handleSubmit}>
                    <div className="field">
                        <label htmlFor='dateRange'>Intervalo de Data:</label>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-calendar"></i>
                            </span>
                            <Calendar id="dateRange" value={formik.values.dateRange} onChange={(e) => formik.setFieldValue('dateRange', e.value)}
                                selectionMode="range" dateFormat="dd/mm/yy" locale="pt-BR" readOnlyInput hideOnRangeSelection
                                className={isFormFieldValid('dateRange') ? "p-invalid uppercase" : "uppercase"} />
                        </div>
                        {getFormErrorMessage('dateRange')}
                    </div>

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
                                onChange={formik.handleChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor='company' >Empresa:</label>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <Avatar icon='pi pi-building' image={formik.values.company.urlImage}
                                    className="shadow-4" shape="circle" />
                            </span>
                            <AutoComplete id="company" name="company" value={formik.values.company} suggestions={props.companyList} field="company"
                                completeMethod={props.companyCompleteMethod} onChange={(e) => formik.setFieldValue('company', e.value)}
                                itemTemplate={companyItemTemplate} selectedItemTemplate={(company) => company.name.toUpperCase()}
                                onBlur={formik.handleBlur} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor='announcer' >Locutor:</label>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <Avatar icon='pi pi-building' image={formik.values.announcer.urlImage}
                                    className="shadow-4" shape="circle" />
                            </span>
                            <AutoComplete id="announcer" name="announcer" value={formik.values.announcer} suggestions={props.announcerList} field="announcer" key={formik.values.announcer.id}
                                completeMethod={props.announcerCompleteMethod} onChange={(e) => formik.setFieldValue('announcer', e.value)}
                                itemTemplate={announcerItemTemplate} selectedItemTemplate={(announcer) => announcer.name.toUpperCase()}
                                onBlur={formik.handleBlur} />
                        </div>
                    </div>

                </form>
            </div>
        </Dialog>

    </>
}