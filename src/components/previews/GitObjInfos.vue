<template>
  <div class="GitObjInfos gitribute-component tile is-ancestor mt-2 mb-n-1">
    <div class="tile is-vertical is-12">
      <!-- GITOBJ INFOS -->
      <div
        v-for="info in infoRowsPopulated"
        :key="info.key"
        class="tile is-12">
        <div
          v-if="gitObj[info.key]"
          class="tile is-parent py-1">
          <div class="tile is-child is-4">
            <b-icon
              :icon="info.icon"
              size="is-small"/>&nbsp;
            {{ t(info.txt, locale) }}
          </div>
          <div class="tile is-child is-8 pl-2">
            <span
              v-if="info.link">
              <b-icon
                class="mr-2"
                size="is-small"
                icon="open-in-new"/>
              <a
                target="_blank"
                :href="gitObj[info.key]"
                class="outlink"
                @click="trackLink(gitObj[info.key])">
                {{ t(info.linkTxt, locale) }}
              </a>
            </span>
            <code v-else>
              {{ gitObj[info.key] }}
            </code>
          </div>
        </div>
      </div>

      <!-- SCHEMA / OPTIONS FILES INFO IF ANY -->
      <div
        v-for="optionsInfos in optionsRows"
        :key="optionsInfos.key"
        class="tile is-12">
        <div
          v-if="findFromPath(optionsInfos.key, fileOptions)"
          class="tile is-parent py-1">
          <div class="tile is-child is-4">
            <b-icon
              :icon="optionsInfos.icon"
              size="is-small"/>&nbsp;
            {{ t(optionsInfos.txt, locale) }}
          </div>
          <div class="tile is-child is-8 pl-2">
            <span
              v-if="optionsInfos.link">
              <b-icon
                class="mr-2"
                size="is-small"
                icon="open-in-new"/>
              <a
                target="_blank"
                :href="findFromPath(optionsInfos.key, fileOptions)"
                class="outlink"
                @click="trackLink(findFromPath(optionsInfos.key, fileOptions))">
                <span v-if="optionsInfos.schemaLink">
                  {{ schemaFileName }}
                </span>
                <span v-else-if="optionsInfos.schemaProps">
                  {{ customPropsFileName }}
                </span>
                <span v-else>
                  {{ filenameFromPath(optionsInfos.key, fileOptions) }}
                </span>
              </a>
            </span>
            <code v-else>
              {{ findFromPath(optionsInfos.key, fileOptions, true) }}
            </code>
          </div>
        </div>
      </div>

      <div v-if="optionsMapsList">
        <div
          v-for="(mapFile, idx) in optionsMapsList"
          :key="`map-config-${idx}`"
          class="tile is-12">
          <div
            class="tile is-parent py-1">
            <div class="tile is-child is-4">
              <b-icon
                icon="link"
                size="is-small"/>&nbsp;
              {{ t('file.fileMaps', locale) }} ({{ idx }})
            </div>
            <div class="tile is-child is-8 pl-2">
              <span>
                <b-icon
                  class="mr-2"
                  size="is-small"
                  icon="open-in-new"/>
                <a
                  target="_blank"
                  :href="mapFile"
                  class="outlink"
                  @click="trackLink(mapFile)">
                  {{ trimFileName(mapFile) }}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- DOCUMENTATION INFOS -->
      <hr class="mt-2 mb-2">
      <div
        class="tile is-12">
        <div
          class="tile is-parent py-1">
          <div class="tile is-child is-4">
            <b-icon
              icon="book-open-variant"
              size="is-small"/>&nbsp;
            {{ t('global.documentation', locale) }}
          </div>
          <div class="tile is-child is-8 pl-2">
            <span>
              <b-icon
                class="mr-2"
                size="is-small"
                icon="book-open-variant"/>
              <a
                target="_blank"
                :href="`https://${docsUrl}`"
                class="outlink"
                @click="trackLink(`https://${docsUrl}`)">
                {{ t('global.docsWebsite', locale) }}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

import { providerIcons, typesIcons } from '@/utils/fileTypesUtils.js'

export default {
  name: 'GitObjInfos',
  mixins: [mixinGlobal],
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
      providerIcons: providerIcons,
      icons: typesIcons,
      infoRows: [
        { txt: 'file.fileName', key: 'filefullname', icon: 'file' },
        { txt: 'git.provider', key: 'provider', icon: '' },
        { txt: 'git.sourceBranch', key: 'branch', icon: 'source-branch' },
        { txt: 'file.fileType', key: 'filetype', icon: '' },
        { txt: 'file.fileFamily', key: 'filefamily', icon: '' },
        { txt: 'file.fileUrl', key: 'id', icon: 'open-in-new', link: true, linkTxt: 'file.linkToFile' },
        { txt: 'file.fileUrlRaw', key: 'fileraw', icon: 'open-in-new', link: true, linkTxt: 'file.linkToFileRaw' }
      ],
      optionsRows: [
        { txt: 'file.fileSchema', key: 'schema.file', icon: 'link', link: true, schemaLink: true },
        { txt: 'file.fileCustomProps', key: 'customProps.file', icon: 'link', link: true, schemaProps: true },
        { txt: 'file.fileDataviz', key: 'datavizview.file', icon: 'link', link: true }
      ]
    }
  },
  computed: {
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
            // raw.icon = this.gitObj.provider
            raw.icon = this.providerIcon
            break
        }
        return raw
      })
      return infos
    },
    providerIcon () {
      const providerIconObj = this.providerIcons.find(t => t.providers.includes(this.gitObj.provider))
      return providerIconObj.icon || this.icons[0].icon
    },
    fileIcon () {
      const iconObj = this.icons.find(t => t.allowedTypes.includes(this.gitObj.filetype))
      return iconObj.icon || this.icons[0].icon
    },
    schemaFileName () {
      const schemaFile = this.fileSchema && this.fileSchema.file
      // console.log('\nC > schemaFileName > schemaFile : ', schemaFile)
      return this.trimFileName(schemaFile)
    },
    customPropsFileName () {
      const propsFile = this.fileCustomProps && this.fileCustomProps.file
      // console.log('\nC > customPropsFileName > propsFile : ', propsFile)
      return this.trimFileName(propsFile)
    },
    datavizFileName () {
      const datavizFile = this.datavizViewOptions && this.datavizViewOptions.file
      // console.log('\nC > datavizFileName > datavizFile : ', datavizFile)
      return this.trimFileName(datavizFile)
    },
    optionsMapsList () {
      // console.log('\nC > optionsMapsList > this.fileOptions : ', this.fileOptions)
      const mapSettings = this.mapViewOptions
      return mapSettings && mapSettings.maps.map(m => m.file)
    },
    docsUrl () {
      const documentationUrl = process.env.VUE_APP_GITRIBUTE_DOCUMENTATION || 'gitribute-docs.multi.coop'
      return documentationUrl
    }
  },
  methods: {
    trimFileName (file) {
      // console.log('C > schemaFileName > file : ', file)
      return file && file.split('/').at(-1)
    },
    filenameFromPath (key, options) {
      const fullname = this.findFromPath(key, options)
      return this.trimFileName(fullname)
    }
  }
}
</script>

<style scoped>

a {
  color: grey;
  text-decoration: underline;
}

</style>
