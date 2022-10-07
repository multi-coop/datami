<template>
  <span class="PreviewTagValue">
    <!-- <code>{{ sharedDataIsLoaded }}</code> -->
    <!-- <pre><code>{{ field }}</code></pre> -->

    <!-- FOREIGN KEY TOOLTIP | MINI | ... -->
    <b-tooltip
      v-if="val === '...' || (field.foreignKey || field.definitions) || isMini"
      :active="showTag"
      always
      multilined
      append-to-body
      :animated="false"
      style="z-index: 1"
      size="is-large"
      :type=" `${isDarkMode ? 'is-white' : 'is-dark'}`">
      <template #content>
        <div
          v-if="val !== '...' && (field.foreignKey || field.definitions)"
          class="has-text-left">
          <!-- val: <code>{{ val }}</code><hr class="my-1"> -->
          <!-- <pre><code>{{ field.foreignKey }}</code></pre><br> -->
          <!-- <pre><code>{{ item }}</code></pre><hr> -->

          <!-- HELPER CURRENT VALUE -->
          <div class="divider mt-0 mb-4 has-text-grey">
            <b-icon
              :icon="getIconFieldType(field)"
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
                  {{ getValueDefinitionLabel(val) }}
                </p>
                <p
                  v-if="getValueDefinitionDescription(val)"
                  class="pt-2 is-italic">
                  {{ getValueDefinitionDescription(val) }}
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
              class="outlink"
              @click="trackLink(ressourceInfos.url)">
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

      <!-- TOOLTIP CONTENT (TAGS) -->
      <b-tag
        :class="`mr-2 mb-2 has-text-weight-bold tag-pointer`"
        :style="`${tagStyle}; z-index: 1;`"
        @mouseover.native="showTag = true"
        @mouseleave.native="showTag = false"
        @click.native="$emit('expand')">
        <span v-if="isMini">
          {{ trimText(val) }}
        </span>
        <span v-else>
          {{ val }}
        </span>
        <b-icon
          v-if="val !== '...' && (field.foreignKey || field.definitions)"
          icon="information-outline"
          size="is-small"
          class="ml-1"/>
      </b-tag>
    </b-tooltip>

    <!-- USUAL TAGS (NO TOOLTIP) -->
    <b-tag
      v-else
      :class="`mr-2 mb-2 has-text-weight-bold tag-pointer`"
      :style="tagStyle"
      @click.native="$emit('expand')">
      {{ val }}
    </b-tag>
  </span>
</template>

<script>

import {
  mixinGlobal,
  mixinIcons,
  mixinValue,
  mixinForeignKeys
} from '@/utils/mixins.js'

export default {
  name: 'PreviewTagValue',
  mixins: [
    mixinGlobal,
    mixinIcons,
    mixinValue,
    mixinForeignKeys
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    val: {
      default: false,
      type: [String, Boolean, Number]
    },
    tagStyle: {
      default: '',
      type: String
    },
    field: {
      default: null,
      type: Object
    },
    isMini: {
      default: false,
      type: Boolean
    },
    locale: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      showTag: false
    }
  },
  computed: {
    itemDirect () {
      return this.getForeignItem(this.field, this.val)
    }
  }
}
</script>

<style>
.PreviewTagValue > .b-tooltip > .tooltip-trigger {
  z-index: 1 !important;
}
.tag-pointer {
  cursor: pointer;
}
</style>

<style scoped>
.divider::after, .divider::before {
  background-color: grey !important;
}
</style>
