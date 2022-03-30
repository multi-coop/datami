<template>
  <div class="NavbarSkeleton content">
    <!-- FILE TITLE -->
    <div class="">
      <p class="is-size-3">
        <b-icon
          :icon="fileIcon"/>
        {{ title }}
      </p>
      <!-- FILE INFOS -->
      <p>
        {{ t('file')}} :
        <code>
          {{ gitObj.id }}
        </code>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'NavbarSkeleton',
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
      console.log('\nC > NavbarSkeleton > fileIcon > this.gitObj : ', this.gitObj)
      const iconObj = this.icons.find(t => t.allowedTypes.includes(this.gitObj.filetype))
      console.log('C > NavbarSkeleton > fileIcon > iconObj : ', iconObj)
      return iconObj.icon || this.icons[0].icon
    }
  }
}
</script>
