<template>
  <div class="container">
    <div class="content px-4 py-4">
      <div class="">
        <p class="is-size-3">
          <b-icon
            icon="home"/>
          {{ msg }}
        </p>

        <!-- DEBUG -->
        <div
          v-if="debug"
          class="columns is-multiline">
          <div class="column is-full">
            <p>
              gitfile:
              <code>
                {{ gitfile }}
              </code>
            </p>
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

        <!-- TO DO - USER NAVBAR -->

        <!-- PREVIEWS - SWITCH BY FILE TYPE -->

        <div v-if="['csv'].includes(fileType)">
          <PreviewCsv
            :git-obj="gitObj"
            :file-infos="fileInfos"
            :file-options="fileOptions"
            :file-raw="fileRaw"/>
        </div>

        <div v-if="['md'].includes(fileType)">
          <PreviewMd
            :git-obj="gitObj"
            :file-infos="fileInfos"
            :file-options="fileOptions"
            :file-raw="fileRaw"/>
        </div>

        <div v-if="['json', 'geojson'].includes(fileType)">
          <PreviewJson
            :git-obj="gitObj"
            :file-infos="fileInfos"
            :file-options="fileOptions"
            :file-raw="fileRaw"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { mixin } from '@/utils/mixins.js'
import PreviewCsv from '@/components/previews/PreviewCsv'
import PreviewMd from '@/components/previews/PreviewMd'
import PreviewJson from '@/components/previews/PreviewJson'

export default {
  name: 'GitributeFile',
  components: {
    PreviewCsv,
    PreviewMd,
    PreviewJson
  },
  mixins: [mixin],
  props: {
    msg: {
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
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      debug: true,
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
    console.log('\nC > beforeMount > GitributeFile > this.gitfile : ', this.gitfile)
    if (!this.getGitInfos[this.gitfile]) {
      this.getGitInfos(this.gitfile)
    }
    // build options object
    this.fileOptions = this.options && this.options.length ? JSON.parse(this.options) : {}
  },
  async mounted () {
    // console.log('C > mount > GitributeFile > this.gitInfos : ', this.gitInfos)
    this.gitObj = this.getGitInfosObj(this.gitfile)
    this.fileType = this.gitObj.filetype
    this.fileInfos = await this.getFileData(this.gitObj)
    this.fileRaw = await this.getFileDataRaw(this.gitObj)
  },
  methods: {
    ...mapActions({
      getGitInfos: 'getGitInfos'
    })
  }
}
</script>
