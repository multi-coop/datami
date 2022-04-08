<template>
  <div class="PreviewCsv content">
    <!-- DEBUG -->
    <div
      v-if="false"
      class="columns is-multiline">
      <div class="column is-12">
        <p>
          currentViewMode:
          <code>{{ currentViewMode }}</code>
        </p>
      </div>
      <div class="column is-6">
        <p>
          edited:
          <br>
          <pre><code>{{ edited }}</code></pre>
        </p>
      </div>
      <div class="column is-6">
        <p>
          data:
          <br>
          <pre><code>{{ data }}</code></pre>
        </p>
      </div>
    </div>

    <PreviewHelpers
      :file-id="fileId"
      :file-family="'table'"
      :locale="locale"/>

    <!-- WORK IN PROGRESS -->
    <!-- PREVIEWS -->
    <div v-if="data">
      <!-- ORIGINAL DATA -->
      <GitributeTable
        :file-id="fileId"
        :file-options="fileOptions"
        :data="data"
        :columns="dataColumns"
        :data-edited="edited"
        :columns-edited="editedColumns"
        :view="currentViewMode"
        :locale="locale"
        :debug="debug"
        @updateEdited="updateEdited"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mixinDiff, mixinCsv } from '@/utils/mixins.js'

import PreviewHelpers from '@/components/previews/PreviewHelpers'
import GitributeTable from '@/components/previews/GitributeTable'

export default {
  name: 'PreviewCsv',
  components: {
    PreviewHelpers,
    GitributeTable
  },
  mixins: [mixinDiff, mixinCsv],
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
      dataRaw: undefined,
      data: null,
      dataColumns: undefined,
      edited: undefined,
      editedColumns: undefined
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
      return this.getViewMode(this.fileId)
    },
    dataDiff () {
      const diff = this.data
      return diff
    },
    dataColumnsDiff () {
      const diff = this.dataColumns
      return diff
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
        const dataObj = this.csvToObject(next, this.fileOptions)
        this.dataRaw = dataObj
        if (!this.dataIsSet) { this.dataIsSet = true }
      }
    },
    dataIsSet (next) {
      // console.log('C > PreviewCsv > watch > fileRaw > next : \n', next)
      if (next) {
        this.data = this.dataRaw.data
        this.dataColumns = this.buildColumns()
        this.edited = this.data
        this.editedColumns = this.dataColumns
      }
    },
    edited (next) {
      if (next) {
        this.bufferizeEdited()
      }
    },
    fileIsSaving (next) {
      if (next) {
        // console.log('C > PreviewCsv > watch > fileIsSaving > next : ', next)
        this.bufferizeEdited()
      }
    }
  },
  methods: {
    ...mapActions({
      updateBuffer: 'git-data/updateBuffer'
    }),
    buildColumns () {
      const headers = this.dataRaw && this.dataRaw.headers
      // console.log('C > PreviewCsv > buildColumns > headers : ', headers)
      if (!headers) return null
      // if (this.fileOptions.abstractHeaders) {
      return Object.entries(headers)
        .map(entry => {
          return {
            field: entry[0],
            label: entry[1]
          }
        })
      // }
      // const columns = headers.map(h => {
      //   return { field: h, label: h }
      // })
      // return columns
    },
    updateEdited (event) {
      console.log('\nC > PreviewMd > updateEdited > event : ', event)
      let toEdit, newObj
      let rowIndex
      const isHeader = event.isHeader
      const colField = event.colField
      const val = event.val
      console.log('C > PreviewMd > updateEdited > isHeader : ', isHeader)
      console.log('C > PreviewMd > updateEdited > colField : ', colField)
      console.log('C > PreviewMd > updateEdited > val : ', val)
      if (isHeader) {
        // update edited headers
        newObj = { label: val, field: colField }
        toEdit = this.editedColumns.map(i => {
          if (i.field === colField) return newObj
          else return i
        })
        this.editedColumns = toEdit
      } else {
        // update edited data
        rowIndex = event.rowIndex
        newObj = { ...this.edited[rowIndex] }
        newObj[colField] = val
        toEdit = this.edited.map((row, idx) => {
          if (idx === rowIndex) return newObj
          else return row
        })
        this.edited = toEdit
      }
    },
    bufferizeEdited () {
      // TO DO => ObjToCsv function to rebuild the csv string from table object
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
