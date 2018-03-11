<template>
  <div class="inner">
    <div class="option-zone flex-row">
      <draggable v-if="sourceElements.length > 0" class="options source-elements" element="ol" v-model="sourceElements" @start="startDrag" @end="endDrag" :move="moveItem" :options="{group:{name: 'targets',draggable:'.draggable',pull: 'clone', put: false}}">
        <transition-group type="transition" :name="'flip-list'">
        <li v-for="(option,index) in sourceElements" :id="option.key" :key="option.key" class="draggable" :class="{'in-place': option.selected}">
            {{option.text}}  
        </li>
        </transition-group>
      </draggable>
      <ol v-if="targetElements.length > 0" class="options target-elements">
        <li v-for="(option,index) in targetElements" :class="'option-'+index" @click="reset(option)">
          <div v-if="option.hasMatchedId" class="tooltip">
            {{removeTip}}
          </div>
          <draggable :id="option.key" :options="{group:'targets'}" class="target" @start="drag=true" @end="drag=false" @add="newItem"> 
            {{option.matchedLabel}}
            </draggable>

          <div class="target-label">
            {{option.text}}
          </div>
        </li>
      </ol>
    </div>
    <button v-on:click.prevent="send()" class="submit">OK</button>
  </div>
</template>
<script>

import draggable from 'vuedraggable'

export default {
  name: 'matchingPairs',
  components: {
    draggable
  },
  props: [
    'question'
  ],
  data () {
    return {
      sourceElements: [],
      targetElements: [],
      removeTip: 'Tap to put this item back'
    }
  },
  created () {
    this.refresh()
    this.$bus.$on('change-question', () => {
      this.refresh()
    })
  },
  methods: {
    send () {
      let data = {
        options: this.targetElements
      }
      let numMatched = this.targetElements.filter(el => el.hasMatchedId)
      let valid = numMatched == this.targetElements.length
      if (valid) {
        this.$parent.mark(this.question, data)
      }
    },
    startDrag (data) {
      data.item.classList.add('dragging')
    },
    endDrag (data) {
      data.item.classList.remove('dragging')
    },
    newItem (data) {
       var scEl = document.getElementById(data.item.id);
       var tgId = data.to.id
       var tgEl = document.getElementById(tgId);
       if (tgEl) {
        var tgIndex = this.targetElements.findIndex(item => item.key == tgId)
        if (tgIndex >= 0 && tgIndex < this.targetElements.length) {
          var tgItem = this.targetElements[tgIndex]
          var scItem = this.sourceElements.find(item => item.key == data.item.id)
          if (scItem) {
            data.item.classList.add('in-place')
            if (tgItem.matchedId.length > 2) {
              this.reset(tgItem)
            }
            tgItem.matchedId = data.item.id
            tgItem.hasMatchedId = true
            tgItem.matchedLabel = scItem.text
            this.targetElements[tgIndex] = tgItem
            tgEl.innerHTML = scItem.text

          }
        }
       }
    },
    moveItem (data) {
      if (data.to) {
        var overEl = data.to.parentNode.parentNode.querySelector('.over');
        if (overEl) {
          overEl.classList.remove('over')
        }
        data.to.classList.add('over')
      }
    },
    reset (option) {
      var tgEl = document.getElementById(option.key)
      var scEl = document.getElementById(option.matchedId);
      if (scEl) {
        scEl.classList.remove('in-place')
        option.hasMatchedId = false
        option.matchedId = ""
        option.matchedLabel = ""
        tgEl.innerHTML = ""
      }
    },
    refresh () {
      if (this.question.mode == 'matching_pairs') {
        this.layout()
        if (this.question.result) {
          this.assignMarked()
        }
      }
    },
    layout () {
      this.sourceElements = this.question.options.filter(opt => !opt.isMatch).map(item => {
        item.key = item._id
        item.selected = false
        return item
      })
      this.targetElements = this.question.options.filter(opt => opt.isMatch).map(item => {
        item.hasMatchedId = false
        item.matchedId = ''
        item.matchedLabel = ''
        item.key = item._id
        return item
      })
    },
    assignMarked () {
      if (this.question.result.options instanceof Array) {
        let i = 0, op0, op1, op2;
        for (; i < this.question.result.options.length; i++) {
          op0 = this.question.result.options[i]
          op1 = this.sourceElements.find(el => el._id.toString() == op0.matchedId)
          if (op1) {
            op1.selected = true  
          }
          op2 = this.targetElements.find(el => el._id.toString() == op0._id)
          if (op2) {
            op2.matchedId = op0.matchedId;
            op2.matchedLabel = op0.matchedLabel;
          }
        }
      }
    }
  }
}
</script>
