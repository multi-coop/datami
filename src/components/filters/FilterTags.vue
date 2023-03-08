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
            {{ getFieldLabel(tag.field, currentEditViewMode) }}
            <!-- - tag.field : <pre><code>{{ tag.field }}</code></pre> -->
            <!-- - getField(tag.field) : <pre><code>{{ getField(tag.field) }}</code></pre> -->
          </b-tag>
          <!-- {{ getFieldForeignKey(tag.field) }} -->
          <!-- <hr> -->
          <!-- {{ item(tag.field, tag.value) }} -->
          <!-- :tag-style="`color: ${tagColor(tag.value, getFieldBgColor(tag.field), false)}; background-color:  ${tagBackgroundColor(tag.value, getFieldBgColor(tag.field), false)}`" -->
          <PreviewTagValue
            :file-id="fileId"
            :val="tag.value"
            :tag-style="`color: ${tagColor(tag.value, getField(tag.field), false)}; background-color:  ${tagBackgroundColor(tag.value, getField(tag.field), false)}`"
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
    getFieldLabel (field, editMode) {
      // console.log('C > FilterTags > getFieldLabel > field : ', field)
      const header = this.getField(field)
      // console.log('C > FilterTags > getFieldLabel > header : ', header)
      if (editMode !== 'edit') {
        return header.title || header.label
      } else {
        return header.label
      }
    },
    // getFieldBgColor (field) {
    //   const header = this.getField(field)
    //   return header && header.bgColor
    // },
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
