<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Tests and Surveys</h2>
    <ul v-if="assessments.length >0">
      <li v-for="(assessment,index) in assessments" :class="'assessment-' + index" :key="assessment._id">
        <h4><router-link :to="{
          name: 'assessment',
          params: {id: assessment._id}
        }">{{assessment.title}}</router-link>
        </h4>
        <p>
          <span class="category">{{assessment.category}}</span>
          <span class="num-questions">{{assessment.numQuestions}}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'welcome',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      assessments: []
    }
  },
  created () {
    let comp = this
    axios.get('/api/assessments')
      .then(response => {
        if (response.data) {
          if (response.data instanceof Array) {
            comp.assessments = response.data
          }
        }
      })
      .catch(error => console.log(error))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 1em 0;
}
a {
  color: #42b983;
}
</style>
