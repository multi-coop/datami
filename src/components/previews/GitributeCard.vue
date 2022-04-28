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
          class="mr-1 is-size-5">
          <div v-if="currentEditViewMode === 'preview'">
            {{ item[f.field] }}
          </div>
          <div v-if="currentEditViewMode === 'diff'">
            {{ item[f.field] }}
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
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
            :icon="showDetail ? 'close' : 'eye'"/>
        </b-tooltip>
      </button>
    </header>

    <!-- IMAGE BLOCK -->
    <div
      v-if="hasContentByPosition('image')"
      class="card-image"
      @click="toggleDetail">
      <div
        v-for="(f, i) in getFieldsByPosition('image')"
        :key="`image-${i}-${f.field}`">
        <figure
          v-if="item[f.field]"
          class="image mx-0">
          <img
            :src="item[f.field]"
            :alt="`image-${item.id}`">
        </figure>
        <!-- NO IMAGE FOUND -->
        <article
          v-else
          class="notification is-light">
          <p class="subtitle py-4 has-text-centered">
            <b-icon
              icon="image-off-outline"
              size="is-small"/>
          </p>
        </article>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="card-content pt-2">
      <!-- <pre><code>{{ item }}</code></pre> -->
      <!-- <pre><code>{{ fieldMapping }}</code></pre> -->
      <div class="media">
        <div class="media-content">
          <!-- DEBUG -->
          <div v-if="debug">
            <p>
              fieldMapping: <br>
              <code>
                <pre>{{ fieldMapping }}</pre>
              </code>
            </p>
            <p>
              getFieldsByPosition('description'): <br>
              <code>
                <pre>{{ getFieldsByPosition('description') }}</pre>
              </code>
            </p>
            <p>
              item: <br>
              <code>
                <pre>{{ item }}</pre>
              </code>
            </p>
          </div>

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
              <div v-if="currentEditViewMode === 'diff'">
                {{ item[f.field] }}
              </div>
              <div
                v-if="currentEditViewMode === 'edit'"
                class="mr-2">
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
          class="mr-1 has-text-weight-medium">
          <div v-if="currentEditViewMode === 'preview'">
            {{ item[f.field] }}
          </div>
          <div v-if="currentEditViewMode === 'diff'">
            {{ item[f.field] }}
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
            <EditCell
              :col-field="f.field"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field]"
              @updateCellValue="emitUpdate"/>
          </div>
        </span>
      </div>

      <!-- DESCRIPTION BLOCK -->
      <div
        v-if="hasContentByPosition('description')"
        class="content">
        <span
          v-for="(f, i) in getFieldsByPosition('description')"
          :key="`description-${i}-${f.field}`"
          class="mr-1">
          <p
            v-if="item[f.field]"
            class="is-size-7 has-text-weight-bold mb-2">
            {{ getFieldLabel(f.field) }}
          </p>
          <div v-if="currentEditViewMode === 'preview'">
            {{ item[f.field] }}
          </div>
          <div v-if="currentEditViewMode === 'diff'">
            {{ item[f.field] }}
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
            <EditCell
              :col-field="f.field"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field]"
              @updateCellValue="emitUpdate"/>
          </div>
        </span>
      </div>

      <!-- TAGS BLOCK -->
      <div
        v-if="hasContentByPosition('tags')"
        class="content">
        <span
          v-for="(f, i) in getFieldsByPosition('tags')"
          :key="`tags-${i}-${f.field}`"
          class="mr-1">
          <p
            v-if="item[f.field]"
            class="is-size-7 has-text-weight-bold mb-2">
            {{ getFieldLabel(f.field) }}
          </p>
          <div v-if="currentEditViewMode === 'preview' && item[f.field]">
            <b-tag
              v-for="(val, tagIdx) in item[f.field].split(fileOptions.tagseparator)"
              :key="`tags-${i}-${f.field}-${tagIdx}`"
              class="mr-1">
              <b-tooltip
                :label="val"
                multilined
                type="is-dark"
                position="is-top">
                {{ trimText(val) }}
              </b-tooltip>
            </b-tag>
          </div>
          <div v-if="currentEditViewMode === 'diff' && item[f.field]">
            <b-tag
              v-for="(val, tagIdx) in item[f.field].split(fileOptions.tagseparator)"
              :key="`tags-${i}-${f.field}-${tagIdx}`"
              class="mr-1">
              {{ val }}
            </b-tag>
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
            <EditCell
              :col-field="f.field"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field]"
              @updateCellValue="emitUpdate"/>
          </div>
        </span>
      </div>

      <!-- LINKS BLOCK -->
      <div
        v-if="hasContentByPosition('links')"
        class="content">
        <span
          v-for="(f, i) in getFieldsByPosition('links')"
          :key="`links-${i}-${f.field}`"
          class="mr-1">
          <p
            v-if="item[f.field]"
            class="is-size-7 has-text-weight-bold mb-2">
            {{ getFieldLabel(f.field) }}
          </p>
          <div v-if="currentEditViewMode === 'preview' && item[f.field]">
            <b-button
              tag="a"
              size="is-small"
              icon-left="open-in-new"
              :href="item[f.field]"
              target="_blank">
              {{ t('global.link', locale) }}
            </b-button>
          </div>
          <div v-if="currentEditViewMode === 'diff' && item[f.field]">
            <b-button
              tag="a"
              size="is-small"
              icon-left="open-in-new"
              :href="item[f.field]"
              target="_blank">
              {{ t('global.link', locale) }}
            </b-button>
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
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
    fields: {
      default: null,
      type: Array
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
    getFieldLabel (field) {
      const fieldObj = this.fields.find(f => f.field === field)
      return fieldObj && fieldObj.label
    },
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
      this.$emit('updateCellValue', event)
    }
  }
}

</script>
