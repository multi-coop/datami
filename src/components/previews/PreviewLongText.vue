<template>
  <div class="PreviewLongText">
    <!-- DEBUGGING -->
    <div
      v-if="true"
      class="content">
      field.name : <code>{{ field.name }}</code><br>
      <!-- field : <code>{{ field }}</code><br> -->
      fieldId : <code>{{ fieldId }}</code><br>
      <!-- field.maxLength : <code>{{ field.maxLength }}</code><br> -->
      nowrap : <code>{{ nowrap }}</code><br>
      maxLength : <code>{{ maxLength }}</code><br>
      maxTextLength : <code>{{ maxTextLength }}</code><br>
      longtextOptions : <br><code>{{ longtextOptions }}</code><br>
      paragraphs : <br><code>{{ paragraphs }}</code>
    </div>

    <!-- TEXT CONTENT AS PARAGRAPHS W/ ou /WO BULLETS-->
    <p
      v-for="(paragraph, i) in paragraphs"
      :key="`longtext-${fileId}-${fieldId}-${i}-paragraph`"
      class="">
      <span v-if="!paragraph.hasBullets">
        {{ paragraph.content }}
      </span>
      <ul v-else>
        <li
          v-for="(p, i) in paragraph.content.split(bulletSeparator).filter(item => item !== '')"
          :key="`longtext-${fileId}-${fieldId}-${i}-paragraph-li-${i}`">
          {{ p }}
        </li>
      </ul>
    </p>
  </div>
</template>

<script>

export default {
  name: 'PreviewLongText',
  props: {
    fileId: {
      default: '',
      type: String
    },
    fromTable: {
      default: false,
      type: Boolean
    },
    fieldId: {
      default: '',
      type: String
    },
    field: {
      default: undefined,
      type: Object
    },
    rawText: {
      default: '',
      type: String
    },
    longtextOptions: {
      default: undefined,
      type: Object
    },
    maxTextLength: {
      default: 30,
      type: Number
    },
    nowrap: {
      default: false,
      type: Boolean
    },
    locale: {
      default: null,
      type: String
    },
    debug: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    paragraphSeparator () {
      return this.longtextOptions && this.longtextOptions.breakSeparator
    },
    bulletSeparator () {
      return this.longtextOptions && this.longtextOptions.bulletSeparator
    },
    maxLength () {
      return this.fromTable ? 50 : this.maxTextLength
    },
    paragraphs () {
      let paragraphs = []

      // all paragraphs
      if (this.paragraphSeparator) {
        this.rawText
          .split(this.paragraphSeparator)
          .forEach(txt => {
            const stepObj = {
              content: txt
            }
            if (this.bulletSeparator) {
              stepObj.hasBullets = txt.includes(this.bulletSeparator)
            }
            paragraphs.push(stepObj)
          })
      } else {
        paragraphs = [{ content: this.rawText }]
      }

      // wrap or no wrap
      if (this.nowrap) {
        const textToTrim = paragraphs[0].content
        const exceed = textToTrim.length > this.maxLength
        const trimmed = exceed ? `${textToTrim.slice(0, this.maxLength)} [...]` : textToTrim
        paragraphs = [
          { content: trimmed }
        ]
      }

      return paragraphs
    }
  }
}
</script>
