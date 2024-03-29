<template>
  <div class="ConfirmCommit datami-component container card mb-2">
    <!-- HEADER -->
    <header class="card-header">
      <p class="card-header-title">
        <b-icon
          class="mr-3"
          icon="content-save-outline"/>
        {{ t('actions.commitChanges', locale) }}
        <!-- DEBUGGING -->
        <!-- - isCommitting : <code>{{ isCommitting }}</code>
        - fileIsSaving : <code>{{ fileIsSaving }}</code> -->
      </p>
    </header>

    <!-- COMMIT RESUME -->
    <div class="card-content">
      <div class="content">
        <!-- TABS -->
        <b-tabs
          v-model="activeTab"
          position="is-centered"
          class="">
          <!-- USER INFOS -->
          <b-tab-item
            :label="t('user.userMessage', locale)">
            <h5 class="has-text-centered mt-4">
              {{ t('user.userIntro', locale) }}
            </h5>
            <div class="columns is-centered is-multiline mt-3">
              <!-- MESSAGE -->
              <div class="column is-10 py-0">
                <b-field class="mt-4">
                  <template #label>
                    <b-icon
                      icon="email"
                      size="is-small"/>&nbsp;
                    {{ t('user.userMessage', locale) }}
                  </template>
                  <b-input
                    ref="message"
                    v-model="userMessage"
                    :readonly="isCommitting"
                    :disabled="isCommitting"
                    type="textarea"
                    maxlength="500"
                    icon-right="close-circle"
                    icon-right-clickable
                    @icon-right-click="clearMessage"/>
                </b-field>
              </div>
              <!-- NAME (ANY NAME) -->
              <div class="column is-5 py-0">
                <b-field>
                  <template #label>
                    <b-icon
                      icon="account"
                      size="is-small"/>&nbsp;
                    {{ t('user.userAnyName', locale) }}
                  </template>
                  <b-input
                    ref="username"
                    v-model="userName"
                    :readonly="isCommitting"
                    :disabled="isCommitting"
                    maxlength="50"
                    :placeholder="t('global.optional', locale)"
                    icon-right="close-circle"
                    icon-right-clickable
                    @icon-right-click="clearName"/>
                </b-field>
              </div>
              <!-- SURNAME -->
              <!-- <div class="column is-5 py-0">
                <b-field>
                  <template #label>
                    <b-icon
                      icon="account"
                      size="is-small"/>&nbsp;
                    {{ t('user.userSurname', locale) }}
                  </template>
                  <b-input
                    v-model="userSurname"
                    :readonly="isCommitting"
                    :disabled="isCommitting"
                    maxlength="50"
                    :placeholder="t('global.optional', locale)"
                    icon-right="close-circle"
                    icon-right-clickable
                    @icon-right-click="clearSurname"/>
                </b-field>
              </div> -->
              <!-- EMAIL -->
              <div class="column is-5 py-0">
                <b-field>
                  <template #label>
                    <b-icon
                      icon="at"
                      size="is-small"/>&nbsp;
                    {{ t('user.userEmail', locale) }}
                  </template>
                  <b-input
                    ref="email"
                    v-model="userEmail"
                    :readonly="isCommitting"
                    :disabled="isCommitting"
                    type="email"
                    :placeholder="t('global.optional', locale)"
                    icon-right="close-circle"
                    icon-right-clickable
                    @icon-right-click="clearEmail"/>
                </b-field>
              </div>
              <!-- RGPD CHECK -->
              <div
                v-if="userName || userEmail"
                class="column is-10 pt-0">
                <b-field class="mt-1">
                  <b-checkbox
                    v-model="checkRgpd"
                    type="is-dark"
                    :disabled="isCommitting || !(userName || userEmail)">
                    {{ t('user.userRgpd', locale) }}
                  </b-checkbox>
                </b-field>
              </div>
              <!-- COMMIT BRANCH -->
              <div class="column is-10 mt-0">
                <p class="has-text-weight-bold">
                  <b-icon
                    icon="source-branch"
                    size="is-small"/>&nbsp;
                  {{ t('git.commitBranch', locale) }}
                </p>
                <p class="">
                  <code>{{ commitBranch }}</code>
                </p>
              </div>
            </div>
          </b-tab-item>

          <!-- CHANGES -->
          <b-tab-item
            :label="t('preview.changes', locale)">
            <h5 class="has-text-centered mt-4 mb-5">
              {{ t('preview.editedPreview', locale) }}
            </h5>
            <pre><code>{{ edited }}</code></pre>
          </b-tab-item>

          <!-- FILE INFOS -->
          <b-tab-item
            :label="t('file.fileSource', locale)">
            <h5 class="has-text-centered mt-4 mb-5">
              {{ t('file.fileInfos', locale) }}
            </h5>
            <!-- TILES -->
            <GitObjInfos
              :file-id="fileId"
              :locale="locale"/>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>

    <!-- BUTTONS FOOTER -->
    <footer class="card-footer px-2 py-4">
      <b-button
        class="card-footer-item mx-3"
        icon-left="close"
        type=""
        :loading="isCommitting"
        @click="cancelCommit()">
        {{ t('actions.cancel', locale) }}
      </b-button>
      <b-button
        v-if="isMounted"
        class="card-footer-item mx-3"
        icon-left="check"
        type="is-dark"
        :disabled="!canCommit"
        :loading="isCommitting"
        @click="confirmCommit()">
        {{ t('actions.send', locale) }}
      </b-button>
    </footer>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

