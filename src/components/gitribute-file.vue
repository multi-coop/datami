<template>
  <div class="section">
    <!-- USER NAVBAR -->
    <div class="container mb-4">
      <NavbarSkeleton
        v-if="gitObj"
        :title="title"
        :file-id="fileId"
        :locale="locale"/>
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
          fileInfos:
          <br>
          <code>
            <pre>{{ fileInfos }}</pre>
          </code>
        </p>
      </div>
      <div class="column is-one-third">
        <p>
          fileRaw:
          <br>
          <code>
            <pre>{{ fileRaw }}</pre>
          </code>
        </p>
      </div>
    </div>

    <!-- LOADERS -->
    <LoaderCSV v-if="fileIsReloading && fileTypeFamily === 'table'"/>
    <LoaderMD v-if="fileIsReloading && fileTypeFamily === 'text'"/>
    <LoaderMD v-if="fileIsReloading && fileTypeFamily === 'json'"/>

    <!-- FILE NAVBAR BUTTONS -->
    <EditNavbarSkeleton
      v-if="!fileIsReloading && !fileIsSaving"
      :file-id="fileId"
      :file-type-family="fileTypeFamily"
      :view-mode="currentViewMode"
      :locale="locale"/>

    <!-- CONFIRM COMMIT MODAL -->
    <ConfirmCommit
      v-show="fileIsSaving"
      :file-id="fileId"
      :locale="locale"
      :debug="debug"/>

    <!-- PREVIEWS - SWITCH BY FILE TYPE -->
    <!-- PREVIEWS CSV -->
    <div v-show="!fileIsSaving">
      <div
        v-if="fileTypeFamily === 'table'"
        class="container">
        <PreviewCsv
          v-show="!fileIsReloading"
          :file-id="fileId"
          :file-options="fileOptions"
          :file-raw="fileRaw"
          :locale="locale"
          :debug="debug"/>
      </div>

      <!-- PREVIEWS MD -->
      <div
        v-if="fileTypeFamily === 'text'"
        class="container">
        <PreviewMd
          v-show="!fileIsReloading"
          :file-id="fileId"
          :file-options="fileOptions"
          :file-raw="fileRaw"
          :locale="locale"
          :debug="debug"/>
      </div>

      <!-- PREVIEWS JSON -->
      <div
        v-if="fileTypeFamily === 'json'"
        class="container">
        <PreviewJson
          v-show="!fileIsReloading"
          :file-id="fileId"
          :file-options="fileOptions"
          :file-raw="fileRaw"
          :locale="locale"
          :debug="debug"/>
      </div>
    </div>

    <!-- CREDITS -->
    <GitributeCredits
      :locale="locale"/>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

import { mixin } from '@/utils/mixins.js'
import { extractGitInfos } from '@/utils/utilsGitUrl.js'

import NavbarSkeleton from '@/components/navbar/NavbarSkeleton'

import EditNavbarSkeleton from '@/components/edition/EditNavbarSkeleton'
import ConfirmCommit from '@/components/edition/ConfirmCommit'

import PreviewCsv from '@/components/previews/PreviewCsv'
import PreviewMd from '@/components/previews/PreviewMd'
import PreviewJson from '@/components/previews/PreviewJson'

import LoaderCSV from '@/components/loaders/LoaderCSV'
import LoaderMD from '@/components/loaders/LoaderMD'

import GitributeCredits from '@/components/credits/GitributeCredits'

