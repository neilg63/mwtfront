<template>
  <article :class="wrapperClasses">
    <div :class="promptClasses">
      <p class="question">{{question.text}}</p>
    </div>
    <div class="score" :class="{'hidden': !isMarked}">
      <span class="number points">{{result.points}}</span>
      <span class="separator"></span>
      <span class="number total">{{result.maxPoints}}</span>
      <div class="status" :class="result.statusClass">
        <span class="text">{{result.status}}</span>
      </div>
    </div>
    <div class="feedback" v-if="hasFeedback">
      <p>{{feedback}}</p>
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
        points: 0,
        status: '',
        statusClass: ''
      },
      isMarked: false,
      value: null,
      feedback: "",
      hasFeedback: false,
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
        this.result =  this.question.result;
        this.result.status = '';
        this.result.statusClass = '';
        if (this.result.points === this.result.maxPoints) {
          this.result.status = 'correct';
          this.result.statusClass = 'correct';
        } else if (this.result.points > 0) {
          this.result.status = 'partly correct';
          this.result.statusClass = 'partial';
        } else {
          this.result.status = 'incorrect';
          this.result.statusClass = 'incorrect';
        }
        this.matchFeedback()
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
          comp.question.result = result
          comp.$bus.$emit('change-question',comp.currentQuestion);
        }
      })
    },
    updateSelectedOptions () {
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
      if (this.result.value) {
        this.value = this.result.value
      }
    },
    matchFeedback () {
      let i = 0, txt = "", op;
      this.hasFeedback = false
      this.feedback = ''
      for (; i < this.result.options.length; i++) {
        op = this.result.options[i];
        if (op.feedback) {
          if (typeof op.feedback.explanation == 'string') {
            let comp = this
            axios.get('/api/explanation/' + op.feedback.explanation)
              .then(response => {
                if (response.data) {
                  let data = response.data
                  if (data.text) {
                    comp.feedback = data.text;
                    if (comp.feedback.length > 1) {
                      comp.hasFeedback = true
                    }
                  }
                }
                
              });
          }
        }
      }
    }
  }
}
</script>
