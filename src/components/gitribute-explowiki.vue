<template>
  <div class="section">
    <div class="container mb-4">
      <div class="columns is-mobile mb-4">
        <!-- FILE TITLE -->
        <div class="column is-9">
          <FileTitle
            :show-file-infos="showFileInfos"
            :title="title"
            :file-id="fileId"
            :locale="locale"
            @toggleInfos="showFileInfos = !showFileInfos"/>
        </div>
        <!-- USER NAVBAR -->
        <div class="column is-3">
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

    <!-- FILE INFOS -->
    <DialogFileInfos
      v-show="showFileInfos"
      v-model="showFileInfos"
      :file-id="fileId"
      :locale="locale"
      :debug="debug"
      @closeDialogFileInfos="showFileInfos = false"/>

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

    <!-- PREVIEWS - SWITCH BY FILE TYPE -->

    <!-- PREVIEWS CARDS -->
    <!-- TO DO  -->

    <!-- PREVIEWS CSV -->
    <div
      v-if="fileTypeFamily === 'table'"
      class="container">
      <PreviewCsv
        :only-preview="onlypreview"
        :file-id="fileId"
        :file-is-loading="fileIsLoading"
        :file-raw="fileRaw"
        :locale="locale"
        :debug="debug"/>
    </div>

    <!-- CREDITS -->
    <GitributeCredits
      :locale="locale"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal, mixinGit } from '@/utils/mixins.js'

import FileTitle from '@/components/navbar/FileTitle'
import UserOptions from '@/components/user/UserOptions'

import NotificationErrors from '@/components/errors/NotificationErrors'

import EditNavbarSkeleton from '@/components/edition/EditNavbarSkeleton'
import DialogFileInfos from '@/components/previews/DialogFileInfos'

import PreviewCsv from '@/components/previews/PreviewCsv'

import GitributeCredits from '@/components/credits/GitributeCredits'

export default {
  name: 'GitributeExploWiki',
  components: {
    FileTitle,
    UserOptions,
    NotificationErrors,
    EditNavbarSkeleton,
    DialogFileInfos,
    PreviewCsv,
    GitributeCredits
  },
  mixins: [
    mixinGlobal,
    mixinGit
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
    wikifile: {
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
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      onlypreview: true,
      // file infos
      fileId: undefined,
      fileType: undefined,
      fileInfos: undefined,
      fileRaw: undefined,
      showFileInfos: false
    }
  },
  watch: {
    fileIsLoading (next) {
      // console.log('C > GitributeExploWiki > watch > fileIsLoading > next : ', next)
      if (next) { this.reloadFile() }
    }
  },
  beforeMount () {
    console.log('\nC > GitributeExploWiki > beforeMount > this.wikifile : ', this.wikifile)
    const gitInfosObject = this.extractGitInfos(this.wikifile)
    const fileUuid = this.uuidv4()
    gitInfosObject.uuid = fileUuid
    console.log('C > GitributeExploWiki > beforeMount > gitInfosObject : ', gitInfosObject)
    this.fileId = gitInfosObject.uuid
    this.fileType = gitInfosObject.filetype
    if (!this.getGitInfosObj[this.fileId]) {
      // this.gitObj = gitInfosObject
      this.addGitInfos(gitInfosObject)
    }
    console.log('C > GitributeExploWiki > beforeMount > this.gitObj : ', this.gitObj)
    // build options object
    const fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
    this.addFileOptions({ ...fileOptions, uuid: gitInfosObject.uuid })
  },
  async mounted () {
    await this.reloadFile()
  },
  methods: {
    ...mapActions({
      addGitInfos: 'addGitInfos',
      addFileOptions: 'addFileOptions',
      addFileReqInfos: 'addFileReqInfos',
      updateReloading: 'git-data/updateReloading',
      updateReqErrors: 'git-data/updateReqErrors'
    }),
    async reloadFile () {
      // Update reloading in store - true
      this.updateReloading({ fileId: this.fileId, isLoading: true })
      this.updateReqErrors({ fileId: this.fileId, addToErrors: false })

      // Request API for file infos
      const respData = await this.getFileData(this.gitObj)
      // console.log('\nC > GitributeExploWiki > reloadFile > respData : ', respData)
      const fileInfos = respData.data
      const fileInfosErrors = respData.errors
      fileInfos.uuid = this.fileId
      this.addFileReqInfos(fileInfos)
      this.fileInfos = fileInfos
      // console.log('C > GitributeExploWiki > reloadFile > this.fileInfos : ', this.fileInfos)

      // Request API for file content
      const respDataRaw = await this.getFileDataRaw(this.gitObj)
      // console.log('C > GitributeExploWiki > reloadFile > respDataRaw : ', respDataRaw)
      const fileRaw = respDataRaw.data
      const fileRawErrors = respDataRaw.errors
      this.fileRaw = fileRaw

      // update errors if any
      if (fileInfosErrors.length || fileRawErrors.length) {
        const errors = [...fileInfosErrors, ...fileRawErrors]
        this.updateReqErrors({ fileId: this.fileId, errors: errors, addToErrors: true })
      }

      // Update reloading in store - false
      this.updateReloading({ fileId: this.fileId, isLoading: false })
    }
  }
}
</script>

<style>

.no-text-transform {
  text-transform: none!important;
}

</style>
