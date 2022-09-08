<template>
  <div
    class="UserOptions datami-component is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between"
    style="flex: fit-content;">
    <ButtonEditFile
      v-if="!onlyPreview"
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
    <ButtonCopyWidgetHtml
      :file-id="fileId"
      :locale="locale"/>
    <ButtonChangeLocale
      :file-id="fileId"
      :locale="locale"/>
    <ButtonFullscreen
      :file-id="fileId"
      :locale="locale"/>
  </div>
</template>

<script>
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
  }
}
</script>
