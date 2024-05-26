import { cols, flattenData } from './ExportPDF';
import { priceFormat } from './StringFormat';

export const exportExcel = (data) => {
    import('xlsx').then((xlsx) => {
        const flattenedData = flattenData(data, cols);

        // Create a new worksheet with custom headers
        const worksheet = xlsx.utils.json_to_sheet(flattenedData);

        // Add custom headers
        const headers = cols.map(col => col.header);
        xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        // Calculate the total price
        const totalPrice = data.reduce((sum, row) => sum + (row.price || 0), 0);
        const formattedTotalPrice = priceFormat(totalPrice);

        // Add footer row with the total price
        const footer = new Array(headers.length).fill('');
        footer[headers.indexOf('Preço')] = `Total: ${formattedTotalPrice}`;
        xlsx.utils.sheet_add_aoa(worksheet, [footer], { origin: -1 });

        //  Adjust column widths
        const wscols = [
            { wch: 8 }, // "Id"
            { wch: 20 }, // "Title"
            { wch: 25 }, // "Company"
            { wch: 25 }, // "Announcer"
            { wch: 15 }, // "Date"
            { wch: 15 }, // "Duration"
            { wch: 15 }  // "Price"
        ];
        worksheet['!cols'] = wscols;
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, 'spots');
    });
};

const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, sheetFileName() + EXCEL_EXTENSION);
        }
    });
};

const sheetFileName = () => {
    const date = new Date().toLocaleDateString('pt-BR');
    var formattedDate = date.substring(3, 5) + '-' + date.substring(6, 10);

    return 'spots-' + formattedDate;
}