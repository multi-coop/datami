<template>
  <div class="GitributeMultiFiles gitribute-widget section">
    <div class="container mb-4">
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

      <!-- TABS : LOOP FILES -->
      <section>
        <b-tabs
          v-model="activeTab"
          :type="tabsVertical ? '' : 'is-boxed'"
          :vertical="tabsVertical"
          :class="`multi-files-tabs is-flex-wrap-nowrap ${tabsVertical ? (hovered ? 'width-70' : 'width-80') : ''}`"
          multiline>
          <template>
            <b-tab-item
              v-for="(fileTab, fileTabIdx) in files"
              :key="fileTab.id"
              :value="fileTab.id"
              header-class="gitribute-multi-files-tab">
              <!-- TAB HEADER -->
              <template #header>
                <div
                  v-if="fileTab.activate"
                  @mouseover="hovered = fileTab.id"
                  @mouseleave="hovered = undefined">
                  <b-tag
                    class="mr-2"
                    rounded>
                    {{ fileTabIdx + 1 }}
                  </b-tag>
                  <span>
                    {{ trimText(fileTab.title, hovered === fileTab.id ? 25 : 15) }}
                  </span>
                </div>
              </template>

              <!-- TAB CONTENT -->
              <div
                v-if="fileTab.activate"
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
                    :locale="fileTab.locale"
                    :onlypreview="fileTab.onlypreview"
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
                    :onlypreview="fileTab.onlypreview"
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
import { trimText } from '@/utils/globalUtils'

import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

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
    mixinGlobal
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
    // set up files
    // console.log('\nC > GitributeMultiFiles > beforeMount > this.gitfiles : ', this.gitfiles)
    const files = this.gitfiles && JSON.parse(this.gitfiles)
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
    const defaultFile = files.find(file => file['default-tab']) ?? files[0]
    this.activeTab = defaultFile.id

    // console.log('C > GitributeMultiFiles > beforeMount > files : ', files)
    this.files = filesParsed || []

    // set up options
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

    // set in store
    console.log('\nC > GitributeMultiFiles > beforeMount > multiFilesOptions : ', multiFilesOptions)
    this.addFileOptions(multiFilesOptions)
  },
  methods: {
    trimText,
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
.multi-files-tabs.is-vertical.width-80 > .tab-content {
  width: 80%;
}
.multi-files-tabs.is-vertical.width-70 > .tab-content {
  width: 65%;
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
