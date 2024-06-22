import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useCompanyTopMonthly } from '../../hooks/top_monthly/useCompanyTopMonthly';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function CompanyChart() {
    const { data, isLoading, isError } = useCompanyTopMonthly();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        if (!isLoading && !isError && data) {
            const companyNames = data.map(item => item.companyName.toUpperCase());
            const spotCount = data.map(item => item.spotCount);

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

            const chartData = {
                datasets: [
                    {
                        data: spotCount,
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--orange-400'),
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--bluegray-400'),
                            documentStyle.getPropertyValue('--yellow-400')
                        ],
                        label: 'Spots Gravados'
                    }
                ],
                labels: companyNames
            };

            const chartOptions = {
                plugins: {
                    legend: {
                        position: 'left',
                        labels: {
                            color: textColor
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            };

            setChartData(chartData);
            setChartOptions(chartOptions);
        }
    }, [isLoading, isError, data]);

    if (isLoading) {
        return <div><ProgressSpinner /></div>;
    }

    if (isError) {
        return <div className='flex align-items-center justify-content-center'>
            <i className="pi pi-exclamation-circle mr-2 text-red-500"></i>
            <h3 className='text-red-500'>Erro ao carregar empresas.</h3>
        </div>;;
    }

    return (
        <Chart type="doughnut" data={chartData} options={chartOptions} style={{ height: '500px', width: '100%' }} />
    );
}