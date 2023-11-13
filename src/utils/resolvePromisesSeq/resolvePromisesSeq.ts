export const resolvePromisesSeq = async (data: Promise<any>[]) => {
    const results = [];
    for (const item of data) {
        results.push(await item);
    }

    return results;
};