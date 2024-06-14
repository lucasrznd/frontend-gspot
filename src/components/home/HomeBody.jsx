import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { dateFormat, priceFormat } from "../../functions/StringFormat";
import { errorMsg } from "../../functions/Messages";
import { ProgressSpinner } from "primereact/progressspinner";
import { useSpotCounter } from "../../hooks/spot/useSpotCounter";
import { useCompanyCounter } from "../../hooks/company/useCompanyCounter";
import { useSpotAmountRaised } from "../../hooks/spot/useSpotAmountRaised";
import { useSpotLatest } from "../../hooks/spot/useSpotLatest";
import AnnouncerChart from "../charts/AnnouncerChart";

export default function HomeBody() {
    const toast = useRef(null);
    const { data, isError, isLoading, isSuccess: loadDataSuccess } = useSpotLatest();
    const { data: spotCounter } = useSpotCounter();
    const { data: companyCounter } = useCompanyCounter();
    const { data: spotAmountRaised } = useSpotAmountRaised();
    const translatedMonths = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const imageBodyCompany = (rowData) => {
        return <div className='flex align-items-center justify-content-center'>
            <Avatar icon="pi pi-building" image={rowData.company.urlImage} className="mr-2 shadow-4" shape="circle" />
            <p>{rowData.company.name.toUpperCase()}</p>
        </div>
    };

    const imageBodyAnnouncer = (rowData) => {
        return <div className='flex align-items-center justify-content-center'>
            <Avatar icon="pi pi-building" image={rowData.announcer.urlImage} className="mr-2 shadow-4" shape="circle" />
            <p>{rowData.announcer.name.toUpperCase()}</p>
        </div>
    };

    const showBody = () => {
        if (isLoading) {
            return <ProgressSpinner />
        }

        if (isError) {
            errorMsg(toast, 'Erro de conexão com servidor.');
        }

        if (loadDataSuccess) {
            return <div>
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
                                <span className="text-green-500 text-900 font-medium text-xl flex align-items-center justify-content-center">{spotCounter}</span>
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
                                    <a href="/empresa"><i className="pi pi-building text-white text-xl"></i></a>
                                </div>
                            </div>
                            <div className="flex md:align-items-center align-items-stretch flex-wrap">
                                <span className="text-green-500 text-900 font-medium text-xl flex align-items-center justify-content-center">{companyCounter}</span>
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
                                <span className="text-600 font-bold text-xl flex align-items-center justify-content-center">{priceFormat(spotAmountRaised)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grit-mt1">
                    <div className="col-6 md:col-4">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round" style={{ height: '400px', width: '100%', overflow: 'hidden' }}>
                            <div className="flex justify-content-between">
                                <div>
                                    <span className="block text-primary font-bold mb-3">Top Locutores Mês de {translatedMonths[new Date().getMonth()]}/{new Date().getFullYear()}</span>
                                </div>
                            </div>
                            <div className="flex align-items-center justify-content-center" style={{ height: 'calc(100% - 48px)' }}>
                                <div className="flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                                    <AnnouncerChart />
                                </div>
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
                                <Column field="price" header="Preço" body={(rowData) => priceFormat(rowData.price)} className="font-bold" align="center" alignHeader="center"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        }
        return <div className='flex align-items-center justify-content-center'>
            <i className="pi pi-exclamation-circle mr-2 text-red-500"></i>
            <h2 className='text-red-500'>Erro de conexão com servidor.</h2>
        </div>
    }

    return <div>
        <Toast ref={toast} />

        {showBody()}
    </div>
}