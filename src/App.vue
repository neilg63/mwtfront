<template>
  <div id="app">
    <header class="account-bar">
      <form v-if="!loggedIn" class="user-form inner">
        <template v-if="form.mode == 'register'">
          <input v-model="user.name" class="name" type="text" placeholder="User name" />
        </template>
        <input v-model="user.email" class="textfield" type="email" placeholder="Your email" />
        <input v-model="user.password" class="password" type="password" placeholder="password" />
        <template v-if="form.mode == 'register'">
          <input v-model="user.cpassword" class="password" type="password" placeholder="confirm password" />
        </template>
        <input type="submit" :value="form.submitLabel"/>
        <a href="#register" @click.prevent="toggleForm()">{{form.toggleName}}</a>
      </form>
      <div v-if="loggedIn" class="user-details inner">
        Logged in as {{user.name}}
      </div>
    </header>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>

export default {
  name: 'App',
  data () {
    return {
      loggedIn: false,
      user: {
        id: '',
        email: '',
        name: '',
        password: ''
      },
      form: {
        mode: 'login',
        toggleName: 'Register',
        submitLabel: 'Sign in'
      }
    }
  },
  created () {
    // needs login when user management in place
    //this.$ls.set('user',{id:'5a9c143c358941711401eb38', name: 'Mark One',email: 'markone@gmail.com',password: '' });
    let user = this.$ls.get('user', null)
    if (user) {
      this.loggedIn = true
      this.user = user
    }
  },
  methods: {
    toggleForm () {
      if (this.form.mode == 'login') {
        this.form.mode = 'register'
        this.form.toggleName = 'Login'
        this.form.submitLabel = 'Register'
      } else {
        this.form.mode = 'login'
        this.form.toggleName = 'Register'
        this.form.submitLabel = 'Login'
      }
    }
  }
}
</script>

<style>

html {
  font-size: 12px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 1600px;
  padding: 0 2.5%;
  margin: 0 auto;
}

@media screen and (min-width: 640px) {
  html {
    font-size: 13.5px;
  }
}

@media screen and (min-width: 768px) {
  html {
    font-size: 15px;
  }
}

@media screen and (min-width: 960px) {
  html {
    font-size: 16px;
  }
}

@media screen and (min-width: 1080px) {
  html {
    font-size: 17px;
  }
}

@media screen and (min-width: 1200px) {
  html {
    font-size: 18px;
  }
}

@media screen and (min-width: 1320px) {
  html {
    font-size: 19px;
  }
}

@media screen and (min-width: 1440px) {
  html {
    font-size: 20px;
  }
}

header.account-bar {
  position: fixed;
  top: 0;
  width: 100%;
  left: 0;
}

ul.options,
ol.options {
  list-style: none;
  margin: 1em;
  width: 100%;
}

ol.options li {
  font-size: 1.5em;
  padding: 0.5em;
  margin: 1em auto;
  background-color: #ffff66;
  border: solid .125em #ffff66;
  border-radius: 0.5em;
  text-align: center;
  max-width: 16em;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.25s ease-in-out;
  text-align: left;
}

.sort ol.options li {
  text-align: center;
}

.marked ol.options li {
  filter: hue-rotate(320deg);
  transform: skew(-5deg);
}

article button.submit {
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
}

article button.submit:hover {
  transform: skew(-5deg);
  color: #009900;
}

button.submit:focus {
  outline: none;
}

article button.submit:before {
  position: relative;
  display: inline-block;
  font-family: 'icomoon';
  content: "\ea42";
  font-size: 5em;
  margin-right: .25em;
  top: 0.25em;
}

.options > li span {
  display: inline-block;
  position: relative;
}

.options > li span.selector {
  margin: 0 0.25em -0.625em 0;
  line-height: 1.5em;
  width: 1.5em;
  overflow: hidden;
}

.options > li .status {
  position: absolute;
  top: 0.25em;
  right: 0.5em;
}

.options > li .status,
.options > li .status .points {
  opacity: 0;
}

.options > li .status .points {
  font-size: 0.8em;
  display: inline-block;
  margin-right: 0.5em;
}

.options > li.selected .status,
.options > li.selected .status.correct .points {
  opacity: 1;
}

.options > li .selector:before,
.options > li .status:after {
  font-family: "icomoon";
}

.options > li .correct:after {
  content: "\ea10";
  color: #00cc00;
}

.options > li .incorrect:after {
  content: "\ea0f";
  color: #cc0000;
}


.options > li .selector:before {
  font-size: 1.5em;
}

