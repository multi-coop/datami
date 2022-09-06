<template>
  <div class="ButtonEditFile gitribute-component">
    <b-tooltip
      :label="t(`actions.${showEditNavbar ? 'quitEdit' : 'enterEdit'}`, locale)"
      type="is-dark"
      position="is-top">
      <b-button
        size="is-small"
        :type="showEditNavbar ? 'is-dark' : ''"
        class="ml-1"
        icon-left="pencil"
        @click="ToggleEditNavbar"/>
    </b-tooltip>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonEditFile',
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
    ...mapActions({
      changeViewMode: 'git-data/changeViewMode',
      changeEditViewMode: 'git-data/changeEditViewMode',
      toggleEditNavbar: 'toggleEditNavbar'
    }),
    ToggleEditNavbar () {
      // console.log('C > ButtonEditFile > ToggleEditNavbar > this.showEditNavbar : ', this.showEditNavbar)
      this.toggleEditNavbar({ uuid: this.fileId, status: !this.showEditNavbar })
      const viewsToSwitch = ['dataviz']
      if (this.showEditNavbar) {
        this.changeEditViewMode({ fileId: this.fileId, mode: 'edit' })
        if (viewsToSwitch.includes(this.currentViewMode)) {
          this.changeViewMode({ fileId: this.fileId, mode: 'table' })
        }
      } else {
        this.changeEditViewMode({ fileId: this.fileId, mode: 'preview' })
      }

      // track with matomo
      this.trackEvent('click')
    }
  }
}
</script>
