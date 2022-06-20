<template>
  <div class="PreviewField">
    <!-- FIELD LABEL + INFOS -->
    <b-tooltip
      position="is-top"
      multilined
      append-to-body
      type="is-dark">
      <!-- FIELD TYPE ICON -->
      <b-icon
        :icon="getIconFieldType( field )"
        :class="`${isGitributeField ? '' : 'ml-2 mr-2'}`"
        type="is-grey-light"
        size="is-small"/>

      <!-- FIELD LABEL -->
      <span
        v-if="isGitributeField"
        class="mr-3">
        <!-- {{ t(field.label, locale) }} -->
      </span>
      <span
        v-else
        class="mr-3">
        {{ field.label }}
      </span>

      <!-- TOOLTIP -->
      <template #content>
        <div class="columns is-multiline px-2 py-2">
          <!-- LABEL -->
          <div class="column is-4 py-1 px-1 is-italic">
            {{ t('field.label', locale) }}
          </div>
          <div class="column is-8 py-1 px-1 has-text-weight-bold">
            <span v-if="!isGitributeField">
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
              type="is-grey-light"
              size="is-small"/>
            {{ t(`field.${field.type}`, locale) }}
            {{ field.subtype ? '(' + t(`field.${field.subtype}`, locale) + ')' : '' }}
          </div>

          <!-- TITLE -->
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
        </div>
      </template>
    </b-tooltip>

    <!-- LOCKED OR NOT -->
    <b-tooltip
      v-if="lockHeaders && currentEditViewMode !== 'preview' && !isGitributeField"
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
import { mixinGlobal, mixinIcons, mixinValue } from '@/utils/mixins.js'

export default {
  name: 'PreviewField',
  mixins: [
    mixinGlobal,
    mixinIcons,
    mixinValue
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
