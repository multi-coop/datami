<template>
  <div class="FilterTags container is-flex is-flex-direction-row is-align-content-center is-justify-content-center">
    <div
      v-for="(tag, idx) in tags"
      :key="`${tag.field}-${tag.value}`"
      class="is-flex">
      <b-tag
        class="px-2 py-1 mb-0"
        close-type="is-dark"
        attached
        closable
        aria-close-label="Close tag"
        @close="removeTag(tag)">
        <span class="mr-2">
          {{ getFieldLabel(tag.field) }} : "{{ tag.value }}"
        </span>
      </b-tag>
      <span
        v-if="tags.length > 1 && idx !== tags.length - 1"
        class="px-2 py-1">
        +
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FilterTags',
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
      console.log('C > FilterTags > removeTag > tag : ', tag)
      this.$emit('removeTag', tag)
    }
  }
}
</script>
