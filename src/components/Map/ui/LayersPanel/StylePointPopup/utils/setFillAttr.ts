export const setFillAttr = (svg: any) => {
    const splitted = svg.split(' ');
    const index = splitted.findIndex((el: any) => el === '<path');

    if (index !== -1) {
        splitted.splice(index + 1, 0, `fill="%COLOR%"`);
    }

    return splitted.join(' ')
}