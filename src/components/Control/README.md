# Control

```tsx
    <Dashboard>
        <Control >
          <Input name="moninput2"/>
          <Input name="moninput3"/>

          <Radio optionType="button" name="myRadio" dataset='myuniquedatasetid' valueField='L_TYP_REG_DECHET' labelField='L_TYP_REG_DECHET'/>


        </Control>


        <Dataset 
          id="myuniquedatasetid" 
          provider={ademe_opendataProvider}
          resource='sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines'>
           <Transform>SELECT [L_TYP_REG_DECHET], SUM([TONNAGE_DMA]) as [TONNAGE_DMA] FROM ? GROUP BY [L_TYP_REG_DECHET] </Transform>
           <Producer url="https://www.sinoe.org">Ademe</Producer>
           <Producer url="https://odema-hautsdefrance.org/">Odema</Producer>
        </Dataset>

       {/* [...] */}
    </Dashboard>
```

Chaque élément de control (`Input`, `Radio`, etc..) **doit** avoir une propriété `name` unique.

## Utilisation des valeurs utilisateur

Le _hook_ `useControl` permet d'utiliser, de manière dynamique, les valeurs sélectionnées par l'utilisateur.
Les valeurs peuvent être injectés n'importe où dans le JSX : notamment dans des valeurs de filtres, des titres, du texte, etc.

```jsx
    <Dashboard>
        <Control >
          <Input name="annee"/>
        </Control>
        <Dataset {/* [...] */}>
          <Filter field="year">{useControl('annee')}</Filter>
        </Dataset>
        <div>{`Année sélectionnée : ${useControl('annee')}`}</div>

        <ChartPie title={`Répartition des observation en ${useControl('annee')}`}>
       {/* [...] */}
    </Dashboard>
```

## Composants 

### Radio et Select

Les propriétés `dataset`, `valueField` et `labelField` permettent de peupler les options 
avec les données d'un dataset. Ces données sont automatiquement dédoublonnées.
Il est aussi possible de saisir manuellement les options avec la propriété `options`.
Les propriétés initiales des composants [Radio.Group](https://ant.design/components/radio#radiogroup) et [Select](https://ant.design/components/select) de AntDesign sont supportées (`optionType`, `showSearch`, etc..). 


```tsx
    <Radio name="radio" dataset='myuniquedatasetid' valueField='L_TYP_REG_DECHET' labelField='L_TYP_REG_DECHET'/>
    <Select name="radio2" options={[{label:'A', value:'a'}, {label:'B', value:'b'}]}/>
```
### Input

### Slider

A venir

### NextPrevSelect

A venir

### SelectYear

A venir

### Swith / Checkbox

A venir