<template>
  <div
    class="GitributeCard card">
    <!-- HEADER -->
    <header class="card-header">
      <!-- TITLE BLOCK -->
      <p
        v-if="hasContentByPosition('title')"
        class="card-header-title mb-0 is-4">
        <span
          v-for="(f, i) in getFieldsByPosition('title')"
          :key="`title-${i}-${f.field}`"
          class="mr-1">
          <div v-if="currentEditViewMode === 'preview'">
            {{ item[f.field] }}
          </div>
          <div v-else>
            <EditCell
              :col-field="f.field"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field]"
              @updateCellValue="emitUpdate"/>
          </div>
        </span>
      </p>
      <button
        class="card-header-icon"
        @click="toggleDetail">
        <b-tooltip
          :label="t(`preview.${showDetail ? 'closeCardDetails' : 'showCardDetails'}`, locale)"
          type="is-dark"
          position="is-right">
          <b-icon
            size="is-small"
            :icon="showDetail ? 'close' : 'arrow-top-right-bottom-left'"/>
        </b-tooltip>
      </button>
    </header>

    <!-- IMAGE BLOCK -->
    <div
      v-if="hasContentByPosition('image')"
      class="card-image">
      <figure
        v-for="(f, i) in getFieldsByPosition('image')"
        :key="`image-${i}-${f.field}`"
        class="image mx-0">
        <img
          :src="item[f.field]"
          :alt="key">
      </figure>
    </div>

    <!-- CONTENT -->
    <div class="card-content">
      <!-- <pre><code>{{ item }}</code></pre> -->
      <!-- <pre><code>{{ fieldMapping }}</code></pre> -->
      <div class="media">
        <div class="media-content">
          <!-- TITLE BLOCK
          <p
            v-if="hasContentByPosition('title')"
            class="title is-4">
            <span
              v-for="(f, i) in getFieldsByPosition('title')"
              :key="`title-${i}-${f.field}`">
              <div v-if="currentEditViewMode === 'preview'">
                {{ item[f.field] }}
              </div>
              <div v-else>
                <EditCell
                  :col-field="f.field"
                  :row-id="item.id"
                  :is-added="item.added"
                  :input-data="item[f.field]"
                  @updateCellValue="emitUpdate"/>
              </div>
            </span>
          </p> -->

          <!-- SUBTITLE BLOCK -->
          <p
            v-if="hasContentByPosition('subtitle')"
            class="subtitle is-6">
            <span
              v-for="(f, i) in getFieldsByPosition('subtitle')"
              :key="`subtitle-${i}-${f.field}`"
              class="mr-1">
              <div v-if="currentEditViewMode === 'preview'">
                {{ item[f.field] }}
              </div>
              <div v-else>
                <EditCell
                  :col-field="f.field"
                  :row-id="item.id"
                  :is-added="item.added"
                  :input-data="item[f.field]"
                  @updateCellValue="emitUpdate"/>
              </div>
            </span>
          </p>
        </div>
      </div>

      <!-- RESUME BLOCK -->
      <div
        v-if="hasContentByPosition('resume')"
        class="content">
        <span
          v-for="(f, i) in getFieldsByPosition('resume')"
          :key="`resume-${i}-${f.field}`"
          class="mr-1">
          <div v-if="currentEditViewMode === 'preview'">
            {{ item[f.field] }}
          </div>
          <div v-else>
            <EditCell
              :col-field="f.field"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field]"
              @updateCellValue="emitUpdate"/>
          </div>
        </span>
        <span
          v-for="(f, i) in getFieldsByPosition('description')"
          :key="`description-${i}-${f.field}`"
          class="mr-1">
          <div v-if="currentEditViewMode === 'preview'">
            {{ item[f.field] }}
          </div>
          <div v-else>
            <EditCell
              :col-field="f.field"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field]"
              @updateCellValue="emitUpdate"/>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import { mixinGlobal } from '@/utils/mixins.js'

import EditCell from '@/components/edition/csv/EditCell'

export default {
  name: 'GitributeCard',
  components: {
    EditCell
  },
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    item: {
      default: null,
      type: Object
    },
    fieldMapping: {
      default: null,
      type: Array
    },
    showDetail: {
      default: false,
      type: Boolean
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
  methods: {
    getFieldsByPosition (position) {
      return this.fieldMapping.filter(f => f.position === position)
    },
    hasContentByPosition (position) {
      const fields = this.getFieldsByPosition(position)
      return fields && fields.length > 0
    },
    toggleDetail () {
      this.$emit('toggleDetail', this.item.id)
    },
    emitUpdate (event) {
      this.$emit('updateEdited', event)
    }
  }
}

</script>
