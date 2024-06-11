export function clearNumber(number) {
    const formattedNumber = number.replace(/\D/g, '');
    return formattedNumber;
}

export function formatPhoneNumber(rowData, columnName) {
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

export function priceFormat(rowData) {
    return 'R$ ' + rowData + ',00';
}

export function dateFormat(rowData, columnName) {
    if (rowData && rowData[columnName]) {
        const [year, month, day] = rowData[columnName].split('-').map(Number);
        const data = new Date(year, month - 1, day);
        return data.toLocaleDateString('pt-BR');
    }
    return '';
}

export function parseDate(date) {
    const [year, month, day] = date.split('-').map(Number);
    // month is 0-based in JavaScript Date, so we subtract 1 from month
    return new Date(year, month - 1, day);
}
