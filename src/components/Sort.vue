<template>
  <div class="inner">
    <draggable v-if="question.options.length > 0" :options="{draggable:'.draggable',clone: false}" element="ol" @start="startDrag" @end="endDrag" class="options sortable">
      <li v-for="(option,index) in question.options" :key="option._id" :id="option._id" class="draggable" :class="'option-'+index">{{option.text}}</li>
    </draggable>
    <button v-on:click.prevent="send()" class="submit">OK</button>
  </div>
</template>
<script>

import draggable from 'vuedraggable'

export default {
  name: 'sort',
  props: [
    'question'
  ],
  data () {
    return {
      sortedIds: []
    }
  },
  components: {
    draggable
  },
  created () {
    this.refresh()
    this.$bus.$on('change-question', () => {
      if (this.question.mode == 'sort') {
        this.refresh()
      }
    })
  },
  methods: {
    send () {
      let data = {
        options: this.sortedIds
      };
      let valid = this.sortedIds.length == this.question.options.length;
      if (valid) {
        this.$parent.mark(this.question, data)
      }
    },
    startDrag (data) {
      data.item.classList.add('dragging')
    },
    endDrag (data) {
      data.item.classList.remove('dragging')
      let els = document.querySelectorAll('.sort .inner .options > li');
      this.sortedIds = [];
      for (let i = 0; i < els.length; i++) {
        this.sortedIds.push(els[i].getAttribute('id'))
      }
    },
    refresh () {
      this.sortedIds = this.question.options.map(opt => opt._id.toString())
      if (this.question.result) {
        if (this.question.result.options instanceof Array) {
          this.sortedIds = this.question.result.options.map(opt => opt._id.toString())
          let i = 0, opts = [], opt
          for (; i < this.sortedIds.length; i++) {
            opt = this.question.options.find(o => o._id.toString() == this.sortedIds[i])
            if (opt) {
              opts.push(opt)
            }
          }
          if (opts.length = this.question.options.length) {
            this.question.options = opts
          }
        }
      }
    }
  }
}
</script>
