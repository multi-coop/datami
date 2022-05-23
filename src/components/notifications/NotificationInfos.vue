<template>
  <div class="NotificationInfos gitribute-component container px-6 mb-2">
    <b-notification
      v-model="isActive"
      aria-close-label="Close notification">
      <div class="class columns is-vcentered is-mobile">
        <div class="column is-1 has-text-centered">
          <b-icon
            type="is-dark"
            icon="information-outline"/>
        </div>
        <!-- DEBUGGING -->
        <!-- <div class="column is-12 has-text-left">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('notifications.notifFunction', locale) }}
          </h4>
          <p>
            <pre><code>
              {{ notif }}
            </code></pre>
          </p>
        </div> -->
        <!-- REMINDER TO BRANCH -->
        <div class="column is-3 has-text-centered">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('git.newBranch', locale) }}
          </h4>
          <p>
            newBranch
            {{ notif.newBranch }}
          </p>
        </div>
        <!-- LINK TO MERGE REQUEST -->
        <div
          v-if="notif.mergeRequestUrl"
          class="column is-3 has-text-centered">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('notifications.mergeRequestUrl', locale) }}
          </h4>
          <p>
            link to mergeRequestUrl
            <a
              target="_blank"
              :href="notif.mergeRequestUrl">
              {{ t('git.mergeRequestUrl', locale) }}
            </a>
          </p>
        </div>
        <!-- LINK TO BRANCH -->
        <div
          v-if="notif.branchUrl"
          class="column is-3 has-text-centered">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('notifications.branchUrl', locale) }}
          </h4>
          <p>
            link to commit on branch
            <a
              target="_blank"
              :href="notif.branchUrl">
              {{ t('git.branchUrl', locale) }}
            </a>
          </p>
        </div>
      </div>
    </b-notification>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'NotificationInfos',
  mixins: [mixinGlobal],
  props: {
    fileId: {
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
    }
  },
  data () {
    return {
      isActive: true
    }
  }
}
</script>
