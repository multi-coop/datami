<template>
  <div class="FileTitle gitribute-component">
    <div class="is-flex is-align-items-center">
      <span class="mx-2 is-size-5-mobile is-size-4-tablet is-size-3-desktop has-text-dark">
        {{ title }}
      </span>
      <b-tooltip
        :label="t('file.fileInfos', locale)"
        type="is-dark"
        position="is-top">
        <b-icon
          icon="information-outline"
          size="is-small"
          :class="`ml-1 mr-2 has-text-${showFileInfos ? 'black' : 'grey-light'}`"
          @click.native="toggleDialog"/>
      </b-tooltip>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'FileTitle',
  mixins: [mixinGlobal],
  props: {
    title: {
      default: '',
      type: String
    },
    fileId: {
      default: '',
      type: String
    },
    locale: {
      default: 'en',
      type: String
    },
    showFileInfos: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    toggleDialog () {
      this.$emit('toggleInfos')
    }
  }
}
</script>

<style scoped>
  .file-infos {
    min-width: 37em;
  }
</style>
