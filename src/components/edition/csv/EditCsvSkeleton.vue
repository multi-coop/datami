<template>
  <div class="EditCsvSkeleton container">
    <div class="columns">
      <!-- VIEW CHOICES -->
      <!-- <div
        :class="`column is-2 is-flex is-flex-direction-row is-align-items-end is-justify-content-start`">
        <ViewModeBtns
          :file-id="fileId"
          :locale="locale"/>
      </div> -->
      <!-- EDIT BUTTONS -->
      <div
        :class="`column is-4 is-offset-2 is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
        <ButtonSortBy
          :headers="columns"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
      <div
        :class="`column is-4 is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
        <ButtonFilterBy
          :headers="columns"
          :is-active-tags="isActiveTags"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
      <div
        v-if="currentEditViewMode === 'edit'"
        :class="`column is-2 is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
        <ButtonAddRow
          :locale="locale"
          @action="SendActionToParent"/>
        <!-- <ButtonImportData
          :locale="locale"
          @action="SendActionToParent"/> -->
        <ButtonDeleteRows
          :checked-rows="checkedRows"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
    </div>

    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-6">
        columns :
        <code>
          <pre>{{ columns }}</pre>
        </code>
      </div>
      <div class="column is-6">
        checkedRows :
        <code>
          <pre>{{ checkedRows }}</pre>
        </code>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

// import ViewModeBtns from '@/components/previews/ViewModeBtns'

import ButtonAddRow from '@/components/edition/csv/ButtonAddRow'
// import ButtonImportData from '@/components/edition/csv/ButtonImportData'
import ButtonSortBy from '@/components/sorting/ButtonSortBy'
import ButtonFilterBy from '@/components/filters/ButtonFilterBy'
import ButtonDeleteRows from '@/components/edition/csv/ButtonDeleteRows'

export default {
  name: 'EditCsvSkeleton',
  components: {
    // ViewModeBtns,
    ButtonAddRow,
    // ButtonImportData,
    ButtonSortBy,
    ButtonFilterBy,
    ButtonDeleteRows
  },
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    columns: {
      default: null,
      type: Array
    },
    checkedRows: {
      default: null,
      type: Array
    },
    isActiveTags: {
      default: null,
      type: Boolean
    },
    locale: {
      default: 'en',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    SendActionToParent (event) {
      // console.log('\nC > EditCsvSkeleton > SendActionToParent > event.action : ', event.action)
      this.$emit('action', event)
    }
  }
}
</script>
