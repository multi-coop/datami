<template>
  <div class="PreviewCsv content">
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
    <p>
      currentViewMode : <code>{{ currentViewMode }}</code>
    </p>
    <div v-if="data">
      <b-table
        :data="tableData"
        narrowed
        hoverable
        sticky-header
        striped
        :columns="columns"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mixinCsv } from '@/utils/mixins.js'

export default {
  name: 'PreviewCsv',
  mixins: [mixinCsv],
  props: {
    fileId: {
      default: null,
      type: String
    },
    fileOptions: {
      default: undefined,
      type: Object
    },
    fileRaw: {
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
      dataIsSet: false,
      data: null,
      edited: undefined
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
    },
    tableData () {
      const dataRaw = this.data && this.data.data
      // TO DO => split cell content into tags if option says so
      // if (this.fileOptions.tagseparator) return
      return dataRaw
    },
    columns () {
      const columns = this.data && this.data.headers
      // console.log('C > PreviewCsv > columns > columns : ', columns)
      if (!columns) return null
      if (this.fileOptions.abstractHeaders) {
        return Object.entries(columns)
          .map(entry => {
            return {
              field: entry[0],
              label: entry[1]
            }
          })
      }
      return columns.map(h => {
        return { field: h, label: h }
      })
    },
    fileIsSaving () {
      const resp = !this.gitObj || this.fileNeedsSaving(this.fileId)
      return resp
    }
  },
  watch: {
    fileRaw (next) {
      if (next && next !== '') {
        // console.log('C > PreviewCsv > watch > fileRaw > next : \n', next)
        // console.log('C > PreviewCsv > watch > fileRaw > this.fileOptions : ', this.fileOptions)
        this.data = this.csvToObject(next, this.fileOptions)
        this.edited = this.csvToObject(next, this.fileOptions)
        if (!this.dataIsSet) { this.dataIsSet = true }
      }
    },
    dataIsSet (next) {
      // console.log('C > PreviewMd > watch > fileRaw > next : \n', next)
      if (next) {
        this.edited = this.data
      }
    },
    edited (next) {
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
      const commitData = {
        gitObj: this.gitObj,
        edited: this.edited,
        newBranch: this.buildNewBranchName(this.gitObj.filefullname, this.fileId)
      }
      this.updateBuffer({ ...commitData, addToBuffer: true })
    }
  }
}
</script>
