<template>
  <div class="DialogFileInfos datami-component container mb-4">
    <div class="columns is-vcentered is-centered">
      <div class="column is-9">
        <div class="card">
          <!-- HEADER -->
          <header class="card-header">
            <p class="card-header-title">
              <b-icon
                class="mr-3"
                icon="information-outline"/>
              {{ t('file.fileInfos', locale) }}
            </p>
            <button
              class="card-header-icon"
              @click="closeDialog">
              <b-icon
                icon="close"/>
            </button>
          </header>

          <!-- INFOS -->
          <div class="card-content">
            <div class="content mx-6">
              <!-- TILES -->
              <GitObjInfos
                :file-id="fileId"
                :locale="locale"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

import GitObjInfos from '@/components/previews/GitObjInfos'

export default {
  name: 'DialogFileInfos',
  components: {
    GitObjInfos
  },
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    closeDialog () {
      // this.updateSaving({ fileId: this.fileId, isSaving: false })
      this.$emit('closeDialogFileInfos')
    }
  }
}
</script>
