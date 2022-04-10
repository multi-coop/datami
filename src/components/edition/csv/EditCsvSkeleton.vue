<template>
  <div class="EditCsvSkeleton container">
    <div class="columns">
      <!-- EDIT BUTTONS -->
      <div
        v-if="view === 'edit'"
        :class="`column is-1 is-flex is-flex-direction-row is-align-items-center is-justify-content-left`">
        <ButtonAddRow
          :locale="locale"
          @action="SendActionToParent"/>
        <ButtonImportData
          :headers="columns"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
      <div
        :class="`column is-${view === 'edit' ? '10' : 'full'} is-flex is-flex-direction-row is-align-items-center is-justify-content-center`">
        <ButtonSortBy
          :headers="columns"
          :locale="locale"
          @action="SendActionToParent"/>
        <ButtonFilterBy
          :headers="columns"
          :locale="locale"
          @action="SendActionToParent"/>
      </div>
      <div
        v-if="view === 'edit'"
        :class="`column is-1 is-flex is-flex-direction-row is-align-items-center is-justify-content-right`">
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
import ButtonSortBy from '@/components/edition/csv/ButtonSortBy'
import ButtonFilterBy from '@/components/edition/csv/ButtonFilterBy'
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
    locale: {
      default: 'en',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    SendActionToParent (event) {
      // console.log('\nC > EditCsvSkeleton > SendActionToParent > event.action : ', event.action)
      this.$emit('action', event)
    }
  }
}
</script>
