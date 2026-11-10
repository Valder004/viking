# viking

Site construit avec [Astro](https://astro.build).

## Commandes

| Commande          | Action                                     |
| ----------------- | ------------------------------------------ |
| `npm install`     | Installe les dépendances                   |
| `npm run dev`     | Lance le serveur de dev sur `localhost:4321` |
| `npm run build`   | Génère le site dans `./dist/`              |
| `npm run preview` | Prévisualise le build                      |

## Structure

```
public/            fichiers statiques (favicon, images…)
src/
  components/      Header, Footer…
  layouts/         BaseLayout (head, header, footer)
  pages/           une route par fichier (index, a-propos, 404)
  styles/          global.css (variables, reset)
  consts.ts        nom du site, liens de navigation
```
