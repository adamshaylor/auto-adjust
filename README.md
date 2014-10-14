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

```html
<input type="text" ng-model="yourText" auto-adjust maxlength="{{yourTextMaxlength}}">
<input type="number" ng-model="yourNumber" auto-adjust min="{{yourNumberMin}}" max="{{yourNumberMax}}">
<input type="range" ng-model="yourRange" auto-adjust min="{{yourRangeMin}}" max="{{yourRangeMax}}">
<input type="date" ng-model="yourDate" auto-adjust min="{{yourDateMin}}" max="{{yourDateMax}}">
```

The `autoAdjust` directive will automatically enforce restrictions these restrictions. So, for example, if `yourText` has 20 characters and `yourTextMaxlength` changes to 10, the text will be truncated to fit the new limit.

It does not rely on `ngModel`, nor does it create an isolate scope. Instead, it alters the value of the element and triggers a change event. If you are using `ngModel`, it will handle the change event and the model will update as if the user had input the new value manually.

There are some constants you can override. These are the default values, but you can specify your own:

```javascript
angular.module('yourModule').constant('changeEventName', 'input');
angular.module('yourModule').constant('numericTypeRegex', (/^(number|range)/));
angular.module('yourModule').constant('dateTypeRegex', (/^(date|month)/));
```
