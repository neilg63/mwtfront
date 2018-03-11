<template>
  <article :class="wrapperClasses">
    <div :class="promptClasses">
      <p class="question">{{question.text}}</p>
      <div class="score" :class="{'hidden': !isMarked}">
        <span class="number points">{{result.points}}</span>
        <span class="separator"></span>
        <span class="number total">{{result.maxPoints}}</span>
      </div>
    </div>
    <template v-if="optionComponent == 'MatchingPairs'">
      <matching-pairs :question="question"></matching-pairs>
    </template>
    <template v-if="optionComponent == 'Boolean'">
      <boolean :question="question"></boolean>
    </template>
    <template v-if="optionComponent == 'FreeText'">
      <free-text :question="question" :value="value"></free-text>
    </template>
    <template v-if="optionComponent == 'MultipleOption'">
      <multiple-option :question="question"></multiple-option>
    </template>
    <template v-if="optionComponent == 'Sort'">
      <sort :question="question"></sort>
    </template>
  </article>
</template>
<script>
import axios from 'axios'
import MultipleOption from './MultipleOption'
import Boolean from './Boolean'
import MatchingPairs from './MatchingPairs'
import FreeText from './FreeText'
import Sort from './Sort'

export default {
  name: 'question',
  components: {
    MultipleOption,
    Boolean,
    MatchingPairs,
    FreeText,
    Sort
  },
  props: [
    'question',
    'index'
  ],
  data () {
    return {
      optionComponent: 'MultipleOption',
      result: {
        valid: false,
        points: 0
      },
      isMarked: false,
      value: null,
      wrapperClasses: ['question'],
      promptClasses: ['prompt']
    }
  },
  created () {
    this.refresh()
    let comp = this
    this.$bus.$on('change-question', () => {
      comp.refresh()
    })
  },
  methods: {
    refresh () {
      this.wrapperClasses = ['question']
      if (this.question.mode) {
        let md = this.question.mode
        this.wrapperClasses.push(md.replace('_', '-'))
      }
      this.isMarked = false;
      if (this.question.result) {
        this.isMarked = this.question.result.hasOwnProperty('_id')
      }
      if (this.isMarked) {
        switch (this.question.mode) {
          case 'multiple_choice':
          case 'multiple_answer':
          case 'boolean':
            this.updateSelectedOptions()
            break
          case 'freetext_match':
            this.updateValue()
            break;
        }
        this.wrapperClasses.push('marked')
      }
      switch (this.question.mode) {
        case 'matching_pairs':
          this.optionComponent = 'MatchingPairs'
          break
        case 'freetext_match':
        case 'freetext_review':
          this.optionComponent = 'FreeText'
          break
        case 'sort':
          this.optionComponent = 'Sort'
          break
        case 'boolean':
          this.optionComponent = 'Boolean'
          break
        default:
          this.optionComponent = 'MultipleOption'
          break
      }
      let promptLength = this.question.text.length
      this.promptClasses = ['prompt']
      if (promptLength < 32) {
        this.promptClasses.push('xxlarge')
      } else if (promptLength < 48) {
        this.promptClasses.push('xlarge')
      } else if (promptLength < 72) {
        this.promptClasses.push('large')
      } else if (promptLength <  128) {
        this.promptClasses.push('medium')
      }
    },
    mark (question, data) {
      let params = data
      let comp = this
      params.questionId = question._id
      let markId = this.$ls.get('markId')
      if (markId) {
        params.markId = markId
      }
      axios.post('/api/mark',params)
      .then(response => {
        let result = response.data
        if (result.valid) {
          comp.result = result
          comp.isMarked = true
          comp.$parent.addResult(result)
          setTimeout(() => {
            comp.$parent.nextQuestion()
          },1000)
        }
      })
    },
    updateSelectedOptions () {
      this.result =  this.question.result;
      if (this.result.options) {
        let i = 0, j = 0, opt1, opt2;
        for (; i < this.result.options.length; i++) {
          opt1 = this.result.options[i]
          if (opt1._id) {
            for (j=0; j < this.question.options.length; j++) {
              opt2 = this.question.options[j]
              if (opt2._id) {
                if (opt1._id.toString() == opt2._id.toString()) {
                  opt2.selected = true
                }
              }
            }
          }
        }
      }
    },
    updateValue () {
      this.result =  this.question.result;
      if (this.result.value) {
        this.value = this.result.value
      }
    }
  }
}
</script>
