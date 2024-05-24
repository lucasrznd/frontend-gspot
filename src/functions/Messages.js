export function successMsg(toast, msg) {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: msg, life: 3000 });
}

export function infoMsg(toast, msg) {
    toast.current.show({ severity: 'info', summary: 'Info', detail: msg, life: 3000 });
}

export function warnMsg(toast, msg) {
    toast.current.show({ severity: 'warn', summary: 'Aviso', detail: msg, life: 3000 });
}

export function errorMsg(toast, msg) {
    toast.current.show({ severity: 'error', summary: 'Erro', detail: msg, life: 3000 });
}