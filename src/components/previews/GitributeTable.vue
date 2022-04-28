<template>
  <div class="GitributeTable content">
    <div class="columns is-multiline is-mobile is-centered">
      <!-- EDIT CSV NAVABAR -->
      <div class="column is-12 pt-0">
        <EditCsvSkeleton
          v-show="!isAnyDialogOpen"
          :file-id="fileId"
          :columns="columnsEdited"
          :checked-rows="checkedRows"
          :is-active-tags="!!filterTags.length"
          :locale="locale"
          @action="processAction"/>
      </div>

      <!-- FILTER TAGS -->
      <div
        v-if="filterTags && filterTags.length"
        class="column is-12">
        <FilterTags
          v-show="!isAnyDialogOpen"
          :headers="columnsEdited"
          :tags="filterTags"
          :locale="locale"
          @removeTag="removeTag"/>
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

      <!-- DEBUGGING -->
      <div v-if="debug">
        lockHeaders : <code>{{ lockHeaders }}</code>
      </div>
      <!-- TABLE -->
      <div
        v-show="!isAnyDialogOpen && currentViewMode === 'table'"
        class="column is-12">
        <b-table
          :data="dataEditedPaginated"
          :checkable="currentEditViewMode === 'edit'"
          :sticky-checkbox="currentEditViewMode === 'edit'"
          :checked-rows.sync="checkedRows"
          :height="fileOptions.height || '400px'"
          narrowed
          hoverable
          sticky-header
          striped>
          <!-- LOOP COLUMNS -->
          <!-- numeric -->
          <b-table-column
            v-for="col in columnsForView"
            :key="col.field"
            width="75px"
            :field="col.field"
            :label="col.label">
            <!-- HEADERS -->
            <template #header="{ column }">
              <!-- EDITION HEADERS-->
              <div v-if="currentEditViewMode === 'edit'">
                <b-field
                  v-if="!lockHeaders">
                  <EditCell
                    :is-header="true"
                    :col-field="column.field"
                    :input-data="column.label"
                    @updateCellValue="emitUpdate"/>
                </b-field>
                <span v-if="lockHeaders">
                  {{ column.label }}
                  <b-tooltip
                    :label="t('edit.headerLocked', locale)"
                    position="is-bottom"
                    multilined
                    type="is-dark">
                    <b-icon
                      class="mr-1 ml-0"
                      size="is-small"
                      type="is-light"
                      icon="lock"/>
                  </b-tooltip>
                </span>
              </div>
              <!-- DIFF HEADERS -->
              <div v-if="currentEditViewMode === 'diff'">
                <div
                  v-if="isInChanges (true, col.added, col.field)">
                  <span v-html="getDiffHtmlChars (true, col.added, col.field, col.label)"/>
                </div>
                <span v-else>
                  {{ column.label }}
                </span>
              </div>
              <!-- PREVIEW HEADERS -->
              <div v-if="currentEditViewMode === 'preview'">
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
              <div v-if="currentEditViewMode === 'edit'">
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
              <div v-if="currentEditViewMode === 'diff'">
                <div v-if="isInChanges(false, props.row.added, col.field, props.row.id)">
                  <span v-html="getDiffHtmlChars(false, props.row.added, col.field, props.row[col.field], props.row.id)"/>
                </div>
                <span v-else>
                  {{ props.row[col.field] }}
                </span>
              </div>

              <!-- PREVIEW -->
              <div v-if="currentEditViewMode === 'preview'">
                {{ props.row[col.field] }}
              </div>
            </template>
          </b-table-column>
        </b-table>
      </div>

      <!-- CARDS -->
      <div
        v-if="hasCardsView"
        v-show="!isAnyDialogOpen && currentViewMode === 'cards'"
        class="column is-10">
        <GitributeCardsGrid
          v-model="showCardDetails"
          :file-id="fileId"
          :cards-settings="cardsSettingsFromFileOptions"
          :items-per-row="itemsPerRow"
          :items="dataEditedPaginated"
          :locale="locale"
          @updateCellValue="emitUpdate"/>
      </div>

      <!-- PAGINATION -->
      <div
        v-show="!isAnyDialogOpen && !isCardDetailsOpen"
        class="column is-12">
        <PagesNavigation
          :total-items="totalItemsDataEdited"
          :items-per-page="itemsPerPage"
          :items-per-page-choices="itemsPerPageChoices"
          :default-current="currentPage"
          :debug="false"
          :locale="locale"
          @action="processAction"
          @updateCellValue="emitUpdate"/>
      </div>

      <!-- DEBUG -->
      <div
        v-if="debug"
        class="column is-12">
        <div class="columns is-multiline">
          <!-- LOCAL OPTIONS -->
          <div
            v-if="true"
            class="column is-4">
            <p>
              fileOptions:
              <br>
              <pre><code>{{ fileOptions }}</code></pre>
            </p>
          </div>
          <!-- PAGINATION -->
          <div
            v-if="true"
            class="column is-2">
            <p>
              currentPage:
              <br>
              <pre><code>{{ currentPage }}</code></pre>
            </p>
            <p>
              itemsPerPage:
              <br>
              <pre><code>{{ itemsPerPage }}</code></pre>
            </p>
          </div>
          <!-- DATA EDITED PAGINATED -->
          <div
            v-if="true"
            class="column is-6">
            <p>
              dataEditedPaginated:
              <br>
              <pre><code>{{ dataEditedPaginated }}</code></pre>
            </p>
          </div>
          <!-- CHECKED ROWS -->
          <div
            v-if="true"
            class="column is-4">
            <p>
              checkedRows:
              <br>
              <pre><code>{{ checkedRows }}</code></pre>
            </p>
          </div>
          <div
            v-if="true"
            class="column is-4">
            <p>
              filterTags:
              <br>
              <pre><code>{{ filterTags }}</code></pre>
            </p>
          </div>
          <!-- EDITED -->
          <div
            v-if="true"
            class="column is-3">
            <p>
              columnsEdited :
              <br>
              <pre><code>{{ columnsEdited }}</code></pre>
            </p>
          </div>
          <div
            v-if="true"
            class="column is-3">
            <p>
              dataEdited:
              <br>
              <pre><code>{{ dataEdited }}</code></pre>
            </p>
          </div>
          <div
            v-if="true"
            class="column is-3">
            <p>
              changesData:
              <br>
              <pre><code>{{ changesData }}</code></pre>
            </p>
          </div>
          <div
            v-if="true"
            class="column is-3">
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
import { mixinGlobal, mixinDiff, mixinCsv, mixinPagination } from '@/utils/mixins.js'

