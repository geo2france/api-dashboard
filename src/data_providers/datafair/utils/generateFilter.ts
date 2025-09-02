export const generateFilter = (filters?: any[]) => {
  const array_filter: string[] = []

  if (filters) {
    filters.map((filter) => {
      if (filter.operator !== "or" && filter.operator !== "and" && "field" in filter){ // LogicalFilter
        const value = (() => {switch (filter.operator){
          case "contains":
            return filter.value
          case "eq":
          case "ne":
            return `"${filter.value}"`
          case "startswith":
            return `${filter.value}*`
          case "endswith":
            return `*${filter.value}`
          case "in":
            return filter.value.join(' ')

        }})()

        const not = (() => {switch (filter.operator){
          case "ne":
          case "nstartswith" :
          case "nendswith":
          case "nin":
            return 'NOT '
          default:
            return ''
        }})();

        array_filter.push(`(${not}${filter.field}:${value})`)

      }else{ //Conditionnal filter
        throw new Error(
          `[datafair-data-provider]: Condtionnal filter 'OR' not implemented yet `
          ); 
      }
    });


  }

  return array_filter.join(' AND ');
};
