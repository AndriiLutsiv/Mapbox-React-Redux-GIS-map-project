import { setFillAttr } from './setFillAttr';

describe('setFillAttr', () => {
    it('should add fill attribute when svg contains <path', () => {
        const svg = '<svg> <path d="M10 20 30 40"/> </svg>';
        const result = setFillAttr(svg);
        expect(result).toContain('fill="%COLOR%"');
    });

    it('should not add fill attribute when svg does not contain <path', () => {
        const svg = '<svg> <circle cx="50" cy="50" r="40"/> </svg>';
        const result = setFillAttr(svg);
        expect(result).not.toContain('fill="%COLOR%"');
    });

    it('should return the same string if svg does not contain <path', () => {
        const svg = '<svg> <circle cx="50" cy="50" r="40"/> </svg>';
        const result = setFillAttr(svg);
        expect(result).toEqual(svg);
    });

    it('should return a string with fill attribute at the correct position', () => {
        const svg = '<svg> <path d="M10 20 30 40"/> </svg>';
        const result = setFillAttr(svg);
        const expectedOutput = '<svg> <path fill="%COLOR%" d="M10 20 30 40"/> </svg>';
        expect(result).toEqual(expectedOutput);
    });
});
