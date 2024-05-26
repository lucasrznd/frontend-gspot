import { dateFormat, priceFormat } from './StringFormat';
import logo from '../assets/images/logo-horizontal.png';

export const cols = [
    { field: 'id', header: 'Código' },
    { field: 'title', header: 'Título' },
    { field: 'company.name', header: 'Empresa' },
    { field: 'announcer.name', header: 'Locutor' },
    { field: 'date', header: 'Data' },
    { field: 'duration', header: 'Duração' },
    { field: 'price', header: 'Preço' }
];

const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

export function flattenData(data, columns) {
    return data.map(item => {
        const flattenedItem = {};
        columns.forEach(col => {
            let value;
            if (col.field.includes('.')) {
                const fields = col.field.split('.');
                value = item;
                fields.forEach(field => {
                    value = value ? value[field] : '';
                });
            } else {
                value = item[col.field];
            }

            // Transform string attributes to uppercase
            if (typeof value === 'string') {
                value = value.toUpperCase();
            }

            // Format date fields
            if (col.field === 'date' && value) {
                value = dateFormat(item, col.field);
            }

            if (col.field === 'price' && value) {
                value = priceFormat(value);
            }

            flattenedItem[col.field] = value;
        });
        return flattenedItem;
    });
};

export function exportPdf(data) {
    // Calculate total price
    const totalPrice = data.reduce((sum, item) => sum + item.price, 0);

    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default(0, 0);

            // Add the image to the header, centered
            const pageWidth = doc.internal.pageSize.getWidth();
            const imageWidth = 50; // Adjust this to your image's actual width
            const imageHeight = 20; // Adjust this to your image's actual height
            const imageX = (pageWidth - imageWidth) / 2; // Calculate the horizontal center position
            const imageY = 10; // Adjust the Y position as needed

            doc.addImage(logo, 'PNG', imageX, imageY, imageWidth, imageHeight);

            // Set the position for the table below the image
            const startY = imageY + imageHeight + 10;

            // Flatten the data
            const flattenedData = flattenData(data, cols);

            // Add a footer with the total price
            const footerRow = [{ id: '', title: '', 'contract.name': '', date: '', duration: 'Total', price: totalPrice }];

            doc.autoTable({
                startY: startY,
                columns: exportColumns,
                body: flattenedData,
                foot: flattenData(footerRow, cols), // Add the footer row
                didDrawPage: (data) => {
                    // You can add additional customizations to the footer here if needed
                }
            });
            doc.save(pdfFileName());
        });
    });
};

const pdfFileName = () => {
    const date = new Date().toLocaleDateString('pt-BR');

    var formattedDate = date.substring(3, 5) + '-' + date.substring(6, 10);

    return 'spots-' + formattedDate + '.pdf';
}