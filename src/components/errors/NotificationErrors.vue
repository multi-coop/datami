<template>
  <div class="NotificationErrors container px-6">
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
            {{ t('errorFunction', locale) }}
          </h4>
          <p>
            <code>
              {{ error.function }}
            </code>
          </p>
        </div>
        <div class="column is-3 has-text-centered">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('errorCode', locale) }}
          </h4>
          <p>
            <code>
              {{ error.code }}
            </code>
          </p>
        </div>
        <div class="column is-5 has-text-centered">
          <h4 class="has-text-weight-bold mb-2">
            {{ t('errorMessage', locale) }}
          </h4>
          <p>
            {{ error.message }}
          </p>
        </div>
      </div>
    </b-notification>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NotificationErrors',
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
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  }
}
</script>
