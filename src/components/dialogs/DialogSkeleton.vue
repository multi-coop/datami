<template>
  <div class="DialogSkeleton">
    <div
      v-for="(dialog, i) in fileDialogs"
      :key="i">
      <!-- FILE INFOS -->
      <DialogFileInfos
        v-if="dialog.component === 'FileInfos'"
        :file-id="fileId"
        :dialog-id="dialog.dialogId"
        :locale="locale"
        :debug="debug"/>

      <!-- ERRORS -->
      <div
        v-else-if="dialog.component === 'NotificationErrors'"
        class="card">
        <NotificationError
          :file-id="fileId"
          :dialog-id="dialog.dialogId"
          :error="dialog.event.error"
          :locale="locale"/>
      </div>

      <!-- NOTIFICATIONS -->
      <div
        v-else-if="dialog.component === 'NotificationCommit'"
        class="card">
        <NotificationCommit
          :file-id="fileId"
          :dialog-id="dialog.dialogId"
          :notif="dialog.event.notif"
          :locale="locale"/>
      </div>

      <!-- CARDS DETAIL -->
      <DatamiCard
        v-else-if="dialog.component === 'CardDetail'"
        :file-id="fileId"
        :dialog-id="dialog.dialogId"
        :fields="dialog.event.fields"
        :field-mapping="dialog.event.fieldMapping"
        :item="dialog.event.item"
        :show-detail="true"
        :show-detail-card="true"
        :locale="locale"
        :from-table="dialog.event.fromTable"/>

      <!-- ADD ROW -->
      <DialogAddRow
        v-else-if="dialog.component === 'AddRow'"
        :file-id="fileId"
        :dialog-id="dialog.dialogId"
        :fields="dialog.event.fields"
        :locale="locale"/>

      <!-- DELETE ROW -->
      <DialogDeleteRows
        v-else-if="dialog.component === 'DeleteRow'"
        :file-id="fileId"
        :dialog-id="dialog.dialogId"
        :fields="dialog.event.columnsEdited"
        :checked-rows="dialog.event.checkedRows"
        :locale="locale"/>

      <!-- UPLOAD FILE -->
      <DialogUploadFile
        v-else-if="dialog.component === 'UploadFile'"
        :file-id="fileId"
        :dialog-id="dialog.dialogId"
        :locale="locale"/>

      <!-- CONFIRM COMMIT -->
      <ConfirmCommit
        v-else-if="dialog.component === 'OpenCommitDialog'"
        :file-id="fileId"
        :dialog-id="dialog.dialogId"
        :locale="locale"
        :debug="debug"/>

      <!-- COPY WIDGET -->
      <DialogCopyWidget
        v-else-if="dialog.component === 'CopyWidget'"
        :file-id="fileId"
        :dialog-id="dialog.dialogId"
        :content="dialog.event"
        :locale="locale"
        :debug="debug"/>
    </div>

    <!-- DEBUGGING -->
    <!-- <div
      v-if="debug"
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
    </div> -->

    <!-- DEBUGGING -->
    <div
      v-if="debug"
      class="card my-3">
      <div class="card-header">
        <p class="card-header-title">
          DEBUGGING
        </p>
        <b-switch
          v-model="showDebugDetails"
          type="is-danger"
          class="card-header-icon"/>
      </div>
      <div
        v-show="showDebugDetails"
        class="card-content">
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
    NotificationCommit: () => import(/* webpackChunkName: "NotificationCommit" */ '@/components/notifications/NotificationCommit.vue'),
    NotificationError: () => import(/* webpackChunkName: "NotificationError" */ '@/components/notifications/NotificationError.vue'),
    DatamiCard: () => import(/* webpackChunkName: "DatamiCard" */ '@/components/previews/cards/DatamiCard.vue'),
    DialogFileInfos: () => import(/* webpackChunkName: "DialogFileInfos" */ '@/components/dialogs/DialogFileInfos.vue'),
    DialogAddRow: () => import(/* webpackChunkName: "DialogAddRow" */ '@/components/dialogs/DialogAddRow.vue'),
    DialogDeleteRows: () => import(/* webpackChunkName: "DialogDeleteRows" */ '@/components/dialogs/DialogDeleteRows.vue'),
    DialogUploadFile: () => import(/* webpackChunkName: "DialogUploadFile" */ '@/components/dialogs/DialogUploadFile.vue'),
    ConfirmCommit: () => import(/* webpackChunkName: "ConfirmCommit" */ '@/components/dialogs/ConfirmCommit.vue'),
    DialogCopyWidget: () => import(/* webpackChunkName: "DialogCopyWidget" */ '@/components/dialogs/DialogCopyWidget.vue')
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
  },
  data () {
    return {
      showDebugDetails: false
    }
  }
}
</script>
