<template>
  <div class="NotificationErrors datami-component container px-6 mb-2">
    <b-notification
      v-model="isActive"
      aria-close-label="Close notification">
      <div class="class columns is-mobile is-multiline">
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
        <div class="column is-3 is-offset-1 has-text-centered">
          <p>
            <code>
              {{ error.function }}
            </code>
          </p>
        </div>
        <div class="column is-3 has-text-centered">
          <p>
            <code>
              {{ error.code }}
            </code>
          </p>
        </div>
        <div class="column is-5 has-text-centered">
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
  name: 'NotificationErrors',
  mixins: [mixinGlobal],
  props: {
    fileId: {
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
    }
  }
}
</script>
<style scoped>
.break-spaces {
  white-space: break-spaces !important;
}
</style>
