<template>
  <div class="DialogSkeleton">
    <div
      v-for="(dialog, i) in fileDialogs"
      :key="i">
      <!-- FILE INFOS -->
      <DialogFileInfos
        v-if="dialog.component === 'FileInfos'"
        :file-id="fileId"
        :locale="locale"
        :debug="debug"/>

      <!-- ERRORS -->
      <!-- errors : <pre><code>{{ errors }}</code></pre> -->

      <!-- NOTIFICATIONS -->
      <!-- notifications : <pre><code>{{ notifications }}</code></pre> -->

      <!-- NEW LINE -->

      <!-- CONTRIBUTION DIALOG -->

      <!-- CARDS DETAIL -->
      <DatamiCard
        v-else-if="dialog.component === 'CardDetail'"
        :file-id="fileId"
        :fields="dialog.event.fields"
        :field-mapping="dialog.event.fieldMapping"
        :item="dialog.event.item"
        :show-detail="true"
        :show-detail-card="true"
        :locale="locale"
        :from-table="dialog.event.fromTable"/>

      <!-- DELETE DIALOG -->

      <div
        v-else
        class="card my-3">
        <div class="card-header">
          <p class="card-header-title">
            DEBUGGING - dialog index : {{ i }}
          </p>
        </div>
        <div class="card-content">
          <div class="content">
            <div class="columns">
              <div class="column is-4">
                dialog : <br><pre><code>{{ dialog }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DEBUGGING -->
    <div
      v-if="true"
      class="card my-3">
      <div class="card-header">
        <p class="card-header-title">
          DEBUGGING
        </p>
      </div>
      <div class="card-content">
        <div class="content">
          <div class="columns is-multiline">
            <div class="column is-4">
              fileDialogs : <br><pre><code>{{ fileDialogs }}</code></pre>
            </div>
            <div class="column is-4">
              errors : <br><pre><code>{{ errors }}</code></pre>
            </div>
            <div class="column is-4">
              notifications : <br><pre><code>{{ notifications }}</code></pre>
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
    DialogFileInfos: () => import(/* webpackChunkName: "DialogFileInfos" */ '@/components/dialogs/DialogFileInfos.vue'),
    // NotificationInfos: () => import(/* webpackChunkName: "NotificationInfos" */ '@/components/notifications/NotificationInfos.vue'),
    // NotificationErrors: () => import(/* webpackChunkName: "NotificationErrors" */ '@/components/notifications/NotificationErrors.vue'),
    DatamiCard: () => import(/* webpackChunkName: "DatamiCard" */ '@/components/previews/cards/DatamiCard.vue')
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
