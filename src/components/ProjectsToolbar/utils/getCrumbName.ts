export const getCrumbName = (index: number) => {
    if(index === 0) {
        return 'Areas'
    } else if (index === 1) {
        return 'Scenarios'
    } else {
        return 'Projects'
    }
}