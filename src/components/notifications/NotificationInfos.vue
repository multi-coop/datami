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
        <div class="column is-10 has-text-left">
          <!-- REMINDER TO BRANCH -->
          <div class="columns is-vcentered is-multiline">
            <div class="column is-12 has-text-centered">
              <b-icon
                class="mr-1"
                size="is-small"
                icon="check-bold"/>
              <span class="has-text-weight-bold">
                {{ t('git.commitSuccess', locale) }}
              </span>
            </div>
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
              <code>{{ notif.newBranch }}</code>
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
                :href="notif.branchUrl">
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
                :href="notif.mergeRequestUrl">
                {{ t('git.mergeRequestUrlLink', locale) }}
              </a>
            </div>
          </div>
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

<style scoped>

a {
  color: grey !important;
}
</style>
