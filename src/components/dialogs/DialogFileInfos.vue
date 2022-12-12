<template>
  <div class="DialogFileInfos datami-component container mb-4">
    <div class="card">
      <!-- HEADER -->
      <header class="card-header">
        <p class="card-header-title">
          <b-icon
            class="mr-3"
            icon="information-outline"/>
          {{ t('file.fileInfos', locale) }}
        </p>
      </header>

      <!-- INFOS -->
      <div class="card-content">
        <div class="content mx-6">
          <GitObjInfos
            :file-id="fileId"
            :locale="locale"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DialogFileInfos',
  components: {
    GitObjInfos: () => import(/* webpackChunkName: "GitObjInfos" */ '@/components/previews/GitObjInfos.vue')
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
  }
}
</script>
