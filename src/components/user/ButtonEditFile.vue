<template>
  <div class="ButtonEditFile datami-component">
    <b-field
      v-if="showEditNavbar"
      grouped
      class="is-flex is-flex-grow-1">
      <p class="control is-flex is-flex-grow-1">
        <b-button
          :label="t('actions.sendContrib', locale)"
          size="is-small"
          type="is-dark"
          expanded
          icon-left="pencil"
          @click="commitChanges"/>
      </p>
      <p class="control">
        <b-tooltip
          :label="t('actions.quitEdit', locale)"
          type="is-dark"
          position="is-top">
          <b-button
            size="is-small"
            type="is-dark"
            icon-left="close-thick"
            @click="closeEditMode"/>
        </b-tooltip>
      </p>
    </b-field>

    <b-tooltip
      v-if="!showEditNavbar"
      :label="t('actions.enterEdit', locale)"
      type="is-dark"
      position="is-top"
      class="is-flex is-flex-grow-1">
      <b-button
        size="is-small"
        :label="t('actions.contribute', locale)"
        icon-left="pencil"
        expanded
        @click="openEditMode"/>
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
  data () {
    return {
      notPreviewModes: ['edit', 'diff']
    }
  },
  methods: {
    ...mapActions({
      changeViewMode: 'git-data/changeViewMode',
      changeEditViewMode: 'git-data/changeEditViewMode',
      toggleEditNavbar: 'toggleEditNavbar',
      updateSaving: 'git-data/updateSaving'
    }),
    // toggleButton () {
    //   if (this.currentEditViewMode === 'preview') {
    //     this.changeEditMode('edit')
    //   } else {
    //     this.commitChanges()
    //   }
    //   // track with matomo
    //   this.trackEvent('click', 'EditNavbarEditToggleBtn')
    // },
    // changeEditMode (code) {
    //   // console.log('C > EditNavbarSkeleton > changeEditMode > code :', code)
    //   this.changeEditViewMode({ fileId: this.fileId, mode: code })
    // },
    openEditMode () {
      this.changeEditViewMode({ fileId: this.fileId, mode: 'edit' })
      this.toggleEditNavbar({ uuid: this.fileId, status: true })
      // specific view to switch back to table
      const viewsToSwitch = ['dataviz']
      if (viewsToSwitch.includes(this.currentViewMode)) {
        this.changeViewMode({ fileId: this.fileId, mode: 'table' })
      }
    },
    closeEditMode () {
      this.changeEditViewMode({ fileId: this.fileId, mode: 'preview' })
      this.toggleEditNavbar({ uuid: this.fileId, status: false })
    },
    commitChanges () {
      this.updateSaving({ fileId: this.fileId, isSaving: true })
    }
    // ToggleEditNavbar () {
    //   // switch to edit mode or commit
    //   console.log('C > EditNavbarSkeleton > ToggleEditNavbar > this.currentEditViewMode :', this.currentEditViewMode)
    //   console.log('C > EditNavbarSkeleton > ToggleEditNavbar > this.showEditNavbar :', this.showEditNavbar)

    //   if (this.currentEditViewMode === 'preview') {
    //     // this.toggleEditNavbar({ uuid: this.fileId, status: !this.showEditNavbar })
    //     const viewsToSwitch = ['dataviz']
    //     if (this.showEditNavbar) {
    //       this.changeEditViewMode({ fileId: this.fileId, mode: 'edit' })
    //       if (viewsToSwitch.includes(this.currentViewMode)) {
    //         this.changeViewMode({ fileId: this.fileId, mode: 'table' })
    //       }
    //     } else {
    //       this.changeEditViewMode({ fileId: this.fileId, mode: 'preview' })
    //     }
    //     // track with matomo
    //     this.trackEvent('click')
    //   } else {
    //     this.commitChanges()
    //   }
    // }
  }
}
</script>

<style>

  .ButtonEditFile > .field > .field-body {
    -webkit-box-flex: 1!important;
    -ms-flex-positive: 1!important;
    flex-grow: 1!important;
  }

</style>
