<template>
  <div class="GitributeTable content">
    <div class="columns is-multiline is-mobile">
      <!-- EDIT CSV NAVABAR -->
      <div class="column is-12">
        <EditCsvSkeleton
          v-show="!isAnyDialogOpen"
          :file-id="fileId"
          :view="view"
          :columns="columnsEdited"
          :checked-rows="checkedRows"
          :locale="locale"
          @action="processAction"/>
      </div>

      <!-- DIALOGS -->
      <DialogAddRow
        v-show="showAddRowDialog"
        v-model="showAddRowDialog"
        :headers="columnsEdited"
        :locale="locale"
        @action="processAction"/>
      <DialogDeleteRows
        v-show="showDeleteRowsDialog"
        v-model="showDeleteRowsDialog"
        :headers="columnsEdited"
        :checked-rows="checkedRows"
        :locale="locale"
        @action="processAction"/>

      <!-- TABLE -->
      <div
        v-show="!isAnyDialogOpen"
        class="column is-12">
        <b-table
          :data="dataForView"
          :checkable="view === 'edit'"
          :sticky-checkbox="view === 'edit'"
          :checked-rows.sync="checkedRows"
          narrowed
          hoverable
          sticky-header
          striped>
          <!-- LOOP COLUMNS -->
          <!-- width="40" -->
          <!-- numeric -->
          <b-table-column
            v-for="col in columnsForView"
            :key="col.field"
            :field="col.field"
            :label="col.label">
            <!-- HEADERS -->
            <template #header="{ column }">
              <!-- EDITION HEADERS-->
              <div v-if="view === 'edit'">
                <b-field>
                  <EditCell
                    :is-header="true"
                    :col-field="column.field"
                    :input-data="column.label"
                    @updateCellValue="emitUpdate"/>
                </b-field>
              </div>
              <!-- DIFF HEADERS -->
              <div v-if="view === 'diff'">
                <div
                  v-if="isInChanges (true, col.added, col.field)">
                  <span v-html="getDiffHtmlChars (true, col.added, col.field, col.label)"/>
                </div>
                <span v-else>
                  {{ column.label }}
                </span>
              </div>
              <!-- PREVIEW HEADERS -->
              <div v-if="view === 'preview'">
                {{ column.label }}
              </div>
            </template>

            <!-- ROWS -->
            <template #default="props">
              <!-- DEBUG -->
              <div
                v-if="false"
                class="mb-3">
                <!-- row: <code>{{ props.row }}</code><br> -->
                <code>row id</code>: <code>{{ props.row.id }}</code><br>
              </div>

              <!-- EDITION -->
              <div v-if="view === 'edit'">
                <b-field>
                  <EditCell
                    :is-header="false"
                    :col-field="col.field"
                    :row-id="props.row.id"
                    :is-added="props.row.added"
                    :input-data="props.row[col.field]"
                    @updateCellValue="emitUpdate"/>
                </b-field>
              </div>

              <!-- DIFF -->
              <div v-if="view === 'diff'">
                <div v-if="isInChanges(false, props.row.added, col.field, props.row.id)">
                  <span v-html="getDiffHtmlChars(false, props.row.added, col.field, props.row[col.field], props.row.id)"/>
                </div>
                <span v-else>
                  {{ props.row[col.field] }}
                </span>
              </div>

              <!-- PREVIEW -->
              <div v-if="view === 'preview'">
                {{ props.row[col.field] }}
              </div>
            </template>
          </b-table-column>
        </b-table>
      </div>

      <!-- DEBUG -->
      <div
        v-if="debug"
        class="column is-12">
        <div class="columns is-multiline">
          <div
            v-if="false"
            class="column is-6">
            <p>
              checkedRows:
              <br>
              <pre><code>{{ checkedRows }}</code></pre>
            </p>
          </div>
          <div
            v-if="false"
            class="column is-6">
            <p>
              fileOptions:
              <br>
              <pre><code>{{ fileOptions }}</code></pre>
            </p>
          </div>
          <!-- EDITED -->
          <div class="column is-3">
            <p>
              columnsEdited :
              <br>
              <pre><code>{{ columnsEdited }}</code></pre>
            </p>
          </div>
          <div class="column is-3">
            <p>
              dataEdited:
              <br>
              <pre><code>{{ dataEdited }}</code></pre>
            </p>
          </div>
          <div class="column is-3">
            <p>
              changesData:
              <br>
              <pre><code>{{ changesData }}</code></pre>
            </p>
          </div>
          <div class="column is-3">
            <p>
              changesColumns:
              <br>
              <pre><code>{{ changesColumns }}</code></pre>
            </p>
          </div>
          <!-- ORIGINAL -->
          <div
            v-if="false"
            class="column is-3">
            <p>
              columns:
              <br>
              <pre><code>{{ columns }}</code></pre>
            </p>
          </div>
          <div
            v-if="false"
            class="column is-3">
            <p>
              data:
              <br>
              <pre><code>{{ data }}</code></pre>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixinDiff } from '@/utils/mixins.js'

