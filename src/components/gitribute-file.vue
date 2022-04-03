<template>
  <div class="section">
    <!-- TO DO - USER NAVBAR -->
    <div class="container mb-4">
      <NavbarSkeleton
        v-if="gitObj"
        :title="title"
        :file-type-family="fileTypeFamily"
        :git-obj="gitObj"
        :file-infos="fileInfos"
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
      <p>
        fileIsReloading: {{ fileIsReloading }}
      </p>
      <p>
        reloading: {{ reloading }}
      </p>
      <p>
        fileTypeFamily: {{ fileTypeFamily }}
      </p>
    </div>

    <SkeletonCSV v-if="fileIsReloading && fileTypeFamily === 'table'"/>
    <SkeletonMD v-if="fileIsReloading && fileTypeFamily === 'text'"/>
    <SkeletonMD v-if="fileIsReloading && fileTypeFamily === 'json'"/>

    <!-- PREVIEWS - SWITCH BY FILE TYPE -->
    <!-- PREVIEWS CSV -->
    <div
      v-if="fileTypeFamily === 'table'"
      class="container">
      <PreviewCsv
        v-show="!fileIsReloading"
        :git-obj="gitObj"
        :file-infos="fileInfos"
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
        :git-obj="gitObj"
        :file-infos="fileInfos"
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
        :git-obj="gitObj"
        :file-infos="fileInfos"
        :file-options="fileOptions"
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
import { mapState, mapGetters, mapActions } from 'vuex'
import { mixin } from '@/utils/mixins.js'
import NavbarSkeleton from '@/components/navbar/NavbarSkeleton'
import PreviewCsv from '@/components/previews/PreviewCsv'
import PreviewMd from '@/components/previews/PreviewMd'
import PreviewJson from '@/components/previews/PreviewJson'
import SkeletonCSV from '@/components/loaders/SkeletonCSV'
import SkeletonMD from '@/components/loaders/SkeletonMD'
import GitributeCredits from '@/components/credits/GitributeCredits'

export default {
  name: 'GitributeFile',
  components: {
    NavbarSkeleton,
    PreviewCsv,
    PreviewMd,
    PreviewJson,
    SkeletonCSV,
    SkeletonMD,
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
      fileType: undefined,
      gitObj: undefined,
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
      fileNeedsReload: 'git-data/fileNeedsReload'
    }),
    fileIsReloading () {
      // console.log('C > GitributeFile > fileIsReloading > this.gitInfos : ', this.gitInfos)
      return this.gitObj && this.fileNeedsReload(this.gitObj.id)
    }
  },
  watch: {
    fileIsReloading (next) {
      if (next) { this.reloadFile() }
    }
  },
  beforeMount () {
    // console.log('\nC > GitributeFile > beforeMount > this.gitfile : ', this.gitfile)
    if (!this.getGitInfosObj[this.gitfile]) {
      this.buildGitInfos(this.gitfile)
      // console.log('\nC > GitributeFile > beforeMount > gitInfos : ', gitInfos)
    }
    // build options object
    this.fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
  },
  async mounted () {
    // console.log('C > GitributeFile > mount > this.gitInfos : ', this.gitInfos)
    // console.log('C > GitributeFile > mount > this.usertoken : ', this.usertoken)
    this.gitObj = this.getGitInfosObj(this.gitfile)
    this.updateToken({ fileId: this.gitObj.id, token: this.usertoken })
    this.fileType = this.gitObj.filetype
    this.fileInfos = await this.getFileData(this.gitObj)
    this.updateReloading({ fileId: this.gitObj.id, action: 'add' })
    this.reloadFile()
  },
  methods: {
    ...mapActions({
      buildGitInfos: 'buildGitInfos',
      updateToken: 'git-data/updateToken',
      updateReloading: 'git-data/updateReloading'
    }),
    async reloadFile () {
      this.fileRaw = await this.getFileDataRaw(this.gitObj)
      this.updateReloading({ fileId: this.gitObj.id, action: 'remove' })
    }
  }
}
</script>
