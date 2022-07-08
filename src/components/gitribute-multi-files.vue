<template>
  <div class="GitributeMultiFiles gitribute-widget section">
    <div
      class="container mb-4 gitribute-container">
      <!-- DEBUGGING -->
      <div
        v-if="debug"
        class=" container columns is-multiline">
        <div class="column is-6">
          activeTab : <code>{{ activeTab }}</code>
        </div>
        <div class="column is-6">
          multiFilesOptions : <code>{{ multiFilesOptions }}</code>
        </div>
      </div>

      <!-- TITLE AND TAB OPTIONS -->
      <div class="columns is-mobile">
        <div class="column is-10 is-flex is-flex-direction-row is-align-items-center">
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
        <div class="column is-2 is-flex is-flex-direction-row is-align-items-center is-justify-content-flex-end pt-2">
          <ButtonCopyWidgetHtml
            :file-id="multiFilesId"
            :from-multi-files="true"
            :locale="locale"/>
        </div>
      </div>

      <!-- DEBUGGING FOREIGN KEYS-->
      <div
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
      </div>

      <!-- TABS : LOOP FILES -->
      <section>
        <!-- <code>{{ activeTab }}</code> -->
        <b-tabs
          v-model="activeTab"
          :type="tabsVertical ? '' : 'is-boxed'"
          :vertical="tabsVertical"
          :class="`multi-files-tabs is-flex-wrap-nowrap ${tabsVertical ? 'width-80' : ''}`"
          multiline>
          <template>
            <b-tab-item
              v-for="(fileTab, fileTabIdx) in files.filter(f => f.activate)"
              :key="fileTab.id"
              :value="fileTab.id"
              header-class="gitribute-multi-files-tab">
              <!-- TAB HEADER -->
              <template #header>
                <div
                  @mouseover="hovered = fileTab.id"
                  @mouseleave="hovered = undefined">
                  <b-tag
                    class="mr-2 has-text-weight-bold"
                    :type="`is-${(activeTab === fileTab.id) ? 'dark' : hovered === fileTab.id ? 'white' : 'grey' }`"
                    rounded>
                    {{ fileTabIdx + 1 }}
                  </b-tag>
                  <span :class="`${hovered === fileTab.id ? 'has-text-black' : ''}`">
                    <span v-if="!tabsVertical">
                      {{ trimText(fileTab.title, 15) }}
                    </span>
                    <span v-else>
                      {{ fileTab.title }}
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

                  <!-- CALL GITRIBUTE-FILE COMPONENT HERE -->
                  <GitributeFile
                    v-if="fileTab.gitfile"
                    :title="fileTab.title"
                    :gitfile="fileTab.gitfile"
                    :options="fileTab.options"
                    :usertoken="fileTab.usertoken"
                    :locale="locale || fileTab.locale"
                    :onlypreview="booleanFromValue(fileTab.onlypreview)"
                    :from-multi-files="true"
                    :from-multi-files-vertical="tabsVertical"/>

                  <!-- CALL GITRIBUTE-FILE COMPONENT HERE -->
                  <GitributeExplowiki
                    v-if="fileTab.mediawiki"
                    :title="fileTab.title"
                    :wikilist="fileTab.wikilist"
                    :wikipages="fileTab.wikipages"
                    :options="fileTab.options"
                    :usertoken="fileTab.usertoken"
                    :locale="fileTab.locale"
                    :onlypreview="booleanFromValue(fileTab.onlypreview)"
                    :from-multi-files="true"
                    :from-multi-files-vertical="tabsVertical"/>
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

import { mixinGlobal, mixinForeignKeys } from '@/utils/mixins.js'

import MultiFilesTabsPosition from '@/components/user/MultiFilesTabsPosition'
import ButtonCopyWidgetHtml from '@/components/user/ButtonCopyWidgetHtml'
import GitributeFile from '@/components/gitribute-file'
import GitributeExplowiki from '@/components/gitribute-explowiki'

export default {
  name: 'GitributeMultiFiles',
  components: {
    MultiFilesTabsPosition,
    ButtonCopyWidgetHtml,
    GitributeFile,
    GitributeExplowiki
  },
  mixins: [
    mixinGlobal,
    mixinForeignKeys
  ],
  props: {
    title: {
      default: 'gitribute-multi-files',
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
    debug: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      multiFilesId: undefined,
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
    // console.log('\nC > GitributeMultiFiles > beforeMount > this.gitfiles : ', this.gitfiles)
    const files = this.gitfiles && JSON.parse(this.gitfiles)
    // console.log('C > GitributeMultiFiles > beforeMount > files : ', files)
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
    // console.log('C > GitributeMultiFiles > beforeMount > defaultFile : ', defaultFile)
    this.activeTab = defaultFile.id

    // console.log('C > GitributeMultiFiles > beforeMount > files : ', files)
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

    // Set in store
    // console.log('\nC > GitributeMultiFiles > beforeMount > multiFilesOptions : ', multiFilesOptions)
    this.addFileOptions(multiFilesOptions)
  },
  mounted () {
    // Pre-store files for possible further sharing
    this.files.forEach(file => {
      // console.log('C > GitributeMultiFiles > mounted > file.gitfile : ', file.gitfile)
      this.updateShareableFiles({ gitfile: file.gitfile, isSet: false })
    })
  },
  methods: {
    trimText,
    booleanFromValue,
    ...mapActions({
      addFileOptions: 'addFileOptions'
    }),
    switchTabsPosition (btn) {
      // console.log('C > GitributeMultiFiles > switchTabsPosition > btn : ', btn)
      this.tabsVertical = btn.position === 'vertical'
    }
  }
}
</script>

<style>

.gitribute-container {
  max-width: 100% !important;
}

.multi-files-tabs.is-vertical.width-80 > .tab-content {
  width: 80%;
}
.multi-files-tabs.is-vertical.width-80 > .tabs {
  width: 20%;
}
.gitribute-multi-files-tab a {
  color: grey !important;
}
.gitribute-multi-files-tab.is-active a {
  color: #363636 !important;
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
}
.add-multifiles-border-top {
  border-top: 1px solid #dbdbdb;
}
</style>
