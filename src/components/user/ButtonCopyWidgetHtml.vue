<template>
  <div class="ButtonCopyWidgetHtml datami-component">
    <b-tooltip
      :label="t('actions.copyWidget', locale)"
      :type="`${isDarkMode ? 'is-white' : 'is-dark'}`"
      multilined
      position="is-left">
      <b-button
        size="is-small"
        :class="`ml-1 is-small ${isDarkMode ? 'has-background-dark has-text-white' : ''}`"
        :type="isDarkMode ? 'is-white' : ''"
        :outlined="isDarkMode"
        icon-left="code-tags"
        @click="CopyWidgetHtml()"
        @mouseover="showGlobalTooltip($event, { position: 'left', type: 'info', label: t('actions.copyWidget', locale) })"
        @mouseleave="hideGlobalTooltip"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonCopyWidgetHtml',
  mixins: [
    mixinTooltip,
    mixinGlobal
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    locale: {
      default: 'en',
      type: String
    },
    fromMultiFiles: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      urlMulti: (state) => state.urlMulti,
      urlSourceCode: (state) => state.urlSourceCode
    })
  },
  methods: {
    CopyWidgetHtml () {
      const prettyChar = 2
      const datamiLink = `<a class="has-text-weight-bold has-text-dark is-underlined" href="${this.urlSourceCode}" target="_blank">Datami</a>`
      let widgetName
      const widgetProvider = process.env.VUE_APP_DATAMI_DEPLOY_DOMAIN ?? 'datami-widget.multi.coop'
      const fileOpts = { ...this.fileOptions }
      delete fileOpts.uuid
      let widgetTitle
      let fileOptionsStr

      const scriptStr = 'script'
      const quoteReplacer = '&lsquo;'

      let htmlStr = `\n
<!-- DATAMI - contribute with GIT ...but without minding it -->\r
<!-- ${this.t('credits.reclaim', 'en')} ${this.t('credits.byLove', 'en')} ${this.t('credits.byCooperative', 'en')} multi : ${this.urlMulti} -->\n
<!-- DATAMI WIDGET'S HTML BLOCK -->\r
`

      if (!this.fromMultiFiles) {
        // CASE : GITFILE OR EXPLOWIKI
        // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > this.gitObj : ', this.gitObj)
        widgetTitle = this.gitObj.title.replaceAll("'", quoteReplacer)
        const isWiki = this.gitObj.provider === 'mediawiki'
        widgetName = `datami-${isWiki ? 'explowiki' : 'file'}`
        const fileKey = isWiki ? 'wikilist' : 'gitfile'
        const wikiPagesStr = isWiki && this.gitObj.wikipages ? `\r  wikipages='${JSON.stringify(this.gitObj.wikipages, null, prettyChar)}'\r` : ''

        // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > fileOpts : ', fileOpts)

        // Copy schema settings
        const fileSchema = fileOpts.schema
        fileOpts.schema = fileSchema && fileSchema.file ? { file: fileSchema.file } : fileSchema

        // Copy custom props settings
        const fileCustomProps = fileOpts['fields-custom-properties']
        fileOpts['fields-custom-properties'] = fileCustomProps && fileCustomProps.file ? { file: fileCustomProps.file } : fileCustomProps
        delete fileOpts.customProps

        // Copy cards settings
        const fileCardsSettings = fileOpts.cardssettings
        // console.log('C > ButtonCopyWidgetHtml > CopyWidgetHtml > fileCardsSettings : ', fileCardsSettings)
        fileOpts.cardssettings = fileCardsSettings && fileCardsSettings.file ? { file: fileCardsSettings.file } : fileCardsSettings

        // Copy dataviz settings
        const fileDatavizSettings = fileOpts.datavizview
        // console.log('C > ButtonCopyWidgetHtml > CopyWidgetHtml > fileDatavizSettings : ', fileDatavizSettings)
        fileOpts.datavizview = fileDatavizSettings && fileDatavizSettings.file ? { file: fileDatavizSettings.file } : fileDatavizSettings
        if (fileDatavizSettings && fileDatavizSettings.file) {
          fileOpts.datavizview = {
            activate: fileDatavizSettings.activate,
            default: fileDatavizSettings.default,
            file: fileDatavizSettings.file
          }
        } else {
          fileOpts.datavizview = fileDatavizSettings
        }

        // Copy maps settings
        const fileMapSettings = fileOpts.mapview
        // console.log('C > ButtonCopyWidgetHtml > CopyWidgetHtml > fileMapSettings : ', fileMapSettings)
        if (fileMapSettings) {
          const mapViewSettings = {
            activate: fileMapSettings.activate,
            default: fileMapSettings.default,
            maps: []
          }
          fileMapSettings.maps.forEach(mapOpts => {
            const mapSettings = mapOpts.file ? { file: mapOpts.file, cols: mapOpts.cols, title: mapOpts.title } : mapOpts
            mapViewSettings.maps.push(mapSettings)
          })
          fileOpts.mapview = mapViewSettings
        }

        fileOptionsStr = JSON.stringify(fileOpts, null, prettyChar).replaceAll("'", quoteReplacer)
        // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > fileOptionsStr : ', fileOptionsStr)
        htmlStr += `\
<${widgetName}\r
  title="${widgetTitle}"\r
  ${fileKey}="${this.gitObj.id}"\r${wikiPagesStr}
  options='${fileOptionsStr}'\r
  onlypreview="${!!this.gitObj.onlyPreview}"\r
  locale="${this.locale}"\r
></${widgetName}>\n
`
      } else {
        // CASE : MULTI-FILES
        widgetTitle = fileOpts.title.replaceAll("'", quoteReplacer)
        widgetName = 'datami-multi-files'
        // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > fromMultiFiles > fileOpts : ', fileOpts)
        fileOptionsStr = JSON.stringify(fileOpts.options, null, prettyChar)
        const gitfilesStr = JSON.stringify(fileOpts.gitfiles, null, prettyChar).replaceAll("'", quoteReplacer)
        htmlStr += `\
<${widgetName}\r
  title="${widgetTitle}"\r
  options='${fileOptionsStr}'\r
  gitfiles='${gitfilesStr}'\r
  locale="${this.locale}"\r
></${widgetName}>\n
`
      }

      htmlStr += `\
<!-- DATAMI WIDGET'S APP.JS SCRIPT -->\r
<${scriptStr} src="https://${widgetProvider}/js/app.js" type="text/javascript" defer></${scriptStr}>\n
`

      // console.log('C > ButtonCopyWidgetHtml > CopyWidgetHtml > htmlStr : \n', htmlStr)
      const widgetBlocStr = `&lt;${widgetName}&gt;`
      const title = this.t('widget.widgetCopied', this.locale)
      let message = `
      <p>${this.t('widget.widgetCopiedMsg', this.locale, {
          widgetTitle: `<code>${widgetTitle}</code>`,
          widgetName: `<code>${widgetBlocStr}</code>`
      })}</p>`
      message += `<br><p>${this.t('widget.widgetUse', this.locale)}</p>`
      message += `<br><p>${this.t('global.thanks', this.locale, { datamiRepo: datamiLink })}</p>`
      const confirmText = this.t('global.understood', this.locale)

      navigator.clipboard.writeText(htmlStr)
        .then(
          this.$buefy.dialog.alert({
            title: title,
            message: message,
            type: 'is-dark',
            icon: 'code-tags',
            hasIcon: true,
            confirmText: confirmText
          })
        )

      // track with matomo
      this.trackEvent('click')
    }
  }
}
</script>
