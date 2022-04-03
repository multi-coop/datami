<template>
  <div class="FileTitle">
    <div class="dropdown is-hoverable">
      <div class="dropdown-trigger">
        <b-tooltip
          :label="t('fileInfos', locale)"
          type="is-dark"
          position="is-right">
          <div class="is-size-4 is-flex is-align-items-center">
            <b-icon :icon="fileIcon"/>
            <span class="mx-2">
              {{ title }}
            </span>
            <b-button
              size="is-small"
              class="ml-1"
              icon-left="dots-horizontal"
              aria-haspopup="true"
              aria-controls="dropdown-file-infos"
              @click="showContent = !showContent"/>
          </div>
        </b-tooltip>
      </div>
      <div
        id="dropdown-file-infos"
        class="dropdown-menu file-infos"
        role="menu">
        <div class="dropdown-content px-3 py-3 is-size-6">
          <p>
            {{ t('fileName', locale) }} :
            <code>
              {{ gitObj.filename }}
            </code>
          </p>
          <p>
            {{ t('fileType', locale) }} :
            <code>
              {{ gitObj.filetype }}
              -
              ({{ t(fileTypeFamily, locale) }})
            </code>
          </p>
          <p>
            {{ t('fileUrl', locale) }} :
            <code>
              {{ gitObj.id }}
            </code>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FileTitle',
  props: {
    title: {
      default: '',
      type: String
    },
    gitObj: {
      default: undefined,
      type: Object
    },
    fileIcon: {
      default: '',
      type: String
    },
    fileTypeFamily: {
      default: '',
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      showContent: false
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  }
}
</script>

<style scoped>
  .file-infos {
    min-width: 35em;
  }
</style>
