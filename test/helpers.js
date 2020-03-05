// http://stackoverflow.com/a/2490876
window.fireEvent = function(element, eventName) {
	'use strict';

	// The custom event that will be created
	var event;

	if (document.createEvent) {
		event = document.createEvent('HTMLEvents');
		event.initEvent(eventName, true, true);
	} else {
		event = document.createEventObject();
		event.eventType = eventName;
	}

	event.eventName = eventName;

	if (document.createEvent) {
		element.dispatchEvent(event);
	} else {
		element.fireEvent('on' + event.eventType, event);
	}
};

// http://jsfiddle.net/epinapala/WdeTM/4/
window.selectText = function(element) {
	'use strict';

	var range, selection;
	var text = document.getElementById(element);

	if (document.body.createTextRange) {
		// ms
		range = document.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	} else if (window.getSelection) {
		// moz, opera, webkit
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};

// http://stackoverflow.com/a/14853974
window.arrayEquals = function(a, b) {
	'use strict';

	// if the other array is a falsy value, return
	if (!b) {
		return false;
	}

	// compare lengths - can save a lot of time
	if (a.length !== b.length) {
		return false;
	}

	for (var i = 0, l = a.length; i < l; i++) {
		// Check if we have nested arrays
		if (a[i] instanceof Array && b[i] instanceof Array) {
			// recurse into the nested arrays
			if (!a[i].equals(b[i])) {
				return false;
			}
		} else if (a[i] !== b[i]) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}

	return true;
};
