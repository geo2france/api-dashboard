# File Provider

Ce fournisseur permet d'appeler directement une url retournant des données.
Il peut-être utilisé pour interroger un fichier statique ou une API non supportée par un autre fournisseur.

Une option `processData` peut être passée : il s'agit d'une fonction définit par l'utilisateur qui s'appliquera aux données
retournées par l'URL. Typiquement, celle-ci peut servir à extraire un tableau d'un fichier json : `{pets:[pet1, pet2, ... petN]} => [pet1, pet2, ... petN]`

L'url du provider et le nom de la ressource sont concatenés pour former l'url à interroger.

## Exemple

Interroger un fichier statique :

```tsx
onst myStaticFileProvider = FileProvider('https://raw.githubusercontent.com/LearnWebCode/json-example/refs/heads/master/', { processData : (e) => e.pets })
const pets = useApi({
    dataProvider:myStaticFileProvider,
    resource:'pets-data.json'
  }
)

console.log(pets.data?.data)
```

Interroger une API non supportée par un autre fournisseur, en modifiant dynamiquement l'URL :

```tsx
const sncf_opendataProvider = FileProvider('https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/',{ processData : (e) => e.results })
const group_by = 'origine';
const limit = 20;

const incidents = useApi({
    dataProvider:sncf_opendataProvider,
    resource:"incidents-de-securite-epsf/records?select=count(*)&group_by=${origine}&limit=${limit}"
  })

console.log(incidents.data?.data)
```

## Limitations

Les filtres ne sont pour l'instant pas supportés, ceux-ci doivent être fait mannuellement sur les données retournées par le provider ou côté client en modifiant les paramètres de l'URL (si l'API le permet).