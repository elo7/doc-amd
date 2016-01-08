# Doc-amd

_Doc-amd library_

doc.js is a small library to manipulate the DOM in any browser. We focused on the most used and common use cases to create this. This library uses [amd](http://en.wikipedia.org/wiki/Asynchronous_module_definition) structure.

[![Build Status](https://travis-ci.org/elo7/doc-amd.svg?branch=master)](https://travis-ci.org/elo7/doc-amd)

#### Why?

We needed a small footprint alternative for jquery and still have the ease-of-use for the most commonly used methods on it.

Then, we built it from scratch.

## Installation

Install with [Bower](http://bower.io): `bower install doc-amd`

## Dependencies

Doc-amd depends on an [amd](http://en.wikipedia.org/wiki/Asynchronous_module_definition) implementation. We suggest [async-define](https://gist.github.com/sergiolopes/5778124) implementation for dependency lookup.
Doc-amd also depends on [events-amd](https://github.com/elo7/event-amd).

## Methods

#### doc
`doc(querySelector)`

###### Description:
Returns a Doc object with all the methods below.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('.link')
	doc('#link')
	doc('a')
	doc('li > a')
});
```

#### els
`.els()`

###### Description:
Returns an array with matched Elements.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('a').els
	doc('li .links').els[1]
});
```

#### size
`.size()`

###### Description:
Returns the length of elements.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('a').size()
});
```

#### each
###### Usage:
`.each(callback)`

###### Description:
Iterate through a Doc object, executing a Function on each one of them.

###### Parameters:
> callback: Function() //A function to call.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('a').each(function(el){
		console.log(el) //DOM Element
	});
});
```

#### data
`.data(key [,value])`

###### Description:
Get or set the value of a data-* attribute

###### Parameters:
> key: String //A string naming the piece of data to set or get.

> value: String //The new data value.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('a.link').data('bar'); //Get the value of the attribute data-bar
	doc('a.link').data('foo','test'); //Set the value of the attribute data-foo
});
```

#### val
`.val([value])`

###### Description:
Get or set the value of the element

###### Parameters:
> value: String //The new value.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('input[name=email]').val(); //Get the value of the element
	doc('input[name=email]').val('test@email.com'); //Set the value of the element
});
```

#### html
`.html([value])`

###### Description:
Get or set the value of the inner html

###### Parameters:
> value: String //The new value.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('div.content').html(); //Get the inner html of the element
	doc('section').html('<p>Lorem ipsum sit amet in dollor, consecteur</p>'); //Set the inner html of the element
});
```

#### append
`.append(element)`

###### Description:
Append the DOM element as child of the Doc object

###### Parameters:
> element: Element //The element you want to append as a child of your selector.

###### Sample:
``` js
define(['doc'], function(doc) {
	var div = document.createElement('div')
	$('body').append(div) //Append the new DOM element as child of the Doc object
	$('body').append($('div.content').first()) //Append the exist DOM element as child of the Doc object
});
```

#### text
`.text(value)`

###### Description:
Set the inner text of the element

###### Parameters:
> value: String //New value for the text of the element.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('.content').text('Lorem ipsum') //Set the inner text of the element
});
```

#### attr
`.attr(key [,value])`

###### Description:
Get or set the value of the attribute

###### Parameters
> key: String //A string naming the attribute to set or get.

> value: String //The new value of the attribute.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('input[name=email]').attr('disabled'); //Get the value of attribute
	doc('input[name=email]').attr('type','password'); //Set the value of attribute
});
```

#### hasClass
`.hasClass(class)`

###### Description:
Verify if the Doc object has the CSS class

###### Parameters:
> class: String //The CSS class of the element. Return boolean.

###### Sample:
``` html
<div class='container'>Lorem</div>
```

``` js
define(['doc'], function(doc) {
	doc('div').hasClass('container'); //Returns true
	doc('div').hasClass('content'); //Returns false
});
```

#### addClass
`.addClass(class)`

###### Description:
Adds a CSS class to the element.

###### Parameters:
> class: String //The CSS class of the element.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('div').addClass('content'); //Adds .content class to all divs
});
```

