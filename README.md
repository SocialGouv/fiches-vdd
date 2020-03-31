# @socialgouv/fiches-vdd

Fiches vos droits et démarches au format JSON

| Dataset        | Url                                                                          |
| -------------- | ---------------------------------------------------------------------------- |
| particuliers   | https://lecomarquage.service-public.fr/vdd/3.0/part/zip/vosdroits-latest.zip |
| professionnels | https://lecomarquage.service-public.fr/vdd/3.0/pro/zip/vosdroits-latest.zip  |
| associations   | https://lecomarquage.service-public.fr/vdd/3.0/asso/zip/vosdroits-latest.zip |

:warning: Le package contient toutes les fiches soit ~500Mo de JSON.

## Usage

```js
const fiches = require("@socialgouv/fiches-vdd");

// liste des fiches associations disponibles
console.log(fiches.associations);

// récupérer une fiche en particulier
fiches.getFiche("associations", "F3180");

// index de toutes les fiches
const index = require("@socialgouv/fiches-vdd/data/index.json");
```

## Dev

Pour mettre à jour les fiches :

```
yarn
yarn fetch
```
