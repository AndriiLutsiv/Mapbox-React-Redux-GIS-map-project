export const filterArray:(arr: any, searchValue?: {str: string, key: string} | null, areaId?: null | number[]) => any = (arr = [], searchValue = {str: '', key: 'description'}, areaId = null) => {
    let filtered = arr.slice();

    if (searchValue !== null && searchValue.key.length && searchValue.str.length) {
        filtered = filtered.filter((item: any) =>
            item[searchValue.key]?.toLowerCase().includes(searchValue.str.toLowerCase())
        );
    }

    if (areaId !== null && areaId) {
        filtered = filtered.filter((item: any) => areaId === item?.area_id);
    }

    return filtered;
}