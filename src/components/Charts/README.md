# Charts

Graphiques standards prêts à être utilisés.

## Pie

Graphique "camembert".
```jsx
<Dashboard>
    <Dataset 
          id="destination-dma" 
          provider={ademe_opendataProvider}
          resource='sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines'>
      <Transform>SELECT [L_TYP_REG_DECHET], SUM([TONNAGE_DMA]) as [TONNAGE_DMA] FROM ? GROUP BY [L_TYP_REG_DECHET] </Transform>
    </Dataset>

    <ChartPie 
        // Identifiant du dataset
        dataset="destination-dma" 

        // Colonne qui contient les valeurs numériques
        dataKey='TONNAGE_DMA' 

        // Colonne qui contient les catégories
        nameKey='L_TYP_REG_DECHET'

        // Optionnel : Personnaliser le texte du label
        labelText={({value, percent, name}) => `${name} - ${Number(value).toLocaleString()} soit ${percent?.toLocaleString()}%`} 
        
        // Optionnel Cacher la légende
        legend={false} 
    />

</Dashboard>
```
![pie screenshot](screenshot_pie.png)