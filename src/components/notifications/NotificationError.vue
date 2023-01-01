<template>
  <div class="NotificationError datami-component container px-3 py-3 mb-2">
    <b-notification
      v-model="isActive"
      aria-close-label="Close notification"
      @close="closeError">
      <div class="class columns is-mobile is-multiline">
        <!-- ERROR URL -->
        <div class="column is-11 is-offset-1 has-text-centered">
          <p>
            <code>
              {{ error.url }}
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
              {{ error.function }}
            </code>
          </p>
        </div>
        <div class="column is-3 pt-0 has-text-centered">
          <p>
            <code>
              {{ error.code }}
            </code>
          </p>
        </div>
        <div class="column is-5 pt-0 has-text-centered">
          <p>
            <pre class="break-spaces"><code> {{ getErrorMessage(error.resp) }} </code></pre>
          </p>
        </div>
      </div>
    </b-notification>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'NotificationError',
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
    error: {
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
  },
  methods: {
    getErrorMessage (errResp) {
      return errResp.message || errResp.statusText || errResp
    },
    closeError (event) {
      // console.log('\nC > NotificationError > closeError > event : ', event)
      // console.log('C > NotificationError > closeError > this.dialogId : ', this.dialogId)
      // console.log('C > NotificationError > closeError > this.error : ', this.error)
      this.removeFileDialog(this.dialogId)
    }
  }
}
</script>
<style scoped>
.break-spaces {
  white-space: break-spaces !important;
}
</style>
