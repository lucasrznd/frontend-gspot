export function formatarParaUppercase(rowData, columnName) {
    return rowData[columnName].toUpperCase();
}

export function cleanNumber(number) {
    const formattedNumber = number.replace(/\D/g, '');
    return formattedNumber;
}

export function formatarTelefone(rowData) {
    const numeroLimpo = rowData['telefone'].replace(/\D/g, '');

    // Verifica se o número possui pelo menos 10 dígitos
    if (numeroLimpo.length < 10) {
        return rowData['telefone']; // Retorna o número original se for inválido
    }

    // Formatação do número de telefone
    const codigoArea = numeroLimpo.substring(0, 2);
    const parte1 = numeroLimpo.substring(2, 3);
    const parte2 = numeroLimpo.substring(3, 7);
    const parte3 = numeroLimpo.substring(7, 11);

    const numeroFormatado = `(${codigoArea}) ${parte1} ${parte2}-${parte3}`;
    return numeroFormatado;
}
