<template>
  <div
    class="GitributeCard gitribute-component gitribute-component card">
    <!-- HEADER -->
    <header class="card-header no-shadow">
      <!-- TITLE BLOCK -->
      <p
        v-if="hasContentByPosition('title')"
        class="card-header-title mb-0 is-4">
        <span
          v-for="(f, i) in getFieldsByPosition('title')"
          :key="`title-${i}-${f.field}`"
          class="mr-1 is-size-5">
          <div
            v-if="currentEditViewMode === 'preview'"
            @click="toggleDetail">
            {{ item[f.field] || '' }}
          </div>
          <div v-if="currentEditViewMode === 'diff'">
            {{ item[f.field] || '' }}
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
            <EditCell
              :field="f"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field] || ''"
              :locale="locale"
              :is-card-view="true"
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
          class="image mx-0 image-wrapper is-flex is-align-items-center is-justify-content-center">
          <img
            :src="item[f.field]"
            class="image-constrained"
            :alt="`image-${item.id}`">
        </figure>
        <!-- NO IMAGE FOUND -->
        <article
          v-else
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
    </div>

    <!-- CONTENT -->
    <div class="card-content pt-4">
      <!-- DEBUG -->
      <div v-if="debug">
        <!-- <pre><code>{{ item }}</code></pre> -->
        <!-- <pre><code>{{ fieldMapping }}</code></pre> -->
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
            {{ item[f.field] || '' }}
          </div>
          <div v-if="currentEditViewMode === 'diff'">
            {{ item[f.field] || '' }}
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
            {{ f }}
            <EditCell
              :field="f"
              :col-field="f.field"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field]"
              :locale="locale"
              :is-card-view="true"
              @updateCellValue="emitUpdate"/>
          </div>
        </span>
      </p>

      <!-- RESUME BLOCK -->
      <div
        v-if="hasContentByPosition('resume')"
        class="content">
        <span
          v-for="(f, i) in getFieldsByPosition('resume')"
          :key="`resume-${i}-${f.field}`"
          class="mt-4 has-text-weight-medium">
          <div v-if="currentEditViewMode === 'preview'">
            <span v-if="isMini">
              {{ trimText(item[f.field] || '', 150) }}
            </span>
            <span v-else>
              {{ item[f.field] || '' }}
            </span>
          </div>
          <div v-if="currentEditViewMode === 'diff'">
            {{ item[f.field] || '' }}
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
            <EditCell
              :field="f"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field] || ''"
              :locale="locale"
              :is-card-view="true"
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
          :id="`description-${i}-${f.field}`"
          :key="`description-${i}-${f.field}`"
          class="mr-1">
          <p
            v-if="item[f.field]"
            class="is-size-7 has-text-weight-bold mb-2 is-uppercase">
            {{ getFieldLabel(f.field) }}
          </p>
          <div v-if="currentEditViewMode === 'preview'">
            {{ item[f.field] || '' }}
          </div>
          <div v-if="currentEditViewMode === 'diff'">
            {{ item[f.field] || '' }}
          </div>
          <div
            v-if="currentEditViewMode === 'edit'"
            class="mr-2">
            <EditCell
              :field="f"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field] || ''"
              :locale="locale"
              :is-card-view="true"
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
          :id="`tags-${i}-${f.field}`"
          :key="`tags-${i}-${f.field}`"
          class="mr-1">
          <p
            v-if="item[f.field]"
            class="is-size-7 has-text-weight-bold mb-2 is-uppercase">
            {{ getFieldLabel(f.field) }}
          </p>
          <div v-if="currentEditViewMode === 'preview' && item[f.field]">
            <b-tag
              v-for="(val, tagIdx) in item[f.field].split(fileOptions.tagseparator)"
              :key="`tags-${i}-${f.field}-${tagIdx}`"
              class="mr-2 mb-1"
              :style="`color: ${tagColour(val)}; background-color:  ${tagBackgroundColour(val, fields[2] )}`">
              <b-tooltip
                :label="val"
                multilined
                type="is-dark"
                position="is-top">
                <span v-if="isMini">
                  {{ trimText(val) }}
                </span>
                <span v-else>
                  {{ trimText(val, 75) }}
                </span>
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
              :field="f"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field] || ''"
              :locale="locale"
              :is-card-view="true"
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
            class="is-size-7 has-text-weight-bold mb-2 is-uppercase">
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
              :field="f"
              :row-id="item.id"
              :is-added="item.added"
              :input-data="item[f.field] || ''"
              :locale="locale"
              :is-card-view="true"
              @updateCellValue="emitUpdate"/>
          </div>
        </span>
      </div>

      <!-- RAW CONTENT (WIKITEXT) -->
      <div
        v-if="!isMini && gitObj.filetype === 'wiki'"
        class="content">
        <b-switch
          v-model="showRawContent"
          type="is-dark">
          {{ t('editWiki.showRawContent', locale) }}
        </b-switch>
        <p
          v-if="showRawContent"
          class="">
          <pre><code>{{ item.content }}</code></pre>
        </p>
      </div>
    </div>

    <!-- CARD FOOTER -->
    <footer
      v-if="isMini"
      class="card-footer px-3 py-3">
      <!-- SHOW DETAILS BUTTON -->
      <b-button
        type="is-dark"
        size="is-small"
        icon-left="eye"
        expanded
        outlined
        @click="toggleDetail">
        {{ t('preview.showCardDetails', locale) }}
      </b-button>
    </footer>
    <footer
      v-if="!isMini && item.pageUrl"
      class="card-footer px-3 py-3">
      <!-- SHOW DETAILS BUTTON -->
      <b-button
        tag="a"
        type="is-dark"
        size="is-small"
        icon-left="open-in-new"
        :href="item.pageUrl"
        target="_blank"
        expanded
        outlined>
        {{ t('editWiki.goToWikiPage', locale) }}
      </b-button>
    </footer>
  </div>
</template>

<script>

import { mixinGlobal, mixinValue } from '@/utils/mixins.js'

import EditCell from '@/components/edition/csv/EditCell'

export default {
  name: 'GitributeCard',
  components: {
    EditCell
  },
  mixins: [
    mixinGlobal,
    mixinValue
  ],
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
    isMini: {
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
  data () {
    return {
      showRawContent: false
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

<style scoped>
.no-shadow {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.image-wrapper {
  min-height: 200px;
}
.image-constrained {
  max-height: 200px;
  width: auto !important;
}
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-content {
  height: 100%;
}
</style>
