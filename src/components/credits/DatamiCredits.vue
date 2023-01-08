<template>
  <div
    class="DatamiCredits datami-component columns is-centered is-multiline py-3 mt-4"
    style="z-index: 0;">
    <!-- CREDITS -->
    <div
      :class="`column is-full is-italic has-text-centered`">
      <p class="has-text-grey is-size-7 mb-2">
        <span :class=" ` ${isDarkMode ? 'datami-darkmode-white-text' : '' } ` ">
          {{ t('credits.reclaim', locale) }}
        </span>
        <span :class=" ` ${isDarkMode ? 'datami-darkmode-white-text' : '' } ` ">
          {{ t('credits.byLove', locale) }}
        </span>
        <span :class=" `ml-0 ${isDarkMode ? 'datami-darkmode-white-text' : '' }` ">
          {{ t('credits.byCooperative', locale) }}
        </span>
        <span
          class="has-text-weight-bold">
          <a
            class="link-multi outlink"
            :href="urlMulti"
            target="_blank"
            @click="trackLink(urlMulti)">
            multi
            <!--
            <img
              :src="require('@/assets/multi-logo-01.png')"
              class="mini-logo"
              alt="The multi Logo"> -->
            <!-- <img
              :src="`${process.env.BASE_URL}images/logo_DATAMI.png`"
              alt="logo datami"
              style="height: 75px !important; width: auto !important"> -->
          </a>
        </span>
      </p>
      <p>
        <!-- <b-button
          icon-left="gitlab"
          tag="a"
          :href="urlSourceCode"
          outlined
          target="_blank"
          size="is-small"
          :type="isDarkMode ? 'is-white' : 'is-dark'"
          class="ml-3 is-size-7 outlink"
          @click="trackLink(urlSourceCode)">
          {{ t('credits.code', locale) }}
        </b-button> -->
        <a
          :href="urlDatamiWebiste"
          target="_blank"
          @mouseover="hoverLogo = true"
          @mouseleave="hoverLogo = false"
          @click="trackLink(urlDatamiWebiste)">
          <img
            :src="`${''}/${hoverLogo ? 'logo_DATAMI_title' : 'logo-DATAMI'}.png`"
            alt="logo datami"
            :style="`height: 20px !important; width: auto !important; ${!hoverLogo ? 'filter: grayscale(1)' : ''}`">
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixinGlobal } from '@/utils/mixins.js'

export default {
  name: 'DatamiCredits',
  mixins: [mixinGlobal],
  props: {
    fileId: {
      default: null,
      type: String
    },
    locale: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      hoverLogo: false
    }
  },
  computed: {
    ...mapState({
      urlMulti: (state) => state.urlMulti,
      urlDatamiWebiste: (state) => state.urlDatamiWebiste,
      urlSourceCode: (state) => state.urlSourceCode
    })
  }
}
</script>
