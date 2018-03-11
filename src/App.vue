<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    // needs login when user management in place
    this.$ls.set('user',{id:'5a9c143c358941711401eb38'});
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
}

article button.submit:before {
  position: relative;
  display: inline-block;
  font-family: 'icomoon';
  content: "\ea42";
  font-size: 3em;
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


.options > li .selector:before {
  font-family: "icomoon";
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

article .score {
  position: absolute;
  top: 0;
  right: 0;
  border: solid 0.25em #000066;
  border-radius: 50%;
  min-width: 2em;
  padding: 0.5em;
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

article .score .separator:before {
  content: "/";  
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
