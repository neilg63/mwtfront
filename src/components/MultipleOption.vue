<template>
<div class="inner">
    <ol v-if="question.options.length > 0" class="options">
      <li v-for="(option,index) in question.options" :key="option._id" :class="{'selected': option.selected}" @click="select(option,index)">
        <span class="selector"></span>
        <span class="text">{{option.text}}</span>
        <div class="status" :class="option.statusClass">
          <span class="points">{{option.statusPoints}}</span>
        </div>
      </li>
    </ol>
    <template v-if="question.mode == 'multiple_answer'">
      <button v-on:click.prevent="send()" class="submit">OK</button>
    </template>
  </div>
</template>
<script>

export default {
  name: 'multipleOption',
  props: [
    'question'
  ],
  data () {
    return {
      selected: []
    }
  },
  created () {
    this.question.options = this.question.options.map(op => {
      op.statusPoints = 0
      op.statusClass = 'unmarked'
      return op
    })
    this.refresh()
    this.$bus.$on('change-question', () => {
      switch (this.question.mode) {
        case 'multiple_answer':
        case 'multiple_choice':
          this.refresh()
          break
      }
    })
  },
  methods: {
    select (option,index) {
      let add = false
      let multiple = this.question.mode == 'multiple_answer';
      if (this.selected.length > 0) {
        let matchedIndex = this.selected.findIndex(optId => optId.toString() == option._id.toString());
        if (matchedIndex >= 0) {
          this.selected.splice(matchedIndex,1);
        }
        if (!multiple) {
          for (let i = 0; i < this.question.options.length; i++) {
            this.question.options[i].selected = false;
          }
        }
      }
      if (multiple) {
        add = !option.selected
        if (!add) {
          option.selected = false
        }
      } else {
        add = true
      }
      if (add) {
        option.selected = true
        if (multiple) {
          this.selected.push(option._id)  
        } else {
          this.selected = [option._id]
        }
      }
      if (!multiple) {
        this.send()
      }
    },
    statusData (option) {
      let data = {status: "", points: 0}
      let op = this.question.result.options.find(o => o._id.toString() == option._id.toString())
      if (op) {
        if (!op.hasOwnProperty('points')) {
          switch (op.status) {
            case 'correct':
              op.points = 1
              break;
            default:
              op.points = 0
          }
        }
        return op
      }
      return data
    },
    send () {
      let params = {
        options: this.selected
      }
      let valid = this.selected.length > 0
      if (valid) {
        this.$parent.mark(this.question,params)  
      }
    },
    refresh () {
      if (this.question.result) {
        if (this.question.result.options instanceof Array) {
          this.selected = this.question.result.options.map(o => o._id)
          this.question.options = this.question.options.map(op => {
            let sd = this.statusData(op)
            op.statusPoints = sd.points
            op.statusClass = sd.status
            return op
          })
        }
      }
    }
  }
}
</script>
