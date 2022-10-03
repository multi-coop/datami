<template>
  <div class="DatamiTable content">
    <div class="columns is-multiline is-mobile is-centered">
      <!-- SORT & FILTERS CSV NAVABAR -->
      <div
        v-show="!isAnyDialogOpen"
        :id="`sort-and-filters-skeleton-${fileId}`"
        :class="`column is-12 py-0 ${currentViewMode === 'map' ? 'px-5' : '' } mt-2`">
        <SortAndFiltersSkeleton
          :file-id="fileId"
          :columns="columnsEdited"
          :active-tags="filterTags"
          :locale="locale"
          @action="processAction"/>
      </div>

      <!-- DEBUGGING -->
      <div
        v-if="debug"
        class="column is-3">
        <!-- fileFilters: <br><pre><code>{{ fileFilters }}</code></pre> -->
        consolidating: <br><pre><code>{{ consolidating }}</code></pre><br>
      </div>
      <div
        v-if="debug"
        class="column is-9">
        consolidationData: <br><pre><code>{{ consolidationData }}</code></pre><br>
      </div>
      <div
        v-if="debug"
        class="column is-9">
        columnsForView: <br>
        <pre><code>{{ columnsForView }}</code></pre><br>
      </div>
      <div
        v-if="debug"
        class="column is-9">
        filterTags: <br>
        <pre><code>{{ filterTags }}</code></pre><br>
      </div>
      <div
        v-if="debug"
        class="column is-9">
        searchText: <br>
        <pre><code>{{ searchText }}</code></pre><br>
      </div>

      <!-- COUNTS & EDIT CSV NAVABAR -->
      <div
        v-show="!isAnyDialogOpen"
        :id="`edit-csv-skeleton-${fileId}`"
        class="column is-12 pt-0">
        <EditCsvSkeleton
          :file-id="fileId"
          :columns="columnsEdited"
          :data-edited-filtered="dataEditedFiltered"
          :items-total="itemsTotal"
          :checked-rows="checkedRows"
          :headers="columnsEdited"
          :filter-tags="filterTags"
          :locale="locale"
          @action="processAction"/>
      </div>

      <!-- DIALOGS -->
      <DialogAddRow
        v-show="showAddRowDialog"
        v-model="showAddRowDialog"
        :file-id="fileId"
        :headers="columnsEdited"
        :locale="locale"
        @action="processAction"/>
      <DialogAddColumn
        v-show="showAddColumnDialog"
        v-model="showAddColumnDialog"
        :file-id="fileId"
        :headers="columnsEdited"
        :locale="locale"
        @action="processAction"/>
      <DialogDeleteRows
        v-show="showDeleteRowsDialog"
        v-model="showDeleteRowsDialog"
        :file-id="fileId"
        :headers="columnsEdited"
        :checked-rows="checkedRows"
        :locale="locale"
        @action="processAction"/>

      <!-- DEBUGGING -->
      <div v-if="debug">
        lockHeaders : <code>{{ lockHeaders }}</code>
      </div>
      <div v-if="debug">
        filterTags : <code>{{ filterTags }}</code>
      </div>
      <div v-if="debug">
        dataChanges: <code>{{ dataChanges }}</code>
      </div>
      <div v-if="debug">
        lockHeaders: <code>{{ lockHeaders }}</code>
      </div>
      <div v-if="debug">
        dataForView: <code>{{ dataForView }}</code>
      </div>
      <div v-if="debug">
        currentViewMode: <code>{{ currentViewMode }}</code>
      </div>

      <!-- TABLE / CARDS / DATAVIZ / MAP -->
      <div
        v-show="dataForView && dataForView.length"
        :class="`datami-table-container column is-${ currentViewMode === 'cards' ? 10 : 12} ${ currentViewMode === 'map' ? 'pt-0' : ''} `">
        <!-- :sticky-checkbox="currentEditViewMode === 'edit'" -->
        <div
          v-show="!isAnyDialogOpen && currentViewMode === 'table'"
          class="datami-table-view-table">
          <b-table
            :data="dataEditedPaginated"
            :height="(fileOptions && fileOptions.height) || '400px'"
            :checkable="currentEditViewMode === 'edit'"
            :checked-rows.sync="checkedRows"
            :detailed="currentEditViewMode === 'edit'"
            :opened-detailed="openedDetails"
            :detail-transition="transitionName"
            :show-detail-icon="showDetailIcon"
            :striped="currentEditViewMode !== 'edit'"
            detail-key="id"
            narrowed
            hoverable
            sticky-header
            checkbox-type="is-dark">
            <!-- LOOP COLUMNS -->
            <!-- :width="colWidth(col)" -->
            <b-table-column
              v-for="(col, idx) in columnsForView"
              :key="col.field"
              :th-attrs="columnThAttrs"
              :td-attrs="columnTdAttrs"
              :field="col.field"
              :sticky="!idx"
              :visible="!col.hide"
              :label="col.label">
              <!-- HEADERS -->
              <template #header="{ column }">
                <div
                  class="is-flex is-flex-direction-row is-align-items-center datami-nowrap"
                  style="white-space: nowrap;">
                  <!-- EDITION HEADERS-->
                  <div v-if="currentEditViewMode === 'edit'">
                    <b-field
                      v-if="!lockHeaders">
                      <EditCell
                        :file-id="fileId"
                        :is-header="true"
                        :field="col"
                        :input-data="column.label"
                        @updateCellValue="emitUpdate"/>
                    </b-field>
                    <PreviewField
                      v-else
                      :file-id="fileId"
                      :field="col"
                      :lock-headers="lockHeaders"
                      :locale="locale"/>
                  </div>

                  <!-- DIFF HEADERS -->
                  <div v-if="currentEditViewMode === 'diff'">
                    <div
                      v-if="isInChanges(true, col.added, col.field)">
                      <span v-html="getDiffHtmlChars (true, col.added, col.field, col.label)"/>
                    </div>
                    <span v-else>
                      <!-- {{ column.label }} -->
                      <PreviewField
                        :file-id="fileId"
                        :field="col"
                        :lock-headers="lockHeaders"
                        :locale="locale"/>
                    </span>
                  </div>

                  <!-- PREVIEW HEADERS -->
                  <div v-if="currentEditViewMode === 'preview'">
                    <PreviewField
                      :file-id="fileId"
                      :field="col"
                      :lock-headers="lockHeaders"
                      :locale="locale"/>
                  </div>

                  <!-- SORTING -->
                  <ButtonSortByField
                    v-if="col.type !== 'datami' && !noSortingFields.includes(col.subtype)"
                    :file-id="fileId"
                    :field="col"
                    :locale="locale"
                    @action="processAction"/>
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
                <div
                  v-if="currentEditViewMode === 'edit'"
                  class="datami-cell">
                  <PreviewCell
                    v-if="col.locked"
                    :file-id="fileId"
                    :value="props.row[col.field]"
                    :field="col"
                    :is-edit-view="true"
                    :locale="locale"/>
                  <EditCell
                    v-else
                    :file-id="fileId"
                    :is-header="false"
                    :field="col"
                    :row-id="props.row.id"
                    :is-added="props.row.added"
                    :input-data="props.row[col.field]"
                    :is-consolidating="isConsolidating(props.row.id)"
                    :locale="locale"
                    @updateCellValue="emitUpdate"
                    @action="processAction"/>
                </div>

                <!-- DIFF -->
                <div
                  v-if="currentEditViewMode === 'diff'"
                  class="datami-cell">
                  <div v-if="isInChanges(false, props.row.added, col.field, props.row.id)">
                    <span v-html="getDiffHtmlChars(false, props.row.added, col.field, props.row[col.field], props.row.id)"/>
                  </div>
                  <PreviewCell
                    v-else
                    :file-id="fileId"
                    :value="props.row[col.field]"
                    :is-diff-view="true"
                    :field="col"
                    :locale="locale"/>
                </div>

                <!-- PREVIEW -->
                <div
                  v-if="currentEditViewMode === 'preview'"
                  class="datami-cell">
                  <!-- {{ props.row[col.field] }} -->
                  <PreviewCell
                    :file-id="fileId"
                    :value="props.row[col.field]"
                    :field="col"
                    :locale="locale"/>
                </div>
              </template>
            </b-table-column>

            <!-- ROWS DETAIL FOR CONSOLIDATION -->
            <template #detail="props">
              <PreviewConsolidation
                v-if="currentEditViewMode === 'edit' && getRowConsolidation(props.row.id)"
                :row-data="props.row"
                :consolidation-data="getRowConsolidation(props.row.id)"
                :locale="locale"
                @action="processAction"/>
            </template>
          </b-table>
        </div>

        <!-- CARDS -->
        <div
          v-if="hasCardsView && cardsViewIsActive"
          v-show="!isAnyDialogOpen && currentViewMode === 'cards'"
          class="datami-table-view-cards">
          <!-- v-model="showCardDetails" -->
          <DatamiCardsGrid
            :file-id="fileId"
            :cards-settings="cardsSettingsFromFileOptions"
            :items-per-row="itemsPerRow"
            :items="dataEditedPaginated"
            :locale="locale"
            @toggleDetail="toggleDetail"
            @action="processAction"
            @updateCellValue="emitUpdate"/>
        </div>

        <!-- DATAVIZ & MAP DEBUGGING-->
        <p v-if="debug">
          hasDatavizView: <code>{{ hasDatavizView }}</code><br>
          currentViewMode: <code>{{ currentViewMode }}</code>
        </p>

        <!-- DATAVIZ -->
        <div
          v-if="fileOptions && hasDatavizView && datavizViewIsActive"
          v-show="!isAnyDialogOpen && currentViewMode === 'dataviz'"
          class="datami-table-view-dataviz"
          :style="`${ userFullscreen ? 'height: 90%;' : '' }`">
          <DatamiDatavizGrid
            :file-id="fileId"
            :dataviz-settings="datavizViewOptions"
            :items="dataForView"
            :fields="columns"
            :locale="locale"
            @action="processAction"/>
        </div>

        <!-- MAPS -->
        <div
          v-if="fileOptions && hasMapView && mapViewIsActive"
          v-show="!isAnyDialogOpen && currentViewMode === 'map'"
          class="datami-table-view-map">
          <!-- v-model="showCardDetails" -->
          <DatamiMapGrid
            :file-id="fileId"
            :items="dataForView"
            :fields="columns"
            :locale="locale"
            @action="processAction"
            @updateCellValue="emitUpdate"/>
        </div>
      </div>

      <!-- NO RESULTS -->
      <div
        v-show="dataEditedPaginated && !dataEditedPaginated.length"
        class="column is-12">
        <article
          class="notification my-6 is-light is-flex is-align-items-center is-justify-content-center">
          <p class="subtitle py-4 has-text-centered">
            <b-icon
              icon="alert-outline"
              size="is-small"/>
            <br>
            <span class="is-size-7">
              {{ t('editCsv.noResult', locale) }}
            </span>
          </p>
        </article>
      </div>

      <!-- PAGINATION -->
      <div
        v-show="!isAnyDialogOpen && !isCardDetailsOpen && viewsWithPagination.includes(currentViewMode)"
        class="column is-12">
        <PagesNavigation
          :file-id="fileId"
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
import {
  mixinGlobal,
  mixinIcons,
  mixinDiff,
  mixinCsv,
  mixinPagination,
  mixinConsolidation
} from '@/utils/mixins.js'

