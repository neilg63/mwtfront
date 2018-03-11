<template>
<div class="inner">
    <ol v-if="question.options.length > 0" class="options">
      <li v-for="(option,index) in question.options" :key="option._id" :class="{'selected': option.selected,'true': isTrue(option),'false': !isTrue(option)}" @click="select(option,index)">
        <span class="selector"></span>
        <span class="text">{{option.text}}</span>
        <span class="mark"></span>
      </li>
    </ol>
  </div>
</template>
<script>

export default {
  name: 'boolean',
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
        case 'boolean':
          this.refresh()
          break
      }
    })
  },
  methods: {
    select (option,index) {
      if (this.selected.length > 0) {
        let matchedIndex = this.selected.findIndex(optId => optId.toString() == option._id.toString());
        if (matchedIndex >= 0) {
          this.selected.splice(matchedIndex,1);
        }
        for (let i = 0; i < this.question.options.length; i++) {
          this.question.options[i].selected = false;
        }
      }
      option.selected = true
      this.selected = [option._id]
      this.send()
    },
    isTrue (option) {
      if (option.valid === true || option.valid === false) {
        return option.valid;
      } else {
        return /^\s*(yes|true|correct)/.test(option.text.toString().toLowerCase());
      }
    },
    send () {
      let params = {
        options: this.selected
      }
      this.$parent.mark(this.question,params)
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
