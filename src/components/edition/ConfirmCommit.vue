<template>
  <div class="ConfirmCommit container">
    <div class="columns is-vcentered is-centered">
      <div class="column is-9">
        <div class="card">
          <!-- HEADER -->
          <header class="card-header">
            <p class="card-header-title">
              {{ t('commitChanges', locale) }}
            </p>
            <button
              class="card-header-icon"
              @click="cancelCommit()">
              <b-icon
                icon="close"/>
            </button>
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
                  :label="t('userMessage', locale)">
                  <h5 class="has-text-centered mt-4">
                    {{ t('userIntro', locale) }}
                  </h5>
                  <div class="columns is-centered mt-3">
                    <div class="column is-10">
                      <b-field class="mt-4">
                        <!-- EMAIL -->
                        <template #label>
                          <b-icon
                            icon="at"
                            size="is-small"/>&nbsp;
                          {{ t('userEmail', locale) }}
                        </template>
                        <b-input
                          v-model="userEmail"
                          type="email"
                          :placeholder="t('optional', locale)"
                          icon-right="close-circle"
                          icon-right-clickable
                          @icon-right-click="clearEmail"/>
                      </b-field>
                      <!-- MESSAGE -->
                      <b-field class="mt-4">
                        <template #label>
                          <b-icon
                            icon="email"
                            size="is-small"/>&nbsp;
                          {{ t('userMessage', locale) }}
                        </template>
                        <b-input
                          v-model="userMessage"
                          type="textarea"
                          maxlength="500"
                          icon-right="close-circle"
                          icon-right-clickable
                          @icon-right-click="clearMessage"/>
                      </b-field>
                      <!-- COMMIT BRANCH -->
                      <p class="has-text-weight-bold">
                        <b-icon
                          icon="source-branch"
                          size="is-small"/>&nbsp;
                        {{ t('commitBranch', locale) }}
                      </p>
                      <p class="">
                        <code>{{ commitBranch }}</code>
                      </p>
                    </div>
                  </div>
                </b-tab-item>

                <!-- CHANGES -->
                <b-tab-item
                  :label="t('changes', locale)">
                  <h5 class="has-text-centered mt-4 mb-5">
                    {{ t('editedPreview', locale) }}
                  </h5>
                  <pre><code>{{ edited }}</code></pre>
                </b-tab-item>

                <!-- FILE INFOS -->
                <b-tab-item
                  :label="t('fileSource', locale)">
                  <h5 class="has-text-centered mt-4 mb-5">
                    {{ t('fileInfos', locale) }}
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
              @click="cancelCommit()">
              {{ t('cancel', locale) }}
            </b-button>
            <b-button
              class="card-footer-item mx-3"
              icon-left="check"
              type="is-dark"
              @click="confirmCommit()">
              {{ t('send', locale) }}
            </b-button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

import {
  postNewBranch
  // putCommit
} from '@/utils/getData.js'

import GitObjInfos from '@/components/previews/GitObjInfos'

export default {
  name: 'ConfirmCommit',
  components: {
    GitObjInfos
  },
  props: {
    fileId: {
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
      activeTab: 0,
      userEmail: undefined,
      userMessage: ''
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getGitInfosObj: 'getGitInfosObj',
      buildNewBranchName: 'buildNewBranchName',
      getCommitData: 'git-data/getCommitData',
      getFileReqInfosObj: 'getFileReqInfosObj'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
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
  methods: {
    ...mapActions({
      updateSaving: 'git-data/updateSaving'
    }),
    clearEmail () {
      this.userEmail = ''
    },
    clearMessage () {
      this.userMessage = ''
    },
    cancelCommit () {
      this.updateSaving({ fileId: this.fileId, isSaving: false })
    },
    async confirmCommit () {
      console.log('C > ConfirmCommit > confirmCommit > this.fileId :', this.fileId)
      const commitData = this.getCommitData(this.fileId)
      console.log('C > ConfirmCommit > confirmCommit > commitData :', commitData)
      const fileReqInfos = this.getFileReqInfosObj(this.fileId)
      commitData.fileReqInfos = fileReqInfos
      console.log('C > ConfirmCommit > confirmCommit > commitDfileReqInfosata :', fileReqInfos)

      // send requests
      // create new branch
      const respBranch = await postNewBranch(commitData)
      console.log('C > ConfirmCommit > confirmCommit > respBranch :', respBranch)
      // put commit
      // const respCommit = await putCommit(commitData)
      // console.log('C > ConfirmCommit > confirmCommit > respCommit :', respCommit)
    }
  }
}
</script>
