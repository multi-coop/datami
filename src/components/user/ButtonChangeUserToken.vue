<template>
  <div class="ButtonChangeUserToken datami-component">
    <div :class="`dropdown is-right ${showContent ? 'is-active' : '' }`">
      <!-- TRIGGER BUTTON -->
      <div class="dropdown-trigger">
        <b-tooltip
          :label="t('actions.changeToken', locale)"
          :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
          position="is-top">
          <b-button
            size="is-small"
            :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
            :outlined="isDarkMode"
            :type="showContent ? 'is-dark' : ''"
            icon-left="account"
            aria-haspopup="true"
            aria-controls="dropdown-user-token"
            @click="toggleBtn"
            @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('actions.changeToken', locale) })"
            @mouseleave="hideGlobalTooltip"/>
        </b-tooltip>
      </div>
      <!-- INPUT -->
      <div
        id="dropdown-user-token"
        class="dropdown-menu token-input"
        role="menu">
        <div class="dropdown-content px-4 py-4">
          <!-- TITLE -->
          <div class="columns mb-3 is-vcentered">
            <div class="column pb-0 is-8 is-offset-2 has-text-centered has-text-weight-bold">
              <b-icon
                :icon="editToken ? 'lock-open' : 'lock'"
                size="is-small"/>
              {{ editToken ? t('actions.changeToken', locale) : t('user.userToken', locale) }}
            </div>
            <div class="column pb-0 is-2 has-text-right">
              <b-button
                type="is-white"
                icon-left="close"
                @click="showContent = false"/>
            </div>
          </div>

          <!-- USER RESUME -->
          <p
            v-if="userGit"
            class="mb-3 has-text-centered">
            <b-icon
              icon="account"
              size="is-small"/>
            {{ t('user.user', locale) }} :
            <code>{{ userGit.username }}</code>
          </p>

          <!-- TOKEN INPUT -->
          <b-field>
            <!-- :label="editToken ? t('actions.changeToken', locale) : t('user.userToken', locale)"> -->
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

import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

import { getUserInfosFromToken } from '@/utils/gitProvidersAPI.js'

export default {
  name: 'ButtonChangeUserToken',
  mixins: [
    mixinTooltip,
    mixinGlobal
  ],
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
      // getFileToken: 'git-data/getFileToken',
      getUserGit: 'git-user/getUserGit'
    }),
    userGit () {
      return this.getUserGit(this.fileId)
    }
  },
  watch: {
    usertoken (next) {
      if (next) {
        this.getUserInfos()
      }
    }
  },
  mounted () {
    // console.log('C > ButtonChangeUserToken > this.gitObj : ', this.gitObj)
    const originalToken = this.fileToken // this.getFileToken(this.fileId)
    // console.log('C > ButtonChangeUserToken > originalToken : ', originalToken)
    this.usertoken = originalToken
  },
  methods: {
    ...mapActions({
      updateUserGit: 'git-user/updateUserGit',
      updateToken: 'git-data/updateToken'
    }),
    toggleBtn () {
      this.showContent = !this.showContent

      // track with matomo
      this.trackEvent('click')
    },
    inputAction () {
      if (this.editToken) {
        // console.log('C > ButtonChangeUserToken > this.usertoken : ', this.usertoken)
        this.updateToken({ fileId: this.fileId, token: this.usertoken })
        this.editToken = false
        this.showContent = false
      } else {
        this.editToken = true
      }
    },
    async getUserInfos () {
      // console.log('\nC > ButtonChangeUserToken > getUserInfos > this.usertoken : ', this.usertoken)
      const gitUserInfos = await getUserInfosFromToken(this.gitObj, this.usertoken)
      // console.log('C > ButtonChangeUserToken > getUserInfos > gitUserInfos : ', gitUserInfos)
      this.updateUserGit({ fileId: this.fileId, userGitInfos: gitUserInfos })
    }
  }
}
</script>

<style scoped>
  /* .token-input {
    min-width: 30em;
    z-index: 50;
  } */
</style>
