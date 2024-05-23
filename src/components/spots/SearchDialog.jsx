import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useFormik } from 'formik';
import { Avatar } from "primereact/avatar";
import { msgInformativa } from "../../functions/Mensagens";

export default function SearchDialog(props) {
    const formik = useFormik({
        initialValues: {
            intervaloData: '',
            titulo: '',
            empresa: {},
            locutor: {},
        },
        validate: (data) => {
            let errors = {};

            if (!data.intervaloData) {
                errors.intervaloData = 'Intervalo de Data é obrigatório.';
            }

            return errors;
        },
        onSubmit: async (values, actions) => {
            const data = values;

            props.closeSearchDialog();
            msgInformativa(props.toast, 'Busca realizada com sucesso.');
        },
    });

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

    return <>
        <Dialog header="Detalhes do Spot" visible={props.searchVisible} style={{ width: '40vw', minWidth: "40vw" }} breakpoints={{ '960px': '65vw', '641px': '70vw' }} onHide={() => props.setSearchVisible(false)}
            footer={modalFooter} draggable={false}>
            <div className="card p-fluid">
                <form onSubmit={formik.handleSubmit}>
                    <div className="field">
                        <label htmlFor='intervaloData'>Intervalo de Data:</label>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-calendar"></i>
                            </span>
                            <Calendar id="intervaloData" value={formik.values.intervaloData} onChange={(e) => formik.setFieldValue('intervaloData', e.value)}
                                selectionMode="range" dateFormat="dd/mm/yy" locale="pt-BR" readOnlyInput hideOnRangeSelection
                                className={isFormFieldValid('intervaloData') ? "p-invalid uppercase" : "uppercase"} />
                        </div>
                        {getFormErrorMessage('intervaloData')}
                    </div>

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
                                onChange={formik.handleChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor='empresa' >Empresa:</label>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <Avatar icon='pi pi-building' image={formik.values.empresa.urlImage}
                                    className="shadow-4" shape="circle" />
                            </span>
                            <AutoComplete id="empresa" name="empresa" value={formik.values.empresa} suggestions={props.empresaList} field="empresa"
                                completeMethod={props.completeMethodEmpresa} onChange={(e) => formik.setFieldValue('empresa', e.value)}
                                itemTemplate={itemTemplateEmpresa} selectedItemTemplate={(empresa) => empresa.nome.toUpperCase()}
                                onBlur={formik.handleBlur} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor='locutor' >Locutor:</label>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <Avatar icon='pi pi-building' image={formik.values.locutor.urlImage}
                                    className="shadow-4" shape="circle" />
                            </span>
                            <AutoComplete id="locutor" name="locutor" value={formik.values.locutor} suggestions={props.locutorList} field="locutor" key={formik.values.locutor.id}
                                completeMethod={props.completeMethodLocutor} onChange={(e) => formik.setFieldValue('locutor', e.value)}
                                itemTemplate={itemTemplateLocutor} selectedItemTemplate={(locutor) => locutor.nome.toUpperCase()}
                                onBlur={formik.handleBlur} />
                        </div>
                    </div>

                </form>
            </div>
        </Dialog>

    </>
}