<template>
  <div class="columns is-mobile">
    <!-- EDIT -->
    <div class="column is-half">
      <b-input
        :value="edited"
        type="textarea"
        @input="onInput"/>
    </div>
    <!-- DIFF -->
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
  name: 'ShowDownEditDiff',
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
  methods: {
    onInput (event) {
      console.log('C > ShowDownEditDiff > onInput > event : ', event)
      this.$emit('update:edited', event)
    }
  }
}
</script>
