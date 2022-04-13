<template>
  <div class="json-tree">
    <!-- NODE LABEL -->
    <div
      :style="indent"
      @click="toggleChildren">
      <div class="">
        <!-- CHEVRON TO OPEN/CLOSE NODE -->
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
        <!-- NODE LABEL -->
        <span class="">
          <code :class="showChildren ? '' : 'has-text-grey'">
            {{ label }}
          </code>
        </span>
        <!-- NODE TYPE ICON -->
        <b-icon
          class="ml-4"
          size="is-small"
          :icon="getNodeTypeIcon"/>
        <!--  -->
        <b-icon
          v-if="!showChildren"
          class="ml-4"
          type="is-gray"
          size="is-small"
          icon="dots-horizontal"/>
        <!-- VALUE IF ANY + EDITABLE -->
        <span v-if="hasValue">
          <span class="mx-5">
            :
          </span>
          <span :class="getValueClass">
            {{ value }}
          </span>
        </span>
      </div>
    </div>
    <!-- LOOP CHILDREN NODES -->
    <div v-if="showChildren">
      <json-tree
        v-for="node in nodes"
        :key="node.id"
        :label="node.label"
        :value="node.value"
        :node-type="node.nodeType"
        :nodes="node.nodes"
        :depth="depth + 1"/>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { mixinJsonNode } from '@/utils/mixins.js'

export default {
  name: 'JsonTree',
  mixins: [mixinJsonNode],
  props: {
    view: {
      default: 'preview',
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
