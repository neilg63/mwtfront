# mwtfront

> Multi Web Test Frontend

This is a Vue JS frontend application for the MultiWebTest backend. It presents questions of various types and submits answers to the backend for evaluation. The current alpha build only supports:

* Multiple Choice
* Multiple Answer
* Boolean
* Option sort
* Matching Pairs
* Freetext match

It will eventually support

* Freetext review
* Gap fill (3 variants)
* Offset match (to match items on a timeline linked to audio or video)
* Coordinate match (to identify an item on an image, diagram or map)
* Value assignment, where users assign arbitrary values to options
* Scale assignment, where users assign multiple scale values to options

Other missing features, implemented only at the backend

* User management / login via social networks
* Surveys, i.e. with adapted UI and scoring, but the same underlying engine
* Timing
* Media objects (images, audio, video)
* Scales, i.e. assigning multiple evaluation criteria to options in a survey question

## Development notes

This component will only work with [MWT API](https://github.com/neilg63/mwtapi) and will be complemented by a separated admin area. The frontend is conceived a Single Page Application, while the admin area will contain much additional functionality not required in the frontend.

## Browser notes

This Web application is built for modern browsers, i.e. Chrome 50+, Firefox 47+, Edge 13+, Safari 10+ etc. Legacy browsers do not support either modern ES6 javascript or some newer CSS features such as flexbox. I assume once this app is complete, it will run on over 98% of installed browsers.

## Feature Notes

### Structure

The core component is the *assessment*, which may be either a test (quiz or exam) or a survey (i.e. subjective, but still evaluated). An assessment may contain one or more *sections* or *question sets*. In normal circumstances an assessment is a set of questions presented in one session, although timing rules may allow for pauses between sections. 

Sections may have different rules and evaluation criteria. In tests, one section may be information purposes e.g. name, age, email address etc. only and another an unmarked practice session before beginning the marked sections. However, many simple tests and surveys may only need one section.

### Feedback and Explanations

The data schema lets you add feedback with an explanation and option media at four levels:

* For the whole assessment depending on the final evaluation. 
* For each section, again based on the evalution of that section. However, such feedback may appear either after the related section or at the end of th assessment
* For each question, again depending on its result. You may have one feedback item for all outcomes or one for different evaluation criteria (e.g. correctness or custom scales applied to surveys). However, you may set such feedback to appear after submitting a question, after a section or at the end of the assessment
* For each option, i.e. feedback that applies to a specific user selection. This may appear after answering a question, at the end of section alongside question and section feedback or at the end of a completed assessment.

The feedback may vary in detail. The data schema lets you re-use explanations and media objects that may be applicable in different situations. E.g. simple feedback may be "well done" or "better luck next time", but you may prefer "excellent, you're expert" or "that was tricky" for more challenging questions. It's simply the message, video or audio clip you want to appear when a user reviews feedback on the assessment.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
