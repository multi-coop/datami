<template>
  <div class="DialogAddColumn datami-component container">
    <div class="columns is-vcentered is-centered">
      <div class="column is-9">
        <div class="card">
          <!-- HEADER -->
          <header class="card-header">
            <p class="card-header-title mb-0">
              <b-icon
                class="mr-3"
                icon="table-column-plus-after"/>
              {{ t('editCsv.addColumn', locale) }}
            </p>
            <button
              class="card-header-icon"
              @click="closeDialog">
              <b-icon
                icon="close"/>
            </button>
          </header>

          <!-- NEW COLUMN VALUES -->
          <div class="card-content">
            <div class="content">
              <div class="is-12"/>
              <div class="columns is-centered is-multiline mt-3">
                <!-- HEADER FIELD -->
                <div  class="column is-12 py-0">
                  <b-field
                    horizontal>
                    <template #label>
                      Nom de la nouvelle colonne
                    </template>
                    <b-input
                      class="input-value"
                      v-model="temp"
                      maxlength="100"
                      :placeholder="t('global.enterValue', locale)"
                      icon-right="close-circle"
                      icon-right-clickable
                      @icon-right-click="clearFieldValue"/>
                  </b-field>
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
              @click="sendNewColumnToParent">
              {{ t('editCsv.addTheNewColumn', locale) }}
            </b-button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DialogAddColumn',
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
      temp: ''
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
    clearFieldValue () {
      this.temp = ''
    },
    closeDialog () {
      this.handleInput(false)

      // track with matomo
      this.trackEvent('closeDialog')
    },
    sendNewColumnToParent () {
      console.log('\nC > DialogAddColumn > sendNewColumnToParent > this.temp :', this.temp)
      const payload = {
        action: 'addNewColumn',
        column: this.temp
      }
      this.$emit('action', payload)
      this.closeDialog()
      this.temp = {}

      // track with matomo
      this.trackEvent('addNewColumn')
    }
  }
}
</script>
