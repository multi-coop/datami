<template>
  <div class="GiObjInfos tile is-ancestor my-2">
    <div class="tile is-vertical is-12">
      <div
        v-for="info in infoRowsPopulated"
        :key="info.key"
        class="tile is-12">
        <div class="tile is-parent py-1">
          <div class="tile is-child is-4">
            <b-icon
              :icon="info.icon"
              size="is-small"/>&nbsp;
            {{ t(info.txt, locale) }} :
          </div>
          <div class="tile is-child is-8">
            <a
              v-if="info.link"
              target="_blank"
              :href="gitObj[info.key]">
              {{ t(info.linkTxt, locale) }}
            </a>
            <code v-else>
              {{ gitObj[info.key] }}
            </code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { typesIcons } from '@/utils/fileTypesUtils.js'

export default {
  name: 'GitObjInofs',
  props: {
    fileId: {
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
      icons: typesIcons,
      infoRows: [
        { txt: 'file.fileName', key: 'filefullname', icon: 'file' },
        { txt: 'git.provider', key: 'provider', icon: '' },
        { txt: 'git.branch', key: 'branch', icon: 'source-branch' },
        { txt: 'file.fileType', key: 'filetype', icon: '' },
        { txt: 'file.fileFamily', key: 'filefamily', icon: '' },
        { txt: 'file.fileUrl', key: 'id', icon: 'open-in-new', link: true, linkTxt: 'file.linkToFile' },
        { txt: 'file.fileUrlRaw', key: 'fileraw', icon: 'open-in-new', link: true, linkTxt: 'file.linkToFileRaw' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getGitInfosObj: 'getGitInfosObj'
    }),
    gitObj () {
      return this.fileId && this.getGitInfosObj(this.fileId)
    },
    infoRowsPopulated () {
      let infos = [...this.infoRows]
      infos = infos.map(i => {
        const raw = { ...i }
        switch (i.key) {
          case 'filetype' :
            raw.icon = this.fileIcon
            break
          case 'filefamily' :
            raw.icon = this.fileIcon
            break
          case 'provider' :
            raw.icon = this.gitObj.provider
            break
        }
        return raw
      })
      return infos
    },
    fileIcon () {
      const iconObj = this.icons.find(t => t.allowedTypes.includes(this.gitObj.filetype))
      return iconObj.icon || this.icons[0].icon
    }
  }
}
</script>
