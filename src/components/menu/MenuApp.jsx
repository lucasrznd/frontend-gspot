import React, { useState } from 'react';
import logo from '../../../src/assets/images/logo-horizontal.png';
import { MegaMenu } from 'primereact/megamenu';
import { Button } from 'primereact/button';
import SidebarApp from './SidebarApp';

export default function MenuApp() {
    const [visibleRight, setVisibleRight] = useState(false);

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

    const end = <>
        <Button icon="pi pi-bars" rounded text severity="secondary" onClick={() => setVisibleRight(true)} />
    </>

    return (
        <div className="card">
            <MegaMenu model={items} orientation="horizontal" start={start} end={end} breakpoint="600px" className="p-3 surface-0 shadow-2 mb-2" style={{ borderRadius: '1rem' }} />
            <SidebarApp visibleRight={visibleRight} setVisibleRight={setVisibleRight} />
        </div>
    )
}