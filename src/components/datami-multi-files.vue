<template>
  <div :class="`DatamiMultiFiles datami-widget-root datami-widget section ${isDarkMode ? 'datami-darkmode' : ''}`">
    <!-- MATOMO -->
    <MatomoScript
      :file-id="multiFilesId"
      :from-multifiles="true"/>

    <!-- DEBUGGING -->
    <!-- <p>
      scrolled : <pre><code>{{ scrolled }}</code></pre>
    </p> -->

    <DatamiTooltip
      v-if="tooltip"/>

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

      <!-- TITLE AND TAB OPTIONS -->
      <div
        v-if="!hideTitle"
        class="is-flex is-flex-direction-row is-align-items-center mb-4">
        <!-- TABS POSITION -->
        <MultiFilesTabsPosition
          :default-display="defaultDisplay"
          :locale="locale"
          @switch="switchTabsPosition"/>
        <!-- TITLE -->
        <span class="is-size-3 ml-5">
          {{ title }}
        </span>
      </div>

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
        <!-- <code>{{ activeTab }}</code> -->
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
                      {{ trimText(fileTab.title, 15) }}
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
                  <div v-if="debug">
                    fileTab : <br><pre><code>{{ fileTab }}</code><pre/></pre>
                  </div>

                  <!-- CALL DATAMI-FILE COMPONENT HERE -->
                  <DatamiFile
                    v-if="fileTab.gitfile"
                    :title="fileTab.title"
                    :gitfile="fileTab.gitfile"
                    :gitfilelocal="fileTab.gitfilelocal"
                    :localdev="fileTab.localdev"
                    :options="fileTab.options"
                    :usertoken="fileTab.usertoken"
                    :locale="locale || fileTab.locale"
                    :onlypreview="booleanFromValue(fileTab.onlypreview)"
                    :from-multi-files="true"
                    :from-multi-files-vertical="tabsVertical"
                    :trackalloutlinks="!fileTabIdx ? trackalloutlinks : false"/>

                  <!-- CALL DATAMI-FILE COMPONENT HERE -->
                  <DatamiExplowiki
                    v-if="fileTab.mediawiki"
                    :title="fileTab.title"
                    :wikilist="fileTab.wikilist"
                    :wikipages="fileTab.wikipages"
                    :options="fileTab.options"
                    :usertoken="fileTab.usertoken"
                    :locale="fileTab.locale"
                    :onlypreview="booleanFromValue(fileTab.onlypreview)"
                    :from-multi-files="true"
                    :from-multi-files-vertical="tabsVertical"
                    :trackalloutlinks="!fileTabIdx ? trackalloutlinks : false"/>
                </div>
              </div>
            </b-tab-item>
          </template>
        </b-tabs>
      </section>
    </div>
  </div>
</template>

<script>
import { trimText, booleanFromValue } from '@/utils/globalUtils'

import { mapActions } from 'vuex'

import { mixinTooltip, mixinGlobal, mixinForeignKeys } from '@/utils/mixins.js'

