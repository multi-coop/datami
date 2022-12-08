<template>
  <div class="UserOptions datami-component columns is-gapless is-mobile is-flex is-flex-grow-1">
    <div
      v-if="!onlyPreview && !showOptions"
      :class="`column is-10 is-10-mobile`">
      <ButtonEditFile
        :file-id="fileId"
        :locale="locale"
        @updateShowOptions="showOptions = false"/>
    </div>
    <div
      v-if="showOptions"
      class="column is-10 is-10-mobile is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between">
      <ButtonCopyWidgetHtml
        :file-id="fileId"
        :locale="locale"/>
      <ButtonReloadFile
        :file-id="fileId"
        :locale="locale"/>
      <ButtonDownloadFile
        :file-id="fileId"
        :locale="locale"/>
      <ButtonChangeUserToken
        v-if="!onlyPreview"
        :file-id="fileId"
        :locale="locale"/>
      <ButtonChangeUserBranch
        v-if="!onlyPreview"
        :file-id="fileId"
        :locale="locale"/>
      <ButtonFullscreen
        :file-id="fileId"
        :locale="locale"/>
      <ButtonDarkMode
        :locale="locale"/>
      <ButtonChangeLocale
        :file-id="fileId"
        :locale="locale"/>
    </div>
    <div
      :class="`column ${onlyPreview && !showOptions ? 'is-offset-10' : ''} is-2 is-2-mobile has-text-right`">
      <b-tooltip
        :label="t(`user.${showOptions ? 'hideOptions' : 'showOptions'}`, locale)"
        :type="isDarkMode ? 'is-white' : 'is-dark'"
        position="is-top">
        <b-button
          :type="isDarkMode ? 'is-white' : ''"
          :outlined="isDarkMode"
          :class="isDarkMode ? 'datami-darkmode' : ''"
          icon-left="cog-outline"
          size="is-small"
          expanded
          @click="showOptions = !showOptions"/>
      </b-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// import ButtonEditFile from '@/components/user/ButtonEditFile'
// import ButtonReloadFile from '@/components/user/ButtonReloadFile'
// import ButtonDownloadFile from '@/components/user/ButtonDownloadFile'
// import ButtonChangeUserToken from '@/components/user/ButtonChangeUserToken'
// import ButtonChangeUserBranch from '@/components/user/ButtonChangeUserBranch'
// import ButtonChangeLocale from '@/components/user/ButtonChangeLocale'
// import ButtonCopyWidgetHtml from '@/components/user/ButtonCopyWidgetHtml'
// import ButtonFullscreen from '@/components/user/ButtonFullscreen'
// import ButtonDarkMode from '@/components/user/ButtonDarkMode'

export default {
  name: 'UserOptions',
  components: {
    // ButtonEditFile,
    // ButtonReloadFile,
    // ButtonDownloadFile,
    // ButtonChangeUserToken,
    // ButtonChangeUserBranch,
    // ButtonChangeLocale,
    // ButtonCopyWidgetHtml,
    // ButtonFullscreen,
    // ButtonDarkMode
    ButtonEditFile: () => import(/* webpackChunkName: "ButtonEditFile" */ '@/components/user/ButtonEditFile.vue'),
    ButtonReloadFile: () => import(/* webpackChunkName: "ButtonReloadFile" */ '@/components/user/ButtonReloadFile.vue'),
    ButtonDownloadFile: () => import(/* webpackChunkName: "ButtonDownloadFile" */ '@/components/user/ButtonDownloadFile.vue'),
    ButtonChangeUserToken: () => import(/* webpackChunkName: "ButtonChangeUserToken" */ '@/components/user/ButtonChangeUserToken.vue'),
    ButtonChangeUserBranch: () => import(/* webpackChunkName: "ButtonChangeUserBranch" */ '@/components/user/ButtonChangeUserBranch.vue'),
    ButtonChangeLocale: () => import(/* webpackChunkName: "ButtonChangeLocale" */ '@/components/user/ButtonChangeLocale.vue'),
    ButtonCopyWidgetHtml: () => import(/* webpackChunkName: "ButtonCopyWidgetHtml" */ '@/components/user/ButtonCopyWidgetHtml.vue'),
    ButtonFullscreen: () => import(/* webpackChunkName: "ButtonFullscreen" */ '@/components/user/ButtonFullscreen.vue'),
    ButtonDarkMode: () => import(/* webpackChunkName: "ButtonDarkMode" */ '@/components/user/ButtonDarkMode.vue')
  },
  props: {
    fileId: {
      default: null,
      type: String
    },
    onlyPreview: {
      default: false,
      type: Boolean
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      showOptions: false
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode',
      isDarkMode: 'git-storage/isDarkMode'
    }),
    currentViewMode () {
      return this.getViewMode(this.fileId)
    }
  },
  beforeMount () {
    this.showOptions = this.onlyPreview
  }
}
</script>

<style scoped>
  .datami-darkmode {
    background-color: #2d2d30 !important;
  }
</style>
