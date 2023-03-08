<template>
  <div
    v-if="item"
    :class="`DatamiCard datami-component card datami-card ${isHovered || showDetail ? 'hover-effect' : '' }`"
    :style="`background-color: ${showDetail ? '#f6f6f6' : 'white'};${isMini && fromMap ? 'max-height: 500px; overflow: auto; border: 1px solid #363636;' : ''}`"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false">
    <!-- style="background-color: #f6f6f6" -->
    <!-- HEADER / TITLE : 'title'-->
    <header
      v-if="!showDetail"
      class="card-header no-shadow">
      <div
        class="card-header-title is-clickable"
        @click="currentEditViewMode !== 'edit' && toggleDetail('showDetailButton')">
        <div
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
              @toggleDetail="toggleDetail">
              <template #logo>
                <div v-if="hasContentByPosition('logo')">
                  <!-- LOGO BLOCK : 'logo' -->
                  <div
                    v-for="(fieldObjLogo, iLogo) in getFieldsByPosition('logo')"
                    :key="`logo-${iLogo}-${fieldObj.field}`"
                    class="card-logo"
                    @click="toggleDetail">
                    <DatamiCardBlockImage
                      :key="`logo-${iLogo}-${fieldObjLogo.field}`"
                      :file-id="fileId"
                      :position="'logo'"
                      :field="fieldObjLogo"
                      :field-label="getFieldLabel(fieldObjLogo.field)"
                      :item-id="item.id"
                      :item-value="item[fieldObjLogo.field]"
                      :item-added="item.added"
                      :is-mini="isMini"
                      :from-map="fromMap"
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
                :locale="locale"/>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="fromMap"
        class="card-header-icon is-align-items-flex-start"
        @click="toggleDetail('closeButton')">
        <!-- <b-icon
          size="is-small"
          icon="close"
          @mouseover.native="showGlobalTooltip($event, { position: 'right', type: 'info', label: t('preview.closeCard', locale) })"
          @mouseleave.native="hideGlobalTooltip"/> -->
        <HoverableIconWithTooltip
          :size="'is-small'"
          :icon="'close'"
          :position="'right'"
          :type="'info'"
          :label="t('preview.closeCard', locale)"/>
      </button>
    </header>

    <!-- IMAGE BLOCK : 'image' -->
    <div
      v-if="!showDetail && hasContentByPosition('image')"
      class="card-image mb-2 is-clickable"
      @click="currentEditViewMode !== 'edit' && toggleDetail('showDetailButton')">
      <DatamiCardBlockImage
        v-for="(fieldObj, i) in getFieldsByPosition('image')"
        :key="`image-${i}-${fieldObj.field}`"
        :file-id="fileId"
        :position="'image'"
        :field="fieldObj"
        :field-label="getFieldLabel(fieldObj.field)"
        :item-id="item.id"
        :item-value="item[fieldObj.field]"
        :item-added="item.added"
        :is-mini="isMini"
        :from-map="fromMap"
        :locale="locale"/>
    </div>

    <!-- CONTENT -->
    <div
      :class="`card-content datami-card-content ${showDetail ? 'datami-card-detail-padding' : 'pt-3'}`">
      <!-- :style="`${isMini && fromMap ? 'max-height: 300px; overflow: auto;' : ''}`"> -->
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

      <!-- VALUES CONTENT -->
      <div class="columns is-8 is-multiline">
        <!-- COLUMN LEFT DETAIL -->
        <div
          :class="`column py-0 is-${showDetail ? '6 pl-0 pr-3' : '12'}`">
          <div class="columns is-multiline">
            <!-- LEFT - TITLE / SUBTITLE / ADRESS -->
            <div
              v-if="hasAnyContentByPosition(['title', 'subtitle', 'adress', 'logo'])"
              :class="`column is-12 ${isMini ? 'pb-1' : ''}`">
              <div
                :class="`content ${showDetail ? 'px-3 pt-3 pb-1' : ''}`"
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
                    @toggleDetail="toggleDetail">
                    <template #logo>
                      <!-- LOGO BLOCK : 'logo' -->
                      <div
                        v-for="(fieldObjLogo, iLogo) in getFieldsByPosition('logo')"
                        :key="`logo-${iLogo}-${fieldObjLogo.field}`"
                        class="card-logo"
                        @click="toggleDetail">
                        <DatamiCardBlockImage
                          :key="`logo-${iLogo}-${fieldObjLogo.field}`"
                          :file-id="fileId"
                          :position="'logo'"
                          :field="fieldObjLogo"
                          :field-label="getFieldLabel(fieldObjLogo.field)"
                          :item-id="item.id"
                          :item-value="item[fieldObjLogo.field]"
                          :item-added="item.added"
                          :is-mini="isMini"
                          :from-map="fromMap"
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
                      :locale="locale"/>
                  </div>
                </div>

                <!-- ADRESS BLOCK : 'adress' -->
                <div v-if="hasContentByPosition('adress')">
                  <div v-if="currentEditViewMode === 'preview' && isMini">
                    <div class="media">
                      <div class="media-left mr-2">
                        <b-icon
                          icon="map-marker-outline"
                          size="is-small"/>
                      </div>
                      <div class="media-content">
                        <p
                          v-for="(fieldObj, i) in getFieldsByPosition('adress')"
                          :key="`adress-mini-${i}-${fieldObj.field}`"
                          class="mb-0">
                          <b-icon
                            v-if="fieldObj.prefixIcon"
                            :icon="fieldObj.prefixIcon"
                            class="mr-2"
                            size="is-small"/>
                          {{ item[fieldObj.field] }}
                        </p>
                      </div>
                    </div>
                    <!-- <code>{{ getFieldsByPosition('adress') }}</code> -->
                  </div>
                  <div v-else>
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
                      :locale="locale"/>
                  </div>
                </div>
              </div>
            </div>

            <!-- LEFT - IMAGE BLOCK : 'image' -->
            <div
              v-if="showDetail && hasAnyContentByPosition(['image', 'gallery'])"
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
                  :item-added="item.added"
                  :is-mini="isMini"
                  :from-map="fromMap"
                  :locale="locale"/>
              </div>
            </div>

            <!-- LEFT COLUMN -->
            <div
              v-for="pos in positions"
              :key="pos"
              :class="`column is-12 position-left-${pos} ${hasAnyContentByPosition([pos]) ? '' : 'py-0'}`">
              <div
                v-if="hasAnyContentByPosition([pos])"
                :class="`content ${showDetail ? 'px-3 pt-3 pb-1' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <div v-if="!norTagsNorLinks.includes(pos) && hasContentByPosition(pos) ">
                  <DatamiCardBlockContent
                    v-for="(fieldObj, i) in getFieldsByPosition(pos)"
                    :key="`${pos}-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="pos"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"/>
                </div>
                <div v-if="pos === 'tags' && hasContentByPosition('tags')">
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
                    :locale="locale"/>
                </div>
                <div v-if="pos === 'links' && hasContentByPosition('links')">
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
                    :locale="locale"/>
                </div>
              </div>
              <div
                v-if="mapPositions.includes(pos) && showDetail && cardHasMiniMap && cardsSettingsMiniMap.position === pos && !cardsSettingsMiniMap.right_side"
                :class="`content ${showDetail ? mapPositionsClasses[pos] : ''}`"
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
            <!-- RIGHT - IMAGE BLOCK : 'image' -->
            <div
              v-if="hasAnyContentByPosition(['image', 'gallery'], true)"
              class="column is-12">
              <div v-if="showDetail && hasContentByPosition('image', true)">
                <DatamiCardBlockImage
                  v-for="(fieldObj, i) in getFieldsByPosition('image', true)"
                  :key="`image-${i}-${fieldObj.field}`"
                  :file-id="fileId"
                  :position="'image'"
                  :field="fieldObj"
                  :field-label="getFieldLabel(fieldObj.field)"
                  :item-id="item.id"
                  :item-value="item[fieldObj.field]"
                  :item-added="item.added"
                  :is-mini="isMini"
                  :from-map="fromMap"
                  :locale="locale"/>
              </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div
              v-for="pos in positions"
              :key="pos"
              :class="`column is-12 position-right-${pos} ${hasAnyContentByPosition([pos], true) ? '' : 'py-0'}`">
              <div
                v-if="hasAnyContentByPosition([pos], true)"
                :class="`content ${showDetail ? 'px-3 pt-3 pb-1' : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <div v-if="!norTagsNorLinks.includes(pos) && hasContentByPosition(pos, true) ">
                  <DatamiCardBlockContent
                    v-for="(fieldObj, i) in getFieldsByPosition(pos, true)"
                    :key="`${pos}-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="pos"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :templated-values="fieldObj.templating && getTemplatedValues(fieldObj)"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"/>
                </div>
                <div v-if="tagsPositions.includes(pos) && hasContentByPosition(pos, true)">
                  <DatamiCardBlockTags
                    v-for="(fieldObj, i) in getFieldsByPosition(pos, true)"
                    :key="`${pos}-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="pos"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"/>
                </div>
                <div v-if="linksPositions.includes(pos) && hasContentByPosition(pos, true)">
                  <DatamiCardBlockLinks
                    v-for="(fieldObj, i) in getFieldsByPosition(pos, true)"
                    :key="`${pos}-${i}-${fieldObj.field}`"
                    :file-id="fileId"
                    :position="pos"
                    :field="fieldObj"
                    :field-label="getFieldLabel(fieldObj.field)"
                    :item-id="item.id"
                    :item-added="item.added"
                    :item-value="item[fieldObj.field]"
                    :is-mini="isMini"
                    :locale="locale"/>
                </div>
              </div>
              <div
                v-if="mapPositions.includes(pos) && showDetail && cardHasMiniMap && cardsSettingsMiniMap.position === pos && cardsSettingsMiniMap.right_side"
                :class="`content ${showDetail ? mapPositionsClasses[pos] : ''}`"
                :style="`background-color: ${showDetail? 'white' : 'white'}`">
                <DatamiMiniMap
                  :file-id="fileId"
                  :position="pos"
                  :map-id="`${fileId}-minimap-${item.id}`"
                  :fields="fields"
                  :item="item"
                  :show-detail-card="showDetailCard"
                  :locale="locale"/>
              </div>
              <!-- <div v-if="mapPositions.includes(pos)">
                {{ pos }} :
                <br> cardsSettingsMiniMap : <pre><code>{{ cardsSettingsMiniMap }}</code></pre>
                <br> showDetail : <code>{{ showDetail }}</code>
                <br> cardHasMiniMap.position : <code>{{ cardHasMiniMap.position }}</code>
                <br> cardsSettingsMiniMap.right_side : <code>{{ cardsSettingsMiniMap.right_side }}</code>
              </div> -->
            </div>
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

      <!-- MINIVIZS CONTENT -->
      <div
        v-if="minivizsSettings"
        class="columns is-8 is-multiline is-centered mt-3"
        style="margin-left: -1.5em; margin-right: -1.5em;">
        <!-- DEBUGGING -->
        <div
          v-for="(vizSettings, idx) in minivizsSettings"
          :key="`card-miniviz-${fileId}-${item.id}-${idx}`"
          :class="`column is-${showDetail ? (vizSettings.cols || 12) : defaultMiniColumnSize}-tablet`">
          <!-- <div
            v-if="debug"
            class="column is-12">
            vizSettings: <br><code>{{ vizSettings }}</code>
          </div> -->
          <DatamiMiniviz
            :file-id="fileId"
            :miniviz-settings="vizSettings"
            :item="item"
            :fields="fields"
            :show-detail="showDetail"
            :locale="locale"/>
          <!-- :data="computeMinivizSeries(vizSettings)" -->
          <!-- :options="computeMinivizOptions(vizSettings)" -->
        </div>
      </div>
    </div>

    <!-- CARD FOOTER -->
    <footer
      v-if="isMini && !fromMap"
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

