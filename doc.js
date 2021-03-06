define('doc', ['event'], function(event) {
	'use strict';

	var matcher = {
		isClass: function(selector) {
			return selector.match(/^\.[\w-]+$/);
		},
		isId: function(selector) {
			return selector.match(/^#[\w-]+$/);
		},
		isTag: function(selector) {
			return selector.match(/^\w+$/);
		},
		isTagWithClass: function(selector) {
			return selector.match(/(\w+\.\w+)+/);
		},
	};

	var isFunction = function(obj) {
		return !!(obj && obj.call && obj.apply);
	};

	var search = function(namespace, selector) {
		selector = selector.replace(/^\s+|\s+$/g, '');
		if (matcher.isTag(selector) && namespace.getElementsByTagName) {
			return convertHtmlCollectionToArray(namespace.getElementsByTagName(selector));
		} else if (matcher.isId(selector)) {
			selector = selector.replace('#', '');
			if (namespace.getElementById) {
				return namespace.getElementById(selector);
			}
			return document.getElementById(selector);
		} else if (matcher.isClass(selector) && namespace.getElementsByClassName) {
			selector = selector.replace('.', '');
			return convertHtmlCollectionToArray(namespace.getElementsByClassName(selector));
		}
		return convertHtmlCollectionToArray(namespace.querySelectorAll(selector));
	};

	var convertHtmlCollectionToArray = function(htmlCollection) {
		try {
			return Array.prototype.slice.call(htmlCollection);
		} catch (e) {
			var array = [];
			var length = htmlCollection.length;
			for (var i = 0; i < length; i++) {
				array.push(htmlCollection[i]);
			}
			return array;
		}
	};

	var triggerEvent = function(el, event, data) {
		var hasNotBeenPrevented, htmlEvents;
		if (!document.createEvent) {
			if (!data) {
				hasNotBeenPrevented = el.fireEvent('on' + event);
			} else {
				// IE8 Pollyfill for custom events
				htmlEvents = document.createEventObject();
				htmlEvents.detail = data;

				var registeredEvents = el._event[event];
				for (var namedEvents in registeredEvents) {
					for (var i = 0; i < registeredEvents[namedEvents].length; i++) {
						registeredEvents[namedEvents][i](htmlEvents);
					}
				}
			}
		} else {
			htmlEvents = document.createEvent('Event');
			htmlEvents.initEvent(event, false, true);
			htmlEvents.detail = data;
			hasNotBeenPrevented = el.dispatchEvent(htmlEvents);
		}
		if (hasNotBeenPrevented && isFunction(el[event])) {
			el[event]();
		}
	};

	var convertNodeListToArray = function(nodeList) {
		var length = nodeList.length;
		var list = [];
		for (var i = 0; i < length ; i++) {
			var element = nodeList[i];
			if (element.nodeType === Node.ELEMENT_NODE) {
				list.push(element);
			}
		}
		return list;
	};

	var query = function(elements) {
		var selectedElements = [];

		if (elements) {
			if (elements instanceof Array) {
				selectedElements = elements;
			} else if (elements instanceof HTMLCollection) {
				selectedElements = convertHtmlCollectionToArray(elements);
			} else if (elements instanceof NodeList) {
				selectedElements = convertNodeListToArray(elements);
			} else {
				selectedElements.push(elements);
			}
		}

		return {
			'els': selectedElements,
			'size': selectedElements.length,

			'each': function(command) {
				for (var i = 0; i < this.size; i++) {
					command(this.els[i], i);
				}

				return this;
			},

			'data': function(key, value) {
				if (value !== undefined) {
					return this.each(function(el) {
						el.setAttribute('data-' + key, value);
					});
				}
				if (this.first()) {
					return this.first().getAttribute('data-' + key);
				}
				return '';
			},

			'val': function(newValue) {
				if (newValue !== undefined) {
					return this.each(function(el) {
						el.value = newValue;
					});
				}
				if (this.first()) {
					return this.first().value;
				}
				return '';
			},

			'html': function(newValue) {
				if (newValue !== undefined) {
					return this.each(function(el) {
						el.innerHTML = newValue;
					});
				}
				if (this.first()) {
					return this.first().innerHTML;
				}
				return '';
			},

			'prepend': function(value) {
				return this.each(function(el) {
					if (typeof value === 'object') {
						if (value.els) {
							value.each(function(childElement) {
								el.insertAdjacentElement('afterbegin', childElement);
							});
							return;
						}
						el.insertAdjacentElement('afterbegin', value);

					} else {
						el.insertAdjacentHTML('afterbegin', value);
					}
				});
			},

			'append': function(value) {
				var appendElement;
				this.each(function(el) {
					appendElement = el.appendChild(value);
				});
				return query(appendElement);
			},

			'text': function(val) {
				var hasInnerText = (document.getElementsByTagName('body')[0].innerText !== undefined);

				var currentValue = '';
				this.each(function(el) {
					if (typeof val === 'undefined') {
						currentValue = el.textContent || el.innerText;
					} else if (!hasInnerText) {
						el.textContent = val;
					} else {
						el.innerText = val;
					}
				});
				return currentValue.trim();
			},

			'attr': function(key, newValue) {
				if (newValue !== undefined) {
					if (typeof key === 'string') {
						this.each(function(el) {
							el.setAttribute(key, newValue);
						});
					}
					return this;
				}
				if (typeof key === 'object') {
					for (var k in key) {
						this.each(function(el) {
							el.setAttribute(k, key[k]);
						});
					}
					return this;
				}
				return this.first().getAttribute(key);
			},

			'removeAttr': function(attrName) {
				var attrList = attrName.split(' ');
				return this.each(function(el) {
					attrList.forEach(function(attrName) {
						el.removeAttribute(attrName);
					});
				});
			},

			'hasClass': function(clazz) {
				var containsClass = false;
				this.each(function(el) {
					if (el.classList.contains(clazz)) {
						containsClass = true;
					}
				});
				return containsClass;
			},

			'addClass': function(clazz) {
				var clazzList = clazz.split(' ');
				return this.each(function(el) {
					clazzList.forEach(function(clazz) {
						el.classList.add(clazz);
					});
				});
			},

			'removeClass': function(clazz) {
				var clazzList = clazz.split(' ');
				return this.each(function(el) {
					clazzList.forEach(function(clazz) {
						el.classList.remove(clazz);
					});
				});
			},

			'toggleClass': function(clazz) {
				var clazzList = clazz.split(' ');
				return this.each(function(el) {
					clazzList.forEach(function(clazz) {
						el.classList.toggle(clazz);
					});
				});
			},

			'removeItem': function() {
				this.each(function(el) {
					if (!el.remove) {
						el.parentNode.removeChild(el);
					} else {
						el.remove();
					}
					el = null;
				});
				this.els = [];
				this.size = 0;
				return this;
			},

			'find': function(selector) {
				var list = [];
				this.each(function(el) {
					var newElement = search(el, selector);
					if (list.indexOf(newElement) === -1) {
						list = list.concat(search(el, selector));
					}
				});
				return query(list);
			},

			'filter': function(filter) {
				var result = [];

				for (var i = 0; i < this.size; i++) {
					if (typeof filter === 'function' && filter(this.els[i])) {
						result.push(this.els[i]);
					} else if (typeof filter === 'string' && this.els[i][filter]) {
						result.push(this.els[i]);
					}
				}
				return query(result);
			},

			'closest': function(selector) {
				var result = [],
					matches = HTMLElement.prototype.matches ||
							HTMLElement.prototype.webkitMatchesSelector ||
							HTMLElement.prototype.mozMatchesSelector ||
							HTMLElement.prototype.msMatchesSelector ||
							HTMLElement.prototype.oMatchesSelector;

				var lookupParent = function(el) {
					if (!el || (el instanceof Element && matches.call(el, selector))) {
						return el;
					}
					return lookupParent(el.parentNode);
				};

				this.each(function(el) {
					var parentFound = lookupParent(el.parentNode);
					if (parentFound && result.indexOf(parentFound) === -1) {
						result.push(parentFound);
					}
				});
				return query(result);
			},

			'first': function() {
				return this.els[0];
			},

			'last': function() {
				return this.els[this.size - 1];
			},

			'previous': function() {
				var el = this.els[0];
				if (el.previousElementSibling) {
					return query(el.previousElementSibling);
				} else {
					while ((el = el.previousSibling)) {
						if (el.nodeType === 1) {
							return query(el);
						}
					}
				}
			},

			'next': function() {
				var el = this.els[0];
				if (el.nextElementSibling) {
					return query(el.nextElementSibling);
				} else {
					while ((el = el.nextSibling)) {
						if (el.nodeType === 1) {
							return query(el);
						}
					}
				}
			},

			'parent': function() {
				var parents = [];
				for (var i = 0; i < this.size; i++) {
					parents.push(this.els[i].parentElement);
				}
				return query(parents);
			},

			'isPresent': function() {
				return this.els !== undefined && this.els.length > 0;
			},

			'checked': function(value) {
				if (value !== undefined && typeof value !== 'boolean') {
					throw Error('Parameter type is not valid');
				}
				if (typeof value === 'boolean') {
					return this.each(function (el) {
						var type = el.getAttribute('type');
						if (!type || !type.match('(checkbox|radio)')) {
							throw Error('Element "' + el.outerHTML + '" is not checkbox nor radio');
						}
						el.checked = value;
					});
				}

				return this.first().checked;
			},

			/* Deprecated */
			'isEmpty': function() {
				return !this.isPresent();
			},

			'on': function (eventsName, command, namedOrConfigs) {
				var eventName = eventsName.split(' ');
				event.boundEvents = event.boundEvents || {};

				for (var i = 0; i < eventName.length; i++) {
					var name = eventName[i];

					this.each(function(el) {
						event.addEvent(el, name, command, namedOrConfigs);
					});

					event.boundEvents[name] = event.boundEvents[name] || [];
					var boundElements = event.boundEvents[name];

					this.each(function(el) {
						if (boundElements.indexOf(el) === -1) {
							boundElements.push(el);
						}
					});
				}
				return this;
			},

			'throttle': function(eventName, command, throttleTime, named) {
				throttleTime = throttleTime || 1000;
				var previous = 0;
				var commandWithThrottle = function(event) {
					var now = + new Date();
					if (previous + throttleTime <= now) {
						command.apply(this, arguments);
						previous = + new Date();
					}
					event.preventDefault();
				};

				return this.on(eventName, commandWithThrottle, named);
			},

			'debounce': function(eventName, command, debounceTime, named) {
				debounceTime = debounceTime || 1000;
				var timer = 0;
				var commandWithDebounce = function(event) {
					clearTimeout(timer);
					timer = setTimeout(command.bind(this), debounceTime);
					event.preventDefault();
				};
				return this.on(eventName, commandWithDebounce, named);
			},

			'off': function(eventName, named) {
				this.each(function(el) {
					event.removeEvent(el, eventName, named);
				});
				event.boundEvents = event.boundEvents || {};
				event.boundEvents[eventName] = event.boundEvents[eventName] || [];
				var boundElements = event.boundEvents[eventName];
				var elementIndex = -1;

				return this.each(function(el) {
					if ((elementIndex = boundElements.indexOf(el)) !== -1) {
						boundElements.splice(elementIndex, 1);
					}
				});
			},

			'trigger': function(event, data) {
				return this.each(function(el) {
					triggerEvent(el, event, data);
				});
			},

			'selectedText': function() {
				var input = this.els[0];
				var type = this.attr('type');
				var validSelectionStart = type ? type.match('(text|search|password|tel|url)') : false;
				if (document.activeElement !== input) {
					return null;
				} else if (validSelectionStart && typeof input.selectionStart !== 'undefined' && input.selectionEnd > 0) {
					return input.value.substring(input.selectionStart, input.selectionEnd);
				} else if (window.getSelection) {
					return window.getSelection().toString();
				} else if (document.getSelection) {
					return document.getSelection().toString();
				} else if (document.selection) {
					if (document.selection.createRange().text) {
						return document.selection.createRange().text;
					}
					return document.selection.createRange().htmlText;
				} else {
					return null;
				}
			},

			'focus': function() {
				this.els[0].focus();
				return this;
			},

			'scrollIntoView': function(scrollIntoViewOptions) {
				scrollIntoViewOptions = (typeof scrollIntoViewOptions === 'boolean') ? scrollIntoViewOptions : scrollIntoViewOptions || true;
				this.els[0].scrollIntoView(scrollIntoViewOptions);
				return this;
			},

			'insertBefore': function(elements) {
				if (typeof elements === 'string') {
					elements = query(search(document, elements));
				}

				elements.each(function(el) {
					if (!el.parentNode) {
						throw Error('Trying to insert element before element without parent');
					}
					el.insertAdjacentHTML('beforebegin', this.els[0].outerHTML);
				}.bind(this));
			},

			'insertAfter': function(elements) {
				if (typeof elements === 'string') {
					elements = query(search(document, elements));
				}

				elements.each(function(el) {
					if (!el.parentNode) {
						throw Error('Trying to insert element after element without parent');
					}
					el.insertAdjacentHTML('afterend', this.els[0].outerHTML);
				}.bind(this));
			},
		};
	};

	var DocSelector = function(selector) {
		if (!selector) {
			return selector;
		} else if (typeof selector === 'string') {
			return query(search(document, selector));
		}
		return query(selector);
	};

	DocSelector.broadcast = function(eventName, data) {
		var boundElements = event.boundEvents[eventName] || [];
		for (var elIndex = 0; elIndex < boundElements.length; elIndex++) {
			var el = boundElements[elIndex];
			triggerEvent(el, eventName, data);
		}
	};

	return DocSelector;
});
