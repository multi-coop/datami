<template>
  <div class="PreviewCsv content">
    <!-- DEBUGGING -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-12">
        - fileIsLoading : <code>{{ fileIsLoading }}</code><br>
        - !!fileRaw : <code>{{ !!fileRaw }}</code><br>
        - !!dataRaw : <code>{{ !!dataRaw }}</code><br>
        - !!data : <code>{{ !!data }}</code><br>
        - !!fileOptions : <code>{{ !!fileOptions }}</code><br>
      </div>
    </div>
    <!-- DEBUGGING -->
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
          fileOptions:
          <br>
          <pre><code>{{ fileOptions }}</code></pre>
        </p>
      </div>
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
        v-if="debug"
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

    <!-- DEBUGGING SIGNALS -->
    <!-- <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-12">
        <p>
          fileSignals:
          <br>
          <pre><code>{{ fileSignals }}</code></pre>
        </p>
      </div>
    </div> -->

    <!-- LOADERS -->
    <div
      v-if="fileIsLoading || !fileOptions"
      class="datami-loaders container">
      <!-- <LoaderEditNavbar
        :file-id="fileId"
        :only-preview="onlyPreview"/> -->
      <LoaderSortFilters/>
      <LoaderCards v-if="currentViewMode === 'cards'"/>
      <LoaderCSV v-else-if="currentViewMode === 'dataviz'"/>
      <LoaderCSV v-else-if="currentViewMode === 'map'"/>
      <LoaderCSV v-else/>
    </div>

    <div
      v-if="!fileIsLoading"
      class="datami-preview-helpers">
      <!-- HELPERS -->
      <PreviewHelpers
        v-if="!onlyPreview && currentViewMode !== 'map'"
        :file-id="fileId"
        :file-family="'table'"
        :locale="locale"/>

      <!-- DEBUGGING -->
      <!-- <div
        v-if="debug"
        class="columns is-multiline">
        <div
          v-if="true && fileData"
          class="column is-6">
          <p>
            fileData.uuid:<br>
            <code>{{ fileData.uuid }}</code>
          </p>
          <p>
            fileData.fileUrl:<br>
            <code>{{ fileData.fileUrl }}</code>
          </p>
          <p>
            fileDataFields.fileUrl:<br>
            <code>{{ fileDataFields.fileUrl }}</code>
          </p>
        </div>
        <div
          v-if="true && fileEdited"
          class="column is-6">
          <p>
            fileEdited.uuid:<br>
            <code>{{ fileEdited.uuid }}</code>
          </p>
          <p>
            fileEdited.fileUrl:<br>
            <code>{{ fileEdited.fileUrl }}</code>
          </p>
          <p>
            fileEditedFields.fileUrl:<br>
            <code>{{ fileEditedFields.fileUrl }}</code>
          </p>
        </div>
      </div> -->

      <!-- PREVIEWS -->
      <div
        v-if="data && fileOptions"
        class="datami-table-previews">
        <!-- ORIGINAL DATA -->
        <DatamiTable
          ref="datamitable"
          :file-id="fileId"
          :data="data"
          :columns="dataColumns"
          :data-edited="edited"
          :columns-edited="editedColumns"
          :items-total="itemsTotal || edited.length"
          :locale="locale"
          :debug="debug"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import {
  mixinGlobal,
  mixinForeignKeys,
  mixinData,
  mixinCommit,
  mixinDiff,
  mixinCsv,
  mixinDownload
} from '@/utils/mixins.js'

import { defaultTagsSeparator } from '@/utils/globalUtils'

