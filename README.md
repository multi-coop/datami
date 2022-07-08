![LOGO-GITRIBUTE](./src/assets/logo_GITRIBUTE_title.png)

<!-- <img src="./src/assets/logo_GITRIBUTE_title.png" alt="drawing" width="120" style="float: left; margin-right:10px"/> -->

---
<!-- # Gitribute -->
**Contribute easily with git**
_but without having to use Github or Gitlab interfaces_

---

## Summary

- [What is Gitribute for ?](#what-is-gitribute-for-)
- [Websites](#websites-)
- [Documentation](#documentation-)
- [Project setup](#project-setup-)
- [How to integrate the Gitribute widgets](#how-to-integrate-the-gitribute-widgets-)
- [Stack](#stack-)

---

## What is Gitribute for ? [⇡](#summary)

This project aims to create a serie of widgets to interact with ressources stored on Gitlab, Github, or mediawiki :

- **Edit data stored on github or gitlab** (`csv`, `md`, or `json` files) ;
- **Allow unidentified users to push on a separate branch** and automatically create a pull request ;
- **Create a set of components for modular uses** :
  - preview for `.csv`, `.md`, `.json` files or `mediawiki` ressources, with several choices for preview (table, cards list, ...) ;
  - files edition interfaces ;
  - dataviz for `.csv` files (barcharts, pies, ...) ;
  - user preferences: language, user token, ...
  - etc...
- **Web integration as modular web component**

---

## Websites [⇡](#summary)

### Prod deploy &nbsp; [![Netlify Status](https://api.netlify.com/api/v1/badges/1cd66edf-3b08-43db-bd21-6490377bb24a/deploy-status)](https://app.netlify.com/sites/multi-gitribute/deploys)

- Website (widgets demo) : [gitribute.multi.coop](https://gitribute.multi.coop/)

### Preprod deploy

- Preprod : [multi-gitribute (preprod)](https://preprod--multi-gitribute.netlify.app/)

---

## Documentation [⇡](#summary)

> WORK IN PROGRESS

Check out our website for a full documentation, technical and more !

- Documentation website : [gitribute-docs.multi.coop](https://gitribute.multi.coop)

---

## Project setup [⇡](#summary)

```bash
nvm use
npm install

# and copy the example .env file
cp example.env .env
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Run your unit tests

```bash
npm run test:unit
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

---

# Stack [⇡](#summary)

We only used open source packages and technologies, coz' that's what we do... :

- [`Vue.js` (2.x)](https://v2.vuejs.org/v2/guide) : yes we like this framework a lot...
- [`VueX`](https://vuex.vuejs.org/): the data store shared for every web component ;
- [`vue-custom-element`](https://github.com/karol-f/vue-custom-element): wrapper for vue web components ;
- [`gray-matter`](https://www.npmjs.com/package/gray-matter): package to convert `md` or `yaml` content to object ;
- [`Showdown`](https://www.npmjs.com/package/showdown) and [`showdown-table` extension](https://github.com/showdownjs/table-extension#readme): package to convert `md` content to `html` (see [docs for showdown extensions](https://github.com/showdownjs/showdown#extensions));
- [`Bulma`](https://bulma.io/) and [`Buefy`](https://buefy.org/) : as UI frameworks for vue ;
- [`Material Design`](https://materialdesignicons.com/) fonts: for icons ;
- [`Fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch): for requests to Github's or Gitlab's API ;
- [`JSDiff`](https://github.com/kpdecker/jsdiff) : to get diff between an original content and its edited version
- [`Diff2html`](https://www.npmjs.com/package/diff2html) : to display diff like in github / gitlab
- ...and a lot of Stackoverflow help...

---

An open source project by the coop **[multi](https://multi.coop)**
