<template>
  <div
    class="DialogDeleteNode datami-component mb-5"
    :style="indent">
    <div class="columns">
      <div class="column is-8">
        <div class="card">
          <!-- CARD HEADER -->
          <header class="card-header">
            <p class="card-header-title mb-0">
              <b-icon
                class="mr-3"
                :icon="icon"/>
              {{ t('editJson.removeNode', locale) }}
            </p>
            <button
              class="card-header-icon"
              @click="closeDialog">
              <b-icon
                icon="close"/>
            </button>
          </header>

          <!-- NODE TO DELETE -->
          <div class="card-content">
            <div class="content my-4">
              <p class="has-text-weight-bold has-text-centered">
                {{ t('editJson.confirmRemoveNode', locale) }}
              </p>
              <!-- NODE TITLE -->
              <p v-if="false">
                {{ nodeInfos }}
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
                <span class="mr-2">
                  :
                </span>
                <span v-if="nodeInfos.value">
                  {{ nodeInfos.value }}
                </span>
                <span
                  v-if="nodeInfos.children"
                  class="is-italic">
                  [
                  {{ nodeInfos.children }}
                  {{ t('editJson.childrenNodes') }}
                  ]
                </span>
              </p>
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
              @click="sendNodeToDeleteToParent">
              {{ t('editJson.removeNode', locale) }}
            </b-button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DialogDeleteNode',
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
      icon: 'trash-can'
    }
  },
  methods: {
    handleInput (value) {
      this.$emit('blur', value)
    },
    closeDialog () {
      this.handleInput(false)
    },
    sendNodeToDeleteToParent () {
      // console.log('\nC > DialogDeleteNode > sendNodeToDeleteToParent > this.temp :', this.temp)
      this.$emit('confirmDeleteNode')
      this.closeDialog()
    }
  }
}
</script>
