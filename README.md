auto-adjust
===========

An angular directive that automatically adjusts input values based on dynamic values of its maxlength, max and min attributes

##Requirements

Angular 1.0+

## Installation

From your project directory (or wherever you want your bower components to live):

```shell
bower install --save auto-adjust
```

In your module, define `autoAdjust` as a dependency:

```javascript
angular.module('yourModule', ['autoAdjust']);
```

## Usage

The `ngAttr` directive saves you from putting Angular expressions in attributes that don’t technically support them.

In practice, I’ve found that you can get away without using it for most situations, but Angular does not enforce dynamic values for `min`, `max` or `maxlength` out of the box. The `autoAdjust` directive will automatically enforce these restrictions:

```html
<input type="text" ng-model="yourText" auto-adjust ng-attr-maxlength="{{yourTextMaxlength}}">

<input type="number" ng-model="yourNumber" auto-adjust ng-attr-min="{{yourNumberMin}}" ng-attr-max="{{yourNumberMax}}">

<!-- See note below about ranges -->
<input type="range" ng-model="yourRange" auto-adjust ng-attr-min="{{yourRangeMin}}" ng-attr-max="{{yourRangeMax}}" min="-10000" max="10000">

<input type="date" ng-model="yourDate" auto-adjust ng-attr-min="{{yourDateMin}}" ng-attr-max="{{yourDateMax}}">
```

In this example, if `yourText` has 20 characters and `yourTextMaxlength` changes to 10, the text will be truncated to fit the new limit.

It does not rely on `ngModel`, nor does it create an isolate scope. Instead, it alters the value of the element and triggers a change event. If you are using `ngModel`, Angular will handle the change event and the model will update as if the user had input the new value manually.

## Options

There are some constants you can override. These are the default values, but you can specify your own:

```javascript
angular.module('yourModule').constant('changeEventName', 'input');
angular.module('yourModule').constant('numericTypeRegex', (/^(number|range)/));
angular.module('yourModule').constant('dateTypeRegex', (/^(date|month)/));
```

## A Note About `range` Inputs

It’s common practice for browsers to supply [default values for `min` and `max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input) if no valid values are found at the time the DOM tree is built. Let’s say your initial value is defined like this:

```javascript
$scope.yourRangeMin = -10;
$scope.yourRangeMax = 10;
$scope.yourRange = -5;
```

and your HTML looks like this:

```html
<input type="range" ng-model="yourRange" auto-adjust min="{{yourRangeMin}}" max="{{yourRangeMax}}">
```

The browser is not going to see a valid value for min, so both the min attribute and the value of the element will be set to whatever the browser decides. No change event will be fired, so the model will remain set to -5, thus creating a disparity between your model and the controls.

The best solution I’ve found is to supply `min` and `max` attributes—*in addition to* `ng-attr-min` and `ng-attr-max`—that are the smallest and largest conceivable values you expect `yourRangeMin` and `yourRangeMax` could be.
