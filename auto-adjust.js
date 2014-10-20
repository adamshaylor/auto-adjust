(function () {


	'use strict';


	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	if (!String.prototype.trim) {
		(function(){  
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function () {
				return this.replace(rtrim, '');
			};
		})();
	}


	angular.module('autoAdjust', [])
		.constant('changeEventName', 'input')
		.constant('numericTypeRegex', (/^(number|range)/))
		.constant('dateTypeRegex', (/^(date|month)/));


	angular.module('autoAdjust').directive('autoAdjust', ['$timeout', 'changeEventName', 'numericTypeRegex', 'dateTypeRegex', function ($timeout, changeEventName, numericTypeRegex, dateTypeRegex) {


		var autoAdjust = {};


		autoAdjust.link = function (scope, element, attributes) {


			// `min` and `max` only apply to numeric, date, datetime and datetime-local input types
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input

			if (attributes.type.match(numericTypeRegex) || attributes.type.match(dateTypeRegex)) {
				scope.$watch(makeAttributeGetter('min'), handleMinChange);
				scope.$watch(makeAttributeGetter('max'), handleMaxChange);				
			}

			// `maxlength` applies to several other input types - we'll be permissive about which ones

			else {
				scope.$watch(makeAttributeGetter('maxlength'), handleMaxlengthChange);				
			}


			function makeAttributeGetter (attributeName) {

				return function () {
					return attributes[attributeName];
				};

			}


			function handleMinChange (min) {

				var parsedValue = parseAsInputType(element.val()),
					parsedMin = parseAsInputType(min),
					parsedMax = parseAsInputType(attributes.max);

				if (!parsedValueIsExpectedType(parsedMin) || !minIsLessThanMax(parsedMin, parsedMax)) {
					return;
				}

				if (parsedValue < parsedMin) {
					
					if (angular.isDate(parsedMin)) {
						element.val(dateObjectToHtmlInputValue(parsedMin));
					}

					else {
						element.val(parsedMin);	
					}
					
				}

				// The spec is ambiguous about how browser should handle changes to the min and max values, e.g.:
				// https://developers.whatwg.org/states-of-the-type-attribute.html#range-state-(type=range)
				// This causes inconsistencies in implementation. If the browser proactively changes the value without
				// triggering any events (which Chrome 37.0.2062.124 does for min but not for max) we must defensively
				// assume that they always do so and trigger the event on the browsers' behalf

				$timeout(function () {
					element.triggerHandler(changeEventName);
				});

			}


			function handleMaxChange (max) {

				var parsedValue = parseAsInputType(element.val()),
					parsedMax = parseAsInputType(max),
					parsedMin = parseAsInputType(attributes.min);

				if (!parsedValueIsExpectedType(parsedMax) || !minIsLessThanMax(parsedMin, parsedMax)) {
					return;
				}

				if (parsedValue > parsedMax) {

					if (angular.isDate(parsedMax)) {
						element.val(dateObjectToHtmlInputValue(parsedMax));
					}

					else {
						element.val(parsedMax);
					}

				}

				// See note in handleMinChange()

				$timeout(function () {
					element.triggerHandler(changeEventName);
				});

			}


			function handleMaxlengthChange (maxlength) {

				var value = element.val(),
					parsedMaxlength = parseAsNumber(maxlength);

				if (isNaN(parsedMaxlength)) {
					return;
				}

				if (value.length > parsedMaxlength) {
					element.val(value.slice(0, maxlength));
				}

				// See note in handleMinChange()

				$timeout(function () {
					element.triggerHandler(changeEventName);
				});

			}


			function parseAsInputType (attributeValueString) {

				if (attributes.type.match(numericTypeRegex)) {
					return Number(attributeValueString);
				}

				else if (attributes.type.match(dateTypeRegex)) {
					return new Date(attributeValueString);
				}

				return null;

			}


			function parseAsNumber (attributeValueString) {

				if (attributeValueString.trim() === '') {
					return NaN;
				}

				else {
					return Number(attributeValueString);
				}

			}


			function minIsLessThanMax (parsedMin, parsedMax) {
				
				return parsedMin <= parsedMax ||
					!parsedValueIsExpectedType(parsedMin) ||
					!parsedValueIsExpectedType(parsedMax);

			}


			function parsedValueIsExpectedType (parsedValue) {

				if (attributes.type.match(numericTypeRegex)) {
					return angular.isNumber(parsedValue);
				}

				else if (attributes.type.match(dateTypeRegex)) {
					return angular.isDate(parsedValue);
				}

				else {
					return false;
				}

			}


			// http://stackoverflow.com/a/16808623
			
			function dateObjectToHtmlInputValue (dateObject) {

				return dateObject.toISOString().substring(0, 10);

			}


		};


		return autoAdjust;


	}]);


})();
