import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useSpotData } from "../../hooks/spot/useSpotData";
import { Avatar } from "primereact/avatar";
import { dateFormat, priceFormat } from "../../functions/StringFormat";

export default function HomeBody() {
    const toast = useRef(null);
    const { data } = useSpotData();

    const imageBodyCompany = (rowData) => {
        return <div className='flex align-items-center justify-content-center'>
            <p className='mr-2'>{rowData.company.name.toUpperCase()}</p>
            <Avatar icon="pi pi-building" image={rowData.company.urlImage} className="mr-2 shadow-4" shape="circle" />
        </div>
    };

    const imageBodyAnnouncer = (rowData) => {
        return <div className='flex align-items-center justify-content-center'>
            <p className='mr-2'>{rowData.announcer.name.toUpperCase()}</p>
            <Avatar icon="pi pi-building" image={rowData.announcer.urlImage} className="shadow-4" shape="circle" />
        </div>
    };

    return <div>
        <Toast ref={toast} />

        <div className="grid mt-1">
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3 font-bold">Spots</span>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-primary border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <a href="/spot"><i className="pi pi-microphone text-white text-xl"></i></a>
                        </div>
                    </div>
                    <div className="flex md:align-items-center align-items-stretch flex-wrap">
                        <span className="text-green-500 text-900 font-medium text-xl flex align-items-center justify-content-center">2  </span>
                        <span className="text-500 flex align-items-center justify-content-center ml-2">registrados.</span>
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3 font-bold">Empresas</span>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-400 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <a href="/company"><i className="pi pi-building text-white text-xl"></i></a>
                        </div>
                    </div>
                    <div className="flex md:align-items-center align-items-stretch flex-wrap">
                        <span className="text-green-500 text-900 font-medium text-xl flex align-items-center justify-content-center">2  </span>
                        <span className="text-500 flex align-items-center justify-content-center ml-2">registradas.</span>
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3 font-bold">Total Acumulado</span>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-dollar text-green-700 text-xl"></i>
                        </div>
                    </div>
                    <div className="flex md:align-items-center align-items-stretch flex-wrap">
                        <span className="text-600 font-bold text-xl flex align-items-center justify-content-center">R$ 1700,00</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid mt-1">
            <div className="col-12 md:col-12">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between">
                        <div>
                            <span className="block text-primary font-bold mb-3">Últimas Gravações</span>
                        </div>
                    </div>
                    <DataTable value={data} tableStyle={{ minWidth: '50rem' }} emptyMessage="Nenhum spot encontrado." key="id">
                        <Column field="title" header="Título" body={(rowData) => rowData.title.toUpperCase()} align="center" alignHeader="center"></Column>
                        <Column field="company.name" header="Empresa" body={(rowData) => imageBodyCompany(rowData)} align="center" alignHeader="center"></Column>
                        <Column field="announcer.name" header="Locutor" body={(rowData) => imageBodyAnnouncer(rowData)} align="center" alignHeader="center"></Column>
                        <Column field="date" header="Data" body={(rowData) => dateFormat(rowData, 'date')} align="center" alignHeader="center"></Column>
                        <Column field="duration" header="Duração" align="center" alignHeader="center"></Column>
                        <Column field="price" header="Preço" body={(rowData) => priceFormat(rowData.price)} align="center" alignHeader="center"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
}