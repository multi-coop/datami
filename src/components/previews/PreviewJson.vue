<template>
  <div class="PreviewJson datami-component content">
    <!-- LOADERS -->
    <div v-if="fileIsLoading">
      <LoaderEditNavbar
        :file-id="fileId"
        :only-preview="onlyPreview"/>
      <LoaderJSON/>
    </div>

    <div v-if="!fileIsLoading">
      <PreviewHelpers
        v-if="!onlyPreview"
        :file-id="fileId"
        :file-family="'json'"
        :locale="locale"/>

      <!-- DEBUGGING -->
      <div
        v-if="false"
        class="columns is-multiline">
        <!-- DEBUG EDITED -->
        <div
          v-if="true && fileData"
          class="column is-6">
          <p>
            fileData.uuid: <br>
            <code>{{ fileData.uuid }}</code>
          </p>
          <p>
            fileData.fileUrl: <br>
            <code>{{ fileData.fileUrl }}</code>
          </p>
        </div>
        <div
          v-if="true && fileEdited"
          class="column is-6">
          <p>
            fileEdited.uuid: <br>
            <code>{{ fileEdited.uuid }}</code>
          </p>
          <p>
            fileEdited.fileUrl: <br>
            <code>{{ fileEdited.fileUrl }}</code>
          </p>
        </div>
      </div>

      <!-- VIEWS -->
      <div
        v-if="edited"
        class="columns is-centered">
        <!-- EDIT VIEW -->
        <div
          v-show="currentEditViewMode === 'edit'"
          :class="`column is-8`">
          <!-- <div class="my-3 has-text-centered">
            🚧 &nbsp; work in progress - edition - {{ allowKeyEdit }}
          </div> -->
          <JsonTree
            :file-id="fileId"
            :view="'edit'"
            :allow-key-edit="allowKeyEdit"
            :node-id="edited.id"
            :label="edited.label"
            :node-type="edited.nodeType"
            :nodes="edited.nodes"
            :depth="0"
            :locale="locale"
            :default-depth="defaultDepth"
            @updateJson="UpdateEditedJson"/>
        </div>
        <div
          v-if="debug && currentEditViewMode === 'edit'"
          class="column is-4">
          <p>
            edited:
            <code>
              <pre>{{ edited }}</pre>
            </code>
          </p>
        </div>

        <!-- DIFF VIEW -->
        <div
          v-show="currentEditViewMode === 'diff'"
          :class="`column is-half pr-6`">
          <!-- <div class="my-3 has-text-centered">
            🚧 work in progress - diff
          </div> -->
          <JsonTree
            :file-id="fileId"
            :view="'diff'"
            :node-id="edited.id"
            :label="edited.label"
            :node-type="edited.nodeType"
            :nodes="edited.nodes"
            :depth="0"
            :locale="locale"
            :default-depth="defaultDepth"
            :debug="false"
            :changes-nodes="changesNodes"/>
        </div>

        <!-- DIVIDER -->
        <div
          v-show="currentEditViewMode === 'diff'"
          class="divider is-vertical mx-0">
          <b-icon
            :icon="getIcon(currentEditViewMode)"
            size="is-small"/>
        </div>

        <!-- PREVIEW -->
        <div
          v-if="currentEditViewMode !== 'edit'"
          :class="`column ${currentEditViewMode === 'diff' ? 'pl-6' : 'is-8'}`">
          <!-- <div class="my-3 has-text-centered">
            🚧 work in progress - preview edited
          </div> -->
          <!-- <code><pre>{{ data }}</pre></code> -->
          <JsonTree
            :file-id="fileId"
            :view="'preview'"
            :node-id="getPreviewJson.id"
            :label="getPreviewJson.label"
            :node-type="getPreviewJson.nodeType"
            :nodes="getPreviewJson.nodes"
            :depth="0"
            :locale="locale"
            :default-depth="defaultDepth"/>
        </div>
      </div>
    </div>

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
    </div>
    <!-- COMPARISON INPUT > EDITED > OUTPUT -->
    <div
      v-if="false"
      class="columns is-multiline">
      <div class="column is-3">
        <p v-if="fileRaw">
          (target) JSON.parse(fileRaw):
          <code>
            <pre>{{ JSON.parse(fileRaw) }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-6">
        <p>
          edited:
          <code>
            <pre>{{ edited }}</pre>
          </code>
        </p>
      </div>
      <div
        v-if="edited"
        class="column is-3">
        <p>
          getObjectFromNodes:
          <code>
            <pre>{{ getObjectFromNodes }}</pre>
          </code>
        </p>
      </div>
    </div>
    <!-- CHANGES LOG -->
    <div
      v-if="false"
      class="columns is-multiline">
      <div class="column is-3">
        <p v-if="fileRaw">
          changesNodes:
          <code>
            <pre>{{ changesNodes }}</pre>
          </code>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import {
  mixinGlobal,
  mixinData,
  mixinCommit,
  mixinIcons,
  mixinDiff,
  mixinJson,
  mixinNodeToJson
} from '@/utils/mixins.js'

// import LoaderEditNavbar from '@/components/loaders/LoaderEditNavbar'
// import LoaderJSON from '@/components/loaders/LoaderJSON'

// import PreviewHelpers from '@/components/previews/PreviewHelpers'

// import JsonTree from '@/components/previews/JsonTree'

export default {
  name: 'PreviewJson',
  components: {
    // LoaderEditNavbar,
    // LoaderJSON,
    // PreviewHelpers,
    // JsonTree
    LoaderEditNavbar: () => import(/* webpackChunkName: "LoaderEditNavbar" */ '@/components/loaders/LoaderEditNavbar.vue'),
    LoaderJSON: () => import(/* webpackChunkName: "LoaderJSON" */ '@/components/loaders/LoaderJSON.vue'),
    PreviewHelpers: () => import(/* webpackChunkName: "PreviewHelpers" */ '@/components/previews/PreviewHelpers.vue'),
    JsonTree: () => import(/* webpackChunkName: "JsonTree" */ '@/components/previews/JsonTree.vue')
  },
  mixins: [
    mixinGlobal,
    mixinData,
    mixinCommit,
    mixinIcons,
    mixinDiff,
    mixinJson,
    mixinNodeToJson
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    fileRaw: {
      default: undefined,
      type: String
    },
    fileClientRaw: {
      default: '',
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
      // cssFiles: [
      //   'styles/components/previews/json/datami-json.css'
      // ],
      contentIsSet: false,
      beginEdit: false,
      data: undefined,
      edited: null,
      defaultDepth: 3,
      jsonSpaces: 2,
      changesNodes: []
    }
  },
  computed: {
    getObjectFromNodes () {
      return this.nodeToObj(this.edited)
    },
    getPreviewJson () {
      let dataForEditView
      // console.log('C > PreviewJson > getPreviewJson > this.currentEditViewMode :', this.currentEditViewMode)
      switch (this.currentEditViewMode) {
        // case 'edit':
        //   dataForEditView = this.edited
        //   break
        case 'diff':
          dataForEditView = this.data
          break
        case 'preview':
          dataForEditView = this.edited
          break
        default:
          dataForEditView = this.edited
          break
      }
      return dataForEditView
    },
    // getMixedJsons () {
    //   return this.mergeJsons(this.edited, this.data)
    // },
    allowKeyEdit () {
      const options = this.fileOptions
      return options && options.allowKeyEdit
    }
  },
  watch: {
    fileRaw (next) {
      if (next) {
        // console.log('C > PreviewJson > watch > fileRaw > next :', next)
        // update default depth from file options
        let defaultDepth = this.defaultDepth
        const depthFromOptions = this.fileOptions.defaultDepth
        if (depthFromOptions) {
          if (depthFromOptions > 1) { defaultDepth = depthFromOptions }
          if (depthFromOptions === 'all') { defaultDepth = undefined }
        }
        this.defaultDepth = defaultDepth
        if (!this.contentIsSet) { this.contentIsSet = true }
      }
    },
    fileClientRaw (next) {
      if (next) {
        // console.log('C > PreviewJson > watch > fileClientRaw > next :', next)
        const dataParsed = JSON.parse(next)
        // console.log('C > PreviewJson > watch > fileClientRaw > dataParsed :', dataParsed)
        const edited = this.objToNodes(dataParsed, 'root')
        this.edited = edited
      }
    },
    contentIsSet (next) {
      if (next) {
        // console.log('C > PreviewJson > watch > contentIsSet > next :', next)
        const dataParsed = JSON.parse(this.fileRaw)
        const data = this.objToNodes(dataParsed, 'root')
        this.data = data
        this.edited = data
      }
    },
    edited (next, prev) {
      if (next && !prev) {
        this.bufferizeEdited()
      }
    },
    fileIsSaving (next) {
      if (next) {
        // console.log('C > PreviewJson > watch > fileIsSaving > next : ', next)
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
      const edited = this.getObjectFromNodes
      const commitData = {
        gitObj: this.gitObj,
        edited: JSON.stringify(edited, null, this.jsonSpaces),
        newBranch: this.buildNewBranchName(this.gitObj.filefullname, this.fileId)
      }
      this.updateBuffer({ ...commitData, addToBuffer: true })
    },
    setChanges (changeObj) {
      // console.log('\nC > PreviewJson > setChanges > changeObj : ', changeObj)
      const changeId = changeObj.nodeId
      const changeIsLabel = changeObj.isLabel
      const action = changeObj.action
      const isDiff = changeObj.oldVal !== changeObj.val
      // console.log('C > PreviewJson > setChanges > changeId : ', changeId)
      // console.log('C > PreviewJson > setChanges > action : ', action)
      let copyChanges = [...this.changesNodes]
      // copyChanges = copyChanges.filter(ch => ch.field !== changeId)
      // console.log('C > PreviewJson > setChanges > copyChanges : ', copyChanges)
      if (action === 'diff') {
        copyChanges = copyChanges.filter(ch => {
          const sameNode = ch.nodeId === changeId
          const sameIsLabel = ch.isLabel === changeIsLabel
          const same = sameNode && sameIsLabel
          return !same
        })
      }
      if (action === 'deleted') {
        copyChanges = copyChanges.filter(ch => {
          const same = ch.nodeId === changeId
          return !same
        })
      }

      // set in copy
      const isAdded = copyChanges.find(ch => ch.id === changeId && ch.action === 'added')
      if (!isAdded && action === 'diff' && isDiff) copyChanges.push(changeObj)
      if (!isAdded && action !== 'diff') copyChanges.push(changeObj)
      // console.log('C > PreviewJson > setChanges > copyChanges : ', copyChanges)
      // set in local store
      this.changesNodes = copyChanges

      this.bufferizeEdited()

      // set in global store
      // const changesPayload = {
      //   fileId: this.fileId,
      //   isFields: isHeader,
      //   changes: copyChanges
      // }
      // this.updateFileChanges(changesPayload)
    },
    UpdateEditedJson (event) {
      // console.log('\nC > PreviewJson > UpdateEditedJson > event : ', event)
      this.setChanges(event)
      const edited = this.setEditInNode(this.edited, event)
      this.edited = edited
    }
  }
}
</script>
