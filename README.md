# mwtfront

> Multi Web Test Frontend

This is a Vue JS frontend application for the MultiWebTest backend. I presented questions of various types and submits answers to the backend. The current sub-alpha build only supports:

* Multiple Choice
* Multiple Answer
* Boolean
* Option sort
* Matching Pairs
* Freetext match

It will eventually support

* Freetext review
* Gap fill (3 variants)
* Offset match (for matching items on a timeline)
* Coordinate match (for identify an item on an image)
* Value assign, where users assign arbitrary values to options

Other missing features, implemented only at the backend

* Timing
* Media objects (images, audio, video)
* Scales, i.e. assigning multiple evaluation criteria to options in a survey question

## Important notes

This component will only work with [MWT API](https://github.com/neilg63/mwtfront) and will be complemented by a separated admin area. The frontend is conceived a Single Page Application, while the admin area will contain much additional functionality not required in the frontend.

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
