<template>
  <div class="GitributeExplowiki gitribute-widget section">
    <div class="container mb-4">
      <div class="columns is-centered mb-4">
        <!-- FILE TITLE -->
        <div class="column is-half-desktop is-12-mobile has-text-centered-mobile">
          <FileTitle
            :show-file-infos="showFileInfos"
            :title="title"
            :file-id="fileId"
            :locale="locale"
            @toggleInfos="showFileInfos = !showFileInfos"/>
        </div>

        <!-- USER NAVBAR -->
        <div class="column is-half-desktop is-12-mobile is-flex is-direction-row is-align-items-center is-justify-content-center">
          <ViewModeBtns
            v-if="fileOptions"
            :file-id="fileId"
            :locale="locale"/>
          <UserOptions
            v-if="gitObj"
            :file-id="fileId"
            :only-preview="onlypreview"
            :locale="locale"/>
        </div>
      </div>
    </div>

    <!-- DEBUG -->
    <div
      v-if="debug"
      class=" container columns is-multiline">
      <div class="column is-full">
        <p>
          fileType:
          <code>{{ fileType }}</code>
        </p>
      </div>
      <div class="column is-one-third">
        <p>
          gitObj:
          <br>
          <code>
            <pre>{{ gitObj }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-one-third">
        <p>
          wikiObj:
          <br>
          <code>
            <pre>{{ wikiObj }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-one-third">
        <p>
          fileInfos:
          <br>
          <code>
            <pre>{{ fileInfos }}</pre>
          </code>
        </p>
      </div>
      <div
        v-if="debug"
        class="column is-8">
        <p>
          wikiPages:
          <br>
          <code>
            <pre>{{ wikiPages }}</pre>
          </code>
        </p>
      </div>
      <div
        v-if="debug"
        class="column is-4">
        <p>
          wikiFields
          <br>
          <code>
            <pre>{{ wikiFields }}</pre>
          </code>
        </p>
      </div>
      <!-- <div class="column is-one-third">
        <p>
          fileRaw:
          <br>
          <code>
            <pre>{{ fileRaw }}</pre>
          </code>
        </p>
      </div> -->
    </div>

    <!-- FILE INFOS -->
    <DialogFileInfos
      v-show="showFileInfos"
      v-model="showFileInfos"
      :file-id="fileId"
      :locale="locale"
      :debug="debug"
      @closeDialogFileInfos="showFileInfos = false"/>

    <!-- NOTIFICATIONS -->
    <div
      v-if="notifications && notifications.length"
      class="mb-6">
      <NotificationInfos
        v-for="(notif, index) in notifications"
        :key="`notif-${fileId}-${index}-${notif.code}`"
        :file-id="fileId"
        :notif="notif"
        :locale="locale"/>
    </div>

    <!-- ERRORS -->
    <div
      v-if="errors && errors.length"
      class="mb-6">
      <NotificationErrors
        v-for="(error, index) in errors"
        :key="`error-${fileId}-${index}-${error.code}`"
        :file-id="fileId"
        :error="error"
        :locale="locale"/>
    </div>

    <!-- FILE NAVBAR BUTTONS -->
    <!-- {{ fileOptions }} -->
    <!-- hasCardsView : <code>{{ hasCardsView }}</code><br> -->
    <!-- hasCardsDetail : <code>{{ hasCardsDetail }}</code><br> -->
    <EditNavbarSkeleton
      v-if="!fileIsLoading"
      :file-id="fileId"
      :only-preview="onlypreview"
      :locale="locale"/>

    <!-- PREVIEWS CSV / CARDS WIKI -->
    <div
      v-if="wikiItems && fileTypeFamily === 'table'"
      class="container">
      <PreviewCsv
        :file-id="fileId"
        :file-is-loading="fileIsLoading"
        :file-raw="fileRaw"
        :wiki-raw="wikiRaw"
        :items-total="wikiItems && wikiItems.length"
        :locale="locale"
        :only-preview="onlypreview"
        :debug="debug"/>
    </div>

    <!-- PROGRESS LOADER -->
    <!-- v-if="wikiItems && wikiItems.length" -->
    <LoaderWiki
      v-if="wikiItems && wikiItems.length && (wikiPages.length != wikiItems.length)"
      :file-id="fileId"
      :items-loaded="wikiPages.length"
      :items-total="wikiItems.length"
      :locale="locale"/>

    <!-- CREDITS -->
    <GitributeCredits
      :locale="locale"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal, mixinGit, mixinCsv, mixinWiki } from '@/utils/mixins.js'

import { extractGitInfos } from '@/utils/utilsGitUrl.js'
import { getFileDataRaw } from '@/utils/gitProvidersAPI.js'

import FileTitle from '@/components/navbar/FileTitle'
import ViewModeBtns from '@/components/previews/ViewModeBtns'
import UserOptions from '@/components/user/UserOptions'

import NotificationInfos from '@/components/notifications/NotificationInfos'
import NotificationErrors from '@/components/notifications/NotificationErrors'

import EditNavbarSkeleton from '@/components/edition/EditNavbarSkeleton'
import DialogFileInfos from '@/components/previews/DialogFileInfos'

import LoaderWiki from '@/components/loaders/LoaderWIKI'

import PreviewCsv from '@/components/previews/PreviewCsv'

import GitributeCredits from '@/components/credits/GitributeCredits'

export default {
  name: 'GitributeExploWiki',
  components: {
    FileTitle,
    ViewModeBtns,
    UserOptions,
    NotificationInfos,
    NotificationErrors,
    EditNavbarSkeleton,
    DialogFileInfos,
    LoaderWiki,
    PreviewCsv,
    GitributeCredits
  },
  mixins: [
    mixinGlobal,
    mixinGit,
    mixinCsv,
    mixinWiki
  ],
  props: {
    title: {
      default: 'gitribute',
      type: String
    },
    wikilist: {
      default: '',
      type: String
    },
    wikipages: {
      default: '',
      type: String
    },
    options: {
      default: 'en',
      type: String
    },
    locale: {
      default: '',
      type: String
    },
    onlypreview: {
      default: false,
      type: Boolean
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      // file infos
      fileId: undefined,
      fileType: undefined,
      fileInfos: undefined,
      fileRaw: undefined,
      showFileInfos: false,

      // tests for mediawiki fetching
      mediawikiDefaultFields: ['title', 'imageUrl', 'pageUrl'],
      mediawikiOptions: undefined,
      wikiObj: undefined,
      wikiItems: undefined,
      wikiFields: undefined,
      wikiPages: undefined
    }
  },
  computed: {
    headersArray () {
      // const headers = this.wikiHeaders ? Array.from(this.wikiHeaders) : []
      // return headers
      return Array.from(this.wikiHeaders)
    },
    wikiRaw () {
      return {
        headers: this.wikiFields,
        data: this.wikiPages
      }
    }
  },
  watch: {
    fileIsLoading (next) {
      // console.log('C > GitributeExploWiki > watch > fileIsLoading > next : ', next)
      if (next) { this.reloadMediawikiRessources() }
    }
  },
  async beforeMount () {
    // console.log('\nC > GitributeExploWiki > beforeMount > this.wikifile : ', this.wikifile)
    // console.log('C > GitributeExploWiki > beforeMount > this.wikilist : ', this.wikilist)
    // console.log('C > GitributeExploWiki > beforeMount > this.options : ', this.options)

    const wikiUuid = this.uuidv4()

    // build options object
    let mediawikiOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
    mediawikiOptions.tagseparator = ',' // to parse tags fields
    mediawikiOptions.separator = '\t' // for csv export
    this.mediawikiOptions = mediawikiOptions

    // add default fields for pages structuration
    // console.log('C > GitributeExploWiki > beforeMount > this.mediawikiOptions : ', this.mediawikiOptions)
    const fields = [...this.mediawikiDefaultFields, ...mediawikiOptions.wikisettings.fields]
    this.wikiFields = { ...fields }

    // get wiki object for further reload infos
    const wikiInfosObject = this.extractWikiInfos(this.wikilist, this.mediawikiOptions.wikisettings)
    wikiInfosObject.uuid = wikiUuid
    wikiInfosObject.title = this.title
    wikiInfosObject.wikipages = this.wikipages && JSON.parse(this.wikipages)
    wikiInfosObject.onlyPreview = this.onlypreview
    this.wikiObj = wikiInfosObject
    this.fileId = wikiInfosObject.uuid
    this.fileType = wikiInfosObject.filetype
    // console.log('C > GitributeExploWiki > beforeMount > wikiInfosObject : ', wikiInfosObject)
    if (!this.getGitInfosObj[wikiUuid]) {
      this.addGitInfos(wikiInfosObject)
    }
    // get schema if any
    let mediawikiSchema = mediawikiOptions.schema
    // console.log('C > GitributeExploWiki > beforeMount > mediawikiSchema : ', mediawikiSchema)
    if (mediawikiSchema && mediawikiSchema.file) {
      const schemaGitObj = extractGitInfos(mediawikiSchema.file)
      // console.log('C > GitributeExploWiki > beforeMount > schemaGitObj : ', schemaGitObj)
      const schemaRaw = await getFileDataRaw(schemaGitObj)
      // console.log('C > GitributeExploWiki > beforeMount > schemaRaw : ', schemaRaw)
      const schemaData = schemaRaw && schemaRaw.data
      // console.log('C > GitributeExploWiki > beforeMount > schemaData : ', schemaData)
      const schema = JSON.parse(schemaData)
      mediawikiSchema = { ...schema, file: mediawikiSchema.file }
      // mediawikiOptions.schema = schema
      // console.log('C > GitributeExploWiki > beforeMount > schema : ', schema)
    }

    // get custom props if any
    let mediawikiCustomProps = mediawikiOptions['fields-custom-properties']
    if (mediawikiCustomProps && mediawikiCustomProps.file) {
      const customPropsGitObj = this.extractGitInfos(mediawikiCustomProps.file)
      const customPropsRaw = await this.getFileDataRaw(customPropsGitObj)
      const customPropsData = customPropsRaw && customPropsRaw.data
      const customProps = JSON.parse(customPropsData)
      mediawikiCustomProps = { ...customProps, file: mediawikiCustomProps.file }
    }

    // update fileOptions with schema and consolidation settings
    mediawikiOptions = {
      ...mediawikiOptions,
      ...mediawikiSchema && { schema: mediawikiSchema },
      ...mediawikiCustomProps && { customProps: mediawikiCustomProps }
    }

    this.addFileOptions({ ...mediawikiOptions, uuid: wikiUuid })
    // console.log('C > GitributeExploWiki > beforeMount > wikiInfosObject : ', wikiInfosObject)
  },
  async mounted () {
    await this.reloadMediawikiRessources()
  },
  methods: {
    ...mapActions({
      addGitInfos: 'addGitInfos',
      addFileOptions: 'addFileOptions',
      addFileReqInfos: 'addFileReqInfos',
      updateReloading: 'git-data/updateReloading',
      updateReqErrors: 'git-data/updateReqErrors'
    }),
    async reloadMediawikiRessources () {
      // Update reloading in store - true
      this.updateReloading({ fileId: this.fileId, isLoading: true })
      this.updateReqErrors({ fileId: this.fileId, addToErrors: false })

      // reset local data
      let wikiItems = []
      this.wikiItems = []
      this.wikiPages = []

      // get wikipages list if any
      const wikipages = this.wikiObj.wikipages
      // console.log('C > GitributeExploWiki > reloadMediawikiRessources > wikipages : ', wikipages)
      if (wikipages && wikipages.length) {
        for (const pageUrl of wikipages) {
          const pageData = await this.getMediaWikiPage(this.wikiObj, pageUrl, this.uuidv4(), this.mediawikiOptions.wikisettings)
          // console.log('C > GitributeExploWiki > reloadMediawikiRessources > pageData : ', pageData)
          pageData.temp = this.restructurePageData(pageData, this.wikiFields)
          this.wikiPages.push(pageData.temp)
          this.wikiItems.push(pageData.item)
          if (this.hasCustomFilters) { this.updateCustomFilters(pageData.temp) }
        }
      }

      // Request API for wiki pages data
      const respWikidataRaw = await this.getMediawikiData(this.wikiObj.apiUrl, this.mediawikiOptions.wikisettings)
      // console.log('\nC > GitributeExploWiki > reloadMediawikiRessources > respWikidataRaw : ', respWikidataRaw)
      if (respWikidataRaw.data) {
        // let wikiItems = respWikidataRaw.data.slice(0, 10)
        wikiItems = respWikidataRaw.data
        wikiItems = wikiItems.map(item => { return { ...item, id: this.uuidv4() } })
        // console.log('C > GitributeExploWiki > reloadMediawikiRessources > wikiItems : ', wikiItems)
        this.wikiItems.push(...wikiItems)

        // Update reloading in store - false
        this.updateReloading({ fileId: this.fileId, isLoading: false })

        // this.wikiHeaders = new Set()
        // console.log('C > GitributeExploWiki > reloadMediawikiRessources > pages : ', pages)
        for (const item of this.wikiItems.filter(item => !item.isLoaded)) {
          const pageData = await this.getMediawikitItem(this.wikiObj, item, this.mediawikiOptions.wikisettings)
          // console.log('C > GitributeExploWiki > reloadMediawikiRessources > pageData : ', pageData)
          pageData.temp = this.restructurePageData(pageData, this.wikiFields)
          // console.log('C > GitributeExploWiki > reloadMediawikiRessources > pageData.temp : ', pageData.temp)
          this.wikiPages.push(pageData.temp)
          if (this.hasCustomFilters) { this.updateCustomFilters(pageData.temp) }
        }
      }
    },
    updateCustomFilters (data) {
      // build filters from options config
      this.fileFilters.forEach(filter => {
        // console.log('\n... C > GitributeExploWiki > updateCustomFilters > filter : ', filter)
        const field = filter.field

        // get only last value from new data object
        const hasData = !!data[field]
        if (hasData) {
          const dataTagsRaw = data[field]
          // console.log('... C > GitributeExploWiki > updateCustomFilters > dataTagsRaw : ', dataTagsRaw)
          let dataTags = dataTagsRaw.split(this.customFiltersConfig.tagsSeparator)
          dataTags = dataTags.map(tag => tag.trim())
          this.updateFiltersSettings({
            fileId: this.fileId,
            field: field,
            enumArr: dataTags
          })
        }
      })
      // console.log('C > GitributeExploWiki > updateCustomFilters > this.fileFilters : ', this.fileFilters)
    }
  }
}
</script>

<style>

.no-text-transform {
  text-transform: none!important;
}

</style>
