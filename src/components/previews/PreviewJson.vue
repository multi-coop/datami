<template>
  <div class="PreviewJson content">
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-full">
        <p>
          data:
          <code>
            <pre>{{ data }}</pre>
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
          :class="`column is-half pr-6`">
          🚧 work in progress - edition
          <code><pre>{{ data }}</pre></code>
        </div>

        <!-- DIFF VIEW -->
        <div
          v-show="currentViewMode === 'diff'"
          :class="`column is-half pr-6`">
          🚧 work in progress - diff
          <code><pre>{{ data }}</pre></code>
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
          🚧 work in progress - preview edited
          <code><pre>{{ data }}</pre></code>
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

export default {
  name: 'PreviewJson',
  components: {
    LoaderEditNavbar,
    LoaderMD,
    PreviewHelpers
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
      edited: null
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
        this.data = this.fileRaw
        if (!this.contentIsSet) { this.contentIsSet = true }
      }
    },
    contentIsSet (next) {
      // console.log('C > PreviewMd > watch > fileRaw > next : \n', next)
      if (next) {
        this.edited = this.data
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
      const edited = `${this.dataEdited}\n${this.edited}`
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
