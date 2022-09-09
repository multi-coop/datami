<template>
  <div/>
</template>
<script>

import { mixinGlobal } from '@/utils/mixins.js'

// cf : https://www.cnil.fr/sites/default/files/atoms/files/matomo_analytics_-_exemption_-_guide_de_configuration.pdf
// cf: https://ronan-hello.fr/series/matomo/vie-privee-rgpd-matomo

const matomoScript = (matomoServer, siteId, domain, hasTrackAllOutlinks = false) => {
  const isMatomoCloud = matomoServer.endsWith('.matomo.cloud')
  const urlServer = `${isMatomoCloud ? 'https://' : '//'}${matomoServer}`
  const scriptSrc = `//${isMatomoCloud ? 'cdn.matomo.cloud/' : ''}${matomoServer}/matomo.js`

  // <!-- Matomo -->
  //     var _paq = window._paq = window._paq || [];
  //     // tracker methods like "setCustomDimension" should be called before "trackPageView"
  //     _paq.push(['trackPageView']);
  //     _paq.push(['enableLinkTracking']);
  //     (function() {
  //       var u="https://datamimulticoop.matomo.cloud/";
  //       _paq.push(['setTrackerUrl', u+'matomo.php']);
  //       _paq.push(['setSiteId', '1']);
  //       var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  //       g.async=true; g.src='//cdn.matomo.cloud/datamimulticoop.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
  //     })()
  //   <!-- End Matomo Code -->

  return `
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    
    // Code à coller avant la fonction _paq.push(["trackPageView"]);
    _paq.push([function() {
    var self = this;

    function getOriginalVisitorCookieTimeout() {
      var now = new Date(),
      nowTs = Math.round(now.getTime() / 1000),
      visitorInfo = self.getVisitorInfo();
      var createTs = parseInt(visitorInfo[2]);
      var cookieTimeout = 33696000; // 13 mois en secondes
      var originalTimeout = createTs + cookieTimeout - nowTs;
      return originalTimeout;
    }
    this.setVisitorCookieTimeout( getOriginalVisitorCookieTimeout() );
    }]);

    _paq.push(['setDocumentTitle', '${domain}']);
    _paq.push(['trackPageView']);
    // _paq.push(['setLinkClasses', "outlink"]);
    ${hasTrackAllOutlinks ? "_paq.push(['enableLinkTracking']);" : ''}

    (function() {
      var u='${urlServer}/';
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', '${siteId}']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.async=true; g.src='${scriptSrc}'; s.parentNode.insertBefore(g,s);
    })();
  `
}

export default {
  name: 'MatomoScript',
  mixins: [
    mixinGlobal
  ],
  props: {
    fileId: {
      default: '',
      type: String
    },
    fromMultifiles: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      matomoServer: 'matomo',
      matomoSiteId: '1',
      scriptUniqueId: 'datami-matomo-script'
    }
  },
  mounted () {
    // console.log('\nC > MatomoScript > mounted > ...')
    // console.log('C > MatomoScript > mounted > this.hasTrackAllOutlinks : ', this.hasTrackAllOutlinks)

    const domain = document.domain === 'localhost' ? 'localhost (dev)' : document.domain

    const matomoServer = process.env.VUE_APP_DATAMI_MATOMO
    // console.log('C > MatomoScript > mounted > matomoServer :', matomoServer)

    const matomoSiteId = process.env.VUE_APP_DATAMI_MATOMO_SITE_ID
    // console.log('C > MatomoScript > mounted > matomoSiteId :', matomoSiteId)

    this.matomoServer = matomoServer
    this.matomoSiteId = matomoSiteId

    let matomoScriptElem = document.getElementById(this.scriptUniqueId)

    if (!matomoScriptElem && matomoServer && matomoSiteId) {
      matomoScriptElem = document.createElement('script')
      // console.log('C > MatomoScript > mounted > matomoScriptElem :', matomoScriptElem)
      matomoScriptElem.setAttribute('id', this.scriptUniqueId)
      matomoScriptElem.setAttribute('type', 'text/javascript')

      const scriptText = matomoScript(matomoServer, matomoSiteId, domain, this.hasTrackAllOutlinks)
      // console.log('C > MatomoScript > mounted > scriptText :', scriptText)
      matomoScriptElem.innerHTML = scriptText

      // console.log('C > MatomoScript > mounted > matomoScriptElem :', matomoScriptElem)

      document.head.appendChild(matomoScriptElem)
    }
  },
  destroyed () {
    const matomoScriptElem = document.getElementById(this.scriptUniqueId)
    matomoScriptElem && matomoScriptElem.remove()
  }
}
</script>
