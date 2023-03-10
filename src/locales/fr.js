export default {
  global: {
    optional: 'Optionnel',
    enterValue: 'Entrer une valeur',
    test: 'test nested global',
    link: 'Lien',
    yes: 'oui',
    no: 'non',
    value: 'Valeur',
    noValue: '(pas de valeur)',
    noLinkValue: '(pas de lien)',
    oldValue: 'Ancienne valeur',
    newValue: 'Nouvelle valeur',
    thanks: 'Merci d\'utiliser {{datamiRepo}} !',
    understood: 'Compris',
    documentation: 'Documentation',
    docsWebsite: 'Site de documentation technique',
    reportIssue: 'Signaler un bug',
    reportIssueWebsite: 'Ajouter un signalement de bug'
  },
  tabs: {
    switchPosition: 'Changer la position des onglets',
    vertical: 'vertical',
    horizontal: 'horizontal'
  },
  git: {
    provider: 'Provider',
    branch: 'Branche',
    sourceBranch: 'Branche source',
    newBranch: 'Nouvelle branche',
    commitBranch: 'Branche de commit',
    commitSuccess: 'Votre proposition de contribution a bien été envoyée',
    mergeRequestUrl: 'Lien vers la "merge request"',
    mergeRequestUrlLink: 'Voir la merge request',
    branchRef: 'Branche de référence',
    branchesUser: 'Vos branches',
    branchUrl: 'Lien vers la branche',
    branchUrlLink: 'Voir le fichier sur la branche'
  },
  file: {
    text: 'texte',
    table: 'table',
    json: 'json',
    file: 'Fichier',
    fileSource: 'Fichier source',
    fileName: 'Nom du fichier',
    fileType: 'Type de fichier',
    fileFamily: 'Famille de fichier',
    fileUrl: 'URL du fichier',
    fileUrlRaw: 'URL de la source (brut)',
    linkToFile: 'Lien vers le fichier',
    linkToFileRaw: 'Lien vers le fichier source (brut)',
    fileInfos: 'Informations sur le fichier',
    fileSchema: 'Schéma des données',
    fileCustomProps: 'Fichier des propriétés',
    fileDataviz: 'Fichier de configuration des data-visualisations',
    fileMaps: 'Fichier de configuration des cartographies'
  },
  views: {
    loading: '...',
    cards: 'Fiches',
    table: 'Table',
    dataviz: 'Dataviz',
    map: 'Carto',
    text: 'Texte',
    md: 'Markdown',
    json: 'Json'
  },
  preview: {
    edition: 'Edition',
    editView: 'Editer',
    diffView: 'Comparer',
    previewView: 'Aperçu',
    cardsView: 'Liste de fiches',
    tableView: 'Tableau',
    datavizView: 'Datavisualisation',
    mapView: 'Cartographie',
    textView: 'Texte',
    mdView: 'Markdown',
    jsonView: 'Json',
    showCardDetails: 'Afficher les détails',
    closeCard: 'Fermer la fiche',
    closeCardDetails: 'Fermer la fiche détaillée',
    noIllustration: "pas d'illustration",
    original: 'Contenu original',
    edited: 'Contenu édité',
    editedPreview: 'Aperçu des modifications',
    uploadedPreview: 'Aperçu du contenu de votre fichier',
    yamlPart: "Données d'en-tête",
    textPart: 'Partie texte',
    changes: 'Modifications'
  },
  map: {
    layers: 'Calques',
    layersBtn: 'Activer / désactiver les calques de la carte',
    legend: 'Légende',
    legendBtn: 'Légende des couleurs et symboles de la carte'
  },
  actions: {
    changeViewMode: 'Changer de vue',
    edit: 'Editer',
    contribute: 'Contribuer',
    enterEdit: 'Passer en mode édition / contribution',
    quitEdit: 'Quitter le mode contribution',
    change: 'Changer',
    save: 'Sauver',
    sendContrib: 'Envoyer votre contribution',
    sendContribHelp: 'Vos modifications seront envoyées aux responsables du jeu de données. Les responsables modèreront votre proprosition avant de merger les modifications aux données.',
    send: 'Envoyer',
    cancel: 'Annuler',
    search: 'Rechercher',
    expandCell: 'Agrandir la cellule',
    reduceCell: 'Réduire la cellule',
    openLinkInNew: 'Ouvrir le lien dans une nouvelle fenêtre',
    reloadFile: 'Recharger le fichier',
    downloadFile: 'Télécharger le fichier',
    uploadFile: 'Importer un fichier',
    clickToUpload: 'Cliquer pour importer',
    dropFile: 'Glisser/déposer un fichier',
    clickOrDropFile: 'Glisser/déposer votre fichier ou cliquer pour importer',
    changeLocale: 'Choisir la langue',
    changeToken: "Changer votre jeton d'accès",
    changeActiveBranch: 'Changer de branche',
    commitChanges: 'Proposer vos modifications',
    consolidate: 'Consolider cette ligne',
    selectConsolidationFields: 'Sélectionner les champs à mettre à jour',
    validateConsolidation: 'Valider les changements',
    copyWidget: 'Pour intégrer le widget dans votre site, copie du bloc html du widget',
    widgetCopied: 'Le widget est copié dans le presse-papier',
    addTag: 'Ajouter un tag',
    addTagHelp: 'Cliquer sur + pour ajouter votre tag',
    clearTag: 'Supprimer le tag',
    clickForMoreTags: 'Cliquer pour voir plus de tags',
    fullscreenOn: 'Voir le widget en plein écran',
    fullscreenOff: 'Quitter le mode plein écran',
    setLightMode: 'Passer en mode clair',
    lightMode: 'Mode clair',
    setDarkMode: 'Passer en mode sombre (expérimental)',
    darkMode: 'Mode sombre'
    // nest: {
    //   test: 'test nested actions'
    // }
  },
  sort: {
    label: 'Trier',
    sortBy: 'Trier par un champ',
    sortAscending: 'Trier par ordre croissant',
    sortDescending: 'Trier par ordre décroissant',
    sortedAsc: 'Tri par ordre croissant',
    sortedDesc: 'Tri par ordre décroissant'
  },
  filters: {
    label: 'Filtrer',
    filterBy: 'Filtrer par un champ et une valeur',
    filterByField: 'Filtrer par le champ',
    resetFilter: 'Réinitialiser ce filtre',
    removeFilter: 'Supprimer ce filtre',
    removeFilters: 'Supprimer tous les filtres'
  },
  pagination: {
    items: 'éléments',
    itemsTotal: 'sur un total de',
    page: 'Page',
    pageN: 'Page n°',
    pages: 'pages',
    pageToPages: 'sur',
    perPage: 'Par page',
    prevPage: 'Page précédente',
    nextPage: 'Page suivante',
    currentPage: 'Page actuelle',
    itemsPerPage: 'éléments par page'
  },
  field: {
    field: 'Champ',
    label: 'Libellé',
    type: 'Type',
    title: 'Titre',
    description: 'Description',
    category: 'Catégorie',
    string: 'Texte',
    longtext: 'Texte long',
    timelinetext: 'Texte avec étapes',
    image: 'Image',
    link: 'Lien',
    email: 'Email',
    geopoint: 'Coordonnée géographique',
    tag: 'Etiquette',
    tags: 'Etiquettes',
    number: 'Nombre',
    integer: 'Nombre entier',
    percent: 'Pour cent',
    boolean: 'Bouléen',
    primaryKey: 'Clé principale',
    foreignKey: 'Clé étrangère',
    ressource: 'Ressource',
    ressourceValues: 'Valeurs liées',
    definition: 'Définition',
    datami: 'Champ spécial',
    openDatamiCard: 'Ouvrir la fiche',
    consolidation: 'Consolidation'
  },
  edit: {
    uploadData: 'Importer/écraser les données',
    headerLocked: "L'intitulé de cette colonne est protégé en écriture"
  },
  consolidation: {
    consolidationApi: "Consolidation par l'API",
    apiFormat: "Format de l'API",
    sourceFields: 'Données utilisées'
  },
  editCsv: {
    noSelect: 'Aucun',
    noResult: 'Pas de résultat',
    results: 'lignes',
    colType: 'Colonne de type',
    addRow: 'Ajouter une nouvelle ligne',
    addTheNewRow: 'Ajouter la nouvelle ligne',
    importData: 'Importer/écraser les données',
    deleteARow: 'Supprimer une ligne (sélectionner une ligne au minimum)',
    deleteRow: 'Supprimer la ligne',
    deleteRows: 'Supprimer les lignes'
  },
  editJson: {
    node: 'Noeud',
    childrenNodes: 'noeud(s) enfant(s)',
    nodeType: 'Type de noeud',
    nodeTypeOf: 'Noeud de type',
    selectType: 'Sélectionner un type',
    openNode: 'Ouvrir le noeud',
    closeNode: 'Refermer le noeud',
    nodeLabel: 'Nom du noeud',
    nodeValue: 'Valeur du noeud',
    valueType: 'Type de valeur',
    editLabel: 'Editer le nom du noeud',
    addNode: 'Ajouter un noeud',
    addTo: 'Ajouter un élémént au noeud',
    newNodePreview: 'Aperçu du nouveau noeud',
    confirmAddNode: 'Êtes-vous certain·e de vouloir ajouter un noeud ?',
    removeNode: 'Supprimer ce noeud',
    confirmRemoveNode: 'Êtes-vous certain·e de vouloir supprimer ce noeud ?',
    arr: 'liste',
    obj: 'objet',
    str: 'texte',
    num: 'nombre entier',
    float: 'nombre décimal',
    bool: 'booléen'
  },
  editWiki: {
    loadingPages: 'Chargement des pages du mediawiki...',
    results: 'fiches',
    page: 'page',
    pages: 'pages',
    goToWikiPage: 'Ouvrir la page du wiki',
    showRawContent: 'Voir le contenu original (format wikitext)'
  },
  user: {
    userToken: "Votre jeton d'accès",
    user: 'Utilisateur',
    userIntro: 'Vous pouvez laisser un message au propriétaire du fichier',
    userName: 'Prénom',
    userSurname: 'Nom',
    userAnyName: 'Nom / Prénom / Pseudo',
    userEmail: 'Email',
    userMessage: 'Message',
    userRgpd: "J'ai pris connaissance et j'accepte les règles générales d'utilisation de Datami",
    showOptions: 'Afficher les options',
    hideOptions: 'Cacher les options'
  },
  notifications: {
    notif: 'Notification',
    notifFunction: 'Notification de la fonction',
    notifCode: 'Code de réponse',
    notifMessage: 'Message'
  },
  errors: {
    error: 'Erreur',
    errorFunction: 'Erreur de la fonction',
    errorCode: "Code d'erreur",
    errorMessage: "Message d'erreur",
    templateMissing: 'Il manque le canevas pour le langage choisi'
  },
  widget: {
    widgetCopiedMsg: 'Le widget {{widgetName}} intitulé {{widgetTitle}} est copié dans votre presse-papier.',
    widgetUse: 'Vous pouvez désormais l\'insérer dans la page html de votre choix.',
    widgetCopied: 'Widget copié'
  },
  credits: {
    reclaim: 'Un widget open source',
    byLove: 'codé avec 🤍 ',
    byCooperative: 'par la coopérative',
    code: 'Code source'
  }
}
