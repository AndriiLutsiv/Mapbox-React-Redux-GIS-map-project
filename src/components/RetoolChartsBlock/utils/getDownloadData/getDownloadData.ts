export const getDownloadData = (data: any, props: string[]) => {
    const propsArr = [...props];

    const dataArr = data?.map((el: any) => {
        if(!propsArr.includes('scenario') && el.scenario?.label){
            propsArr.unshift('scenario');
        }

        if (!propsArr.includes('project') && el.project?.label) {
            propsArr.unshift('project');
        }
        return el.response.map((item: any) => {
            const obj = { ...item };
            if (el.scenario?.label) {
                obj.scenario = el.scenario.label;
            }

            if (el.project?.label) {
                obj.project = el.project.label;
            }
            return obj;
        })
    }
    )
        .flat(1);
    const headers = propsArr.map((el) => el.split("_").join(" "));

    const cvs = dataArr.map((el: any) => {
        return propsArr.map((prop) => el[prop]);
    });

    return [headers, ...cvs];

};