export default {
  name: 'GitributeFile',
  components: {
    NavbarSkeleton,
    EditNavbarSkeleton,
    ConfirmCommit,
    PreviewCsv,
    PreviewMd,
    PreviewJson,
    LoaderCSV,
    LoaderMD,
    GitributeCredits
  },
  mixins: [mixin],
  props: {
    title: {
      default: 'gitribute',
      type: String
    },
    gitfile: {
      default: '',
      type: String
    },
    options: {
      default: 'en',
      type: String
    },
    usertoken: {
      default: '',
      type: String
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      fileId: undefined,
      fileType: undefined,
      // gitObj: undefined,
      fileInfos: undefined,
      fileRaw: undefined,
      fileOptions: undefined
    }
  },
  computed: {
    ...mapState({
      // test: (state) => state.test,
      gitInfos: (state) => state.gitInfos,
      // user: (state) => state['git-user'].test,
      // filters: (state) => state['git-filters'].test,
      // data: (state) => state['git-data'].test,
      reloading: (state) => state['git-data'].reloading
    }),
    ...mapGetters({
      getGitObj: 'getGitObj',
      getGitInfosObj: 'getGitInfosObj',
      fileNeedsReload: 'git-data/fileNeedsReload',
      fileNeedsSaving: 'git-data/fileNeedsSaving',
      getViewMode: 'git-data/getViewMode'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    fileIsReloading () {
      // console.log('C > GitributeFile > fileIsReloading > this.gitInfos : ', this.gitInfos)
      const resp = !this.gitObj || this.fileNeedsReload(this.fileId)
      // console.log('C > GitributeFile > fileIsReloading > resp : ', resp)
      return resp
    },
    fileIsSaving () {
      const resp = !this.gitObj || this.fileNeedsSaving(this.fileId)
      return resp
    },
    currentViewMode () {
      return this.getViewMode(this.gitObj.uuid)
    }
  },
  watch: {
    fileIsReloading (next) {
      // console.log('C > GitributeFile > watch > fileIsReloading > next : ', next)
      if (next) { this.reloadFile() }
    },
    fileIsSaving (next) {
      if (next) {
        console.log('C > GitributeFile > watch > fileIsSaving > next : ', next)
      }
    }
  },
  beforeMount () {
    // console.log('\nC > GitributeFile > beforeMount > this.gitfile : ', this.gitfile)
    const gitInfosObject = extractGitInfos(this.gitfile)
    const fileUuid = uuidv4()
    gitInfosObject.uuid = fileUuid
    this.fileId = gitInfosObject.uuid
    this.fileType = gitInfosObject.filetype
    if (!this.getGitInfosObj[this.fileId]) {
      // this.gitObj = gitInfosObject
      this.updateToken({ fileId: this.fileId, token: this.usertoken })
      this.addGitInfos(gitInfosObject)
      // console.log('\nC > GitributeFile > beforeMount > gitInfos : ', gitInfos)
    }
    // console.log('C > GitributeFile > beforeMount > this.gitObj : ', this.gitObj)
    // build options object
    this.fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
  },
  async mounted () {
    // console.log('\nC > GitributeFile > mount > this.gitInfos : ', this.gitInfos)
    // console.log('C > GitributeFile > mount > this.gitObj : ', this.gitObj)
    // console.log('C > GitributeFile > mount > this.usertoken : ', this.usertoken)
    // this.fileInfos = await this.getFileData(this.gitObj)
    // console.log('C > GitributeFile > mount > this.fileInfos : ', this.fileInfos)
    await this.reloadFile()
  },
  methods: {
    ...mapActions({
      addGitInfos: 'addGitInfos',
      addFileReqInfos: 'addFileReqInfos',
      updateToken: 'git-data/updateToken',
      updateReloading: 'git-data/updateReloading'
    }),
    async reloadFile () {
      // Update reloading in store - true
      this.updateReloading({ fileId: this.fileId, isLoading: true })

      // Request API for file infos
      const fileInfos = await this.getFileData(this.gitObj)
      fileInfos.uuid = this.fileId
      this.addFileReqInfos(fileInfos)
      this.fileInfos = fileInfos
      // console.log('C > GitributeFile > reloadFile > this.fileInfos : ', this.fileInfos)

      // Request API for file content
      this.fileRaw = await this.getFileDataRaw(this.gitObj)

      // Update reloading in store - false
      this.updateReloading({ fileId: this.fileId, isLoading: false })
    }
  }
}
</script>
