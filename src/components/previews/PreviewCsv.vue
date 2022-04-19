<template>
  <div class="PreviewCsv content">
    <!-- DEBUG -->
    <div
      v-if="false"
      class="columns is-multiline">
      <div class="column is-12">
        <p>
          currentEditViewMode:
          <code>{{ currentEditViewMode }}</code>
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

    <!-- LOADERS -->
    <div v-if="fileIsLoading">
      <LoaderEditNavbar :only-preview="onlyPreview"/>
      <LoaderCSV/>
    </div>

    <div v-if="!fileIsLoading">
      <!-- HELPERS -->
      <PreviewHelpers
        v-if="!onlyPreview"
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
          :allow-header-edit="allowHeaderEdit"
          :data="data"
          :columns="dataColumns"
          :data-edited="edited"
          :columns-edited="editedColumns"
          :changes-data="changesData"
          :changes-columns="changesColumns"
          :locale="locale"
          :debug="debug"
          @updateEdited="updateEdited"
          @deleteRows="deleteRowsEvent"
          @addRow="addRowEvent"
          @sortRows="sortEdited"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal, mixinCommit, mixinDiff, mixinCsv } from '@/utils/mixins.js'

import LoaderEditNavbar from '@/components/loaders/LoaderEditNavbar'
import LoaderCSV from '@/components/loaders/LoaderCSV'

import PreviewHelpers from '@/components/previews/PreviewHelpers'
import GitributeTable from '@/components/previews/GitributeTable'

