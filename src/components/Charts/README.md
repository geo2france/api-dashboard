# Charts

Graphiques standards prêts à être utilisés.

## Pie

Graphique "camembert".
Si des catégories sont dupliquées, les valeurs de celles-ci sont automatiquement sommées.
```jsx
<Dashboard>
    <Dataset 
        id="dma_collecte_traitement" 
        resource='sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines'
        url="https://data.ademe.fr/data-fair/api/v1/datasets"
        type='datafair'
        pageSize={5000}>
        <Filter field='L_REGION'>Hauts-de-France</Filter>
        <Filter field='L_TYP_REG_DECHET' operator='ne'>Encombrants</Filter>
        <Filter field='ANNEE'>{useControl('annee')}</Filter>
        <Transform>SELECT [L_TYP_REG_DECHET], [ANNEE], [C_DEPT], SUM([TONNAGE_DMA]) as [TONNAGE_DMA] FROM ? GROUP BY [ANNEE], [C_DEPT], [L_TYP_REG_DECHET]</Transform>
        <Transform>{(data) => data.map(row=>({pouette:4, ...row}))}</Transform>
        <Producer url="https://www.sinoe.org">Ademe</Producer>
        <Producer url="https://odema-hautsdefrance.org/">Odema</Producer>
    </Dataset>

    <ChartPie 
        // Identifiant du dataset (obligatoire si plusieurs dataset)
        dataset="destination-dma" 
        // Colonne qui contient les valeurs numériques
        dataKey='TONNAGE_DMA' 
        // Colonne qui contient les catégories
        nameKey='L_TYP_REG_DECHET'
        // Variante "donut" (trou central)
        donut 
    />

</Dashboard>
```
![pie screenshot](screenshot_pie.png)