<template>
  <div
    v-if="item"
    :class="`DatamiCard datami-component card ${isHovered || showDetail ? 'hover-effect' : '' }`"
    :style="`background-color: ${showDetail ? '#f6f6f6' : 'white'};`"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false">
    <!-- style="background-color: #f6f6f6" -->
    <!-- HEADER / TITLE : 'title'-->
    <header class="card-header no-shadow">
      <div
        class="card-header-title"
        @click="toggleDetail('showDetailButton')">
        <div
          v-if="!showDetail"
          class="columns is-multiline my-0 pl-3">
          <div class="column is-12 px-0 py-0">
            <!-- TITLE BLOCK : 'title' -->
            <DatamiCardBlockContent
              v-for="(fieldObj, i) in getFieldsByPosition('title')"
              :key="`title-${i}-${fieldObj.field}`"
              :file-id="fileId"
              :position="'title'"
              :field="fieldObj"
              :field-label="getFieldLabel(fieldObj.field)"
              :item-id="item.id"
              :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
              :item-added="item.added"
              :item-value="item[fieldObj.field]"
              :is-mini="isMini"
              :locale="locale"
              @updateCellValue="emitUpdate"
              @toggleDetail="toggleDetail">
              <template #logo>
                <div v-if="hasContentByPosition('logo')">
                  <!-- LOGO BLOCK : 'logo' -->
                  <div
                    v-for="(fieldObj, i) in getFieldsByPosition('logo')"
                    :key="`logo-${i}-${fieldObj.field}`"
                    class="card-logo"
                    @click="toggleDetail">
                    <DatamiCardBlockImage
                      :key="`logo-${i}-${fieldObj.field}`"
                      :file-id="fileId"
                      :position="'logo'"
                      :field="fieldObj"
                      :field-label="getFieldLabel(fieldObj.field)"
                      :item-id="item.id"
                      :item-value="item[fieldObj.field]"
                      :is-mini="isMini"
                      :locale="locale"/>
                  </div>
                </div>
              </template>
            </DatamiCardBlockContent>
          </div>

          <!-- SUBTITLE BLOCK : 'subtitle' -->
          <div class="column is-12 px-0 py-0">
            <div v-if="hasContentByPosition('subtitle')">
              <DatamiCardBlockContent
                v-for="(fieldObj, i) in getFieldsByPosition('subtitle')"
                :key="`subtitle-${i}-${fieldObj.field}`"
                :file-id="fileId"
                :position="'subtitle'"
                :field="fieldObj"
                :field-label="getFieldLabel(fieldObj.field)"
                :item-id="item.id"
                :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                :item-added="item.added"
                :item-value="item[fieldObj.field]"
                :is-mini="isMini"
                :locale="locale"
                @updateCellValue="emitUpdate"/>
            </div>
          </div>
        </div>
      </div>

      <button
        class="card-header-icon"
        @click="toggleDetail('closeButton')">
        <b-tooltip
          :label="t(`preview.${showDetail || fromMap ? 'closeCard' : 'showCardDetails'}`, locale)"
          type="is-dark"
          position="is-right">
          <b-icon
            size="is-small"
            :icon="showDetail || fromMap ? 'close' : 'eye'"/>
        </b-tooltip>
      </button>
    </header>

    <!-- IMAGE BLOCK : 'image' -->
    <div
      v-if="!showDetail && hasContentByPosition('image')"
      class="card-image mb-2"
      @click="toggleDetail">
      <DatamiCardBlockImage
        v-for="(fieldObj, i) in getFieldsByPosition('image')"
        :key="`image-${i}-${fieldObj.field}`"
        :file-id="fileId"
        :position="'image'"
        :field="fieldObj"
        :field-label="getFieldLabel(fieldObj.field)"
        :item-id="item.id"
        :item-value="item[fieldObj.field]"
        :is-mini="isMini"
        :locale="locale"/>
    </div>

    <!-- CONTENT -->
    <div :class="`card-content pt-0 ${showDetail ? 'detail-padding' : ''}`">
      <!-- DEBUG -->
      <div v-if="debug">
        <!-- <pre><code>{{ item }}</code></pre> -->
        <!-- <pre><code>{{ fieldMapping }}</code></pre> -->
        <p>
          fieldMapping: <br>
          <code>
            <pre>{{ fieldMapping }}</pre>
          </code>
        </p>
        <p>
          getFieldsByPosition('description'): <br>
          <code>
            <pre>{{ getFieldsByPosition('description') }}</pre>
          </code>
        </p>
        <p>
          item: <br>
          <code>
            <pre>{{ item }}</pre>
          </code>
        </p>
      </div>

      <div class="columns is-8 is-multiline">
        <!-- COLUMN LEFT DETAIL -->
        <div
          :class="`column py-0 is-${showDetail ? '6 pl-0 pr-3' : '12'}`">
          <div class="columns is-multiline">
            <!-- TITLE / SUBTITLE / ADRESS -->
            <div
              v-if="hasAnyContentByPosition(['title', 'subtitle', 'adress', 'logo'])"
              class="column is-12">
              <div
                :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <div v-if="showDetail">
                  <!-- TITLE BLOCK : 'title' -->
                  <DatamiCardBlockContent
                    v-for="(fieldObj, i) in getFieldsByPosition('title')"
                    :key="`title-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="'title'"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"
                    @updateCellValue="emitUpdate"
                    @toggleDetail="toggleDetail">
                    <template #logo>
                      <!-- LOGO BLOCK : 'logo' -->
                      <div
                        v-for="(fieldObj, i) in getFieldsByPosition('logo')"
                        :key="`logo-${i}-${fieldObj.field}`"
                        class="card-logo"
                        @click="toggleDetail">
                        <DatamiCardBlockImage
                          :key="`logo-${i}-${fieldObj.field}`"
                          :file-id="fileId"
                          :position="'logo'"
                          :field="fieldObj"
                          :field-label="getFieldLabel(fieldObj.field)"
                          :item-id="item.id"
                          :item-value="item[fieldObj.field]"
                          :is-mini="isMini"
                          :locale="locale"/>
                      </div>
                    </template>
                  </DatamiCardBlockContent>

                  <!-- SUBTITLE BLOCK : 'subtitle' -->
                  <div v-if="hasContentByPosition('subtitle')">
                    <DatamiCardBlockContent
                      v-for="(fieldObj, i) in getFieldsByPosition('subtitle')"
                      :key="`subtitle-${i}-${fieldObj.field}`"
                      :file-id="fileId"
                      :position="'subtitle'"
                      :field="fieldObj"
                      :field-label="getFieldLabel(fieldObj.field)"
                      :item-id="item.id"
                      :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                      :item-added="item.added"
                      :item-value="item[fieldObj.field]"
                      :is-mini="isMini"
                      :locale="locale"
                      @updateCellValue="emitUpdate"/>
                  </div>
                </div>

                <!-- ADRESS BLOCK : 'adress' -->
                <div v-if="hasContentByPosition('adress')">
                  <DatamiCardBlockContent
                    v-for="(fieldObj, i) in getFieldsByPosition('adress')"
                    :key="`adress-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="'adress'"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"
                    @updateCellValue="emitUpdate"/>
                </div>
              </div>
            </div>

            <!-- RESUME & DESCRIPTION -->
            <div
              v-if="hasAnyContentByPosition(['resume', 'description'])"
              class="column is-12">
              <div
                :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <!-- RESUME BLOCK : resume -->
                <div v-if="hasContentByPosition('resume')">
                  <DatamiCardBlockContent
                    v-for="(fieldObj, i) in getFieldsByPosition('resume')"
                    :key="`resume-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="'resume'"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"
                    @updateCellValue="emitUpdate"/>
                </div>

                <!-- DESCRIPTION BLOCK :'description' -->
                <div v-if="hasContentByPosition('description')">
                  <DatamiCardBlockContent
                    v-for="(fieldObj, i) in getFieldsByPosition('description')"
                    :key="`description-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="'description'"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"
                    @updateCellValue="emitUpdate"/>
                </div>
              </div>
            </div>

            <!-- MINIMAP -->
            <div
              v-if="showDetail && cardHasMiniMap && !cardsSettingsMiniMap.right_side"
              class="column is-12">
              <div
                :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <DatamiMiniMap
                  :file-id="fileId"
                  :map-id="`${fileId}-minimap-${item.id}`"
                  :fields="fields"
                  :item="item"
                  :show-detail-card="showDetailCard"
                  :locale="locale"/>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN RIGHT DETAIL -->
        <div
          :class="`column py-0 is-${showDetail ? '6 pl-3 pr-0' : '12'}`">
          <div class="columns is-multiline">
            <!-- IMAGE BLOCK : 'image' -->
            <div
              v-if="hasAnyContentByPosition(['image', 'gallery'])"
              class="column is-12">
              <div v-if="showDetail && hasContentByPosition('image')">
                <DatamiCardBlockImage
                  v-for="(fieldObj, i) in getFieldsByPosition('image')"
                  :key="`image-${i}-${fieldObj.field}`"
                  :file-id="fileId"
                  :position="'image'"
                  :field="fieldObj"
                  :field-label="getFieldLabel(fieldObj.field)"
                  :item-id="item.id"
                  :item-value="item[fieldObj.field]"
                  :is-mini="isMini"
                  :locale="locale"/>
              </div>
            </div>

            <!-- INFOS -->
            <div
              v-if="hasAnyContentByPosition(['infos'])"
              class="column is-12">
              <div
                :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <!-- INFOS BLOCK : infos -->
                <div v-if="hasContentByPosition('infos')">
                  <DatamiCardBlockContent
                    v-for="(fieldObj, i) in getFieldsByPosition('infos')"
                    :key="`infos-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="'infos'"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"
                    @updateCellValue="emitUpdate"/>
                </div>
              </div>
            </div>

            <!-- TAGS BLOCK -->
            <div
              v-if="hasAnyContentByPosition(['tags'])"
              class="column is-12">
              <div
                :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <!-- TAGS BLOCK : 'tags' -->
                <div v-if="hasContentByPosition('tags')">
                  <DatamiCardBlockTags
                    v-for="(fieldObj, i) in getFieldsByPosition('tags')"
                    :key="`tags-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="'tags'"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"
                    @updateCellValue="emitUpdate"/>
                </div>
              </div>
            </div>

            <!-- LINKS BLOCK : 'links' -->
            <div
              v-if="hasAnyContentByPosition(['links'])"
              class="column is-12">
              <div
                :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <div v-if="hasContentByPosition('links')">
                  <DatamiCardBlockLinks
                    v-for="(fieldObj, i) in getFieldsByPosition('links')"
                    :key="`links-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="'links'"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"
                    @updateCellValue="emitUpdate"/>
                </div>
              </div>
            </div>

            <!-- MINIMAP -->
            <div
              v-if="showDetail && cardHasMiniMap && cardsSettingsMiniMap.right_side"
              class="column is-12">
              <div
                :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <DatamiMiniMap
                  :file-id="fileId"
                  :map-id="`${fileId}-minimap-${item.id}`"
                  :fields="fields"
                  :item="item"
                  :show-detail-card="showDetailCard"
                  :locale="locale"/>
              </div>
            </div>

            <!-- DATAVIZ / TO DO -->
            <!-- <div
              v-if="hasAnyContentByPosition(['dataviz'])"
              class="column is-12">
              <div
                :class="`content ${showDetail ? 'px-3 py-3' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                DATAVIZ
              </div>
            </div> -->
          </div>
        </div>

        <!-- RAW CONTENT (WIKITEXT) : 'wiki' -->
        <div
          v-if="!isMini && gitObj.filetype === 'wiki'"
          class="column is-12">
          <b-switch
            v-model="showRawContent"
            type="is-dark">
            {{ t('editWiki.showRawContent', locale) }}
          </b-switch>
          <p
            v-if="showRawContent"
            class="">
            <pre><code>{{ item.content }}</code></pre>
          </p>
        </div>
      </div>
    </div>

    <!-- CARD FOOTER -->
    <footer
      v-if="isMini"
      class="card-footer px-3 py-3">
      <!-- SHOW DETAILS BUTTON -->
      <b-button
        type="is-dark"
        size="is-small"
        icon-left="eye"
        expanded
        outlined
        @click="toggleDetail('showDetailButton')">
        {{ t('preview.showCardDetails', locale) }}
      </b-button>
    </footer>
    <footer
      v-if="!isMini && item.pageUrl"
      class="card-footer px-3 py-3">
      <!-- SHOW ITEM OUTLINK BUTTON -->
      <b-button
        tag="a"
        type="is-dark"
        size="is-small"
        icon-left="open-in-new"
        :href="item.pageUrl"
        target="_blank"
        expanded
        outlined
        class="outlink"
        @click="trackLink(item.pageUrl)">
        {{ t('editWiki.goToWikiPage', locale) }}
      </b-button>
    </footer>
  </div>
