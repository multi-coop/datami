<template>
  <div class="GitributeTable content">
    <!-- TABLE -->
    <b-table
      :data="dataForView"
      narrowed
      hoverable
      sticky-header
      :checkable="view === 'edit'"
      :sticky-checkbox="view === 'edit'"
      :checked-rows.sync="checkedRows"
      striped>
      <!-- LOOP COLUMNS -->
      <!-- width="40" -->
      <!-- numeric -->
      <b-table-column
        v-for="col in columnsForView"
        :key="col.field"
        :field="col.field"
        :label="col.label">
        <template #header="{ column }">
          <div v-if="view === 'edit'">
            <b-field>
              <EditCell
                :is-header="true"
                :col-field="column.field"
                :input-data="column.label"
                @updateCellValue="emitUpdate"/>
            </b-field>
          </div>
          <div v-else>
            {{ column.label }}
          </div>
        </template>
        <template #default="props">
          <div
            v-if="false"
            class="mb-3">
            row: <code>{{ props.row }}</code><br>
            <code>row index</code>: <code>{{ props.index }}</code><br>
          </div>
          <div v-if="view === 'edit'">
            <b-field>
              <EditCell
                :is-header="false"
                :col-field="col.field"
                :row-index="props.index"
                :input-data="props.row[col.field]"
                @updateCellValue="emitUpdate"/>
            </b-field>
          </div>
          <div v-if="view === 'diff'">
            diff : {{ props.row[col.field] }}
          </div>
          <div v-if="view === 'preview'">
            {{ props.row[col.field] }}
          </div>
        </template>
      </b-table-column>
    </b-table>
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-6">
        <p>
          checkedRows:
          <br>
          <pre><code>{{ checkedRows }}</code></pre>
        </p>
      </div>
      <div class="column is-6">
        <p>
          fileOptions:
          <br>
          <pre><code>{{ fileOptions }}</code></pre>
        </p>
      </div>
      <div class="column is-3">
        <p>
          columns:
          <br>
          <pre><code>{{ columns }}</code></pre>
        </p>
      </div>
      <div class="column is-3">
        <p>
          data:
          <br>
          <pre><code>{{ data }}</code></pre>
        </p>
      </div>
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import EditCell from '@/components/edition/EditCell'

export default {
  name: 'GitributeTable',
  components: {
    EditCell
  },
  props: {
    fileId: {
      default: null,
      type: String
    },
    fileOptions: {
      default: undefined,
      type: Object
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
    view: {
      default: '',
      type: String
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
      checkedRows: []
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getGitInfosObj: 'getGitInfosObj'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    dataForView () {
      let data
      switch (this.view) {
        case 'edit':
          data = this.dataEdited
          break
        case 'diff':
          data = this.data
          break
        case 'preview':
          data = this.dataEdited
          break
      }
      return data
    },
    columnsForView () {
      let columns
      switch (this.view) {
        case 'edit':
          columns = this.columnsEdited
          break
        case 'diff':
          columns = this.columns
          break
        case 'preview':
          columns = this.columnsEdited
          break
      }
      return columns
    }
  },
  methods: {
    emitUpdate (event) {
      // console.log('C > GitributeTable > emitUpdate > event : ', event)
      this.$emit('updateEdited', event)
    }
  }
}
</script>
