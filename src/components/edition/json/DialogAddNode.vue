<template>
  <div
    class="DialogAddNode gitribute-component mb-5"
    :style="indent">
    <div class="columns">
      <div class="column is-10">
        <div class="card">
          <!-- CARD HEADER -->
          <header class="card-header">
            <p class="card-header-title mb-0">
              <b-icon
                class="mr-3"
                :icon="icon"/>
              {{ t('editJson.addNode', locale) }}
            </p>
            <button
              class="card-header-icon"
              @click="closeDialog">
              <b-icon
                icon="close"/>
            </button>
          </header>

          <!-- NODE TO ADD -->
          <div class="card-content">
            <div class="content my-4">
              <!-- PARENT NODE INFOS -->
              <p class="has-text-weight-bold has-text-centered mb-2">
                {{ t('editJson.addTo', locale) }}
              </p>
              <p class="has-text-centered">
                <span>
                  <code
                    :class="nodeInfos.hasValue ? 'has-text-grey' : ''">
                    {{ nodeInfos.label }}
                  </code>
                </span>
                <!-- NODE TYPE ICON -->
                <b-tooltip
                  :label="`${t(`editJson.nodeTypeOf`, locale)} : ${t(`editJson.${nodeInfos.nodeType}`, locale)}`"
                  type="is-dark"
                  position="is-right">
                  <b-icon
                    class="mx-3 mt-2"
                    size="is-small"
                    type="is-danger"
                    :icon="nodeInfos.nodeTypeIcon"/>
                </b-tooltip>
              </p>

              <!-- NEW NODE CREATION -->
              <hr>
              <div class="columns is-centered">
                <div class="column is-6">
                  <!--  NODE TYPE SELECTION -->
                  <b-field
                    expanded
                    :label="t('editJson.nodeType', locale)">
                    <b-select
                      v-model="nodeType"
                      :placeholder="t('editJson.selectType', locale)"
                      :icon="getNodeTypeIcon || 'circle-small'">
                      <option :value="undefined">
                        ---
                      </option>
                      <option
                        v-for="nType in typeChoices"
                        :key="nType.code"
                        :value="nType.code">
                        {{ t(`editJson.${nType.code}`, locale) }}
                      </option>
                    </b-select>
                  </b-field>

                  <!-- NODE LABEL -->
                  <b-field
                    v-if="needLabel"
                    :label="t('editJson.nodeLabel', locale)"
                    expanded>
                    <b-input
                      v-model="label"
                      icon-right="close-circle"
                      icon-right-clickable
                      @icon-right-click="clearLabel"/>
                  </b-field>

                  <!-- NODE VALUE -->
                  <b-field
                    v-if="isNode && !isNodeObj"
                    :label="t('editJson.nodeValue', locale)"
                    expanded>
                    <b-switch
                      v-if="candShowValInput('bool')"
                      v-model="boolInput"
                      type="is-dark">
                      {{ boolInput }}
                    </b-switch>
                    <b-numberinput
                      v-if="candShowValInput('num')"
                      v-model="numInput"
                      type="is-light"
                      :step="stepsNum"
                      controls-position="compact"/>
                    <b-numberinput
                      v-if="candShowValInput('float')"
                      v-model="floatInput"
                      type="is-light"
                      :step="stepsFloat"
                      controls-position="compact"/>
                    <b-input
                      v-if="candShowValInput('str')"
                      v-model="strInput"
                      clearable
                      icon-right="close-circle"
                      icon-right-clickable
                      @icon-right-click="clearStrInput"/>
                  </b-field>
                </div>
              </div>

              <!-- NEW NODE RESUME -->
              <div v-if="isNode">
                <div class="divider">
                  <span class="no-text-transform is-size-6 has-text-grey-light">
                    {{ t('editJson.newNodePreview', locale) }}
                  </span>
                </div>
                <div class="columns">
                  <div class="column is-full">
                    <p class="has-text-centered">
                      <!-- NODE LABEL -->
                      <span v-if="needLabel">
                        <code>
                          {{ tempNode.label }}
                        </code>
                      </span>
                      <!-- NODE TYPE ICON -->
                      <b-tooltip
                        :label="`${t(`editJson.nodeTypeOf`, locale)} : ${t(`editJson.${nodeInfos.nodeType}`, locale)}`"
                        type="is-dark"
                        position="is-right">
                        <b-icon
                          class="mx-3 mt-2"
                          size="is-small"
                          type="is-danger"
                          :icon="getNodeTypeIcon"/>
                      </b-tooltip>
                      <!-- NODE VALUE -->
                      <span v-if="!isNodeObj || isValTypeObj">
                        {{ tempNode.value }}
                      </span>
                    </p>
                  </div>
                </div>
                <!-- DEBUGGING -->
                <div v-if="false">
                  <pre><code>{{ tempNode }}</code></pre>
                </div>
              </div>

              <!-- DEBUGGING -->
              <div v-if="false">
                <div class="divider"/>
                <p>
                  isNode : <code>{{ isNode }}</code><br>
                  isNodeObj : <code>{{ isNodeObj }}</code><br>
                  isValTypeObj : <code>{{ isValTypeObj }}</code><br>
                  needLabel : <code>{{ needLabel }}</code><br>
                  <!-- overwriteNodeType : <code>{{ overwriteNodeType }}</code><br> -->
                  newNodeReady : <code>{{ newNodeReady }}</code><br>
                  tempNode : <br><pre><code>{{ tempNode }}</code></pre><br>
                </p>
              </div>
            </div>
          </div>

          <!-- BUTTONS FOOTER -->
          <footer class="card-footer px-2 py-4">
            <b-button
              class="card-footer-item mx-3"
              icon-left="close"
              type=""
              @click="closeDialog">
              {{ t('actions.cancel', locale) }}
            </b-button>
            <b-button
              class="card-footer-item mx-3"
              :icon-left="icon"
              type="is-dark"
              :disabled="!newNodeReady"
              @click="sendNodeToAddToParent">
              {{ t('editJson.addNode', locale) }}
            </b-button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinJsonNode, mixinNodeToJson } from '@/utils/mixins.js'

