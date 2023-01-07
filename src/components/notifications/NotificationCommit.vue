<template>
  <div class="NotificationCommit datami-component container px-3 py-3 mb-2">
    <b-notification
      v-model="isActive"
      aria-close-label="Close notification"
      @close="closeDialog">
      <div class="columns is-multiline is-vcentered is-mobile">
        <div class="column is-12 has-text-centered">
          <b-icon
            class="mr-1"
            size="is-small"
            icon="check-bold"/>
          <span class="has-text-weight-bold">
            {{ t('git.commitSuccess', locale) }}
          </span>
        </div>

        <!-- INFO ICON -->
        <div class="column is-1 has-text-centered">
          <b-icon
            type="is-dark"
            icon="information-outline"/>
        </div>

        <!-- REMINDERS -->
        <div class="column is-10 has-text-left">
          <div class="columns is-multiline">
            <!-- REMINDER TO FILE -->
            <div class="column is-4">
              <b-icon
                class="mr-1"
                size="is-small"
                icon="source-branch"/>
              <span class="has-text-weight-bold">
                {{ t('file.fileName', locale) }} :
              </span>
            </div>
            <div class="column is-8">
              <code>{{ notif.filefullname }}</code>
            </div>

            <!-- REMINDER TO BRANCH -->
            <div class="column is-4">
              <b-icon
                class="mr-1"
                size="is-small"
                icon="source-branch"/>
              <span class="has-text-weight-bold">
                {{ t('git.newBranch', locale) }} :
              </span>
            </div>
            <div class="column is-8">
              <code>{{ notif.branch }}</code>
            </div>

            <!-- LINK TO NEW BRANCH -->
            <div class="column is-4">
              <b-icon
                class="mr-1"
                size="is-small"
                icon="source-branch"/>
              <span class="has-text-weight-bold">
                {{ t('git.branchUrl', locale) }} :
              </span>
            </div>
            <div class="column is-8">
              <b-icon
                class="mr-2"
                size="is-small"
                icon="open-in-new"/>
              <a
                target="_blank"
                :href="notif.branchUrl"
                class="outlink has-text-grey"
                @click="trackLink(notif.branchUrl)">
                {{ t('git.branchUrlLink', locale) }}
              </a>
            </div>

            <!-- LINK TO MERGE REQUEST -->
            <div class="column is-4">
              <b-icon
                class="mr-1"
                size="is-small"
                icon="source-pull"/>
              <span class="has-text-weight-bold">
                {{ t('git.mergeRequestUrl', locale) }} :
              </span>
            </div>
            <div class="column is-8">
              <b-icon
                class="mr-2"
                size="is-small"
                icon="open-in-new"/>
              <a
                target="_blank"
                :href="notif.mergeRequestUrl"
                class="outlink has-text-grey"
                @click="trackLink(notif.mergeRequestUrl)">
                {{ t('git.mergeRequestUrlLink', locale) }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- DEBUGGING -->
      <div
        v-if="debug"
        class="columns is-mobile">
        <div class="column is-12 has-text-left">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('notifications.notifFunction', locale) }}
          </h4>
          <p>
            dialogId : <code>{{ dialogId }}</code>
          </p>
          <p>
            notif : <br><pre><code>{{ notif }}</code></pre>
          </p>
        </div>
      </div>
    </b-notification>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'NotificationCommit',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    dialogId: {
      default: null,
      type: String
    },
    notif: {
      default: null,
      type: Object
    },
    locale: {
      default: 'en',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      isActive: true
    }
  },
  methods: {
    closeDialog (event) {
      // console.log('\nC > NotificationCommit > closeDialog > event : ', event)
      // console.log('C > NotificationCommit > closeDialog > this.dialogId : ', this.dialogId)
      // console.log('C > NotificationCommit > closeDialog > this.notif : ', this.notif)
      this.removeFileDialog(this.dialogId)
    }
  }
}
</script>
