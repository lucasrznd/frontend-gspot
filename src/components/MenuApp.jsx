import React from 'react';
import logo from '../../src/assets/images/logo-horizontal.png';
import { MegaMenu } from 'primereact/megamenu';

export default function MenuApp() {

    const items = [
        {
            label: 'Spots',
            icon: 'pi pi-microphone',
            url: '/spot'
        },
        {
            label: 'Empresas',
            icon: 'pi pi-building',
            url: '/empresa'
        },
        {
            label: 'Locutores',
            icon: 'pi pi-users',
            url: '/locutor'
        }
    ];

    const start = <a href='/'><img alt="logo" src={logo} height={60} className="mr-2" /></a>

    return (
        <div className="card">
            <MegaMenu model={items} orientation="horizontal" start={start} breakpoint="600px" className="p-3 surface-0 shadow-2 mb-2" style={{ borderRadius: '1rem' }} />
        </div>
    )
}