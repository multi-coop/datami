<template>
  <div class="UserOptions datami-component columns is-gapless is-mobile is-flex is-flex-grow-1">
    <div
      v-if="!onlyPreview && !showOptions"
      :class="`column is-${showOptions ? 2 : 10} is-${showOptions ? 3 : 8}-tablet is-${showOptions ? 3 : 8}-mobile`">
      <ButtonEditFile
        :file-id="fileId"
        :locale="locale"
        @updateShowOptions="showOptions = false"/>
    </div>
    <div
      v-if="showOptions"
      class="column is-10 is-7-tablet is-7-mobile is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between">
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
      <ButtonChangeLocale
        :file-id="fileId"
        :locale="locale"/>
      <ButtonFullscreen
        :file-id="fileId"
        :locale="locale"/>
      <ButtonCopyWidgetHtml
        :file-id="fileId"
        :locale="locale"/>
    </div>
    <div
      class="column is-2 is-3-tablet is-3-mobile has-text-right">
      <b-tooltip
        :label="t(`user.${showOptions ? 'hideOptions' : 'showOptions'}`, locale)"
        type="is-dark"
        position="is-top">
        <b-button
          size="is-small"
          type="is-text"
          class="ml-1"
          expanded
          icon-left="dots-vertical"
          @click="showOptions = !showOptions"/>
      </b-tooltip>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

import ButtonEditFile from '@/components/user/ButtonEditFile'
import ButtonReloadFile from '@/components/user/ButtonReloadFile'
import ButtonDownloadFile from '@/components/user/ButtonDownloadFile'
import ButtonChangeUserToken from '@/components/user/ButtonChangeUserToken'
import ButtonChangeUserBranch from '@/components/user/ButtonChangeUserBranch'
import ButtonChangeLocale from '@/components/user/ButtonChangeLocale'
import ButtonCopyWidgetHtml from '@/components/user/ButtonCopyWidgetHtml'
import ButtonFullscreen from '@/components/user/ButtonFullscreen'

export default {
  name: 'UserOptions',
  components: {
    ButtonEditFile,
    ButtonReloadFile,
    ButtonDownloadFile,
    ButtonChangeUserToken,
    ButtonChangeUserBranch,
    ButtonChangeLocale,
    ButtonCopyWidgetHtml,
    ButtonFullscreen
  },
  mixins: [mixinGlobal],
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
  }
}
</script>
