import { cleanNumber, formatarParaUppercase, formatarTelefone } from "../Formatacao";

describe('formatacao', () => {
    it('should format a phone number with pattern 99999999999', () => {
        const phoneNumber = '9999999-9999';
        const formattedNumber = formatarTelefone({ telefone: phoneNumber });
        expect(formattedNumber).toBe('(99) 9 9999-9999');
    });

    it('should clean a phone number with pattern (99) 9 9999-9999', () => {
        const phoneNumber = '(99) 9 9999-9999';
        const formattedNumber = cleanNumber(phoneNumber);
        expect(formattedNumber).toBe('99999999999');
    });

    it('should transform string to uppercase', () => {
        const person = { name: 'Lucas', gender: 'male' };
        const formattedString = formatarParaUppercase(person, 'gender');
        expect(formattedString).toBe('MALE');
    });
});