<template>
  <div class="assessment" :class="wrapperClasses">
    <header class="info-tabs flex-row">
      <h4 class="item">{{assessment.category}}</h4>
      <h2 class="item">{{assessment.title}}</h2>
      <h5 class="item">{{currentSection.title}}</h5>
    </header>
    <div class="board flex-row">
      <div class="score total">
        <span class="points item">{{score.points}}</span>
        <span class="separator"></span>
        <span class="max">{{score.maxPoints}}</span>
        <span class="percent item parentheses">{{score.percent}}</span>
        
      </div>
      <div class="progress">
        <span class="question-num item">{{questionNumber}}</span>
        <span class="separator"></span>
        <span class="questions-total item">{{numQuestions}}</span>
      </div>
    </div>
    <question :question="currentQuestion" :index="questionIndex"></question>
    <nav class="question-nav">
      <div v-if="showPrev" v-on:click.prevent="prevQuestion()" class="nav-item prev">Previous</div>
      <div v-if="showNext" v-on:click.prevent="nextQuestion()" class="nav-item next">Next</div>
    </nav>
  </div>
</template>
<script>
import axios from 'axios'
import Question from './question'
import _ from 'lodash'

export default {
  name: 'assessment',
  components: {
    Question
  },
  data () {
    return {
      assessment: {
        _id: '',
        title: '',
        sections: [],
        numSections: 0,
        numQuestions: 0
      },
      currentSection: {
        title: '',
        questions: [],
        numQuestions: 0
      },
      currentQuestion: {
        _id: '',
        text: '',
        options: [],
        mode: ''
      },
      numSections: 0,
      numQuestions: 0,
      sectionIndex: 0,
      questionIndex: 0,
      score: {
        points: 0,
        maxPoints: 0,
        total: 0,
        percent: 0
      },
      wrapperClasses: []
    }
  },
  created () {
    let loaded = false, id = '', userId = ''
    if (this.$route) {
      id = this.$route.path.split('/').pop()
      let user = this.$ls.get('user')
      if (user.id) {
        userId = user.id  
      }
    }
    let assessment = this.$ls.get('assessment', null);
    if (assessment) {
      if (assessment._id) {
        loaded = assessment._id == id;
      }
    }
    if (!loaded) {
      this.fetchAssessment(id, userId)
    } else {
      this.mapAssessment(assessment)
    }
    this.score = this.getScore()
  },
  computed: {
    questionNumber () {
      let num = this.questionIndex + 1
      if (this.sectionIndex > 0) {
        for (let i = 0; i < this.sectionIndex; i++) {
          if (this.assessment.sections[i].questions) {
            num += this.assessment.sections[i].questions.length
          }
        }
      }
      return num
    },
    showNext () {
      return this.sectionIndex < (this.numSections-1) || this.questionIndex < (this.currentSection.questions.length - 1)
    },
    showPrev () {
      return this.sectionIndex > 0 || this.questionIndex > 0
    }
  },
  methods: {
    fetchAssessment (id, userId) {
      let comp = this
      axios.get('/api/assessment/' + id + '/' + userId)
      .then(response => {
        if (response.data) {
          if (response.data._id) {
            let data = response.data
            comp.$ls.set('assessment',data)
            comp.$ls.set('markId',data.markId)
            comp.mapAssessment(data)
          }
        }
      })
      .catch(error => console.log(error))
    },
    mapAssessment (data) {
      this.assessment = data
      this.numSections = data.sections.length
      this.numQuestions = data.numQuestions
      this.currentSection = 0
      this.setSection()
      this.setQuestion()
    },
    nextSection () {
      let lastIndex = this.numSections - 1
      if (this.sectionIndex < lastIndex) {
        this.sectionIndex++
        this.questionIndex = 0
        this.setSection()
        this.setQuestion()
      }
    },
    prevSection () {
      if (this.sectionIndex > 0) {
        this.sectionIndex--
        this.setSection()
        this.questionIndex = this.currentSection.questions.length - 1

        this.setQuestion()
      }
    },
    nextQuestion () {
      let lastIndex = this.currentSection.numQuestions - 1
      if (this.questionIndex < lastIndex) {
        this.questionIndex++
        this.setQuestion()
      } else {
        this.nextSection()
      }
    },
    prevQuestion () {
      if (this.questionIndex > 0) {
        this.questionIndex--
        this.setQuestion()
      } else {
        this.prevSection()
      }
    },
    setSection () {
      if (this.sectionIndex < this.numSections) {
        this.currentSection = this.assessment.sections[this.sectionIndex]
      }
    },
    setQuestion () {
      if (this.questionIndex < this.assessment.sections[this.sectionIndex].questions.length) {
        let comp = this
        this.wrapperClasses.push('switching')
        setTimeout(() => {
          comp._setQ()
        }, 200)
        setTimeout(() => {
          this.$bus.$emit('change-question', this.currentQuestion)
        }, 300)
        setTimeout(() => {
          comp.wrapperClasses = []
        },600)
      }
    },
    _setQ () {
      this.currentQuestion = this.assessment.sections[this.sectionIndex].questions[this.questionIndex]
      this.currentQuestion.result = this.getResults()
    },
    getStored () {
      let assessment = this.$ls.get('assessment', null)
      if (assessment) {
        if (assessment._id == this.assessment._id) {
          assessment.valid = true
          return assessment
        }
      } else {
        return {valid: false }
      }
    },
    addResult (result) {
      if (result.question) {
        let assessment = this.getStored()
        if (assessment.valid) {
          if (!assessment.results) {
            assessment.results = {};
          }
          assessment.results[result.question.toString()] = result
          this.$ls.set('assessment',assessment)
          let comp = this
          setTimeout(() => {
            comp.score = comp.getScore()
          }, 125)
        }
      }
    },
    getResults() {
      let assessment = this.getStored(), qid = '';
      if (this.currentQuestion) {
        qid = this.currentQuestion._id.toString()
      }
      if (assessment.valid && qid.length > 4) {
        if (assessment.results) {
          if (assessment.results.hasOwnProperty(qid)) {
            return assessment.results[qid]
          }
        }
      }
      return {valid: false} 
    },
    getScore() {
      let assessment = this.getStored(),
        score = {points: 0, maxPoints: 0, total: 0};
      if (assessment.valid) {
        if (assessment.results) {
          let keys = Object.keys(assessment.results), 
            numKeys = keys.length, i = 0, key, result;
          for (; i < numKeys; i++) {
            key = keys[i];
            result = assessment.results[key];
            if (!result.points) {
              result.points = 0;
            }
            score.total++;
            score.points += result.points;
            if (result.maxPoints) {
              score.maxPoints += result.maxPoints
            }
          }
        }
        this.applyPercent(score)
      }
      return score 
    },
    applyPercent (score) {
      let frac = 0
      if (score.points > 0 && score.maxPoints > 0) {
        frac = score.points / score.maxPoints
      }
      score.percent = Math.ceil(1000 * frac) / 10
    }
  }
}
</script>