#### removeClass
`.removeClass(class)`

###### Description:
Removes the CSS class from the element.

###### Parameters:
> class: String //The CSS class of the element.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('div').removeClass('content'); //Removes .content class from all divs
});
```

#### toggleClass
`.toggleClass(class)`

###### Description:
Adds or removes the CSS class from the element.

###### Parameters:
> class: String //The CSS class you want to add or remove.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('div').toggleClass('content'); //Adds or remove .content class from all divs
});
```

#### removeItem
`.removeItem()`

###### Description:
Remove the element from the DOM.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('#box').removeItem(); //Remove the element from the DOM.
});
```

### find
`.find(querySelector)`

###### Description:
Get the descendants of the Doc object, filtered by querySelector.

###### Parameters:
> querySelector: String //Returns the query's matched elements.

###### Sample:
``` html
<form>
	<fieldset>
			<input name='name' />
			<input name='email' />
	</fieldset>
</form>
```

``` js
define(['doc'], function(doc) {
	doc('form').find('input[name=email]'); //Returns the Doc object input
	doc('form').find('input'); //Returns the Doc object (containing all input elements)
});
```

### closest
`.closest(querySelector)`

###### Description:
Get the first ascendant of the Doc object, filtered by querySelector.

###### Parameters:
> querySelector: String //Should not be a composite. e.g. "#id .class" or "tag.class" due to compatibility issues. Prefer simple selectors. e.g. '.class'. Returns the query's matched elements.

###### Sample:
``` html
<form>
	<fieldset>
			<input name='name' />
			<input name='email' />
	</fieldset>
</form>
```

``` js
define(['doc'], function(doc) {
	doc('input').closest('form'); //Returns the Doc object form.
});
```

#### filter
`.filter(attribute || callback)`

###### Description:
There are two use cases for this method.
If you use an attribute, it will return a Doc object containing all elements containing the attribute.
If you use callback, _filter()_ will test each element in the set against your callback and return boolean for each. The result will be a Doc object matching your Function.

###### Parameters:
> attribute: String //A string containing an attribute to match the current set of elements against.

> callback: Function() //A function used as a test for each element in the set. This is the current DOM element.

###### Sample:
<form>
	<fieldset>
			<input name='name' required />
			<input name='email' class='required' />
	</fieldset>
</form>

``` js
define(['doc'], function(doc) {
	var requiredInputs = doc('form input').filter('required'); //Returns all inputs with required attribute
	var requiredClassInputs = doc('form input').filter(function(element){
		return element.hasClass('required');
	}); //Returns all inputs with required class
});
```

#### first
`.first()`

###### Description:
Returns the first DOM element from the query list.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('div').first(); //Returns the first DOM element from the query list
});
```

#### last
`.last()`

###### Description:
Returns the last DOM element from the query list.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('div').last(); //Returns the last DOM element from the query list
});
```

#### previous
`.previous()`

###### Description:
Returns the query's previous Doc object.

###### Sample:
``` html
<form>
	<fieldset>
			<input name='name' />
			<input name='email' />
	</fieldset>
</form>
```

``` js
define(['doc'], function(doc) {
	doc('input[name=email]').previous() //Returns the previous Doc object === input[name=name]
	doc('input[name=name]').previous() //Returns the previous Doc object === undefined
});
```

#### next
`.next()`

###### Description:
Returns the query's next Doc object.

###### Sample:
``` html
<form>
	<fieldset>
			<input name='name' />
			<input name='email' />
	</fieldset>
</form>
```

``` js
define(['doc'], function(doc) {
	doc('input[name=name]').next() //Returns the next Doc object === input[name=email]
	doc('input[name=email]').next() //Returns the next Doc object === undefined
});
```

#### parent
`.parent()`

###### Description:
Returns the query's parent element.

###### Sample:
``` html
<form>
	<fieldset>
			<input name='email' />
	</fieldset>
