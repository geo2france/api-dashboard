# Data provider

Un provider est un objet qui doit implémenter des fonctions d’accès aux données.
Il permet d’offrir une couche d’abstraction entre l’application et la source de données.

Il doit notamment contenir la fonction `getData` qui retourne une _Promise_ contenant les données.

