import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastMessages = () => {
    const toast = useRef(null);

    return (
        <Toast ref={toast} />
    );
}

export default ToastMessages;
