<template>
  <div class="PreviewConsolidation">
    <!-- ACTION BUTTON -->
    <article class="media">
      <div class="media-left datami-selection pt-1 has-text-centered">
        <b-icon
          icon="wrench"
          type="is-dark"/>
        <!-- DEBUGGING -->
        <div
          v-if="debug"
          class="has-text-left">
          consolidationData : <pre><code>{{ consolidationData }}</code></pre><br>
        </div>
      </div>
      <div class="media-content">
        <div class="content">
          <p class="has-text-weight-bold mb-3">
            <span class="mr-2">
              {{ t('consolidation.consolidationApi', locale) }}
            </span>
            <!-- API NAME + TOOLTIP -->
            <b-tooltip
              multilined
              append-to-body
              position="is-right"
              size="is-large"
              type="is-dark">
              <template #content>
                <!-- SOURCE FIELDS -->
                <div class="divider mt-1 mb-2 has-text-white no-text-transform">
                  {{ t('field.consolidation', locale) }}
                </div>
                <p class="has-text-left mb-1 has-text-weight-bold is-italic">
                  {{ t('consolidation.sourceFields', locale) }}
                </p>
                <div
                  v-for="srcField in consolidationData.sourceFields"
                  :key="srcField.name"
                  class="columns my-0 has-text-left">
                  <div class="column is-4 mb-1 has-text-weight-bold mr-3">
                    {{ srcField.name }}
                  </div>
                  <div class="column is-8 mb-1">
                    <code>{{ srcField.value }}</code>
                  </div>
                </div>
                <!-- API FORMAT -->
                <div class="divider my-2">
                  <b-icon
                    icon="wrench"
                    type="is-white"
                    size="is-small"/>
                </div>
                <p class="has-text-left mb-1 has-text-weight-bold is-italic">
                  <span>
                    {{ t('consolidation.apiFormat', locale) }}
                  </span>
                </p>
                <p class="has-text-left mb-2">
                  {{ consolidationData.api }}
                </p>
              </template>
              <span>
                <code>{{ consolidationData.apiName }}</code>
                <b-icon
                  icon="information-outline"
                  size="is-small"/>
              </span>
            </b-tooltip>
          </p>
          <!-- CALL TO ACTION -->
          <p class="is-italic has-text-grey mb-3">
            <b-icon
              icon="checkbox-marked"
              class="mr-2"
              size="is-small"/>
            {{ t('actions.selectConsolidationFields', locale) }}
          </p>
        </div>
      </div>
    </article>

    <!-- RESPONSE VALUES -->
    <article
      v-for="cData in activeConsolidationItems"
      :key="cData.toField.field"
      class="media pt-2 mt-2">
      <div class="media-left datami-selection">
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
            <span class="has-text-weight-bold">
              <b-icon
                :icon="getIconFieldType(cData.toField)"
                class="ml-1 mr-2"
                type="is-grey-light"
                size="is-small"/>
              {{ cData.toField.name }}
            </span>
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
            {{ t('global.oldValue', locale) }}:
            <code class="has-text-grey">
              {{ oldValue(cData.toField.field) }}
            </code>
          </p>
          <p>
            {{ t('global.newValue', locale) }}:
            <code>
              {{ cData.newValue }}
            </code>
          </p>
        </div>
      </div>
    </article>

    <!-- ACTION BUTTONS -->
    <article class="media mb-4">
      <div class="media-left datami-selection">
        <div class="content">
          <b-button
            class="mr-3"
            icon-left="close"
            type="is-dark"
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
            class="mt-0"
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

import { mixinGlobal, mixinValue, mixinIcons } from '@/utils/mixins.js'

export default {
  name: 'PreviewConsolidation',
  mixins: [
    mixinGlobal,
    mixinValue,
    mixinIcons
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
      // console.log('\nC > PreviewConsolidation > updateValues > this.checkboxGroup :', this.checkboxGroup)
      // console.log('C > PreviewConsolidation > updateValues > this.consolidationData :', this.consolidationData)
      if (this.hasSelection) {
        const newValues = this.checkboxGroup.map(id => {
          const consolidationData = this.consolidationData.consolidation.find(c => c.toField && c.toField.field === id)
          return {
            id: this.consolidationData.rowId,
            colField: consolidationData.toField.field,
            val: consolidationData.newValue
          }
        })
        // console.log('C > PreviewConsolidation > updateValues > newValues :', newValues)
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
/* .datami-selection {
  min-width: 150px;
} */
</style>
