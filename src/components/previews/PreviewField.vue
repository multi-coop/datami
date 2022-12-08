<template>
  <div class="PreviewField">
    <!-- FIELD LABEL + INFOS -->
    <!-- :auto-close="isForeignKey ? ['outside', 'escape'] : true" -->
    <!-- :auto-close="isForeignKey ? ['inside', 'outside', 'escape'] : true" -->
    <!-- :triggers="isForeignKey ? ['contextmenu', 'hover'] : ['hover']" -->
    <!-- :triggers="isForeignKey ? ['click', 'hover'] : ['hover']" -->
    <!-- :auto-close="isForeignKey ? ['inside', 'outside', 'escape'] : true" -->
    <b-tooltip
      position="is-top"
      multilined
      append-to-body
      :animated="false"
      size="is-large"
      :type="`${isDarkMode ? 'is-white' : 'is-dark'}`">
      <span style="cursor: pointer;">

        <!-- FIELD TYPE ICON -->
        <b-icon
          :icon="getIconFieldType(field)"
          :class="`${isDatamiField ? '' : 'ml-2 mr-2'}`"
          :type="`is-${ isPrimaryKey || isForeignKey ? 'dark' : 'grey-light'}`"
          size="is-small"/>

        <!-- FIELD LABEL FOR isDatamiField -->
        <span
          v-if="isDatamiField"
          class="mr-2">
          <!-- {{ t(field.label, locale) }} -->
        </span>

        <!-- FIELD LABEL -->
        <span
          v-else
          :class="`mr-2`">
          {{ field.label }}
        </span>

        <!-- PRIMARY KEY -->
        <b-icon
          v-if="isPrimaryKey"
          icon="key"
          :class="`ml-0 mr-3`"
          type="is-dark"
          size="is-small"/>

        <!-- FOREIGN KEY -->
        <b-icon
          v-if="isForeignKey"
          icon="link"
          :class="`ml-0 mr-3`"
          type="is-dark"
          size="is-small"/>
      </span>

      <!-- TOOLTIP -->
      <template #content>
        <div class="columns is-multiline px-2 py-2">
          <!-- PRIMARY KEY / DIVIDER -->
          <div
            v-if="isPrimaryKey"
            class="column is-full my-0 py-0">
            <div class="divider my-0">
              <b-icon
                icon="key"
                class="mr-2"
                type="is-white"/>
              <span class="has-text-weight-bold has-text-white no-text-transform">
                {{ t('field.primaryKey', locale) }}
              </span>
            </div>
          </div>

          <!-- FOREIGN KEY / DIVIDER -->
          <div
            v-if="isForeignKey"
            class="column is-full my-0 py-0">
            <div class="divider my-0">
              <b-icon
                icon="link"
                class="mr-2"
                type="is-white"/>
              <span class="has-text-weight-bold has-text-white no-text-transform">
                {{ t('field.foreignKey', locale) }}
              </span>
            </div>
          </div>

          <!-- LABEL -->
          <div class="column is-4 py-1 px-1 is-italic">
            {{ t('field.label', locale) }}
          </div>
          <div class="column is-8 py-1 px-1 has-text-weight-bold">
            <span v-if="!isDatamiField">
              {{ field.label }}
            </span>
            <span v-else>
              {{ t(field.label, locale) }}
            </span>
          </div>

          <!-- TYPE -->
          <div class="column is-4 py-1 px-1 is-italic">
            {{ t('field.type', locale) }}
          </div>
          <div class="column is-8 py-1 px-1 is-italic">
            <b-icon
              :icon="getIconFieldType( field )"
              class="ml-0 mr-1"
              type="is-white"
              size="is-small"/>
            {{ t(`field.${field.type}`, locale) }}
            {{ field.subtype ? '(' + t(`field.${field.subtype}`, locale) + ')' : '' }}
          </div>

          <!-- CATEGORY -->
          <div
            v-if="isCategory"
            class="column is-4 py-1 px-1 is-italic">
            {{ t('field.category', locale) }}
          </div>
          <div
            v-if="isCategory"
            class="column is-8 py-1 px-1">
            {{ t('global.yes', locale) }}
          </div>

          <!-- TITLE -->
          <div
            v-if="field.title"
            class="column is-4 py-1 px-1 is-italic">
            {{ t('field.title', locale) }}
          </div>
          <div
            v-if="field.title"
            class="column is-8 py-1 px-1">
            {{ field.title }}
          </div>

          <!-- DESCRIPTION -->
          <div
            v-if="field.description"
            class="column is-4 pt-1 pb-2 px-1 is-italic">
            {{ t('field.description', locale) }}
          </div>
          <div
            v-if="field.description"
            class="column is-8 pt-1 pb-2 pl-3 pr-1 has-text-left">
            {{ field.description }}
          </div>

          <!-- FOREIGN KEY -->
          <div
            v-if="isForeignKey"
            class="column is-4 pt-0 pb-1 px-1 is-italic">
            {{ t('field.ressource', locale) }}
          </div>
          <div
            v-if="isForeignKey"
            class="column is-8 pt-0 pb-1 px-1">
            <a
              class="is-size-7 outlink"
              style="color: white; text-decoration: underline;"
              :href="ressourceInfos.url"
              target="_blank"
              @click="trackLink(ressourceInfos.url)">
              {{ ressourceInfos.filename }}
            </a>
            <!-- DEBUGGING -->
            <!-- <pre><code>{{ fieldForeignKey }}</code></pre> -->
          </div>
        </div>
      </template>
    </b-tooltip>

    <!-- LOCKED OR NOT -->
    <b-tooltip
      v-if="lockHeaders && currentEditViewMode !== 'preview' && !isDatamiField"
      :label="t('edit.headerLocked', locale)"
      position="is-top"
      multilined
      append-to-body
      type="is-dark">
      <b-icon
        class="mr-3"
        size="is-small"
        type="is-grey-light"
        icon="lock"/>
    </b-tooltip>
  </div>
</template>

<script>
import {
  mixinGlobal,
  mixinIcons,
  mixinValue,
  mixinForeignKeys
} from '@/utils/mixins.js'

export default {
  name: 'PreviewField',
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
    field: {
      default: null,
      type: Object
    },
    lockHeaders: {
      default: false,
      type: Boolean
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  }
}
</script>
