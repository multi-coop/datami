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
    }
  },
  methods: {
    CopyWidgetHtml () {
      // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > this.gitObj : ', this.gitObj)
      const widgetProvider = process.env.VUE_APP_GITRIBUTE_DEPLOY_DOMAIN ?? 'multi-gitribute.netlify.app'
      const isWiki = this.gitObj.provider === 'mediawiki'
      const fileKey = isWiki ? 'wikilist' : 'gitfile'
      const wikiPagesStr = isWiki && this.gitObj.wikipages ? `\r  wikipages='${JSON.stringify(this.gitObj.wikipages, null, '\t')}'\r` : ''
      const fileSchema = this.fileOptions.schema
      const fileCustomProps = this.fileOptions['fields-custom-properties']
      const fileOpts = { ...this.fileOptions }
      delete fileOpts.uuid
      // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > fileOpts : ', fileOpts)
      fileOpts.schema = fileSchema && fileSchema.file ? { file: fileSchema.file } : fileSchema
      fileOpts['fields-custom-properties'] = fileCustomProps && fileCustomProps.file ? { file: fileCustomProps.file } : fileCustomProps
      const fileOptionsStr = JSON.stringify(fileOpts, null, '\t')
      // console.log('\nC > ButtonCopyWidgetHtml > CopyWidgetHtml > fileOptionsStr : ', fileOptionsStr)
      const htmlStr = `\
<!-- GITRIBUTE WIDGET BLOCK -->\r
<script src="https://${widgetProvider}/js/app.js" type="text/javascript"/>\n
<multi-gitribute-${isWiki ? 'explowiki' : 'file'}\r
  title="${this.gitObj.title}"\r
  ${fileKey}="${this.gitObj.id}"\r${wikiPagesStr}
  options='${fileOptionsStr}'\r
  onlypreview="${!!this.gitObj.onlyPreview}"\r
  locale="${this.locale}"\r
/>\n
<link type="text/css" href="https://${widgetProvider}/js/app.css" rel="stylesheet">\r
<link type="text/css" href="https://${widgetProvider}/fonts/materialdesignicons-webfont.woff2" rel="stylesheet">\r
<!-- ${this.t('credits.reclaim', 'en')} ${this.t('credits.byLove', 'en')} ${this.t('credits.byCooperative', 'en')} multi.coop -->\
`
      // console.log('C > ButtonCopyWidgetHtml > CopyWidgetHtml > htmlStr : \n', htmlStr)
      navigator.clipboard.writeText(htmlStr)
        .then(() =>
          alert(this.t('actions.widgetCopied', this.locale))
        )
    }
  }
}
</script>
