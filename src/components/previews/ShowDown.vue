<template>
  <div class="ShowDown datami-component datami-component-shodown">
    <div
      :style="`---txtColor: ${ isDarkMode ? 'white' : '#363636' };`"
      v-html="outputHtml"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import showdown from 'showdown'
import table from 'showdown-table'

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
  // data () {
  //   return {
  //     cssFiles: [
  //       'styles/components/previews/md/datami-shodown.css'
  //     ]
  //   }
  // },
  computed: {
    ...mapGetters({
      isDarkMode: 'git-storage/isDarkMode'
    }),
    converter () {
      // Create a showdown converter instance
      // const instance = new showdown.Converter({ extensions: [table] })
      const instance = new showdown.Converter()
      // console.log('C > ShowDown > instance : \n', instance)

      // Set up the md table extension and add it to converter
      const instanceTableExt = table(instance)
      // console.log('C > ShowDown > instanceTableExt : \n', instanceTableExt)
      instance.addExtension(instanceTableExt)

      // Other setups
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
      if (this.markdown !== null) return this.markdown
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
