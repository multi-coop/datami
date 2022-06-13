<template>
  <div class="PreviewConsolidation">
    <!-- ACTION BUTTON -->
    <article class="media">
      <div class="media-left gitribute-selection pt-1 has-text-centered">
        <b-icon
          icon="wrench"
          type="is-dark"/>
      </div>
      <div class="media-content">
        <div class="content has-text-weight-bold">
          {{ t('actions.selectConsolidationFields', locale) }}
        </div>
      </div>
    </article>

    <!-- RESPONSE VALUES -->
    <article
      v-for="cData in activeConsolidationItems"
      :key="cData.toField.field"
      class="media">
      <div class="media-left gitribute-selection">
        <div class="content">
          <!-- DEBUGGING -->
          <div
            v-if="debug"
            class="">
            cData : <pre><code>{{ cData }}</code></pre><br>
          </div>
          <!-- SELECTION x CHECKBOX -->
          <b-checkbox
            v-model="checkboxGroup"
            :native-value="cData.toField.field"
            type="is-dark">
            <code>{{ cData.toField.name }}</code>
          </b-checkbox>
        </div>
      </div>

      <!-- VALUES -->
      <div class="media-content">
        <div class="content">
          <!-- DEBUGGING -->
          <p v-if="debug">
            cData.toField: <code>{{ cData.toField }}</code>
          </p>
          <p class="mb-1">
            {{ t('global.oldValue', locale) }}: <code>{{ oldValue(cData.toField.field) }}</code>
          </p>
          <p>
            {{ t('global.newValue', locale) }}: <code>{{ cData.newValue }}</code>
          </p>
        </div>
      </div>
    </article>

    <!-- ACTION BUTTON -->
    <article class="media">
      <div class="media-left gitribute-selection pt-1">
        <div class="content">
          <b-button
            icon-left="close"
            type="is-dark"
            class="mr-3"
            outlined
            expanded
            @click="cancelConsolidation">
            {{ t('actions.cancel', locale) }}
          </b-button>
        </div>
      </div>
      <div class="media-content">
        <div class="content">
          <b-button
            :disabled="!hasSelection"
            icon-left="wrench"
            type="is-dark"
            @click="updateValues">
            {{ t('actions.validateConsolidation', locale) }}
          </b-button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>

import { mixinGlobal, mixinValue } from '@/utils/mixins.js'

export default {
  name: 'PreviewConsolidation',
  mixins: [
    mixinGlobal,
    mixinValue
  ],
  props: {
    rowData: {
      default: null,
      type: Object
    },
    consolidationData: {
      default: null,
      type: Object
    },
    locale: {
      default: null,
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      checkboxGroup: []
    }
  },
  computed: {
    activeConsolidationItems () {
      return this.consolidationData.consolidation.filter(cd => !!cd.toField)
    },
    hasSelection () {
      return this.checkboxGroup.length
    }
  },
  methods: {
    oldValue (fieldId) {
      return this.rowData[fieldId]
    },
    cancelConsolidation () {
      // console.log('\nC > PreviewConsolidation > cancelConsolidation > this.checkboxGroup :', this.checkboxGroup)
      // console.log('C > PreviewConsolidation > cancelConsolidation > this.consolidationData :', this.consolidationData)
      const payload = {
        action: 'cancelConsolidation',
        rowId: this.consolidationData.rowId
      }
      this.SendActionToParent(payload)
    },
    updateValues () {
      console.log('\nC > PreviewConsolidation > updateValues > this.checkboxGroup :', this.checkboxGroup)
      console.log('C > PreviewConsolidation > updateValues > this.consolidationData :', this.consolidationData)
      if (this.hasSelection) {
        const newValues = this.checkboxGroup.map(id => {
          const consolidationData = this.consolidationData.consolidation.find(c => c.toField.field === id)
          return {
            id: this.consolidationData.rowId,
            colField: consolidationData.toField.field,
            val: consolidationData.newValue
          }
        })
        const payload = {
          action: 'mergeConsolidation',
          rowId: this.consolidationData.rowId,
          newValues: newValues
        }
        this.SendActionToParent(payload)
      }
    },
    SendActionToParent (payload) {
      // console.log('\nC > PreviewConsolidation > SendActionToParent > payload : ', payload)
      this.$emit('action', payload)
    }
  }
}
</script>

<style scoped>
.gitribute-selection {
  min-width: 150px;
}
</style>
