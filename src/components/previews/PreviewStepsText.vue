<template>
  <div class="PreviewStepsText">
    <!-- DEBUGGING -->
    <p v-if="debug">
      fieldId : <br><pre><code>{{ fieldId }}</code></pre><br>
      field : <br><pre><code>{{ field }}</code></pre><br>
      stepOptions : <br><pre><code>{{ stepOptions }}</code></pre><br>
      stepTexts : <br><pre><code>{{ stepTexts }}</code></pre><br>
    </p>

    <!-- STEPS AS TIMELINE (ANY EXCEPT TABLE) -->
    <div
      v-if="!fromTable"
      class="timeline mt-3">
      <!-- TIMELINE START -->
      <header
        v-if="stepStart"
        class="timeline-header is-justify-content-left">
        <span class="tag is-medium is-dark">
          {{ stepStart }}
        </span>
      </header>

      <!-- STEPS -->
      <div
        v-for="(step, i) in stepTexts"
        :key="`steps-${fileId}-${fieldId}-${i}`"
        :class="`timeline-item ${ i < (stepTexts.length - 1) ? 'pb-2' : ''}`">
        <div class="timeline-marker is-dark"/>
        <div class="timeline-content">
          <p
            v-if="step.title !== ''"
            class="heading">
            {{ step.title }}
          </p>
          <p>
            {{ step.content }}
          </p>
        </div>
      </div>

      <!-- TIMELINE END -->
      <header
        v-if="stepEnd"
        class="timeline-header is-justify-content-left">
        <span class="tag is-medium is-dark">
          {{ stepEnd }}
        </span>
      </header>
    </div>

    <!-- STEPS AS LIST (TABLE VIEW) -->
    <ul
      v-else
      class="mt-1">
      <li
        v-for="(step, i) in stepTexts"
        :key="`steps-${fileId}-${fieldId}-${i}-list`"
        class="">
        <p
          v-if="step.title !== ''"
          class="pb-0 mb-0 heading has-text-weight-bold">
          {{ step.title }}
        </p>
        <p class="is-size-7">
          {{ step.content }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>

// import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'PreviewStepsText',
  // mixins: [mixinGlobal],
  props: {
    fileId: {
      default: '',
      type: String
    },
    fromTable: {
      default: false,
      type: Boolean
    },
    fieldId: {
      default: '',
      type: String
    },
    field: {
      default: undefined,
      type: Object
    },
    rawText: {
      default: '',
      type: String
    },
    stepOptions: {
      default: undefined,
      // default: {
      //   stepStart: undefined,
      //   stepEnd: undefined,
      //   stepSeparator: '//',
      //   stepTitleSeparator: '::',
      // },
      type: Object
    },
    nowrap: {
      default: false,
      type: Boolean
    },
    locale: {
      default: null,
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    stepStart () {
      return this.stepOptions && this.stepOptions.stepStart
    },
    stepEnd () {
      return this.stepOptions && this.stepOptions.stepEnd
    },
    stepSeparator () {
      return (this.stepOptions && this.stepOptions.stepSeparator) || '//'
    },
    stepTitleSeparator () {
      return this.stepOptions && this.stepOptions.stepTitleSeparator
    },
    stepTexts () {
      const txtStepsArr = this.rawText.split(this.stepSeparator)
      // return txt
      let txtStepsObjArr = txtStepsArr.map(txt => {
        const stepObj = {
          title: undefined,
          content: ''
        }
        if (this.stepTitleSeparator) {
          const txtSplit = txt.includes(this.stepTitleSeparator) ? txt.split(this.stepTitleSeparator) : ['', txt]
          stepObj.title = txtSplit[0]
          stepObj.content = txtSplit[1]
        } else {
          stepObj.content = txt
        }
        return stepObj
      })
      if (this.nowrap && txtStepsObjArr.length > 2) {
        txtStepsObjArr = [
          ...txtStepsObjArr.slice(0, 1),
          { content: '...' }
        ]
      }
      return txtStepsObjArr
    }
  }
}
</script>
