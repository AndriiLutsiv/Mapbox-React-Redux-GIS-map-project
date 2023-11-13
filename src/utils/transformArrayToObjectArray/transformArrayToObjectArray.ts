export const transformArrayToObjectArray = (arr: any) => {
  const result = [];

  const propNames = [
    "scenario",
    "UPRNCount",
    "herculesCAPEX",
    "herculesOPEX",
    "cpppAverage",
    "possibleRevenues",
    "uniqueProjects",
  ];

  if (arr.length > 0) {
    const keys = arr[0];
    const valueArrays = arr.slice(1);

    for (let i = 0; i < keys.length; i++) {
      const obj = { [propNames[0]]: keys[i] };

      for (let j = 0; j < valueArrays.length; j++) {
        obj[propNames[j + 1]] = valueArrays[j][i];
      }

      result.push(obj);
    }
  };

  const newArr = [];
  for (let i = 0; i < result.length; i = i + 2) {
    const nextObj = result[i + 1];
    if (nextObj) {
      for (const key in nextObj) {
        if (key !== "scenario" && key !== "uniqueProjects") {
          result[i][key + "_delta"] = nextObj[key];
        }
      }
    }

    newArr.push(result[i]);
  }

  return newArr;
}