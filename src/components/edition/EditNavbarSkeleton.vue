<template>
  <div
    v-show="showEditNavbar && !noEditNavbarViews.includes(currentViewMode)"
    class="EditNavbarSkeleton datami-component container mt-2">
    <div
      v-if="gitObj"
      class="columns is-multiline is-mobile mb-2">
      <!-- EDIT VIEW CHOICES -->
      <div
        :class="`column py-0 is-4 is-offset-4 has-text-centered`">
        <EditModeBtns
          :only-preview="onlyPreview"
          :file-id="fileId"
          :locale="locale"/>
      </div>

      <!-- UPLOAD FILE -->
      <div
        v-if="!onlyPreview"
        class="column py-0 is-4 is-5-mobile is-1-tablet has-text-right">
        <ButtonImportData
          :locale="locale"
          :show-upload-file-dialog="showUploadFileDialog"
          @action="SendActionToParent"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { mixinGlobal } from '@/utils/mixins.js'

import ButtonImportData from '@/components/edition/ButtonImportData'
import EditModeBtns from '@/components/edition/EditModeBtns'

export default {
  name: 'EditNavbarSkeleton',
  components: {
    ButtonImportData,
    EditModeBtns
  },
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: undefined,
      type: String
    },
    onlyPreview: {
      default: false,
      type: Boolean
    },
    showUploadFileDialog: {
      default: false,
      type: Boolean
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
      loading: false,
      noEditNavbarViews: ['dataviz']
    }
  },
  computed: {
    ...mapGetters({
      getEditNavbar: 'getFileEditNavbarStatus'
    }),
    showEditNavbar () {
      return this.getEditNavbar(this.fileId)
    }
  },
  methods: {
    ...mapActions({
      changeEditViewMode: 'git-data/changeEditViewMode'
    }),
    SendActionToParent (event) {
      this.$emit('action', event)
    }
  }
}
</script>

<style scoped>

.edit-save-button {
  z-index: 3;
}

</style>
