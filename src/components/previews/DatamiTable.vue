<template>
  <div class="DatamiTable content">
    <div class="columns is-multiline is-mobile is-centered">
      <!-- SORT & FILTERS CSV NAVABAR -->
      <!-- v-show="!isAnyDialogOpen" -->
      <div
        :id="`sort-and-filters-skeleton-${fileId}`"
        ref="sortandfiltersskeleton"
        :class="`column is-12 py-0 ${currentViewMode === 'map' ? 'px-5' : '' } mt-2`"
        style="z-index: 3;">
        <SortAndFiltersSkeleton
          :file-id="fileId"
          :columns="columnsEdited"
          :active-tags="filterTags"
          :locale="locale"
          @action="processAction"/>
      </div>

      <!-- DEBUGGING -->
      <!-- <div v-if="debug">
        <div
          v-if="debug"
          class="column is-3">
          fileFilters: <br><pre><code>{{ fileFilters }}</code></pre>
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
      </div> -->

      <!-- COUNTS & EDIT CSV NAVABAR -->
      <!-- v-show="!isAnyDialogOpen" -->
      <div
        :id="`edit-csv-skeleton-${fileId}`"
        ref="editcsvskeleton"
        class="column is-12 pt-0"
        style="z-index: 2;">
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

      <!-- DEBUGGING -->
      <!-- <div v-if="debug">
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
      </div> -->

      <!-- <div
        v-if="debug"
        class="column is-12">
        currentViewMode: <code>{{ currentViewMode }}</code><br>
      </div>
      <div
        v-if="debug"
        class="column is-4">
        currentPage: <code>{{ currentPage }}</code><br>
        itemsPerPage: <code>{{ itemsPerPage }}</code><br>
        itemsPerPageChoices: <code>{{ itemsPerPageChoices }}</code><br>
      </div>
      <div
        v-if="debug"
        class="column is-4">
        currentPageTable: <code>{{ currentPageTable }}</code><br>
        itemsPerPageTable: <code>{{ itemsPerPageTable }}</code><br>
      </div>
      <div
        v-if="debug"
        class="column is-4">
        currentPageCards: <code>{{ currentPageCards }}</code><br>
        itemsPerPageCards: <code>{{ itemsPerPageCards }}</code><br>
      </div> -->

      <!-- TABLE / CARDS / DATAVIZ / MAP -->
      <div
        v-show="dataForView && dataForView.length"
        :class="`datami-table-container column is-${ currentViewMode === 'cards' ? 10 : 12} ${ currentViewMode === 'map' ? 'pt-0' : ''} ${isDarkMode ? 'datami-darkmode' : ''}`">
        <!-- :sticky-checkbox="currentEditViewMode === 'edit'" -->
        <div
          v-show="currentViewMode === 'table'"
          class="datami-table-view-table">
          <!-- :height="(fileOptions && fileOptions.height) || '400px'" -->
          <b-table
            :data="dataEditedPaginated"
            :checkable="currentEditViewMode === 'edit'"
            :checked-rows.sync="checkedRows"
            :detailed="currentEditViewMode === 'edit'"
            :opened-detailed="openedDetails"
            :detail-transition="transitionName"
            :show-detail-icon="showDetailIcon"
            :striped="currentEditViewMode !== 'edit'"
            height="auto"
            detail-key="id"
            narrowed
            hoverable
            sticky-header
            checkbox-type="is-dark">
            <!-- LOOP COLUMNS -->
            <b-table-column
              v-for="(col, idx) in columnsForView"
              :key="col.field"
              :th-attrs="columnThAttrs"
              :td-attrs="columnTdAttrs"
              :field="col.field"
              :sticky="!idx"
              :visible="!col.hide"
              :label="col.type === 'datami' ? t(col.label, locale) : col.label">
              <!-- HEADERS -->
              <template #header="{ column }">
                <div
                  :class="`datami-table-header-${col.type}${col.subtype ? '-' + col.subtype : ''} is-flex is-flex-direction-row ${col.type === 'datami' ? 'is-align-items-center is-justify-content-center' : 'is-align-items-start'}`">
                  <!-- style="white-space: nowrap;"> -->
                  <!-- EDITION HEADERS-->

                  <!-- FIELD TYPE ICON -->
                  <div class="table-field-icon">
                    <PreviewFieldIcon
                      :file-id="fileId"
                      :field="col"
                      :locale="locale"/>
                  </div>

                  <!-- FIELD INFOS -->
                  <div
                    v-if="col.type !== 'datami'"
                    class="table-field-header has-text-left py-1"
                    style="flex: auto;">
                    <!-- EDIT HEADERS -->
                    <div v-if="currentEditViewMode === 'edit'">
                      <b-field
                        v-if="!lockHeaders">
                        <EditCell
                          :file-id="fileId"
                          :is-header="true"
                          :field="col"
                          :input-data="column.label"/>
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
                  </div>

                  <!-- FIELD SORTING -->
                  <div
                    v-if="col.type !== 'datami' && !noSortingFields.includes(col.subtype)"
                    class="table-field-sorting">
                    <ButtonSortByField
                      :file-id="fileId"
                      :field="col"
                      :locale="locale"
                      @action="processAction"/>
                  </div>
                </div>
              </template>

              <!-- ROWS -->
              <template #default="props">
                <!-- DEBUG -->
                <div
                  v-if="debug"
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
                    :row-id="props.row.id"
                    :value="props.row[col.field]"
                    :field="col"
                    :is-edit-view="true"
                    :locale="locale"
                    @action="processAction"/>
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
                    :row-id="props.row.id"
                    :value="props.row[col.field]"
                    :is-diff-view="true"
                    :field="col"
                    :locale="locale"
                    @action="processAction"/>
                </div>

                <!-- PREVIEW -->
                <div
                  v-if="currentEditViewMode === 'preview'"
                  class="datami-cell">
                  <!-- {{ props.row[col.field] }} -->
                  <PreviewCell
                    :file-id="fileId"
                    :row-id="props.row.id"
                    :value="props.row[col.field]"
                    :field="col"
                    :locale="locale"
                    @action="processAction"/>
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
          v-show="currentViewMode === 'cards'"
          class="datami-table-view-cards">
          <!-- v-model="showCardDetails" -->
          <DatamiCardsGrid
            :file-id="fileId"
            :cards-settings="cardsSettingsFromFileOptions"
            :mappings-for-mini="mappingsForMini"
            :mappings-for-detail="mappingsForDetail"
            :items-per-row="itemsPerRow"
            :items="dataEditedPaginated"
            :locale="locale"
            @toggleDetail="toggleDetail"
            @action="processAction"/>
        </div>

        <!-- DATAVIZ & MAP DEBUGGING-->
        <!-- <p v-if="debug">
          hasDatavizView: <code>{{ hasDatavizView }}</code><br>
          currentViewMode: <code>{{ currentViewMode }}</code>
        </p> -->

        <!-- DATAVIZ -->
        <div
          v-if="fileOptions && hasDatavizView && datavizViewIsActive"
          v-show="currentViewMode === 'dataviz'"
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
        <!-- v-show="!isAnyDialogOpen && currentViewMode === 'map'" -->
        <div
          v-if="fileOptions && hasMapView && mapViewIsActive && currentViewMode === 'map'"
          class="datami-table-view-map">
          <!-- v-model="showCardDetails" -->
          <DatamiMapGrid
            :file-id="fileId"
            :items="dataForView"
            :fields="columns"
            :locale="locale"
            @action="processAction"/>
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
        v-show="viewsWithPagination.includes(currentViewMode)"
        class="column is-12">
        <PagesNavigation
          :file-id="fileId"
          :total-items="totalItemsDataEdited"
          :items-per-page-table="itemsPerPageTable"
          :items-per-page-cards="itemsPerPageCards"
          :items-per-page-choices="itemsPerPageChoices"
          :debug="false"
          :locale="locale"/>
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
  booleanFromValue
} from '@/utils/globalUtils.js'

