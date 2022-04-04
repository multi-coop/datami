<template>
  <div class="EditModeBtns content">
    <b-field>
      <!-- EDIT -->
      <p class="control">
        <b-button icon-left="pencil"/>
      </p>
      <!-- DIFF -->
      <p class="control">
        <b-button icon-left="table-border"/>
      </p>
      <!-- PREVIEW -->
      <p class="control">
        <b-button icon-left="eye"/>
      </p>
    </b-field>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EditModeBtns',
  components: {
  },
  props: {
    gitObj: {
      default: undefined,
      type: Object
    },
    locale: {
      default: 'en',
      type: String
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation'
    })
  }
}
</script>
