export function msgSucesso(toast, msg) {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: msg, life: 3000 });
}

export function msgInformativa(toast, msg) {
    toast.current.show({ severity: 'info', summary: 'Info', detail: msg, life: 3000 });
}

export function msgAviso(toast, msg) {
    toast.current.show({ severity: 'warn', summary: 'Aviso', detail: msg, life: 3000 });
}

export function msgErro(toast, msg) {
    toast.current.show({ severity: 'error', summary: 'Erro', detail: msg, life: 3000 });
}