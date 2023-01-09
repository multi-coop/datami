<template>
  <div class="ButtonEditFile datami-component">
    <b-field
      v-if="showEditNavbar"
      grouped
      class="is-flex is-flex-grow-1">
      <p class="control is-flex is-flex-grow-1">
        <b-button
          :label="t('actions.sendContrib', locale)"
          :type="isDarkMode ? 'is-white' : 'is-dark'"
          :outlined="isDarkMode"
          :class="`${isDarkMode ? 'datami-darkmode has-text-white' : ''}`"
          size="is-small"
          expanded
          icon-left="pencil"
          @click="OpenCommitDialog"
          @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('actions.sendContribHelp', locale) })"
          @mouseleave="hideGlobalTooltip"/>
      </p>
      <p class="control">
        <b-button
          :type="isDarkMode ? 'is-white' : 'is-dark'"
          :outlined="isDarkMode"
          :class="`${isDarkMode ? 'datami-darkmode has-text-white' : ''}`"
          size="is-small"
          icon-left="close-thick"
          @click="closeEditMode"
          @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('actions.quitEdit', locale) })"
          @mouseleave="hideGlobalTooltip"/>
      </p>
    </b-field>

    <b-button
      v-if="!showEditNavbar"
      size="is-small"
      :label="t('actions.contribute', locale)"
      icon-left="pencil"
      :class="`${isDarkMode ? 'datami-darkmode has-text-white' : ''}`"
      expanded
      @click="openEditMode"
      @mouseover="showGlobalTooltip($event, { position: 'top', type: 'info', label: t('actions.enterEdit', locale) })"
      @mouseleave="hideGlobalTooltip"/>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

import { mixinTooltip, mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'ButtonEditFile',
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
      toggleEditNavbar: 'toggleEditNavbar'
      // updateSaving: 'git-data/updateSaving'
    }),
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
    OpenCommitDialog () {
      // console.log('\nC > ButtonEditFile > OpenCommitDialog ...')
      this.updateFileDialogs('OpenCommitDialog', {})
    }
  }
}
</script>
