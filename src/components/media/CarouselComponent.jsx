import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import { useAnnouncerData } from '../../hooks/announcer/useAnnouncerData';
import { formatPhoneNumber } from '../../functions/StringFormat';
import { Avatar } from 'primereact/avatar';

export default function CarouselComponent() {
    const { data, error, isLoading } = useAnnouncerData();

    const responsiveOptions = [
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '205px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const announcerTemplate = (announcer) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-1">
                    <Avatar icon='pi pi-users' image={announcer.urlImage}
                        className="shadow-4" size='xlarge' shape="circle" />
                </div>
                <div>
                    <h4 className="mb-2 text-primary font-bold">{announcer.name}</h4>
                    <Button icon="pi pi-whatsapp" rounded text severity="success" aria-label="Search" />
                    <h6 className="mt-0 mb-3">{formatPhoneNumber(announcer, 'phoneNumber')}</h6>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="card flex align-items-center justify-content-center">
            {data && (
                <Carousel
                    value={data}
                    numVisible={1}
                    numScroll={1}
                    responsiveOptions={responsiveOptions}
                    className="w-3 h-5"
                    circular
                    autoplayInterval={3000}
                    itemTemplate={announcerTemplate}
                />
            )}
        </div>
    );
}
