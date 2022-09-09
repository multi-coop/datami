<template>
  <div class="DatamiCardBlockImage datami-component">
    <p
      v-if="currentEditViewMode === 'edit'"
      class="is-size-7 has-text-weight-bold mb-2 is-uppercase">
      <!-- FIELD TYPE ICON -->
      <b-icon
        :icon="getIconFieldType(field)"
        :class="`${isDatamiField ? '' : 'ml-2 mr-2'}`"
        :type="`is-${ isPrimaryKey || isForeignKey ? 'dark' : 'grey-light'}`"
        size="is-small"/>
      {{ fieldLabel }}
    </p>

    <figure
      v-if="currentEditViewMode !== 'edit' && itemValue"
      class="image mx-0 image-wrapper is-flex is-align-items-center is-justify-content-center">
      <img
        :src="itemValue"
        class="image-constrained"
        :alt="`image-${itemId}`">
      <!-- <p v-if="currentEditViewMode !== 'edit' && !itemValue">
        {{ t('global.noValue', locale) }}
      </p> -->
    </figure>

    <div v-if="currentEditViewMode === 'edit'">
      <EditCell
        :file-id="fileId"
        :field="field"
        :col-field="field.field"
        :row-id="itemId"
        :is-added="itemAdded"
        :input-data="itemValue"
        :locale="locale"
        :is-card-view="true"
        @updateCellValue="emitUpdate"/>
    </div>

    <!-- NO IMAGE FOUND -->
    <article
      v-if="currentEditViewMode !== 'edit' && !itemValue"
      class="notification is-light image-wrapper is-flex is-align-items-center is-justify-content-center">
      <p class="subtitle py-4 has-text-centered">
        <b-icon
          icon="image-off-outline"
          size="is-small"/>
        <br>
        <span class="is-size-7">
          {{ t('preview.noIllustration', locale) }}
        </span>
      </p>
    </article>
  </div>
</template>

<script>
import { mixinGlobal, mixinValue, mixinIcons } from '@/utils/mixins.js'

// import PreviewCell from '@/components/previews/PreviewCell'
import EditCell from '@/components/edition/csv/EditCell'

export default {
  name: 'DatamiCardBlockImage',
  components: {
    // PreviewCell,
    EditCell
  },
  mixins: [
    mixinGlobal,
    mixinValue,
    mixinIcons
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    field: {
      default: undefined,
      type: Object
    },
    fieldLabel: {
      default: undefined,
      type: String
    },
    itemId: {
      default: undefined,
      type: [String, Number]
    },
    itemValue: {
      default: null,
      type: [String, Number, Object, Array]
    },
    isMini: {
      default: false,
      type: Boolean
    },
    locale: {
      default: '',
      type: String
    },
    // onlyPreview: {
    //   default: false,
    //   type: Boolean
    // },
    debug: {
      default: false,
      type: Boolean
    }
  }
  // beforeMount () {
  //   console.log('\nC > DatamiCardBlockImage > beforeMount > this.itemId :', this.itemId)
  //   console.log('C > DatamiCardBlockImage > beforeMount > this.field :', this.field)
  //   console.log('C > DatamiCardBlockImage > beforeMount > this.itemValue :', this.itemValue)
  // }
}
</script>
