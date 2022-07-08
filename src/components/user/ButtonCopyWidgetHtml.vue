<template>
  <div class="ButtonCopyWidgetHtml gitribute-component">
    <b-tooltip
      :label="t('actions.copyWidget', locale)"
      type="is-dark"
      position="is-top">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="code-tags"
        @click="CopyWidgetHtml()"/>
    </b-tooltip>
  </div>
</template>

<script>

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonCopyWidgetHtml',
  mixins: [mixinGlobal],
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
  methods: {
    CopyWidgetHtml () {
      const prettyChar = 2
      const gitributeLink = '<a class="has-text-weight-bold has-text-dark is-underlined" href="https://giltlab.com/multi-coop/gitribute" target="_blank">Gitribute</a>'
      let widgetName
      const widgetProvider = process.env.VUE_APP_GITRIBUTE_DEPLOY_DOMAIN ?? 'gitribute.multi.coop'
      const fileOpts = { ...this.fileOptions }
      delete fileOpts.uuid
      let widgetTitle
      let fileOptionsStr

      let htmlStr = `\
<!-- GITRIBUTE WIDGET BLOCK -->\r
<script src="https://${widgetProvider}/js/app.js" type="text/javascript" defer body/>\n
`
      if (!this.fromMultiFiles) {
        // CASE : GITFILE OR EXPLOWIKI
        // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > this.gitObj : ', this.gitObj)
        widgetTitle = this.gitObj.title.replaceAll("'", '&quot;')
        const isWiki = this.gitObj.provider === 'mediawiki'
        widgetName = `multi-gitribute-${isWiki ? 'explowiki' : 'file'}`
        const fileKey = isWiki ? 'wikilist' : 'gitfile'
        const wikiPagesStr = isWiki && this.gitObj.wikipages ? `\r  wikipages='${JSON.stringify(this.gitObj.wikipages, null, prettyChar)}'\r` : ''

        // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > fileOpts : ', fileOpts)
        const fileSchema = fileOpts.schema
        fileOpts.schema = fileSchema && fileSchema.file ? { file: fileSchema.file } : fileSchema

        const fileCustomProps = fileOpts['fields-custom-properties']
        fileOpts['fields-custom-properties'] = fileCustomProps && fileCustomProps.file ? { file: fileCustomProps.file } : fileCustomProps
        delete fileOpts.customProps

        fileOptionsStr = JSON.stringify(fileOpts, null, prettyChar).replaceAll("'", '&quot;')
        // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > fileOptionsStr : ', fileOptionsStr)
        htmlStr += `\
<${widgetName}\r
  title="${widgetTitle}"\r
  ${fileKey}="${this.gitObj.id}"\r${wikiPagesStr}
  options='${fileOptionsStr}'\r
  onlypreview="${!!this.gitObj.onlyPreview}"\r
  locale="${this.locale}"\r
/>\n
`
      } else {
        // CASE : MULTI-FILES
        widgetTitle = fileOpts.title.replaceAll("'", '&quot;')
        widgetName = 'multi-gitribute-multi-files'
        // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > fromMultiFiles > fileOpts : ', fileOpts)
        fileOptionsStr = JSON.stringify(fileOpts.options, null, prettyChar)
        const gitfilesStr = JSON.stringify(fileOpts.gitfiles, null, prettyChar).replaceAll("'", '&quot;')
        htmlStr += `\
<${widgetName}\r
  title="${widgetTitle}"\r
  options='${fileOptionsStr}'\r
  gitfiles='${gitfilesStr}'\r
  locale="${this.locale}"\r
/>\n
`
      }

      htmlStr += `\
<!-- ${this.t('credits.reclaim', 'en')} ${this.t('credits.byLove', 'en')} ${this.t('credits.byCooperative', 'en')} multi.coop -->\
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
      message += `<br><p>${this.t('global.thanks', this.locale, { gitributeRepo: gitributeLink })}</p>`
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
    }
  }
}
</script>
