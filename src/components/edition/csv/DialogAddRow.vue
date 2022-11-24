<template>
  <div class="DialogAddRow datami-component container">
    <div class="columns is-vcentered is-centered">
      <div class="column is-9">
        <div class="card">
          <!-- HEADER -->
          <header class="card-header">
            <p class="card-header-title mb-0">
              <b-icon
                class="mr-3"
                icon="table-row-plus-after"/>
              {{ t('editCsv.addRow', locale) }}
            </p>
            <button
              class="card-header-icon"
              @click="closeDialog">
              <b-icon
                icon="close"/>
            </button>
          </header>

          <!-- NEW ROW VALUES -->
          <div class="card-content">
            <div class="content">
              <!-- DEBUG -->
              <div v-if="debug">
                temp : <pre><code>{{ temp }}</code></pre>
              </div>
              <div class="columns is-centered is-multiline mt-3">
                <!-- HEADER AND INPUT FIELDS -->
                <div
                  v-for="header in headers"
                  :key="header.field"
                  class="column is-12 pb-3">
                  <div class="columns">
                    <!-- HEADER -->
                    <div class="column is-5 has-text-weight-bold">
                      <PreviewField
                        :file-id="fileId"
                        :field="header"
                        :lock-headers="true"
                        :locale="locale"/>
                    </div>

                    <!-- INPUT -->
                    <div class="column is-7">
                      <EditCell
                        :file-id="fileId"
                        :field="header"
                        :is-added="true"
                        :input-data="temp[header.field] || ''"
                        :locale="locale"
                        :is-card-view="false"
                        @updateCellValue="updateTemp"/>
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
              @click="sendNewRowToParent">
              {{ t('editCsv.addTheNewRow', locale) }}
            </b-button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

import PreviewField from '@/components/previews/PreviewField'
import EditCell from '@/components/edition/csv/EditCell'

export default {
  name: 'DialogAddRow',
  components: {
    PreviewField,
    EditCell
  },
  mixins: [mixinGlobal],
  model: {
    prop: 'hidden',
    event: 'blur'
  },
  props: {
    hidden: {
      default: false,
      type: Boolean
    },
    fileId: {
      default: null,
      type: String
    },
    headers: {
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
    headers (next) {
      next.forEach(header => {
        if (this.temp[header.field]) {
          this.temp[header.field] = null
        }
      })
    }
  },
  beforeMount () {
    this.headers.forEach(h => {
      this.temp[h.field] = null
    })
  },
  methods: {
    handleInput (value) {
      this.$emit('blur', value)
    },
    clearFieldValue (field) {
      this.temp[field] = null
    },
    closeDialog () {
      this.handleInput(false)

      // track with matomo
      this.trackEvent('closeDialog')
    },
    updateTemp (event) {
      // console.log('\nC > DialogAddRow > updateTemp > event :', event)
      // console.log('C > DialogAddRow > updateTemp > this.temp :', this.temp)
      this.temp[event.colField] = event.val
    },
    sendNewRowToParent () {
      console.log('\nC > DialogAddRow > sendNewRowToParent > this.temp :', this.temp)
      const payload = {
        action: 'addNewRow',
        row: this.temp
      }
      this.$emit('action', payload)
      this.closeDialog()
      this.temp = {}

      // track with matomo
      this.trackEvent('addNewRow')
    }
  }
}
</script>