import EditCsvSkeleton from '@/components/edition/csv/EditCsvSkeleton'
import DialogAddRow from '@/components/edition/csv/DialogAddRow'
import DialogDeleteRows from '@/components/edition/csv/DialogDeleteRows'
import EditCell from '@/components/edition/csv/EditCell'

export default {
  name: 'GitributeTable',
  components: {
    EditCsvSkeleton,
    DialogAddRow,
    DialogDeleteRows,
    EditCell
  },
  mixins: [mixinDiff],
  props: {
    fileId: {
      default: null,
      type: String
    },
    fileOptions: {
      default: undefined,
      type: Object
    },
    view: {
      default: '',
      type: String
    },
    data: {
      default: undefined,
      type: Array
    },
    columns: {
      default: undefined,
      type: Array
    },
    dataEdited: {
      default: undefined,
      type: Array
    },
    columnsEdited: {
      default: undefined,
      type: Array
    },
    changesData: {
      default: undefined,
      type: Array
    },
    changesColumns: {
      default: undefined,
      type: Array
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
      checkedRows: [],
      showAddRowDialog: false,
      showImportDataDialog: false,
      showDeleteRowsDialog: false,
      sortingByField: undefined,
      sortingAscending: true
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    }),
    dataForView () {
      let data
      let originalIndices, editedIndices, concat, uniquesIndices
      switch (this.view) {
        case 'edit':
          data = this.dataEdited
          break
        case 'diff':
          // TO DO : CHANGE TO CONTATENATE DELETED ROWS
          originalIndices = this.data.map(r => r.id)
          editedIndices = this.dataEdited.map(r => r.id)
          concat = [...originalIndices, ...editedIndices]
          uniquesIndices = [...new Set(concat)]
          // console.log('\nC > GitributeTable > dataForView > diff > uniquesIndices : ', uniquesIndices)
          data = uniquesIndices.map(i => {
            let row = this.dataEdited.find(r => r.id === i)
            if (!row) {
              row = this.data.find(r => r.id === i)
            }
            return row
          })
          // data = this.dataEdited
          break
        case 'preview':
          data = this.dataEdited
          break
      }
      return data
    },
    columnsForView () {
      let columns
      let originalFields, editedFields, concat, uniquesFields
      switch (this.view) {
        case 'edit':
          columns = this.columnsEdited
          break
        case 'diff':
          // TO DO : CHANGE TO CONTATENATE DELETED COLUMNS
          originalFields = this.columns.map(r => r.field)
          editedFields = this.columnsEdited.map(r => r.field)
          concat = [...originalFields, ...editedFields]
          uniquesFields = [...new Set(concat)]
          // console.log('\nC > GitributeTable > dataForView > diff > uniquesFields : ', uniquesFields)
          columns = uniquesFields.map(f => {
            let col = this.columnsEdited.find(c => c.field === f)
            if (!col) {
              col = this.columns.find(c => c.field === f)
            }
            return col
          })
          // columns = this.columnsEdited
          break
        case 'preview':
          columns = this.columnsEdited
          break
      }
      return columns
    },
    isAnyDialogOpen () {
      return this.showAddRowDialog || this.showImportDataDialog || this.showDeleteRowsDialog
    }
  },
  watch: {
    edited (next) {
      console.log('\nC > GitributeTable > watch > edited > next : ', next)
    }
  },
  methods: {
    // TO DO
    processAction (event) {
      console.log('\nC > GitributeTable > processAction > event : ', event)
      switch (event.action) {
        // ADD ROW
        case 'openAddRowDialog':
          this.showAddRowDialog = true
          break
        case 'addNewRow':
          this.$emit('addRow', event)
          break
        // IMPORT DATA
        case 'openImportDataDialog':
          this.showImportDataDialog = true
          break
        // DELETE ROWS
        case 'openDeleteRowsDialog':
          this.showDeleteRowsDialog = true
          break
        case 'deleteRows':
          this.$emit('deleteRows', event)
          this.checkedRows = []
          break
        // SORTING
        case 'sortBy':
          this.sortingByField = event.value.header
          this.sortingAscending = event.value.ascending
          this.$emit('sortRows', event)
          break
      }
    },
    emitUpdate (event) {
      // console.log('C > GitributeTable > emitUpdate > event : ', event)
      this.$emit('updateEdited', event)
    },
    getCharDiff (content, edited) {
      const diffStr = this.diffWords(content, edited)
      return diffStr
    },
    getDiffHtmlChars (isHeader, wasAdded, field, val, rowId) {
      // console.log('\nC > GitributeTable > getDiffHtmlChars > isHeader : ', isHeader)
      // console.log('C > GitributeTable > getDiffHtmlChars > wasAdded : ', wasAdded)
      // console.log('C > GitributeTable > getDiffHtmlChars > field : ', field)
      // console.log('C > GitributeTable > getDiffHtmlChars > rowId : ', rowId)
      // console.log('C > GitributeTable > getDiffHtmlChars > val : ', val)
      let oldVal, newVal
      const changes = this.isInChanges(isHeader, wasAdded, field, rowId)
      // console.log('C > GitributeTable > getDiffHtmlChars > changes : ', changes)
      const wasDeleted = changes.action === 'deleted'
      // console.log('C > GitributeTable > getDiffHtmlChars > wasDeleted : ', wasDeleted)
      if (wasAdded && !wasDeleted) {
        oldVal = ''
        newVal = val || ''
      } else if (!wasAdded && wasDeleted) {
        oldVal = val || ''
        newVal = ''
      } else {
        oldVal = changes.oldVal
        newVal = changes.val
      }
      // console.log('C > GitributeTable > getDiffHtmlChars > valDef : ', valDef)

      const charDiff = this.getCharDiff(oldVal, newVal)
      const diffText = this.diffHtmlChars(charDiff)
      return diffText
    },
    isInChanges (isHeader, wasAdded, field, rowId) {
      // const isFirstRow = rowId === '0'
      // isFirstRow && console.log('\nC > GitributeTable > isInChanges > isHeader : ', isHeader)
      // isFirstRow && console.log('C > GitributeTable > isInChanges > wasAdded : ', wasAdded)
      // isFirstRow && console.log('C > GitributeTable > isInChanges > field : ', field)
      // isFirstRow && console.log('C > GitributeTable > isInChanges > rowId : ', rowId)
      let bool, boolDeleted
      if (isHeader) {
        bool = this.changesColumns.find(h => h.field === field)
      } else {
        // isFirstRow && console.log('C > GitributeTable > isInChanges > this.changesData : ', this.changesData)
        bool = this.changesData.find(r => r.field === field && r.id === rowId)
        boolDeleted = this.changesData.find(r => r.id === rowId && r.action === 'deleted')
        if (boolDeleted) bool = boolDeleted
      }
      if (wasAdded) bool = true
      // isFirstRow && console.log('C > GitributeTable > isInChanges > bool : ', bool)
      return bool
    }
  }
}
</script>
