define('doc', ['event'], function(event) {
	var matcher = {
		isTag : function(selector) {
			return selector.match(/^\w+$/);
		},
		isClass : function(selector) {
			return selector.match(/^\.[\w-]+$/);
		},
		isId : function(selector) {
			return selector.match(/^#[\w-]+$/);
		},
		isTagWithClass : function(selector) {
			return selector.match(/[\w+\.\w+]+/)
		}
	};

	var isFunction = function(obj) {
	  return !!(obj && obj.call && obj.apply);
	};

	var search = function(namespace, selector) {
		var selector = selector.replace(/^\s+|\s+$/g, '');
		if (matcher.isTag(selector)) {
			return convertToArray(namespace.getElementsByTagName(selector));
		} else if(matcher.isId(selector)) {
			selector = selector.replace('#', '');
			return document.getElementById(selector);
		} else if (matcher.isClass(selector) && namespace.getElementsByClassName) {
			selector = selector.replace('.', '');
			return convertToArray(namespace.getElementsByClassName(selector));
		}
		return convertToArray(namespace.querySelectorAll(selector));
	};

	var convertToArray = function(nodeList) {
		try {
			return Array.prototype.slice.call(namespace.getElementsByTagName(selector));
		} catch(e) {
			var array = [];
			var length = nodeList.length;
			for(var i = 0; i < length; i++) {
				array.push(nodeList[i]);
			}
			return array;
		}
	};

	var fallbackHasClass = function(el, clazz) {
		return el.className.match(new RegExp('(^|\\s)' + clazz + '($|\\s)'));
	};

	var query = function(elements) {
		var selectedElements = [];

		if (elements){
			if (elements instanceof Array) {
				selectedElements = elements;
			} else {
				selectedElements.push(elements);
			}
		}

		return {
			'els' : selectedElements,
			'size' : selectedElements.length,

			'each' : function(command) {
				for(var i = 0; i < this.size; i++) {
					command(this.els[i], i);
				}
			},

			'data' : function(key, value) {
				// Precisa ser assim, pois pode vir string vazia e deve entrar nesse if
				if(value !== undefined) {
					this.each(function(el) {
						el.setAttribute("data-" + key, value);
					});
					return this;
				}
				if(this.first()) {
					return this.first().getAttribute("data-" + key);
				}
				return "";
			},

			'val' : function(newValue) {
				// Precisa ser assim, pois pode vir string vazia e deve entrar nesse if
				if(newValue !== undefined) {
					this.each(function(el) {
						el.value = newValue;
					});
					return this;
				}
				if(this.first()) {
					return this.first().value;
				}
				return "";
			},

			'html' : function(newValue) {
				if(newValue !== undefined) {
					this.each(function(el) {
						el.innerHTML = newValue;
					});
					return this;
				}
				if(this.first()) {
					return this.first().innerHTML;
				}
				return "";
			},

			'append' : function(value) {
				var appendElement;
				this.each(function(el) {
					appendElement = el.appendChild(value);
				});
				return query(appendElement);
			},

			'text' : function(val) {
				var hasInnerText = (document.getElementsByTagName("body")[0].innerText != undefined) ? true : false;

				var currentValue = "";
				this.each(function(el) {
					if (typeof val === 'undefined') {
						currentValue = el.textContent || el.innerText;
					} else {
						if (!hasInnerText) {
							el.textContent = val;
						} else {
							el.innerText = val;
						}
					}
				});
				return currentValue.trim();
			},

			'attr' : function(key, newValue) {
				// Precisa ser assim, pois pode vir string vazia e deve entrar nesse if
				if(newValue !== undefined) {
					this.each(function(el) {
						el.setAttribute(key, newValue);
					});
					return this;
				}
				return this.first().getAttribute(key);
			},

			'hasClass' : function(clazz) {
				var containsClass = false;
				this.each(function(el){
					if(!el.classList) {
						if(fallbackHasClass(el, clazz)) {
							containsClass = true;
						}
					} else if(el.classList.contains(clazz)){
						containsClass = true;
					}
				});
				return containsClass;
			},

			'addClass' : function(clazz) {
				this.each(function(el) {
					if(!el.classList) {
						if(!fallbackHasClass(el, clazz)) {
							el.className += ' ' + clazz + ' ';
						}
					} else {
						el.classList.add(clazz);
					}
				});
				return this;
			},

			'removeClass' : function(clazz) {
				this.each(function(el) {
					if(!el.classList) {
						el.className = el.className.replace(new RegExp('(^|\\s)' + clazz + '($|\\s)'), '');
					} else {
						el.classList.remove(clazz);
					}
				});
				return this;
			},

			'toggleClass' : function(clazz) {
				this.each(function(el) {
					if(!el.classList) {
						var element = query(el);
						if(element.hasClass(clazz)) {
							element.removeClass(clazz);
						} else {
							element.addClass(clazz);
						}
					} else {
						el.classList.toggle(clazz);
					}
				});
				return this;
			},

			'removeItem' : function() {
				this.each(function(el, i){
					if(!el.remove){
						el.parentNode.removeChild(el);
					}else{
						el.remove();
					}
				});
				this.els = [];
				this.size = 0;
				return this;
			},

			'find' : function(selector) {
				var list = [];
				this.each(function(el) {
					var newElement = search(el, selector);
					if(list.indexOf(newElement) === -1) {
						list = list.concat(search(el, selector));
					}
				});
				return query(list);
			},

			'filter': function(filter) {
				var result = [];

				for(var i = 0; i < this.size; i++) {
					if(typeof filter === 'function' && filter(this.els[i])) {
						result.push(this.els[i]);
					} else if(typeof filter === 'string' && this.els[i][filter]) {
						result.push(this.els[i]);
					}
				}
				return query(result);
			},

			'closest': function(selector) {
				var elements = [];
				var $selector = query(search(document, selector));
				var possibleParents = $selector.els;

				if ($selector.size === 0) {
					return $selector;
				}

				var checkIfParentIsTheOne = function($parent) {
					var parent = $parent.first();
					if (!parent) {
						return null;
					}
					for (var ppi = possibleParents.length - 1; ppi >= 0; ppi--) {
						var pp = possibleParents[ppi];
						if (pp === parent) {
							possibleParents.splice(ppi, 1);
							return pp;
						}
					}
					return checkIfParentIsTheOne($parent.parent());
				};

				this.each(function(el) {
					var closestParent = checkIfParentIsTheOne(query(el).parent());
					if (closestParent) {
						elements.push(closestParent);
					}
				});

				return query(elements);
			},

			'first' : function() {
				return this.els[0];
			},

			'last' : function() {
				return this.els[this.size - 1];
			},

			'previous' : function() {
				var el = this.els[0];
			    if(el.previousElementSibling) {
			        return query(el.previousElementSibling);
			    } else {
			        while(el = el.previousSibling) {
			            if(el.nodeType === 1) return query(el);
			        }
			    }
			},

			'next' : function() {
				var el = this.els[0];
				if(el.nextElementSibling) {
					return query(el.nextElementSibling);
				} else {
					while(el = el.nextSibling) {
						if(el.nodeType === 1) return query(el);
					}
				}
			},

			'parent' : function() {
				var parents = [];
				for(var i = 0; i < this.size; i++) {
					parents.push(this.els[i].parentElement);
				}
				return query(parents);
			},

			'isEmpty' : function() {
				return this.els === undefined || !this.els.length;
			},

			'on' : function(eventName, command, named) {
				this.each(function(el) {
					event.addEvent(el, eventName, command, named);
				});
				return this;
			},

			'throttle' : function(eventName, command, throttleTime, named) {
				throttleTime = throttleTime || 1000;
				var previous = 0;
				var commandWithThrottle = function(event) {
					var now = + new Date();
					if(previous + throttleTime <= now) {
						command.apply(this, arguments);
						previous = + new Date();
					}
					event.preventDefault();
				}

				return this.on(eventName, commandWithThrottle, named);
			},

			'off' : function(eventName, named) {
				this.each(function(el) {
					event.removeEvent(el, eventName, named);
				});
				return this;
			},

			'trigger' : function(event, data) {
				this.each(function(el) {
					var hasNotBeenPrevented;
					if (!document.createEvent) {
						if(!data) {
							hasNotBeenPrevented = el.fireEvent("on" + event);
						} else {
							// IE8 Pollyfill for custom events
							var htmlEvents = document.createEventObject();
							htmlEvents.detail = data;

							var registeredEvents = el["_event"][event];
							for(var namedEvents in registeredEvents) {
								for(var i = 0; i < registeredEvents[namedEvents].length; i++) {
									registeredEvents[namedEvents][i](htmlEvents);
								}
							}
						}
					} else {
						var htmlEvents = document.createEvent("Event");
						htmlEvents.initEvent(event, false, true);
						htmlEvents.detail = data;
						hasNotBeenPrevented = el.dispatchEvent(htmlEvents);
					}
					if (hasNotBeenPrevented && isFunction(el[event])) {
						el[event]();
					}
				});
			},

			'selectedText' : function() {
				var input = this.els[0];
				var type = this.attr('type');
				var validSelectionStart = type? type.match('(text|search|password|tel|url)') : false;
				if(document.activeElement !== input) {
					return;
				} else if(validSelectionStart && typeof input.selectionStart !== 'undefined' && input.selectionEnd > 0) {
					return input.value.substring(input.selectionStart, input.selectionEnd);
				} else if (window.getSelection) {
					return window.getSelection().toString();
				} else if (document.getSelection) {
					return document.getSelection().toString();
				} else if (document.selection) {
					if(document.selection.createRange().text) {
						return document.selection.createRange().text;
					}
					return document.selection.createRange().htmlText;
				} else {
					return;
				}
			}
		}
	}

	return function(selector) {
		if(!selector) {
			return selector;
		} else if(typeof selector === "string") {
			return query(search(document, selector));
		}
		return query(selector);
	};
});