import EditCsvSkeleton from '@/components/edition/csv/EditCsvSkeleton'
import FilterTags from '@/components/filters/FilterTags'
import DialogAddRow from '@/components/edition/csv/DialogAddRow'
import DialogDeleteRows from '@/components/edition/csv/DialogDeleteRows'

import EditCell from '@/components/edition/csv/EditCell'
import GitributeCardsGrid from '@/components/previews/GitributeCardsGrid'

import PagesNavigation from '@/components/pagination/PagesNavigation'

export default {
  name: 'GitributeTable',
  components: {
    EditCsvSkeleton,
    FilterTags,
    DialogAddRow,
    DialogDeleteRows,
    EditCell,
    GitributeCardsGrid,
    PagesNavigation
  },
  mixins: [
    mixinGlobal,
    mixinDiff,
    mixinCsv,
    mixinPagination
  ],
  props: {
    fileId: {
      default: null,
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
      showCardDetails: false,

      // DIALOGS
      showAddRowDialog: false,
      showDeleteRowsDialog: false,
      showUploadFileDialog: false,

      // SORTING
      sortingByField: undefined,
      sortingAscending: true,

      // FILTERS
      filterTags: [],

      // PAGINATION
      currentPage: 1,
      itemsPerPage: undefined,
      // ... FOR TABLE
      itemsPerPageTable: undefined,
      itemsPerPageDefault: 20,
      // ... FOR CARDS
      itemsPerRow: undefined,
      itemsPerRowDefault: 3,
      itemsPerPageCards: undefined,
      itemsPerPageCardsDefault: 6
    }
  },
  computed: {
    hasCardsView () {
      return !!this.fileOptions.cardsview
    },
    cardsSettingsFromFileOptions () {
      let cardsSettings
      if (this.hasCardsView) {
        const settings = this.fileOptions.cardssettings
        const miniSettings = settings.mini
        const detailSettins = settings.detail
        const mapping = this.columns.map(h => {
          const fieldMap = {
            field: h.field,
            // mini: miniSettings,
            mini: miniSettings[h.label],
            detail: detailSettins[h.label]
          }
          return fieldMap
        })
        cardsSettings = {
          originalHeaders: this.columns,
          editedHeaders: this.columnsForView,
          settings: { mini: miniSettings, detail: detailSettins },
          mapping: mapping
        }
      }
      return cardsSettings
    },
    itemsPerPageChoices () {
      let result
      // console.log('\nC > GitributeTable > itemsPerPageChoices > this.currentViewMode : ', this.currentViewMode)
      if (this.currentViewMode === 'table') {
        result = this.itemsPerPageChoicesTable
      }
      if (this.currentViewMode === 'cards') {
        // console.log('C > GitributeTable > itemsPerPageChoices > this.itemsPerRow : ', this.itemsPerRow)
        const itemsPerRow = this.itemsPerRow
        switch (itemsPerRow) {
          case 2:
            // console.log('C > GitributeTable > itemsPerPageChoices > case 2 > this.itemsPerRow : ', this.itemsPerRow)
            result = this.itemsPerPageChoicesCards2perRow
            break
          case 3:
            // console.log('C > GitributeTable > itemsPerPageChoices > case 3 > this.itemsPerRow : ', this.itemsPerRow)
            // console.log('C > GitributeTable > itemsPerPageChoices > case 3 > this.itemsPerPageChoicesCards3PerRow : ', this.itemsPerPageChoicesCards3PerRow)
            result = this.itemsPerPageChoicesCards3perRow
            break
          case 4:
            // console.log('C > GitributeTable > itemsPerPageChoices > case 4 > this.itemsPerRow : ', this.itemsPerRow)
            result = this.itemsPerPageChoicesCards4perRow
            break
          default:
            // console.log('C > GitributeTable > itemsPerPageChoices > default: > this.itemsPerRow : ', this.itemsPerRow)
            result = this.itemsPerPageChoicesCards3perRow
        }
      }
      // console.log('C > GitributeTable > itemsPerPageChoices > result : ', result)
      return result
    },
    paginationFromFileOptions () {
      // console.log('C > GitributeTable > paginationFromFileOptions > this.fileOptions : ', this.fileOptions)
      const pagination = {
        itemsPerPage: this.itemsPerPageDefault,
        itemsPerPageTable: this.itemsPerPageDefault,
        itemsPerRow: this.itemsPerRowDefault,
        itemsPerPageCards: this.itemsPerPageCards
      }

      // retrieve options from file options
      const hasPaginationOptions = this.fileOptions && this.fileOptions.pagination
      if (hasPaginationOptions) {
        // console.log('C > GitributeTable > paginationFromFileOptions > this.fileOptions : ', this.fileOptions)
        Object.keys(hasPaginationOptions).forEach(key => {
          pagination[key] = hasPaginationOptions[key]
        })
      }
      // set raw values
      if (pagination.itemsPerPageTable < 1) pagination.itemsPerPageTable = 20
      if (pagination.itemsPerRow < 1) pagination.itemsPerRow = 3
      if (pagination.itemsPerPageCards < 1) pagination.itemsPerPageCards = 6

      // refine values
      const goal = pagination.itemsPerPage
      // for table view
      if (!this.itemsPerPageChoicesTable.includes(pagination.itemsPerPage)) {
        pagination.itemsPerPage = this.getClosest(this.itemsPerPageChoicesTable, goal)
      }
      // for cards view
      if (pagination.itemsPerRow) {
        const itemsPerRow = this.getClosest([2, 3, 4], pagination.itemsPerRow)
        if (itemsPerRow === 2) {
          pagination.itemsPerPageCards = this.getClosest(this.itemsPerPageChoicesCards2perRow, goal)
        }
        if (itemsPerRow === 3) {
          pagination.itemsPerPageCards = this.getClosest(this.itemsPerPageChoicesCards3perRow, goal)
        }
        if (itemsPerRow === 4) {
          pagination.itemsPerPageCards = this.getClosest(this.itemsPerPageChoicesCards4perRow, goal)
        }
        pagination.itemsPerRow = itemsPerRow
      }
      return pagination
    },
    dataEditedFiltered () {
      let data = [...this.dataEdited]
      const filters = this.filterTags
      // console.log('\nC > GitributeTable > dataEditedFiltered > filters : ', filters)
      filters.forEach(filter => {
        data = data.filter(row => {
          const rowVal = row[filter.field].toLowerCase()
          const filterVal = filter.value.toLowerCase()
          return rowVal.includes(filterVal)
        })
      })
      return data
    },
    totalItemsDataEdited () {
      return this.dataEditedFiltered.length
    },
    dataEditedPaginated () {
      const data = [...this.dataForView]
      const page = this.currentPage
      const perPage = this.itemsPerPage
      // console.log('\nC > GitributeTable > dataEditedPaginated > page : ', page)
      // console.log('C > GitributeTable > dataEditedPaginated > perPage : ', perPage)
      return this.paginate(data, perPage, page)
    },
    dataForView () {
      let data
      const dataFiltered = this.dataEditedFiltered
      let originalIndices, editedIndices, concat, uniquesIndices
      switch (this.currentEditViewMode) {
        case 'edit':
          data = dataFiltered
          break
        case 'diff':
          originalIndices = this.data.map(r => r.id)
          editedIndices = dataFiltered.map(r => r.id)
          concat = [...originalIndices, ...editedIndices]
          uniquesIndices = [...new Set(concat)]
          // console.log('\nC > GitributeTable > dataForView > diff > uniquesIndices : ', uniquesIndices)
          data = uniquesIndices.map(i => {
            let row = dataFiltered.find(r => r.id === i)
            if (!row) {
              row = this.data.find(r => r.id === i)
            }
            return row
          })
          break
        case 'preview':
          data = dataFiltered
          break
      }
      return data
    },
    columnsForView () {
      let columns
      let originalFields, editedFields, concat, uniquesFields
      switch (this.currentEditViewMode) {
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
      return this.showAddRowDialog || this.showUploadFileDialog || this.showDeleteRowsDialog
    },
    isCardDetailsOpen () {
      return this.showCardDetails && this.currentViewMode === 'cards'
    }
  },
  watch: {
    edited (next) {
      console.log('\nC > GitributeTable > watch > edited > next : ', next)
    },
    currentViewMode (next) {
      // console.log('\nC > GitributeTable > watch > currentViewMode > next : ', next)
      this.itemsPerPage = next === 'cards' ? this.itemsPerPageCards : this.itemsPerPageTable
    }
  },
  beforeMount () {
    // build pagination options
    const pagination = this.paginationFromFileOptions
    // console.log('\nC > GitributeTable > beforeMount > pagination : ', pagination)
    this.itemsPerPage = this.cardsViewIsDefault ? pagination.itemsPerPageCards : pagination.itemsPerPageTable
    this.itemsPerPageTable = pagination.itemsPerPageTable
    this.itemsPerRow = pagination.itemsPerRow
    this.itemsPerPageCards = pagination.itemsPerPageCards
  },
  methods: {
    processAction (event) {
      // console.log('\nC > GitributeTable > processAction > event : ', event)
      switch (event.action) {
        // ADD ROW
        case 'openAddRowDialog':
          this.showAddRowDialog = true
          break
        case 'addNewRow':
          this.$emit('addRow', event)
          break
        // IMPORT DATA
        case 'openUploadFileDialog':
          this.showUploadFileDialog = true
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
        // FILTERING
        case 'filterBy':
          this.processFilter(event.value)
          break
        // PAGINATION
        case 'changePage':
          this.currentPage = event.value.currentPage
          this.itemsPerPage = event.value.itemsPerPage
          switch (this.currentViewMode) {
            case 'table':
              this.itemsPerPageTable = event.value.itemsPerPage
              break
            case 'cards':
              this.itemsPerPageCards = event.value.itemsPerPage
              break
          }
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
    },
    processFilter (filter) {
      console.log('C > GitributeTable > processFilter > filter : ', filter)
      const active = !!filter.field
      const reset = filter.reset
      if (!reset && active) {
        this.processFilterValue(filter)
      }
      if (reset) {
        this.filterTags = []
      }
    },
    processFilterValue (tag, remove = false) {
      console.log('C > GitributeTable > processFilterValue > tag : ', tag)
      console.log('C > GitributeTable > processFilterValue > remove : ', remove)
      if (!remove) {
        this.filterTags.push(tag)
      } else {
        this.filterTags = this.filterTags.filter(t => {
          const sameField = t.field === tag.field
          const sameValue = t.value === tag.value
          return !(sameField && sameValue)
        })
      }
    },
    removeTag (tag) {
      console.log('\nC > GitributeTable > removeTag > tag : ', tag)
      this.processFilterValue(tag, true)
    }
  }
}
</script>
