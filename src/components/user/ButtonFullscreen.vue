element.mozRequestFullScreen<template>
  <div class="ButtonFullscreen datami-component">
    <b-tooltip
      :label="t(`actions.fullscreen${isFullscreen ? 'Off' : 'On'}`, locale)"
      type="is-dark"
      position="is-top">
      <b-button
        size="is-small"
        class="ml-1"
        icon-left="fullscreen"
        @click="toggleFullsceen"/>
    </b-tooltip>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonFullscreen',
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
  data () {
    return {
      isFullscreen: false,
      browserZoomLevel: 200,
      browserZoomBase: 200
    }
  },
  watch: {
    isFullscreen (next) {
      // console.log('C > ButtonFullscreen > watch > isFullscreen > next :', next)
      if (next) {
        // console.log('C > ButtonFullscreen > watch > isFullscreen > this.browserZoomBase :', this.browserZoomBase)
        this.setZoomLevel(this.browserZoomBase)
      } else {
        // console.log('C > ButtonFullscreen > watch > isFullscreen > this.browserZoomLevel :', this.browserZoomLevel)
        this.setZoomLevel(this.browserZoomLevel)
      }
    }
  },
  created () {
    window.addEventListener('resize', this.getZoomLevel)
    window.addEventListener('keyup', this.escapeFullscreen)
  },
  beforeMount () {
    this.browserZoomBase = Math.round(window.devicePixelRatio * 100)
    this.getZoomLevel()
  },
  destroyed () {
    window.removeEventListener('resize', this.getZoomLevel)
    window.removeEventListener('keyup', this.escapeFullscreen)
  },
  methods: {
    ...mapActions({
      updateFullscreen: 'git-user/updateFullscreen'
    }),
    escapeFullscreen (event) {
      // console.log('\nC > ButtonFullscreen > escapeFullscreen > event :', event)
      if (event.keyCode === 27) {
        this.isFullscreen = false
        this.updateFullscreen({ fileId: this.fileId, isFullscreen: false })
      }
    },
    getZoomLevel () {
      // console.log('\nC > ButtonFullscreen > getZoomLevel > ...')
      // console.log('C > ButtonFullscreen > getZoomLevel > document.body.style.zoom :', document.body.style.zoom)
      // console.log('C > ButtonFullscreen > getZoomLevel > window.devicePixelRatio:', window.devicePixelRatio)
      // const browserZoomLevel = document.body.style.zoom
      const browserZoomLevel = Math.round(window.devicePixelRatio * 100)
      // const browserZoomLevel = window.outerWidth / window.innerWidth
      // console.log('C > ButtonFullscreen > getZoomLevel > browserZoomLevel :', browserZoomLevel)
      if (!this.isFullscreen) {
        this.browserZoomLevel = browserZoomLevel
      }
    },
    toggleFullsceen () {
      // console.log('\nC > ButtonFullscreen > toggleFullsceen ...')
      // console.log('C > ButtonFullscreen > toggleFullsceen > this.isFullscreen :', this.isFullscreen)

      if (this.isFullscreen) {
        this.isFullscreen = false
        window.document.exitFullscreen ? window.document.exitFullscreen() : window.document.mozCancelFullScreen ? window.document.mozCancelFullScreen() : window.document.msExitFullscreen ? window.document.msExitFullscreen() : window.document.webkitCancelFullScreen && window.document.webkitCancelFullScreen()
      } else {
        this.isFullscreen = true
        const widgetElement = document.getElementById(`datami-widget-${this.fileId}`)
        widgetElement.requestFullscreen ? widgetElement.requestFullscreen() : widgetElement.mozRequestFullScreen ? widgetElement.mozRequestFullScreen() : widgetElement.msRequestFullscreen ? widgetElement.msRequestFullscreen() : widgetElement.webkitRequestFullscreen && widgetElement.webkitRequestFullscreen()
      }
      // console.log('C > ButtonFullscreen > toggleFullsceen > this.isFullscreen :', this.isFullscreen)
      this.updateFullscreen({ fileId: this.fileId, isFullscreen: this.isFullscreen })

      // track with matomo
      this.trackEvent('click')
    },
    setZoomLevel (value) {
      document.body.style.zoom = `${value}%`
    }
  }
}
</script>
