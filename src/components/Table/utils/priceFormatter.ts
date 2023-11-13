export const priceFormatter = (price: number): string => {
    return (price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export const numberFormatter = (price: number): string => {
    return (price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}