export default {
  name: 'PreviewCsv',
  components: {
    LoaderSortFilters: () => import(/* webpackChunkName: "LoaderSortFilters" */ '@/components/loaders/LoaderSortFilters.vue'),
    LoaderCSV: () => import(/* webpackChunkName: "LoaderCSV" */ '@/components/loaders/LoaderCSV.vue'),
    LoaderCards: () => import(/* webpackChunkName: "LoaderCards" */ '@/components/loaders/LoaderCards.vue'),
    PreviewHelpers: () => import(/* webpackChunkName: "PreviewHelpers" */ '@/components/previews/PreviewHelpers.vue'),
    DatamiTable: () => import(/* webpackChunkName: "DatamiTable" */ '@/components/previews/DatamiTable.vue')

  },
  mixins: [
    mixinGlobal,
    mixinForeignKeys,
    mixinData,
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
      editedColumns: undefined
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
    },
    dataEditedSorted () {
      const editedSorted = this.edited
      return editedSorted
    }
  },
  watch: {
    fileRaw (next) {
      if (next && next !== '' && this.fileOptions) {
        // console.log('C > PreviewCsv > watch > fileRaw > next : \n', next)
        // console.log('C > PreviewCsv > watch > fileRaw > this.fileOptions : ', this.fileOptions)
        const dataObj = this.csvToObject(next, this.fileOptions)
        // console.log('C > PreviewCsv > watch > fileRaw > dataObj : ', dataObj)
        this.dataRaw = dataObj
        if (!this.dataIsSet) { this.dataIsSet = true }
      }
    },
    wikiRaw (next) {
      if (next && next !== '') {
        // console.log('\nC > PreviewCsv > watch > wikiRaw > next : ', next)
        // console.log('C > PreviewCsv > watch > wikiRaw > this.fileOptions : ', this.fileOptions)
        this.dataRaw = next
        const data = this.dataRaw.data
        const dataColumns = this.buildColumns(this.dataRaw)
        this.data = data
        this.dataColumns = dataColumns
        this.edited = data
        this.editedColumns = dataColumns
      }
    },
    dataIsSet (next) {
      if (next) {
        // console.log('C > PreviewCsv > watch > dataIsSet > next : \n', next)
        const currentFile = this.gitObj.id
        // console.log('\nC > PreviewCsv > watch > dataIsSet > currentFile : ', currentFile)

        // console.log('\nC > PreviewCsv > watch > dataIsSet > this.dataRaw : ', this.dataRaw)
        const data = this.dataRaw.data
        // console.log('C > PreviewCsv > watch > dataIsSet > data : ', data)
        const dataColumns = this.buildColumns(this.dataRaw)
        // console.log('C > PreviewCsv > watch > dataIsSet > dataColumns : ', dataColumns)
        this.data = data
        this.dataColumns = dataColumns
        // console.log('C > PreviewCsv > watch > dataIsSet > this.dataColumns : \n', this.dataColumns)
        this.edited = data
        this.editedColumns = dataColumns

        // console.log('C > PreviewCsv > watch > dataIsSet > this.shareableFiles : ', this.shareableFiles)
        // console.log('C > PreviewCsv > watch > dataIsSet > this.sharedData : ', this.sharedData)

        // Data is set
        this.updateShareableFiles({ gitfile: currentFile, fileId: this.fileId, isSet: true })

        // Check if currentFile if from shareableFiles and update store
        // console.log('C > PreviewCsv > watch > dataIsSet > this.shareableFiles.map(i => i.isSet) :', this.shareableFiles.map(i => i.isSet))
        const fileIsShareable = this.isInShareableAndSet(currentFile)
        // console.log('C > PreviewCsv > watch > dataIsSet > fileIsShareable : ', fileIsShareable)
        if (fileIsShareable) {
          const sharedDatasetUpdated = this.getSharedDatasetByRessource(currentFile)
          sharedDatasetUpdated.forEach(d => {
            const shareDataUpdated = {
              ...d,
              ressourceId: this.fileId
            }
            this.updateSharedData(shareDataUpdated)
          })
        }
      }
    },
    fileOptions (next) {
      // console.log('C > PreviewCsv > watch > fileOptions > next : \n', next)
      // if (next && this.dataIsSet) {
      // if (next && this.dataIsSet) {
      //   console.log('C > PreviewCsv > watch > fileOptions > next & this.dataIsSet : \n', next)
      //   const dataColumns = this.buildColumns(this.dataRaw)
      //   this.dataColumns = dataColumns
      //   this.editedColumns = dataColumns
      // }
      if (next && this.fileRaw && this.fileRaw !== '') {
        // console.log('C > PreviewCsv > watch > fileOptions > next : \n', next)
        // console.log('C > PreviewCsv > watch > fileOptions > this.fileRaw : ', this.fileRaw)
        if (!this.dataIsSet) {
          const dataObj = this.csvToObject(this.fileRaw, next)
          this.dataRaw = dataObj
          this.dataIsSet = true
        }
      }
    },
    async fileClientRaw (next) {
      if (next) {
        // console.log('C > PreviewCsv > watch > fileClientRaw > next : \n', next)
        const dataObj = this.csvToObject(next, this.fileOptions)
        const edited = dataObj.data
        const editedColumns = this.buildColumns(dataObj)
        this.edited = edited
        this.editedColumns = editedColumns
      }
    },
    edited (next, prev) {
      // console.log('C > PreviewCsv > watch > edited > next : ', next)
      // console.log('C > PreviewCsv > watch > edited > prev : ', prev)
      // if (next && !prev) {
      if (next) {
        this.bufferizeEdited()
      }
    },
    fileIsDownloading (next) {
      // console.log('\nC > PreviewCsv > watch > fileIsDownloading > next : ', next)
      if (next && this.gitObj.filetype === 'wiki') {
        // console.log('C > PreviewCsv > watch > fileIsDownloading > this.gitObj : ', this.gitObj)
        const editedCsv = this.ObjectToCsv(this.dataColumns, this.data, this.fileOptions)
        // console.log('C > PreviewCsv > watch > fileIsDownloading > editedCsv : ', editedCsv)
        const dl = this.buildFileLink(editedCsv, window)
        // console.log('C > PreviewCsv > watch > fileIsDownloading > dl : ', dl)
        this.removeLink(dl)
        this.updateDownloading({ fileId: this.fileId, isDownloading: false })
      }
    },
    fileIsSaving (next) {
      if (next) {
        // console.log('C > PreviewCsv > watch > fileIsSaving > next : ', next)
        this.bufferizeEdited()
      }
    },
    loadingShared (next) {
      if (next.loadState === 'loading') {
        // console.log('\nC >>> PreviewCsv > watch > loadingShared > next : ', next)
        const shareableFile = this.shareableFiles.find(r => r.fileId === this.fileId)
        if (shareableFile) {
          // console.log('\nC >>> PreviewCsv > watch > loadingShared > shareableFile : ', shareableFile)
          const currentFile = this.gitObj.id
          // console.log('C >>> PreviewCsv > watch > loadingShared > currentFile : ', currentFile)
          const sharedDatasets = this.getSharedDatasetByRessource(currentFile)
          // console.log('\nC >>> PreviewCsv > watch > loadingShared > sharedDatasets : ', sharedDatasets)
          for (const resrc of sharedDatasets) {
            // console.log('C >>> PreviewCsv > watch > loadingShared >  resrc : ', resrc)

            // // save data in loadedSharedData
            const payloadData = {
              ressource: resrc.ressource,
              ressourceId: resrc.ressourceId,
              data: {
                headers: this.editedColumns,
                data: this.edited
              }
            }
            // console.log('C >>> DatamiFile > loadingShared > payloadData : ', payloadData)
            this.updateLoadedSharedData(payloadData)

            // update sharedData
            const payload = {
              ...resrc,
              isLoaded: true
            }
            this.updateSharedData(payload)
          }

          // update shareableFiles
          const updatedShareableFile = {
            ...shareableFile,
            isLoaded: true
          }
          // console.log('C >>> DatamiFile > loadingShared > updatedShareableFile : ', updatedShareableFile)
          this.updateShareableFiles(updatedShareableFile)
        }
      }
    },
    fileSignals (next) {
      // console.log('\nC > PreviewCsv > watch > fileSignals > next : ', next)
      if (next && next.length) {
        next.forEach(signal => {
          // console.log('\nC > PreviewCsv > watch > fileSignals > signal : ', signal)
          switch (signal.action) {
            case 'updateCellValue':
              // console.log('\nC > PreviewCsv > watch > fileSignals > updateCellValue > signal : ', signal)
              this.updateEdited(signal.event)
              this.removeFileSignal(signal.signalId)
              break
            case 'addTagToEnum':
              // console.log('\nC > PreviewCsv > watch > fileSignals > addTagToEnum > signal : ', signal)
              this.addTagToEnum(signal.event)
              this.removeFileSignal(signal.signalId)
              break
            case 'deleteRows':
              this.deleteRowsEvent(signal.event)
              this.removeFileSignal(signal.signalId)
              break
            case 'addNewRow':
              // console.log('\nC > PreviewCsv > watch > fileSignals > signal : ', signal)
              this.addRowEvent(signal.event)
              this.removeFileSignal(signal.signalId)
              break
            case 'sortRows':
              this.sortEdited(signal.event)
              this.removeFileSignal(signal.signalId)
              break
          }
        })
      }
    }
  },
  methods: {
    ...mapActions({
      updateBuffer: 'git-data/updateBuffer'
    }),
    buildEnumArr (data, separator, fieldSubtype) {
      const dataCopy = data.filter(d => !!d)
      // console.log('C > PreviewCsv > buildEnumArr > dataCopy : ', dataCopy)
      // console.log('C > PreviewCsv > buildEnumArr > separator : ', separator)
      // console.log('C > PreviewCsv > buildEnumArr > fieldSubtype : ', fieldSubtype)
      // make a set from dataParsed instead of simple array
      const dataParsedSet = new Set()
      dataCopy && dataCopy.forEach(tag => {
        // console.log('...C > PreviewCsv > buildEnumArr > tag : ', tag)
        const tagStr = tag && tag.toString()
        // console.log('...C > PreviewCsv > buildEnumArr > tagStr : ', tagStr)
        if (tagStr && fieldSubtype === 'tags' && tagStr.includes(separator)) {
          const subArr = tag.split(separator).map(t => t.trim())
          subArr.forEach(item => dataParsedSet.add(item))
        } else if (tagStr) {
          dataParsedSet.add(tagStr)
        }
      })
      const enumArr = [...dataParsedSet].sort((a, b) => {
        return a.localeCompare(b, this.locale, { numeric: true })
      })
      // console.log('C > PreviewCsv > buildEnumArr > enumArr : ', enumArr)
      return enumArr
    },
    buildColumns (dataRaw) {
      const headers = dataRaw && dataRaw.headers
      // console.log('\nC > PreviewCsv > buildColumns > headers : ', headers)
      // console.log('C > PreviewCsv > buildColumns > dataRaw : ', dataRaw)
      // console.log('C > PreviewCsv > buildColumns > dataRaw.data[0] : ', dataRaw.data[0])
      // console.log('C > PreviewCsv > buildColumns > this.fileOptions : ', this.fileOptions)

      // Parse Schema
      const schema = this.fileSchema
      // console.log('C > PreviewCsv > buildColumns > schema : ', schema)
      let primaryKeys = (this.fileSchema && this.fileSchema.primaryKey) || []
      if (primaryKeys && typeof primaryKeys === 'string') {
        primaryKeys = [primaryKeys]
      }

      // Parse custom props
      const fieldsCustomProperties = this.fileOptions && this.fileOptions.customProps && this.fileOptions.customProps.fields
      // console.log('C > PreviewCsv > buildColumns > fieldsCustomProperties : ', fieldsCustomProperties)
      // console.log('C > PreviewCsv > buildColumns > fileConsolidation : ', fileConsolidation)
      if (!headers) return null
      const fields = Object.entries(headers)
        .map((entry, idx) => {
          const fieldId = entry[0]
          const fieldLabel = entry[1].trim()
          const fieldSchema = schema && schema.fields && schema.fields.find(schema => schema.name === fieldLabel)
          const fieldConstraints = fieldSchema && fieldSchema.constraints
          // console.log('C > PreviewCsv > buildColumns > fieldConstraints : ', fieldConstraints)
          const fieldCustomProps = fieldsCustomProperties && fieldsCustomProperties.find(schema => schema.name === fieldLabel)
          let fieldData = {
            field: fieldId,
            label: fieldLabel.trim(),
            type: (fieldSchema && fieldSchema.type) || 'string',
            name: (fieldSchema && fieldSchema.name) || fieldLabel
          }
          // parse data for unique values on tag columns
          const isPrimaryKey = primaryKeys.includes(fieldData.name)
          const fieldSubtype = fieldCustomProps && fieldCustomProps.subtype
          const needEnumArr = fieldSubtype === 'tag' || fieldSubtype === 'tags'
          const defaultEnumArr = fieldConstraints && fieldConstraints.enum
          fieldData = {
            ...fieldData,
            // ...(!idx) && { sticky: true },
            ...fieldSchema && fieldSchema.title && { title: fieldSchema.title },
            ...fieldSchema && fieldSchema.description && { description: fieldSchema.description },
            ...isPrimaryKey && { primaryKey: isPrimaryKey },
            ...fieldSubtype && { subtype: fieldSubtype },
            ...fieldCustomProps && fieldCustomProps.title && { title: fieldCustomProps.title },
            ...fieldCustomProps && fieldCustomProps.description && { description: fieldCustomProps.description },
            ...fieldCustomProps && fieldCustomProps.locked && { locked: fieldCustomProps.locked },
            ...fieldCustomProps && fieldCustomProps.maxLength && { maxLength: fieldCustomProps.maxLength },
            ...fieldCustomProps && (fieldCustomProps.tagSeparator || fieldSubtype === 'tags') && { tagSeparator: fieldCustomProps.tagSeparator || defaultTagsSeparator },
            ...fieldCustomProps && fieldCustomProps.hide && { hide: fieldCustomProps.hide },
            ...fieldCustomProps && fieldCustomProps.bgColor && { bgColor: fieldCustomProps.bgColor },
            ...fieldCustomProps && fieldCustomProps.primaryKey && { primaryKey: fieldCustomProps.primaryKey },
            ...fieldCustomProps && fieldCustomProps.allowNew && { allowNew: fieldCustomProps.allowNew },
            ...fieldCustomProps && fieldCustomProps.foreignKey && { foreignKey: fieldCustomProps.foreignKey },
            ...fieldCustomProps && fieldCustomProps.definitions && { definitions: fieldCustomProps.definitions },
            ...fieldCustomProps && fieldCustomProps.unit && { unit: fieldCustomProps.unit },
            ...fieldCustomProps && fieldCustomProps.round && { round: fieldCustomProps.round },
            ...fieldCustomProps && fieldCustomProps.transform && { transform: fieldCustomProps.transform },
            ...fieldCustomProps && fieldCustomProps.longtextOptions && { longtextOptions: fieldCustomProps.longtextOptions },
            ...fieldCustomProps && fieldCustomProps.booleanOptions && { booleanOptions: fieldCustomProps.booleanOptions },
            ...fieldCustomProps && fieldCustomProps.stepSeparator && { stepSeparator: fieldCustomProps.stepSeparator },
            ...fieldCustomProps && fieldCustomProps.stepOptions && { stepOptions: fieldCustomProps.stepOptions },
            ...defaultEnumArr && { enumArr: defaultEnumArr }
          }
          // console.log('C > PreviewCsv > buildColumns > fieldData : ', fieldData)
          // console.log('C > PreviewCsv > buildColumns > fieldCustomProps : ', fieldCustomProps)
          if (!defaultEnumArr && needEnumArr) {
            const enumArr = this.buildEnumArr(
              dataRaw.data.map(item => item[fieldId]),
              fieldCustomProps.tagSeparator || defaultTagsSeparator,
              fieldSubtype
            )
            // console.log('C > PreviewCsv > buildColumns > enumArr : ', enumArr)
            fieldData.enumArr = enumArr
          }

          // console.log('C > PreviewCsv > buildColumns > fieldData : ', fieldData.fieldCustomProps.bgColor)
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
        const edited = [...toEdit]
        this.edited = edited
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
    addTagToEnum (event) {
      // console.log('\nC > PreviewCsv > addTagToEnum > event : ', event)
      const editedColumns = this.editedColumns.map(col => {
        // console.log('\nC > PreviewCsv > addTagToEnum > col : ', col)
        return col.field === event.value.field.field ? event.value.field : col
      })
      // console.log('C > PreviewCsv > addTagToEnum > editedColumns : ', editedColumns)
      this.editedColumns = editedColumns
    },

    setChanges (changeObj, isHeader) {
      let copyChanges
      let changeId //, isDeleted
      const action = changeObj.action
      const isDiff = changeObj.oldVal !== changeObj.val
      // console.log('\nC > PreviewCsv > setChanges > action : ', action)
      // console.log('C > PreviewCsv > setChanges > changeObj : ', changeObj)
      // console.log('C > PreviewCsv > setChanges > isDiff : ', isDiff)
      if (isHeader) {
        changeId = changeObj.field
        // create a filtered copy of changesColumns
        copyChanges = [...this.fieldsChanges]
        copyChanges = copyChanges.filter(ch => ch.field !== changeId)
      } else {
        changeId = changeObj.id
        // create a filtered copy of changesData
        copyChanges = [...this.dataChanges]
        // console.log('C > PreviewCsv > setChanges > copyChanges : ', copyChanges)
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
      // console.log('C > PreviewCsv > setChanges > copyChanges : ', copyChanges)

      // set in local store
      // if (isHeader) {
      //   this.changesColumns = copyChanges
      // } else {
      //   this.changesData = copyChanges
      // }
      // set in global store
      const changesPayload = {
        fileId: this.fileId,
        isFields: isHeader,
        changes: copyChanges
      }
      // console.log('C > PreviewCsv > setChanges > changesPayload : ', changesPayload)
      this.updateFileChanges(changesPayload)
    },
    addRowEvent (event) {
      // console.log('\nC > PreviewCsv > addRowEvent > event : ', event)
      // update edited
      const newRowId = this.uuidv4()
      const newRowPosition = `${this.itemsTotal || this.edited.length}`
      const newRow = {
        ...event.row,
        id: newRowId,
        position: newRowPosition,
        added: true
      }
      // console.log('C > PreviewCsv > addRowEvent > newRow : ', newRow)
      // console.log('C > PreviewCsv > addRowEvent > this.edited (A): ', this.edited)
      this.edited.push(newRow)
      // console.log('C > PreviewCsv > addRowEvent > this.edited (B): ', this.edited)
      // this.bufferizeEdited()

      // Send signal to switch to last page
      this.addFileSignal('goToLastPage', {})

      // update changesData
      const changeObj = {
        action: 'added',
        row: { ...event.row },
        id: newRow.id
      }
      this.setChanges(changeObj)
    },
    deleteRowsEvent (event) {
      // console.log('\nC > PreviewCsv > deleteRowEvent > event : ', event)
      const toDeleteIndices = event.rows.map(rowToDelete => rowToDelete.id)
      let editedTemp = [...this.edited]
      editedTemp = editedTemp.filter(r => !toDeleteIndices.includes(r.id))
      this.edited = editedTemp
      // console.log('C > PreviewCsv > deleteRowEvent > this.edited : ', this.edited)

      // update changesData
      toDeleteIndices.forEach(rowId => {
        const changeObj = {
          action: 'deleted',
          id: rowId
        }
        this.setChanges(changeObj)
      })
      // this.bufferizeEdited()
    },
    sortEdited (event) {
      // console.log('\nC > PreviewCsv > sortEdited > event : ', event)
      const sorting = event.value

      // update sorting store
      const payloadSorting = {
        fileId: this.fileId,
        field: sorting.header.field,
        fieldName: sorting.header.name,
        ascending: sorting.ascending,
        resetSort: sorting.reset
      }
      this.setSorting(payloadSorting)
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