export default {
  name: 'DatamiMultiFiles',
  components: {
    MatomoScript: () => import(/* webpackChunkName: "MatomoScript" */ '@/components/matomo/MatomoScript.vue'),
    DatamiTooltip: () => import(/* webpackChunkName: "DatamiTooltip" */ '@/components/user/DatamiTooltip.vue'),
    MultiFilesTabsPosition: () => import(/* webpackChunkName: "MultiFilesTabsPosition" */ '@/components/user/MultiFilesTabsPosition.vue'),
    ButtonCopyWidgetHtml: () => import(/* webpackChunkName: "ButtonCopyWidgetHtml" */ '@/components/user/ButtonCopyWidgetHtml.vue'),
    DatamiFile: () => import(/* webpackChunkName: "DatamiFile" */ '@/components/datami-file.vue'),
    DatamiExplowiki: () => import(/* webpackChunkName: "DatamiExplowiki" */ '@/components/datami-explowiki.vue')
  },
  mixins: [
    mixinTooltip,
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
        'styles/datami-multi-files.css'
      ],
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
  beforeMount () {
    this.setWidgetCopy()

    // Set up files
    // console.log('\nC > DatamiMultiFiles > beforeMount > this.gitfiles : ', this.gitfiles)
    const files = this.gitfiles && JSON.parse(this.gitfiles)
    // console.log('C > DatamiMultiFiles > beforeMount > files : ', files)
    const filesParsed = files && files.map(file => {
      const isMediawiki = file.wikipages || file.wikilist
      const fileSettings = {
        ...file,
        ...{ id: this.uuidv4() },
        ...{ options: JSON.stringify(file.options) },
        ...isMediawiki && { mediawiki: isMediawiki },
        ...isMediawiki && { wikipages: JSON.stringify(file.wikipages) }
      }
      return fileSettings
    })

    // Set default active tab
    const defaultFile = filesParsed.find(file => file.activate && file['default-tab']) || files[0]
    // console.log('C > DatamiMultiFiles > beforeMount > defaultFile : ', defaultFile)
    this.activeTab = defaultFile.id

    // console.log('C > DatamiMultiFiles > beforeMount > files : ', files)
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

    // Set in store
    // console.log('\nC > DatamiMultiFiles > beforeMount > multiFilesOptions : ', multiFilesOptions)
    this.addFileOptions(multiFilesOptions)
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
      activateTrackAllOutlinks: 'activateTrackAllOutlinks'
    }),
    switchTabsPosition (btn) {
      // console.log('C > DatamiMultiFiles > switchTabsPosition > btn : ', btn)
      this.tabsVertical = btn.position === 'vertical'
    }
  }
}
</script>

<style>

.datami-floating-right {
  float: right;
}

.datami-darkmode-white-text{
  color: white !important;
}
.datami-darkmode{
  background-color: #2d2d30 !important;
}

.datami-container {
  max-width: 100% !important;
}
.datami-darkmode-tab-header.is-active > a {
  background-color: #2d2d30 !important;
  border: 1px solid white !important;
}

.multi-files-tabs.is-vertical.width-80 > .tab-content {
  width: 80%;
}
.multi-files-tabs.is-vertical.width-80 > .tabs {
  width: 20%;
}

.multi-files-tabs > nav > ul {
  border-bottom: none !important;
}

.datami-multi-files-tab-horizontal.is-active a {
  border: #dbdbdb thin solid !important;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  border-bottom-color: transparent !important;
}

.datami-multi-files-tab-horizontal:not(.is-active) a:hover {
  border: #dbdbdb thin solid !important;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  background-color: white !important;
}

.datami-multi-files-tab-vertical.is-active a {
  border: #dbdbdb thin solid !important;
  border-radius: 6px;
}

.datami-multi-files-tab-vertical:not(.is-active) a {
  border: none !important;
}

.datami-multi-files-tab-vertical:not(.is-active) a:hover {
  border: #dbdbdb thin solid !important;
  border-radius: 6px;
  background-color: white !important;
}

.datami-clearmode-tab-header a {
  color: grey !important;
}
.datami-darkmode-tab-header a {
  color: white !important;
}

.datami-multi-files-tab.datami-darkmode-tab-header.is-active a {
  color: white !important;
}
.datami-multi-files-tab.datami-clearmode-tab-header.is-active a {
  color: black !important;
}

.datami-multi-files-tab.datami-darkmode-tab-header.is-active a:hover {
  color: white !important;
}
.datami-multi-files-tab.datami-clearmode-tab-header.is-active a:hover {
  color: black !important;
}

.datami-multi-files-tab.datami-darkmode-tab-header:not(.is-active) a:hover {
  color: black !important;
}
.datami-multi-files-tab.datami-clearmode-tab-header:not(.is-active) a:hover {
  color: black !important;
}

.multifiles-container {
  margin-left: -1em;
  margin-right: -1em;
  margin-top: -1em;
}
.multifiles-container-top {
  margin-top: -1em;
}
.add-multifiles-border {
  border-left: 1px solid #dbdbdb;
  border-right: 1px solid #dbdbdb;
  border-bottom: 1px solid #dbdbdb;
  border-top: 1px solid #dbdbdb;
}
.add-multifiles-border-top {
  border-top: 1px solid #dbdbdb;
}
</style>
