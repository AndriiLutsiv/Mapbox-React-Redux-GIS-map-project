export const getArrayOfUniqueValues = (value: any[]) => {
    return Array.from(new Set(value));
}