<template>
  <div class="NotificationError datami-component container px-3 py-3 mb-2">
    <!-- TEST ERROR NOTIF -->
    <b-notification
      v-model="isActive"
      aria-close-label="Close notification"
      @close="closeDialog">
      <!-- eventError: <br><pre><code>{{ eventError }}</code></pre> -->
      <div class="columns is-mobile is-multiline">
        <!-- ERROR URL -->
        <div class="column is-11 is-offset-1 has-text-centered">
          <p>
            <code>
              {{ eventError.url }}
            </code>
          </p>
        </div>

        <!-- ERROR TITLES -->
        <div class="column is-1 pt-5 has-text-centered">
          <b-icon
            type="is-danger"
            icon="alert"/>
        </div>
        <div class="column is-3 has-text-centered">
          <h4 class="has-text-weight-bold">
            {{ t('errors.errorFunction', locale) }}
          </h4>
        </div>
        <div class="column is-3 has-text-centered">
          <h4 class="has-text-weight-bold">
            {{ t('errors.errorCode', locale) }}
          </h4>
        </div>
        <div class="column is-5 has-text-centered">
          <h4 class="has-text-weight-bold">
            {{ t('errors.errorMessage', locale) }}
          </h4>
        </div>

        <!-- ERROR VALUES -->
        <div class="column is-3 pt-0 is-offset-1 has-text-centered">
          <p>
            <code>
              {{ eventError.function }}
            </code>
          </p>
        </div>
        <div class="column is-3 pt-0 has-text-centered">
          <p>
            <code>
              {{ eventError.code }}
            </code>
          </p>
        </div>
        <div class="column is-5 pt-0 has-text-centered">
          <p>
            <pre class="break-spaces"><code> {{ getErrorMessage(eventError.resp) }} </code></pre>
          </p>
        </div>
      </div>
    </b-notification>
  </div>
</template>

<script>
// import { mixinGlobal } from '@/utils/mixins.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NotificationError',
  // mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    dialogId: {
      default: null,
      type: String
    },
    eventError: {
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
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  },
  methods: {
    ...mapActions({
      removeFileDialog: 'git-dialogs/removeFileDialog'
    }),
    getErrorMessage (errResp) {
      return errResp.message || errResp.statusText || errResp
    },
    closeDialog (event) {
      console.log('\nC > NotificationError > closeDialog > event : ', event)
      console.log('C > NotificationError > closeDialog > this.dialogId : ', this.dialogId)
      console.log('C > NotificationError > closeDialog > this.eventError : ', this.eventError)
      this.removeFileDialog(this.dialogId)
    }
  }
}
</script>
