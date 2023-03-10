<template>
  <div
    :id="multiFilesId"
    :class="`DatamiMultiFiles datami-widget-root datami-widget section ${isDarkMode ? 'datami-darkmode' : ''}`">
    <!-- MATOMO -->
    <MatomoScript
      :file-id="multiFilesId"
      :from-multifiles="true"/>

    <!-- DEBUGGING -->
    <!-- <p>
      scrolled : <pre><code>{{ scrolled }}</code></pre>
    </p> -->

    <DatamiTooltip
      v-if="tooltip"
      :file-id="multiFilesId"
      :locale="locale"/>

    <!-- WIDGET -->
    <div
      class="container mb-4 datami-container">
      <!-- DEBUGGING -->
      <!-- <div
        v-if="debug"
        class=" container columns is-multiline">
        <div class="column is-6">
          hideTitle : <code>{{ hideTitle }}</code>
        </div>
        <div class="column is-6">
          activeTab : <code>{{ activeTab }}</code>
        </div>
        <div
          v-if="false"
          class="column is-6">
          multiFilesOptions : <code><pre>{{ multiFilesOptions }}</pre></code>
        </div>
      </div> -->

      <!-- DEBUG URL PARAMS -->
      <div
        v-if="debug"
        class="columns">
        <div class="column is-4">
          activeTab : <br><pre><code>{{ activeTab }}</code></pre>
        </div>
        <div class="column is-4">
          urlParameters : <br><pre><code>{{ urlParameters }}</code></pre>
        </div>
      </div>

      <!-- TITLE AND TAB OPTIONS -->
      <div
        v-if="!hideTitle"
        class="is-flex is-flex-direction-row is-align-items-center mb-4">
        <!-- DEBUG OUTTER MODAL -->
        <!-- <b-button
          v-if="true"
          icon-left="bug"
          type="is-danger"
          size="is-small"
          style="z-index: 2"
          @click="isModalActive = true"/> -->
        <!-- TABS POSITION -->
        <MultiFilesTabsPosition
          :default-display="defaultDisplay"
          :locale="locale"
          @switch="switchTabsPosition"/>
        <!-- TITLE -->
        <span
          :class="`is-size-3 is-size-5-touch ml-5 ${isDarkMode ? 'datami-darkmode has-text-white' : ''}`">
          {{ title }}
        </span>
        <!-- COPY WIDGET BTN IN VERTICAL MODE -->
        <span
          v-if="tabsVertical"
          class="mt-2 ml-5">
          <ButtonCopyWidgetHtml
            :file-id="multiFilesId"
            :from-multi-files="true"
            :locale="locale"/>
        </span>
      </div>

      <!-- COPY WIDGET BTN IN HORIZONTAL MODE -->
      <div
        v-if="!tabsVertical"
        class="datami-floating-right">
        <ButtonCopyWidgetHtml
          :file-id="multiFilesId"
          :from-multi-files="true"
          :locale="locale"/>
      </div>

      <!-- DEBUGGING FOREIGN KEYS-->
      <!-- <div
        v-if="debug && sharedData"
        class="columns is-multiline mb-4">
        <div class="column is-4">
          shareableAreSet : <code>{{ shareableAreSet }}</code>
        </div>
        <div class="column is-4">
          loadingShared :<br>
          <pre><code>{{ loadingShared }}</code></pre>
        </div>
        <div class="column is-4">
          loadingExtRessources :<br>
          <pre><code>{{ loadingExtRessources }}</code></pre>
        </div>
        <div class="column is-6">
          shareableFiles:<br>
          <pre><code>{{ shareableFiles }}</code></pre>
        </div>
        <div class="column is-6">
          readyToCopyRessources:<br>
          <pre><code>{{ readyToCopyRessources }}</code></pre>
          <hr class="my-1">
          readyToLoadExtRessources:<br>
          <pre><code>{{ readyToLoadExtRessources }}</code></pre>
        </div>
        <div
          v-for="(shared, idx) in sharedData"
          :key="`shared-${idx}-${shared.targetFile}`"
          class="column is-4">
          isInShareableAndSet:
          <code>{{ isInShareableAndSet(shared.ressource).length }}</code>
          <br>
          isInShareableAndLoaded:
          <code>{{ isInShareableAndLoaded(shared.ressource).length }}</code>
          <hr class="my-1">
          sharedData<code>[{{ idx }}]</code> :<br>
          <pre><code>{{ debugShared(shared) }}</code></pre>
          <hr class="my-1">
          loadedSharedData<code>[{{ idx }}]</code> :<br>
          <pre><code>{{ debugShared(loadedSharedData(shared.ressource)) }}</code></pre>
        </div>
      </div> -->

      <!-- TABS : LOOP FILES -->
      <section>
        <!-- DEBUGGING -->
        <!-- activeTab :<code>{{ activeTab }}</code> -->
        <b-tabs
          v-model="activeTab"
          :vertical="tabsVertical"
          :class="`multi-files-tabs is-flex-wrap-nowrap ${tabsVertical ? 'width-80' : ''}`"
          multiline>
          <template>
            <b-tab-item
              v-for="(fileTab, fileTabIdx) in files.filter(f => f.activate)"
              :key="fileTab.id"
              :value="fileTab.id"
              :header-class="`datami-multi-files-tab datami-${isDarkMode ? 'darkmode' : 'clearmode'}-tab-header datami-multi-files-tab-${ tabsVertical ? 'vertical' : 'horizontal'}`">
              <!-- TAB HEADER -->
              <template #header>
                <div
                  @click="changeMultifilesActiveTab(fileTab)"
                  @mouseover="hovered = fileTab.id"
                  @mouseleave="hovered = undefined">
                  <b-tag
                    class="mr-2 has-text-weight-bold"
                    :type="`is-${isDarkMode ? 'white' : activeTab === fileTab.id ? 'dark' : hovered === fileTab.id ? 'white' : 'grey' }`"
                    rounded>
                    {{ fileTabIdx + 1 }}
                  </b-tag>
                  <span>
                    <span>
                      {{ trimText(fileTab.title, tabsVertical ? 23 : 15) }}
                    </span>
                  </span>
                </div>
              </template>

              <!-- TAB CONTENT -->
              <div
                :class="`columns multifiles-container${tabsVertical ? '-top' : ''}`">
                <div
                  :class="`column is-12 pt-0 ${tabsVertical ? 'pr-0' : 'px-0'}`">
                  <!-- DEBUGGING -->
                  <!-- <div v-if="debug">
                    fileTab : <br><pre><code>{{ fileTab }}</code><pre/></pre>
                  </div> -->

                  <!-- CALL DATAMI-FILE COMPONENT HERE -->
                  <DatamiFile
                    v-if="fileTab.gitfile"
                    :file-id-from-multifiles="fileTab.id"
                    :title="fileTab.title"
                    :creditslogos="fileTab.creditslogos"
                    :gitfile="fileTab.gitfile"
                    :gitfilelocal="fileTab.gitfilelocal"
                    :localdev="fileTab.localdev"
                    :options="fileTab.options"
                    :usertoken="fileTab.usertoken"
                    :locale="locale || fileTab.locale"
                    :onlypreview="booleanFromValue(fileTab.onlypreview)"
                    :from-multi-files="true"
                    :tab-id="fileTabIdx + 1"
                    :from-multi-files-vertical="tabsVertical"
                    :trackalloutlinks="!fileTabIdx ? trackalloutlinks : false"/>

                  <!-- CALL DATAMI-FILE COMPONENT HERE -->
                  <DatamiExplowiki
                    v-if="fileTab.mediawiki"
                    :file-id-from-multifiles="fileTab.id"
                    :title="fileTab.title"
                    :creditslogos="fileTab.creditslogos"
                    :wikilist="fileTab.wikilist"
                    :wikipages="fileTab.wikipages"
                    :options="fileTab.options"
                    :usertoken="fileTab.usertoken"
                    :locale="fileTab.locale"
                    :onlypreview="booleanFromValue(fileTab.onlypreview)"
                    :from-multi-files="true"
                    :tab-id="fileTabIdx + 1"
                    :from-multi-files-vertical="tabsVertical"
                    :trackalloutlinks="!fileTabIdx ? trackalloutlinks : false"/>
                </div>
              </div>
            </b-tab-item>
          </template>
        </b-tabs>
      </section>
    </div>

    <!-- DIALOG MODAL -->
    <b-modal
      v-model="isModalActive"
      class="datami-modal-dialog-opener"
      :width="'80%'"
      @close="resetDialogs">
      <DialogSkeleton
        :file-id="multiFilesId"
        :is-multifile="true"
        :locale="locale"/>
    </b-modal>
  </div>
