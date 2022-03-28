<template>
  <div v-html="outputHtml"/>
</template>

<script>
import showdown from 'showdown'

export default {
  name: 'ShowDown',
  props: {
    /**
     * Raw markdown content
     */
    markdown: {
      type: String,
      required: false,
      default: null
    },
    /**
     * HTML tag of the markdown wrapper
     */
    tag: {
      type: String,
      required: false,
      default: 'div'
    },
    /**
     * Showdown flavor
     *
     * @see https://github.com/showdownjs/showdown#flavors
     */
    flavor: {
      type: String,
      required: false,
      default: null
    },
    /**
     * Showdown options
     *
     * @see https://github.com/showdownjs/showdown#valid-options
     */
    options: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  computed: {
    converter () {
      const instance = new showdown.Converter()
      if (this.flavor !== null) {
        instance.setFlavor(this.flavor)
      }
      Object.entries(this.options).forEach(([key, value]) => {
        instance.setOption(key, value)
      })
      return instance
    },
    inputMarkdown () {
      // from props
      if (this.markdown !== null) {
        return this.markdown
      }
      // fall back to empty string
      return ''
    },
    outputHtml () {
      // console.log('C > ShowDown > outputHtml > this.converter : ', this.converter)
      // console.log('C > ShowDown > outputHtml > this.inputMarkdown : ', this.inputMarkdown)
      const output = this.converter.makeHtml(this.inputMarkdown)
      // console.log('C > ShowDown > outputHtml > output : ', output)
      return output
    }
  }
}
</script>
