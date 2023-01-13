<template>
  <div
    class="UserOptions datami-component columns is-gapless is-mobile is-flex is-flex-grow-1"
    style="z-index: 2">
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
      :class="`datami-user-options-container column is-10 is-10-mobile is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between`">
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
      <!-- <ButtonFullscreen
        :file-id="fileId"
        :locale="locale"/> -->
      <ButtonDarkMode
        :locale="locale"/>
      <ButtonChangeLocale
        :file-id="fileId"
        :locale="locale"/>
    </div>

    <!-- OPTIONS SWITCHER -->
    <div
      :class="`column ${onlyPreview && !showOptions ? 'is-offset-10' : ''} is-2 is-2-mobile has-text-right`">
      <ButtomOptionsSwitch
        :file-id="fileId"
        :locale="locale"
        :only-preview="onlyPreview"
        @click="showOptions = !showOptions"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// import { mixinTooltip } from '@/utils/mixins.js'

export default {
  name: 'UserOptions',
  components: {
    ButtonEditFile: () => import(/* webpackChunkName: "ButtonEditFile" */ '@/components/user/ButtonEditFile.vue'),
    ButtonReloadFile: () => import(/* webpackChunkName: "ButtonReloadFile" */ '@/components/user/ButtonReloadFile.vue'),
    ButtonDownloadFile: () => import(/* webpackChunkName: "ButtonDownloadFile" */ '@/components/user/ButtonDownloadFile.vue'),
    ButtonChangeUserToken: () => import(/* webpackChunkName: "ButtonChangeUserToken" */ '@/components/user/ButtonChangeUserToken.vue'),
    ButtonChangeUserBranch: () => import(/* webpackChunkName: "ButtonChangeUserBranch" */ '@/components/user/ButtonChangeUserBranch.vue'),
    ButtonChangeLocale: () => import(/* webpackChunkName: "ButtonChangeLocale" */ '@/components/user/ButtonChangeLocale.vue'),
    ButtonCopyWidgetHtml: () => import(/* webpackChunkName: "ButtonCopyWidgetHtml" */ '@/components/user/ButtonCopyWidgetHtml.vue'),
    // ButtonFullscreen: () => import(/* webpackChunkName: "ButtonFullscreen" */ '@/components/user/ButtonFullscreen.vue'),
    ButtonDarkMode: () => import(/* webpackChunkName: "ButtonDarkMode" */ '@/components/user/ButtonDarkMode.vue'),
    ButtomOptionsSwitch: () => import(/* webpackChunkName: "ButtomOptionsSwitch" */ '@/components/user/ButtomOptionsSwitch.vue')
  },
  // mixins: [mixinTooltip],
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
