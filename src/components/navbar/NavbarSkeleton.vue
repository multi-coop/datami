<template>
  <div class="NavbarSkeleton content">
    <div class="columns is-multiline">
      <!-- FILE TITLE -->
      <div class="column is-9">
        <p class="is-size-3">
          <b-icon :icon="fileIcon"/>
          {{ title }}
          <b-tooltip
            :label="t('fileInfos')"
            type="is-dark"
            position="is-right">
            <b-icon icon="dots-horizontal"/>
          </b-tooltip>
        </p>
      </div>
      <!-- USER BUTTONS -->
      <div class="column is-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-right">
        <ButtonReloadFile/>
        <ButtonDownloadFile/>
        <ButtonChangeLocale
          :locale="locale"/>
        <ButtonChangeUserToken/>
      </div>

      <!-- FILE INFOS -->
      <div class="column is-full">
        <p>
          {{ t('file')}} :
          <code>
            {{ gitObj.id }}
          </code>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import ButtonReloadFile from '@/components/user/ButtonReloadFile'
import ButtonDownloadFile from '@/components/user/ButtonDownloadFile'
import ButtonChangeLocale from '@/components/user/ButtonChangeLocale'
import ButtonChangeUserToken from '@/components/user/ButtonChangeUserToken'

export default {
  name: 'NavbarSkeleton',
  components: {
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
    ...mapState({
    }),
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
