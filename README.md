![LOGO-GITRIBUTE](./src/assets/logo_GITRIBUTE_title.png)

<!-- <img src="./src/assets/logo_GITRIBUTE_title.png" alt="drawing" width="120" style="float: left; margin-right:10px"/> -->

---
<!-- # Gitribute -->
**Contribute easily with git** (but without seeing it)

---

This project aims to create a serie of widgets to interact with Gitlab or Github :

- **Edit data stored on github or gitlab** (csv or md files) ;
- **Allow unidentified users to push on a separate branch** and automatically create a pull request ;
- **Create a set of components for modular uses** :
  - preview for `.csv`, `.md`, `.json` files, with several choices for preview (table, cards list, ...) ;
  - files edition ;
  - dataviz for `.csv` files (barcharts, pies, ...) ;
  - etc...
- **Web integration as modualr web component**

---

## Work in progress... be patient guys :)

This project is currently under early development...

The **roadmap** for a first proof of concept (POC) is the following :

- [x] Skeleton for `vue-custom-element` / `vuejs` : vuex, dependencies, linting, ... ;
- [x] First utils functions and mixins to process a file's gitlab/github url ;
  - [x] Get all git infos from file's url ;
  - [x] Get file's raw data from provider ;
- [ ] Install a CSS framework for Vuejs ( Bulma / Buefy / Vuetify... ? ) ;
- [ ] Prepare a simple multi-language / translation solution ;
- [ ] Create the first main components :
  - [ ] Preview for a `.md` file ;
  - [ ] Preview for a `.csv` file ;
  - [ ] Preview for a `.json` or `.geojson` file ;
  - [ ] Component to update user's token (if user has a specific one for direct commits) ;
- [ ] Create a "ghost user" on gitlab and github for test purposes, acting as anonymous gitlab/github users (with their token, injected in web component) ;
- [ ] `PUT` functions to update file stored on gitlab/github ;
- [ ] Other main components :
  - [ ] On each preview (for every file type), switch between preview and edition ;
  - [ ] `Save` button + dialog : after edition on client's side, acting as a commit to the file's git repo on a separate branch + merge request (commit and request by default done the "ghost user") ;

... and just for a POC, that's would be greaaaaat ...

---

An open source project by **[multi](https://multi.coop)**

---

## Project setup

```bash
nvm use
npm install
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

## How to integrate widgets

### CURRENTLY UNDER EARLY DEVELOPMENT

Widgets need two files in order to work :

- `app.js`
- `app.css`

Add those two files to your html head, like this if the widget code is deployed on `https://multi-gitribute-test.netlify.app`:

```html
<script src="https://multi-gitribute-test.netlify.app/js/app.js" type="text/javascript"></script>

<link type="text/css" href="ttps://multi-gitribute-test.netlify.app/js/app.css" rel="stylesheet">
```

Widgets can then be called directly into the page as custom html elements.

---

# Widgets config

The widget's tag is : `<multi-gitribute-file/>`

The widget takes several parameters, following this structure :

```html
  <multi-gitribute-file 
    locale="fr"
    gitfile="https://gitlab.com/multi-coop/gitribute-content-test/-/blob/main/texts/jailbreak-devient-multi-fr.md"
    msg="gitribute for gitlab file" 
    usertoken=""
  ></multi-gitribute-file>
```

---
