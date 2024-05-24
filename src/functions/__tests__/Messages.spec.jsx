import { infoMsg } from "../Messages";

const mockShow = jest.fn();
const mockToast = {
  current: {
    show: mockShow
  }
};

describe('toastMessage', () => {
  it('should show a info toast message with the expected message', () => {
    const message = 'Test Message';
    infoMsg(mockToast, message);
    expect(mockShow).toHaveBeenCalledWith({ severity: 'info', summary: 'Info', detail: message, life: 3000 });
    expect(mockShow.mock.calls[0][0].detail).toBe(message);
  });
});