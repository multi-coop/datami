<template>
  <div class="">
    <h1>{{ msg }}</h1>
    <!--
    <h2>{{ user }}</h2>
    <h2>{{ data }}</h2>
    <h2>{{ filters }}</h2>
    -->

    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-half">
        <p>
          gitfile:
          <code>
            {{ gitfile }}
          </code>
        </p>
        <p>
          fileType:
          <code>
            {{ fileType }}
          </code>
        </p>
      </div>
      <div class="column is-half">
        <p>
          gitObj:
          <br>
          <code>
            <pre>
            {{ gitObj }}
          </pre>
          </code>
        </p>
      </div>
      <div class="column is-half">
        <p>
          fileInfos:
          <br>
          <code>
            <pre>
            {{ fileInfos }}
          </pre>
          </code>
        </p>
      </div>
      <div class="column is-half">
        <p>
          fileRaw:
          <br>
          <code>
            <pre>
            {{ fileRaw }}
          </pre>
          </code>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { mixin } from '@/utils/mixins.js'

export default {
  name: 'GitributeFile',
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
      fileRaw: undefined
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
