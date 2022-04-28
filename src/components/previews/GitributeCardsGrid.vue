<template>
  <div class="GitributeCardsGrid">
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-3">
        cardsSettings.originalHeaders: <br><pre><code>{{ cardsSettings.originalHeaders }}</code></pre>
      </div>
      <!-- <div class="column is-3">
        cardsSettings.editedHeaders: <br><pre><code>{{ cardsSettings.editedHeaders }}</code></pre>
      </div> -->
      <div class="column is-3">
        cardsSettings.settings: <br><pre><code>{{ cardsSettings.settings }}</code></pre>
      </div>
      <div class="column is-3">
        cardsSettings.mapping: <br><pre><code>{{ cardsSettings.mapping }}</code></pre>
      </div>
    </div>

    <!-- DISPLAY CARDS GRID -->
    <div
      v-show="!showDetail"
      class="columns is-multiline">
      <div
        v-for="item in items"
        :key="`item-card-${item.id}`"
        :class="`column is-${itemsPerRow === 3 ? 4 : 3}`">
        <GitributeCard
          :file-id="fileId"
          :fields="cardsSettings.originalHeaders"
          :field-mapping="mappingsForMini"
          :item="item"
          :show-detail="showDetail"
          :locale="locale"
          @toggleDetail="toggleDetail"
          @updateCellValue="emitUpdate"/>
      </div>
    </div>

    <!-- DISPLAY DETAILLED CARD -->
    <div
      v-if="showDetail && activeCardId"
      class="columns is-centered">
      <div
        :class="`column is-8`">
        <GitributeCard
          :file-id="fileId"
          :fields="cardsSettings.originalHeaders"
          :field-mapping="mappingsForDetail"
          :item="getDetailItem"
          :show-detail="showDetail"
          :locale="locale"
          @toggleDetail="toggleDetail"
          @updateCellValue="emitUpdate"/>
      </div>
    </div>
  </div>
</template>

<script>

import { mixinGlobal } from '@/utils/mixins.js'

import GitributeCard from '@/components/previews/GitributeCard'

export default {
  name: 'GitributeCardsGrid',
  components: {
    GitributeCard
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
    cardsSettings: {
      default: undefined,
      type: Object
    },
    items: {
      default: null,
      type: Array
    },
    itemsPerRow: {
      default: 3,
      type: Number
    },
    locale: {
      default: '',
      type: String
    },
    onlyPreview: {
      default: false,
      type: Boolean
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      showDetail: false,
      activeCardId: undefined
    }
  },
  computed: {
    mappingsForMini () {
      return this.cardsSettings.mapping.map(h => {
        return {
          field: h.field,
          ...h.mini
        }
      })
    },
    mappingsForDetail () {
      return this.cardsSettings.mapping.map(h => {
        return {
          field: h.field,
          ...h.detail
        }
      })
    },
    getDetailItem () {
      return this.items.find(item => item.id === this.activeCardId)
    }
  },
  methods: {
    handleInput (value) {
      this.$emit('blur', value)
    },
    toggleDetail (event) {
      console.log('\nC > GitributeCardsGrid > toggleDetail > event : ', event)
      if (this.showDetail) {
        this.showDetail = false
        this.activeCardId = undefined
        this.handleInput(false)
      } else {
        this.showDetail = true
        this.activeCardId = event
        this.handleInput(true)
      }
    },
    emitUpdate (event) {
      // console.log('\nC > GitributeCardsGrid > emitUpdate > event : ', event)
      this.$emit('updateCellValue', event)
    }
  }
}

</script>
