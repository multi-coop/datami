<template>
  <div class="PreviewJson content">
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-4">
        <p>
          data:
          <code>
            <pre>{{ data }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-4">
        <p>
          edited:
          <code>
            <pre>{{ edited }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-4">
        <p v-if="fileRaw">
          (target) JSON.parse(fileRaw):
          <code>
            <pre>{{ JSON.parse(fileRaw) }}</pre>
          </code>
        </p>
      </div>
    </div>

    <!-- LOADERS -->
    <div v-if="fileIsLoading">
      <LoaderEditNavbar v-if="!onlyPreview"/>
      <LoaderMD/>
    </div>

    <div v-if="!fileIsLoading">
      <PreviewHelpers
        v-if="!onlyPreview"
        :file-id="fileId"
        :file-family="'json'"
        :locale="locale"/>

      <!-- VIEWS -->
      <div
        v-if="edited"
        class="columns is-mobile">
        <!-- EDIT VIEW -->
        <div
          v-show="currentViewMode === 'edit'"
          :class="`column is-6 pr-6`">
          <div class="my-3 has-text-centered">
            🚧 work in progress - edition
          </div>
          <!-- <code><pre>{{ data }}</pre></code> -->
          <JsonTree
            :view="currentViewMode"
            :label="edited.label"
            :node-type="edited.nodeType"
            :nodes="edited.nodes"
            :depth="0"
            :locale="locale"
            :default-depth="defaultDepth"/>
        </div>

        <!-- DIFF VIEW -->
        <div
          v-show="currentViewMode === 'diff'"
          :class="`column is-half pr-6`">
          <div class="my-3 has-text-centered">
            🚧 work in progress - diff
          </div>
          <!-- <code><pre>{{ data }}</pre></code> -->
          <JsonTree
            :view="currentViewMode"
            :label="edited.label"
            :node-type="edited.nodeType"
            :nodes="edited.nodes"
            :depth="0"
            :locale="locale"
            :default-depth="defaultDepth"/>
        </div>

        <!-- DIVIDER -->
        <div
          v-show="currentViewMode !== 'preview'"
          class="divider is-vertical mx-0">
          <b-icon
            v-if="currentViewMode === 'diff'"
            :icon="getIcon(currentViewMode)"
            size="is-small"/>
          <b-icon
            v-if="currentViewMode === 'edit'"
            :icon="getIcon(currentViewMode)"
            size="is-small"/>
        </div>

        <!-- PREVIEW -->
        <div
          :class="`column ${currentViewMode !== 'preview' ? 'pl-6' : ''}`">
          <div class="my-3 has-text-centered">
            🚧 work in progress - preview edited
          </div>
          <!-- <code><pre>{{ data }}</pre></code> -->
          <JsonTree
            :view="'preview'"
            :label="edited.label"
            :node-type="edited.nodeType"
            :nodes="edited.nodes"
            :depth="0"
            :locale="locale"
            :default-depth="defaultDepth"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mixinIcons, mixinDiff, mixinJson } from '@/utils/mixins.js'

import LoaderEditNavbar from '@/components/loaders/LoaderEditNavbar'
import LoaderMD from '@/components/loaders/LoaderMD'

import PreviewHelpers from '@/components/previews/PreviewHelpers'

import JsonTree from '@/components/previews/JsonTree'

export default {
  name: 'PreviewJson',
  components: {
    LoaderEditNavbar,
    LoaderMD,
    PreviewHelpers,
    JsonTree
  },
  mixins: [mixinIcons, mixinDiff, mixinJson],
  props: {
    fileId: {
      default: null,
      type: String
    },
    fileOptions: {
      default: undefined,
      type: Object
    },
    fileIsLoading: {
      default: true,
      type: Boolean
    },
    fileIsSaving: {
      default: true,
      type: Boolean
    },
    fileRaw: {
      default: undefined,
      type: String
    },
    locale: {
      default: '',
      type: String
    },
    onlyPreview: {
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
      contentIsSet: false,
      beginEdit: false,
      data: undefined,
      edited: null,
      defaultDepth: 3
      // testJsonTree: {
      //   label: 'root',
      //   nodeType: 'arr',
      //   nodes: [
      //     {
      //       label: 'item1',
      //       nodeType: 'arr',
      //       nodes: [
      //         {
      //           label: 'item1.1',
      //           nodeType: 'num',
      //           value: 110
      //         },
      //         {
      //           label: 'item1.2',
      //           nodeType: 'obj',
      //           nodes: [
      //             {
      //               label: 'item1.2.1',
      //               nodeType: 'str',
      //               value: 'a str test'
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       label: 'item2',
      //       nodeType: 'str',
      //       value: 'another str test'
      //     }
      //   ]
      // },
      // testJson: {
      //   '1-obj': {
      //     '1.1-obj': {
      //       '1.1.1-str': 'test',
      //       '1.1.2-num': 10,
      //       '1.1.3-bool': true,
      //       '1.1.4-arr': [1, 2, 3]
      //     },
      //     '1.2-arr': [
      //       {
      //         '1.2.1-obj': {
      //           'third-str': 'test',
      //           'third-num': 10,
      //           'third-bool': true
      //         }
      //       },
      //       'str in 1.2'
      //     ],
      //     '1.3-str': 'test',
      //     '1.4-num': 10,
      //     '1.5-bool': true
      //   }
      // }
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode',
      getGitInfosObj: 'getGitInfosObj',
      buildNewBranchName: 'buildNewBranchName',
      fileNeedsSaving: 'git-data/fileNeedsSaving'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    currentViewMode () {
      return this.getViewMode(this.gitObj.uuid)
    }
  },
  watch: {
    fileRaw (next) {
      if (next) {
        // const dataParsed = JSON.parse(this.fileRaw)
        // this.data = JSON.parse(this.fileRaw)
        // this.data = this.testJson
        if (!this.contentIsSet) { this.contentIsSet = true }
      }
    },
    contentIsSet (next) {
      if (next) {
        console.log('C > PreviewMd > watch > contentIsSet > next :', next)
        const dataParsed = JSON.parse(this.fileRaw)
        this.data = this.objToNodes(dataParsed, 'root')
        this.edited = this.objToNodes(dataParsed, 'root')
      }
    },
    edited (next, prev) {
      if (next && !prev) {
        this.bufferizeEdited()
      }
    },
    dataEdited (next) {
      if (next) {
        this.bufferizeEdited()
      }
    },
    fileIsSaving (next) {
      if (next) {
        // console.log('C > PreviewMd > watch > fileIsSaving > next : ', next)
        this.bufferizeEdited()
      }
    }
  },
  methods: {
    ...mapActions({
      updateBuffer: 'git-data/updateBuffer'
    }),
    bufferizeEdited () {
      // const edited = this.objectToMd(this.edited, this.data)
      const edited = this.edited
      const commitData = {
        gitObj: this.gitObj,
        // edited: this.edited,
        edited: edited,
        newBranch: this.buildNewBranchName(this.gitObj.filefullname, this.fileId)
      }
      this.updateBuffer({ ...commitData, addToBuffer: true })
    }
  }
}
</script>
