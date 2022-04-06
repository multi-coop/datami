<template>
  <div class="ButtonChangeUserToken">
    <div :class="`dropdown is-right ${showContent ? 'is-active' : '' }`">
      <!-- TRIGGER BUTTON -->
      <div class="dropdown-trigger">
        <b-tooltip
          :label="t('changeToken', locale)"
          type="is-dark"
          position="is-top">
          <b-button
            size="is-small"
            class="ml-1"
            :type="showContent ? 'is-dark' : ''"
            icon-left="account"
            aria-haspopup="true"
            aria-controls="dropdown-user-token"
            @click="showContent = !showContent"/>
        </b-tooltip>
      </div>
      <!-- INPUT -->
      <div
        id="dropdown-user-token"
        class="dropdown-menu token-input"
        role="menu">
        <div class="dropdown-content px-3 py-3">
          <b-field
            :label="editToken ? t('changeToken', locale) : t('userToken', locale)">
            <b-input
              v-model="usertoken"
              icon="lock"
              :disabled="!editToken"
              expanded/>
            <p class="control">
              <b-button
                :type="editToken ? 'is-dark' : 'is-light'"
                :inverted="!editToken"
                :icon-left="editToken ? 'check' : 'lock-open' "
                :label="editToken ? t('save', locale) : t('change', locale)"
                @click="inputAction()"/>
            </p>
          </b-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ButtonChangeUserToken',
  props: {
    gitObj: {
      default: undefined,
      type: Object
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      showContent: false,
      usertoken: undefined,
      editToken: false
    }
  },
  computed: {
    ...mapGetters({
      getFileToken: 'git-data/getFileToken',
      t: 'git-translations/getTranslation'
    })
  },
  beforeMount () {
    const originalToken = this.getFileToken(this.gitObj.uuid)
    // console.log('C > ButtonChangeUserToken > originalToken : ', originalToken)
    this.usertoken = originalToken
  },
  methods: {
    ...mapActions({
      updateToken: 'git-data/updateToken'
    }),
    inputAction () {
      if (this.editToken) {
        // console.log('C > ButtonChangeUserToken > this.usertoken : ', this.usertoken)
        this.updateToken({ fileId: this.gitObj.uuid, token: this.usertoken })
        this.editToken = false
      } else {
        this.editToken = true
      }
    }
  }
}
</script>

<style scoped>
  .token-input {
    min-width: 25em;
  }
</style>
