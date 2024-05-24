import { isImgUrl } from "../Validation";

describe('Validation', () => {
    it('should resolve to true when the image loads successfully', async () => {
        global.Image = class {
            constructor() {
                setTimeout(() => {
                    this.onload();
                }, 0);
            }
        };

        const result = await isImgUrl('https://blog.hubspot.com/hubfs/image8-2.jpg');
        expect(result).toBe(true);
    });

    it('should resolve to false when the image fails to load', async () => {
        global.Image = class {
            constructor() {
                setTimeout(() => {
                    this.onerror();
                }, 0);
            }
        };

        const result = await isImgUrl('http://example.com/image.jpg');
        expect(result).toBe(false);
    });
});
