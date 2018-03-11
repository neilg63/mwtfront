<template>
<div class="inner">
    <ol v-if="question.options.length > 0" class="options">
      <li v-for="(option,index) in question.options" :key="option._id" :class="{'selected': option.selected}" @click="select(option,index)">
        <span class="selector"></span>
        <span class="text">{{option.text}}</span>
         <span class="mark"></span>
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
        }
      }
    }
  }
}
</script>