import {
  mixinTooltip,
  mixinClientUrl,
  mixinGlobal,
  mixinIcons,
  mixinDiff,
  mixinCsv,
  // mixinCards,
  mixinPagination,
  mixinConsolidation
} from '@/utils/mixins.js'

// import { fieldTypeIcons } from '@/utils/fileTypesUtils'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DatamiTable',
  components: {
    SortAndFiltersSkeleton: () => import(/* webpackChunkName: "SortAndFiltersSkeleton" */ '@/components/filters/SortAndFiltersSkeleton.vue'),
    ButtonSortByField: () => import(/* webpackChunkName: "ButtonSortByField" */ '@/components/sorting/ButtonSortByField.vue'),
    EditCsvSkeleton: () => import(/* webpackChunkName: "EditCsvSkeleton" */ '@/components/edition/csv/EditCsvSkeleton.vue'),

    PreviewFieldIcon: () => import(/* webpackChunkName: "PreviewFieldIcon" */ '@/components/previews/PreviewFieldIcon.vue'),
    PreviewField: () => import(/* webpackChunkName: "PreviewField" */ '@/components/previews/PreviewField.vue'),
    PreviewCell: () => import(/* webpackChunkName: "PreviewCell" */ '@/components/previews/PreviewCell.vue'),
    EditCell: () => import(/* webpackChunkName: "EditCell" */ '@/components/edition/csv/EditCell.vue'),
    PreviewConsolidation: () => import(/* webpackChunkName: "PreviewConsolidation" */ '@/components/edition/PreviewConsolidation.vue'),

    DatamiCardsGrid: () => import(/* webpackChunkName: "DatamiCardsGrid" */ '@/components/previews/cards/DatamiCardsGrid.vue'),
    DatamiDatavizGrid: () => import(/* webpackChunkName: "DatamiDatavizGrid" */ '@/components/previews/dataviz/DatamiDatavizGrid.vue'),
    DatamiMapGrid: () => import(/* webpackChunkName: "DatamiMapGrid" */ '@/components/previews/maps/DatamiMapGrid.vue'),

    PagesNavigation: () => import(/* webpackChunkName: "PagesNavigation" */ '@/components/pagination/PagesNavigation.vue')
  },
  mixins: [
    mixinTooltip,
    mixinClientUrl,
    mixinGlobal,
    mixinIcons,
    mixinDiff,
    mixinCsv,
    // mixinCards,
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
      // cssFiles: [
      //   'styles/components/previews/table/datami-table.css',
      //   'styles/components/previews/tags/datami-tags.css'
      // ],
      checkedRows: [],
      showCardDetails: false,

      // VIEWS SETTINGS
      viewsWithPagination: ['table', 'cards'],

      // SORTING
      noSortingFields: ['tags'],
      sortingByField: undefined,
      sortingAscending: true,

      // FILTERS
      searchText: undefined,
      filterTagsChoices: [],
      filterTags: [],

      // PAGINATION
      currentPageTable: 1,
      currentPageCards: 1,
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
      openCardField: {
        type: 'datami'
      },

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
  // getters: {
  //   ...mapGetters({
  //     checkIfErrorExists: 'git-data/checkIfErrorExists',
  //     isDarkMode: 'git-storage/isDarkMode'
  //   })
  // },
  computed: {
    ...mapGetters({
      checkIfErrorExists: 'git-data/checkIfErrorExists',
      isDarkMode: 'git-storage/isDarkMode'
    }),
    filterFields () {
      const settingsFields = this.customFiltersConfig.filterfields.map(filterField => filterField.name || filterField)
      // console.log('\nC > DatamiTable > filterFields > settingsFields : ', settingsFields)
      // console.log('C > DatamiTable > filterFields > this.columns : ', this.columns)
      const filterFields = this.columns
        .filter(col => {
          // Filter out only columns whose name is in settingsFields
          // console.log('C > DatamiTable > filterFields > col : ', col)
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
      // console.log('C > DatamiTable > filterFields > filterFields : ', filterFields)
      return filterFields
    },
    cardsSettingsFromFileOptions () {
      let cardsSettings
      // console.log('\nC > DatamiTable > cardsSettingsFromFileOptions > this.hasCardsView : ', this.hasCardsView)
      if (this.hasCardsView && this.cardsViewIsActive) {
        const settings = this.cardsSettingsFromOptions
        const miniSettings = settings.mini
        const detailSettings = settings.detail
        const mapping = this.columns.map(h => {
          const fieldMap = {
            ...h,
            mini: miniSettings[h.name],
            detail: detailSettings[h.name]
          }
          const hasTemplate = this.cardsSettingsTemplates && this.cardsSettingsTemplates[h.name]
          if (hasTemplate) {
            // console.log('\nC > DatamiTable > cardsSettingsFromFileOptions > hasTemplate : ', hasTemplate)
            fieldMap.templating = hasTemplate
          }
          return fieldMap
        })
        cardsSettings = {
          originalHeaders: this.columns,
          editedHeaders: this.columnsForView,
          settings: { mini: miniSettings, detail: detailSettings },
          mapping: mapping,
          minivizs: this.cardsSettingsMinivizs
        }
      }
      // console.log('C > DatamiTable > cardsSettingsFromFileOptions > cardsSettings : ', cardsSettings)
      return cardsSettings
    },
    hasCardMappings () {
      return this.cardsSettingsFromFileOptions && this.cardsSettingsFromFileOptions.mapping
    },
    mappingsForMini () {
      return this.hasCardMappings && this.cardsSettingsFromFileOptions.mapping.map(h => {
        // console.log('C > DatamiTable > mappingsForMini > h : ', h)
        const fieldMap = {
          ...this.trimField(h),
          ...h.mini
        }
        const hasTemplate = h.templating && h.templating.use_on_mini
        if (hasTemplate) {
          fieldMap.templating = h.templating.paragraphs
          fieldMap.ignoreDefinitions = h.templating.ignore_definitions
          fieldMap.ignoreTrimming = h.templating.use_on_mini
        }
        // console.log('C > DatamiTable > mappingsForMini > fieldMap : ', fieldMap)
        return fieldMap
      })
    },
    mappingsForDetail () {
      return this.hasCardMappings && this.cardsSettingsFromFileOptions.mapping.map(h => {
        // console.log('C > DatamiTable > mappingsForDetail > h : ', h)
        const fieldMap = {
          ...this.trimField(h),
          ...h.detail
        }
        const hasTemplate = h.templating && h.templating.use_on_detail
        if (hasTemplate) {
          // console.log('C > DatamiTable > mappingsForDetail > h : ', h)
          fieldMap.templating = h.templating.paragraphs
          fieldMap.ignoreDefinitions = h.templating.ignore_definitions
          // fieldMap.useOnMini = h.templating.use_on_mini
          // console.log('C > DatamiTable > mappingsForDetail > fieldMap : ', fieldMap)
        }
        // console.log('C > DatamiTable > mappingsForDetail > fieldMap : ', fieldMap)
        return fieldMap
      })
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
          case 1:
            // console.log('C > DatamiTable > itemsPerPageChoices > case 1 > this.itemsPerRow : ', this.itemsPerRow)
            result = this.itemsPerPageChoicesCards1perRow
            break
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
      // console.log('C > DatamiTable > paginationFromFileOptions > pagination : ', pagination)
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
        const itemsPerRow = this.getClosest([1, 2, 3, 4], pagination.itemsPerRow)
        if (itemsPerRow === 1) {
          pagination.itemsPerPageCards = this.getClosest(this.itemsPerPageChoicesCards1perRow, goal)
        }
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
      // console.log('C > DatamiTable > paginationFromFileOptions > pagination (return) : ', pagination)
      return pagination
    },
    dataFiltered () {
      const data = this.filterData(this.data)
      return data
    },
    dataEditedFiltered () {
      // console.log('\nC > DatamiTable > dataEditedFiltered > this.dataEdited : ', this.dataEdited)
      const data = this.filterData(this.dataEdited)
      // console.log('C > DatamiTable > dataEditedFiltered > data : ', data)
      return data
    },
    dataEditedSorted () {
      // console.log('\nC > DatamiTable > dataEditedSorted > this.fileSorting : ', this.fileSorting)
      let data = [...this.dataEditedFiltered]
      // console.log('C > DatamiTable > dataEditedSorted > data : ', data)
      if (this.fileSorting && this.fileSorting.length) {
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
        data = data.sort((a, b) => {
          const idA = a.added ? a.position : a.id
          const idB = b.added ? b.position : b.id
          const sorter = parseInt(idA) > parseInt(idB) ? 1 : -1
          return sorter
        })
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
      // console.log('\nC > DatamiTable > columnsForView > this.currentEditViewMode : ', this.currentEditViewMode)
      switch (this.currentEditViewMode) {
        case 'edit':
          if (this.hasConsolidation) {
            const consolidationColumn = {
              ...this.consolidationField,
              field: 'consolidation',
              type: 'datami',
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

      // console.log('C > DatamiTable > columnsForView > preview > columns : ', columns)
      if (this.hasCardsView && this.cardsViewIsActive) {
        const openCardColumn = {
          ...this.openCardField,
          field: 'openDatamiCard',
          type: 'datami',
          subtype: 'openDatamiCard',
          label: 'field.openDatamiCard'
        }
        openCardColumn.icon = this.getIconFieldType(openCardColumn)
        return [openCardColumn, ...columns]
      } else {
        return columns
      }
    },
    currentPage () {
      let page = 1
      switch (this.currentViewMode) {
        case 'table':
          page = this.currentPageTable
          break
        case 'cards':
          page = this.currentPageCards
          break
      }
      return page
    }
  },
  watch: {
    filterTags (next) {
      if (next.length) {
        // console.log('\nC > DatamiTable > watch > filterTags > next : ', next)
        this.updateFilterTags({ fileId: this.fileId, tags: this.filterTags })
      }
    },
    fileSignals (next) {
      // console.log('\nC > DatamiTable > watch > fileSignals > next : ', next)
      if (next && next.length) {
        next.forEach(signal => {
          // console.log('\nC > DatamiTable > watch > fileSignals > signal : ', signal)
          switch (signal.action) {
            case 'changePage':
              // console.log('\nC > DatamiTable > watch > fileSignals > signal : ', signal)
              this.changePage(signal.event)
              this.removeFileSignal(signal.signalId)
              break
          }
        })
      }
    }
  },
  beforeMount () {
    // prepare sorting from custom settings if any
    // console.log('\nC > DatamiTable > beforeMount > this.columns : ', this.columns)
    // console.log('C > DatamiTable > beforeMount > this.fileOptions : ', this.fileOptions)
    // console.log('C > DatamiTable > beforeMount > this.hasCardsView : ', this.hasCardsView)
    if (this.hasCustomSorting) {
      // console.log('\nC > DatamiTable > beforeMount > this.columns : ', this.columns)
      // console.log('\nC > DatamiTable > beforeMount > this.customSortingConfig : ', this.customSortingConfig)
      const settingsSortings = this.customSortingConfig.sortfields.map(f => {
        const fieldName = f.name || f
        const header = this.columns.find(c => c.name === fieldName)
        return {
          field: header && header.field,
          fieldName: fieldName,
          ascending: !!f.ascending,
          random: !!f.random
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
      // console.log('\nC > DatamiTable > beforeMount > this.customFiltersConfig : ', this.customFiltersConfig)
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
  mounted () {
    // console.log('\nC > DatamiTable > mounted > this.currentViewMode : ', this.currentViewMode)
    // console.log('C > DatamiTable > mounted > this.showCardDetails : ', this.showCardDetails)
    if (this.urlActiveDetailCard && this.currentViewMode !== 'map' && !this.showCardDetails) {
      // console.log('C > DatamiTable > mounted > this.urlActiveDetailCard : ', this.urlActiveDetailCard)
      this.toggleDetail({ itemId: this.urlActiveDetailCard })
    }
  },
  methods: {
    ...mapActions({
      updateReqErrors: 'git-data/updateReqErrors'
    }),
    columnThAttrs (column) {
      // console.log('\nC > DatamiTable > columnThAttrs > column : ', column)
      return {
        class: `datami-table datami-table-th has-text-centered ${this.isDarkMode ? 'datami-darkmode' : ''}`
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
      classTd += `${this.isDarkMode ? ' datami-darkmode-grey-shades' : ''}`
      classTd += `${this.currentEditViewMode === 'edit' ? ' datami-table-td-edit' : ''}`
      return {
        class: classTd
      }
    },
    filterData (dataset) {
      // console.log('\nC > DatamiTable > filterData > ...')
      let data = [...dataset]
      // console.log('C > DatamiTable > filterData > data : ', data)
      // console.log('\nC > DatamiTable > filterData > this.columnsForView : ', this.columnsForView)
      const colFields = this.columnsForView.map(col => col.field)
      // console.log('C > DatamiTable > filterData > colFields : ', colFields)

      const searchStr = this.searchText
      // console.log('C > DatamiTable > filterData > searchStr : ', searchStr)
      const filterTags = this.filterTags
      // console.log('C > DatamiTable > filterData > filterTags : ', filterTags)

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
            type: activeTag.type,
            subtype: activeTag.subtype,
            tagSeparator: activeTag.tagSeparator,
            filtering: filterField.filtering,
            activeValues: [tagValueLower]
          })
        }
      })
      // console.log('C > DatamiTable > filterData > regroupedFilterTags : ', regroupedFilterTags)

      // filter out data
      data = data.filter(row => {
        // const debug = row.id === '18' // || row.id === '19'
        // debug && console.log('\nC > DatamiTable > filterData > row.id : ', row.id)
        // debug && console.log('C > DatamiTable > filterData > row : ', row)

        // FOR SEARCHBAR FILTER (TEXT SEARCH)
        let boolSearch
        const hasSearchVal = searchStr ? [] : [true]
        if (searchStr) {
          for (const field in colFields) {
            // debug && console.log('C > DatamiTable > filterData > field : ', field)
            const cellValSearch = row[field] || ''
            const cellValLowSearch = cellValSearch.toString().toLowerCase()
            // debug && console.log('C > DatamiTable > filterData > rowVal : ', rowVal)
            // check if text in cell contains search string
            const cellHasSearch = cellValLowSearch.includes(searchStr.toLowerCase())
            hasSearchVal.push(cellHasSearch)
          }
          boolSearch = hasSearchVal.some(b => b)
        } else {
          boolSearch = true
        }

        // AND / OR FILTERS
        const boolAndOrFilters = []

        // FILTERING PROCESS
        let boolFilters
        if (regroupedFilterTags.length) {
          regroupedFilterTags.forEach(filterField => {
            // debug && console.log('\nC > DatamiTable > dataEditedFiltered > filterField : ', filterField)
            // debug && console.log('C > DatamiTable > dataEditedFiltered > filterField.field : ', filterField.field)
            // debug && console.log('C > DatamiTable > dataEditedFiltered > filterField.activeValues : ', filterField.activeValues)
            // debug && console.log('C > DatamiTable > dataEditedFiltered > filterField.filtering : ', filterField.filtering)
            // debug && console.log('C > DatamiTable > dataEditedFiltered > row : ', row)
            let cellVal = row[filterField.field] || ''
            // debug && console.log('C > DatamiTable > dataEditedFiltered > cellVal : ', cellVal)
            switch (filterField.type) {
              case 'boolean':
                cellVal = booleanFromValue(cellVal, filterField)
            }
            const cellValLow = cellVal.toString().toLowerCase()

            // debug && console.log('C > DatamiTable > dataEditedFiltered > cellValLow : ', cellValLow)
            const boolArr = filterField.activeValues.map(activeValue => {
              // Check if cell value is equivalent to each active value from filter
              // return cellValLow.includes(activeValue) // => bad parsing because 'Tag12' contains 'Tag1'
              if (filterField.subtype === 'tags') {
                return cellValLow.split(filterField.tagSeparator).some(v => v.trim() === activeValue)
              } else {
                return cellValLow === activeValue
              }
            })
            // debug && console.log('C > DatamiTable > dataEditedFiltered > boolArr : ', boolArr)

            let fieldBool = true
            // VERTICAL CONDITION WITHIN TAGS FROM SAME FIELD
            if (filterField.filtering === 'OR') {
              fieldBool = boolArr.some(b => b)
            } else if (filterField.filtering === 'AND') {
              fieldBool = boolArr.every(b => b)
            } else if (filterField.filtering === 'RADIO') {
              fieldBool = boolArr.some(b => b)
            }
            boolAndOrFilters.push({ field: filterField.field, bool: fieldBool })
            // debug && console.log('C > DatamiTable > dataEditedFiltered > fieldBool : ', fieldBool)
          })
          // debug && console.log('\nC > DatamiTable > dataEditedFiltered > boolAndOrFilters : ', boolAndOrFilters)

          boolFilters = boolAndOrFilters
            .map(b => b.bool)
            .every(b => b) // HORIZONTAL "AND" CONDITION
          // debug && console.log('C > DatamiTable > dataEditedFiltered > boolSearch : ', boolSearch)
          // debug && console.log('C > DatamiTable > dataEditedFiltered > boolFilters : ', boolFilters)
        } else {
          boolFilters = true
        }

        return boolSearch && boolFilters
      })
      return data
    },
    async processAction (event) {
      console.log('\nC > DatamiTable > processAction > event : ', event)
      switch (event.action) {
        // OPEN CARD
        case 'openCard':
          this.updateFileDialogs('CardDetail', {
            ...event,
            fromTable: true,
            fields: this.columns,
            fieldMapping: this.mappingsForDetail,
            item: this.getDetailItem(event.rowId)
          })
          this.changeUrlDetailId(this.getDetailItem(event.rowId))
          break

        // IMPORT DATA
        case 'openUploadFileDialog':
          this.updateFileDialogs('UploadFile', {
            ...event,
            fields: this.columns
          })
          break

        // ADD ROW
        case 'openAddRowDialog':
          this.updateFileDialogs('AddRow', {
            ...event,
            fields: this.columns
          })
          break

        // DELETE ROWS
        case 'openDeleteRowsDialog':
          this.updateFileDialogs('DeleteRow', {
            ...event,
            fields: this.columnsEdited,
            checkedRows: this.checkedRows
          })
          break

        // SORTING
        case 'sortBy':
          // console.log('\nC > DatamiTable > processAction > event : ', event)
          this.sortingByField = event.value.header
          this.sortingAscending = event.value.ascending
          this.addFileSignal('sortRows', event)
          // this.$emit('sortRows', event)
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
      const isRadio = tag.type === 'boolean'
      const filterTags = this.filterTags.filter(t => {
        const sameField = t.field === tag.field
        const sameValue = isRadio || t.value === tag.value
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
      const rowId = consolidationSettings.rowId
      this.consolidating.push(rowId)
      this.closeConsolidationDetail(rowId)

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
      // console.log('C > DatamiTable > consolidateRow > respConsolidation : ', respConsolidation)

      // update loaders & errors
      this.consolidating = this.consolidating.filter(id => id !== rowId)
      if (!respConsolidation.consolidation) {
        const reqErrors = respConsolidation.errors.map(err => { return { ...err, fileId: this.fileId, errorId: this.uuidv4() } })
        // console.log('C > DatamiTable > consolidateRow > reqErrors : ', reqErrors)
        reqErrors.forEach(err => {
          // console.log('C > DatamiTable > consolidateRow > err : ', err)
          if (!this.checkIfErrorExists(err)) {
            this.updateReqErrors({ error: err, addToErrors: true })
            this.updateFileDialogs('NotificationErrors', { error: err })
          }
        })
      } else {
        this.consolidationData.push(respConsolidation)
        this.openedDetails.push(rowId)
      }
    },
    getDetailItem (rowId) {
      return this.data.find(item => item.id === rowId)
    },
    getRowConsolidation (rowId) {
      return this.consolidationData.find(data => data.rowId === rowId)
      // return consolidationSettings && { ...consolidationSettings, fileId: this.fileId }
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
      const item = this.getDetailItem(event.itemId)
      if (item) {
        const dialogPayload = {
          fromTable: false,
          item: item,
          fields: this.columns,
          fieldMapping: this.mappingsForDetail
        }
        this.updateFileDialogs('CardDetail', { ...event, ...dialogPayload }, !event.showDetail)
        this.changeUrlDetailId(item)
        this.showCardDetails = true
      } else {
        this.deleteUrlParam('datami_detail_id')
        this.showCardDetails = false
      }
    },
    changePage (event) {
      // console.log('\nC > DatamiTable > changePage > event : ', event)
      // console.log('C > DatamiTable > changePage > event.value.currentPage : ', event.value.currentPage)
      // console.log('C > DatamiTable > changePage > event.value.itemsPerPage : ', event.value.itemsPerPage)
      // console.log('C > DatamiTable > changePage > event.value.itemsPerPageTable : ', event.value.itemsPerPageTable)
      // console.log('C > DatamiTable > changePage > event.value.itemsPerPageCards : ', event.value.itemsPerPageCards)
      // this.currentPage = event.value.currentPage
      // this.itemsPerPage = event.value.itemsPerPage
      switch (this.currentViewMode) {
        case 'table':
          this.currentPageTable = event.value.currentPage
          this.itemsPerPageTable = event.value.itemsPerPageTable
          this.itemsPerPage = event.value.itemsPerPageTable
          break
        case 'cards':
          this.currentPageCards = event.value.currentPage
          this.itemsPerPageCards = event.value.itemsPerPageCards
          this.itemsPerPage = event.value.itemsPerPageCards
          break
      }
    }
  }
}
</script>
