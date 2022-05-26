<template>
  <div class="UserOptions gitribute-component is-flex is-flex-direction-row is-align-items-center is-justify-content-right">
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
      :locale="locale"/>
  </div>
</template>

<script>
import ButtonReloadFile from '@/components/user/ButtonReloadFile'
import ButtonDownloadFile from '@/components/user/ButtonDownloadFile'
import ButtonChangeUserToken from '@/components/user/ButtonChangeUserToken'
import ButtonChangeUserBranch from '@/components/user/ButtonChangeUserBranch'
import ButtonChangeLocale from '@/components/user/ButtonChangeLocale'

export default {
  name: 'UserOptions',
  components: {
    ButtonReloadFile,
    ButtonDownloadFile,
    ButtonChangeUserToken,
    ButtonChangeUserBranch,
    ButtonChangeLocale
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
