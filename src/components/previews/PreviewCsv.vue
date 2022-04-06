<template>
  <div class="PreviewCsv content">
    <!-- DEBUG -->
    <div
      v-if="debug"
      class="columns is-multiline">
      <div class="column is-full">
        <p>
          dataRaw:
          <code>
            <pre>{{ dataRaw }}</pre>
          </code>
        </p>
      </div>
    </div>
    <p>
      currentViewMode : <code>{{ currentViewMode }}</code>
    </p>
    <div v-if="dataRaw">
      <b-table
        :data="tableData"
        narrowed
        hoverable
        sticky-header
        striped
        :columns="columns"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixinCsv } from '@/utils/mixins.js'

export default {
  name: 'PreviewCsv',
  mixins: [mixinCsv],
  props: {
    gitObj: {
      default: undefined,
      type: Object
    },
    fileInfos: {
      default: undefined,
      type: Object
    },
    fileOptions: {
      default: undefined,
      type: Object
    },
    fileRaw: {
      default: '',
      type: String
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
      dataRaw: undefined,
      edited: undefined
    }
  },
  computed: {
    ...mapGetters({
      t: 'git-translations/getTranslation',
      getViewMode: 'git-data/getViewMode'
    }),
    currentViewMode () {
      return this.getViewMode(this.gitObj.uuid)
    },
    tableData () {
      const data = this.dataRaw && this.dataRaw.data
      // TO DO => split cell content into tags if option says so
      // if (this.fileOptions.tagseparator) return
      return data
    },
    columns () {
      const columns = this.dataRaw && this.dataRaw.headers
      // console.log('C > PreviewCsv > columns > columns : ', columns)
      if (!columns) return null
      if (this.fileOptions.abstractHeaders) {
        return Object.entries(columns)
          .map(entry => {
            return {
              field: entry[0],
              label: entry[1]
            }
          })
      }
      return columns.map(h => {
        return { field: h, label: h }
      })
    }
  },
  watch: {
    fileRaw (next) {
      if (next && next !== '') {
        // console.log('C > PreviewCsv > watch > fileRaw > next : \n', next)
        // console.log('C > PreviewCsv > watch > fileRaw > this.fileOptions : ', this.fileOptions)
        this.dataRaw = this.csvToObject(next, this.fileOptions)
        this.edited = this.csvToObject(next, this.fileOptions)
      }
    }
  }
}
</script>
