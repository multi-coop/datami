<template>
  <div class="DialogCopyWidget datami-component container mb-4">
    <div class="card">
      <!-- HEADER -->
      <header class="card-header">
        <p class="card-header-title">
          <b-icon
            class="mr-3"
            icon="code-tags"/>
          {{ content.title }}
        </p>
      </header>

      <!-- INFOS -->
      <div class="card-content">
        <div class="columns mx-5 mt-4 mb-5">
          <div
            class="is-8 is-offset-2"
            v-html="content.message"/>
        </div>
        <!-- <div class="content mx-6">
          content: <br><pre><code>{{ content }}</code></pre>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DialogCopyWidget',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    dialogId: {
      default: null,
      type: String
    },
    content: {
      default: null,
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
  }
}
</script>
