<template>
  <div class="FilterTags datami-component container is-flex is-flex-direction-row is-align-content-top is-justify-content-center">
    <b-field
      grouped
      group-multiline>
      <div
        v-for="tag in tags"
        :key="`${tag.field}-${tag.value}`"
        class="control filter-tag">
        <b-taglist
          attached
          closable
          aria-close-label="Close tag">
          <!-- FIELD LABEL -->
          <b-tag>
            {{ getFieldLabel(tag.field) }}
            <!-- - tag.field : <pre><code>{{ tag.field }}</code></pre> -->
          </b-tag>
          <!-- {{ getFieldForeignKey(tag.field) }} -->
          <!-- <hr> -->
          <!-- {{ item(tag.field, tag.value) }} -->
          <!-- HELPER FOREIGN KEY -->
          <!-- <b-tag
            :style="`color: ${tagColor(tag.value, tag.bgColor)}; background-color: ${tagBackgroundColor(tag.value, tag.bgColor)}`">
            TAG VALUE
            <b-tooltip
              v-if="getFieldForeignKey(tag.field) || getFieldDefinitions(tag.field)"
              multilined
              size="is-large"
              :type="`${isDarkMode ? 'is-white' : 'is-dark'}`">
              <template #content>
                <div class="divider mt-1 mb-1 has-text-grey">
                  <b-icon
                    icon="information-outline"
                    class="mr-2"
                    size="is-small"/>
                  <span class="has-text-weight-bold no-text-transform">
                    <span v-if="getFieldForeignKey(tag.field)">
                      {{ t('field.ressourceValues', locale) }}
                    </span>
                    <span v-if="getFieldDefinitions(tag.field)">
                      {{ t('field.definition', locale) }}
                    </span>
                  </span>
                </div>

                FOREIGN KEY || RETURN FIELDS
                <div v-if="getFieldForeignKey(tag.field)">
                  <div
                    v-for="entry in Object.entries(item(tag.field, tag.value))"
                    :key="`${entry[0]}`"
                    class="columns my-1 has-text-left">
                    <div class="column is-4 my-0 mx-0 py-0 pr-1 has-text-weight-bold">
                      {{ t('field.definition', locale) }}
                    </div>
                    <div class="column is-8 my-0 mx-0 py-0 ">
                      {{ entry[1] }}
                    </div>
                  </div>
                </div>

                DEFINITIONS || RETURN FIELDS
                <div
                  v-if="getFieldDefinitions(tag.field)"
                  class="columns my-1 has-text-left">
                  <div class="column is-4 my-0 mx-0 py-0 pr-1 has-text-weight-bold">
                    {{ t('field.definition', locale) }}
                  </div>
                  <div class="column is-8 my-0 mx-0 py-0 ">
                    <p class="py-0 my-0">
                      {{ getValueDefinitionLabel(tag.value, getField(tag.field)) }}
                    </p>
                    <p
                      v-if="getValueDefinitionDescription(tag.value, getField(tag.field))"
                      class="mt-1 py-0 is-italic">
                      {{ getValueDefinitionDescription(tag.value, getField(tag.field)) }}
                    </p>
                  </div>
                </div>
              </template>

              TAG'S TEXT
              <span class="px-2 has-text-weight-bold">
                <span
                  v-if="currentEditViewMode !== 'preview' && !getFieldForeignKey(tag.field) && !getFieldDefinitions(tag.field)">
                  {{ tag.value }}
                </span>
                <span v-if="getValueDefinitionLabel(tag.value, getField(tag.field))">
                  <span v-if="currentEditViewMode !== 'preview'">
                    :
                  </span>
                  {{ trimText(getValueDefinitionLabel(tag.value, getField(tag.field)), 7) }}
                </span>
                <b-icon
                  icon="information-outline"
                  size="is-small"
                  class="mx-1"/>
              </span>
            </b-tooltip>
            <span
              v-else
              class="px-2 has-text-weight-bold">
              {{ tag.value }}
            </span>

            TAG REMOVER
            <b-tooltip
              :label="t(`filters.removeFilter`, locale)"
              :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
              position="is-top">
              <b-icon
                size="is-small"
                icon="close"
                @click.native="removeTag(tag)"/>
            </b-tooltip>
          </b-tag> -->
          <PreviewTagValue
            :file-id="fileId"
            :val="tag.value"
            :tag-style="`color: ${tagColor(tag.value, getFieldBgColor(tag.field), false)}; background-color:  ${tagBackgroundColor(tag.value, getFieldBgColor(tag.field), false)}`"
            :field="getField(tag.field)"
            :is-filter-tag="true"
            :locale="locale"/>
          <b-tag>
            <b-tooltip
              :label="t(`filters.removeFilter`, locale)"
              :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
              position="is-top">
              <b-icon
                size="is-small"
                icon="close"
                @click.native="removeTag(tag)"/>
            </b-tooltip>
          </b-tag>
        </b-taglist>
      </div>
    </b-field>
  </div>
</template>

<script>
import {
  mixinGlobal,
  mixinValue,
  mixinForeignKeys
} from '@/utils/mixins.js'

export default {
  name: 'FilterTags',
  components: {
    PreviewTagValue: () => import(/* webpackChunkName: "PreviewTagValue" */ '@/components/previews/PreviewTagValue.vue')
  },
  mixins: [
    mixinGlobal,
    mixinValue,
    mixinForeignKeys
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    headers: {
      default: null,
      type: Array
    },
    tags: {
      default: null,
      type: Array
    },
    locale: {
      default: null,
      type: String
    }
  },
  // data () {
  //   return {
  //     cssFiles: [
  //       'styles/components/filters/datami-filter-tags.css'
  //     ]
  //   }
  // },
  methods: {
    getField (field) {
      const header = this.headers.find(f => f.field === field)
      return header
    },
    getFieldLabel (field) {
      const header = this.getField(field)
      return header.label
    },
    getFieldBgColor (field) {
      const header = this.getField(field)
      return header && header.bgColor
    },
    getFieldForeignKey (field) {
      const header = this.getField(field)
      return header.foreignKey
    },
    getFieldDefinitions (field) {
      const header = this.getField(field)
      return header.definitions
    },
    item (field, val) {
      const header = this.getField(field)
      return this.getForeignItem(header, val)
    },
    removeTag (tag) {
      // console.log('C > FilterTags > removeTag > tag : ', tag)
      const payload = {
        action: 'removeTag',
        value: tag
      }
      this.$emit('action', payload)
    }
  }
}
</script>
