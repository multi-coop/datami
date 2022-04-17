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
            position="is-left">
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
          <span v-if="false">
            <!-- {{ nodeType }} -->
            <code v-if="wasAddedNode">+ {{ wasAddedNode }}</code> &nbsp;
            <code v-if="wasDeletedNode">- {{ wasDeletedNode }}</code>
          </span>
          <span v-if="view === 'edit' && depth !== 0 && allowKeyEdit">
            <EditJsonCell
              v-model="showRemoveNodeDialog"
              :file-id="fileId"
              :node-id="nodeId"
              :input-data="label"
              :is-label="true"
              :icon="'code-braces'"
              :has-value="hasValue"
              :is-array-item="parentType === 'arr'"
              :show-children="showChildren"
              :locale="locale"
              @toggleShowChildren="showChildren = !showChildren"
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
              :class="`${ wasAddedNode ? insFragClass : ''} ${ wasDeletedNode ? delFragClass : ''}`">
              <span
                :class="`gt-node-label ${!showChildren || hasValue ? 'has-text-grey' : ''}`"
                v-html="getDiffHtmlChars (true, wasAddedNode, label, nodeId)"/>
            </span>
          </span>

          <!-- NODE TYPE ICON -->
          <b-tooltip
            :label="`${t(`editJson.nodeTypeOf`, locale)} : ${t(`editJson.${nodeType}`, locale)}`"
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
              v-model="showRemoveNodeDialog"
              :file-id="fileId"
              :node-id="nodeId"
              :node-type="nodeType"
              :is-array-item="parentType === 'arr'"
              :input-data="value"
              :is-label="false"
              :icon="getNodeTypeIcon"
              :locale="locale"
              @updateJson="SendActionToParent"/>
          </span>
          <span v-if="view === 'diff'">
            <span
              v-if="view === 'diff'"
              :class="`is-size-7 ${getValueClass}`"
              v-html="getDiffHtmlChars (false, wasAddedNode, value, nodeId)"/>
          </span>
          <span v-if="view === 'preview'">
            <span :class="`is-size-7 ${getValueClass}`">
              {{ value }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- REMOVE NODE DIALOG -->
    <DialogDeleteNode
      v-show="showRemoveNodeDialog"
      v-model="showRemoveNodeDialog"
      :node-infos="nodeInfos"
      :indent="indent"
      :locale="locale"
      @confirmDeleteNode="removeNode"/>

    <!-- DEBUGGING DIFF -->
    <div
      v-if="false && view === 'diff' && getChanges && getChanges.hasDiff"
      class="box">
      Node <code>{{ this.label }} / {{ this.nodeType }}</code> has diff =><br>
      Node id : <code>{{ this.nodeId }}</code><br>
      <pre><code>{{ getChanges }}</code></pre>
    </div>
    <div v-if="false && view === 'diff'">
      <pre>{{ getChildrenNodes }}</pre>
    </div>

    <!-- LOOP CHILDREN NODES -->
    <div v-show="showChildren && !showRemoveNodeDialog">
      <json-tree
        v-for="node in getChildrenNodes"
        :key="node.id"
        :file-id="fileId"
        :view="view"
        :allow-key-edit="allowKeyEdit"
        :node-id="node.id"
        :label="node.label"
        :value="node.value"
        :parent-id="nodeId"
        :parent-type="nodeType"
        :node-type="node.nodeType"
        :nodes="node.nodes"
        :depth="depth + 1"
        :locale="locale"
        :default-depth="defaultDepth"
        :changes-nodes="changesNodes"
        :was-added-node="node.wasAdded"
        :was-deleted-node="node.wasDeleted"
        :debug="debug"
        @updateJson="SendActionToParent"/>
    </div>

    <!-- ADD NODE -->
    <div
      v-if="view === 'edit' && !hasValue && showChildren && !showRemoveNodeDialog && !showAddNodeDialog"
      class="is-flex is-direction-row is-align-items-center"
      :style="indentAddNode"
      @mouseenter="showAdd = true"
      @mouseleave="showAdd = false"
      @click="showAddNodeDialog = !showAddNodeDialog">
      <b-icon
        :icon="`plus${showAdd || showAddNodeDialog ? '-thick' : ''}`"
        size="is-small"
        class="my-1"/>
      <span
        v-show="showAdd"
        class="is-size-7 has-text-dark ml-2">
        <span class="is-italic">
          {{ t(`editJson.addTo`, locale) }} :
        </span>
        <code>{{ label }}</code>
        <b-icon
          class=""
          size="is-small"
          type="is-danger"
          :icon="getNodeTypeIcon"/>
      </span>
    </div>
    <!-- ADD NODE DIALOG -->
    <DialogAddNode
      v-show="showAddNodeDialog"
      v-model="showAddNodeDialog"
      :node-infos="nodeInfos"
      :indent="indent"
      :locale="locale"
      @confirmAddNode="addNode"/>
  </div>
</template>

<script>
import { mixinGlobal, mixinDiff, mixinJsonNode } from '@/utils/mixins.js'

import EditJsonCell from '@/components/edition/json/EditJsonCell'
import DialogDeleteNode from '@/components/edition/json/DialogDeleteNode'
import DialogAddNode from '@/components/edition/json/DialogAddNode'

export default {
  name: 'JsonTree',
  components: {
    EditJsonCell,
    DialogDeleteNode,
    DialogAddNode
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
    allowKeyEdit: {
      default: false,
      type: Boolean
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
    parentId: {
      default: null,
      type: String
    },
    parentType: {
      default: null,
      type: String
    },
    nodeType: {
      default: null,
      type: String
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
    },
    wasAddedNode: {
      default: false,
      type: Boolean
    },
    wasDeletedNode: {
      default: false,
      type: Boolean
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      showChildren: true,
      showRemoveNodeDialog: false,
      indentSize: 15,
      showAdd: false,
      showAddNodeDialog: false
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
    },
    isDiffMode () {
      return this.view === 'diff'
    },
    getChildrenNodes () {
      let addedNodes, deletedNodes
      let nodes = this.nodes
      if (this.isDiffMode) {
        console.log('\nC > JsonTree > getChildrenNodes > this.nodes : ', this.nodes)
        addedNodes = this.getChangesAdded.map(n => n.newNode) || []
        console.log('C > JsonTree > getChildrenNodes > addedNodes : ', addedNodes)
        deletedNodes = this.getChangesDeleted.map(n => n.deletedNode) || []
        console.log('C > JsonTree > getChildrenNodes > deletedNodes : ', deletedNodes)
        // nodes = [...nodes, ...addedNodes, ...deletedNodes]
        nodes = addedNodes.length ? [...nodes, ...addedNodes] : nodes
        nodes = deletedNodes.length ? [...nodes, ...deletedNodes] : nodes
        console.log('C > JsonTree > getChildrenNodes > nodes : ', nodes)
      }
      return nodes
    },
    getChangesDiff () {
      // get diff on this node
      const diffs = this.isDiffMode && this.changesNodes.filter(ch => ch.action === 'diff' && ch.nodeId === this.nodeId)
      return diffs
    },
    getChangesAdded () {
      // get additions to this node
      const additions = this.isDiffMode && this.changesNodes.filter(ch => ch.action === 'added' && ch.parentId === this.nodeId)
      return additions
    },
    getChangesDeleted () {
      // get deleted children
      const deletions = this.isDiffMode && this.changesNodes.filter(ch => ch.action === 'deleted' && ch.parentId === this.nodeId)
      return deletions
    },
    getChanges () {
      let deletions, diffs, additions, allChanges
      if (this.isDiffMode) {
        diffs = this.getChangesDiff
        deletions = this.getChangesDeleted
        additions = this.getChangesAdded
        allChanges = [deletions, diffs, additions]
        return {
          hasDiff: allChanges.some(ch => !!ch.length),
          deleted: deletions,
          diffs: diffs,
          addded: additions
        }
      } else return false
    },
    nodeInfos () {
      return {
        fileId: this.fileId,
        nodeId: this.nodeId,
        nodeType: this.nodeType,
        nodeTypeIcon: this.getNodeTypeIcon,
        value: this.value,
        children: this.nodes && this.nodes.length,
        label: this.label
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
    addNode (event) {
      const newNode = event.newNode
      newNode.wasAdded = true
      const payload = {
        action: 'added',
        fileId: this.fileId,
        parentId: this.nodeId,
        newNode: newNode
      }
      console.log('\nC > JsonTree > addNode > payload : ', payload)
      this.$emit('updateJson', payload)
    },
    removeNode () {
      const deletedNode = {
        nodeType: this.nodeType,
        label: this.label,
        value: this.value,
        wasDeleted: true
      }
      let deletedSubNodes = this.nodes && [...this.nodes]
      deletedSubNodes = deletedSubNodes && deletedSubNodes.map(n => { return { ...n, wasDeleted: true } })
      deletedNode.nodes = deletedSubNodes

      const payload = {
        action: 'deleted',
        fileId: this.fileId,
        nodeId: this.nodeId,
        parentId: this.parentId,
        deletedNode: deletedNode
      }
      this.$emit('updateJson', payload)
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
