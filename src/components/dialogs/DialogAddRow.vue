<template>
  <div class="DialogAddRow datami-component card">
    <!-- HEADER -->
    <header class="card-header">
      <p class="card-header-title mb-0">
        <b-icon
          class="mr-3"
          icon="table-row-plus-after"/>
        {{ t('editCsv.addRow', locale) }}
      </p>
      <!-- <button
        class="card-header-icon"
        @click="closeDialog">
        <b-icon
          icon="close"/>
      </button> -->
    </header>

    <!-- NEW ROW VALUES -->
    <div class="card-content">
      <div class="content">
        <!-- DEBUG -->
        <div v-if="debug">
          fields : <pre><code>{{ fields }}</code></pre><br>
          <!-- temp : <pre><code>{{ temp }}</code></pre> -->
        </div>
        <div class="columns is-centered is-multiline mt-3">
          <!-- HEADER AND INPUT FIELDS -->
          <div
            v-for="f in fields"
            :key="f.field"
            class="column is-12 pb-3">
            <div class="columns">
              <!-- HEADER -->
              <div class="column is-6 has-text-weight-bold">
                <PreviewField
                  :file-id="fileId"
                  :field="f"
                  :lock-headers="true"
                  :locale="locale"/>
              </div>

              <!-- INPUT -->
              <div class="column is-6">
                <EditCell
                  :file-id="fileId"
                  :field="f"
                  :is-added="true"
                  :from-dialog="true"
                  :input-data="temp[f.field] || ''"
                  :locale="locale"
                  :is-card-view="false"
                  @updateTempValue="updateTemp"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BUTTONS FOOTER -->
    <footer class="card-footer px-2 py-4">
      <b-button
        class="card-footer-item mx-3"
        icon-left="close"
        type=""
        @click="closeDialog">
        {{ t('actions.cancel', locale) }}
      </b-button>
      <b-button
        class="card-footer-item mx-3"
        icon-left="plus-thick"
        type="is-dark"
        @click="confirmAddRow">
        {{ t('editCsv.addTheNewRow', locale) }}
      </b-button>
    </footer>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DialogAddRow',
  components: {
    PreviewField: () => import(/* webpackChunkName: "PreviewField" */ '@/components/previews/PreviewField.vue'),
    EditCell: () => import(/* webpackChunkName: "EditCell" */ '@/components/edition/csv/EditCell.vue')
  },
  mixins: [mixinGlobal],
  // model: {
  //   prop: 'hidden',
  //   event: 'blur'
  // },
  props: {
    // hidden: {
    //   default: false,
    //   type: Boolean
    // },
    fileId: {
      default: null,
      type: String
    },
    fields: {
      default: null,
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
      temp: {}
    }
  },
  watch: {
    fields (next) {
      next.forEach(f => {
        if (this.temp[f.field]) {
          this.temp[f.field] = null
        }
      })
    }
  },
  beforeMount () {
    this.fields.forEach(f => {
      this.temp[f.field] = null
    })
  },
  methods: {
    // handleInput (value) {
    //   this.$emit('blur', value)
    // },
    clearFieldValue (field) {
      this.temp[field] = null
    },
    closeDialog () {
      // this.handleInput(false)
      this.resetFileDialog()

      // track with matomo
      this.trackEvent('closeDialog')
    },
    updateTemp (event) {
      // console.log('\nC > DialogAddRow > updateTemp > event :', event)
      // console.log('C > DialogAddRow > updateTemp > this.temp :', this.temp)
      this.temp[event.colField] = event.val
    },
    confirmAddRow () {
      console.log('\nC > DialogAddRow > confirmAddRow > this.temp :', this.temp)
      const payload = {
        action: 'addNewRow',
        row: this.temp
      }
      // this.$emit('action', payload)
      this.addFileSignal('addNewRow', payload)
      this.closeDialog()
      this.temp = {}

      // track with matomo
      this.trackEvent('addNewRow')
    }
  }
}
</script>
