<template>
  <div class="DialogUploadFile datami-component container mb-4">
    <div class="columns is-vcentered is-centered">
      <div class="column is-9">
        <div class="card">
          <!-- HEADER -->
          <header class="card-header">
            <p class="card-header-title mb-0">
              <b-icon
                class="mr-3"
                icon="upload"/>
              {{ t('edit.uploadData', locale) }}
              <span class="is-size-7 ml-3">
                (
                <span class="mx-2">
                  {{ t('file.fileType', locale) }} :
                </span>
                <span>
                  <code>.{{ gitObj.filetype }}</code>
                </span>
                )
              </span>
            </p>
            <button
              class="card-header-icon"
              @click="closeDialog">
              <b-icon
                icon="close"/>
            </button>
          </header>

          <!-- UPLOAD DIALOG -->
          <div class="card-content">
            <div class="content mb-3">
              <!-- DEBUGGING -->
              <div
                v-if="false"
                class="column is-10">
                fileTypeFamily : <code>{{ fileTypeFamily }}</code>
              </div>
              <div
                v-if="false"
                class="has-text-centered">
                🚧 &nbsp; work in progress - uploading file -
                <code>.{{ gitObj.filetype }}</code>
                /
                <code>{{ fileTypeFamily }}</code>
              </div>

              <b-tabs
                v-model="activeTab"
                position="is-centered"
                class="">
                <b-tab-item
                  :label="t('actions.uploadFile', locale)">
                  <div class="columns is-centered is-multiline mt-3">
                    <div class="column is-10">
                      <!-- UPLOAD BUTTON -->
                      <!-- <b-field class="file">
                        <b-upload
                          v-model="file"
                          :accept="`.${gitObj.filetype}`"
                          expanded>
                          <a class="button is-dark is-fullwidth">
                            <b-icon icon="upload"/>
                            <span>{{ file.name || t('actions.clickToUpload', locale) }}</span>
                          </a>
                        </b-upload>
                      </b-field> -->

                      <!-- DRAG AND DROP AREA -->
                      <b-field>
                        <b-upload
                          v-model="file"
                          :accept="`.${gitObj.filetype}`"
                          drag-drop
                          expanded>
                          <section class="section">
                            <div class="content has-text-centered">
                              <p>
                                <b-icon
                                  icon="upload"
                                  size="is-large"/>
                              </p>
                              <p>
                                {{ (file && file.name) || t('actions.clickOrDropFile', locale) }}
                              </p>
                            </div>
                          </section>
                        </b-upload>
                      </b-field>

                      <!-- TAG REPEATING -->
                      <div
                        v-if="fileReady"
                        class="tags">
                        <span
                          class="tag is-dark">
                          {{ file.name }}
                          <button
                            class="delete is-small"
                            type="button"
                            @click="deleteFile()"/>
                        </span>
                      </div>
                    </div>
                  </div>
                </b-tab-item>

                <!-- PREVIEW UPLOAD -->
                <b-tab-item
                  :disabled="!fileReady"
                  :label="t('preview.uploadedPreview', locale)">
                  <p class="has-text-centered">
                    <b-icon
                      class="mr-2"
                      size="is-small"
                      icon="file"/>
                    {{ file && file.name }}
                  </p>
                  <div class="content">
                    <pre><code>{{ uploaded }}</code></pre>
                  </div>
                </b-tab-item>
              </b-tabs>
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
              icon-left="plus-thick"
              type="is-dark"
              :disabled="!fileReady"
              @click="sendUploadToParent">
              {{ t('edit.uploadData', locale) }}
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
  name: 'DialogUploadFile',
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
    fileId: {
      default: undefined,
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
      activeTab: 0,
      uploaded: undefined,
      file: {}
    }
  },
  computed: {
    fileReady () {
      return !!(this.file && this.file.name)
    }
  },
  watch: {
    file (next) {
      if (next) {
        // console.log('\nC > DialogUploadFile > watch > file > next :', next)
        const reader = new FileReader()
        reader.onload = e => {
          this.uploaded = e.target.result
        }
        reader.readAsText(next)
        this.activeTab = 1
      }
    }
  },
  methods: {
    handleInput (value) {
      this.$emit('blur', value)
    },
    closeDialog () {
      this.handleInput(false)

      // track with matomo
      this.trackEvent('closeDialog')
    },
    deleteFile (index) {
      this.file = {}
    },
    sendUploadToParent () {
      // console.log('\nC > DialogUploadFile > sendUploadToParent > this.uploaded :', this.uploaded)
      const payload = {
        action: 'uploadFileData',
        file: this.file,
        data: this.uploaded
      }
      this.$emit('action', payload)
      this.closeDialog()
      this.file = undefined
      this.uploaded = undefined

      // track with matomo
      this.trackEvent('sendUploadToParent')
    }
  }
}
</script>
