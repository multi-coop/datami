<template>
  <div class="DialogSkeleton">
    <!-- FILE INFOS -->
    <DialogFileInfos
      :file-id="fileId"
      :locale="locale"
      :debug="debug"/>

    <!-- DEBUGGING -->
    <div
      v-if="true"
      class="card">
      <div class="card-content">
        <div class="content">
          <div class="columns">
            <div class="column is-2">
              fileDialogs
            </div>
            <div class="column is-10">
              <pre><code>{{ fileDialogs }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DialogSkeleton',
  components: {
    // DialogFileInfos: () => import(/* webpackChunkName: "DialogFileInfos" */ '@/components/previews/DialogFileInfos.vue')
    DialogFileInfos: () => import(/* webpackChunkName: "DialogFileInfos" */ '@/components/dialogs/DialogFileInfos.vue')
  },
  mixins: [
    mixinGlobal
  ],
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