export default {
  name: 'PreviewCsv',
  components: {
    LoaderEditNavbar,
    LoaderCSV,
    PreviewHelpers,
    GitributeTable
  },
  mixins: [
    mixinGlobal,
    mixinCommit,
    mixinDiff,
    mixinCsv
  ],
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
      allowHeaderEdit: false,
      dataIsSet: false,
      beginEdit: false,
      dataRaw: undefined,
      data: null,
      dataColumns: undefined,
      edited: undefined,
      editedColumns: undefined,
      changesData: [],
      changesColumns: []
    }
  },
  computed: {
    dataDiff () {
      const diff = this.data
      return diff
    },
    dataColumnsDiff () {
      const diff = this.dataColumns
      return diff
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
    edited (next, prev) {
      if (next && !prev) {
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
      let toEdit, newObj, oldEditedObj, originalObj, oldVal
      let rowId
      const isHeader = event.isHeader
      const colField = event.colField
      const wasAdded = event.added
      const val = event.val
      // console.log('C > PreviewMd > updateEdited > isHeader : ', isHeader)
      // console.log('C > PreviewMd > updateEdited > colField : ', colField)
      // console.log('C > PreviewMd > updateEdited > val : ', val)
      if (isHeader) {
        // update edited headers
        oldVal = this.dataColumns.find(i => i.field === colField).label
        newObj = { label: val, field: colField }
        toEdit = this.editedColumns.map(c => {
          if (c.field === colField) return newObj
          else return c
        })
        this.editedColumns = toEdit
      } else {
        // retrieve previous object and value in edited
        rowId = event.id
        oldEditedObj = this.edited.find((row) => row.id === rowId)
        // retrieve previous original value
        if (!wasAdded) {
          originalObj = this.data.find((row) => row.id === rowId)
          oldVal = originalObj && originalObj[colField]
          // console.log('C > PreviewMd > updateEdited > oldVal : ', oldVal)
        } else {
          originalObj = { ...oldEditedObj }
        }
        // console.log('C > PreviewMd > updateEdited > oldEditedObj : ', oldEditedObj)

        newObj = { ...oldEditedObj }
        newObj[colField] = val
        // console.log('C > PreviewMd > updateEdited > newObj : ', newObj)
        // console.log('C > PreviewMd > updateEdited > this.edited (A) : ', this.edited)
        // reset edited
        toEdit = this.edited.map((row) => {
          if (row.id === rowId) return newObj
          else return row
        })
        this.edited = [...toEdit]
        // console.log('C > PreviewMd > updateEdited > this.edited (B) : ', this.edited)
      }
      // set changes
      const changeObj = {
        action: 'diff',
        id: rowId,
        field: colField,
        val: val,
        oldVal: oldVal
      }
      this.setChanges(changeObj, isHeader)
    },
    setChanges (changeObj, isHeader) {
      let copyChanges
      let changeId //, isDeleted
      const action = changeObj.action
      const isDiff = changeObj.oldVal !== changeObj.val
      console.log('\nC > PreviewMd > addRowEvent > changeObj : ', changeObj)
      console.log('C > PreviewMd > addRowEvent > isDiff : ', isDiff)
      if (isHeader) {
        changeId = changeObj.field
        // create a filtered copy of changesColumns
        copyChanges = [...this.changesColumns]
        copyChanges = copyChanges.filter(ch => ch.field !== changeId)
      } else {
        changeId = changeObj.id
        // create a filtered copy of changesData
        copyChanges = [...this.changesData]
        if (action === 'diff') {
          copyChanges = copyChanges.filter(ch => {
            const sameId = ch.id === changeId
            const sameField = ch.field === changeObj.field
            const same = sameField && sameId
            return !same
          })
        }
        if (changeObj.action === 'deleted') {
          copyChanges = copyChanges.filter(ch => {
            const same = ch.id === changeObj.id
            return !same
          })
        }
      }
      // set in copy
      const isAdded = copyChanges.find(ch => ch.id === changeId && ch.action === 'added')
      if (!isAdded && action === 'diff' && isDiff) copyChanges.push(changeObj)
      if (!isAdded && action !== 'diff') copyChanges.push(changeObj)
      console.log('C > PreviewMd > addRowEvent > copyChanges : ', copyChanges)

      // set in local store
      if (isHeader) {
        this.changesColumns = copyChanges
      } else {
        this.changesData = copyChanges
      }
    },
    addRowEvent (event) {
      console.log('\nC > PreviewMd > addRowEvent > event : ', event)
      // update edited
      const newRowId = this.uuidv4()
      const newRow = { ...event.row, id: newRowId, added: true }
      console.log('C > PreviewMd > addRowEvent > newRow : ', newRow)
      console.log('C > PreviewMd > addRowEvent > this.edited : ', this.edited)
      this.edited.push(newRow)
      // console.log('C > PreviewMd > addRowEvent > this.edited : ', this.edited)

      // update changesData
      const changeObj = {
        action: 'added',
        id: newRow.id
      }
      this.setChanges(changeObj)
    },
    deleteRowsEvent (event) {
      console.log('\nC > PreviewMd > deleteRowEvent > event : ', event)
      const toDeleteIndices = event.rows.map(rowToDelete => rowToDelete.id)
      const edited = [...this.edited]
      this.edited = edited.filter(r => !toDeleteIndices.includes(r.id))
      // console.log('C > PreviewMd > deleteRowEvent > this.edited : ', this.edited)

      // update changesData
      toDeleteIndices.forEach(rowId => {
        const changeObj = {
          action: 'deleted',
          id: rowId
        }
        this.setChanges(changeObj)
      })
    },
    sortEdited (event) {
      // console.log('\nC > PreviewMd > sortEdited > event : ', event)
      const sorting = event.value
      const sortingField = sorting.header && sorting.header.field
      const sortIsAscending = sorting.ascending
      if (sortingField) {
        // sort by a field
        if (sortIsAscending) {
          this.edited = this.edited.sort((a, b) => a[sortingField] > b[sortingField] ? 1 : -1)
        } else {
          this.edited = this.edited.sort((a, b) => a[sortingField] < b[sortingField] ? 1 : -1)
        }
      } else {
        // default : sort by id
        this.edited = this.edited.sort((a, b) => a.id > b.id ? 1 : -1)
      }
    },
    // BUFFER
    bufferizeEdited () {
      const editedCsv = this.ObjectToCsv(this.editedColumns, this.edited, this.fileOptions)
      // console.log('\nC > PreviewMd > bufferizeEdited > editedCsv : ', editedCsv)

      const commitData = {
        gitObj: this.gitObj,
        edited: editedCsv,
        newBranch: this.buildNewBranchName(this.gitObj.filefullname, this.fileId)
      }
      this.updateBuffer({ ...commitData, addToBuffer: true })
    }
  }
}
</script>
