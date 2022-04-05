<template>
  <div class="NavbarSkeleton content">
    <div class="columns is-multiline is-mobile mb-4">
      <!-- FILE TITLE -->
      <div class="column is-9">
        <FileTitle
          :title="title"
          :git-obj="gitObj"
          :file-type-family="fileTypeFamily"
          :file-icon="fileIcon"
          :locale="locale"/>
      </div>
      <!-- USER BUTTONS -->
      <div class="column is-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-right">
        <ButtonReloadFile
          :git-obj="gitObj"
          :locale="locale"/>
        <ButtonDownloadFile
          :git-obj="gitObj"
          :locale="locale"/>
        <ButtonChangeUserToken
          :git-obj="gitObj"
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
    gitObj: {
      default: undefined,
      type: Object
    },
    fileInfos: {
      default: undefined,
      type: Object
    },
    fileTypeFamily: {
      default: '',
      type: String
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      icons: [
        {
          icon: 'note-text-outline',
          allowedTypes: ['md']
        },
        {
          icon: 'table',
          allowedTypes: ['csv', 'tsv']
        },
        {
          icon: 'code-json',
          allowedTypes: ['json', 'geojson']
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    }),
    fileIcon () {
      // console.log('\nC > NavbarSkeleton > fileIcon > this.gitObj : ', this.gitObj)
      const iconObj = this.icons.find(t => t.allowedTypes.includes(this.gitObj.filetype))
      // console.log('C > NavbarSkeleton > fileIcon > iconObj : ', iconObj)
      return iconObj.icon || this.icons[0].icon
    }
  }
}
</script>
