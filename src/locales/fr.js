export default {
  global: {
    optional: 'Optionnel',
    enterValue: 'Entrer une valeur',
    test: 'test nested global',
    link: 'Lien',
    yes: 'oui',
    no: 'non'
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
    fileInfos: 'Informations sur le fichier'
  },
  preview: {
    edition: 'Edition',
    editView: 'Editer',
    diffView: 'Comparer',
    previewView: 'Aperçu',
    cardsView: 'Liste',
    tableView: 'Tableau',
    showCardDetails: 'Afficher les détails',
    closeCardDetails: 'Fermer la vue détaillée',
    noIllustration: "pas d'illustration",
    original: 'Contenu original',
    edited: 'Contenu édité',
    editedPreview: 'Aperçu des modifications',
    uploadedPreview: 'Aperçu du contenu de votre fichier',
    yamlPart: "Données d'en-tête",
    textPart: 'Partie texte',
    changes: 'Modifications'
  },
  actions: {
    edit: 'Editer',
    change: 'Changer',
    save: 'Sauver',
    send: 'Envoyer',
    cancel: 'Annuler',
    search: 'Rechercher',
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
    commitChanges: 'Proposer vos modifications'
    // nest: {
    //   test: 'test nested actions'
    // }
  },
  sort: {
    label: 'Trier',
    sortBy: 'Trier par un champ',
    sortAscending: 'Trier par ordre croissant',
    sortDescending: 'Trier par ordre décroissant'
  },
  filters: {
    label: 'Filtrer',
    filterBy: 'Filtrer par un champ et une valeur',
    filterByField: 'Filtrer par le champ',
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
  edit: {
    uploadData: 'Importer/écraser les données',
    headerLocked: "L'intitulé de cette colonne est protégé en écriture"
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
    userEmail: 'Email',
    userMessage: 'Message'
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
    errorMessage: "Message d'erreur"
  },
  credits: {
    reclaim: 'Un widget open source codé avec 🤍  &nbsp; par',
    code: 'Code source'
  }
}
