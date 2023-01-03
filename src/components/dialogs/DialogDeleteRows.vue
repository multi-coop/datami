<template>
  <div class="DialogDeleteRow datami-component container card">
    <!-- CARD HEADER -->
    <header class="card-header">
      <p class="card-header-title mb-0">
        <b-icon
          class="mr-3"
          :icon="icon"/>
        {{ t(`editCsv.${getTootlipLabel}`, locale) }}
      </p>
      <button
        class="card-header-icon"
        @click="closeDialog">
        <b-icon
          icon="close"/>
      </button>
    </header>

    <!-- ROWS TO DELETE / ROW VALUES -->
    <div class="card-content">
      <div class="content my-4">
        <b-table
          :data="checkedRows"
          :columns="fields"
          narrowed
          sticky-headers
          striped/>
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
        @click="sendRowToDeleteToParent">
        {{ t(`editCsv.${getTootlipLabel}`, locale) }}
      </b-button>
    </footer>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DialogDeleteRow',
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
    checkedRows: {
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
      icon: 'trash-can'
    }
  },
  computed: {
    getTootlipLabel () {
      let str
      const checkedRowsLength = this.checkedRows.length
      if (!checkedRowsLength) str = 'deleteARow'
      if (checkedRowsLength === 1) str = 'deleteRow'
      if (checkedRowsLength > 1) str = 'deleteRows'
      return str
    }
  },
  watch: {
    fields (next) {
      next.forEach(f => {
        // if (this.temp[f.field]) {
        //   this.temp[f.field] = null
        // }
      })
    }
  },
  methods: {
    // handleInput (value) {
    //   this.$emit('blur', value)
    // },
    closeDialog () {
      // this.handleInput(false)
      this.resetFileDialog()

      // track with matomo
      this.trackEvent('closeDialog')
    },
    sendRowToDeleteToParent () {
      // console.log('\nC > DialogDeleteRow > sendRowToDeleteToParent > this.temp :', this.temp)
      const payload = {
        action: 'deleteRows',
        rows: this.checkedRows
      }
      this.addFileSignal('deleteRows', payload)
      // this.$emit('action', payload)
      this.closeDialog()

      // track with matomo
      this.trackEvent('deleteRows')
    }
  }
}
</script>
