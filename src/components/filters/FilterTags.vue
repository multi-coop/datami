<template>
  <div class="FilterTags gitribute-component container is-flex is-flex-direction-row is-align-content-center is-justify-content-center">
    <b-field
      grouped
      group-multiline>
      <div
        v-for="tag in tags"
        :key="`${tag.field}-${tag.value}`"
        class="control">
        <b-taglist
          attached
          closable
          aria-close-label="Close tag">
          <b-tag>
            {{ getFieldLabel(tag.field) }}
          </b-tag>
          <b-tag
            type="is-dark">
            <span class="px-2">
              {{ tag.value }}
            </span>
            <b-tooltip
              :label="t(`filters.removeFilter`, locale)"
              type="is-dark"
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
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'FilterTags',
  mixins: [mixinGlobal],
  props: {
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
  methods: {
    getFieldLabel (field) {
      const header = this.headers.find(f => f.field === field)
      return header.label
    },
    removeTag (tag) {
      // console.log('C > FilterTags > removeTag > tag : ', tag)
      this.$emit('removeTag', tag)
    }
  }
}
</script>
