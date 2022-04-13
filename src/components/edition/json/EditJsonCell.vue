<template>
  <span class="EditJsonCell is-flex is-flex-direction-row is-align-items-center">
    <!-- <code>{{ inputData }}</code> -->
    <b-field
      v-show="edit"
      class="mb-0">
      <b-input
        :custom-class="`g-cell py-0 ${isLabel ? 'g-label' : ''}`"
        :value="input"
        size="is-small"
        :icon="icon"
        @input="emitChange"/>
    </b-field>
    <span v-show="!edit">
      <code>{{ input }}</code>
    </span>
    <b-tooltip
      v-if="isLabel"
      :label="t(`editJson.editLabel`, locale)"
      type="is-dark"
      position="is-right">
      <b-icon
        class="ml-2"
        size="is-small"
        type="is-gray"
        :icon="`pencil-${edit ? 'off-' : ''}outline`"
        @click.native="edit = !edit"/>
    </b-tooltip>
  </span>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'EditJsonCell',
  props: {
    isLabel: {
      default: false,
      type: Boolean
    },
    inputData: {
      default: null,
      type: [String, Number, Boolean]
    },
    icon: {
      default: null,
      type: String
    },
    locale: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      input: undefined,
      edit: true
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  },
  watch: {
    inputData (next) {
      this.input = this.inputData
    }
  },
  beforeMount () {
    this.input = this.inputData
    this.edit = !this.isLabel
  },
  methods: {
    emitChange (event) {
      // console.log('C > EditJsonCell > emitChange > event : ', event)
      this.input = event
      const payload = {
        val: this.input
      }
      console.log('C > EditJsonCell > emitChange > payload : ', payload)
      // this.$emit('updateJsonCellValue', payload)
    }
  }
}

</script>

<style>

.g-cell {
  background-color: transparent;
  /* border: none; */
}
.g-label {
  font-size: .85em!important;
  font-weight: 600!important;
}
</style>
