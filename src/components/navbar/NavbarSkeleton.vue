<template>
  <div class="NavbarSkeleton content">
    <div class="columns is-multiline is-mobile mb-4">
      <!-- FILE TITLE -->
      <div class="column is-9">
        <FileTitle
          :title="title"
          :file-id="fileId"
          :locale="locale"/>
      </div>
      <!-- USER BUTTONS -->
      <div class="column is-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-right">
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
        <ButtonChangeLocale
          :locale="locale"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import FileTitle from '@/components/navbar/FileTitle'
import ButtonReloadFile from '@/components/user/ButtonReloadFile'
import ButtonDownloadFile from '@/components/user/ButtonDownloadFile'
import ButtonChangeLocale from '@/components/user/ButtonChangeLocale'
import ButtonChangeUserToken from '@/components/user/ButtonChangeUserToken'

export default {
  name: 'NavbarSkeleton',
  components: {
    FileTitle,
    ButtonReloadFile,
    ButtonDownloadFile,
    ButtonChangeLocale,
    ButtonChangeUserToken
  },
  props: {
    title: {
      default: 'gitribute',
      type: String
    },
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
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  }
}
</script>
