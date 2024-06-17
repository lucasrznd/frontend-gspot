import { clearNumber } from "./StringFormat";

export function whatsappMessage(phoneNumber) {
    const url = `https://wa.me/${clearNumber(phoneNumber)}`;
    window.open(url, '_blank');
};