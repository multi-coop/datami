<template>
  <div class="columns is-mobile">
    <!-- EDIT -->
    <div class="column is-half">
      <b-input
        :value="edited"
        type="textarea"
        :rows="numberLines"
        @input="onInput"/>
    </div>
    <!-- PREVIEW -->
    <div class="column is-half">
      <ShowDown
        :markdown="edited"
        flavor="github"/>
    </div>
  </div>
</template>

<script>
import ShowDown from '@/components/previews/ShowDown'

export default {
  name: 'ShowDownEdit',
  components: {
    ShowDown
  },
  props: {
    edited: {
      type: String,
      required: false,
      default: null
    },
    content: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {}
  },
  computed: {
    numberLines () {
      return this.edited.split(/\r\n|\r|\n/).length + 2
    }
  },
  methods: {
    onInput (event) {
      console.log('C > ShowDownEdit > onInput > event : ', event)
      this.$emit('update:edited', event)
    }
  }
}
</script>
