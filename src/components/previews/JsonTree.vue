<template>
  <div class="json-tree">
    <!-- NODE -->
    <div
      class="my-1"
      :style="indent">
      <!-- NODE LABEL IF ANY + EDITABLE -->
      <div class="is-flex is-direction-row is-align-items-start">
        <div
          :class="`is-flex is-flex-direction-row is-align-items-${view === 'edit' ? 'center' : 'center'}`">
          <!-- CHEVRON TO OPEN/CLOSE NODE -->
          <b-tooltip
            :label="`${t(`editJson.${showChildren ? 'close' : 'open'}Node`, locale)}`"
            type="is-dark"
            position="is-top">
            <span @click="toggleChildren">
              <b-icon
                v-if="!hasValue"
                size="is-small"
                class="mr-2"
                :icon="showChildren ? 'chevron-down' : 'chevron-right'"/>
              <b-icon
                v-else
                size="is-small"
                class="mr-2"
                icon="dot"/>
            </span>
          </b-tooltip>

          <!-- NODE LABEL + EDITABLE -->
          <span v-if="view === 'edit' && depth !== 0 && parentType !== 'arr'">
            <EditJsonCell
              :file-id="fileId"
              :node-id="nodeId"
              :input-data="label"
              :is-label="true"
              :icon="'code-braces'"
              :has-value="hasValue"
              :show-children="showChildren"
              :locale="locale"
              @updateJson="SendActionToParent"/>
          </span>
          <span
            v-else
            @click="toggleChildren">
            <code
              v-if="view !=='diff'"
              :class="!showChildren || hasValue ? 'has-text-grey' : ''">
              {{ label }}
            </code>
            <span
              v-if="view === 'diff'"
              :class="`gt-node-label ${!showChildren || hasValue ? 'has-text-grey' : ''}`"
              v-html="getDiffHtmlChars (true, wasAdded, label, nodeId)"/>
          </span>

          <!-- NODE TYPE ICON -->
          <b-tooltip
            :label="`${t(`editJson.nodeType`, locale)} : ${t(`editJson.${nodeType}`, locale)}`"
            type="is-dark"
            position="is-right">
            <b-icon
              class="mx-3 mt-2"
              size="is-small"
              type="is-danger"
              :icon="getNodeTypeIcon"
              @click.native="toggleChildren"/>
          </b-tooltip>

          <!-- SHOW CHILDREN -->
          <b-icon
            v-if="!hasValue && !showChildren"
            class=""
            type="is-gray"
            size="is-small"
            icon="dots-horizontal"
            @click.native="toggleChildren"/>
        </div>

        <!-- NODE VALUE IF ANY + EDITABLE -->
        <div
          v-if="hasValue"
          style="margin-top: 0.1em;">
          <span v-if="view === 'edit'">
            <EditJsonCell
              :file-id="fileId"
              :node-id="nodeId"
              :node-type="nodeType"
              :input-data="value"
              :is-label="false"
              :icon="getNodeTypeIcon"
              :locale="locale"
              @updateJson="SendActionToParent"/>
          </span>
          <span v-if="view === 'diff'">
            <!-- <span :class="`is-size-7 ${getValueClass}`">
              {{ value }} - diff
            </span> -->
            <span
              v-if="view === 'diff'"
              :class="`is-size-7 ${getValueClass}`"
              v-html="getDiffHtmlChars (false, wasAdded, value, nodeId)"/>
          </span>
          <span v-if="view === 'preview'">
            <span :class="`is-size-7 ${getValueClass}`">
              {{ value }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- LOOP CHILDREN NODES -->
    <div v-if="showChildren">
      <json-tree
        v-for="node in nodes"
        :key="node.id"
        :file-id="fileId"
        :view="view"
        :node-id="node.id"
        :label="node.label"
        :value="node.value"
        :parent-type="nodeType"
        :node-type="node.nodeType"
        :was-added="node.wasAdded"
        :nodes="node.nodes"
        :depth="depth + 1"
        :locale="locale"
        :default-depth="defaultDepth"
        :changes-nodes="changesNodes"
        @updateJson="SendActionToParent"/>
    </div>

    <!-- ADD NODE -->
    <div
      v-if="view === 'edit' && !hasValue && showChildren"
      class="is-flex is-direction-row is-align-items-center"
      :style="indentAddNode"
      @mouseenter="showAdd = true"
      @mouseleave="showAdd = false"
      @click="addNode">
      <b-icon
        :icon="`plus${showAdd ? '-thick' : ''}`"
        size="is-small"
        class="my-1"/>
      <span
        v-show="showAdd"
        class="is-size-7 has-text-dark ml-2">
        {{ t(`editJson.addNode`, locale) }}
      </span>
    </div>
  </div>
</template>

<script>
import { mixinGlobal, mixinDiff, mixinJsonNode } from '@/utils/mixins.js'

import EditJsonCell from '@/components/edition/json/EditJsonCell'

export default {
  name: 'JsonTree',
  components: {
    EditJsonCell
  },
  mixins: [
    mixinGlobal,
    mixinDiff,
    mixinJsonNode
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    view: {
      default: 'preview',
      type: String
    },
    nodeId: {
      default: null,
      type: String
    },
    label: {
      default: null,
      type: String
    },
    value: {
      default: null,
      type: [String, Boolean, Number]
    },
    parentType: {
      default: null,
      type: String
    },
    nodeType: {
      default: null,
      type: String
    },
    wasAdded: {
      default: false,
      type: Boolean
    },
    nodes: {
      default: null,
      type: Array
    },
    depth: {
      default: null,
      type: Number
    },
    locale: {
      default: null,
      type: String
    },
    defaultDepth: {
      default: undefined,
      type: Number
    },
    changesNodes: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      showChildren: true,
      indentSize: 15,
      showAdd: false
    }
  },
  computed: {
    indent () {
      return {
        transform: `translate(${this.depth * this.indentSize}px)`
      }
    },
    indentAddNode () {
      return {
        transform: `translate(${(this.depth * this.indentSize) + this.indentSize}px)`
      }
    }
  },
  beforeMount () {
    if (this.defaultDepth) {
      this.showChildren = !(this.depth > this.defaultDepth)
    }
  },
  methods: {
    toggleChildren () {
      if (!this.hasValue) this.showChildren = !this.showChildren
    },
    getCharDiff (content, edited) {
      const diffStr = this.diffWords(content, edited)
      return diffStr
    },
    getDiffHtmlChars (isLabel, wasAdded, val, nodeId) {
      let oldVal, newVal
      const changes = this.isInChanges(isLabel, wasAdded, nodeId)
      const wasDeleted = changes && changes.action === 'deleted'
      if (changes) {
        if (wasAdded && !wasDeleted) {
          oldVal = ''
          newVal = val || ''
        } else if (!wasAdded && wasDeleted) {
          oldVal = val || ''
          newVal = ''
        } else {
          oldVal = changes.oldVal
          newVal = changes.val
        }
        const charDiff = this.getCharDiff(oldVal, newVal)
        const diffText = this.diffHtmlChars(charDiff)
        return diffText
      } else {
        return val
      }
    },
    isInChanges (isLabel, wasAdded, nodeId) {
      // console.log('\nC > JsonTree > isInChanges > this.changesNodes : ', this.changesNodes)
      // console.log('C > JsonTree > isInChanges > nodeId : ', nodeId)
      let bool, boolDeleted
      if (isLabel) {
        bool = this.changesNodes.find(n => n.nodeId === nodeId && n.isLabel)
      } else {
        bool = this.changesNodes.find(n => n.nodeId === nodeId && !n.isLabel)
        boolDeleted = this.changesNodes.find(n => n.nodeId === nodeId && n.action === 'deleted')
        if (boolDeleted) bool = boolDeleted
      }
      if (wasAdded) bool = true
      return bool
    },
    // TO DO
    addNode () {
      const payload = {
        action: 'added',
        fileId: this.fileId,
        nodeId: this.nodeId
      }
      console.log('\nC > JsonTree > addNode > payload : ', payload)
      // this.$emit('updateJson', payload)
    },
    SendActionToParent (event) {
      this.$emit('updateJson', event)
    }
  }
}
</script>

<style scoped>
.gt-node-label {
  background-color: #f5f5f5;
  color: #da1039;
  font-size: .875em;
  font-weight: 400;
  padding: 0.25em 0.5em 0.25em;
  font-family: monospace;
}
</style>