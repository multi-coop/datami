<template>
  <div class="DatamiCardsGrid datami-component">
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <!-- <div class="column is-3">
        cardsSettings.originalHeaders: <br><pre><code>{{ cardsSettings.originalHeaders }}</code></pre>
      </div> -->
      <!-- <div class="column is-3">
        cardsSettings.editedHeaders: <br><pre><code>{{ cardsSettings.editedHeaders }}</code></pre>
      </div> -->
      <!-- <div class="column is-3">
        cardsSettings.settings: <br><pre><code>{{ cardsSettings.settings }}</code></pre>
      </div> -->
      <!-- <div class="column is-3">
        cardsSettings.mapping: <br><pre><code>{{ cardsSettings.mapping }}</code></pre>
      </div> -->
    </div>

    <!-- DISPLAY CARDS GRID -->
    <div
      v-show="!showDetail"
      class="columns is-multiline">
      <div
        v-for="(item, idx) in items"
        :key="`item-card-${idx}-${item.id}`"
        :class="`column is-12-mobile is-6-tablet is-${itemsPerRow === 3 ? '4' : '3'}-desktop`">
        <DatamiCard
          :file-id="fileId"
          :fields="cardsSettings.originalHeaders"
          :field-mapping="mappingsForMini"
          :item="item"
          :show-detail="false"
          :show-detail-card="showDetail"
          :locale="locale"
          :is-mini="true"
          @toggleDetail="toggleDetail"
          @action="SendActionToParent"
          @updateCellValue="emitUpdate"/>
      </div>
    </div>

    <!-- DISPLAY DETAILLED CARD -->
    <!-- <div
      v-show="showDetail && activeCardId"
      class="columns is-centered">
      <div
        :class="`column is-10`">
        <DatamiCard
          :file-id="fileId"
          :fields="cardsSettings.originalHeaders"
          :field-mapping="mappingsForDetail"
          :item="getDetailItem"
          :show-detail="true"
          :show-detail-card="showDetail"
          :locale="locale"
          @toggleDetail="toggleDetail"
          @action="SendActionToParent"
          @updateCellValue="emitUpdate"/>
      </div>
    </div> -->
  </div>
</template>

<script>

import {
  mixinGlobal
  // mixinsCards
} from '@/utils/mixins.js'

// import DatamiCard from '@/components/previews/cards/DatamiCard'

export default {
  name: 'DatamiCardsGrid',
  components: {
    // DatamiCard
    DatamiCard: () => import(/* webpackChunkName: "DatamiCard" */ '@/components/previews/cards/DatamiCard.vue')
  },
  mixins: [
    mixinGlobal
    // mixinsCards
  ],
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
    mappingsForMini: {
      default: undefined,
      type: Array
    },
    mappingsForDetail: {
      default: undefined,
      type: Array
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
      // cssFiles: [
      //   'styles/components/previews/cards/datami-cards.css'
      // ],
      showDetail: false,
      activeCardId: undefined
    }
  },
  computed: {
    getDetailItem () {
      return this.items.find(item => item.id === this.activeCardId)
    }
  },
  methods: {
    // handleInput (value) {
    //   this.$emit('blur', value)
    // },
    toggleDetail (event) {
      // console.log('\nC > DatamiCardsGrid > toggleDetail > event : ', event)
      // if (event.showDetail) {
      //   this.showDetail = false
      //   this.activeCardId = undefined
      //   // this.handleInput(false)
      // } else {
      //   this.showDetail = true
      //   this.activeCardId = event.itemId
      //   // this.handleInput(true)
      // }
      this.$emit('toggleDetail', event)
    },
    emitUpdate (event) {
      // console.log('\nC > DatamiCardsGrid > emitUpdate > event : ', event)
      this.$emit('updateCellValue', event)
    },
    SendActionToParent (event) {
      this.$emit('action', event)
    }
  }
}

</script>
