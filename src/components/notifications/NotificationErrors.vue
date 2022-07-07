<template>
  <div class="NotificationErrors gitribute-component container px-6 mb-2">
    <b-notification
      v-model="isActive"
      aria-close-label="Close notification">
      <div class="class columns is-vcentered is-mobile">
        <div class="column is-1 has-text-centered">
          <b-icon
            type="is-danger"
            icon="alert"/>
        </div>
        <div class="column is-3 has-text-centered">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('errors.errorFunction', locale) }}
          </h4>
          <p>
            <code>
              {{ error.function }}
            </code>
          </p>
        </div>
        <div class="column is-3 has-text-centered">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('errors.errorCode', locale) }}
          </h4>
          <p>
            <code>
              {{ error.code }}
            </code>
          </p>
        </div>
        <div class="column is-5 has-text-centered">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('errors.errorMessage', locale) }}
          </h4>
          <p>
            <pre><code> {{ getErrorMessage(error.message) }} </code></pre>
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
    getErrorMessage (error) {
      return error.message || error.statusText || error
    }
  }
}
</script>
