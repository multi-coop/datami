<template>
  <div class="FileTitle">
    <b-tooltip
      :label="t('file.fileInfos', locale)"
      type="is-dark"
      position="is-right">
      <div class="is-flex is-align-items-center">
        <span class="mx-2 is-size-4">
          {{ title }}
        </span>
        <div
          :class="`dropdown ${hover ? 'is-active' : ''}`"
          @mouseover="hover = true"
          @mouseleave="hover = false">
          <div class="dropdown-trigger">
            <!-- <div class=""> -->
            <b-icon
              size="is-small"
              class="ml-1 mr-2 has-text-grey-light"
              icon="information-outline"/>
            <!-- </div> -->
          </div>
          <div
            id="dropdown-file-infos"
            class="dropdown-menu file-infos"
            role="menu">
            <div class="dropdown-content px-3 py-3 is-size-6">
              <p class="has-text-centered has-text-weight-bold">
                <b-icon
                  size="is-small"
                  class="mr-3 has-text-grey-light"
                  icon="information-outline"/>
                {{ t('file.fileInfos', locale) }}
              </p>
              <!-- TILES -->
              <GitObjInfos
                :file-id="fileId"
                :locale="locale"/>
            </div>
          </div>
        </div>
      </div>
    </b-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import GitObjInfos from '@/components/previews/GitObjInfos'

export default {
  name: 'FileTitle',
  components: {
    GitObjInfos
  },
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
    }
  },
  data () {
    return {
      hover: false
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
    min-width: 37em;
  }
</style>
