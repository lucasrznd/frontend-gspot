import { Dialog } from "primereact/dialog";

export default function ModalDelete(props) {
    return (
        <div>
            <Dialog visible={props.deleteObjetoDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={props.deleteObjetoFooter} onHide={props.hideDeleteObjetoDialog}>
                <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {props.objeto && (
                        <span>
                            Deseja realmente excluir o registro?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    )
}