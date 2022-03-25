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
          gitInfos:
          <br>
          <code>
            <pre>
            {{ gitInfos }}
          </pre>
          </code>
        </p>
      </div>
      <div class="column is-half">
        <p>
          gitfile:
          <br>
          <code>
            <pre>
            {{ gitfile }}
          </pre>
          </code>
          https://gitlab.com/multi-coop/gitribute-content-test/-/blob/main/texts/jailbreak-devient-multi-fr.md
          <br>
          https://gitlab.com/multi-coop/gitribute-content-test/-/raw/main/texts/jailbreak-devient-multi-fr.md
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
    }
  },
  data () {
    return {
      debug: true,
      fileType: undefined
    }
  },
  computed: {
    ...mapState({
      // test: (state) => state.test,
      gitInfos: (state) => state.gitInfos,
      user: (state) => state['git-user'].test,
      filters: (state) => state['git-filters'].test,
      data: (state) => state['git-data'].test
    })
  },
  beforeMount () {
    console.log('C > beforeMount > GitributeFile > this.gitfile : ', this.gitfile)
    if (!this.gitInfos) {
      this.getGitInfos(this.gitfile)
    }
  },
  mounted () {
    console.log('C > mount > GitributeFile > this.gitInfos : ', this.gitInfos)
    this.getData(this.gitInfos)
  },
  methods: {
    ...mapActions({
      getGitInfos: 'getGitInfos'
    })
  }
}
</script>
