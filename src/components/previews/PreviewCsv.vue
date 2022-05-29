<template>
  <div class="PreviewCsv content">
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-12">
        <p>
          currentEditViewMode:
          <code>{{ currentEditViewMode }}</code>
        </p>
        <p>
          currentViewMode:
          <code>{{ currentViewMode }}</code>
        </p>
        <p>
          fileIsLoading:
          <code>{{ fileIsLoading }}</code>
        </p>
      </div>
      <!-- DEBUG RAW CONTENT OBJECTS -->
      <div
        v-if="true"
        class="column is-6">
        <p>
          dataRaw:
          <br>
          <pre><code>{{ dataRaw }}</code></pre>
        </p>
      </div>
      <div
        v-if="true"
        class="column is-6">
        <p>
          wikiRaw:
          <br>
          <pre><code>{{ wikiRaw }}</code></pre>
        </p>
      </div>
      <!-- DEBUG EDITED -->
      <div
        v-if="debug"
        class="column is-6">
        <p>
          edited:
          <br>
          <pre><code>{{ edited }}</code></pre>
        </p>
      </div>
      <div
        v-if="debug"
        class="column is-6">
        <p>
          data:
          <br>
          <pre><code>{{ data }}</code></pre>
        </p>
      </div>
    </div>

    <!-- LOADERS -->
    <div v-if="fileIsLoading">
      <LoaderEditNavbar
        :file-id="fileId"
        :only-preview="onlyPreview"/>
      <LoaderSortFilters/>
      <LoaderCards v-show="currentViewMode === 'cards'"/>
      <LoaderCSV v-show="currentViewMode === 'table'"/>
    </div>

    <div v-if="!fileIsLoading">
      <!-- HELPERS -->
      <PreviewHelpers
        v-if="!onlyPreview"
        :file-id="fileId"
        :file-family="'table'"
        :locale="locale"/>

      <!-- PREVIEWS -->
      <div v-if="data">
        <!-- ORIGINAL DATA -->
        <GitributeTable
          :file-id="fileId"
          :data="data"
          :columns="dataColumns"
          :data-edited="edited"
          :columns-edited="editedColumns"
          :changes-data="changesData"
          :changes-columns="changesColumns"
          :items-total="itemsTotal || edited.length"
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

import { mixinGlobal, mixinCommit, mixinDiff, mixinCsv, mixinDownload } from '@/utils/mixins.js'

import LoaderEditNavbar from '@/components/loaders/LoaderEditNavbar'
import LoaderSortFilters from '@/components/loaders/LoaderSortFilters'
import LoaderCSV from '@/components/loaders/LoaderCSV'
import LoaderCards from '@/components/loaders/LoaderCards'

import PreviewHelpers from '@/components/previews/PreviewHelpers'
import GitributeTable from '@/components/previews/GitributeTable'

import { defaultTagsSeparator } from '@/utils/globalUtils'

