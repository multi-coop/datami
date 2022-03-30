<template>
  <div class="section">
    <!-- TO DO - USER NAVBAR -->
    <div class="container mb-4">
      <NavbarSkeleton
        v-if="gitObj"
        :title="title"
        :git-obj="gitObj"
        :file-infos="fileInfos"/>
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

    <!-- PREVIEWS - SWITCH BY FILE TYPE -->

    <div
      v-if="['csv'].includes(fileType)"
      class="container">
      <PreviewCsv
        :git-obj="gitObj"
        :file-infos="fileInfos"
        :file-options="fileOptions"
        :file-raw="fileRaw"
        :locale="locale"
        :debug="debug"/>
    </div>

    <div
      v-if="['md'].includes(fileType)"
      class="container">
      <PreviewMd
        :git-obj="gitObj"
        :file-infos="fileInfos"
        :file-options="fileOptions"
        :file-raw="fileRaw"
        :locale="locale"
        :debug="debug"/>
    </div>

    <div
      v-if="['json', 'geojson'].includes(fileType)"
      class="container">
      <PreviewJson
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
import GitributeCredits from '@/components/credits/GitributeCredits'

export default {
  name: 'GitributeFile',
  components: {
    NavbarSkeleton,
    PreviewCsv,
    PreviewMd,
    PreviewJson,
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
      user: (state) => state['git-user'].test,
      filters: (state) => state['git-filters'].test,
      data: (state) => state['git-data'].test
    }),
    ...mapGetters({
      getGitObj: 'getGitObj',
      getGitInfosObj: 'getGitInfosObj'
    })
  },
  beforeMount () {
    // console.log('\nC > GitributeFile > beforeMount > this.gitfile : ', this.gitfile)
    if (!this.getGitInfos[this.gitfile]) {
      this.getGitInfos(this.gitfile)
    }
    // build options object
    this.fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
  },
  async mounted () {
    // console.log('C > GitributeFile > mount > this.gitInfos : ', this.gitInfos)
    this.gitObj = this.getGitInfosObj(this.gitfile)
    this.fileType = this.gitObj.filetype
    this.fileInfos = await this.getFileData(this.gitObj)
    this.fileRaw = await this.getFileDataRaw(this.gitObj)
    // this.updateLocale(this.locale)
  },
  methods: {
    ...mapActions({
      getGitInfos: 'getGitInfos'
      // updateLocale: 'git-user/updateLocale'
    })
  }
}
</script>