import { mixinGlobal, mixinCommit } from '@/utils/mixins.js'

import { sendContribution } from '@/utils/gitProvidersAPI.js'

export default {
  name: 'ConfirmCommit',
  components: {
    GitObjInfos: () => import(/* webpackChunkName: "GitObjInfos" */ '@/components/previews/GitObjInfos.vue')
  },
  mixins: [
    mixinGlobal,
    mixinCommit
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    dialogId: {
      default: null,
      type: String
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      isMounted: false,
      activeTab: 0,
      userMessage: undefined,
      userName: undefined,
      // userSurname: undefined,
      userEmail: undefined,
      checkRgpd: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      getCommitData: 'git-data/getCommitData',
      // getFileToken: 'git-data/getFileToken',
      getFileReqInfosObj: 'getFileReqInfosObj',
      checkIfErrorExists: 'git-data/checkIfErrorExists'
    }),
    canCommit () {
      let basicValidation = false
      if (this.userName || this.userEmail) {
        basicValidation = this.checkRgpd
      } else {
        basicValidation = true
      }
      return basicValidation && this.validateRefs()
    },
    commitData () {
      return this.getCommitData(this.fileId)
    },
    edited () {
      const commitData = this.commitData
      return commitData && commitData.edited
    },
    commitBranch () {
      const commitData = this.commitData
      return commitData && commitData.newBranch
    },
    buildCommitMessage () {
      let msg = this.userMessage
      const hasMore = [
        this.userName,
        // this.userSurname,
        this.userEmail
      ].findIndex(s => !!s)
      if (hasMore !== -1) {
        msg += '\n----\n\nContribution from:\n'
        if (this.userName) { msg += `\nUser name : ${this.userName}` }
        // if (this.userSurname) { msg += `\nSurname : ${this.userSurname}` }
        if (this.userEmail) { msg += `\nEmail : ${this.userEmail}` }
      }
      return msg
    }
  },
  beforeMount () {
    const commitBranch = this.commitBranch || this.buildNewBranchName(this.gitObj.filefullname, this.fileId)
    const now = Date.now()
    const today = new Date(now)
    const stringDate = today.toLocaleDateString()
    const stringTime = today.toLocaleTimeString()
    const defaultMessage = `Commit on branch '${commitBranch}'\nDate: ${stringDate}\nTime: ${stringTime}`
    this.userMessage = defaultMessage
  },
  mounted () {
    this.isMounted = true
    // get commit data
    // const commitData = this.getCommitData(this.fileId)
    // console.log('C > ConfirmCommit > mounted > commitData :', commitData)
  },
  methods: {
    ...mapActions({
      updateSaving: 'git-data/updateSaving',
      updateCommitting: 'git-data/updateCommitting',
      resetReqErrors: 'git-data/resetReqErrors',
      updateReqErrors: 'git-data/updateReqErrors'
    }),
    clearName () {
      this.userName = undefined
    },
    clearSurname () {
      this.userSurname = undefined
    },
    clearEmail () {
      this.userEmail = undefined
    },
    clearMessage () {
      this.userMessage = undefined
    },
    cancelCommit () {
      this.resetFileDialog()
      this.updateSaving({ fileId: this.fileId, isSaving: false })
      // track with matomo
      // this.trackEvent('cancelCommit')
    },
    validateRefs () {
      // console.log('\nC > ConfirmCommit > confirmCommit > this.userName :', this.userName)
      // console.log('C > ConfirmCommit > confirmCommit > this.userMessage :', this.userMessage)
      // console.log('C > ConfirmCommit > confirmCommit > this.userEmail :', this.userEmail)
      // console.log('C > ConfirmCommit > confirmCommit > this.$refs :', this.$refs)
      const validMsg = this.$refs.message.checkHtml5Validity()
      const validUsername = this.$refs.username.checkHtml5Validity()
      const validEmail = this.$refs.email.checkHtml5Validity()
      // console.log('C > ConfirmCommit > confirmCommit > validMsg :', validMsg)
      // console.log('C > ConfirmCommit > confirmCommit > validUsername :', validUsername)
      // console.log('C > ConfirmCommit > confirmCommit > validEmail :', validEmail)
      return validMsg && validUsername && validEmail
      // return true
    },
    async confirmCommit () {
      // console.log('\nC > ConfirmCommit > confirmCommit > this.fileId :', this.fileId)
      // console.log('C > ConfirmCommit > confirmCommit > this.dialogId :', this.dialogId)
      this.loading = true
      this.updateCommitting({ fileId: this.fileId, isCommitting: true })
      this.resetReqErrors(this.fileId)

      // get commit data
      const commitData = this.getCommitData(this.fileId)
      // console.log('C > ConfirmCommit > confirmCommit > commitData :', commitData)

      // get file request infos
      const fileReqInfos = this.getFileReqInfosObj(this.fileId)
      commitData.fileReqInfos = fileReqInfos
      // console.log('C > ConfirmCommit > confirmCommit > fileReqInfos :', fileReqInfos)

      // get token
      const token = this.fileToken // this.getFileToken(this.fileId)
      commitData.token = token
      commitData.userGit = this.userGit
      commitData.userBranches = this.userBranches
      // console.log('C > ConfirmCommit > confirmCommit > token :', token)

      // append commit message and infos
      commitData.message = this.buildCommitMessage
      const authorEmail = this.userEmail ? this.userEmail : 'contributor@multi.coop'
      const authorName = this.userName ? this.userName : 'anonymous contributor'
      // const authorSurname = this.userSurname ? this.userSurname : 'contributor'
      commitData.author = {
        email: authorEmail,
        name: authorName
        // surname: authorSurname,
        // nameComplete: `${authorName} ${authorSurname}`
      }

      // Send contribution request...
      const respContribution = await sendContribution(commitData)
      // console.log('\nC > ConfirmCommit > confirmCommit > respContribution :', respContribution)
      const respContributionErrors = respContribution.errors
      // const respContributionData = respContribution.data
      const respContributionResume = respContribution.resume

      // clean store from committing
      // console.log('C > ConfirmCommit > confirmCommit > 1 > this.isCommitting : ', this.isCommitting)
      this.updateCommitting({ fileId: this.fileId, isCommitting: false, data: respContributionResume })
      // console.log('C > ConfirmCommit > confirmCommit > 2 > this.isCommitting : ', this.isCommitting)
      this.updateFileDialogs('NotificationCommit', { notif: respContributionResume })

      // update errors if any
      if (respContributionErrors && respContributionErrors.length) {
        const reqErrors = respContributionErrors.map(err => { return { ...err, fileId: this.fileId, errorId: this.uuidv4() } })
        reqErrors.forEach(err => {
          if (!this.checkIfErrorExists(err)) {
            this.updateReqErrors({ error: err, addToErrors: true })
            this.updateFileDialogs('NotificationErrors', { error: err })
          }
        })
      } else if (!respContributionResume.branchExists) {
        // update user's branches for current file
        const commitBranch = {
          branch: respContributionResume.branch,
          userBranch: true,
          activeBranch: true,
          hasMergeRequest: !!respContributionResume.mergeRequestUrl,
          branchUrl: respContributionResume.branchUrl,
          mergeRequestUrl: respContributionResume.mergeRequestUrl
        }
        // console.log('C > ConfirmCommit > confirmCommit > commitBranch :', commitBranch)
        this.updateUserBranches({ fileId: this.fileId, branches: commitBranch })
      }
      // set isSaving as false now all is finished
      // console.log('C > ConfirmCommit > confirmCommit > this.updateSaving ...')
      this.updateSaving({ fileId: this.fileId, isSaving: false })
      // console.log('C > ConfirmCommit > confirmCommit > this.fileIsSaving : ', this.fileIsSaving)

      // close/remove dialog
      // console.log('C > ConfirmCommit > confirmCommit > this.removeFileDialog ...')
      // console.log('C > ConfirmCommit > confirmCommit > 1 > this.fileDialogs : ', this.fileDialogs)
      this.removeFileDialog(this.dialogId)
      // console.log('C > ConfirmCommit > confirmCommit > 2 > this.fileDialogs : ', this.fileDialogs)

      // track with matomo
      // console.log('C > ConfirmCommit > confirmCommit > this.trackEvent ...')
      this.trackEvent('confirmCommit')
    }
  }
}
</script>
