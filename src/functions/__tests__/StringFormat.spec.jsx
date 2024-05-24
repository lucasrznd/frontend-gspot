import { clearNumber, formatPhoneNumber } from "../StringFormat";

describe('formatacao', () => {
    it('should format a phone number with pattern 99999999999', () => {
        const phoneNumber = '99999999999';
        const formattedNumber = formatPhoneNumber({ phoneNumber: phoneNumber }, 'phoneNumber');
        expect(formattedNumber).toBe('(99) 9 9999-9999');
    });

    it('should clean a phone number with pattern (99) 9 9999-9999', () => {
        const phoneNumber = '(99) 9 9999-9999';
        const formattedNumber = clearNumber(phoneNumber);
        expect(formattedNumber).toBe('99999999999');
    });
});