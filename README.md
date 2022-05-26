![LOGO-GITRIBUTE](./src/assets/logo_GITRIBUTE_title.png)

<!-- <img src="./src/assets/logo_GITRIBUTE_title.png" alt="drawing" width="120" style="float: left; margin-right:10px"/> -->

---
<!-- # Gitribute -->
**Contribute easily with git** (but without having to use Github or Gitlab interfaces)

---

## Summary

- [What is Gitribute for ?](#what-is-gitribute-for-)
- [Roadmap](#roadmap-)
- [Websites](#websites-)
- [Project setup](#project-setup-)
- [How to integrate the Gitribute widgets](#how-to-integrate-the-gitribute-widgets-)
- [Widgets configuration](#widgets-configuration-)
  - ["multi-gitribute-file" widget](#1-multi-gitribute-file-)
    - [Options parameters for gitribute-file](#options-parameters-for-gitribute-file-)
    - [Parameters for all file types](#parameters-for-all-file-types-)
    - [Parameters for `md` files](#parameters-for-md-files-)
    - [Parameters for `json` and `geojson` files](#parameters-for-json-and-geojson-files-)
    - [Parameters for `csv` and `tsv` files](#parameters-for-csv-and-tsv-files-)
  - ["multi-gitribute-explowiki" widget](#2-multi-gitribute-explowiki-)
    - [Options parameters for explowiki](#options-parameters-for-explowiki-)
    - [Parameters for `mediawiki` type](#parameters-for-mediawiki-type-)
- [Stack](#stack-)
- [Schema / architecture](#schema-architecture-)

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

## Roadmap [⇡](#summary)

**Work in progress... be patient guys (or help us by contributing) :)**

This project is currently under early development...

The **roadmap** for a first proof of concept (POC) is the following :

- [x] Skeleton for `vue-custom-element` / `vuejs` : vuex (shared store between all web components), dependencies, linting, ... ;
- [x] First utils functions and mixins to process a file's gitlab/github url ;
  - [x] Get all git infos from file's url ;
  - [x] Get file's raw data from provider ;
  - [x] Format file's raw data to expected structures (from `md`, `csv`, `json`, `mediawiki` to objects) ;
- [x] Install a CSS framework for Vuejs ( Bulma + Buefy ) ;
- [x] Prepare a simple multi-language / translation solution (i18n not adapted for our purposes);
- [x] Create the first main components :
  - [x] For each file type create a loading skeleton while waiting raw file to finish loading ;
  - [x] Preview for a `.md` file ;
  - [x] Preview for a `.csv` file ;
  - [x] Preview for a `.json` or `.geojson` file ;
  - [x] Preview for a list of `mediawiki` ressources, converted as pseudo-table ;
  - [x] Component to update user's token (if user has a specific one for direct commits) ;
  - [x] Component to switch between `french` and `english` for now ;
- [x] Create a "ghost user" on gitlab and github for test purposes, acting as anonymous gitlab/github users (with their token, injected in web component) ;
- [ ] Other main components :
  - [x] On each preview (for every file type), switch between 'preview' and 'edition' views ;
    - [x] for `csv` files (`.csv` and `.tsv` types)
    - [x] for `text` files (`.md` types)
    - [x] for `json` files (`.json` and `.geojson` types)
    - [x] for `mediwiki` ressources (only preview for now)
  - [x]  Add an `Upload` button + dialog + actions to overwrite whole edited data ;
  - [x]  Add a `lockHeaders` options in widget to only protect keys from edition ;
  - [ ]  Add a `Save` button + dialog + actions :
    - [x] `POST` create a separate branch on the file's repo ;
    - [x] `PUT` after edition on client's side, acting as a commit to the file's git repo on a separate branch ;
    - [ ] create a merge request (commit and request by default done the "ghost user") ;
- [x] Deploy on Netlify for test purposes => [test deploy here](https://multi-gitribute-test.netlify.app/)
- [ ] A good documentation for each web component (at least in this readme for now)

... and just for a POC, that would be greaaaaat ...

---

## Websites [⇡](#summary)

### Test deploy

Website : [multi-gitribute-test](https://multi-gitribute-test.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/693b562e-5ff8-4101-9cdb-157f7be2d3d2/deploy-status)](https://app.netlify.com/sites/multi-gitribute-test/deploys)

---

An open source project by **[multi](https://multi.coop)**

---

## Project setup [⇡](#summary)

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

## How to integrate the Gitribute widgets [⇡](#summary)

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

# Widgets configuration [⇡](#summary)

We plan to develop several widgets, all able to interact but also being able to be used independently.

---

## 1. `<multi-gitribute-file>` [⇡](#summary)

The first widget's tag is : `<multi-gitribute-file/>`

This widget allows to preview and edit a file stored on Gitlab or Github.

The widget takes several parameters, following this structure :

```html
  <!-- Example for loading and contribute to a distant .md file from Gitlab -->
  <multi-gitribute-file 
    gitfile="https://gitlab.com/multi-coop/gitribute-content-test/-/blob/main/texts/jailbreak-devient-multi-fr.md"
    title="gitribute for gitlab file" 
    usertoken="MY-USER-TOKEN or GHOST-USER-TOKEN"
    locale="fr"
  ></multi-gitribute-file>
```

```html
  <!-- Example for loading and contribute to a distant .csv file from Github -->
  <multi-gitribute-file
    gitfile="https://github.com/multi-coop/gitribute-content-test/blob/main/data/csv/test-table-comma.csv" 
    options='{
      "separator":","
      "pagination":{
        "itemsPerPage":5
      },
      "cardsview": { "activate": true, "default": true },
      "cardsdetail": true,
      "cardssettings": {
        "mini": {
          "name": {"position": "title"},
          "surname": {"position": "title"},
          "profession": {"position": "resume"}
        },
        "detail": {
          "name": {"position": "title"},
          "surname": {"position": "title"},
          "profession": {"position": "desription"}
        }
      }
    }' 
    title="gitribute for gitlab file - csv (comma separator)" 
    usertoken="MY-USER-TOKEN or GHOST-USER-TOKEN"
    locale="en"
    debug="false"
  ></multi-gitribute-file>
```

### Options parameters for gitribute-file [⇡](#summary)

This widget can take several parameters, some of them depends on your input file's type (`csv`, `json`, `md`, ...)

#### Parameters for all file types [⇡](#summary)

##### `gitfile` parameter

```yaml
gitfile:
  - description : the URL of a file stored on Gitlab or Github
  - type: string
  - required: true
  - note: |
    if you know the adress of a file on Github or Gitlab, 
    just copy-paste the url from your browser
```

##### `title` parameter

```yaml
title:
  - description : the file title you want to display on top of the widget
  - type: string
  - required: false
  - default: null
```

##### `usertoken` parameter

```yaml
usertoken:
  - description : the user token allowing to commit / update a file on its repo
  - type: string
  - required: false
  - default: null
  - note: |
    If null, you can only read the file and not update it. 
    To be allowed to push on the file's repo you'll have at least 
    to create a ghost user acting as an anonymous contributor 
```

**Notes**

The `usertoken` parameter is one of the most important features of this project. You will need a private token to push to a repository and make all the operations we want to automatize for an open contribution :

- **Create a new branch** againt a reference branch ;
- **Push a commit** to the new branch ;
- **Create a merge request** from the new branch onto the reference branch.

Our strategy to simplify those operations for 'normal' people (who does not give a s*** about git) was to create one or several "ghost users", so we could set the repositories' permissions and tokens in advance.

In order to deploy a Gitribute demo on a domain we chose to store those tokens on an `.env` file, based on the `example.env` file at the project's root. So you can have several strategies to inject a default token :

- create an `.env` file, but you will have to deploy your own instance of Gitribute ;
- copy-paste the html block, filling the widget's `usertoken` parameter ;
- leave all blank and ask your users to create their own tokens on Gitub or Gitlab...

So you can read more on those topics here =>

- More about **Gitlab** :
  - API documentation : [docs](https://docs.gitlab.com/ee/api/)
  - Create a private token : [docs](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
  - Manage permissions : [docs](https://docs.gitlab.com/ee/user/permissions.html)
- More about **Github** :
  - API documentation : [docs](https://docs.github.com/en/rest)
  - Create a private token : [docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
  - Manage permissions : [docs](https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-roles-for-an-organization)

##### `locale` parameter

```yaml
"locale":
  - description : the language you want to use by default
  - required: false
  - type: string
  - default: 'en'
  - allowed values: [ 'en', 'fr' ]
  - notes: |
    This parameter allows you to inject a locale component by componenet.
    But we'll have a selector to allow the user to apply a locale globally, overiding default injected locales.
```

##### `onlypreview` parameter

```yaml
"onlypreview":
  - description : displays only the preview and hide the edit mode
  - required: false
  - type: boolean
  - default: false
```

##### `debug` parameter

```yaml
"debug":
  - description : just for debugging
  - required: false
  - type: boolean
  - default: false
```

### Parameters for `md` files [⇡](#summary)

##### `options` parameter

```yaml
"options":
  - (no options for now)
```

### Parameters for `json` and `geojson` files [⇡](#summary)

##### `options` parameter

```yaml
"options":
  - description : JSON object containing the options allowing your json to be parsed correctly
  - required: false
  - default: {
      "defaultDepth": 3,
    }
  - fields: 
    - "defaultDepth": 
      description: default visible depth of the JSON preview
      type: number | "all"
    - "allowKeyEdit": 
      description: allow objects' key edition (edit or remove)
      type: boolean
```

### Parameters for `csv` and `tsv` files [⇡](#summary)

##### `options` parameter

```yaml
"options":
  - description : JSON object containing the options allowing your csv to be parsed correctly
  - required: false
  - default: {
      "separator": ";",
      "tagseparator": "-",
      "pagination": {
        "itemsPerPage": 5
      },
      "cardsview": false,
    }
  - fields: 
    - "separator": 
      description: character separating the columns in your csv source
      type: string
      allowed values: [ ",", ";", "|", "\t" ]
    - "lockcolumns": 
      description: allows to edit columns' label
      default: false
      type: boolean
    - "tagseparator": 
      description: character separating a column's values into tags
      type: string
      allowed values: [ ",", ";", "|", "-", "_" ]
    - "pagination": 
      description: pagination settings
      type: object
      fields:
      - "itemsPerPage":
        description: number of items per page
        default: 20
        type: number
        notes: 
        - must be > 1 and within allowed values, or a default value will be used (the closest value from allowed values array)
        - values : [3, 5, 10, 15, 20, 25, 50, 100]
    - "cardsview":
      description: allows cards view on a table data
      type: boolean || object
      default: false
      notes: |
        You can pass an object instead of a boolean value if you need to display the cards view by default, with :
        { "activate": true, "default": true }
    - "cardsdetail":
      description: allows cards detailled view on a table data
      type: boolean
      default: false
    - "cardssettings":
      description: |
        Mandatory settings to display table data, field by field, in a card view. 
        You can chose to display data diffently between "mini" card view (tiles) and the "detailled" card view...
        For "mini" and "detail" entries you have to map a key from your original data (f.i. the "name" column) to a position in the cards (f.i. apply the "name" value to the "title")
      type: object
      default: {
        "mini": {
          "<KEY-COLUMN>": {"position": "<POSITION-IN-CARD>"},
          ...
        },
        "detail": {
          "<KEY-COLUMN>": {"position": "<POSITION-IN-CARD>"},
          ...
        }
      }
      notes: The possible positions in cards are for now te following :
        - "title"
        - "subtitle"
        - "content"
        - "resume"
        - "description"
        - "image" (needs an url to an image)
```

## 2. `<multi-gitribute-explowiki>` [⇡](#summary)

The second widget's tag is : `<multi-gitribute-explowiki/>`

This widget allows to preview a set of ressources from a mediawiki.

The widget takes several parameters, following this structure :

```html
  <!-- Example for loading and contribute to a distant mediawiki ressource -->
  <multi-gitribute-explowiki 
    wikilist="https://wiki.lafabriquedesmobilites.fr/wiki/Sp%C3%A9cial:WfExplore?title=Sp%C3%A9cial%3AWfExplore&page=1&wf-expl-Category-Projet=on&wf-expl-Page_creator-fulltext=&wf-expl-Tags="
    options='{<YOUR-OPTIONS>}'
    title="gitribute for explowiki :)"
    usertoken="MY-USER-TOKEN or GHOST-USER-TOKEN"
    locale="fr"
  ></multi-gitribute-explowiki>
```

```html
  <!-- Example for loading and contribute to a distant mediawiki ressource -->
  <multi-gitribute-explowiki
      wikilist="https://wiki.lafabriquedesmobilites.fr/wiki/Sp%C3%A9cial:WfExplore?title=Sp%C3%A9cial%3AWfExplore&page=1&wf-expl-Category-Projet=on&wf-expl-Page_creator-fulltext=&wf-expl-Tags="
      wikipages='[
        "https://wiki.lafabriquedesmobilites.fr/wiki/Accra_Mobile",
        "https://wiki.lafabriquedesmobilites.fr/wiki/Agremob_Self_Data_Territorial_La_Rochelle",
        "https://wiki.lafabriquedesmobilites.fr/wiki/Autonomous_Kart_for_Student"
      ]'
      options='{
        "wikisettings": {
          "category": "projet",
          "fields": [
            "url",
            "description",
            "shortDescription",
            "Main_Picture",
            "Coordonnées géo",
            "needs",
            "referent",
            "communauté d&#39;intérêt",
            "Titre",
            "Tags",
            "etape",
            "Theme",
            "location",
            "from",
            "challenge"
          ],
          "tagfields": [
            "Tags",
            "Theme",
            "location",
            "from",
            "challenge"
          ]
        },
        "pagination": {
          "itemsPerPage":12
        },
        "cardsview": { "activate": true, "default": true },
        "cardssettings": {
          "mini": {
            "title": {"position": "title"},
            "imageUrl": {"position": "image"},
            "shortDescription": {"position": "resume"}
          },
          "detail": {
            "title": {"position": "title"},
            "imageUrl": {"position": "image"},
            "shortDescription": {"position": "resume"},
            "description": {"position": "description"}
          }
        }
    }'
    title="gitribute for gitlab file - csv (comma separator)" 
    usertoken="MY-USER-TOKEN or GHOST-USER-TOKEN"
    locale="en"
    debug="false"
  ></multi-gitribute-explowiki>
```

### Options parameters for explowiki [⇡](#summary)

This widget can take several parameters for a mediawiki ressources

#### Parameters for mediawiki type [⇡](#summary)

##### `wikilist` parameter

```yaml
wikilist:
  - description : the URL of a page of mediawiki website or mediawiki list of ressources
  - type: string
  - required: true
  - note: |
    if you know the adress of a mediawiki ressources, 
    just copy-paste the url from your browser
```

##### `wikipages` parameter

```yaml
wikipages:
  - description : list of  mediawiki pages' URL
  - type: array of urls
  - required: false
  - note: |
    if you know the adress of a mediawiki ressources, 
    just copy-paste the url from your browser
```

##### `title` parameter

```yaml
title:
  - description : the file title you want to display on top of the widget
  - type: string
  - required: false
  - default: null
```

##### `usertoken` parameter (not implemented yet)

```yaml
usertoken:
  - description : the user token allowing to commit / update a file on the wiki
  - type: string
  - required: false
  - default: null
  - note: |
    If null, you can only read the ressources and not update them. 
    To be allowed to push revisions on the mediawiki website
    you'll have at least to create a "ghost user"
    acting as an anonymous contributor 
```

**Notes**

The `usertoken` parameter is one of the most important features of this project. You will need a private token to post revisions to a mediawiki website and make all the operations we want to automatize for an open contribution :

So you can read more on those topics here =>

- More about **mediawiki API** :
  - API documentation : [docs](https://www.mediawiki.org/wiki/API:Main_page)
  - Create a private token : [docs](https://www.mediawiki.org/wiki/API:Tokens)

##### `locale` parameter

```yaml
"locale":
  - description : the language you want to use by default
  - required: false
  - type: string
  - default: 'en'
  - allowed values: [ 'en', 'fr' ]
  - notes: |
    This parameter allows you to inject a locale component by componenet.
    But we'll have a selector to allow the user to apply a locale globally, overiding default injected locales.
```

##### `onlypreview` parameter

```yaml
"onlypreview":
  - description : displays only the preview and hide the edit mode
  - required: false
  - type: boolean
  - default: false
```

##### `debug` parameter

```yaml
"debug":
  - description : just for debugging
  - required: false
  - type: boolean
  - default: false
```

##### `options` parameter

```yaml
"options":
  - description : JSON object containing the options allowing your mediawiki ressources to be parsed correctly
  - required: true
  - default: {
      "wikisettings": {
        "category": "projet",
        "fields": [
          "url",
          "description",
          "shortDescription",
          "Main_Picture",
          "Tags"
        ],
        "tagfields": [
          "Tags"
        ]
      },
      "pagination": {
        "itemsPerPage":12
      },
      "pagination": {
        "itemsPerPage": 5
      },
      "cardsview": { "activate": true, "default": true },
      "cardssettings": {
        "mini": {
          "title": {"position": "title"},
          "imageUrl": {"position": "image"},
          "shortDescription": {"position": "resume"}
        },
        "detail": {
          "title": {"position": "title"},
          "imageUrl": {"position": "image"},
          "shortDescription": {"position": "resume"},
          "description": {"position": "description"}
        }
      }
    }
  - fields:
    - "wikisettings"
      description: settings to retrieve and parse mediawiki ressources
      type: object
      fields:
        - "category"
          description: the name of the ressources' category to retrieve
          required: true
          type: string
        - "fields"
          description: list of fields you want to parse from the wikitext format
          required: true
          type: [ string ]
      - "tagfields"
          description: list of fields you want to parse as tags
          type: [ string ]
    - "pagination": 
      description: pagination settings
      type: object
      fields:
      - "itemsPerPage":
        description: number of items per page
        default: 20
        type: number
        notes: 
        - must be > 1 and within allowed values, or a default value will be used (the closest value from allowed values array)
        - values : [3, 5, 10, 15, 20, 25, 50, 100]
    - "cardsview":
      description: allows cards view on a table data
      type: boolean || object
      default: false
      notes: |
        You can pass an object instead of a boolean value if you need to display the cards view by default, with :
        { "activate": true, "default": true }
    - "cardsdetail":
      description: allows cards detailled view on a table data
      type: boolean
      default: false
    - "cardssettings":
      description: |
        Mandatory settings to display table data, field by field, in a card view. 
        You can chose to display data diffently between "mini" card view (tiles) and the "detailled" card view...
        For "mini" and "detail" entries you have to map a key from your original data (f.i. the "name" column) to a position in the cards (f.i. apply the "name" value to the "title")
      type: object
      default: {
        "mini": {
          "<KEY-COLUMN>": {"position": "<POSITION-IN-CARD>"},
          ...
        },
        "detail": {
          "<KEY-COLUMN>": {"position": "<POSITION-IN-CARD>"},
          ...
        }
      }
      notes: The possible positions in cards are for now te following :
        - "title"
        - "subtitle"
        - "resume"
        - "description"
        - "content"
        - "image" (needs an url to an image)
```

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

# Schema / architecture [⇡](#summary)

We are proud (and a bit ashamed too) to apply the `#passionSchema` to our brainstorming process...

<br>

![SCHEMA-GITRIBUTE](./src/assets/Multi-gitribute-schema-02.png)

# Wireframes for components

## Widget for `csv` preview and edition

![GITRIBUTE-WIREFRAME-EDIT-CSV](./src/assets/Multi-gitribute-wireframe-edit-csv-02.png)

## Widget for `md` preview and edition

![GITRIBUTE-WIREFRAME-EDIT-MD](./src/assets/Multi-gitribute-wireframe-edit-md-01.png)

## Dialog component before saving changes on any file type

![GITRIBUTE-WIREFRAME-DIALOG_SAVE](./src/assets/Multi-gitribute-wireframe-commit_dialog-01.png)