</form>
```

``` js
define(['doc'], function(doc) {
	doc('input[name=email]').parent(); //Returns the Doc object fieldset
	doc('input[name=email]').parent().parent(); //Returns the Doc object form
});
```

#### isEmpty
`.isEmpty()`

###### Description:
Verifies if the element exists on the DOM. Returns boolean.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('artile#content').isEmpty(); //Return true/false if the element exist
});
```

#### on
`.on(event, callback [,eventCategory])`

###### Description:
Adds an event listener on a Doc object.

###### Parameters:
> event: String //The event you want to attach to your selector

> callback: Function() //A function to call when the _event_ is triggered

> eventCategory: String //You can add multiple '_events_' of the same type (e.g: _click_) and use the _eventCategory_ parameter to remove certain events when needed. Use _.off()_ to remove the attached handler.

Please note that this method does not work like jquery's .on(). If you append new elements in the page you will have to call .on again on those elements.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('button').on('click', function(){ ... }); //Adds an event listener for the 'click' event
	doc('button').on('click', function() { ... }, 'tracker'); //Adds a 'click' event listener with the 'tracker' eventCategory
});
```

#### throttle
`.throttle(event, callback [,timeout] [,eventCategory])`

###### Description:
Prevents a function from being called multiple times on a set amount of time. Useful to prevent multiple requests.

###### Parameters
> event: String //The event you want to

> callback: Function() //The function to be called

> timeout: Number //The time in ms you want the application to prevent multiple calls from being made. Default value is 1000.

> eventCategory: You can add multiple '_events_' of the same type (e.g: _click_) and use the _eventCategory_ parameter to prevent one event from being called.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('button').throttle('click', function(){ ... }); //Adds an event listener for the 'click' event.
	doc('button').throttle('click', function(){ ... }, 5000); //Adds an event listener for the 'click' event, preventing other 'click' events to fire within 5 seconds
	doc('button').throttle('click', function(){ ... }, 1000, 'tracker'); //Adds an event listener for the 'click' event with 'tracker' category, aditional clicks will be ignored for 1 second.
});
```

#### off
`.off(event [,eventCategory])`

###### Description:
Removes the event listener from the Doc object.

###### Parameters:
> event: String //The event you want to remove from your selector

> eventCategory: String //Removes the attached handler of this category. See _.on()_ for details.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('button').off('click'); //Removes the event listener
	doc('button').off('click', 'tracker'); //Removes the event listener with the 'tracker' eventCategory
});
```

#### trigger
`.trigger(event [, data])`

###### Description:
Dispatches an event that can be listened using `on()`.

###### Parameters:
> event: String //The event you want to remove from your selector
> data: Additional data for custom triggered events

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('button').trigger('click'); //Triggers the event click for button.
});
```

``` js
define(['doc'], function(doc) {
	doc('button').on('customEvent', function(e) {
		console.log(e.detail.additionalData);
	});
	doc('button').trigger('customEvent', { additionalData: "data"}); //Triggers the event click for button.
});
```

#### selectedText
`.selectedText()`

###### Description:
Returns the selected text on a given input field.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('input[name=name]').selectedText() //Returns the selected text of the element.
});
```

#### focus
`.focus()`

###### Description:
Focus the first matched element

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('input[name=name]').focus() //Focus the first input named "name"
});
```

#### removeAttr
`.removeAttr(attrName)`

###### Description:
Removes the attribute from the element.

###### Parameters:
> attrName: String //The name of the element's attribute.

###### Sample:
``` js
define(['doc'], function(doc) {
	doc('div').removeAttr('style'); //Removes style attribute from all divs
});
```

## License

Doc-amd is released under the [BSD](https://github.com/elo7/doc-amd/blob/master/LICENSE). Have at it.

* * *

Copyright :copyright: 2015 Elo7# doc-amd