export default {
  name: 'DialogAddNode',
  mixins: [
    mixinGlobal,
    mixinJsonNode,
    mixinNodeToJson
  ],
  model: {
    prop: 'hidden',
    event: 'blur'
  },
  props: {
    hidden: {
      default: false,
      type: Boolean
    },
    nodeInfos: {
      default: null,
      type: Object
    },
    indent: {
      default: undefined,
      type: Object
    },
    locale: {
      default: '',
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      objTypes: ['arr', 'obj'],
      valTypes: ['str', 'num', 'float', 'bool', 'obj'],
      icon: 'plus-thick',

      // options
      stepsNum: 1,
      stepsFloat: 0.1,

      // new node temp data
      nodeType: undefined,
      valType: 'str',
      label: '',
      boolInput: false,
      numInput: 0,
      floatInput: 0.1,
      strInput: ''
    }
  },
  computed: {
    typeChoices () {
      const choices = this.nodeTypes.filter(nt => {
        if (this.nodeInfos.nodeType === 'obj') return nt.code !== 'arr'
        else return true
      })
      return choices
    },
    isNode () {
      return !!this.nodeType
    },
    isNodeObj () {
      const isObj = this.isNode && this.objTypes.includes(this.nodeType)
      return isObj
    },
    isValTypeObj () {
      const isValtype = this.isNodeObj && this.valTypes.includes(this.valType)
      return isValtype
    },
    needLabel () {
      const isNewNodeAnObject = this.nodeType === 'obj'
      const isParentAnObject = this.nodeInfos.nodeType === 'obj'
      return isNewNodeAnObject || isParentAnObject
    },
    tempNode () {
      const tempNode = {
        id: this.uuidv4(),
        nodeType: this.nodeType
      }
      // build a new object
      switch (this.nodeType) {
        case 'arr':
          tempNode.nodes = []
          break
        case 'obj':
          tempNode.label = this.label
          tempNode.nodes = []
          break
        case 'bool':
          tempNode.value = this.boolInput
          break
        case 'num':
          tempNode.value = this.numInput
          break
        case 'float':
          tempNode.value = this.floatInput
          break
        case 'str':
          tempNode.value = this.strInput
          break
      }
      if (this.needLabel) tempNode.label = this.label
      return tempNode
    },
    newNodeReady () {
      const tempNode = this.tempNode
      const hasLabel = !!tempNode.label
      const needLabel = this.needLabel
      let isReady = false
      if (this.isNodeObj && this.nodeType === 'arr') {
        isReady = true
      }
      if (this.isNodeObj && this.nodeType !== 'arr') {
        isReady = hasLabel
      }
      if (!this.isNodeObj) {
        const isStringNode = this.nodeType === 'str'
        const hasVal = isStringNode ? !!tempNode.value : !!tempNode.nodeType
        isReady = needLabel ? hasLabel && hasVal : hasVal
      }
      return isReady
    },
    fakeRoot () {
      const root = {
        nodeType: 'obj',
        nodes: [this.tempNode]
      }
      return root
    }
  },
  methods: {
    handleInput (value) {
      this.$emit('blur', value)
    },
    closeDialog () {
      this.handleInput(false)
    },
    clearLabel () {
      this.label = ''
    },
    clearStrInput () {
      this.strInput = ''
    },
    candShowValInput (valType) {
      let canShow = false
      if (!this.isNodeObj) {
        canShow = valType === this.nodeType
      }
      if (this.isValTypeObj) {
        canShow = valType === this.valType
      }

      return canShow
    },
    sendNodeToAddToParent () {
      // console.log('\nC > DialogAddNode > sendNodeToDeleteToParent > this.temp :', this.temp)
      this.$emit('confirmAddNode', { newNode: this.tempNode })
      this.clearLabel()
      this.clearStrInput()
      this.boolInput = false
      this.numInput = 0
      this.floatInput = 0.1
      this.closeDialog()
    }
  }
}
</script>