.options > li.selected {
  border-color: #ff6600;
}

.multiple-choice .options > li .selector:before {
  content: "\ea56";
}

.multiple-choice .options > li.selected .selector:before {
  content: "\ea54";
}

.multiple-answer .options > li .selector:before {
  content: "\ea53";
}

.multiple-answer .options > li.selected .selector:before {
  content: "\ea52";
}

.boolean .options > li {
  font-size: 2.5em;
}

.hidden {
  display: none;
}

article.question {
  position: relative;
}

article.question .inner {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.switching article.question .inner {
  opacity: 0;
}

.boolean .options > li.true .selector:before {
  content: "\e905";
}

.boolean .options > li.false .selector:before {
  content: "\e904";
}

ol.options li:hover {
  filter: hue-rotate(90deg);
}

.boolean .options,
.flex-row {
  display: flex;
  flex-flow: row wrap;
  align-self: center;
  align-items: center;
}

.info-tabs .item {
  padding: 0 2em;
  margin: 0 auto;
}

.prompt {
  font-size: 1.25em;
}

.prompt.xxlarge {
  font-size: 2em;
}

.prompt.xlarge {
  font-size: 1.8333em;
}

.prompt.large {
  font-size: 1.667em;
}

.prompt.medium {
  font-size: 1.5em;
}

.question .inner {
  min-height: 50vh;
}

.freetext-match .inner input.textfield {
  font-size: 1.5em;
}

.matching-pairs ol.options {
  max-width: 40%;
  margin: 1em 2%;
}

.matching-pairs .target-elements li {
  display: flex;
  flex-flow: row nowrap;
}



.matching-pairs .target-elements li .target-label {
  text-align: center;
  margin-left: 5%;
  width: 8em;
}

article .prompt {
  position: relative;
}

.board {
  width: 100%;
}

.board > div {
  width: 30%;
  padding: 0 10%;
}

.board > div > span.item {
  font-size: 1.25em;
}

.board .score {
  text-align: left;
}

.board .progress {
  text-align: right;
}

article.question .score {
  position: absolute;
  top: 0;
  right: 0;
  border: solid 0.125em #000066;
  border-radius: 50%;
  min-width: 2em;
  padding: 0.5em;
  font-size: 1.5em;
}

.score > span {
  display: inline-block;
  position: relative;
}

article .score .points {
  top: -.25em;
}

article .score .total {
  top: 0.25em;
}

.score span.separator:before {
  content: "/";  
}

.progress span.separator:before {
  position: relative;
  display: inline-block;
  content: "...";
  font-weight: bold;
  font-size: 1.25em;
}

.score span.percent:after {
  content: "%";
}

article .score > .status {
  position: absolute;
  bottom: 0;
  left: -4em;
  width: 10em;
  text-align: left;
}

article .score > .status:before {
  font-family: 'icomoon';
  font-size: 2em;
}

article .score > .correct:before {
  content: "\ea10";
  color: #00cc00;
}

article .score > .partial:before {
  content: "?";
  color: #ee5500;
}

article .score > .incorrect:before {
  content: "\ea0f";
  color: #ff0000;
}

article .score > .status .text {
  display: inline-block;
  white-space: nowrap;
  font-size: 0.5em;
}

.question-nav {
  position: relative;
  min-height: 2em;
  width: 100%;
}

.question-nav .nav-item {
  position: absolute;
  top: 0;
  cursor: pointer;
  font-size: 2em;
}

.question-nav .prev {
  left: 0;
}

.question-nav .next {
  right: 0;
}

.matching-pairs ol.options li {
  padding: 0.5 2%;
  position: relative;
}

.matching-pairs ol.options li {
  max-width: 100%;
  opacity: 1;
  transition: opacity .5s ease-in-out;
}

.matching-pairs ol.source-elements li.in-place {
  opacity: 0.3333;
  pointer-events: none;
}

.matching-pairs ol.target-elements li .target {
  width: 90%;
  height: 1.5em;
  padding: 0.25em 5%;
  border: dashed 1px black;
  border-radius: 1em;
  overflow: hidden;
}

.matching-pairs ol.target-elements li .target li {
  margin: 0;
  font-size: 1em;
  background: none;
  padding: 0;
}

.matching-pairs ol.target-elements li:hover {
  filter: hue-rotate(0deg);
}

.matching-pairs ol.target-elements li .over {
  filter: hue-rotate(60deg);
}

ol.options li.dragging:hover,
ol.options li.dragging {
  opacity: 0.5;
  filter: hue-rotate(30deg);
}
</style>
