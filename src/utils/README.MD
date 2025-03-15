# Hooks et fonctions

### useApi

Permet de récupérer des données depuis un [Dataprovider](/src/data_providers/).
Paramètres : 
- _resource_ (jeu de données)
- _filters_
- _sorters_
- _pagination_
- _meta_
- _staleTime_ 
- _enabled_ 

Retourne les données et différentes informations sur la requête, voir [useQuery](https://tanstack.com/query/v4/docs/framework/react/reference/useQuery). TODO : Détailler les variables les plus utiles plutôt que de renvoyer vers useQuery.

Par défaut, le _staleTime_ est à 5 minutes. Cela permet d'alléger le serveur en s'assurant que la même requête n'est pas effectuée plus d'une fois par tranche de 5 minutes (sauf si l'utilisateur rafraîchit manuellement la page).

Exemple : 
```tsx 
const ademe_opendataProvider = DatafairProvider("https://data.ademe.fr/data-fair/api/v1/datasets") ;

const {data, isFetching} = useApi({
            resource:"sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines",
            dataProvider:ademe_opendataProvider,
            pagination: {
                pageSize: 2000,
            },
            filters:[
                {
                    field:"C_REGION",
                    operator:"eq",
                    value:'32'
                },
                {
                    field:"L_TYP_REG_DECHET",
                    operator:"ne",
                    value:'Déblais et gravats'
                }
            ]
    });

console.log(data.data);
```

### useChartEvents

Le hook `useChartEvents` permet de définir des fonctions callback à executer au click (_onClick_) ou au survol (_onFocus_) des graphiques.
Le callback reçoit comme paramètres un objet qui contient des informations sur l'élément qui l'a déclanché (nom de la série, données, etc.). La structure de l'objet varie selon le type de graphique.
La fonction _onFocus_ est également appelée lorsque le pointeur **quitte** l'élément (_mouse-out_) avec un paramètre _null_.

Généralement, le callback sera une fonction qui va modifier un état (_state_) du parent (_setState_).


Exemple :
```tsx

 const [focus, setFocus] = useState<string | undefined>(undefined) // Etat qui stock le nom de la catégorie sur laquelle le focus est porté


 const MyChart: React.FC = ({onFocus}) => {
    useChartEvents({chartRef:chartRef, onFocus:onFocus}) // Lors du survol, la fonction onFocus est appelée et met à jour l'etat.

    [...]
    return(
        <ReactECharts
        option={option} ref={chartRef} style={{ ...style, marginTop:"0px"}}/>
    )
 }


 <MyChart 
    onFocus={(e) => setFocus(e?.name)} />
```

### useChartActionHightlight

Le hook `useChartActionHightlight` permet de manuellement mettre en évidence (_highlight_) une portion du graphique.
L'élement à éclairer peut-être défini par son nom ou le nom de sa série (ou plus rarement son index).

TODO : Exemple concret avec _bar_ et _pie_ et cas d'usage.

Notes : le _hilight_ est un effet subtil. Souvent on privilégiera un changement de couleur pour mettre en évidence une information importante (par exemple l'année sélectionnée).
Le _hilight_ sera plus souvent utilisé pour mettre un évidence un élément similaire à plusieurs graphique lors du survol d'un des deux graphique.


### useSearchParamsState

Récuperer des états depuis l'URL et met à jours l'URL en cas de modification des états. C'est l'équivalent de [useState](https://react.dev/reference/react/useState) mais avec synchronisation de l'URL. 
Utile pour permettre aux utilisateurs de partager un tableau de bord avec ces états (filtres, etc.).

Exemple :
```Typescript
    //Syncronise la variable 'year' avec le paramètre 'annee' de l'URL
    const [year, setYear] = useSearchParamsState('annee','2021')  
```

### useChartExport

Obtenir l'export image (img64) d'un composant ECharts ou MapLibre dont la référence `chartRef` est passé en paramètre.
L'image peut ensuite être proposée en téléchargement à l'utilisateur (ou utilisée d'une autre manière).

Exemple : 
```typescript
const {img64, exportImage} = useChartExport({chartRef:chartRef})

const downloadImage = () => { // Fonction déclenchée au click de l'utilisateur
   exportImage()
   setRequestDlImage(true)
}

useEffect(() => { //Proposer le téléchargement d'une image générée.
    if(img64 && requestDlImage){
        const link = document.createElement('a');
        link.href = img64;
        link.download = `${title}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setRequestDlImage(false)
    }
}, [img64])
```


### useMapControl

Ajouter un control (élément HTML) sur une carte.

