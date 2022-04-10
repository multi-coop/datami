<template>
  <div class="DialogAddRow container">
    <div class="columns is-vcentered is-centered">
      <div class="column is-9">
        <div class="card">
          <!-- HEADER -->
          <header class="card-header">
            <p class="card-header-title mb-0">
              <b-icon
                class="mr-3"
                :icon="icon"/>
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
              <div class="columns is-centered is-multiline mt-3">
                <!-- HEADER FIELD -->
                <div
                  v-for="header in headers"
                  :key="header.field"
                  class="column is-12 py-0">
                  <b-field horizontal>
                    <template #label>
                      {{ header.label }}
                    </template>
                    <b-input
                      v-model="temp[header.field]"
                      maxlength="50"
                      :placeholder="t('global.enterValue', locale)"
                      icon-right="close-circle"
                      icon-right-clickable
                      @icon-right-click="clearFieldValue(header.field)"/>
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
              :icon-left="icon"
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

import { mapGetters } from 'vuex'

export default {
  name: 'DialogAddRow',
  components: {
  },
  model: {
    prop: 'hidden',
    event: 'blur'
  },
  props: {
    hidden: {
      default: false,
      type: Boolean
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
      icon: 'plus-thick',
      temp: {}
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
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
    }
  }
}
</script>