</template>

<script>
import { trimText, booleanFromValue } from '@/utils/globalUtils'

import { mapActions } from 'vuex'

import {
  mixinTooltip,
  mixinClientUrl,
  mixinViews,
  mixinGlobal,
  mixinForeignKeys
} from '@/utils/mixins.js'

import { getAvailableViews, getDefaultViewMode } from '@/utils/fileTypesUtils'
import { extractGitInfos } from '@/utils/utilsGitUrl'

export default {
  name: 'DatamiMultiFiles',
  components: {
    MatomoScript: () => import(/* webpackChunkName: "MatomoScript" */ '@/components/matomo/MatomoScript.vue'),
    DialogSkeleton: () => import(/* webpackChunkName: "DialogSkeleton" */ '@/components/dialogs/DialogSkeleton.vue'),
    DatamiTooltip: () => import(/* webpackChunkName: "DatamiTooltip" */ '@/components/user/DatamiTooltip.vue'),
    MultiFilesTabsPosition: () => import(/* webpackChunkName: "MultiFilesTabsPosition" */ '@/components/user/MultiFilesTabsPosition.vue'),
    ButtonCopyWidgetHtml: () => import(/* webpackChunkName: "ButtonCopyWidgetHtml" */ '@/components/user/ButtonCopyWidgetHtml.vue'),
    DatamiFile: () => import(/* webpackChunkName: "DatamiFile" */ '@/components/datami-file.vue'),
    DatamiExplowiki: () => import(/* webpackChunkName: "DatamiExplowiki" */ '@/components/datami-explowiki.vue')
  },
  mixins: [
    mixinTooltip,
    mixinClientUrl,
    mixinViews,
    mixinGlobal,
    mixinForeignKeys
  ],
  props: {
    title: {
      default: 'datami-multi-files',
      type: String
    },
    gitfiles: {
      default: null,
      type: [String, Array]
    },
    options: {
      default: undefined,
      type: [String, Object]
    },
    locale: {
      default: 'en',
      type: String
    },
    trackalloutlinks: {
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
      datamiRoot: true,
      cssFiles: [
        'styles/components/credits/datami-credits.css',
        'styles/datami-global.css',
        'styles/datami-dark-mode.css',
        'styles/components/edition/datami-edit-mode-buttons.css',
        'styles/components/edition/datami-edit-navbar-skeleton.css',
        'styles/components/edition/datami-edit-tag-value.css',
        'styles/components/filters/datami-button-filter-by.css',
        'styles/components/filters/datami-custom-filter-dropdown.css',
        'styles/components/filters/datami-filter-tags.css',
        'styles/components/pagination/datami-pages-navigation.css',
        'styles/components/previews/cards/datami-cards.css',
        'styles/components/previews/dataviz/datami-dataviz.css',
        'styles/components/previews/maps/datami-maps.css',
        'styles/components/previews/table/datami-table.css',
        'styles/components/previews/tags/datami-tags.css',
        'styles/components/previews/json/datami-json.css',
        'styles/components/previews/md/datami-md.css',
        'styles/components/previews/md/datami-shodown.css',
        'styles/components/previews/datami-view-mode-buttons.css',
        'styles/components/sorting/datami-buttons-sort-by.css',
        'styles/components/user/datami-user-buttons.css',
        'styles/components/user/datami-tooltip.css',
        'styles/datami-multi-files.css',
        // 'fonts/materialdesignicons-webfont.eot',
        // 'fonts/materialdesignicons-webfont.ttf',
        // 'fonts/materialdesignicons-webfont.woff',
        // 'fonts/materialdesignicons-webfont.woff2',
        'fonts/materialdesignicons.min.css'
        // 'https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css'
      ],
      cssHeadFiles: [
        // 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
        'https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css'
      ],
      isModalActive: false,
      multiFilesId: undefined,
      hideTitle: false,
      files: [],
      hovered: undefined,
      defaultDisplay: undefined,
      multiFilesOptions: undefined,
      activeTab: undefined,
      tabsVertical: false
    }
  },
  watch: {
    activeTab (next) {
      // console.log('\nC > DatamiMultiFiles > watch > activeTab > next : ', next)
      // let gitObj = this.getGitInfosObj(next)
      // console.log('C > DatamiMultiFiles > watch > activeTab > gitObj : ', gitObj)
      let gitObj
      const file = this.files[this.urlActiveTab - 1]
      // console.log('C > DatamiMultiFiles > watch > activeTab > file : ', file)
      if (file) {
        const fileUrl = file.localdev ? file.gitfilelocal : file.gitfile
        gitObj = extractGitInfos(fileUrl)
      }
      // console.log('C > DatamiMultiFiles > watch > activeTab > gitObj : ', gitObj)

      const fileType = gitObj && gitObj.filetype
      // let options = this.getFileOptionsObj(next)
      const options = file && JSON.parse(file.options)
      // console.log('C > DatamiMultiFiles > watch > activeTab > options : ', options)

      // view mode from store
      let viewMode = this.getViewMode(next) || this.urlActiveView
      // console.log('C > DatamiMultiFiles > watch > activeTab > viewMode : ', viewMode)

      // if 1st request
      // const viewModeUrl = this.urlActiveView
      // console.log('C > DatamiMultiFiles > watch > activeTab > viewModeUrl : ', viewModeUrl)

      // check if requested view is available for new tab
      const availableViews = getAvailableViews(options, fileType, next)
      // console.log('C > DatamiMultiFiles > watch > activeTab > availableViews : ', availableViews)
      if (viewMode && !availableViews.includes(viewMode)) {
        viewMode = getDefaultViewMode(options, fileType, next)
      }

      // set up the view mode
      // console.log('C > DatamiMultiFiles > watch > activeTab > viewMode : ', viewMode)
      this.changeUrlView(viewMode)
      this.changeView(viewMode, next)

      if (viewMode !== 'map') {
        this.deleteUrlParam('datami_lon')
        this.deleteUrlParam('datami_lat')
        this.deleteUrlParam('datami_zoom')
      }
      if (viewMode === 'dataviz') {
        this.deleteUrlParam('datami_detail_id')
      }
    },
    hasMultifilesDialogs (next) {
      // console.log('\nC > DatamiMultiFiles > watch > hasMultifilesDialogs > next : ', next)
      if (next) {
        this.hideGlobalTooltip()
        this.isModalActive = true
      } else {
        this.isModalActive = false
      }
    }
  },
  beforeMount () {
    // Set up files
    // console.log('\nC > DatamiMultiFiles > beforeMount > this.gitfiles : ', this.gitfiles)
    const files = this.gitfiles && JSON.parse(this.gitfiles)
    // console.log('C > DatamiMultiFiles > beforeMount > files : ', files)
    const filesParsed = files && files.map((file, idx) => {
      const isMediawiki = file.wikipages || file.wikilist
      const fileSettings = {
        ...file,
        ...{ id: this.uuidv4() },
        ...{ tabId: idx + 1 },
        ...{ options: JSON.stringify(file.options) },
        ...isMediawiki && { mediawiki: isMediawiki },
        ...isMediawiki && { wikipages: JSON.stringify(file.wikipages) }
      }
      return fileSettings
    })

    // console.log('C > DatamiMultiFiles > beforeMount > filesParsed : ', filesParsed)
    this.files = filesParsed || []

    // Set up options
    const multiFilesOptions = {
      uuid: this.uuidv4(),
      title: this.title,
      options: this.options && JSON.parse(this.options),
      gitfiles: files
    }
    this.multiFilesId = multiFilesOptions.uuid
    this.multiFilesOptions = multiFilesOptions
    this.defaultDisplay = multiFilesOptions.options.display
    this.tabsVertical = this.defaultDisplay === 'vertical'
    this.hideTitle = !!multiFilesOptions.options.hidetitle
    // console.log('C > DatamiMultiFiles > beforeMount > multiFilesOptions : ', multiFilesOptions)
    this.addFileOptions(multiFilesOptions)

    // Get active tab from url if any
    const activeTabFromUrl = this.urlActiveTab
    // console.log('C > DatamiMultiFiles > beforeMount > activeTabFromUrl : ', activeTabFromUrl)

    // Set default active tab
    let defaultFile = filesParsed.find(file => file.activate && file['default-tab']) || filesParsed[0]
    if (activeTabFromUrl) {
      defaultFile = filesParsed[activeTabFromUrl - 1] ? filesParsed[activeTabFromUrl - 1] : defaultFile
    }
    // console.log('C > DatamiMultiFiles > beforeMount > defaultFile : ', defaultFile)
    // console.log('C > DatamiMultiFiles > beforeMount > defaultFile.id : ', defaultFile.id)

    // set active tab
    this.activeTab = defaultFile.id

    // Set in store
    this.changeMultifilesActiveTab(defaultFile)
    if (this.trackalloutlinks) {
      this.activateTrackAllOutlinks()
    }
  },
  mounted () {
    // Pre-store files for possible further sharing
    this.files.forEach(file => {
      // console.log('C > DatamiMultiFiles > mounted > file.gitfile : ', file.gitfile)
      this.updateShareableFiles({ gitfile: file.gitfile, isSet: false })
    })
  },
  methods: {
    trimText,
    booleanFromValue,
    ...mapActions({
      addFileOptions: 'addFileOptions',
      toggleMultifileActiveTab: 'git-user/toggleMultifileActiveTab',
      toggleMultifileTabsPosition: 'git-user/toggleMultifileTabsPosition',
      activateTrackAllOutlinks: 'activateTrackAllOutlinks'
    }),
    switchTabsPosition (btn) {
      // console.log('C > DatamiMultiFiles > switchTabsPosition > btn : ', btn)
      this.tabsVertical = btn.position === 'vertical'
      this.toggleMultifileTabsPosition()
    },
    changeMultifilesActiveTab (tab) {
      // console.log('C > DatamiMultiFiles > switchTabsPosition > tab : ', tab)
      this.toggleMultifileActiveTab({ fileId: this.multiFilesId, activeTab: tab.id })
      this.changeUrlActiveTab(tab.tabId)
    },
    resetDialogs () {
      // console.log('\nC > DatamiMultiFiles > resetDialogs > ... ')
      this.resetMultiFilesDialog()
      this.deleteUrlParam('datami_detail_id')
    }
  }
}
</script>