export default {
  name: 'PreviewCsv',
  components: {
    LoaderEditNavbar,
    LoaderSortFilters,
    LoaderCSV,
    LoaderCards,
    PreviewHelpers,
    GitributeTable
  },
  mixins: [
    mixinGlobal,
    mixinCommit,
    mixinDiff,
    mixinCsv,
    mixinDownload
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    fileRaw: {
      default: '',
      type: String
    },
    wikiRaw: {
      default: null,
      type: Object
    },
    fileClientRaw: {
      default: '',
      type: String
    },
    itemsTotal: {
      default: 0,
      type: Number
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
      // flags
      dataIsSet: false,
      beginEdit: false,
      // table data
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
    wikiRaw (next) {
      if (next && next !== '') {
        // console.log('\nC > PreviewCsv > watch > wikiRaw > next : ', next)
        // console.log('C > PreviewCsv > watch > wikiRaw > this.fileOptions : ', this.fileOptions)
        this.dataRaw = next
        this.data = this.dataRaw.data
        this.dataColumns = this.buildColumns(this.dataRaw)
        this.edited = this.data
        this.editedColumns = this.dataColumns
      }
    },
    dataIsSet (next) {
      if (next) {
        // console.log('C > PreviewCsv > watch > dataIsSet > next : \n', next)
        this.data = this.dataRaw.data
        this.dataColumns = this.buildColumns(this.dataRaw)
        // console.log('C > PreviewCsv > watch > dataIsSet > this.dataColumns : \n', this.dataColumns)
        this.edited = this.data
        this.editedColumns = this.dataColumns
      }
    },
    fileClientRaw (next) {
      if (next) {
        // console.log('C > PreviewCsv > watch > fileClientRaw > next : \n', next)
        const dataObj = this.csvToObject(next, this.fileOptions)
        this.edited = dataObj.data
        this.editedColumns = this.buildColumns(dataObj)
      }
    },
    edited (next, prev) {
      if (next && !prev) {
        this.bufferizeEdited()
      }
    },
    fileIsDownloading (next) {
      console.log('\nC > GitributeTable > watch > fileIsDownloading > next : ', next)
      if (next && this.gitObj.filetype === 'wiki') {
        // console.log('C > GitributeTable > watch > fileIsDownloading > this.gitObj : ', this.gitObj)
        const editedCsv = this.ObjectToCsv(this.dataColumns, this.data, this.fileOptions)
        // console.log('C > GitributeTable > watch > fileIsDownloading > editedCsv : ', editedCsv)
        const dl = this.buildFileLink(editedCsv, window)
        console.log('C > GitributeTable > watch > fileIsDownloading > dl : ', dl)
        // this.removeLink(dl)
        this.updateDownloading({ fileId: this.fileId, isDownloading: false })
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
    buildEnumArr (data, separator) {
      const dataCopy = data.filter(d => !!d)
      // console.log('C > PreviewCsv > buildEnumArr > dataCopy : ', dataCopy)
      // console.log('C > PreviewCsv > buildEnumArr > separator : ', separator)
      const dataParsed = []
      dataCopy && dataCopy.forEach(tag => {
        if (tag.includes(separator)) {
          const subArr = tag.split(separator).map(t => t.trim())
          dataParsed.push(...subArr)
        } else {
          dataParsed.push(tag)
        }
      })
      const enumArr = [...new Set(dataParsed)].sort((a, b) => a.localeCompare(b))
      // console.log('C > PreviewCsv > buildEnumArr > enumArr : ', enumArr)
      return enumArr
    },
    buildColumns (dataRaw) {
      const headers = dataRaw && dataRaw.headers
      // console.log('\nC > PreviewCsv > buildColumns > headers : ', headers)
      // console.log('C > PreviewCsv > buildColumns > dataRaw : ', dataRaw)
      // console.log('C > PreviewCsv > buildColumns > dataRaw.data[0] : ', dataRaw.data[0])
      // console.log('C > PreviewCsv > buildColumns > this.fileOptions : ', this.fileOptions)
      const tableSchema = this.fileOptions.tableschema
      // console.log('C > PreviewCsv > buildColumns > tableSchema : ', tableSchema)
      if (!headers) return null
      const fields = Object.entries(headers)
        .map(entry => {
          const fieldId = entry[0]
          const fieldLabel = entry[1].trim()
          const fieldProps = tableSchema && tableSchema.fields.find(schema => schema.name === fieldLabel)
          const fieldConstraints = fieldProps && fieldProps.constraints
          // console.log('C > PreviewCsv > buildColumns > fieldConstraints : ', fieldConstraints)
          const fieldCustomProps = fieldProps && fieldProps['custom-properties']
          let fieldData = {
            field: fieldId,
            label: fieldLabel.trim(),
            type: (fieldProps && fieldProps.type) || 'string',
            name: (fieldProps && fieldProps.name) || fieldLabel
            // title: fieldProps && fieldProps.title,
            // description: fieldProps && fieldProps.description,

            // subtype: fieldSubtype,
            // locked: fieldCustomProps && fieldCustomProps.locked,
            // tagSeparator: fieldCustomProps && fieldCustomProps.tagSeparator,
            // isCategory: fieldCustomProps && fieldCustomProps.category,
            // customProperties: fieldCustomProps
          }
          // parse data for unique values on tag columns
          const fieldSubtype = fieldCustomProps && fieldCustomProps.subtype
          const needEnumArr = fieldSubtype === 'tag'
          const defaultEnumArr = fieldConstraints && fieldConstraints.enum
          fieldData = {
            ...fieldData,
            ...fieldProps && fieldProps.title && { title: fieldProps.title },
            ...fieldProps && fieldProps.description && { description: fieldProps.description },
            ...fieldSubtype && { subtype: fieldSubtype },
            ...fieldCustomProps && fieldCustomProps.locked && { locked: fieldCustomProps.locked },
            ...fieldCustomProps && fieldCustomProps.tagSeparator && { tagSeparator: fieldCustomProps.tagSeparator },
            ...fieldCustomProps && fieldCustomProps.category && { isCategory: fieldCustomProps.category },
            ...defaultEnumArr && { enumArr: defaultEnumArr }
          }
          if (!defaultEnumArr && needEnumArr) {
            const enumArr = this.buildEnumArr(
              dataRaw.data.map(item => item[fieldId]),
              fieldCustomProps.tagSeparator || defaultTagsSeparator
            )
            fieldData.enumArr = enumArr
          }
          return fieldData
        })
      // console.log('C > PreviewCsv > buildColumns > fields : ', fields)
      return fields
    },
    updateEdited (event) {
      // console.log('\nC > PreviewCsv > updateEdited > event : ', event)
      let toEdit, newObj, oldEditedObj, originalObj, oldVal
      let rowId
      const isHeader = event.isHeader
      const colField = event.colField
      const wasAdded = event.added
      const val = event.val
      // console.log('C > PreviewCsv > updateEdited > isHeader : ', isHeader)
      // console.log('C > PreviewCsv > updateEdited > colField : ', colField)
      // console.log('C > PreviewCsv > updateEdited > val : ', val)
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
          // console.log('C > PreviewCsv > updateEdited > oldVal : ', oldVal)
        } else {
          originalObj = { ...oldEditedObj }
        }
        // console.log('C > PreviewCsv > updateEdited > oldEditedObj : ', oldEditedObj)

        newObj = { ...oldEditedObj }
        newObj[colField] = val
        // console.log('C > PreviewCsv > updateEdited > newObj : ', newObj)
        // console.log('C > PreviewCsv > updateEdited > this.edited (A) : ', this.edited)
        // reset edited
        toEdit = this.edited.map((row) => {
          if (row.id === rowId) return newObj
          else return row
        })
        this.edited = [...toEdit]
        // console.log('C > PreviewCsv > updateEdited > this.edited (B) : ', this.edited)
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
      // console.log('\nC > PreviewCsv > addRowEvent > changeObj : ', changeObj)
      // console.log('C > PreviewCsv > addRowEvent > isDiff : ', isDiff)
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
      // console.log('C > PreviewCsv > addRowEvent > copyChanges : ', copyChanges)

      // set in local store
      if (isHeader) {
        this.changesColumns = copyChanges
      } else {
        this.changesData = copyChanges
      }
    },
    addRowEvent (event) {
      // console.log('\nC > PreviewCsv > addRowEvent > event : ', event)
      // update edited
      const newRowId = this.uuidv4()
      const newRow = { ...event.row, id: newRowId, added: true }
      // console.log('C > PreviewCsv > addRowEvent > newRow : ', newRow)
      // console.log('C > PreviewCsv > addRowEvent > this.edited : ', this.edited)
      this.edited.push(newRow)
      // console.log('C > PreviewCsv > addRowEvent > this.edited : ', this.edited)

      // update changesData
      const changeObj = {
        action: 'added',
        id: newRow.id
      }
      this.setChanges(changeObj)
    },
    deleteRowsEvent (event) {
      // console.log('\nC > PreviewCsv > deleteRowEvent > event : ', event)
      const toDeleteIndices = event.rows.map(rowToDelete => rowToDelete.id)
      const edited = [...this.edited]
      this.edited = edited.filter(r => !toDeleteIndices.includes(r.id))
      // console.log('C > PreviewCsv > deleteRowEvent > this.edited : ', this.edited)

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
      // console.log('\nC > PreviewCsv > sortEdited > event : ', event)
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
      // console.log('\nC > PreviewCsv > bufferizeEdited > editedCsv : ', editedCsv)

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
