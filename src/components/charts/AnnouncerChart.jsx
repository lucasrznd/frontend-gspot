import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useAnnouncerTopMonthly } from '../../hooks/top_monthly/useAnnouncerTopMonthly';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function AnnouncerChart() {
    const { data, isLoading, isError } = useAnnouncerTopMonthly();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        if (!isLoading && !isError && data) {
            const announcerNames = data.map(item => item.announcerName.toUpperCase());
            const spotCount = data.map(item => item.spotCount);

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

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
                labels: announcerNames
            };

            const chartOptions = {
                plugins: {
                    legend: {
                        position: 'left',
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: surfaceBorder
                        },
                        ticks: {
                            display: false
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
            <h3 className='text-red-500'>Erro ao carregar locutores.</h3>
        </div>;;
    }

    return (

        <Chart type="polarArea" data={chartData} options={chartOptions} style={{ height: '500px', width: '100%' }} />
    );
}