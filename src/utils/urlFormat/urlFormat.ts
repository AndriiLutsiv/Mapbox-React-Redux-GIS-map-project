export const urlFormat = (data: any) => {
    const urlParams = [];

    for (const key in data) {
        if (Array.isArray(data[key])) {
            urlParams.push(...data[key].map((value: any) => `${key}=${value}`));
        } else {
            urlParams.push(`${key}=${data[key]}`);
        }
    }

    return urlParams.join('&');
}