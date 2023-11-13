import { getLastPosition, getParamsFromURL } from './getLastPosition';
import { LAST_POSITION } from "./constants";

// Mocking global window object
window.location = {
    href: '',
    origin: 'https://example.com',
    pathname: '/path',
    search: '?zoom=10&x=50&y=60',
} as any;

type LocalStorageMock = {
    items: { [key: string]: string };
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
};

// Mocking local storage
const mockLocalStorage: LocalStorageMock = {
    items: {},
    getItem: function (key: string) {
        if (key === 'LAST_POSITION') {
            return 'zoom=10&x=10&y=20'; 
        }
        return this.items[key] || null;
    },
    setItem: function (key: string, value: string) {
        this.items[key] = value;
    },
    removeItem: function (key: string) {  
        delete this.items[key];
    },
    clear: function () {
        this.items = {};
    },
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });


describe('getParamsFromURL', () => {
    it('should parse the parameters correctly', () => {
        const mockUrl = 'https://example.com/path?zoom=10&x=50&y=60';
        const params = getParamsFromURL(mockUrl);  // NOTE: Make getParamsFromURL accessible for this test
        expect(params).toEqual({
            zoom: 10,
            x: 50,
            y: 60,
            url: mockUrl,
        });
    });

    it('should return undefined if values are not found in URL or localStorage', () => {
        window.location.href = '';
        localStorage.removeItem(LAST_POSITION);

        const result = getLastPosition();
        expect(result).toBeUndefined();
    });

    it('should return values from localStorage when URL doesn’t have them', () => {
        window.location.href = 'https://example.com/path';
        localStorage.setItem(LAST_POSITION, 'https://example.com/path?zoom=10&x=10&y=20');
        
        const result = getLastPosition();
        expect(result).toEqual({
            zoom: 10,
            x: 10,
            y: 20,
            url: 'https://example.com/path?zoom=10&x=10&y=20'
        });
    });

    it('should return undefined when currentUuid doesn’t match the UUID in localStorage', () => {
        window.location.href = 'https://example.com/path/uuid_value';
        localStorage.setItem(LAST_POSITION, 'https://example.com/path/different_uuid?zoom=10&x=10&y=20');
        
        const result = getLastPosition('uuid_value');
        expect(result).toBeUndefined();
    });

    it('should return values from localStorage even if currentUuid is not provided', () => {
        window.location.href = 'https://example.com/path/uuid_value';
        localStorage.setItem(LAST_POSITION, 'https://example.com/path/different_uuid?zoom=10&x=10&y=20');
        
        const result = getLastPosition();
        expect(result).toEqual({
            zoom: 10,
            x: 10,
            y: 20,
            url: 'https://example.com/path/different_uuid?zoom=10&x=10&y=20'
        });
    });
});
