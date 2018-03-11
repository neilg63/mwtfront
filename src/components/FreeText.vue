<template>
  <div class="inner">
    <input v-model="answer" type="text" length="60" class="textfield" name="answer" />
    <button v-on:click.prevent="send()" class="submit">OK</button>
  </div>
</template>
<script>

export default {
  name: 'freeText',
  props: [
    'question',
    'value'
  ],
  data () {
    return {
      answer: ''
    }
  },
  created () {
    if (this.value) {
      this.answer = this.value
    }
  },
  methods: {
    send (option) {
      let data = {
        value: this.answer.trim()
      }
      let valid = data.value.length > 0
      if (valid) {
        this.$parent.mark(this.question, data)
      }
    },
  }
}
</script>
