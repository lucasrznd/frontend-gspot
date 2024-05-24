export function formatarParaUppercase(rowData, columnName) {
    return rowData[columnName].toUpperCase();
}

export function cleanNumber(number) {
    const formattedNumber = number.replace(/\D/g, '');
    return formattedNumber;
}

export function formatarTelefone(rowData, columnName) {
    const cleanNumber = rowData[columnName].replace(/\D/g, '');

    // Verify if size have at least 10 digits
    if (cleanNumber.length < 10) {
        return rowData[columnName]; // Return original number if is invalid
    }

    // Formatting number
    const areaCode = cleanNumber.substring(0, 2);
    const part1 = cleanNumber.substring(2, 3);
    const part2 = cleanNumber.substring(3, 7);
    const part3 = cleanNumber.substring(7, 11);

    const formattedNumber = `(${areaCode}) ${part1} ${part2}-${part3}`;
    return formattedNumber;
}

export function formatarPreco(rowData) {
    return 'R$ ' + rowData + ',00';
}

export function formatarData(rowData, columnName) {
    if (rowData && rowData[columnName]) {
        const data = new Date(rowData[columnName]);
        return data.toLocaleDateString('pt-BR');
    }
    return '';
}