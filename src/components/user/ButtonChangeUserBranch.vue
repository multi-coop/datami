<template>
  <div class="ButtonChangeUserBranch datami-component">
    <div :class="`dropdown is-right ${showContent ? 'is-active' : '' }`">
      <!-- TRIGGER BUTTON -->
      <div class="dropdown-trigger">
        <b-tooltip
          :label="t('actions.changeActiveBranch', locale)"
          :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
          position="is-top">
          <b-button
            size="is-small"
            :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
            :outlined="isDarkMode"
            :type="showContent ? 'is-dark' : ''"
            :disabled="!userActiveBranch"
            icon-left="source-branch"
            aria-haspopup="true"
            aria-controls="dropdown-user-branch"
            @click="toggleBtn"/>
        </b-tooltip>
      </div>
      <!-- INPUT -->
      <div
        id="dropdown-user-branch"
        class="dropdown-menu branch-input"
        role="menu">
        <div class="dropdown-content px-4 py-4">
          <!-- DEBUGGING -->
          <div v-if="debug">
            <p>
              userBranches : <br><pre><code>{{ userBranches }}</code></pre>
            </p>
            <p>
              userActiveBranch : <code>{{ userActiveBranch }}</code>
            </p>
          </div>

          <!-- TITLE -->
          <div class="columns mb-3 is-vcentered">
            <div class="column pb-0 is-8 is-offset-2 has-text-centered has-text-weight-bold">
              <b-icon
                icon="source-branch"
                size="is-small"/>
              {{ t('actions.changeActiveBranch', locale) }}
            </div>
            <div class="column pb-0 is-2 has-text-right">
              <b-button
                type="is-white"
                icon-left="close"
                @click="showContent = false"/>
            </div>
          </div>

          <!-- SELECT ACTIVE BRANCH -->
          <b-field>
            <!-- :label="t('actions.changeActiveBranch', locale)"> -->
            <b-select
              v-model="activeBranch"
              :placeholder="t('git.branch', locale)"
              icon="source-branch"
              expanded
              @input="inputAction()">
              <optgroup
                v-if="refBranch"
                :label="t('git.branchRef', locale)">
                <option
                  :value="refBranch"
                  disabled>
                  {{ refBranch.branch }}
                </option>
              </optgroup>
              <optgroup
                v-if="notRefBranches"
                :label="t('git.branchesUser', locale)">
                <option
                  v-for="branch in notRefBranches"
                  :key="branch.branch"
                  :value="branch">
                  {{ branch.branch }}
                </option>
              </optgroup>
            </b-select>
          </b-field>

          <!-- <code>{{ activeBranch }}</code> -->
          <!-- BRANCH RESUME -->
          <div
            v-if="activeBranch"
            class="columns is-multiline">
            <div class="column is-6">
              <b-button
                icon-left="source-branch"
                tag="a"
                :href="activeBranch.branchUrl"
                target="_blank"
                outlined
                expanded
                size="is-small"
                class="is-size-7 outlink"
                @click="trackLink(activeBranch.branchUrl)">
                {{ t('git.branchUrl', locale) }}
              </b-button>
            </div>
            <div class="column is-6">
              <b-button
                icon-left="source-pull"
                tag="a"
                :href="activeBranch.mergeRequestUrl"
                target="_blank"
                outlined
                expanded
                size="is-small"
                class="is-size-7 outlink"
                @click="trackLink(activeBranch.mergeRequestUrl)">
                {{ t('git.mergeRequestUrl', locale) }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal, mixinGit } from '@/utils/mixins.js'

export default {
  name: 'ButtonChangeUserBranch',
  mixins: [
    mixinGlobal,
    mixinGit
  ],
  props: {
    fileId: {
      default: null,
      type: String
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
      showContent: false,
      activeBranch: undefined
    }
  },
  watch: {
    userActiveBranch (next) {
      // console.log('C > ButtonChangeUserBranch > watch > userActiveBranch > this.gitObj : ', this.gitObj)
      this.activeBranch = next
    }
  },
  methods: {
    ...mapActions({
      changeActiveBranch: 'git-user/changeActiveUserBranch'
    }),
    toggleBtn () {
      this.showContent = !this.showContent

      // track with matomo
      this.trackEvent('click')
    },
    inputAction () {
      console.log('C > ButtonChangeUserBranch > inputAction > this.activeBranch : ', this.activeBranch)
      // this.changeActiveBranch({ fileId: this.fileId, branch: this.activeBranch })
    }
  }
}
</script>

<style scoped>
  /* .branch-input {
    width: 30em;
    z-index: 55;
  } */
</style>
