<template>
  <div class="ButtonChangeUserToken">
    <div :class="`dropdown is-right ${showContent ? 'is-active' : '' }`">
      <!-- TRIGGER BUTTON -->
      <div class="dropdown-trigger">
        <b-tooltip
          :label="t('actions.changeToken', locale)"
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
            :label="editToken ? t('actions.changeToken', locale) : t('user.userToken', locale)">
            <b-input
              v-model="usertoken"
              :icon="editToken ? 'lock-open' : 'lock'"
              :disabled="!editToken"
              expanded/>
            <p class="control">
              <b-button
                :type="editToken ? 'is-dark' : 'is-light'"
                :inverted="!editToken"
                :icon-left="editToken ? 'check' : 'pencil' "
                :label="editToken ? t('actions.save', locale) : t('actions.change', locale)"
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

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonChangeUserToken',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
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
      getFileToken: 'git-data/getFileToken'
    })
  },
  mounted () {
    // console.log('C > ButtonChangeUserToken > this.gitObj : ', this.gitObj)
    const originalToken = this.getFileToken(this.fileId)
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
        this.updateToken({ fileId: this.fileId, token: this.usertoken })
        this.editToken = false
        this.showContent = false
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