</template>

<script>

import { mixinGlobal, mixinValue, mixinDiff } from '@/utils/mixins.js'

import DatamiCardBlockImage from '@/components/previews/cards/DatamiCardBlockImage'
import DatamiCardBlockContent from '@/components/previews/cards/DatamiCardBlockContent'
import DatamiCardBlockTags from '@/components/previews/cards/DatamiCardBlockTags'
import DatamiCardBlockLinks from '@/components/previews/cards/DatamiCardBlockLinks'

import DatamiMiniMap from '@/components/previews/maps/DatamiMiniMap'

// import PreviewCell from '@/components/previews/PreviewCell'
// import EditCell from '@/components/edition/csv/EditCell'

export default {
  name: 'DatamiCard',
  components: {
    DatamiCardBlockImage,
    DatamiCardBlockContent,
    DatamiCardBlockTags,
    DatamiCardBlockLinks,
    DatamiMiniMap
    // PreviewCell,
    // EditCell
  },
  mixins: [
    mixinGlobal,
    mixinValue,
    mixinDiff
  ],
  props: {
    fileId: {
      default: null,
      type: String
    },
    item: {
      default: null,
      type: Object
    },
    fields: {
      default: null,
      type: Array
    },
    fieldMapping: {
      default: null,
      type: Array
    },
    showDetail: {
      default: false,
      type: Boolean
    },
    showDetailCard: {
      default: false,
      type: Boolean
    },
    isMini: {
      default: false,
      type: Boolean
    },
    locale: {
      default: '',
      type: String
    },
    onlyPreview: {
      default: false,
      type: Boolean
    },
    fromMap: {
      default: false,
      type: Boolean
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      showRawContent: false,
      isHovered: false
    }
  },
  methods: {
    getFieldLabel (field) {
      const fieldObj = this.fields.find(f => f.field === field)
      return fieldObj && fieldObj.label
    },
    getFieldsByPosition (position) {
      return this.fieldMapping.filter(f => f.position === position)
    },
    hasContentByPosition (position) {
      const fields = this.getFieldsByPosition(position)
      return fields && fields.length > 0
    },
    hasAnyContentByPosition (positions) {
      const boolArray = []
      positions.forEach(p => {
        boolArray.push(this.hasContentByPosition(p))
      })
      return boolArray.some(b => b)
    },
    getTemplatedValues (field) {
      // console.log('\nC > DatamiCard > applyTemplate > field :', field)
      const templatedArray = field.templating.map(paragraph => {
        const text = paragraph.text[this.locale] || this.t('errors.templateMissing', this.locale)
        return this.applyTemplate(text)
      })
      return templatedArray
    },
    applyTemplate (text) {
      // replace value fields
      const fieldStart = '{{'
      const fieldEnd = '}}'
      const fieldRegex = new RegExp(`(${fieldStart}.*?${fieldEnd})`)

      let textArr = text
        .split(fieldRegex)
        .map(str => {
          let strClean
          if (str.startsWith(fieldStart)) {
            const fieldName = str.replace(fieldStart, '').replace(fieldEnd, '').trim()
            // console.log('\nC > DatamiCard > applyTemplate > fieldName :', fieldName)
            const fieldObj = this.fields.find(f => f.name === fieldName)
            // console.log('C > DatamiCard > applyTemplate > fieldObj :', fieldObj)
            const itemValue = this.item[fieldObj.field]
            strClean = itemValue || this.t('global.noValue', this.locale)
            // replace by value defintion if any in fieldObj
            if (itemValue && fieldObj.definitions) {
              const definition = fieldObj.definitions.find(def => def.value === strClean)
              strClean = (definition && definition.label) || strClean
            }
          } else {
            strClean = str
          }
          return strClean
        })

      // replace links fields
      const linksStart = '~~'
      const linksEnd = '~~'
      const linksRegex = new RegExp(`(${linksStart}.*?${linksEnd})`)
      textArr = textArr.join('')
        .split(linksRegex)
        .map(str => {
          let strClean
          if (str.startsWith(linksStart)) {
            const fieldName = str.replace(linksStart, '').replace(linksEnd, '').trim()
            // console.log('\nC > DatamiCard > applyTemplate > fieldName :', fieldName)
            const fieldObj = this.fields.find(f => f.name === fieldName)
            // console.log('C > DatamiCard > applyTemplate > fieldObj :', fieldObj)
            strClean = this.item[fieldObj.field] ? `<a href="${this.item[fieldObj.field]}" style="color: grey; text-decoration: underline;">${this.t('global.link', this.locale)}</a>` : this.t('global.noLinkValue', this.locale)
          } else {
            strClean = str
          }
          return strClean
        })

      const textClean = textArr.join('')
      return textClean
    },
    // closeCard () {
    //   this.$emit('toggleDetail', this.item.id)
    // },
    toggleDetail (event) {
      // console.log('\nC > DatamiCard > toggleDetail > event :', event)
      // console.log('C > DatamiCard > toggleDetail > this.fieldMapping :', this.fieldMapping)
      // console.log('C > DatamiCard > toggleDetail > this.showDetail :', this.showDetail)
      const payload = {
        isMini: this.isMini,
        showDetail: this.showDetail,
        btn: event,
        itemId: this.item.id
      }
      // this.$emit('toggleDetail', this.item.id)
      this.$emit('toggleDetail', payload)

      if (this.showDetail) {
        // track with matomo
        this.trackEvent('toggleDetail')
      }
    },
    emitUpdate (event) {
      this.$emit('updateCellValue', event)
    },
    SendActionToParent (event) {
      this.$emit('action', event)
    }
  }
}

</script>

<style scoped>
  .no-shadow {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .image-wrapper {
    min-height: 200px;
  }
  .image-constrained {
    max-height: 200px;
    width: auto !important;
  }
  .card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .card-content {
    height: 100%;
  }
  .hover-effect {
    transition: all .3s cubic-bezier(.25,.8,.25,1);
    box-shadow: 0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22);
  }
  .detail-padding {
    padding-bottom: 3em;
    padding-left: 3em;
    padding-right: 3em;
  }
</style>
