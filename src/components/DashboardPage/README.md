# DashboardPage

Ce composant permet de rendre une mise en page de tableau de bord.
Il prend pour enfant des composants [DashboardElement](../DashboardElement/) et les dipose dans une grille 
(2 colonne sur ordinateur, 1 seule sur mobile).
Si au moins un des [DashboardElement](../DashboardElement/) a une pripriété `section`, le composant `DashboardPage` propose à l'utilisateur
des boutons permettants de naviguer entre les sections, en ajoutant une éventuelle section _Autres_.

Il est possible de lui passer une propriété `controle` contenant des **éléments de formulaire** (choix de l'année ou autres paramètres).
Ceux-ci seront affichées dans une barre en haut de la page.
![TODO](https://img.shields.io/badge/TODO-A%20compléter-orange)

La propriété `sections` est optionnelle :
- Si elle est omise, un bouton radio sera crée pour chaque section différente trouvée dans les `DashboardElement` enfants.
- Une liste de _string_ permet de forcer un certain ordre. Si une section est nommé 'Autres', elle contiendra également les enfants dont aucune section n'est spécifiée.
- Une liste d'objets ayant les propriété _key_, _libel?_ et _order?_ : permet de personnalisé l'ordre et le libellé de chaque section.

## Exemple 

```tsx
 <DashboardPage
    control={<MonFormulaireDeControle />} >

    <DashboardElement
        title="Mon graphique de démo"
        section="Catégorie 1"
        >
        <MonGraphique1 />
    </DashboardElement>

    <DashboardElement
        title="Un autre graphique de démo"
        section="Catégorie 2"
        >
        <MonGraphique2 />
    </DashboardElement>

</DashboardPage>
```

```tsx
 <DashboardPage
    control={<MonFormulaireDeControle />} 
    sections={['Panorama', 'Prévention', 'Valorisation', 'Stockage']} //Ici on force un certain ordre
    >

    {/* Composants enfants*/}

</DashboardPage>
```

```tsx
 <DashboardPage
    control={<MonFormulaireDeControle />} 
    sections={[{key: 'Prévention', order:5}, {key:'Panorama', libel:'Résumé', order:1}]} //Ici, les enfants ayant comme section "Panorama" seront affichés sous l'onglet "Résumé". Ce dernier sera en premier.
    >

    {/* Composants enfants*/}

</DashboardPage>
```