import {
  mixinGlobal,
  mixinValue,
  mixinTexts,
  mixinDiff
} from '@/utils/mixins.js'

export default {
  name: 'DatamiCard',
  components: {
    HoverableIconWithTooltip: () => import(/* webpackChunkName: "HoverableIconWithTooltip" */ '@/components/user/HoverableIconWithTooltip.vue'),
    DatamiCardBlockImage: () => import(/* webpackChunkName: "DatamiCardBlockImage" */ '@/components/previews/cards/DatamiCardBlockImage.vue'),
    DatamiCardBlockContent: () => import(/* webpackChunkName: "DatamiCardBlockContent" */ '@/components/previews/cards/DatamiCardBlockContent.vue'),
    DatamiCardBlockTags: () => import(/* webpackChunkName: "DatamiCardBlockTags" */ '@/components/previews/cards/DatamiCardBlockTags.vue'),
    DatamiCardBlockLinks: () => import(/* webpackChunkName: "DatamiCardBlockLinks" */ '@/components/previews/cards/DatamiCardBlockLinks.vue'),
    DatamiMiniMap: () => import(/* webpackChunkName: "DatamiMiniMap" */ '@/components/previews/maps/DatamiMiniMap.vue'),
    DatamiMiniviz: () => import(/* webpackChunkName: "DatamiMiniviz" */ '@/components/previews/dataviz/DatamiMiniviz.vue')
  },
  mixins: [
    mixinGlobal,
    mixinValue,
    mixinTexts,
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
    itemsPerRow: {
      default: 3,
      type: Number
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
    fromTable: {
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
      isHovered: false,
      fixedPositions: [
        'title',
        'subtitle',
        'adress',
        'logo'
      ],
      positions: [
        'map_top',
        'resume',
        'infos',
        'links_top',
        'tags_top',
        'description',
        'links_middle',
        'map_middle',
        'tags_middle',
        'timeline',
        'tags',
        'links',
        'map_bottom'
      ],
      linksPositions: [
        'links_top',
        'links_middle',
        'links'
      ],
      tagsPositions: [
        'tags_top',
        'tags_middle',
        'tags'
      ],
      mapPositions: [
        'map_top',
        'map_middle',
        'map_bottom'
      ],
      mapPositionsClasses: {
        map_top: 'px-3 py-3 mt-3 mb-2',
        map_middle: 'px-3 py-3 my-2',
        map_bottom: 'px-3 py-3 mt-2'
      }
    }
  },
  computed: {
    norTagsNorLinks () {
      return [...this.linksPositions, ...this.tagsPositions]
    },
    minivizsSettings () {
      return this.cardsSettingsMinivizs && this.cardsSettingsMinivizs.filter(v => {
        if (!this.showDetail) {
          return v.activate && v.showOnMiniCard
        } else {
          return v.activate
        }
      })
    },
    defaultMiniColumnSize () {
      let colSize
      switch (this.itemsPerRow) {
        case 1:
          colSize = 4
          break
        case 2:
          colSize = 6
          break
        default:
          colSize = 12
      }
      return colSize
    }
  },
  methods: {
    getFieldLabel (field) {
      const fieldObj = this.fields.find(f => f.field === field)
      return fieldObj && fieldObj.label
    },
    getFieldsByPosition (position, isRight = false) {
      // const debug = this.mapPositions.includes(position)
      // const debug = position === 'adress'
      // debug && console.log('\nC > DatamiCard > getFieldsByPosition > position :', position)
      // debug && console.log('C > DatamiCard > getFieldsByPosition > this.cardsSettingsFromOptions :', this.cardsSettingsFromOptions)
      // debug && console.log('C > DatamiCard > getFieldsByPosition > isRight :', isRight)
      // debug && console.log('C > DatamiCard > getFieldsByPosition > this.fieldMapping :', this.fieldMapping)
      // debug && console.log('C > DatamiCard > getFieldsByPosition > this.cardsSettingsEntriesMini :', this.cardsSettingsEntriesMini)
      // debug && console.log('C > DatamiCard > getFieldsByPosition > this.cardsSettingsEntriesDetail :', this.cardsSettingsEntriesDetail)
      // debug && console.log('C > DatamiCard > getFieldsByPosition > this.fieldMapping :', this.fieldMapping)
      const fields = []
      let cardsSettings = this.isMini ? this.cardsSettingsEntriesMini : this.cardsSettingsEntriesDetail
      cardsSettings = Object.entries(cardsSettings)
        .map(entry => { return { name: entry[0], ...entry[1] } })
        .filter(f => {
          if (this.fromMap && this.isMini && f.hide_on_mini_map) return false
          if (isRight) {
            return f.position === position && f.right
          } else {
            return f.position === position && (!f.right || typeof f.right === 'undefined')
          }
        })
      // debug && console.log('C > DatamiCard > getFieldsByPosition > cardsSettings :', cardsSettings)
      cardsSettings.forEach(f => {
        const field = this.fieldMapping.find(fm => fm.name === f.name)
        if (field) { fields.push(field) }
      })
      // debug && console.log('C > DatamiCard > getFieldsByPosition > fields :', fields)
      return fields
    },
    hasContentByPosition (position, isRight = false) {
      const fields = this.getFieldsByPosition(position, isRight)
      return fields && fields.length > 0
    },
    hasAnyContentByPosition (positions, isRight = false) {
      const boolArray = []
      positions.forEach(p => {
        boolArray.push(this.hasContentByPosition(p, isRight))
      })
      return boolArray.some(b => b)
    },
    // closeCard () {
    //   this.$emit('toggleDetail', this.item.id)
    // },
    toggleDetail (event) {
      if (event === 'showDetailButton' || this.currentEditViewMode !== 'edit') {
        // console.log('\nC > DatamiCard > toggleDetail > event :', event)
        // console.log('C > DatamiCard > toggleDetail > this.currentEditViewMode :', this.currentEditViewMode)
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
      }
    }
    // emitUpdate (event) {
    //   this.$emit('updateCellValue', event)
    // },
    // SendActionToParent (event) {
    //   this.$emit('action', event)
    // }
  }
}

</script>
