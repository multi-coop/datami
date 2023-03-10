<template>
  <div
    v-if="val !== '...' && (field.foreignKey || field.definitions)"
    class="has-text-left">
    <!-- val: <code>{{ val }}</code><hr class="my-1"> -->
    <!-- <pre><code>{{ field.foreignKey }}</code></pre><br> -->
    <!-- <pre><code>{{ item }}</code></pre><hr> -->

    <!-- HELPER CURRENT VALUE -->
    <div class="divider mt-0 mb-4 has-text-grey">
      <b-icon
        :icon="icon"
        class="mr-2"
        size="is-small"/>
      <span class="has-text-weight-bold no-text-transform">
        {{ t('global.value', locale) }}
      </span>
    </div>

    <!-- REPEAT VAL -->
    <div class="columns">
      <div class="column my-0 py-0 is-4 has-text-weight-bold">
        {{ trimText(field.name, 10) }}
      </div>
      <div class="column my-0 py-0 is-8">
        {{ val }}
      </div>
    </div>

    <!-- HELPER FOREIGN KEY -->
    <div class="divider mt-1 mb-4 has-text-grey">
      <b-icon
        icon="information-outline"
        class="mr-2"
        size="is-small"/>
      <span class="has-text-weight-bold no-text-transform">
        <span v-if="field.foreignKey">
          {{ t('field.ressourceValues', locale) }}
        </span>
        <span v-if="field.definitions">
          {{ t('field.definition', locale) }}
        </span>
      </span>
    </div>

    <!-- RETURN FIELDS / FOREIGN KEY-->
    <div v-if="field.foreignKey && Object.entries(itemDirect)">
      <div
        v-for="entry in Object.entries(itemDirect)"
        :key="`${entry[0]}`"
        class="columns pb-1">
        <div class="column is-4 my-0 py-0 has-text-weight-bold">
          {{ entry[0] }}
        </div>
        <div class="column is-8 my-0 py-0">
          {{ entry[1].split(',').join(', ') }}
        </div>
      </div>
    </div>

    <!-- RETURN FIELDS / DEFINITION -->
    <div v-if="field.definitions">
      <div class="columns pb-3">
        <div class="column is-4 my-0 py-0 has-text-weight-bold">
          {{ t('field.definition', locale) }}
        </div>
        <div class="column is-8 my-0 py-0">
          <p>
            {{ valDefLabel }}
          </p>
          <p
            v-if="valDefDescription"
            class="pt-2 is-italic">
            {{ valDefDescription }}
          </p>
        </div>
      </div>
    </div>

    <!-- LINK TO RESSOURCE -->
    <div
      v-if="field.foreignKey"
      class="divider mt-4 mb-1 has-text-grey">
      <b-icon
        icon="link"
        size="is-small"
        class="mr-2 pb-0 mb-0"/>
      <span class="has-text-weight-bold no-text-transform">
        {{ t('field.ressource', locale) }}
      </span>
    </div>
    <p class="px-2 pb-2 my-0 is-size-7 is-italic has-text-centered">
      <a
        style="color: grey; text-decoration: underline;"
        :href="ressourceInfos.url"
        target="_blank"
        class="outlink">
        {{ ressourceInfos.filename }}
      </a>
    </p>
  </div>

  <!-- SEE MORE BUTTON -->
  <div v-else-if="val === '...'">
    {{ t('actions.clickForMoreTags', locale) }}
  </div>
  <div v-else>
    {{ val }}
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import {
  trimText
} from '@/utils/globalUtils.js'

export default {
  name: 'DatamiTooltipTag',
  mixins: [
  ],
  props: {
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      tooltipOptions: (state) => state.tooltipOptions
    }),
    ...mapGetters({
      t: 'git-translations/getTranslation'
    }),
    field () {
      return this.tooltipOptions && this.tooltipOptions.field
    },
    val () {
      return this.tooltipOptions && this.tooltipOptions.value
    },
    icon () {
      return this.tooltipOptions && this.tooltipOptions.icon
    },
    valDefLabel () {
      return this.tooltipOptions && this.tooltipOptions.valDefLabel
    },
    valDefDescription () {
      return this.tooltipOptions && this.tooltipOptions.valDefDescription
    },
    ressourceInfos () {
      return this.tooltipOptions && this.tooltipOptions.ressourceInfos
    }
  },
  methods: {
    trimText
  }
}
</script>
