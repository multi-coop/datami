<template>
  <span class="EditJsonCell datami-component is-flex is-flex-direction-row is-align-items-center">
    <!-- <code>{{ inputData }}</code> -->

    <!-- EDIT LABEL -->
    <b-tooltip
      v-if="isLabel && !isArrayItem"
      :label="t(`editJson.editLabel`, locale)"
      type="is-dark"
      position="is-left">
      <b-icon
        class="ml-4 mr-2"
        size="is-small"
        type="is-gray"
        :icon="`pencil-${edit ? 'off-' : ''}outline`"
        @click.native="edit = !edit"/>
    </b-tooltip>

    <!-- INPUT EDIT -->
    <b-field
      v-show="edit"
      class="mb-0">
      <!-- <b-input
        :custom-class="`g-cell py-0 ${isLabel ? 'g-label' : ''}`"
        :value="input"
        size="is-small"
        @input="emitChange"/> -->
      <b-switch
        v-if="nodeType === 'bool'"
        :value="input"
        size="is-small"
        :type="isDarkMode ? 'is-light' : 'is-dark'"
        @input="emitChange">
        {{ input }}
      </b-switch>
      <b-numberinput
        v-if="nodeType === 'num' || nodeType === 'float'"
        v-model="input"
        size="is-small"
        :type="isDarkMode ? 'is-dark' : 'is-light'"
        controls-position="compact"
        @input="emitChange"/>
      <b-input
        v-if="nodeType === 'str' || isLabel"
        :custom-class="`${isDarkMode ? 'g-cell-darkmode' : 'g-cell' } py-0 ${isLabel ? 'g-label' : ''}`"
        clearable
        :value="input"
        size="is-small"
        @input="emitChange"/>
    </b-field>

    <!-- VALUE WHEN EDIT IS OFF -->
    <span
      v-show="!edit"
      @click="toggleShowChildren">
      <code :class="!showChildren || hasValue ? 'has-text-grey' : ''">
        {{ input }}
      </code>
    </span>

    <!-- REMOVE NODE ICON -->
    <b-tooltip
      v-if="isLabel"
      :label="t(`editJson.removeNode`, locale)"
      type="is-dark"
      position="is-right">
      <b-icon
        class="ml-2 mr-4"
        size="is-small"
        type="is-gray"
        :icon="`trash-can${hidden ? '' : '-outline'}`"
        @click.native="toggleRemoveDialog"/>
    </b-tooltip>
  </span>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'EditJsonCell',
  mixins: [mixinGlobal],
  model: {
    prop: 'hidden',
    event: 'blur'
  },
  props: {
    hidden: {
      default: false,
      type: Boolean
    },
    fileId: {
      default: null,
      type: String
    },
    nodeId: {
      default: null,
      type: String
    },
    nodeType: {
      default: null,
      type: String
    },
    inputData: {
      default: null,
      type: [String, Number, Boolean]
    },
    icon: {
      default: null,
      type: String
    },
    isLabel: {
      default: false,
      type: Boolean
    },
    isArrayItem: {
      default: false,
      type: Boolean
    },
    isNodeAdded: {
      default: false,
      type: Boolean
    },
    showChildren: {
      default: false,
      type: Boolean
    },
    hasValue: {
      default: false,
      type: Boolean
    },
    locale: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      cssFiles: [
        'styles/components/edition/csv/datami-edit-cell.css'
      ],
      originalInput: undefined,
      input: undefined,
      edit: true,
      isNum: false,
      isBool: false
    }
  },
  beforeMount () {
    this.originalInput = this.inputData
    this.input = this.inputData
    this.edit = !this.isLabel
  },
  methods: {
    handleInput (value) {
      this.$emit('blur', value)
    },
    toggleRemoveDialog () {
      const val = !this.hidden
      this.handleInput(val)
    },
    toggleShowChildren () {
      // console.log('C > EditJsonCell > toggleShowChildren ...')
      this.$emit('toggleShowChildren')
    },
    emitChange (event) {
      // console.log('C > EditJsonCell > emitChange > event : ', event)
      this.input = event
      const payload = {
        action: 'diff',
        added: this.isNodeAdded,
        fileId: this.fileId,
        nodeId: this.nodeId,
        isLabel: this.isLabel,
        val: this.input,
        oldVal: this.originalInput
      }
      // console.log('C > EditJsonCell > emitChange > payload : ', payload)
      this.$emit('updateJson', payload)

      // track with matomo
      this.trackEvent('updateJson')
    }
  }
}

</script>
