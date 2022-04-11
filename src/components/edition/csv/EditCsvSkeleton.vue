<template>
  <div class="EditCsvSkeleton container">
    <div class="columns">
      <!-- EDIT BUTTONS -->
      <div
        v-if="view === 'edit'"
        :class="`column is-1 is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
        <ButtonAddRow
          :locale="locale"
          @action="SendActionToParent"/>
        <ButtonImportData
          :headers="columns"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
      <div
        :class="`column is-${view === 'edit' ? '4' : '4 is-offset-2'} is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
        <ButtonSortBy
          :headers="columns"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
      <div
        :class="`column is-${view === 'edit' ? '6' : '4'} is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
        <ButtonFilterBy
          :headers="columns"
          :is-active-tags="isActiveTags"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
      <div
        v-if="view === 'edit'"
        :class="`column is-1 is-flex is-flex-direction-row is-align-items-end is-justify-content-center`">
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

import ButtonAddRow from '@/components/edition/csv/ButtonAddRow'
import ButtonImportData from '@/components/edition/csv/ButtonImportData'
import ButtonSortBy from '@/components/sorting/ButtonSortBy'
import ButtonFilterBy from '@/components/filters/ButtonFilterBy'
import ButtonDeleteRows from '@/components/edition/csv/ButtonDeleteRows'

export default {
  name: 'EditCsvSkeleton',
  components: {
    ButtonAddRow,
    ButtonImportData,
    ButtonSortBy,
    ButtonFilterBy,
    ButtonDeleteRows
  },
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    view: {
      default: null,
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
