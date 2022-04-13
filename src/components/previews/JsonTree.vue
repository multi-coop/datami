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
              :locale="locale"/>
          </span>
          <span
            v-else
            @click="toggleChildren">
            <code :class="!showChildren || hasValue ? 'has-text-grey' : ''">
              {{ label }}
            </code>
          </span>

          <!-- NODE TYPE ICON -->
          <b-tooltip
            v-if="view !== 'edit' || depth === 0"
            :label="`${t(`editJson.${nodeType}`, locale)}`"
            type="is-dark"
            position="is-right">
            <b-icon
              class="mx-3"
              size="is-small"
              :icon="getNodeTypeIcon"
              @click.native="toggleChildren"/>
          </b-tooltip>

          <!-- DOUBLE DOTS -->
          <!-- <span class="mx-2">
            :
          </span> -->

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
          v-if="hasValue">
          <span v-if="view === 'edit'">
            <EditJsonCell
              :file-id="fileId"
              :node-id="nodeId"
              :input-data="value"
              :is-label="false"
              :icon="getNodeTypeIcon"
              :locale="locale"/>
          </span>
          <span v-if="view === 'diff'">
            <span :class="`is-size-7 ${getValueClass}`">
              {{ value }} - diff
            </span>
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
        :nodes="node.nodes"
        :depth="depth + 1"/>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { mixinJsonNode } from '@/utils/mixins.js'

import EditJsonCell from '@/components/edition/json/EditJsonCell'

export default {
  name: 'JsonTree',
  components: {
    EditJsonCell
  },
  mixins: [mixinJsonNode],
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
    }
  },
  data () {
    return {
      showChildren: true
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    }),
    indent () {
      const indentSize = 15
      return {
        transform: `translate(${this.depth * indentSize}px)`
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
    }
  }
}
</script>