// import { fieldTypeIcons } from '@/utils/fileTypesUtils'
import { mapActions } from 'vuex'

import SortAndFiltersSkeleton from '@/components/edition/csv/SortAndFiltersSkeleton'
import ButtonSortByField from '@/components/sorting/ButtonSortByField'
import EditCsvSkeleton from '@/components/edition/csv/EditCsvSkeleton'
import DialogAddRow from '@/components/edition/csv/DialogAddRow'
import DialogAddColumn from '@/components/edition/csv/DialogAddColumn'
import DialogDeleteRows from '@/components/edition/csv/DialogDeleteRows'

import PreviewField from '@/components/previews/PreviewField'
import PreviewCell from '@/components/previews/PreviewCell'
import EditCell from '@/components/edition/csv/EditCell'
import PreviewConsolidation from '@/components/edition/PreviewConsolidation'

import DatamiCardsGrid from '@/components/previews/cards/DatamiCardsGrid'
import DatamiDatavizGrid from '@/components/previews/dataviz/DatamiDatavizGrid'
import DatamiMapGrid from '@/components/previews/maps/DatamiMapGrid'

import PagesNavigation from '@/components/pagination/PagesNavigation'

export default {
  name: 'DatamiTable',
  components: {
    SortAndFiltersSkeleton,
    ButtonSortByField,
    EditCsvSkeleton,
    DialogAddRow,
    DialogAddColumn,
    DialogDeleteRows,
    PreviewField,
    PreviewCell,
    EditCell,
    PreviewConsolidation,
    DatamiCardsGrid,
    DatamiDatavizGrid,
    DatamiMapGrid,
    PagesNavigation
  },
  mixins: [
    mixinGlobal,
    mixinIcons,
    mixinDiff,
    mixinCsv,
    mixinPagination,
    mixinConsolidation
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
    itemsTotal: {
      default: 0,
      type: Number
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

      // VIEWS SETTINGS
      viewsWithPagination: ['table', 'cards'],

      // DIALOGS
      showAddRowDialog: false,
      showAddColumnDialog: false,
      showDeleteRowsDialog: false,
      showUploadFileDialog: false,

      // SORTING
      noSortingFields: ['tags'],
      sortingByField: undefined,
      sortingAscending: true,

      // FILTERS
      searchText: undefined,
      filterTagsChoices: [],
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
      itemsPerPageCardsDefault: 6,

      // CONSOLIDATION
      consolidationField: {
        type: 'datami'
      },
      consolidating: [],
      consolidationData: [],
      openedDetails: [],
      showDetailIcon: false,
      transitionName: 'fade'
    }
  },
  computed: {
    filterFields () {
      const settingsFields = this.customFiltersConfig.filterfields.map(filterField => filterField.name || filterField)
      // console.log('\nC > GitributeTable > filterFields > settingsFields : ', settingsFields)
      // console.log('C > GitributeTable > filterFields > this.columns : ', this.columns)
      const filterFields = this.columns
        .filter(col => {
          // Filter out only columns whose name is in settingsFields
          // console.log('C > GitributeTable > filterFields > col : ', col)
          const hasLabel = settingsFields.includes(col.name)
          return hasLabel
        })
        .map(col => {
          // Inject 'filtering' key and value to column data
          const filterSettings = this.customFiltersConfig.filterfields.find(f => (f.name === col.name || f === col.name))
          return { ...col, filtering: filterSettings.filtering || 'AND' }
        })
        .sort((a, b) => {
          // Sort columns in settingsFields order
          return settingsFields.indexOf(a.name) - settingsFields.indexOf(b.name)
        })
      // console.log('C > GitributeTable > filterFields > filterFields : ', filterFields)
      return filterFields
    },
    // hasCardsView () {
    //   return !!this.fileOptions.cardsview
    // },
    cardsSettingsFromFileOptions () {
      let cardsSettings
      // console.log('\nC > GitributeTable > cardsSettingsFromFileOptions > this.hasCardsView : ', this.hasCardsView)
      if (this.hasCardsView && this.cardsViewIsActive) {
        const settings = this.cardsSettingsFromOptions
        const miniSettings = settings.mini
        const detailSettings = settings.detail
        const mapping = this.columns.map(h => {
          const fieldMap = {
            ...h,
            // field: h.field,
            // type: h.type,
            // subtype: h.subtype,
            // mini: miniSettings,
            mini: miniSettings[h.name],
            detail: detailSettings[h.name]
          }
          const hasTemplate = this.cardsSettingsTemplates && this.cardsSettingsTemplates[h.name]
          if (hasTemplate) { fieldMap.templating = hasTemplate }
          return fieldMap
        })
        cardsSettings = {
          originalHeaders: this.columns,
          editedHeaders: this.columnsForView,
          settings: { mini: miniSettings, detail: detailSettings },
          mapping: mapping
        }
      }
      return cardsSettings
    },
    itemsPerPageChoices () {
      let result
      // console.log('\nC > DatamiTable > itemsPerPageChoices > this.currentViewMode : ', this.currentViewMode)
      if (this.currentViewMode === 'table') {
        result = this.itemsPerPageChoicesTable
      }
      if (this.currentViewMode === 'cards') {
        // console.log('C > DatamiTable > itemsPerPageChoices > this.itemsPerRow : ', this.itemsPerRow)
        const itemsPerRow = this.itemsPerRow
        switch (itemsPerRow) {
          case 2:
            // console.log('C > DatamiTable > itemsPerPageChoices > case 2 > this.itemsPerRow : ', this.itemsPerRow)
            result = this.itemsPerPageChoicesCards2perRow
            break
          case 3:
            // console.log('C > DatamiTable > itemsPerPageChoices > case 3 > this.itemsPerRow : ', this.itemsPerRow)
            // console.log('C > DatamiTable > itemsPerPageChoices > case 3 > this.itemsPerPageChoicesCards3PerRow : ', this.itemsPerPageChoicesCards3PerRow)
            result = this.itemsPerPageChoicesCards3perRow
            break
          case 4:
            // console.log('C > DatamiTable > itemsPerPageChoices > case 4 > this.itemsPerRow : ', this.itemsPerRow)
            result = this.itemsPerPageChoicesCards4perRow
            break
          default:
            // console.log('C > DatamiTable > itemsPerPageChoices > default: > this.itemsPerRow : ', this.itemsPerRow)
            result = this.itemsPerPageChoicesCards3perRow
        }
      }
      // console.log('C > DatamiTable > itemsPerPageChoices > result : ', result)
      return result
    },
    paginationFromFileOptions () {
      // console.log('C > DatamiTable > paginationFromFileOptions > this.fileOptions : ', this.fileOptions)
      const pagination = {
        itemsPerPage: this.itemsPerPageDefault,
        itemsPerPageTable: this.itemsPerPageDefault,
        itemsPerRow: this.itemsPerRowDefault,
        itemsPerPageCards: this.itemsPerPageCards
      }

      // retrieve options from file options
      const hasPaginationOptions = this.fileOptions && this.fileOptions.pagination
      if (hasPaginationOptions) {
        // console.log('C > DatamiTable > paginationFromFileOptions > this.fileOptions : ', this.fileOptions)
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
    dataFiltered () {
      const data = this.filterData(this.data)
      return data
    },
    dataEditedFiltered () {
      const data = this.filterData(this.dataEdited)
      return data
    },
    dataEditedSorted () {
      let data = [...this.dataEditedFiltered]
      if (this.fileSorting && this.fileSorting.length) {
        // console.log('\nC > DatamiTable > dataEditedSorted > this.fileSorting : ', this.fileSorting)
        this.fileSorting.forEach(sorting => {
          const sortingField = sorting.field
          const sortIsAscending = sorting.ascending
          if (sortIsAscending) {
            data = data.sort((a, b) => a[sortingField] < b[sortingField] ? 1 : -1)
          } else {
            data = data.sort((a, b) => a[sortingField] > b[sortingField] ? 1 : -1)
          }
        })
      } else {
        data = data.sort((a, b) => a.id > b.id ? 1 : -1)
      }
      return data
    },
    dataForView () {
      let data
      const dataEditedSorted = this.dataEditedSorted
      let originalIndices, editedIndices, concat, uniquesIndices
      switch (this.currentEditViewMode) {
        case 'edit':
          data = dataEditedSorted
          break
        case 'diff':
          editedIndices = dataEditedSorted.map(r => r.id)
          originalIndices = this.dataFiltered.map(r => r.id)

          concat = [...editedIndices, ...originalIndices]
          uniquesIndices = [...new Set(concat)]
          // console.log('\nC > DatamiTable > dataForView > diff > uniquesIndices : ', uniquesIndices)
          data = uniquesIndices.map(i => {
            let row = dataEditedSorted.find(r => r.id === i)
            if (!row) {
              row = this.data.find(r => r.id === i)
            }
            return row
          })
          break
        case 'preview':
          data = dataEditedSorted
          break
      }
      return data
    },
    dataEditedPaginated () {
      const data = [...this.dataForView]
      const page = this.currentPage
      const perPage = this.itemsPerPage
      // console.log('\nC > DatamiTable > dataEditedPaginated > page : ', page)
      // console.log('C > DatamiTable > dataEditedPaginated > perPage : ', perPage)
      return this.paginate(data, perPage, page)
    },
    totalItemsDataEdited () {
      return this.dataEditedFiltered.length
    },
    columnsForView () {
      let columns
      let originalFields, editedFields, concat, uniquesFields
      // console.log('\nC > DatamiTable > dataForView > this.currentEditViewMode : ', this.currentEditViewMode)
      switch (this.currentEditViewMode) {
        case 'edit':
          if (this.hasConsolidation) {
            const consolidationColumn = {
              ...this.consolidationField,
              field: 'consolidation',
              subtype: 'consolidation',
              label: 'field.consolidation',
              apis: this.hasConsolidation
            }
            consolidationColumn.icon = this.getIconFieldType(consolidationColumn)
            columns = [consolidationColumn, ...this.columnsEdited]
          } else {
            columns = this.columnsEdited
          }
          break
        case 'diff':
          // TO DO : CHANGE TO CONTATENATE DELETED COLUMNS
          originalFields = this.columns.map(r => r.field)
          editedFields = this.columnsEdited.map(r => r.field)
          concat = [...originalFields, ...editedFields]
          uniquesFields = [...new Set(concat)]
          // console.log('\nC > DatamiTable > dataForView > diff > uniquesFields : ', uniquesFields)
          columns = uniquesFields.map(f => {
            let col = this.columnsEdited.find(c => c.field === f)
            if (!col) {
              col = this.columns.find(c => c.field === f)
            }
            return col
          })
          break
        case 'preview':
          // console.log('C > DatamiTable > dataForView > preview > this.columnsEdited : ', this.columnsEdited)
          columns = this.columnsEdited.filter(c => c.type !== 'datami')
          break
      }
      // console.log('C > DatamiTable > dataForView > preview > columns : ', columns)
      return columns
    },
    isAnyDialogOpen () {
      return this.showAddRowDialog || this.showUploadFileDialog || this.showDeleteRowsDialog || this.showAddColumnDialog
    },
    isCardDetailsOpen () {
      return this.showCardDetails && this.currentViewMode === 'cards'
    }
  },
  watch: {
    // edited (next) {
    //   console.log('\nC > DatamiTable > watch > edited > next : ', next)
    // },
    currentViewMode (next) {
      // console.log('\nC > DatamiTable > watch > currentViewMode > next : ', next)
      this.itemsPerPage = next === 'cards' ? this.itemsPerPageCards : this.itemsPerPageTable
    },
    filterTags (next) {
      if (next.length) {
        // console.log('\nC > DatamiTable > watch > filterTags > next : ', next)
        this.updateFilterTags({ fileId: this.fileId, tags: this.filterTags })
      }
    }
  },
  beforeMount () {
    // prepare sorting from custom settings if any
    // console.log('\nC > DatamiTable > beforeMount > this.columns : ', this.columns)
    // console.log('\nC > DatamiTable > beforeMount > this.fileOptions : ', this.fileOptions)
    // console.log('C > DatamiTable > beforeMount > this.hasCardsView : ', this.hasCardsView)
    if (this.hasCustomSorting) {
      // console.log('\nC > DatamiTable > beforeMount > this.columns : ', this.columns)
      const settingsSortings = this.customSortingConfig.sortfields.map(f => {
        const fieldName = f.name || f
        const header = this.columns.find(c => c.name === fieldName)
        return {
          field: header && header.field,
          fieldName: fieldName,
          ascending: !!f.ascending
        }
      })
      // console.log('C > DatamiTable > beforeMount > settingsSortings : ', settingsSortings)
      const sortings = {
        fileId: this.fileId,
        fields: settingsSortings.filter(f => f.field)
      }
      this.setSortings(sortings)
    }

    // prepare filters from custom settings if any
    if (this.hasCustomFilters) {
      // console.log('\nC > GitributeTable > beforeMount > this.customFiltersConfig : ', this.customFiltersConfig)
      const filters = [...this.filterFields]
      filters.forEach(filter => {
        filter.fileId = this.fileId
        // filter.enumArr = new Set()
        // filter.enum = filter.enumArr
        this.setFilters(filter)
      })
    }

    // build pagination options
    const pagination = this.paginationFromFileOptions
    // console.log('\nC > DatamiTable > beforeMount > pagination : ', pagination)
    this.itemsPerPage = this.cardsViewIsDefault ? pagination.itemsPerPageCards : pagination.itemsPerPageTable
    this.itemsPerPageTable = pagination.itemsPerPageTable
    this.itemsPerRow = pagination.itemsPerRow
    this.itemsPerPageCards = pagination.itemsPerPageCards
  },

  methods: {
    ...mapActions({
      updateReqErrors: 'git-data/updateReqErrors'
    }),
    columnThAttrs (column) {
      // console.log('\nC > DatamiTable > columnThAttrs > column : ', column)
      return {
        class: 'datami-table datami-table-th has-text-centered'
      }
    },
    columnTdAttrs (row, column) {
      // console.log('\nC > DatamiTable > columnTdAttrs > column : ', column)
      // console.log('C > DatamiTable > columnTdAttrs > row : ', row)
      const fieldId = column.field
      // console.log('C > DatamiTable > columnTdAttrs > fieldId : ', fieldId)
      const field = this.columnsForView.find(f => f.field === fieldId)
      // console.log('C > DatamiTable > columnTdAttrs > field : ', field)
      const fieldType = field && field.type
      const fieldSubype = field && field.subtype
      // console.log('C > DatamiTable > columnTdAttrs > fieldType : ', fieldType)
      // console.log('C > DatamiTable > columnTdAttrs > fieldSubype : ', fieldSubype)
      // const props = fieldTypeIcons.find(ft => ft.type === fieldType && ft.subtype === fieldSubype)
      let classTd = 'datami-table datami-table-td'
      classTd += ` g-td-${fieldType}${fieldSubype ? '-' + fieldSubype : ''}`
      classTd += `${this.currentEditViewMode === 'edit' ? ' datami-table-td-edit' : ''}`
      return {
        class: classTd
      }
    },
    filterData (dataset) {
      // console.log('\nC > GitributeTable > filterData > ...')
      let data = [...dataset]
      // console.log('C > GitributeTable > filterData > data : ', data)
      // console.log('\nC > GitributeTable > filterData > this.columnsForView : ', this.columnsForView)
      const colFields = this.columnsForView.map(col => col.field)
      // console.log('C > GitributeTable > filterData > colFields : ', colFields)

      const searchStr = this.searchText
      // console.log('C > GitributeTable > filterData > searchStr : ', searchStr)
      const filterTags = this.filterTags
      // console.log('C > GitributeTable > filterData > filterTags : ', filterTags)

      // grouping active tags by field
      const regroupedFilterTags = []
      filterTags.forEach(activeTag => {
        const alreadyGrouped = regroupedFilterTags.find(filterField => filterField.field === activeTag.field)
        const tagValueLower = activeTag.value.toString().toLowerCase()
        if (alreadyGrouped) {
          alreadyGrouped.activeValues.push(tagValueLower)
        } else {
          const filterField = this.filterFields.find(f => f.field === activeTag.field)
          regroupedFilterTags.push({
            field: activeTag.field,
            filtering: filterField.filtering,
            activeValues: [tagValueLower]
          })
        }
      })
      // console.log('C > GitributeTable > filterData > regroupedFilterTags : ', regroupedFilterTags)

      // console.log('filtres sélectionnés', filterTags)
      // const filterTagsFields = filterTags.map(f => f.field) || []
      // console.log('C > GitributeTable > filterData > filterTagsFields : ', filterTagsFields)

      // const customFiltersConfig = this.customFiltersConfig
      // console.log('C > GitributeTable > dataEditedFiltered > customFiltersConfig : ', customFiltersConfig)

      // filter out data
      data = data.filter(row => {
        // console.log('\nC > GitributeTable > dataEditedFiltered > row.id : ', row.id)
        const hasSearchVal = searchStr ? [] : [true]
        // console.log('\nC > GitributeTable > filterData > row : ', row)

        // FOR SEARCHBAR FILTER
        for (const field in colFields) {
          // console.log('C > GitributeTable > filterData > field : ', field)
          const cellValSearch = row[field] || ''
          const cellValLowSearch = cellValSearch.toString().toLowerCase()
          // console.log('C > GitributeTable > filterData > rowVal : ', rowVal)
          // search text
          if (searchStr) {
            const cellHasSearch = cellValLowSearch.includes(searchStr.toLowerCase())
            hasSearchVal.push(cellHasSearch)
          }
        }
        const boolSearch = hasSearchVal.some(b => b)

        // AND / OR FILTERS
        const boolAndOrFilters = []

        // BEGINNING NEW FILTERING PROCESS
        regroupedFilterTags.forEach(filterField => {
          // console.log('C > GitributeTable > dataEditedFiltered > filterField : ', filterField)
          const cellVal = row[filterField.field] || ''
          const cellValLow = cellVal.toString().toLowerCase()
          // console.log('\nC > GitributeTable > dataEditedFiltered > filterField.field : ', filterField.field)
          // console.log('C > GitributeTable > dataEditedFiltered > filterField.activeValues : ', filterField.activeValues)
          // console.log('C > GitributeTable > dataEditedFiltered > filterField.filtering : ', filterField.filtering)

          // console.log('C > GitributeTable > dataEditedFiltered > cellValLow : ', cellValLow)
          // const filterVal = filterField.value.toLowerCase()
          const boolArr = filterField.activeValues.map(activeValue => {
            return cellValLow.includes(activeValue)
          })
          // console.log('C > GitributeTable > dataEditedFiltered > boolArr : ', boolArr)

          let fieldBool = true
          if (filterField.filtering === 'OR') {
            fieldBool = boolArr.some(b => b)
          } else if (filterField.filtering === 'AND') {
            fieldBool = boolArr.every(b => b)
          }
          boolAndOrFilters.push({ field: filterField.field, bool: fieldBool })
          // console.log('C > GitributeTable > dataEditedFiltered > fieldBool : ', fieldBool)
        })

        // console.log('\nC > GitributeTable > dataEditedFiltered > boolAndOrFilters : ', boolAndOrFilters)

        const boolFilters = boolAndOrFilters
          .map(b => b.bool)
          .every(b => b) // HORIZONTAL "AND" CONDITION

        // console.log('C > GitributeTable > dataEditedFiltered > boolSearch : ', boolSearch)
        // console.log('C > GitributeTable > dataEditedFiltered > boolFilters : ', boolFilters)

        return boolSearch && boolFilters
      })
      return data
    },
    async processAction (event) {
      // console.log('\nC > DatamiTable > processAction > event : ', event)
      switch (event.action) {
        // ADD TAG TO ENUM
        case 'addTagToEnum':
          // console.log('\nC > DatamiTable > processAction > event : ', event)
          this.$emit('addTagToEnum', event.value)
          break

        // ADD ROW
        case 'openAddRowDialog':
          this.showAddRowDialog = true
          break
        case 'addNewRow':
          this.$emit('addRow', event)
          break
        // ADD COLUMN
        case 'openAddColumnDialog':
          this.showAddColumnDialog = true
          break
        case 'addNewColumn':
          console.log('DatamiTable > processAction > addNewColumn > event', event)
          this.$emit('addColumn', event)
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
          // console.log('\nC > DatamiTable > processAction > event : ', event)
          this.sortingByField = event.value.header
          this.sortingAscending = event.value.ascending
          this.$emit('sortRows', event)
          break

        // FILTERING
        case 'searchText':
          // console.log('\nC > DatamiTable > processAction > event : ', event)
          this.processSearch(event.value)
          break
        case 'filterBy':
          this.processFilter(event.value)
          break
        case 'removeTag':
          this.removeTag(event.value)
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

        // CONSOLIDATION
        case 'consolidate':
          // console.log('\nC > DatamiTable > processAction > consolidation > event : ', event)
          await this.consolidateRow(event)
          break
        case 'cancelConsolidation':
          // console.log('\nC > DatamiTable > processAction > mergeConsolidation > event : ', event)
          // this.openedDetails = this.openedDetails.filter(id => id !== event.rowId)
          this.closeConsolidationDetail(event.rowId)
          break
        case 'mergeConsolidation':
          // console.log('\nC > DatamiTable > processAction > mergeConsolidation > event : ', event)
          this.updateConsolidatedValues(event)
          break
      }
    },
    emitUpdate (event) {
      // console.log('C > DatamiTable > emitUpdate > event : ', event)
      this.$emit('updateEdited', event)
    },
    processSearch (search) {
      // console.log('C > DatamiTable > processSearch > search : ', search)
      const reset = search.reset
      this.searchText = !reset ? search.value : undefined
    },
    processFilter (filter) {
      // console.log('C > DatamiTable > processFilter > filter : ', filter)
      const active = !!filter.field
      const reset = filter.reset
      if (!reset && active) {
        this.processFilterValue(filter)
      }
      if (reset) {
        this.filterTags = this.filterTags.filter(f => f.field !== filter.field) || []
      }
    },
    processFilterValue (tag, remove = false) {
      // console.log('C > DatamiTable > processFilterValue > tag : ', tag)
      // console.log('C > DatamiTable > processFilterValue > remove : ', remove)
      const filterTags = this.filterTags.filter(t => {
        const sameField = t.field === tag.field
        const sameValue = t.value === tag.value
        return !(sameField && sameValue)
      })
      if (!remove) {
        filterTags.push(tag)
      }
      this.filterTags = filterTags
    },
    removeTag (tag) {
      // console.log('\nC > DatamiTable > removeTag > tag : ', tag)
      this.processFilterValue(tag, true)
    },
    isConsolidating (rowId) {
      return this.consolidating.includes(rowId)
    },
    async consolidateRow (consolidationSettings) {
      // console.log('\nC > DatamiTable > consolidateRow > consolidationSettings : ', consolidationSettings)
      this.updateReqErrors({ fileId: this.fileId, addToErrors: false })
      const rowId = consolidationSettings.rowId
      this.consolidating.push(rowId)
      this.closeConsolidationDetail(rowId)
      // this.consolidationData = this.consolidationData.filter(item => item.rowId !== rowId)
      // this.openedDetails = this.openedDetails.filter(id => id !== rowId)

      // console.log('\nC > DatamiTable > consolidateRow > this.consolidationData : ', this.consolidationData)
      // console.log('C > DatamiTable > consolidateRow > this.columns : ', this.columns)
      const rowData = this.dataEdited.find(row => row.id === rowId)
      // console.log('C > DatamiTable > consolidateRow > rowData : ', rowData)
      let sourceFields = consolidationSettings.api.source_fields
      sourceFields = sourceFields.map(f => {
        const colField = this.columns.find(cf => cf.name === f.name)
        const colFieldId = colField.field
        const rowDataValue = rowData[colFieldId]
        return {
          name: f.name,
          id: colFieldId,
          value: rowDataValue
        }
      })
      // console.log('C > DatamiTable > sourceFields : ', sourceFields)

      const respConsolidation = await this.getConsolidationApiUrl(consolidationSettings, this.columns, sourceFields)
      respConsolidation.rowId = rowId
      respConsolidation.apiName = consolidationSettings.api.api_name
      respConsolidation.sourceFields = sourceFields
      respConsolidation.api = consolidationSettings.api.api
      // respConsolidation.rowData = rowData
      // console.log('C > DatamiTable > consolidateRow > respConsolidation : ', respConsolidation)

      // update loaders & errors
      this.consolidating = this.consolidating.filter(id => id !== rowId)
      if (!respConsolidation.consolidation) {
        this.updateReqErrors({ fileId: this.fileId, errors: respConsolidation.errors, addToErrors: true })
      } else {
        this.consolidationData.push(respConsolidation)
        this.openedDetails.push(rowId)
      }
    },
    getRowConsolidation (rowId) {
      return this.consolidationData.find(data => data.rowId === rowId)
    },
    closeConsolidationDetail (rowId) {
      this.openedDetails = this.openedDetails.filter(id => id !== rowId)
      this.consolidationData = this.consolidationData.filter(item => item.rowId !== rowId)
    },
    updateConsolidatedValues (event) {
      // console.log('\nC > DatamiTable > updateConsolidatedValues > event : ', event)
      event.newValues.forEach(e => {
        // console.log('C > DatamiTable > updateConsolidatedValues > e : ', e)
        this.$emit('updateEdited', e)
      })
      this.closeConsolidationDetail(event.rowId)
    },
    toggleDetail (event) {
      // console.log('\nC > DatamiTable > toggleDetail > event : ', event)
      // console.log('C > DatamiTable > toggleDetail > this.showCardDetails : ', this.showCardDetails)
      // this.showCardDetails = !event.showDetail
      if (event.showDetail) {
        this.showCardDetails = false
      } else {
        this.showCardDetails = true
      }
    }
  }
}
</script>

<style>
.datami-nowrap {
  white-space: nowrap;
}
.datami-table {
  /* min-width: 100px; */
  max-width: 350px;
  overflow: auto;
  vertical-align: top !important;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.datami-table::-webkit-scrollbar {
  display: none;
}
.datami-table-td {
  /* padding: .2em .25em !important; */
  min-width: 100px;
}
.datami-table-td.is-sticky {
  z-index: 2 !important;
}
.th-wrap {
  justify-content: center !important;
}
.datami-table-td-edit {
  border: none !important;
}
.g-td-string {
  min-width: 100px;
}
.g-td-string-longtext {
  min-width: 350px;
}
.g-td-number {
  min-width: 85px;
}
.g-td-integer {
  min-width: 40px;
}
.g-td-boolean {
  min-width: 30px;
  text-align: center !important;
}
.g-td-string-tag {
  min-width: 100px;
  text-align: center !important;
}
.g-td-string-tags {
  min-width: 275px;
}
.detail-container {
  position: sticky;
  left: 10px !important;
  width: max-content;
}
</style>
