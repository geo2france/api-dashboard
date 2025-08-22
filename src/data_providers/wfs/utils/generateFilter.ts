import { CrudOperators } from "../../types";


const map_ogc_filer = (input:CrudOperators) => {
  switch (input) {
    case "eq":
    case "ne":
      return "PropertyIsEqualTo"
    case "gt":
      return "PropertyIsGreaterThan"
    case "gte":
      return "PropertyIsGreaterThanOrEqualTo"
    case "lt":
      return "PropertyIsLessThan"
    case "lte":
      return "PropertyIsLessThanOrEqualTo"
    case "contains":
    case "containss":
    case "ncontains":
    case "ncontainss":
    case "startswith":
    case "startswiths":
    case "nstartswith":
    case "nstartswiths":
    case "endswith":
    case "endswiths":
    case "nendswith":
      return "PropertyIsLike"
    default:
        throw new Error(
          `[wfs-data-provider]: Unssuported operator ${input}`
          ); 
  }
}

export const generateFilter = (filters?: any[]) => {
  let bbox: string = ''
  let ogc_filter: string = ''
  if (filters && filters.length > 0) {
    const doc = document.implementation.createDocument('', 'Filter', null)
    //doc.documentElement.setAttribute('xmlns:fes',"http://www.opengis.net/fes/2.0") // Namespace pour WFS 2
    const and = doc.createElement( 'And' )
    let filters_root
    if (filters.length > 1) {
          doc.documentElement.appendChild(and)
          filters_root = and
    }else{
        filters_root = doc.documentElement
    }

    filters.map((filter) => {

      if (filter.field === "geometry"){ // TODO utiliser les filtres OGC pour filtrage geom ?
          bbox = filter.value;
          return
      }

      if (filter.operator === "or" && filter.operator === "and"){
          throw new Error(
          `[wfs-data-provider]: Condtionnal filter 'OR' not implemented yet `
          ); 
      }
      const f = doc.createElement( map_ogc_filer(filter.operator) )

      let el = doc.createElement('PropertyName') // ValueReference sur WFS 2 ?
      el.textContent = filter.field
      f.appendChild(el)

      el = doc.createElement('Literal')

      if ((["contains","containss","ncontains","ncontainss",
        "startswith","startswiths","nstartswith","nstartswiths",
        "endswith","endswiths", "nendswith","nendswiths" // Opérateurs match
      ].includes(filter.operator))){
        f.setAttribute('wildCard', '%');
        f.setAttribute('singleChar', '_');
        f.setAttribute('escapeChar', '\\');
        f.setAttribute('matchCase', 'false');
      }

      if (([ "containss","ncontainss", 
        "startswiths","nstartswiths",
        ,"endswiths", ,"nendswiths" // Opérateurs case-sensitve
      ].includes(filter.operator))){
        f.setAttribute('matchCase', 'true');
      }
      
      if (["contains","containss","ncontains","ncontainss"].includes(filter.operator)){
        el.textContent = `%${filter.value}%`
      }
      else if (["startswith","startswiths","nstartswith","nstartswiths"].includes(filter.operator)){
        el.textContent = `${filter.value}%`
      }
      else if (["endswith","endswiths", "nendswith","nendswiths"].includes(filter.operator)){
        el.textContent = `%${filter.value}`
      }
      else{
        el.textContent = filter.value
      }

      f.appendChild(el)

      if (filter.operator.startsWith('n')){ // Opérateur NOT
        const not = doc.createElement( 'Not' )
        not.appendChild(f)
        filters_root.appendChild(not)
      }else{
        filters_root.appendChild(f)
      }

    })


    ogc_filter =  new XMLSerializer().serializeToString(doc)
    //console.log('xml', ogc_filter)

  }

  return {filter : ogc_filter, bbox:bbox};
};
