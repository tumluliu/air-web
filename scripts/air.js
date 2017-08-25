;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

if (!L.mapbox) throw new Error('include mapbox.js before air.js');

L.air = require('./src/directions');
L.air.format = require('./src/format');
L.air.layer = require('./src/layer');
L.air.inputControl = require('./src/input_control');
L.air.errorsControl = require('./src/errors_control');
L.air.routesControl = require('./src/routes_control');
L.air.instructionsControl = require('./src/instructions_control');
L.air.tracksControl = require('./src/tracks_control.js');

},{"./src/directions":7,"./src/errors_control":8,"./src/format":9,"./src/input_control":11,"./src/instructions_control":12,"./src/layer":13,"./src/routes_control":15,"./src/tracks_control.js":17}],2:[function(require,module,exports){
!function(){
  var d3 = {version: "3.4.1"}; // semver
var d3_arraySlice = [].slice,
    d3_array = function(list) { return d3_arraySlice.call(list); }; // conversion for NodeLists

var d3_document = document,
    d3_documentElement = d3_document.documentElement,
    d3_window = window;

// Redefine d3_array if the browser doesn’t support slice-based conversion.
try {
  d3_array(d3_documentElement.childNodes)[0].nodeType;
} catch(e) {
  d3_array = function(list) {
    var i = list.length, array = new Array(i);
    while (i--) array[i] = list[i];
    return array;
  };
}
var d3_subclass = {}.__proto__?

// Until ECMAScript supports array subclassing, prototype injection works well.
function(object, prototype) {
  object.__proto__ = prototype;
}:

// And if your browser doesn't support __proto__, we'll use direct extension.
function(object, prototype) {
  for (var property in prototype) object[property] = prototype[property];
};

function d3_vendorSymbol(object, name) {
  if (name in object) return name;
  name = name.charAt(0).toUpperCase() + name.substring(1);
  for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
    var prefixName = d3_vendorPrefixes[i] + name;
    if (prefixName in object) return prefixName;
  }
}

var d3_vendorPrefixes = ["webkit", "ms", "moz", "Moz", "o", "O"];

function d3_selection(groups) {
  d3_subclass(groups, d3_selectionPrototype);
  return groups;
}

var d3_select = function(s, n) { return n.querySelector(s); },
    d3_selectAll = function(s, n) { return n.querySelectorAll(s); },
    d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")],
    d3_selectMatches = function(n, s) { return d3_selectMatcher.call(n, s); };

// Prefer Sizzle, if available.
if (typeof Sizzle === "function") {
  d3_select = function(s, n) { return Sizzle(s, n)[0] || null; };
  d3_selectAll = function(s, n) { return Sizzle.uniqueSort(Sizzle(s, n)); };
  d3_selectMatches = Sizzle.matchesSelector;
}

d3.selection = function() {
  return d3_selectionRoot;
};

var d3_selectionPrototype = d3.selection.prototype = [];


d3_selectionPrototype.select = function(selector) {
  var subgroups = [],
      subgroup,
      subnode,
      group,
      node;

  selector = d3_selection_selector(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroup.push(subnode = selector.call(node, node.__data__, i, j));
        if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_selector(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_select(selector, this);
  };
}

d3_selectionPrototype.selectAll = function(selector) {
  var subgroups = [],
      subgroup,
      node;

  selector = d3_selection_selectorAll(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
        subgroup.parentNode = node;
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_selectorAll(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_selectAll(selector, this);
  };
}
var d3_nsPrefix = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

d3.ns = {
  prefix: d3_nsPrefix,
  qualify: function(name) {
    var i = name.indexOf(":"),
        prefix = name;
    if (i >= 0) {
      prefix = name.substring(0, i);
      name = name.substring(i + 1);
    }
    return d3_nsPrefix.hasOwnProperty(prefix)
        ? {space: d3_nsPrefix[prefix], local: name}
        : name;
  }
};

d3_selectionPrototype.attr = function(name, value) {
  if (arguments.length < 2) {

    // For attr(string), return the attribute value for the first node.
    if (typeof name === "string") {
      var node = this.node();
      name = d3.ns.qualify(name);
      return name.local
          ? node.getAttributeNS(name.space, name.local)
          : node.getAttribute(name);
    }

    // For attr(object), the object specifies the names and values of the
    // attributes to set or remove. The values may be functions that are
    // evaluated for each element.
    for (value in name) this.each(d3_selection_attr(value, name[value]));
    return this;
  }

  return this.each(d3_selection_attr(name, value));
};

function d3_selection_attr(name, value) {
  name = d3.ns.qualify(name);

  // For attr(string, null), remove the attribute with the specified name.
  function attrNull() {
    this.removeAttribute(name);
  }
  function attrNullNS() {
    this.removeAttributeNS(name.space, name.local);
  }

  // For attr(string, string), set the attribute with the specified name.
  function attrConstant() {
    this.setAttribute(name, value);
  }
  function attrConstantNS() {
    this.setAttributeNS(name.space, name.local, value);
  }

  // For attr(string, function), evaluate the function for each element, and set
  // or remove the attribute as appropriate.
  function attrFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttribute(name);
    else this.setAttribute(name, x);
  }
  function attrFunctionNS() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttributeNS(name.space, name.local);
    else this.setAttributeNS(name.space, name.local, x);
  }

  return value == null
      ? (name.local ? attrNullNS : attrNull) : (typeof value === "function"
      ? (name.local ? attrFunctionNS : attrFunction)
      : (name.local ? attrConstantNS : attrConstant));
}
function d3_collapse(s) {
  return s.trim().replace(/\s+/g, " ");
}
d3.requote = function(s) {
  return s.replace(d3_requote_re, "\\$&");
};

var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

d3_selectionPrototype.classed = function(name, value) {
  if (arguments.length < 2) {

    // For classed(string), return true only if the first node has the specified
    // class or classes. Note that even if the browser supports DOMTokenList, it
    // probably doesn't support it on SVG elements (which can be animated).
    if (typeof name === "string") {
      var node = this.node(),
          n = (name = d3_selection_classes(name)).length,
          i = -1;
      if (value = node.classList) {
        while (++i < n) if (!value.contains(name[i])) return false;
      } else {
        value = node.getAttribute("class");
        while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
      }
      return true;
    }

    // For classed(object), the object specifies the names of classes to add or
    // remove. The values may be functions that are evaluated for each element.
    for (value in name) this.each(d3_selection_classed(value, name[value]));
    return this;
  }

  // Otherwise, both a name and a value are specified, and are handled as below.
  return this.each(d3_selection_classed(name, value));
};

function d3_selection_classedRe(name) {
  return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
}

function d3_selection_classes(name) {
  return name.trim().split(/^|\s+/);
}

// Multiple class names are allowed (e.g., "foo bar").
function d3_selection_classed(name, value) {
  name = d3_selection_classes(name).map(d3_selection_classedName);
  var n = name.length;

  function classedConstant() {
    var i = -1;
    while (++i < n) name[i](this, value);
  }

  // When the value is a function, the function is still evaluated only once per
  // element even if there are multiple class names.
  function classedFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) name[i](this, x);
  }

  return typeof value === "function"
      ? classedFunction
      : classedConstant;
}

function d3_selection_classedName(name) {
  var re = d3_selection_classedRe(name);
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
    } else {
      node.setAttribute("class", d3_collapse(c.replace(re, " ")));
    }
  };
}

d3_selectionPrototype.style = function(name, value, priority) {
  var n = arguments.length;
  if (n < 3) {

    // For style(object) or style(object, string), the object specifies the
    // names and values of the attributes to set or remove. The values may be
    // functions that are evaluated for each element. The optional string
    // specifies the priority.
    if (typeof name !== "string") {
      if (n < 2) value = "";
      for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
      return this;
    }

    // For style(string), return the computed style value for the first node.
    if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);

    // For style(string, string) or style(string, function), use the default
    // priority. The priority is ignored for style(string, null).
    priority = "";
  }

  // Otherwise, a name, value and priority are specified, and handled as below.
  return this.each(d3_selection_style(name, value, priority));
};

function d3_selection_style(name, value, priority) {

  // For style(name, null) or style(name, null, priority), remove the style
  // property with the specified name. The priority is ignored.
  function styleNull() {
    this.style.removeProperty(name);
  }

  // For style(name, string) or style(name, string, priority), set the style
  // property with the specified name, using the specified priority.
  function styleConstant() {
    this.style.setProperty(name, value, priority);
  }

  // For style(name, function) or style(name, function, priority), evaluate the
  // function for each element, and set or remove the style property as
  // appropriate. When setting, use the specified priority.
  function styleFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.style.removeProperty(name);
    else this.style.setProperty(name, x, priority);
  }

  return value == null
      ? styleNull : (typeof value === "function"
      ? styleFunction : styleConstant);
}

d3_selectionPrototype.property = function(name, value) {
  if (arguments.length < 2) {

    // For property(string), return the property value for the first node.
    if (typeof name === "string") return this.node()[name];

    // For property(object), the object specifies the names and values of the
    // properties to set or remove. The values may be functions that are
    // evaluated for each element.
    for (value in name) this.each(d3_selection_property(value, name[value]));
    return this;
  }

  // Otherwise, both a name and a value are specified, and are handled as below.
  return this.each(d3_selection_property(name, value));
};

function d3_selection_property(name, value) {

  // For property(name, null), remove the property with the specified name.
  function propertyNull() {
    delete this[name];
  }

  // For property(name, string), set the property with the specified name.
  function propertyConstant() {
    this[name] = value;
  }

  // For property(name, function), evaluate the function for each element, and
  // set or remove the property as appropriate.
  function propertyFunction() {
    var x = value.apply(this, arguments);
    if (x == null) delete this[name];
    else this[name] = x;
  }

  return value == null
      ? propertyNull : (typeof value === "function"
      ? propertyFunction : propertyConstant);
}

d3_selectionPrototype.text = function(value) {
  return arguments.length
      ? this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.textContent = v == null ? "" : v; } : value == null
      ? function() { this.textContent = ""; }
      : function() { this.textContent = value; })
      : this.node().textContent;
};

d3_selectionPrototype.html = function(value) {
  return arguments.length
      ? this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.innerHTML = v == null ? "" : v; } : value == null
      ? function() { this.innerHTML = ""; }
      : function() { this.innerHTML = value; })
      : this.node().innerHTML;
};

d3_selectionPrototype.append = function(name) {
  name = d3_selection_creator(name);
  return this.select(function() {
    return this.appendChild(name.apply(this, arguments));
  });
};

function d3_selection_creator(name) {
  return typeof name === "function" ? name
      : (name = d3.ns.qualify(name)).local ? function() { return this.ownerDocument.createElementNS(name.space, name.local); }
      : function() { return this.ownerDocument.createElementNS(this.namespaceURI, name); };
}

d3_selectionPrototype.insert = function(name, before) {
  name = d3_selection_creator(name);
  before = d3_selection_selector(before);
  return this.select(function() {
    return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
  });
};

// TODO remove(selector)?
// TODO remove(node)?
// TODO remove(function)?
d3_selectionPrototype.remove = function() {
  return this.each(function() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  });
};
function d3_class(ctor, properties) {
  try {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  } catch (e) {
    ctor.prototype = properties;
  }
}

d3.map = function(object) {
  var map = new d3_Map;
  if (object instanceof d3_Map) object.forEach(function(key, value) { map.set(key, value); });
  else for (var key in object) map.set(key, object[key]);
  return map;
};

function d3_Map() {}

d3_class(d3_Map, {
  has: d3_map_has,
  get: function(key) {
    return this[d3_map_prefix + key];
  },
  set: function(key, value) {
    return this[d3_map_prefix + key] = value;
  },
  remove: d3_map_remove,
  keys: d3_map_keys,
  values: function() {
    var values = [];
    this.forEach(function(key, value) { values.push(value); });
    return values;
  },
  entries: function() {
    var entries = [];
    this.forEach(function(key, value) { entries.push({key: key, value: value}); });
    return entries;
  },
  size: d3_map_size,
  empty: d3_map_empty,
  forEach: function(f) {
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) f.call(this, key.substring(1), this[key]);
  }
});

var d3_map_prefix = "\0", // prevent collision with built-ins
    d3_map_prefixCode = d3_map_prefix.charCodeAt(0);

function d3_map_has(key) {
  return d3_map_prefix + key in this;
}

function d3_map_remove(key) {
  key = d3_map_prefix + key;
  return key in this && delete this[key];
}

function d3_map_keys() {
  var keys = [];
  this.forEach(function(key) { keys.push(key); });
  return keys;
}

function d3_map_size() {
  var size = 0;
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;
  return size;
}

function d3_map_empty() {
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) return false;
  return true;
}

d3_selectionPrototype.data = function(value, key) {
  var i = -1,
      n = this.length,
      group,
      node;

  // If no value is specified, return the first value.
  if (!arguments.length) {
    value = new Array(n = (group = this[0]).length);
    while (++i < n) {
      if (node = group[i]) {
        value[i] = node.__data__;
      }
    }
    return value;
  }

  function bind(group, groupData) {
    var i,
        n = group.length,
        m = groupData.length,
        n0 = Math.min(n, m),
        updateNodes = new Array(m),
        enterNodes = new Array(m),
        exitNodes = new Array(n),
        node,
        nodeData;

    if (key) {
      var nodeByKeyValue = new d3_Map,
          dataByKeyValue = new d3_Map,
          keyValues = [],
          keyValue;

      for (i = -1; ++i < n;) {
        keyValue = key.call(node = group[i], node.__data__, i);
        if (nodeByKeyValue.has(keyValue)) {
          exitNodes[i] = node; // duplicate selection key
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
        keyValues.push(keyValue);
      }

      for (i = -1; ++i < m;) {
        keyValue = key.call(groupData, nodeData = groupData[i], i);
        if (node = nodeByKeyValue.get(keyValue)) {
          updateNodes[i] = node;
          node.__data__ = nodeData;
        } else if (!dataByKeyValue.has(keyValue)) { // no duplicate data key
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
        dataByKeyValue.set(keyValue, nodeData);
        nodeByKeyValue.remove(keyValue);
      }

      for (i = -1; ++i < n;) {
        if (nodeByKeyValue.has(keyValues[i])) {
          exitNodes[i] = group[i];
        }
      }
    } else {
      for (i = -1; ++i < n0;) {
        node = group[i];
        nodeData = groupData[i];
        if (node) {
          node.__data__ = nodeData;
          updateNodes[i] = node;
        } else {
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
      }
      for (; i < m; ++i) {
        enterNodes[i] = d3_selection_dataNode(groupData[i]);
      }
      for (; i < n; ++i) {
        exitNodes[i] = group[i];
      }
    }

    enterNodes.update
        = updateNodes;

    enterNodes.parentNode
        = updateNodes.parentNode
        = exitNodes.parentNode
        = group.parentNode;

    enter.push(enterNodes);
    update.push(updateNodes);
    exit.push(exitNodes);
  }

  var enter = d3_selection_enter([]),
      update = d3_selection([]),
      exit = d3_selection([]);

  if (typeof value === "function") {
    while (++i < n) {
      bind(group = this[i], value.call(group, group.parentNode.__data__, i));
    }
  } else {
    while (++i < n) {
      bind(group = this[i], value);
    }
  }

  update.enter = function() { return enter; };
  update.exit = function() { return exit; };
  return update;
};

function d3_selection_dataNode(data) {
  return {__data__: data};
}

d3_selectionPrototype.datum = function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.property("__data__");
};

d3_selectionPrototype.filter = function(filter) {
  var subgroups = [],
      subgroup,
      group,
      node;

  if (typeof filter !== "function") filter = d3_selection_filter(filter);

  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = 0, n = group.length; i < n; i++) {
      if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
        subgroup.push(node);
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_filter(selector) {
  return function() {
    return d3_selectMatches(this, selector);
  };
}

d3_selectionPrototype.order = function() {
  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
};
d3.ascending = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

d3_selectionPrototype.sort = function(comparator) {
  comparator = d3_selection_sortComparator.apply(this, arguments);
  for (var j = -1, m = this.length; ++j < m;) this[j].sort(comparator);
  return this.order();
};

function d3_selection_sortComparator(comparator) {
  if (!arguments.length) comparator = d3.ascending;
  return function(a, b) {
    return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
  };
}
function d3_noop() {}

d3.dispatch = function() {
  var dispatch = new d3_dispatch,
      i = -1,
      n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  return dispatch;
};

function d3_dispatch() {}

d3_dispatch.prototype.on = function(type, listener) {
  var i = type.indexOf("."),
      name = "";

  // Extract optional namespace, e.g., "click.foo"
  if (i >= 0) {
    name = type.substring(i + 1);
    type = type.substring(0, i);
  }

  if (type) return arguments.length < 2
      ? this[type].on(name)
      : this[type].on(name, listener);

  if (arguments.length === 2) {
    if (listener == null) for (type in this) {
      if (this.hasOwnProperty(type)) this[type].on(name, null);
    }
    return this;
  }
};

function d3_dispatch_event(dispatch) {
  var listeners = [],
      listenerByName = new d3_Map;

  function event() {
    var z = listeners, // defensive reference
        i = -1,
        n = z.length,
        l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }

  event.on = function(name, listener) {
    var l = listenerByName.get(name),
        i;

    // return the current listener, if any
    if (arguments.length < 2) return l && l.on;

    // remove the old listener, if any (with copy-on-write)
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }

    // add the new listener, if any
    if (listener) listeners.push(listenerByName.set(name, {on: listener}));

    return dispatch;
  };

  return event;
}

d3.event = null;

function d3_eventPreventDefault() {
  d3.event.preventDefault();
}

function d3_eventSource() {
  var e = d3.event, s;
  while (s = e.sourceEvent) e = s;
  return e;
}

// Like d3.dispatch, but for custom events abstracting native UI events. These
// events have a target component (such as a brush), a target element (such as
// the svg:g element containing the brush) and the standard arguments `d` (the
// target element's data) and `i` (the selection index of the target element).
function d3_eventDispatch(target) {
  var dispatch = new d3_dispatch,
      i = 0,
      n = arguments.length;

  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);

  // Creates a dispatch context for the specified `thiz` (typically, the target
  // DOM element that received the source event) and `argumentz` (typically, the
  // data `d` and index `i` of the target element). The returned function can be
  // used to dispatch an event to any registered listeners; the function takes a
  // single argument as input, being the event to dispatch. The event must have
  // a "type" attribute which corresponds to a type registered in the
  // constructor. This context will automatically populate the "sourceEvent" and
  // "target" attributes of the event, as well as setting the `d3.event` global
  // for the duration of the notification.
  dispatch.of = function(thiz, argumentz) {
    return function(e1) {
      try {
        var e0 =
        e1.sourceEvent = d3.event;
        e1.target = target;
        d3.event = e1;
        dispatch[e1.type].apply(thiz, argumentz);
      } finally {
        d3.event = e0;
      }
    };
  };

  return dispatch;
}

d3_selectionPrototype.on = function(type, listener, capture) {
  var n = arguments.length;
  if (n < 3) {

    // For on(object) or on(object, boolean), the object specifies the event
    // types and listeners to add or remove. The optional boolean specifies
    // whether the listener captures events.
    if (typeof type !== "string") {
      if (n < 2) listener = false;
      for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
      return this;
    }

    // For on(string), return the listener for the first node.
    if (n < 2) return (n = this.node()["__on" + type]) && n._;

    // For on(string, function), use the default capture.
    capture = false;
  }

  // Otherwise, a type, listener and capture are specified, and handled as below.
  return this.each(d3_selection_on(type, listener, capture));
};

function d3_selection_on(type, listener, capture) {
  var name = "__on" + type,
      i = type.indexOf("."),
      wrap = d3_selection_onListener;

  if (i > 0) type = type.substring(0, i);
  var filter = d3_selection_onFilters.get(type);
  if (filter) type = filter, wrap = d3_selection_onFilter;

  function onRemove() {
    var l = this[name];
    if (l) {
      this.removeEventListener(type, l, l.$);
      delete this[name];
    }
  }

  function onAdd() {
    var l = wrap(listener, d3_array(arguments));
    onRemove.call(this);
    this.addEventListener(type, this[name] = l, l.$ = capture);
    l._ = listener;
  }

  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"),
        match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l.$);
        delete this[name];
      }
    }
  }

  return i
      ? listener ? onAdd : onRemove
      : listener ? d3_noop : removeAll;
}

var d3_selection_onFilters = d3.map({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
});

d3_selection_onFilters.forEach(function(k) {
  if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
});

function d3_selection_onListener(listener, argumentz) {
  return function(e) {
    var o = d3.event; // Events can be reentrant (e.g., focus).
    d3.event = e;
    argumentz[0] = this.__data__;
    try {
      listener.apply(this, argumentz);
    } finally {
      d3.event = o;
    }
  };
}

function d3_selection_onFilter(listener, argumentz) {
  var l = d3_selection_onListener(listener, argumentz);
  return function(e) {
    var target = this, related = e.relatedTarget;
    if (!related || (related !== target && !(related.compareDocumentPosition(target) & 8))) {
      l.call(target, e);
    }
  };
}

d3_selectionPrototype.each = function(callback) {
  return d3_selection_each(this, function(node, i, j) {
    callback.call(node, node.__data__, i, j);
  });
};

function d3_selection_each(groups, callback) {
  for (var j = 0, m = groups.length; j < m; j++) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
      if (node = group[i]) callback(node, i, j);
    }
  }
  return groups;
}

d3_selectionPrototype.call = function(callback) {
  var args = d3_array(arguments);
  callback.apply(args[0] = this, args);
  return this;
};

d3_selectionPrototype.empty = function() {
  return !this.node();
};

d3_selectionPrototype.node = function() {
  for (var j = 0, m = this.length; j < m; j++) {
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
};

d3_selectionPrototype.size = function() {
  var n = 0;
  this.each(function() { ++n; });
  return n;
};

function d3_selection_enter(selection) {
  d3_subclass(selection, d3_selection_enterPrototype);
  return selection;
}

var d3_selection_enterPrototype = [];

d3.selection.enter = d3_selection_enter;
d3.selection.enter.prototype = d3_selection_enterPrototype;

d3_selection_enterPrototype.append = d3_selectionPrototype.append;
d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
d3_selection_enterPrototype.node = d3_selectionPrototype.node;
d3_selection_enterPrototype.call = d3_selectionPrototype.call;
d3_selection_enterPrototype.size = d3_selectionPrototype.size;


d3_selection_enterPrototype.select = function(selector) {
  var subgroups = [],
      subgroup,
      subnode,
      upgroup,
      group,
      node;

  for (var j = -1, m = this.length; ++j < m;) {
    upgroup = (group = this[j]).update;
    subgroups.push(subgroup = []);
    subgroup.parentNode = group.parentNode;
    for (var i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
        subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }

  return d3_selection(subgroups);
};

d3_selection_enterPrototype.insert = function(name, before) {
  if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
  return d3_selectionPrototype.insert.call(this, name, before);
};

function d3_selection_enterInsertBefore(enter) {
  var i0, j0;
  return function(d, i, j) {
    var group = enter[j].update,
        n = group.length,
        node;
    if (j != j0) j0 = j, i0 = 0;
    if (i >= i0) i0 = i + 1;
    while (!(node = group[i0]) && ++i0 < n);
    return node;
  };
}

// import "../transition/transition";

d3_selectionPrototype.transition = function() {
  var id = d3_transitionInheritId || ++d3_transitionId,
      subgroups = [],
      subgroup,
      node,
      transition = d3_transitionInherit || {time: Date.now(), ease: d3_ease_cubicInOut, delay: 0, duration: 250};

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) d3_transitionNode(node, i, id, transition);
      subgroup.push(node);
    }
  }

  return d3_transition(subgroups, id);
};
// import "../transition/transition";

d3_selectionPrototype.interrupt = function() {
  return this.each(d3_selection_interrupt);
};

function d3_selection_interrupt() {
  var lock = this.__transition__;
  if (lock) ++lock.active;
}

// TODO fast singleton implementation?
d3.select = function(node) {
  var group = [typeof node === "string" ? d3_select(node, d3_document) : node];
  group.parentNode = d3_documentElement;
  return d3_selection([group]);
};

d3.selectAll = function(nodes) {
  var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
  group.parentNode = d3_documentElement;
  return d3_selection([group]);
};

var d3_selectionRoot = d3.select(d3_documentElement);
  if (typeof define === "function" && define.amd) {
    define(d3);
  } else if (typeof module === "object" && module.exports) {
    module.exports = d3;
  } else {
    this.d3 = d3;
  }
}();

},{}],3:[function(require,module,exports){
function corslite(url, callback, cors) {
    var sent = false;

    if (typeof window.XMLHttpRequest === 'undefined') {
        return callback(Error('Browser not supported'));
    }

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.hostname +
                (location.port ? ':' + location.port : ''));
    }

    var x = new window.XMLHttpRequest();

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    if (cors && !('withCredentials' in x)) {
        // IE8-9
        x = new window.XDomainRequest();

        // Ensure callback is never called synchronously, i.e., before
        // x.send() returns (this has been observed in the wild).
        // See https://github.com/mapbox/mapbox.js/issues/472
        var original = callback;
        callback = function() {
            if (sent) {
                original.apply(this, arguments);
            } else {
                var that = this, args = arguments;
                setTimeout(function() {
                    original.apply(that, args);
                }, 0);
            }
        }
    }

    function loaded() {
        if (
            // XDomainRequest
            x.status === undefined ||
            // modern browsers
            isSuccessful(x.status)) callback.call(x, null, x);
        else callback.call(x, x, null);
    }

    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
    if ('onload' in x) {
        x.onload = loaded;
    } else {
        x.onreadystatechange = function readystate() {
            if (x.readyState === 4) {
                loaded();
            }
        };
    }

    // Call the callback with the XMLHttpRequest object as an error and prevent
    // it from ever being called again by reassigning it to `noop`
    x.onerror = function error(evt) {
        // XDomainRequest provides no evt parameter
        callback.call(this, evt || true, null);
        callback = function() { };
    };

    // IE9 must have onprogress be set to a unique function.
    x.onprogress = function() { };

    x.ontimeout = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    x.onabort = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    // GET is the only supported HTTP Verb by XDomainRequest and is the
    // only one supported here.
    x.open('GET', url, true);

    // Send the request. Sending data is not supported.
    x.send(null);
    sent = true;

    return x;
}

if (typeof module !== 'undefined') module.exports = corslite;

},{}],4:[function(require,module,exports){
'use strict';

/**
 * Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
 *
 * Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
 * by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)
 *
 * @module polyline
 */

var polyline = {};

function py2_round(value) {
    // Google's polyline algorithm uses the same rounding strategy as Python 2, which is different from JS for negative values
    return Math.floor(Math.abs(value) + 0.5) * Math.sign(value);
}

function encode(current, previous, factor) {
    current = py2_round(current * factor);
    previous = py2_round(previous * factor);
    var coordinate = current - previous;
    coordinate <<= 1;
    if (current - previous < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
}

/**
 * Decodes to a [latitude, longitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
polyline.decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

/**
 * Encodes the given [latitude, longitude] coordinates array.
 *
 * @param {Array.<Array.<Number>>} coordinates
 * @param {Number} precision
 * @returns {String}
 */
polyline.encode = function(coordinates, precision) {
    if (!coordinates.length) { return ''; }

    var factor = Math.pow(10, precision || 5),
        output = encode(coordinates[0][0], 0, factor) + encode(coordinates[0][1], 0, factor);

    for (var i = 1; i < coordinates.length; i++) {
        var a = coordinates[i], b = coordinates[i - 1];
        output += encode(a[0], b[0], factor);
        output += encode(a[1], b[1], factor);
    }

    return output;
};

function flipped(coords) {
    var flipped = [];
    for (var i = 0; i < coords.length; i++) {
        flipped.push(coords[i].slice().reverse());
    }
    return flipped;
}

/**
 * Encodes a GeoJSON LineString feature/geometry.
 *
 * @param {Object} geojson
 * @param {Number} precision
 * @returns {String}
 */
polyline.fromGeoJSON = function(geojson, precision) {
    if (geojson && geojson.type === 'Feature') {
        geojson = geojson.geometry;
    }
    if (!geojson || geojson.type !== 'LineString') {
        throw new Error('Input must be a GeoJSON LineString');
    }
    return polyline.encode(flipped(geojson.coordinates), precision);
};

/**
 * Decodes to a GeoJSON LineString geometry.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Object}
 */
polyline.toGeoJSON = function(str, precision) {
    var coords = polyline.decode(str, precision);
    return {
        type: 'LineString',
        coordinates: flipped(coords)
    };
};

if (typeof module === 'object' && module.exports) {
    module.exports = polyline;
}

},{}],5:[function(require,module,exports){
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

},{}],6:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('queue', factory) :
  (global.queue = factory());
}(this, function () { 'use strict';

  var slice = [].slice;

  function noop() {}

  var noabort = {};
  var success = [null];
  function newQueue(concurrency) {
    if (!(concurrency >= 1)) throw new Error;

    var q,
        tasks = [],
        results = [],
        waiting = 0,
        active = 0,
        ended = 0,
        starting, // inside a synchronous task callback?
        error,
        callback = noop,
        callbackAll = true;

    function start() {
      if (starting) return; // let the current task complete
      while (starting = waiting && active < concurrency) {
        var i = ended + active,
            t = tasks[i],
            j = t.length - 1,
            c = t[j];
        t[j] = end(i);
        --waiting, ++active, tasks[i] = c.apply(null, t) || noabort;
      }
    }

    function end(i) {
      return function(e, r) {
        if (!tasks[i]) throw new Error; // detect multiple callbacks
        --active, ++ended, tasks[i] = null;
        if (error != null) return; // only report the first error
        if (e != null) {
          abort(e);
        } else {
          results[i] = r;
          if (waiting) start();
          else if (!active) notify();
        }
      };
    }

    function abort(e) {
      error = e; // ignore new tasks and squelch active callbacks
      waiting = NaN; // stop queued tasks from starting
      notify();
    }

    function notify() {
      if (error != null) callback(error);
      else if (callbackAll) callback(null, results);
      else callback.apply(null, success.concat(results));
    }

    return q = {
      defer: function(f) {
        if (callback !== noop) throw new Error;
        var t = slice.call(arguments, 1);
        t.push(f);
        ++waiting, tasks.push(t);
        start();
        return q;
      },
      abort: function() {
        if (error == null) {
          var i = ended + active, t;
          while (--i >= 0) (t = tasks[i]) && t.abort && t.abort();
          abort(new Error("abort"));
        }
        return q;
      },
      await: function(f) {
        if (callback !== noop) throw new Error;
        callback = f, callbackAll = false;
        if (!waiting && !active) notify();
        return q;
      },
      awaitAll: function(f) {
        if (callback !== noop) throw new Error;
        callback = f, callbackAll = true;
        if (!waiting && !active) notify();
        return q;
      }
    };
  }

  function queue(concurrency) {
    return newQueue(arguments.length ? +concurrency : Infinity);
  }

  queue.version = "1.2.1";

  return queue;

}));
},{}],7:[function(require,module,exports){
"use strict";

var getRequest = require("./get_request"),
    polyline = require("@mapbox/polyline"),
    queue = require("queue-async");

var Directions = L.Class.extend({
    includes: [L.Mixin.Events],

    options: {
        provider: "openrouteservice",
        mapbox: {
            api_template:
                "https://api.mapbox.com/directions/v5/mapbox/cycling/{waypoints}?geometries=polyline&access_token={token}",
            geocoder_template:
                "https://api.tiles.mapbox.com/v4/geocode/mapbox.places/{query}.json?proximity={proximity}&access_token={token}",
            key:
                "pk.eyJ1IjoibGxpdSIsImEiOiI4dW5uVkVJIn0.jhfpLn2Esk_6ZSG62yXYOg",
            profile: "cycling",
            path_style: {
                stroke: "#4264fb",
                "stroke-opacity": 0.78,
                "stroke-width": 5
            }
        },
        openrouteservice: {
            api_template:
                "https://api.openrouteservice.org/corsdirections?&coordinates={coordinates}&instructions=false&preference={preference}&profile={profile}&api_key={token}",
            key: "58d904a497c67e00015b45fcf243eacf4b25434c6e28d7fd61c9d309",
            preference: "",
            profile: "cycling-regular",
            path_style: {
                stroke: "#cf5f5f",
                "stroke-opacity": 0.78,
                "stroke-width": 5
            }
        },
        google: {
            api_template:
                "https://luliu.me/gmapswrapper?origin={origin}&destination={destination}&mode=bicycling&key={token}",
            key: "AIzaSyDc2gadWI4nunYb0i5Mx_P3AH_yDTiMzAY",
            profile: "bicycling",
            path_style: {
                stroke: "#0f9d58",
                "stroke-opacity": 0.78,
                "stroke-width": 5
            }
        }
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._waypoints = [];
    },

    getOrigin: function() {
        return this.origin;
    },

    getDestination: function() {
        return this.destination;
    },

    setOrigin: function(origin) {
        origin = this._normalizeWaypoint(origin);

        this.origin = origin;
        this.fire("origin", {
            origin: origin
        });

        if (!origin) {
            this._unload();
        }

        return this;
    },

    setDestination: function(destination) {
        destination = this._normalizeWaypoint(destination);

        this.destination = destination;
        this.fire("destination", {
            destination: destination
        });

        if (!destination) {
            this._unload();
        }

        return this;
    },

    getWaypoints: function() {
        return this._waypoints;
    },

    setWaypoints: function(waypoints) {
        this._waypoints = waypoints.map(this._normalizeWaypoint);
        return this;
    },

    addWaypoint: function(index, waypoint) {
        this._waypoints.splice(index, 0, this._normalizeWaypoint(waypoint));
        return this;
    },

    removeWaypoint: function(index) {
        this._waypoints.splice(index, 1);
        return this;
    },

    setWaypoint: function(index, waypoint) {
        this._waypoints[index] = this._normalizeWaypoint(waypoint);
        return this;
    },

    reverse: function() {
        var o = this.origin,
            d = this.destination;

        this.origin = d;
        this.destination = o;
        this._waypoints.reverse();

        this.fire("origin", {
            origin: this.origin
        }).fire("destination", {
            destination: this.destination
        });

        return this;
    },

    selectRoute: function(route) {
        this.fire("selectRoute", {
            route: route
        });
    },

    selectTrack: function(track) {
        this.fire("selectTrack", {
            track: track.GeoJSON
        });
    },

    highlightRoute: function(route) {
        this.fire("highlightRoute", {
            route: route
        });
    },

    highlightStep: function(step) {
        this.fire("highlightStep", {
            step: step
        });
    },

    queryURL: function(opts) {
        this.options.provider = opts.provider.toLowerCase();
        var template = this.options[this.options.provider].api_template;
        var points = "";
        if (this.options.provider === "mapbox") {
            points = [this.getOrigin(), this.getDestination()]
                .map(function(p) {
                    return p.geometry.coordinates;
                })
                .join(";");
            return L.Util.template(template, {
                token: this.options.mapbox.key,
                waypoints: points
            });
        }
        if (this.options.provider === "openrouteservice") {
            points = [this.getOrigin(), this.getDestination()]
                .map(function(p) {
                    return p.geometry.coordinates;
                })
                .join("%7C");
            if (opts.hasOwnProperty("preference")) {
                this.options.openrouteservice.preference = opts.preference;
            }
            if (opts.hasOwnProperty("profile")) {
                this.options.openrouteservice.profile = opts.profile;
            }
            return L.Util.template(template, {
                token: this.options.openrouteservice.key,
                coordinates: points,
                preference: this.options.openrouteservice.preference,
                profile: this.options.openrouteservice.profile
            });
        }
        if (this.options.provider === "google") {
            var origin_coords = this.getOrigin().geometry.coordinates.slice();
            var dest_coords = this.getDestination().geometry.coordinates.slice();
            return L.Util.template(template, {
                token: this.options.google.key,
                origin: origin_coords.reverse().join(","),
                destination: dest_coords.reverse().join(",")
            });
        }

        return null;
    },

    _constructRoutingResult: function(resp, provider) {
        this.directions = resp;
        if (provider === "mapbox") {
            this.directions.origin = resp.waypoints[0];
            this.directions.destination = resp.waypoints.slice(-1)[0];
            this.directions.waypoints.forEach(function(wp) {
                wp.geometry = {
                    type: "Point",
                    coordinates: wp.location
                };
                wp.properties = {
                    name: wp.name
                };
            });
            this.directions.waypoints = resp.waypoints.slice(1, -1);
        }
        if (provider === "openrouteservice") {
            this.directions.origin = resp.info.query.coordinates[0];
            this.directions.destination = resp.info.query.coordinates[1];
            this.directions.waypoints = [];
        }
        if (provider === "mapbox" || provider === "openrouteservice") {
            this.directions.routes.forEach(function(route) {
                route.geometry = {
                    type: "Feature",
                    properties: this.options[this.options.provider].path_style,
                    geometry: {
                        type: "LineString",
                        coordinates: polyline
                            .decode(route.geometry)
                            .map(function(c) {
                                return c.reverse();
                            })
                    }
                };
            }, this);
        }
        if (provider === "google") {
            this.directions.origin = this.origin;
            this.directions.destination = this.destination;
            this.directions.waypoints = [];
            this.directions.routes.forEach(function(route) {
                route.geometry = {
                    type: "Feature",
                    properties: this.options[this.options.provider].path_style,
                    geometry: {
                        type: "LineString",
                        coordinates: polyline
                            .decode(route.overview_polyline.points)
                            .map(function(c) {
                                return c.reverse();
                            })
                    }
                };
            }, this);
        }
    },

    queryable: function() {
        return this.getOrigin() && this.getDestination();
    },

    query: function(opts) {
        if (!opts)
            opts = {
                provider: this.options.provider
            };
        if (!this.queryable()) return this;

        if (this._query) {
            this._query.abort();
        }

        if (this._requests && this._requests.length)
            this._requests.forEach(function(getRequest) {
                getRequest.abort();
            });
        this._requests = [];

        var q = queue();

        var pts = [this.origin, this.destination].concat(this._waypoints);
        for (var i in pts) {
            if (
                !pts[i].geometry.coordinates ||
                !pts[i].properties.hasOwnProperty("name")
            ) {
                q.defer(L.bind(this._geocode, this), pts[i], opts.proximity);
            }
        }

        q.await(
            L.bind(function(err) {
                if (err) {
                    return this.fire("error", {
                        error: err.message
                    });
                }

                this._query = getRequest(
                    this.queryURL(opts),
                    L.bind(function(err, resp) {
                        this._query = null;

                        if (err) {
                            return this.fire("error", {
                                error: err.message
                            });
                        }

                        this._constructRoutingResult(
                            resp,
                            this.options.provider
                        );
                        if (!this.origin.properties.name) {
                            this.origin = this.directions.origin;
                        } else {
                            this.directions.origin = this.origin;
                        }

                        if (!this.destination.properties.name) {
                            this.destination = this.directions.destination;
                        } else {
                            this.directions.destination = this.destination;
                        }

                        this.fire("load", this.directions);
                    }, this),
                    this
                );
            }, this)
        );

        return this;
    },

    _geocode: function(waypoint, proximity, cb) {
        if (!this._requests) this._requests = [];
        this._requests.push(
            getRequest(
                L.Util.template(this.options.mapbox.geocoder_template, {
                    query: waypoint.properties.query,
                    token: this.options.mapbox.key || L.mapbox.accessToken,
                    proximity: proximity
                        ? [proximity.lng, proximity.lat].join(",")
                        : ""
                }),
                L.bind(function(err, resp) {
                    if (err) {
                        return cb(err);
                    }

                    if (!resp.features || !resp.features.length) {
                        return cb(
                            new Error(
                                "No results found for query " +
                                    waypoint.properties.query
                            )
                        );
                    }

                    waypoint.geometry.coordinates = resp.features[0].center;
                    waypoint.properties.name = resp.features[0].place_name;

                    return cb();
                }, this)
            )
        );
    },

    _unload: function() {
        this._waypoints = [];
        delete this.directions;
        this.fire("unload");
    },

    _normalizeWaypoint: function(waypoint) {
        if (!waypoint || waypoint.type === "Feature") {
            return waypoint;
        }

        var coordinates,
            properties = {};

        if (waypoint instanceof L.LatLng) {
            waypoint = waypoint.wrap();
            coordinates = properties.query = [waypoint.lng, waypoint.lat];
        } else if (typeof waypoint === "string") {
            properties.query = waypoint;
        }

        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: coordinates
            },
            properties: properties
        };
    }
});

module.exports = function(options) {
    return new Directions(options);
};

},{"./get_request":10,"@mapbox/polyline":4,"queue-async":6}],8:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-errors', true);

    directions.on('load unload', function () {
        container
            .classed('mapbox-error-active', false)
            .html('');
    });

    directions.on('error', function (e) {
        container
            .classed('mapbox-error-active', true)
            .html('')
            .append('span')
            .attr('class', 'mapbox-directions-error')
            .text(e.error);

        container
            .insert('span', 'span')
            .attr('class', 'mapbox-directions-icon mapbox-error-icon');
    });

    return control;
};

},{"../lib/d3":2,"./format":9}],9:[function(require,module,exports){
'use strict';

module.exports = {
    duration: function (s) {
        var m = Math.floor(s / 60),
            h = Math.floor(m / 60);
        s %= 60;
        m %= 60;
        if (h === 0 && m === 0) return s + ' s';
        if (h === 0) return m + ' min';
        return h + ' h ' + m + ' min';
    },

    imperial: function (m) {
        var mi = m / 1609.344;
        if (mi >= 100) return mi.toFixed(0) + ' mi';
        if (mi >= 10)  return mi.toFixed(1) + ' mi';
        if (mi >= 0.1) return mi.toFixed(2) + ' mi';
        return (mi * 5280).toFixed(0) + ' ft';
    },

    metric: function (m) {
        if (m >= 100000) return (m / 1000).toFixed(0) + ' km';
        if (m >= 10000)  return (m / 1000).toFixed(1) + ' km';
        if (m >= 100)    return (m / 1000).toFixed(2) + ' km';
        return m.toFixed(0) + ' m';
    }
};

},{}],10:[function(require,module,exports){
'use strict';

var corslite = require('@mapbox/corslite');

module.exports = function(url, callback) {
    return corslite(url, function (err, resp) {
        if (err && err.type === 'abort') {
            return;
        }

        if (err && !err.responseText) {
            return callback(err);
        }

        resp = resp || err;

        try {
            resp = JSON.parse(resp.responseText);
        } catch (e) {
            return callback(new Error(resp.responseText));
        }

        if (resp.error) {
            return callback(new Error(resp.error));
        }

        return callback(null, resp);
    });
};

},{"@mapbox/corslite":3}],11:[function(require,module,exports){
"use strict";

var d3 = require("../lib/d3");

module.exports = function(container, directions) {
    var control = {},
        map;
    var origChange = false,
        destChange = false;

    control.addTo = function(_) {
        map = _;
        return control;
    };

    container = d3
        .select(L.DomUtil.get(container))
        .classed("mapbox-directions-inputs", true);

    var form = container.append("form").on("keypress", function() {
        if (d3.event.keyCode === 13) {
            d3.event.preventDefault();
            if (origChange) directions.setOrigin(originInput.property("value"));
            if (destChange)
                directions.setDestination(destinationInput.property("value"));
            if (directions.queryable())
                for (var key in directionProviders) {
                    if (
                        directionProviders.hasOwnProperty(key) &&
                        directionProviders[key] === true
                    ) {
                        directions.query({
                            proximity: map.getCenter(),
                            provider: key
                        });
                    }
                }
            origChange = false;
            destChange = false;
        }
    });

    var origin = form.append("div").attr("class", "mapbox-directions-origin");

    origin
        .append("label")
        .attr("class", "mapbox-form-label")
        .on("click", function() {
            if (directions.getOrigin() instanceof L.LatLng) {
                map.panTo(directions.getOrigin());
            }
        })
        .append("span")
        .attr("class", "mapbox-directions-icon mapbox-depart-icon");

    var originInput = origin
        .append("input")
        .attr("type", "text")
        .attr("required", "required")
        .attr("id", "air-origin-input")
        .attr("placeholder", "Start")
        .on("input", function() {
            if (!origChange) origChange = true;
        });

    origin
        .append("div")
        .attr("class", "mapbox-directions-icon mapbox-close-icon")
        .attr("title", "Clear value")
        .on("click", function() {
            directions.setOrigin(undefined);
        });

    form
        .append("span")
        .attr(
            "class",
            "mapbox-directions-icon mapbox-reverse-icon mapbox-directions-reverse-input"
        )
        .attr("title", "Reverse origin & destination")
        .on("click", function() {
            for (var key in directionProviders) {
                if (
                    directionProviders.hasOwnProperty(key) &&
                    directionProviders[key] === true
                ) {
                    directions.reverse().query({
                        provider: key
                    });
                }
            }
        });

    var destination = form
        .append("div")
        .attr("class", "mapbox-directions-destination");

    destination
        .append("label")
        .attr("class", "mapbox-form-label")
        .on("click", function() {
            if (directions.getDestination() instanceof L.LatLng) {
                map.panTo(directions.getDestination());
            }
        })
        .append("span")
        .attr("class", "mapbox-directions-icon mapbox-arrive-icon");

    var destinationInput = destination
        .append("input")
        .attr("type", "text")
        .attr("required", "required")
        .attr("id", "air-destination-input")
        .attr("placeholder", "End")
        .on("input", function() {
            if (!destChange) destChange = true;
        });

    destination
        .append("div")
        .attr("class", "mapbox-directions-icon mapbox-close-icon")
        .attr("title", "Clear value")
        .on("click", function() {
            directions.setDestination(undefined);
        });

    var directionProviders = {
        mapbox: false,
        openrouteservice: false,
        google: false
    };

    //Options block for Mapbox cycling path finding
    var mapboxDirections = form
        .append("div")
        .attr("id", "mapbox-directions")
        .attr("class", "mapbox-directions-profile");

    mapboxDirections
        .append("input")
        .attr("type", "checkbox")
        .attr("name", "enabled")
        .attr("id", "show-mapbox-cycling")
        .property("checked", false)
        .on("change", function(d) {
            if (this.checked) {
                directionProviders.mapbox = true;
                directions.query({
                    provider: "mapbox"
                });
            } else directionProviders.mapbox = false;
        });

    //mapboxDirections.append('h3')
    //.attr('value', 'MAPBOX')
    //.attr('style', 'margin: 5px 0px 0px 5px')
    //.text('MAPBOX DIRECTIONS');

    mapboxDirections
        .append("label")
        .attr("class", "air-heading-label")
        .attr("for", "show-mapbox-cycling")
        .text("MAPBOX DIRECTIONS");

    var googleDirections = form
        .append("div")
        .attr("id", "google-directions-profile")
        .attr("class", "mapbox-directions-profile");

    googleDirections
        .append("input")
        .attr("type", "checkbox")
        .attr("name", "enabled")
        .attr("id", "show-google-cycling")
        .property("checked", false)
        .on("change", function(d) {
            if (this.checked) {
                directionProviders.google = true;
                directions.query({
                    provider: "google"
                });
            } else {
                directionProviders.google = false;
            }
        });

    googleDirections
        .append("label")
        .attr("class", "air-heading-label")
        .attr("for", "show-google-cycling")
        .text("GOOGLE MAPS");

    //Options block for OpenRouteService cycling path finding
    var orsDirections = form
        .append("div")
        .attr("id", "ors-directions")
        .attr("class", "mapbox-directions-profile");

    orsDirections
        .append("input")
        .attr("type", "checkbox")
        .attr("name", "enabled")
        .attr("id", "show-ors-cycling")
        .property("checked", false)
        .on("change", function(d) {
            if (this.checked) {
                directionProviders.openrouteservice = true;
                directions.query({
                    provider: "openrouteservice"
                });
                orsCyclingOptions.property("disabled", false);
            } else {
                directionProviders.openrouteservice = false;
                orsCyclingOptions.property("disabled", true);
            }
        });

    orsDirections
        .append("label")
        .attr("class", "air-heading-label")
        .attr("for", "show-ors-cycling")
        .text("OPENROUTESERVICE");

    var orsCyclingOptions = orsDirections.append("ul");
    orsCyclingOptions
        .append("li")
        .append("div")
        .append("input")
        .attr("type", "radio")
        .attr("name", "orsProfileBicycle")
        .attr("id", "ors-bicycle")
        .on("change", function(d) {
            alert(d);
        })
        .append("label")
        .attr("for", "ors-bicycle")
        .text("Normal");

    function format(waypoint) {
        if (!waypoint) {
            return "";
        } else if (waypoint.properties.name) {
            return waypoint.properties.name;
        } else if (waypoint.geometry.coordinates) {
            var precision = Math.max(
                0,
                Math.ceil(Math.log(map.getZoom()) / Math.LN2)
            );
            return (
                waypoint.geometry.coordinates[0].toFixed(precision) +
                ", " +
                waypoint.geometry.coordinates[1].toFixed(precision)
            );
        } else {
            return waypoint.properties.query || "";
        }
    }

    directions
        .on("origin", function(e) {
            originInput.property("value", format(e.origin));
        })
        .on("destination", function(e) {
            destinationInput.property("value", format(e.destination));
        })
        .on("load", function(e) {
            originInput.property("value", format(e.origin));
            destinationInput.property("value", format(e.destination));
        });

    return control;
};

},{"../lib/d3":2}],12:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-instructions', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('selectRoute', function (e) {
        var route = e.route;

        container.html('');

        var steps = container.append('ol')
            .attr('class', 'mapbox-directions-steps')
            .selectAll('li')
            .data(route.steps)
            .enter().append('li')
            .attr('class', 'mapbox-directions-step');

        steps.append('span')
            .attr('class', function (step) {
                if (step.properties.type === 'path') {
                    return 'mapbox-directions-icon mapbox-continue-icon';
                }
                else if (step.properties.type === 'switch_point') {
                    return 'mapbox-directions-icon air-' + step.properties.switch_type.toLowerCase() + '-icon';
                }
            });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-maneuver')
            .html(function (step) { 
                if (step.properties.type === 'path') { 
                    switch (step.properties.mode) {
                        case 'private_car':
                            return 'Driving'; 
                            break;
                        case 'foot':
                            return 'Walking';
                            break;
                        case 'bicycle':
                            return 'Cycling';
                            break;
                        default:
                            return step.properties.title;
                            break;
                    }
                }
                else if (step.properties.type === 'switch_point') { 
                    if (step.properties.switch_type === 'underground_station') {
                        return step.properties.title + ': Platform ' + step.properties.platform;
                    }
                    return step.properties.title; 
                } 
            });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-distance')
            .text(function (step) {
                return step.properties.distance ? format[directions.options.units](step.properties.distance) : '';
            });

        steps.on('mouseover', function (step) {
            directions.highlightStep(step);
        });

        steps.on('mouseout', function () {
            directions.highlightStep(null);
        });

        steps.on('click', function (step) {
            if (step.loc) {
                map.panTo(L.GeoJSON.coordsToLatLng(step.loc));
            }
        });
    });

    return control;
};

},{"../lib/d3":2,"./format":9}],13:[function(require,module,exports){
'use strict';

var debounce = require('debounce');

var Layer = L.LayerGroup.extend({
    options: {
        readonly: false
    },

    initialize: function(directions, options) {
        L.setOptions(this, options);
        this._directions = directions || new L.Directions();
        L.LayerGroup.prototype.initialize.apply(this);

        this._drag = debounce(L.bind(this._drag, this), 100);

        this.originMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-color': '#3BB2D0',
                'marker-symbol': 'a'
            })
        }).on('drag', this._drag, this);

        this.destinationMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-color': '#444',
                'marker-symbol': 'b'
            })
        }).on('drag', this._drag, this);

        this.stepMarker = L.marker([0, 0], {
            icon: L.divIcon({
                className: 'mapbox-marker-drag-icon mapbox-marker-drag-icon-step',
                iconSize: new L.Point(12, 12)
            })
        });

        this.dragMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: this._waypointIcon()
        });

        this.dragMarker
            .on('dragstart', this._dragStart, this)
            .on('drag', this._drag, this)
            .on('dragend', this._dragEnd, this);

        this.routeLayer = L.mapbox.featureLayer();
        this.routeHighlightLayer = L.mapbox.featureLayer();
        this.trackLayer = L.mapbox.featureLayer();

        this.waypointMarkers = [];
    },

    onAdd: function() {
        L.LayerGroup.prototype.onAdd.apply(this, arguments);

        if (!this.options.readonly) {
          this._map
              .on('click', this._click, this)
              .on('mousemove', this._mousemove, this);
        }

        this._directions
            .on('origin', this._origin, this)
            .on('destination', this._destination, this)
            .on('load', this._load, this)
            .on('unload', this._unload, this)
            .on('selectRoute', this._selectRoute, this)
            .on('selectTrack', this._selectTrack, this)
            .on('highlightRoute', this._highlightRoute, this)
            .on('highlightStep', this._highlightStep, this);
    },

    onRemove: function() {
        this._directions
            .off('origin', this._origin, this)
            .off('destination', this._destination, this)
            .off('load', this._load, this)
            .off('unload', this._unload, this)
            .off('selectRoute', this._selectRoute, this)
            .off('selectTrack', this._selectTrack, this)
            .off('highlightRoute', this._highlightRoute, this)
            .off('highlightStep', this._highlightStep, this);

        this._map
            .off('click', this._click, this)
            .off('mousemove', this._mousemove, this);

        L.LayerGroup.prototype.onRemove.apply(this, arguments);
    },

    _click: function(e) {
        if (!this._directions.getOrigin()) {
            this._directions.setOrigin(e.latlng);
        } else if (!this._directions.getDestination()) {
            this._directions.setDestination(e.latlng);
        }

        //if (this._directions.queryable()) {
            //this._directions.query();
        //}
    },

    _mousemove: function(e) {
        if (!this.routeLayer || !this.hasLayer(this.routeLayer) || this._currentWaypoint !== undefined) {
            return;
        }

        var p = this._routePolyline().closestLayerPoint(e.layerPoint);

        if (!p || p.distance > 15) {
            return this.removeLayer(this.dragMarker);
        }

        var m = this._map.project(e.latlng),
            o = this._map.project(this.originMarker.getLatLng()),
            d = this._map.project(this.destinationMarker.getLatLng());

        if (o.distanceTo(m) < 15 || d.distanceTo(m) < 15) {
            return this.removeLayer(this.dragMarker);
        }

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var w = this._map.project(this.waypointMarkers[i].getLatLng());
            if (i !== this._currentWaypoint && w.distanceTo(m) < 15) {
                return this.removeLayer(this.dragMarker);
            }
        }

        this.dragMarker.setLatLng(this._map.layerPointToLatLng(p));
        this.addLayer(this.dragMarker);
    },

    _origin: function(e) {
        if (e.origin && e.origin.geometry.coordinates) {
            this.originMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.origin.geometry.coordinates));
            this.addLayer(this.originMarker);
        } else {
            this.removeLayer(this.originMarker);
        }
    },

    _destination: function(e) {
        if (e.destination && e.destination.geometry.coordinates) {
            this.destinationMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.destination.geometry.coordinates));
            this.addLayer(this.destinationMarker);
        } else {
            this.removeLayer(this.destinationMarker);
        }
    },

    _dragStart: function(e) {
        if (e.target === this.dragMarker) {
            this._currentWaypoint = this._findWaypointIndex(e.target.getLatLng());
            this._directions.addWaypoint(this._currentWaypoint, e.target.getLatLng());
        } else {
            this._currentWaypoint = this.waypointMarkers.indexOf(e.target);
        }
    },

    _drag: function(e) {
        var latLng = e.target.getLatLng();

        if (e.target === this.originMarker) {
            this._directions.setOrigin(latLng);
        } else if (e.target === this.destinationMarker) {
            this._directions.setDestination(latLng);
        } else {
            this._directions.setWaypoint(this._currentWaypoint, latLng);
        }

        if (this._directions.queryable()) {
            this._directions.query();
        }
    },

    _dragEnd: function() {
        this._currentWaypoint = undefined;
    },

    _removeWaypoint: function(e) {
        this._directions.removeWaypoint(this.waypointMarkers.indexOf(e.target)).query();
    },

    _load: function(e) {
        this._origin(e);
        this._destination(e);

        function waypointLatLng(i) {
            return L.GeoJSON.coordsToLatLng(e.waypoints[i].geometry.coordinates);
        }

        var l = Math.min(this.waypointMarkers.length, e.waypoints.length),
            i = 0;

        // Update existing
        for (; i < l; i++) {
            this.waypointMarkers[i].setLatLng(waypointLatLng(i));
        }

        // Add new
        for (; i < e.waypoints.length; i++) {
            var waypointMarker = L.marker(waypointLatLng(i), {
                draggable: !this.options.readonly,
                icon: this._waypointIcon()
            });

            waypointMarker
                .on('click', this._removeWaypoint, this)
                .on('dragstart', this._dragStart, this)
                .on('drag', this._drag, this)
                .on('dragend', this._dragEnd, this);

            this.waypointMarkers.push(waypointMarker);
            this.addLayer(waypointMarker);
        }

        // Remove old
        for (; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }

        this.waypointMarkers.length = e.waypoints.length;
    },

    _unload: function() {
        this.removeLayer(this.routeLayer);
        this.removeLayer(this.trackLayer);
        for (var i = 0; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }
    },

    _selectRoute: function(e) {
        this.routeLayer
            .clearLayers()
            .setGeoJSON(e.route.geometry);
        this.addLayer(this.routeLayer);
    },

    _selectTrack: function(e) {
        this.trackLayer
            .clearLayers()
            .setGeoJSON(e.track);
        this.addLayer(this.trackLayer);
        this.removeLayer(this.routeLayer);
    },

    _highlightRoute: function(e) {
        if (e.route) {
            this.routeHighlightLayer
                .clearLayers()
                .setGeoJSON(e.route.geometry);
            this.addLayer(this.routeHighlightLayer);
        } else {
            this.removeLayer(this.routeHighlightLayer);
        }
    },

    _highlightStep: function(e) {
        if (e.step && e.step.loc) {
            this.stepMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.step.loc));
            this.addLayer(this.stepMarker);
        } else {
            this.removeLayer(this.stepMarker);
        }
    },

    _routePolyline: function() {
        return this.routeLayer.getLayers()[0];
    },

    _findWaypointIndex: function(latLng) {
        var segment = this._findNearestRouteSegment(latLng);

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var s = this._findNearestRouteSegment(this.waypointMarkers[i].getLatLng());
            if (s > segment) {
                return i;
            }
        }

        return this.waypointMarkers.length;
    },

    _findNearestRouteSegment: function(latLng) {
        var min = Infinity,
            index,
            p = this._map.latLngToLayerPoint(latLng),
            positions = this._routePolyline()._originalPoints;

        for (var i = 1; i < positions.length; i++) {
            var d = L.LineUtil._sqClosestPointOnSegment(p, positions[i - 1], positions[i], true);
            if (d < min) {
                min = d;
                index = i;
            }
        }

        return index;
    },

    _waypointIcon: function() {
        return L.divIcon({
            className: 'mapbox-marker-drag-icon',
            iconSize: new L.Point(12, 12)
        });
    }
});

module.exports = function(directions, options) {
    return new Layer(directions, options);
};

},{"debounce":5}],14:[function(require,module,exports){
/* @flow */
var dom = document; // this to claim that we use the dom api, not representative of the page document

var PagingControl = function(
    element /*: Element */ ,
    options /*: ?Object */
) {
    this.element = element;

    options = options || {};
    options.displayed = options.displayed || 10;
    options.total = options.total || 10;

    this.update(options);
    this.selected = 1;

    // set empty event handlers
    this.onSelected(function() {});
};

PagingControl.prototype.clear = function() {
    Array.prototype.forEach.call(
        this.element.querySelectorAll('a[rel=page]'),
        function(node) {
            node.remove();
        }
    );
};

var calcRange = function(focus, displayed, total) {
    var half = Math.floor(displayed / 2);
    var pageMax = Math.min(total, displayed);
    if (focus - half < 1) {
        return {
            start: 1,
            end: pageMax
        };
    }
    if (focus + half > total) {
        return {
            start: total - displayed + 1,
            end: total
        };
    }
    return {
        start: focus - half,
        end: focus + half
    };
};

PagingControl.prototype.onSelected = function(handler) {
    var self = this;
    var displayed = this.options.displayed;

    this.onSelectedHandler = function(pageNo) {
        self.clear();
        var range = calcRange(pageNo, displayed, self.options.total);
        self.renderPages(range.start, range.end, pageNo);
        return handler(pageNo);
    };
};

PagingControl.prototype.renderPages = function(start, end, selected) {
    var self = this;
    var genHandler = function(pageNo) {
        return function() {
            self.onSelectedHandler(pageNo);
        };
    };

    for (var i = start; i <= end; i++) {
        var page = document.createElement('a');
        page.addEventListener('click', genHandler(i));
        page.rel = 'page';
        page.href = '#';
        page.textContent = i;
        if (i === selected) {
            page.classList.add('selected');
        }

        this.element.appendChild(page);
    }
};

PagingControl.prototype.update = function(options) {
    this.clear();
    this.options = options;
    this.renderPages(1, Math.min(options.total, options.displayed), 1);
};

module.exports = PagingControl;

},{}],15:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map, selection = 0;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-routes', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('load', function (e) {
        container.html('');

        var routes = container.append('ul')
            .selectAll('li')
            .data(e.routes)
            .enter().append('li')
            .attr('class', 'mapbox-directions-route');

        routes.append('div')
            .attr('class','mapbox-directions-route-heading')
            .text(function (route) { return 'Route ' + (e.routes.indexOf(route) + 1); });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-summary')
            .text(function (route) { return route.summary; });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-details')
            .text(function (route) {
                return format[directions.options.units](route.distance) + ', ' + format.duration(route.duration);
            });

        routes.on('mouseover', function (route) {
            directions.highlightRoute(route);
        });

        routes.on('mouseout', function () {
            directions.highlightRoute(null);
        });

        routes.on('click', function (route) {
            directions.selectRoute(route);
        });

        directions.selectRoute(e.routes[0]);
    });

    directions.on('selectRoute', function (e) {
        container.selectAll('.mapbox-directions-route')
            .classed('mapbox-directions-route-active', function (route) { return route === e.route; });
    });

    return control;
};

},{"../lib/d3":2,"./format":9}],16:[function(require,module,exports){
/* @flow */

var renderRow = function(container, data) {
    var row = container.insertRow();
    data.forEach(function(str) {
        var cell = row.insertCell();
        cell.textContent = str;
    });
    return row;
};

var renderHeader = function(container, data) {
    var row = container.insertRow();
    data.forEach(function(str) {
        var th = document.createElement('th');
        th.innerHTML = str;
        row.appendChild(th);
    });
    return row;
};

var TableControl = function(
    element /*: Object */, /* TableElement */
    headers /*: [string] */,
    model /*: ?[[string]] */
) {
    renderHeader(element.createTHead(), headers);
    this.tbody = element.createTBody();
    this.bind(model || []);
};

TableControl.prototype.clear = function() {
    while (this.tbody.hasChildNodes()) {   
        this.tbody.removeChild(this.tbody.firstChild);
    }
};

TableControl.prototype.onSelected = function(handler) {
    this.onSelectedHandler = handler;
};

TableControl.prototype.bind = function(model) {
    this.clear();
    // deal with closure
    var self = this;
    model.forEach(function(data) {
        var row = renderRow(self.tbody, data);
        row.addEventListener('click', function() {
            if (self.onSelectedHandler) {
                self.onSelectedHandler(data);
            }
        });
    });
};

module.exports = TableControl;

},{}],17:[function(require,module,exports){
'use strict';

var tableControl = require('./table_control.js'), 
    pagingControl = require('./paging_control.js');

module.exports = function(container, directions) {
    var control = {}, map;
    var origChange = false, destChange = false;
    var TRACKINFO_API_URL = "https://luliu.me/tracks/api/v1/trackinfo";
    var TRACK_API_URL = "https://luliu.me/tracks/api/v1/tracks";

    control.addTo = function(_) {
        map = _;
        return control;
    };

    // get page 1 of trackinfo as init data for the table
    // Web browser compatibility:
    // for IE7+, Firefox, Chrome, Opera, Safari
    container = document.getElementById(container);
    container.insertAdjacentHTML('afterbegin', '<table id="tracks-table" class="prose air-tracks"></table>');
    container.insertAdjacentHTML('beforeend', '<div id="paging" data-control="paging"></div>');

    var trackinfoKeys = [
        'ID', 'Segments', '2D length', '3D length', 'Moving time', 'Stopped time', 
        'Max speed', 'Uphill', 'Downhill', 'Started at', 'Ended at', 'Points', 
        'Start lon', 'Start lat', 'End lon', 'End lat'
    ],
    values = [];
    var page = 1, totalPages = 1, numResults = 1;
    var tc = new tableControl(document.getElementById('tracks-table'), 
            trackinfoKeys, values);
    var pg = new pagingControl(document.getElementById('paging'), 
            {displayed: 0, total: 0});

    var trackinfoXhr = new XMLHttpRequest();
    trackinfoXhr.onreadystatechange = function() {
        if (trackinfoXhr.readyState === 4 && trackinfoXhr.status === 200) {
            var trackinfoData = JSON.parse(trackinfoXhr.responseText);
            totalPages = trackinfoData.total_pages;
            page = trackinfoData.page;
            numResults = trackinfoData.num_results;
            values = [];
            trackinfoData.objects.forEach(function(data) {
                var row = trackinfoKeys.map(function(key) {
                    return data[key];
                });
                values.push(row);
            });
            tc.bind(values);
            pg.update({ displayed: 10, total: totalPages });
        }


    }
    trackinfoXhr.open("GET", TRACKINFO_API_URL, true);
    trackinfoXhr.send();

    tc.onSelected(function(data) {
        var startPos = L.GeoJSON.coordsToLatLng([data[12], data[13]]);
        var endPos = L.GeoJSON.coordsToLatLng([data[14], data[15]]);
        directions.setOrigin(startPos);
        directions.setDestination(endPos);
        var southWest = L.latLng(
                Math.min(startPos.lat, endPos.lat), 
                Math.min(startPos.lng, endPos.lng)),
            northEast = L.latLng(
                Math.max(startPos.lat, endPos.lat),
                Math.max(startPos.lng, endPos.lng)),
            bounds = L.latLngBounds(southWest, northEast);
        map.fitBounds(bounds);
        // Web browser compatibility: 
        // IE7+, Firefox, Chrome, Opera, Safari
        var trackXhr = new XMLHttpRequest();
        trackXhr.onreadystatechange = function() {
            if (trackXhr.readyState === 4 && trackXhr.status === 200) {
                var trackData = JSON.parse(trackXhr.responseText);
                directions.selectTrack(trackData);
            }
        }
        trackXhr.open("GET", TRACK_API_URL + "/" + data[0], true);
        trackXhr.send();
    });

    pg.onSelected(function(pageNo) {
        var pagedTrackinfoXhr = new XMLHttpRequest();
        pagedTrackinfoXhr.onreadystatechange = function() {
            if (pagedTrackinfoXhr.readyState === 4 && pagedTrackinfoXhr.status === 200) {
                var trackinfoData = JSON.parse(pagedTrackinfoXhr.responseText);
                // The following 3 variables can be aquired from the response,
                // but useless for the moment
                //totalPages = trackinfoData.total_pages;
                //page = trackinfoData.page;
                //numResults = trackinfoData.num_results;
                values = [];
                trackinfoData.objects.forEach(function(data) {
                    var row = trackinfoKeys.map(function(key) {
                        return data[key];
                    });
                    values.push(row);
                });
                tc.bind(values);
            }
        }
        pagedTrackinfoXhr.open("GET", TRACKINFO_API_URL + "?page=" + pageNo, true);
        pagedTrackinfoXhr.send();
    });

    return control;
};

},{"./paging_control.js":14,"./table_control.js":16}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9pbmRleC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9saWIvZDMuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvbm9kZV9tb2R1bGVzL0BtYXBib3gvY29yc2xpdGUvY29yc2xpdGUuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvbm9kZV9tb2R1bGVzL0BtYXBib3gvcG9seWxpbmUvc3JjL3BvbHlsaW5lLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL25vZGVfbW9kdWxlcy9kZWJvdW5jZS9pbmRleC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9ub2RlX21vZHVsZXMvcXVldWUtYXN5bmMvYnVpbGQvcXVldWUuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2RpcmVjdGlvbnMuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2Vycm9yc19jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9mb3JtYXQuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2dldF9yZXF1ZXN0LmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9pbnB1dF9jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9pbnN0cnVjdGlvbnNfY29udHJvbC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9zcmMvbGF5ZXIuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL3BhZ2luZ19jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9yb3V0ZXNfY29udHJvbC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9zcmMvdGFibGVfY29udHJvbC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9zcmMvdHJhY2tzX2NvbnRyb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1aENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmlmICghTC5tYXBib3gpIHRocm93IG5ldyBFcnJvcignaW5jbHVkZSBtYXBib3guanMgYmVmb3JlIGFpci5qcycpO1xuXG5MLmFpciA9IHJlcXVpcmUoJy4vc3JjL2RpcmVjdGlvbnMnKTtcbkwuYWlyLmZvcm1hdCA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdCcpO1xuTC5haXIubGF5ZXIgPSByZXF1aXJlKCcuL3NyYy9sYXllcicpO1xuTC5haXIuaW5wdXRDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvaW5wdXRfY29udHJvbCcpO1xuTC5haXIuZXJyb3JzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2Vycm9yc19jb250cm9sJyk7XG5MLmFpci5yb3V0ZXNDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvcm91dGVzX2NvbnRyb2wnKTtcbkwuYWlyLmluc3RydWN0aW9uc0NvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9pbnN0cnVjdGlvbnNfY29udHJvbCcpO1xuTC5haXIudHJhY2tzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL3RyYWNrc19jb250cm9sLmpzJyk7XG4iLCIhZnVuY3Rpb24oKXtcbiAgdmFyIGQzID0ge3ZlcnNpb246IFwiMy40LjFcIn07IC8vIHNlbXZlclxudmFyIGQzX2FycmF5U2xpY2UgPSBbXS5zbGljZSxcbiAgICBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHsgcmV0dXJuIGQzX2FycmF5U2xpY2UuY2FsbChsaXN0KTsgfTsgLy8gY29udmVyc2lvbiBmb3IgTm9kZUxpc3RzXG5cbnZhciBkM19kb2N1bWVudCA9IGRvY3VtZW50LFxuICAgIGQzX2RvY3VtZW50RWxlbWVudCA9IGQzX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICBkM193aW5kb3cgPSB3aW5kb3c7XG5cbi8vIFJlZGVmaW5lIGQzX2FycmF5IGlmIHRoZSBicm93c2VyIGRvZXNu4oCZdCBzdXBwb3J0IHNsaWNlLWJhc2VkIGNvbnZlcnNpb24uXG50cnkge1xuICBkM19hcnJheShkM19kb2N1bWVudEVsZW1lbnQuY2hpbGROb2RlcylbMF0ubm9kZVR5cGU7XG59IGNhdGNoKGUpIHtcbiAgZDNfYXJyYXkgPSBmdW5jdGlvbihsaXN0KSB7XG4gICAgdmFyIGkgPSBsaXN0Lmxlbmd0aCwgYXJyYXkgPSBuZXcgQXJyYXkoaSk7XG4gICAgd2hpbGUgKGktLSkgYXJyYXlbaV0gPSBsaXN0W2ldO1xuICAgIHJldHVybiBhcnJheTtcbiAgfTtcbn1cbnZhciBkM19zdWJjbGFzcyA9IHt9Ll9fcHJvdG9fXz9cblxuLy8gVW50aWwgRUNNQVNjcmlwdCBzdXBwb3J0cyBhcnJheSBzdWJjbGFzc2luZywgcHJvdG90eXBlIGluamVjdGlvbiB3b3JrcyB3ZWxsLlxuZnVuY3Rpb24ob2JqZWN0LCBwcm90b3R5cGUpIHtcbiAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbn06XG5cbi8vIEFuZCBpZiB5b3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IF9fcHJvdG9fXywgd2UnbGwgdXNlIGRpcmVjdCBleHRlbnNpb24uXG5mdW5jdGlvbihvYmplY3QsIHByb3RvdHlwZSkge1xuICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm90b3R5cGUpIG9iamVjdFtwcm9wZXJ0eV0gPSBwcm90b3R5cGVbcHJvcGVydHldO1xufTtcblxuZnVuY3Rpb24gZDNfdmVuZG9yU3ltYm9sKG9iamVjdCwgbmFtZSkge1xuICBpZiAobmFtZSBpbiBvYmplY3QpIHJldHVybiBuYW1lO1xuICBuYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEpO1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGQzX3ZlbmRvclByZWZpeGVzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIHZhciBwcmVmaXhOYW1lID0gZDNfdmVuZG9yUHJlZml4ZXNbaV0gKyBuYW1lO1xuICAgIGlmIChwcmVmaXhOYW1lIGluIG9iamVjdCkgcmV0dXJuIHByZWZpeE5hbWU7XG4gIH1cbn1cblxudmFyIGQzX3ZlbmRvclByZWZpeGVzID0gW1wid2Via2l0XCIsIFwibXNcIiwgXCJtb3pcIiwgXCJNb3pcIiwgXCJvXCIsIFwiT1wiXTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uKGdyb3Vwcykge1xuICBkM19zdWJjbGFzcyhncm91cHMsIGQzX3NlbGVjdGlvblByb3RvdHlwZSk7XG4gIHJldHVybiBncm91cHM7XG59XG5cbnZhciBkM19zZWxlY3QgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBuLnF1ZXJ5U2VsZWN0b3Iocyk7IH0sXG4gICAgZDNfc2VsZWN0QWxsID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gbi5xdWVyeVNlbGVjdG9yQWxsKHMpOyB9LFxuICAgIGQzX3NlbGVjdE1hdGNoZXIgPSBkM19kb2N1bWVudEVsZW1lbnRbZDNfdmVuZG9yU3ltYm9sKGQzX2RvY3VtZW50RWxlbWVudCwgXCJtYXRjaGVzU2VsZWN0b3JcIildLFxuICAgIGQzX3NlbGVjdE1hdGNoZXMgPSBmdW5jdGlvbihuLCBzKSB7IHJldHVybiBkM19zZWxlY3RNYXRjaGVyLmNhbGwobiwgcyk7IH07XG5cbi8vIFByZWZlciBTaXp6bGUsIGlmIGF2YWlsYWJsZS5cbmlmICh0eXBlb2YgU2l6emxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgZDNfc2VsZWN0ID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gU2l6emxlKHMsIG4pWzBdIHx8IG51bGw7IH07XG4gIGQzX3NlbGVjdEFsbCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIFNpenpsZS51bmlxdWVTb3J0KFNpenpsZShzLCBuKSk7IH07XG4gIGQzX3NlbGVjdE1hdGNoZXMgPSBTaXp6bGUubWF0Y2hlc1NlbGVjdG9yO1xufVxuXG5kMy5zZWxlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvblJvb3Q7XG59O1xuXG52YXIgZDNfc2VsZWN0aW9uUHJvdG90eXBlID0gZDMuc2VsZWN0aW9uLnByb3RvdHlwZSA9IFtdO1xuXG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIHN1Ym5vZGUsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSAoZ3JvdXAgPSB0aGlzW2pdKS5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChzdWJub2RlID0gc2VsZWN0b3IuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgIGlmIChzdWJub2RlICYmIFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdChzZWxlY3RvciwgdGhpcyk7XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3RBbGwgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IGQzX2FycmF5KHNlbGVjdG9yLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpKTtcbiAgICAgICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yQWxsKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdEFsbChzZWxlY3RvciwgdGhpcyk7XG4gIH07XG59XG52YXIgZDNfbnNQcmVmaXggPSB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuXG5kMy5ucyA9IHtcbiAgcHJlZml4OiBkM19uc1ByZWZpeCxcbiAgcXVhbGlmeTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gbmFtZS5pbmRleE9mKFwiOlwiKSxcbiAgICAgICAgcHJlZml4ID0gbmFtZTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBpKTtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZyhpICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBkM19uc1ByZWZpeC5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpXG4gICAgICAgID8ge3NwYWNlOiBkM19uc1ByZWZpeFtwcmVmaXhdLCBsb2NhbDogbmFtZX1cbiAgICAgICAgOiBuYW1lO1xuICB9XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXG4gICAgLy8gRm9yIGF0dHIoc3RyaW5nKSwgcmV0dXJuIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpO1xuICAgICAgcmV0dXJuIG5hbWUubG9jYWxcbiAgICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbClcbiAgICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgIH1cblxuICAgIC8vIEZvciBhdHRyKG9iamVjdCksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBuYW1lcyBhbmQgdmFsdWVzIG9mIHRoZVxuICAgIC8vIGF0dHJpYnV0ZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmUgZnVuY3Rpb25zIHRoYXQgYXJlXG4gICAgLy8gZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuXG4gICAgZm9yICh2YWx1ZSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2F0dHIodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9hdHRyKG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fYXR0cihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gZDMubnMucXVhbGlmeShuYW1lKTtcblxuICAvLyBGb3IgYXR0cihzdHJpbmcsIG51bGwpLCByZW1vdmUgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gYXR0ck51bGwoKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gYXR0ck51bGxOUygpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICB9XG5cbiAgLy8gRm9yIGF0dHIoc3RyaW5nLCBzdHJpbmcpLCBzZXQgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gYXR0ckNvbnN0YW50KCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBhdHRyQ29uc3RhbnROUygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIEZvciBhdHRyKHN0cmluZywgZnVuY3Rpb24pLCBldmFsdWF0ZSB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kIHNldFxuICAvLyBvciByZW1vdmUgdGhlIGF0dHJpYnV0ZSBhcyBhcHByb3ByaWF0ZS5cbiAgZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHgpO1xuICB9XG4gIGZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB4KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IChuYW1lLmxvY2FsID8gYXR0ck51bGxOUyA6IGF0dHJOdWxsKSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAobmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAobmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KSk7XG59XG5mdW5jdGlvbiBkM19jb2xsYXBzZShzKSB7XG4gIHJldHVybiBzLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbn1cbmQzLnJlcXVvdGUgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzLnJlcGxhY2UoZDNfcmVxdW90ZV9yZSwgXCJcXFxcJCZcIik7XG59O1xuXG52YXIgZDNfcmVxdW90ZV9yZSA9IC9bXFxcXFxcXlxcJFxcKlxcK1xcP1xcfFxcW1xcXVxcKFxcKVxcLlxce1xcfV0vZztcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNsYXNzZWQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblxuICAgIC8vIEZvciBjbGFzc2VkKHN0cmluZyksIHJldHVybiB0cnVlIG9ubHkgaWYgdGhlIGZpcnN0IG5vZGUgaGFzIHRoZSBzcGVjaWZpZWRcbiAgICAvLyBjbGFzcyBvciBjbGFzc2VzLiBOb3RlIHRoYXQgZXZlbiBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBET01Ub2tlbkxpc3QsIGl0XG4gICAgLy8gcHJvYmFibHkgZG9lc24ndCBzdXBwb3J0IGl0IG9uIFNWRyBlbGVtZW50cyAod2hpY2ggY2FuIGJlIGFuaW1hdGVkKS5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCksXG4gICAgICAgICAgbiA9IChuYW1lID0gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkpLmxlbmd0aCxcbiAgICAgICAgICBpID0gLTE7XG4gICAgICBpZiAodmFsdWUgPSBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCF2YWx1ZS5jb250YWlucyhuYW1lW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWVbaV0pLnRlc3QodmFsdWUpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGb3IgY2xhc3NlZChvYmplY3QpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgbmFtZXMgb2YgY2xhc3NlcyB0byBhZGQgb3JcbiAgICAvLyByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlIGZ1bmN0aW9ucyB0aGF0IGFyZSBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fY2xhc3NlZCh2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYm90aCBhIG5hbWUgYW5kIGEgdmFsdWUgYXJlIHNwZWNpZmllZCwgYW5kIGFyZSBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoPzpefFxcXFxzKylcIiArIGQzLnJlcXVvdGUobmFtZSkgKyBcIig/OlxcXFxzK3wkKVwiLCBcImdcIik7XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VzKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuLy8gTXVsdGlwbGUgY2xhc3MgbmFtZXMgYXJlIGFsbG93ZWQgKGUuZy4sIFwiZm9vIGJhclwiKS5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBkM19zZWxlY3Rpb25fY2xhc3NlcyhuYW1lKS5tYXAoZDNfc2VsZWN0aW9uX2NsYXNzZWROYW1lKTtcbiAgdmFyIG4gPSBuYW1lLmxlbmd0aDtcblxuICBmdW5jdGlvbiBjbGFzc2VkQ29uc3RhbnQoKSB7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB3aGlsZSAoKytpIDwgbikgbmFtZVtpXSh0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCB0aGUgZnVuY3Rpb24gaXMgc3RpbGwgZXZhbHVhdGVkIG9ubHkgb25jZSBwZXJcbiAgLy8gZWxlbWVudCBldmVuIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjbGFzcyBuYW1lcy5cbiAgZnVuY3Rpb24gY2xhc3NlZEZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gLTEsIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHgpO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvblxuICAgICAgOiBjbGFzc2VkQ29uc3RhbnQ7XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkTmFtZShuYW1lKSB7XG4gIHZhciByZSA9IGQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZSk7XG4gIHJldHVybiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgIGlmIChjID0gbm9kZS5jbGFzc0xpc3QpIHJldHVybiB2YWx1ZSA/IGMuYWRkKG5hbWUpIDogYy5yZW1vdmUobmFtZSk7XG4gICAgdmFyIGMgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCI7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgICAgaWYgKCFyZS50ZXN0KGMpKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGQzX2NvbGxhcHNlKGMgKyBcIiBcIiArIG5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBkM19jb2xsYXBzZShjLnJlcGxhY2UocmUsIFwiIFwiKSkpO1xuICAgIH1cbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnN0eWxlID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKG4gPCAzKSB7XG5cbiAgICAvLyBGb3Igc3R5bGUob2JqZWN0KSBvciBzdHlsZShvYmplY3QsIHN0cmluZyksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZVxuICAgIC8vIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlIGF0dHJpYnV0ZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmVcbiAgICAvLyBmdW5jdGlvbnMgdGhhdCBhcmUgZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuIFRoZSBvcHRpb25hbCBzdHJpbmdcbiAgICAvLyBzcGVjaWZpZXMgdGhlIHByaW9yaXR5LlxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKG4gPCAyKSB2YWx1ZSA9IFwiXCI7XG4gICAgICBmb3IgKHByaW9yaXR5IGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fc3R5bGUocHJpb3JpdHksIG5hbWVbcHJpb3JpdHldLCB2YWx1ZSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRm9yIHN0eWxlKHN0cmluZyksIHJldHVybiB0aGUgY29tcHV0ZWQgc3R5bGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmIChuIDwgMikgcmV0dXJuIGQzX3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMubm9kZSgpLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xuXG4gICAgLy8gRm9yIHN0eWxlKHN0cmluZywgc3RyaW5nKSBvciBzdHlsZShzdHJpbmcsIGZ1bmN0aW9uKSwgdXNlIHRoZSBkZWZhdWx0XG4gICAgLy8gcHJpb3JpdHkuIFRoZSBwcmlvcml0eSBpcyBpZ25vcmVkIGZvciBzdHlsZShzdHJpbmcsIG51bGwpLlxuICAgIHByaW9yaXR5ID0gXCJcIjtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYSBuYW1lLCB2YWx1ZSBhbmQgcHJpb3JpdHkgYXJlIHNwZWNpZmllZCwgYW5kIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBudWxsKSBvciBzdHlsZShuYW1lLCBudWxsLCBwcmlvcml0eSksIHJlbW92ZSB0aGUgc3R5bGVcbiAgLy8gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuIFRoZSBwcmlvcml0eSBpcyBpZ25vcmVkLlxuICBmdW5jdGlvbiBzdHlsZU51bGwoKSB7XG4gICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgfVxuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBzdHJpbmcpIG9yIHN0eWxlKG5hbWUsIHN0cmluZywgcHJpb3JpdHkpLCBzZXQgdGhlIHN0eWxlXG4gIC8vIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLCB1c2luZyB0aGUgc3BlY2lmaWVkIHByaW9yaXR5LlxuICBmdW5jdGlvbiBzdHlsZUNvbnN0YW50KCkge1xuICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUsIHByaW9yaXR5KTtcbiAgfVxuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBmdW5jdGlvbikgb3Igc3R5bGUobmFtZSwgZnVuY3Rpb24sIHByaW9yaXR5KSwgZXZhbHVhdGUgdGhlXG4gIC8vIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZCBzZXQgb3IgcmVtb3ZlIHRoZSBzdHlsZSBwcm9wZXJ0eSBhc1xuICAvLyBhcHByb3ByaWF0ZS4gV2hlbiBzZXR0aW5nLCB1c2UgdGhlIHNwZWNpZmllZCBwcmlvcml0eS5cbiAgZnVuY3Rpb24gc3R5bGVGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgeCwgcHJpb3JpdHkpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gc3R5bGVOdWxsIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHN0eWxlRnVuY3Rpb24gOiBzdHlsZUNvbnN0YW50KTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cbiAgICAvLyBGb3IgcHJvcGVydHkoc3RyaW5nKSwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiKSByZXR1cm4gdGhpcy5ub2RlKClbbmFtZV07XG5cbiAgICAvLyBGb3IgcHJvcGVydHkob2JqZWN0KSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlXG4gICAgLy8gcHJvcGVydGllcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZSBmdW5jdGlvbnMgdGhhdCBhcmVcbiAgICAvLyBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fcHJvcGVydHkodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBPdGhlcndpc2UsIGJvdGggYSBuYW1lIGFuZCBhIHZhbHVlIGFyZSBzcGVjaWZpZWQsIGFuZCBhcmUgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fcHJvcGVydHkobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9wcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuXG4gIC8vIEZvciBwcm9wZXJ0eShuYW1lLCBudWxsKSwgcmVtb3ZlIHRoZSBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlOdWxsKCkge1xuICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICB9XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIHN0cmluZyksIHNldCB0aGUgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuXG4gIGZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQoKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIGZ1bmN0aW9uKSwgZXZhbHVhdGUgdGhlIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZFxuICAvLyBzZXQgb3IgcmVtb3ZlIHRoZSBwcm9wZXJ0eSBhcyBhcHByb3ByaWF0ZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgZWxzZSB0aGlzW25hbWVdID0geDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IHByb3BlcnR5TnVsbCA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uIDogcHJvcGVydHlDb25zdGFudCk7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS50ZXh0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGZ1bmN0aW9uKCkgeyB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjsgfSA6IHZhbHVlID09IG51bGxcbiAgICAgID8gZnVuY3Rpb24oKSB7IHRoaXMudGV4dENvbnRlbnQgPSBcIlwiOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7IH0pXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmh0bWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZnVuY3Rpb24oKSB7IHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjsgfSA6IHZhbHVlID09IG51bGxcbiAgICAgID8gZnVuY3Rpb24oKSB7IHRoaXMuaW5uZXJIVE1MID0gXCJcIjsgfVxuICAgICAgOiBmdW5jdGlvbigpIHsgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTsgfSlcbiAgICAgIDogdGhpcy5ub2RlKCkuaW5uZXJIVE1MO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQobmFtZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY3JlYXRvcihuYW1lKSB7XG4gIHJldHVybiB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZVxuICAgICAgOiAobmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSkpLmxvY2FsID8gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5hbWVzcGFjZVVSSSwgbmFtZSk7IH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICBiZWZvcmUgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShuYW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIGJlZm9yZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn07XG5cbi8vIFRPRE8gcmVtb3ZlKHNlbGVjdG9yKT9cbi8vIFRPRE8gcmVtb3ZlKG5vZGUpP1xuLy8gVE9ETyByZW1vdmUoZnVuY3Rpb24pP1xuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICB9KTtcbn07XG5mdW5jdGlvbiBkM19jbGFzcyhjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdG9yLnByb3RvdHlwZSwga2V5LCB7XG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzW2tleV0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjdG9yLnByb3RvdHlwZSA9IHByb3BlcnRpZXM7XG4gIH1cbn1cblxuZDMubWFwID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBtYXAgPSBuZXcgZDNfTWFwO1xuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgZDNfTWFwKSBvYmplY3QuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7IG1hcC5zZXQoa2V5LCB2YWx1ZSk7IH0pO1xuICBlbHNlIGZvciAodmFyIGtleSBpbiBvYmplY3QpIG1hcC5zZXQoa2V5LCBvYmplY3Rba2V5XSk7XG4gIHJldHVybiBtYXA7XG59O1xuXG5mdW5jdGlvbiBkM19NYXAoKSB7fVxuXG5kM19jbGFzcyhkM19NYXAsIHtcbiAgaGFzOiBkM19tYXBfaGFzLFxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0aGlzW2QzX21hcF9wcmVmaXggKyBrZXldO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpc1tkM19tYXBfcHJlZml4ICsga2V5XSA9IHZhbHVlO1xuICB9LFxuICByZW1vdmU6IGQzX21hcF9yZW1vdmUsXG4gIGtleXM6IGQzX21hcF9rZXlzLFxuICB2YWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyB2YWx1ZXMucHVzaCh2YWx1ZSk7IH0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0sXG4gIGVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbnRyaWVzID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgZW50cmllcy5wdXNoKHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlfSk7IH0pO1xuICAgIHJldHVybiBlbnRyaWVzO1xuICB9LFxuICBzaXplOiBkM19tYXBfc2l6ZSxcbiAgZW1wdHk6IGQzX21hcF9lbXB0eSxcbiAgZm9yRWFjaDogZnVuY3Rpb24oZikge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSBmLmNhbGwodGhpcywga2V5LnN1YnN0cmluZygxKSwgdGhpc1trZXldKTtcbiAgfVxufSk7XG5cbnZhciBkM19tYXBfcHJlZml4ID0gXCJcXDBcIiwgLy8gcHJldmVudCBjb2xsaXNpb24gd2l0aCBidWlsdC1pbnNcbiAgICBkM19tYXBfcHJlZml4Q29kZSA9IGQzX21hcF9wcmVmaXguY2hhckNvZGVBdCgwKTtcblxuZnVuY3Rpb24gZDNfbWFwX2hhcyhrZXkpIHtcbiAgcmV0dXJuIGQzX21hcF9wcmVmaXggKyBrZXkgaW4gdGhpcztcbn1cblxuZnVuY3Rpb24gZDNfbWFwX3JlbW92ZShrZXkpIHtcbiAga2V5ID0gZDNfbWFwX3ByZWZpeCArIGtleTtcbiAgcmV0dXJuIGtleSBpbiB0aGlzICYmIGRlbGV0ZSB0aGlzW2tleV07XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9rZXlzKCkge1xuICB2YXIga2V5cyA9IFtdO1xuICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7IGtleXMucHVzaChrZXkpOyB9KTtcbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9zaXplKCkge1xuICB2YXIgc2l6ZSA9IDA7XG4gIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSArK3NpemU7XG4gIHJldHVybiBzaXplO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfZW1wdHkoKSB7XG4gIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgdmFyIGkgPSAtMSxcbiAgICAgIG4gPSB0aGlzLmxlbmd0aCxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICAvLyBJZiBubyB2YWx1ZSBpcyBzcGVjaWZpZWQsIHJldHVybiB0aGUgZmlyc3QgdmFsdWUuXG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHZhbHVlID0gbmV3IEFycmF5KG4gPSAoZ3JvdXAgPSB0aGlzWzBdKS5sZW5ndGgpO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHZhbHVlW2ldID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYmluZChncm91cCwgZ3JvdXBEYXRhKSB7XG4gICAgdmFyIGksXG4gICAgICAgIG4gPSBncm91cC5sZW5ndGgsXG4gICAgICAgIG0gPSBncm91cERhdGEubGVuZ3RoLFxuICAgICAgICBuMCA9IE1hdGgubWluKG4sIG0pLFxuICAgICAgICB1cGRhdGVOb2RlcyA9IG5ldyBBcnJheShtKSxcbiAgICAgICAgZW50ZXJOb2RlcyA9IG5ldyBBcnJheShtKSxcbiAgICAgICAgZXhpdE5vZGVzID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBub2RlLFxuICAgICAgICBub2RlRGF0YTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciBub2RlQnlLZXlWYWx1ZSA9IG5ldyBkM19NYXAsXG4gICAgICAgICAgZGF0YUJ5S2V5VmFsdWUgPSBuZXcgZDNfTWFwLFxuICAgICAgICAgIGtleVZhbHVlcyA9IFtdLFxuICAgICAgICAgIGtleVZhbHVlO1xuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIHtcbiAgICAgICAga2V5VmFsdWUgPSBrZXkuY2FsbChub2RlID0gZ3JvdXBbaV0sIG5vZGUuX19kYXRhX18sIGkpO1xuICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICAgIGV4aXROb2Rlc1tpXSA9IG5vZGU7IC8vIGR1cGxpY2F0ZSBzZWxlY3Rpb24ga2V5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlWYWx1ZXMucHVzaChrZXlWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBtOykge1xuICAgICAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKGdyb3VwRGF0YSwgbm9kZURhdGEgPSBncm91cERhdGFbaV0sIGkpO1xuICAgICAgICBpZiAobm9kZSA9IG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZSkpIHtcbiAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IG5vZGVEYXRhO1xuICAgICAgICB9IGVsc2UgaWYgKCFkYXRhQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7IC8vIG5vIGR1cGxpY2F0ZSBkYXRhIGtleVxuICAgICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUobm9kZURhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGRhdGFCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZURhdGEpO1xuICAgICAgICBub2RlQnlLZXlWYWx1ZS5yZW1vdmUoa2V5VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIHtcbiAgICAgICAgaWYgKG5vZGVCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG4wOykge1xuICAgICAgICBub2RlID0gZ3JvdXBbaV07XG4gICAgICAgIG5vZGVEYXRhID0gZ3JvdXBEYXRhW2ldO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIG5vZGUuX19kYXRhX18gPSBub2RlRGF0YTtcbiAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShub2RlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoOyBpIDwgbTsgKytpKSB7XG4gICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUoZ3JvdXBEYXRhW2ldKTtcbiAgICAgIH1cbiAgICAgIGZvciAoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGV4aXROb2Rlc1tpXSA9IGdyb3VwW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyTm9kZXMudXBkYXRlXG4gICAgICAgID0gdXBkYXRlTm9kZXM7XG5cbiAgICBlbnRlck5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSB1cGRhdGVOb2Rlcy5wYXJlbnROb2RlXG4gICAgICAgID0gZXhpdE5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSBncm91cC5wYXJlbnROb2RlO1xuXG4gICAgZW50ZXIucHVzaChlbnRlck5vZGVzKTtcbiAgICB1cGRhdGUucHVzaCh1cGRhdGVOb2Rlcyk7XG4gICAgZXhpdC5wdXNoKGV4aXROb2Rlcyk7XG4gIH1cblxuICB2YXIgZW50ZXIgPSBkM19zZWxlY3Rpb25fZW50ZXIoW10pLFxuICAgICAgdXBkYXRlID0gZDNfc2VsZWN0aW9uKFtdKSxcbiAgICAgIGV4aXQgPSBkM19zZWxlY3Rpb24oW10pO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBiaW5kKGdyb3VwID0gdGhpc1tpXSwgdmFsdWUuY2FsbChncm91cCwgZ3JvdXAucGFyZW50Tm9kZS5fX2RhdGFfXywgaSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgYmluZChncm91cCA9IHRoaXNbaV0sIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUuZW50ZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGVudGVyOyB9O1xuICB1cGRhdGUuZXhpdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhpdDsgfTtcbiAgcmV0dXJuIHVwZGF0ZTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9kYXRhTm9kZShkYXRhKSB7XG4gIHJldHVybiB7X19kYXRhX186IGRhdGF9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZGF0dW0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiKTtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgdmFyIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09IFwiZnVuY3Rpb25cIikgZmlsdGVyID0gZDNfc2VsZWN0aW9uX2ZpbHRlcihmaWx0ZXIpO1xuXG4gIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBzdWJncm91cC5wYXJlbnROb2RlID0gKGdyb3VwID0gdGhpc1tqXSkucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIGZpbHRlci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2ZpbHRlcihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdE1hdGNoZXModGhpcywgc2VsZWN0b3IpO1xuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUub3JkZXIgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gZ3JvdXAubGVuZ3RoIC0gMSwgbmV4dCA9IGdyb3VwW2ldLCBub2RlOyAtLWkgPj0gMDspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgaWYgKG5leHQgJiYgbmV4dCAhPT0gbm9kZS5uZXh0U2libGluZykgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcbmQzLmFzY2VuZGluZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gIGNvbXBhcmF0b3IgPSBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB0aGlzW2pdLnNvcnQoY29tcGFyYXRvcik7XG4gIHJldHVybiB0aGlzLm9yZGVyKCk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IoY29tcGFyYXRvcikge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIGNvbXBhcmF0b3IgPSBkMy5hc2NlbmRpbmc7XG4gIHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmF0b3IoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9O1xufVxuZnVuY3Rpb24gZDNfbm9vcCgpIHt9XG5cbmQzLmRpc3BhdGNoID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkaXNwYXRjaCA9IG5ldyBkM19kaXNwYXRjaCxcbiAgICAgIGkgPSAtMSxcbiAgICAgIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgZGlzcGF0Y2hbYXJndW1lbnRzW2ldXSA9IGQzX2Rpc3BhdGNoX2V2ZW50KGRpc3BhdGNoKTtcbiAgcmV0dXJuIGRpc3BhdGNoO1xufTtcblxuZnVuY3Rpb24gZDNfZGlzcGF0Y2goKSB7fVxuXG5kM19kaXNwYXRjaC5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgaSA9IHR5cGUuaW5kZXhPZihcIi5cIiksXG4gICAgICBuYW1lID0gXCJcIjtcblxuICAvLyBFeHRyYWN0IG9wdGlvbmFsIG5hbWVzcGFjZSwgZS5nLiwgXCJjbGljay5mb29cIlxuICBpZiAoaSA+PSAwKSB7XG4gICAgbmFtZSA9IHR5cGUuc3Vic3RyaW5nKGkgKyAxKTtcbiAgICB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMCwgaSk7XG4gIH1cblxuICBpZiAodHlwZSkgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgICA/IHRoaXNbdHlwZV0ub24obmFtZSlcbiAgICAgIDogdGhpc1t0eXBlXS5vbihuYW1lLCBsaXN0ZW5lcik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkgZm9yICh0eXBlIGluIHRoaXMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHR5cGUpKSB0aGlzW3R5cGVdLm9uKG5hbWUsIG51bGwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxuZnVuY3Rpb24gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpIHtcbiAgdmFyIGxpc3RlbmVycyA9IFtdLFxuICAgICAgbGlzdGVuZXJCeU5hbWUgPSBuZXcgZDNfTWFwO1xuXG4gIGZ1bmN0aW9uIGV2ZW50KCkge1xuICAgIHZhciB6ID0gbGlzdGVuZXJzLCAvLyBkZWZlbnNpdmUgcmVmZXJlbmNlXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IHoubGVuZ3RoLFxuICAgICAgICBsO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAobCA9IHpbaV0ub24pIGwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH1cblxuICBldmVudC5vbiA9IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIGwgPSBsaXN0ZW5lckJ5TmFtZS5nZXQobmFtZSksXG4gICAgICAgIGk7XG5cbiAgICAvLyByZXR1cm4gdGhlIGN1cnJlbnQgbGlzdGVuZXIsIGlmIGFueVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIGwgJiYgbC5vbjtcblxuICAgIC8vIHJlbW92ZSB0aGUgb2xkIGxpc3RlbmVyLCBpZiBhbnkgKHdpdGggY29weS1vbi13cml0ZSlcbiAgICBpZiAobCkge1xuICAgICAgbC5vbiA9IG51bGw7XG4gICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuc2xpY2UoMCwgaSA9IGxpc3RlbmVycy5pbmRleE9mKGwpKS5jb25jYXQobGlzdGVuZXJzLnNsaWNlKGkgKyAxKSk7XG4gICAgICBsaXN0ZW5lckJ5TmFtZS5yZW1vdmUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBuZXcgbGlzdGVuZXIsIGlmIGFueVxuICAgIGlmIChsaXN0ZW5lcikgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXJCeU5hbWUuc2V0KG5hbWUsIHtvbjogbGlzdGVuZXJ9KSk7XG5cbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5kMy5ldmVudCA9IG51bGw7XG5cbmZ1bmN0aW9uIGQzX2V2ZW50UHJldmVudERlZmF1bHQoKSB7XG4gIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmZ1bmN0aW9uIGQzX2V2ZW50U291cmNlKCkge1xuICB2YXIgZSA9IGQzLmV2ZW50LCBzO1xuICB3aGlsZSAocyA9IGUuc291cmNlRXZlbnQpIGUgPSBzO1xuICByZXR1cm4gZTtcbn1cblxuLy8gTGlrZSBkMy5kaXNwYXRjaCwgYnV0IGZvciBjdXN0b20gZXZlbnRzIGFic3RyYWN0aW5nIG5hdGl2ZSBVSSBldmVudHMuIFRoZXNlXG4vLyBldmVudHMgaGF2ZSBhIHRhcmdldCBjb21wb25lbnQgKHN1Y2ggYXMgYSBicnVzaCksIGEgdGFyZ2V0IGVsZW1lbnQgKHN1Y2ggYXNcbi8vIHRoZSBzdmc6ZyBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGJydXNoKSBhbmQgdGhlIHN0YW5kYXJkIGFyZ3VtZW50cyBgZGAgKHRoZVxuLy8gdGFyZ2V0IGVsZW1lbnQncyBkYXRhKSBhbmQgYGlgICh0aGUgc2VsZWN0aW9uIGluZGV4IG9mIHRoZSB0YXJnZXQgZWxlbWVudCkuXG5mdW5jdGlvbiBkM19ldmVudERpc3BhdGNoKHRhcmdldCkge1xuICB2YXIgZGlzcGF0Y2ggPSBuZXcgZDNfZGlzcGF0Y2gsXG4gICAgICBpID0gMCxcbiAgICAgIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2kgPCBuKSBkaXNwYXRjaFthcmd1bWVudHNbaV1dID0gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpO1xuXG4gIC8vIENyZWF0ZXMgYSBkaXNwYXRjaCBjb250ZXh0IGZvciB0aGUgc3BlY2lmaWVkIGB0aGl6YCAodHlwaWNhbGx5LCB0aGUgdGFyZ2V0XG4gIC8vIERPTSBlbGVtZW50IHRoYXQgcmVjZWl2ZWQgdGhlIHNvdXJjZSBldmVudCkgYW5kIGBhcmd1bWVudHpgICh0eXBpY2FsbHksIHRoZVxuICAvLyBkYXRhIGBkYCBhbmQgaW5kZXggYGlgIG9mIHRoZSB0YXJnZXQgZWxlbWVudCkuIFRoZSByZXR1cm5lZCBmdW5jdGlvbiBjYW4gYmVcbiAgLy8gdXNlZCB0byBkaXNwYXRjaCBhbiBldmVudCB0byBhbnkgcmVnaXN0ZXJlZCBsaXN0ZW5lcnM7IHRoZSBmdW5jdGlvbiB0YWtlcyBhXG4gIC8vIHNpbmdsZSBhcmd1bWVudCBhcyBpbnB1dCwgYmVpbmcgdGhlIGV2ZW50IHRvIGRpc3BhdGNoLiBUaGUgZXZlbnQgbXVzdCBoYXZlXG4gIC8vIGEgXCJ0eXBlXCIgYXR0cmlidXRlIHdoaWNoIGNvcnJlc3BvbmRzIHRvIGEgdHlwZSByZWdpc3RlcmVkIGluIHRoZVxuICAvLyBjb25zdHJ1Y3Rvci4gVGhpcyBjb250ZXh0IHdpbGwgYXV0b21hdGljYWxseSBwb3B1bGF0ZSB0aGUgXCJzb3VyY2VFdmVudFwiIGFuZFxuICAvLyBcInRhcmdldFwiIGF0dHJpYnV0ZXMgb2YgdGhlIGV2ZW50LCBhcyB3ZWxsIGFzIHNldHRpbmcgdGhlIGBkMy5ldmVudGAgZ2xvYmFsXG4gIC8vIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIG5vdGlmaWNhdGlvbi5cbiAgZGlzcGF0Y2gub2YgPSBmdW5jdGlvbih0aGl6LCBhcmd1bWVudHopIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZTEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBlMCA9XG4gICAgICAgIGUxLnNvdXJjZUV2ZW50ID0gZDMuZXZlbnQ7XG4gICAgICAgIGUxLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgZDMuZXZlbnQgPSBlMTtcbiAgICAgICAgZGlzcGF0Y2hbZTEudHlwZV0uYXBwbHkodGhpeiwgYXJndW1lbnR6KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGQzLmV2ZW50ID0gZTA7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gZGlzcGF0Y2g7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKG4gPCAzKSB7XG5cbiAgICAvLyBGb3Igb24ob2JqZWN0KSBvciBvbihvYmplY3QsIGJvb2xlYW4pLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgZXZlbnRcbiAgICAvLyB0eXBlcyBhbmQgbGlzdGVuZXJzIHRvIGFkZCBvciByZW1vdmUuIFRoZSBvcHRpb25hbCBib29sZWFuIHNwZWNpZmllc1xuICAgIC8vIHdoZXRoZXIgdGhlIGxpc3RlbmVyIGNhcHR1cmVzIGV2ZW50cy5cbiAgICBpZiAodHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmIChuIDwgMikgbGlzdGVuZXIgPSBmYWxzZTtcbiAgICAgIGZvciAoY2FwdHVyZSBpbiB0eXBlKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX29uKGNhcHR1cmUsIHR5cGVbY2FwdHVyZV0sIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGb3Igb24oc3RyaW5nKSwgcmV0dXJuIHRoZSBsaXN0ZW5lciBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKG4gPCAyKSByZXR1cm4gKG4gPSB0aGlzLm5vZGUoKVtcIl9fb25cIiArIHR5cGVdKSAmJiBuLl87XG5cbiAgICAvLyBGb3Igb24oc3RyaW5nLCBmdW5jdGlvbiksIHVzZSB0aGUgZGVmYXVsdCBjYXB0dXJlLlxuICAgIGNhcHR1cmUgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYSB0eXBlLCBsaXN0ZW5lciBhbmQgY2FwdHVyZSBhcmUgc3BlY2lmaWVkLCBhbmQgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICB2YXIgbmFtZSA9IFwiX19vblwiICsgdHlwZSxcbiAgICAgIGkgPSB0eXBlLmluZGV4T2YoXCIuXCIpLFxuICAgICAgd3JhcCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyO1xuXG4gIGlmIChpID4gMCkgdHlwZSA9IHR5cGUuc3Vic3RyaW5nKDAsIGkpO1xuICB2YXIgZmlsdGVyID0gZDNfc2VsZWN0aW9uX29uRmlsdGVycy5nZXQodHlwZSk7XG4gIGlmIChmaWx0ZXIpIHR5cGUgPSBmaWx0ZXIsIHdyYXAgPSBkM19zZWxlY3Rpb25fb25GaWx0ZXI7XG5cbiAgZnVuY3Rpb24gb25SZW1vdmUoKSB7XG4gICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgIGlmIChsKSB7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbCwgbC4kKTtcbiAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uQWRkKCkge1xuICAgIHZhciBsID0gd3JhcChsaXN0ZW5lciwgZDNfYXJyYXkoYXJndW1lbnRzKSk7XG4gICAgb25SZW1vdmUuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpc1tuYW1lXSA9IGwsIGwuJCA9IGNhcHR1cmUpO1xuICAgIGwuXyA9IGxpc3RlbmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsKCkge1xuICAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCJeX19vbihbXi5dKylcIiArIGQzLnJlcXVvdGUodHlwZSkgKyBcIiRcIiksXG4gICAgICAgIG1hdGNoO1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgaWYgKG1hdGNoID0gbmFtZS5tYXRjaChyZSkpIHtcbiAgICAgICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobWF0Y2hbMV0sIGwsIGwuJCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpXG4gICAgICA/IGxpc3RlbmVyID8gb25BZGQgOiBvblJlbW92ZVxuICAgICAgOiBsaXN0ZW5lciA/IGQzX25vb3AgOiByZW1vdmVBbGw7XG59XG5cbnZhciBkM19zZWxlY3Rpb25fb25GaWx0ZXJzID0gZDMubWFwKHtcbiAgbW91c2VlbnRlcjogXCJtb3VzZW92ZXJcIixcbiAgbW91c2VsZWF2ZTogXCJtb3VzZW91dFwiXG59KTtcblxuZDNfc2VsZWN0aW9uX29uRmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgaWYgKFwib25cIiArIGsgaW4gZDNfZG9jdW1lbnQpIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMucmVtb3ZlKGspO1xufSk7XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgbyA9IGQzLmV2ZW50OyAvLyBFdmVudHMgY2FuIGJlIHJlZW50cmFudCAoZS5nLiwgZm9jdXMpLlxuICAgIGQzLmV2ZW50ID0gZTtcbiAgICBhcmd1bWVudHpbMF0gPSB0aGlzLl9fZGF0YV9fO1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHopO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkMy5ldmVudCA9IG87XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fb25GaWx0ZXIobGlzdGVuZXIsIGFyZ3VtZW50eikge1xuICB2YXIgbCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopO1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLCByZWxhdGVkID0gZS5yZWxhdGVkVGFyZ2V0O1xuICAgIGlmICghcmVsYXRlZCB8fCAocmVsYXRlZCAhPT0gdGFyZ2V0ICYmICEocmVsYXRlZC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0YXJnZXQpICYgOCkpKSB7XG4gICAgICBsLmNhbGwodGFyZ2V0LCBlKTtcbiAgICB9XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbl9lYWNoKHRoaXMsIGZ1bmN0aW9uKG5vZGUsIGksIGopIHtcbiAgICBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lYWNoKGdyb3VwcywgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjayhub2RlLCBpLCBqKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGdyb3Vwcztcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgYXJncyA9IGQzX2FycmF5KGFyZ3VtZW50cyk7XG4gIGNhbGxiYWNrLmFwcGx5KGFyZ3NbMF0gPSB0aGlzLCBhcmdzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgaWYgKG5vZGUpIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuID0gMDtcbiAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyArK247IH0pO1xuICByZXR1cm4gbjtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lbnRlcihzZWxlY3Rpb24pIHtcbiAgZDNfc3ViY2xhc3Moc2VsZWN0aW9uLCBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUpO1xuICByZXR1cm4gc2VsZWN0aW9uO1xufVxuXG52YXIgZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlID0gW107XG5cbmQzLnNlbGVjdGlvbi5lbnRlciA9IGQzX3NlbGVjdGlvbl9lbnRlcjtcbmQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUgPSBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGU7XG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5hcHBlbmQgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuYXBwZW5kO1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmVtcHR5ID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVtcHR5O1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLm5vZGUgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUubm9kZTtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5jYWxsID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGw7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuc2l6ZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplO1xuXG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIHN1Ym5vZGUsXG4gICAgICB1cGdyb3VwLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHVwZ3JvdXAgPSAoZ3JvdXAgPSB0aGlzW2pdKS51cGRhdGU7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IGdyb3VwLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKHVwZ3JvdXBbaV0gPSBzdWJub2RlID0gc2VsZWN0b3IuY2FsbChncm91cC5wYXJlbnROb2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgYmVmb3JlID0gZDNfc2VsZWN0aW9uX2VudGVySW5zZXJ0QmVmb3JlKHRoaXMpO1xuICByZXR1cm4gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydC5jYWxsKHRoaXMsIG5hbWUsIGJlZm9yZSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZW50ZXJJbnNlcnRCZWZvcmUoZW50ZXIpIHtcbiAgdmFyIGkwLCBqMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQsIGksIGopIHtcbiAgICB2YXIgZ3JvdXAgPSBlbnRlcltqXS51cGRhdGUsXG4gICAgICAgIG4gPSBncm91cC5sZW5ndGgsXG4gICAgICAgIG5vZGU7XG4gICAgaWYgKGogIT0gajApIGowID0gaiwgaTAgPSAwO1xuICAgIGlmIChpID49IGkwKSBpMCA9IGkgKyAxO1xuICAgIHdoaWxlICghKG5vZGUgPSBncm91cFtpMF0pICYmICsraTAgPCBuKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcbn1cblxuLy8gaW1wb3J0IFwiLi4vdHJhbnNpdGlvbi90cmFuc2l0aW9uXCI7XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpZCA9IGQzX3RyYW5zaXRpb25Jbmhlcml0SWQgfHwgKytkM190cmFuc2l0aW9uSWQsXG4gICAgICBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgbm9kZSxcbiAgICAgIHRyYW5zaXRpb24gPSBkM190cmFuc2l0aW9uSW5oZXJpdCB8fCB7dGltZTogRGF0ZS5ub3coKSwgZWFzZTogZDNfZWFzZV9jdWJpY0luT3V0LCBkZWxheTogMCwgZHVyYXRpb246IDI1MH07XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBkM190cmFuc2l0aW9uTm9kZShub2RlLCBpLCBpZCwgdHJhbnNpdGlvbik7XG4gICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM190cmFuc2l0aW9uKHN1Ymdyb3VwcywgaWQpO1xufTtcbi8vIGltcG9ydCBcIi4uL3RyYW5zaXRpb24vdHJhbnNpdGlvblwiO1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuaW50ZXJydXB0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2ludGVycnVwdCk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25faW50ZXJydXB0KCkge1xuICB2YXIgbG9jayA9IHRoaXMuX190cmFuc2l0aW9uX187XG4gIGlmIChsb2NrKSArK2xvY2suYWN0aXZlO1xufVxuXG4vLyBUT0RPIGZhc3Qgc2luZ2xldG9uIGltcGxlbWVudGF0aW9uP1xuZDMuc2VsZWN0ID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgZ3JvdXAgPSBbdHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIgPyBkM19zZWxlY3Qobm9kZSwgZDNfZG9jdW1lbnQpIDogbm9kZV07XG4gIGdyb3VwLnBhcmVudE5vZGUgPSBkM19kb2N1bWVudEVsZW1lbnQ7XG4gIHJldHVybiBkM19zZWxlY3Rpb24oW2dyb3VwXSk7XG59O1xuXG5kMy5zZWxlY3RBbGwgPSBmdW5jdGlvbihub2Rlcykge1xuICB2YXIgZ3JvdXAgPSBkM19hcnJheSh0eXBlb2Ygbm9kZXMgPT09IFwic3RyaW5nXCIgPyBkM19zZWxlY3RBbGwobm9kZXMsIGQzX2RvY3VtZW50KSA6IG5vZGVzKTtcbiAgZ3JvdXAucGFyZW50Tm9kZSA9IGQzX2RvY3VtZW50RWxlbWVudDtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihbZ3JvdXBdKTtcbn07XG5cbnZhciBkM19zZWxlY3Rpb25Sb290ID0gZDMuc2VsZWN0KGQzX2RvY3VtZW50RWxlbWVudCk7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShkMyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZDM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kMyA9IGQzO1xuICB9XG59KCk7XG4iLCJmdW5jdGlvbiBjb3JzbGl0ZSh1cmwsIGNhbGxiYWNrLCBjb3JzKSB7XG4gICAgdmFyIHNlbnQgPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93LlhNTEh0dHBSZXF1ZXN0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soRXJyb3IoJ0Jyb3dzZXIgbm90IHN1cHBvcnRlZCcpKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvcnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBtID0gdXJsLm1hdGNoKC9eXFxzKmh0dHBzPzpcXC9cXC9bXlxcL10qLyk7XG4gICAgICAgIGNvcnMgPSBtICYmIChtWzBdICE9PSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0bmFtZSArXG4gICAgICAgICAgICAgICAgKGxvY2F0aW9uLnBvcnQgPyAnOicgKyBsb2NhdGlvbi5wb3J0IDogJycpKTtcbiAgICB9XG5cbiAgICB2YXIgeCA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIGZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bChzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0O1xuICAgIH1cblxuICAgIGlmIChjb3JzICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4geCkpIHtcbiAgICAgICAgLy8gSUU4LTlcbiAgICAgICAgeCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcblxuICAgICAgICAvLyBFbnN1cmUgY2FsbGJhY2sgaXMgbmV2ZXIgY2FsbGVkIHN5bmNocm9ub3VzbHksIGkuZS4sIGJlZm9yZVxuICAgICAgICAvLyB4LnNlbmQoKSByZXR1cm5zICh0aGlzIGhhcyBiZWVuIG9ic2VydmVkIGluIHRoZSB3aWxkKS5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LmpzL2lzc3Vlcy80NzJcbiAgICAgICAgdmFyIG9yaWdpbmFsID0gY2FsbGJhY2s7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoc2VudCkge1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbC5hcHBseSh0aGF0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRlZCgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gWERvbWFpblJlcXVlc3RcbiAgICAgICAgICAgIHguc3RhdHVzID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIC8vIG1vZGVybiBicm93c2Vyc1xuICAgICAgICAgICAgaXNTdWNjZXNzZnVsKHguc3RhdHVzKSkgY2FsbGJhY2suY2FsbCh4LCBudWxsLCB4KTtcbiAgICAgICAgZWxzZSBjYWxsYmFjay5jYWxsKHgsIHgsIG51bGwpO1xuICAgIH1cblxuICAgIC8vIEJvdGggYG9ucmVhZHlzdGF0ZWNoYW5nZWAgYW5kIGBvbmxvYWRgIGNhbiBmaXJlLiBgb25yZWFkeXN0YXRlY2hhbmdlYFxuICAgIC8vIGhhcyBbYmVlbiBzdXBwb3J0ZWQgZm9yIGxvbmdlcl0oaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTE4MTUwOC8yMjkwMDEpLlxuICAgIGlmICgnb25sb2FkJyBpbiB4KSB7XG4gICAgICAgIHgub25sb2FkID0gbG9hZGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHgub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gcmVhZHlzdGF0ZSgpIHtcbiAgICAgICAgICAgIGlmICh4LnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBsb2FkZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBYTUxIdHRwUmVxdWVzdCBvYmplY3QgYXMgYW4gZXJyb3IgYW5kIHByZXZlbnRcbiAgICAvLyBpdCBmcm9tIGV2ZXIgYmVpbmcgY2FsbGVkIGFnYWluIGJ5IHJlYXNzaWduaW5nIGl0IHRvIGBub29wYFxuICAgIHgub25lcnJvciA9IGZ1bmN0aW9uIGVycm9yKGV2dCkge1xuICAgICAgICAvLyBYRG9tYWluUmVxdWVzdCBwcm92aWRlcyBubyBldnQgcGFyYW1ldGVyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZXZ0IHx8IHRydWUsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHgub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkgeyB9O1xuXG4gICAgeC5vbnRpbWVvdXQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldnQsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICB4Lm9uYWJvcnQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldnQsIG51bGwpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyB9O1xuICAgIH07XG5cbiAgICAvLyBHRVQgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIEhUVFAgVmVyYiBieSBYRG9tYWluUmVxdWVzdCBhbmQgaXMgdGhlXG4gICAgLy8gb25seSBvbmUgc3VwcG9ydGVkIGhlcmUuXG4gICAgeC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdC4gU2VuZGluZyBkYXRhIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgeC5zZW5kKG51bGwpO1xuICAgIHNlbnQgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHg7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBjb3JzbGl0ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBCYXNlZCBvZmYgb2YgW3RoZSBvZmZpY2FsIEdvb2dsZSBkb2N1bWVudF0oaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL3V0aWxpdGllcy9wb2x5bGluZWFsZ29yaXRobSlcbiAqXG4gKiBTb21lIHBhcnRzIGZyb20gW3RoaXMgaW1wbGVtZW50YXRpb25dKGh0dHA6Ly9mYWNzdGFmZi51bmNhLmVkdS9tY21jY2x1ci9Hb29nbGVNYXBzL0VuY29kZVBvbHlsaW5lL1BvbHlsaW5lRW5jb2Rlci5qcylcbiAqIGJ5IFtNYXJrIE1jQ2x1cmVdKGh0dHA6Ly9mYWNzdGFmZi51bmNhLmVkdS9tY21jY2x1ci8pXG4gKlxuICogQG1vZHVsZSBwb2x5bGluZVxuICovXG5cbnZhciBwb2x5bGluZSA9IHt9O1xuXG5mdW5jdGlvbiBweTJfcm91bmQodmFsdWUpIHtcbiAgICAvLyBHb29nbGUncyBwb2x5bGluZSBhbGdvcml0aG0gdXNlcyB0aGUgc2FtZSByb3VuZGluZyBzdHJhdGVneSBhcyBQeXRob24gMiwgd2hpY2ggaXMgZGlmZmVyZW50IGZyb20gSlMgZm9yIG5lZ2F0aXZlIHZhbHVlc1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGguYWJzKHZhbHVlKSArIDAuNSkgKiBNYXRoLnNpZ24odmFsdWUpO1xufVxuXG5mdW5jdGlvbiBlbmNvZGUoY3VycmVudCwgcHJldmlvdXMsIGZhY3Rvcikge1xuICAgIGN1cnJlbnQgPSBweTJfcm91bmQoY3VycmVudCAqIGZhY3Rvcik7XG4gICAgcHJldmlvdXMgPSBweTJfcm91bmQocHJldmlvdXMgKiBmYWN0b3IpO1xuICAgIHZhciBjb29yZGluYXRlID0gY3VycmVudCAtIHByZXZpb3VzO1xuICAgIGNvb3JkaW5hdGUgPDw9IDE7XG4gICAgaWYgKGN1cnJlbnQgLSBwcmV2aW91cyA8IDApIHtcbiAgICAgICAgY29vcmRpbmF0ZSA9IH5jb29yZGluYXRlO1xuICAgIH1cbiAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgd2hpbGUgKGNvb3JkaW5hdGUgPj0gMHgyMCkge1xuICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoMHgyMCB8IChjb29yZGluYXRlICYgMHgxZikpICsgNjMpO1xuICAgICAgICBjb29yZGluYXRlID4+PSA1O1xuICAgIH1cbiAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjb29yZGluYXRlICsgNjMpO1xuICAgIHJldHVybiBvdXRwdXQ7XG59XG5cbi8qKlxuICogRGVjb2RlcyB0byBhIFtsYXRpdHVkZSwgbG9uZ2l0dWRlXSBjb29yZGluYXRlcyBhcnJheS5cbiAqXG4gKiBUaGlzIGlzIGFkYXB0ZWQgZnJvbSB0aGUgaW1wbGVtZW50YXRpb24gaW4gUHJvamVjdC1PU1JNLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBwcmVjaXNpb25cbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Qcm9qZWN0LU9TUk0vb3NybS1mcm9udGVuZC9ibG9iL21hc3Rlci9XZWJDb250ZW50L3JvdXRpbmcvT1NSTS5Sb3V0aW5nR2VvbWV0cnkuanNcbiAqL1xucG9seWxpbmUuZGVjb2RlID0gZnVuY3Rpb24oc3RyLCBwcmVjaXNpb24pIHtcbiAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICBsYXQgPSAwLFxuICAgICAgICBsbmcgPSAwLFxuICAgICAgICBjb29yZGluYXRlcyA9IFtdLFxuICAgICAgICBzaGlmdCA9IDAsXG4gICAgICAgIHJlc3VsdCA9IDAsXG4gICAgICAgIGJ5dGUgPSBudWxsLFxuICAgICAgICBsYXRpdHVkZV9jaGFuZ2UsXG4gICAgICAgIGxvbmdpdHVkZV9jaGFuZ2UsXG4gICAgICAgIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24gfHwgNSk7XG5cbiAgICAvLyBDb29yZGluYXRlcyBoYXZlIHZhcmlhYmxlIGxlbmd0aCB3aGVuIGVuY29kZWQsIHNvIGp1c3Qga2VlcFxuICAgIC8vIHRyYWNrIG9mIHdoZXRoZXIgd2UndmUgaGl0IHRoZSBlbmQgb2YgdGhlIHN0cmluZy4gSW4gZWFjaFxuICAgIC8vIGxvb3AgaXRlcmF0aW9uLCBhIHNpbmdsZSBjb29yZGluYXRlIGlzIGRlY29kZWQuXG4gICAgd2hpbGUgKGluZGV4IDwgc3RyLmxlbmd0aCkge1xuXG4gICAgICAgIC8vIFJlc2V0IHNoaWZ0LCByZXN1bHQsIGFuZCBieXRlXG4gICAgICAgIGJ5dGUgPSBudWxsO1xuICAgICAgICBzaGlmdCA9IDA7XG4gICAgICAgIHJlc3VsdCA9IDA7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgYnl0ZSA9IHN0ci5jaGFyQ29kZUF0KGluZGV4KyspIC0gNjM7XG4gICAgICAgICAgICByZXN1bHQgfD0gKGJ5dGUgJiAweDFmKSA8PCBzaGlmdDtcbiAgICAgICAgICAgIHNoaWZ0ICs9IDU7XG4gICAgICAgIH0gd2hpbGUgKGJ5dGUgPj0gMHgyMCk7XG5cbiAgICAgICAgbGF0aXR1ZGVfY2hhbmdlID0gKChyZXN1bHQgJiAxKSA/IH4ocmVzdWx0ID4+IDEpIDogKHJlc3VsdCA+PiAxKSk7XG5cbiAgICAgICAgc2hpZnQgPSByZXN1bHQgPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGJ5dGUgPSBzdHIuY2hhckNvZGVBdChpbmRleCsrKSAtIDYzO1xuICAgICAgICAgICAgcmVzdWx0IHw9IChieXRlICYgMHgxZikgPDwgc2hpZnQ7XG4gICAgICAgICAgICBzaGlmdCArPSA1O1xuICAgICAgICB9IHdoaWxlIChieXRlID49IDB4MjApO1xuXG4gICAgICAgIGxvbmdpdHVkZV9jaGFuZ2UgPSAoKHJlc3VsdCAmIDEpID8gfihyZXN1bHQgPj4gMSkgOiAocmVzdWx0ID4+IDEpKTtcblxuICAgICAgICBsYXQgKz0gbGF0aXR1ZGVfY2hhbmdlO1xuICAgICAgICBsbmcgKz0gbG9uZ2l0dWRlX2NoYW5nZTtcblxuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtsYXQgLyBmYWN0b3IsIGxuZyAvIGZhY3Rvcl0pO1xuICAgIH1cblxuICAgIHJldHVybiBjb29yZGluYXRlcztcbn07XG5cbi8qKlxuICogRW5jb2RlcyB0aGUgZ2l2ZW4gW2xhdGl0dWRlLCBsb25naXR1ZGVdIGNvb3JkaW5hdGVzIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gY29vcmRpbmF0ZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBwcmVjaXNpb25cbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbnBvbHlsaW5lLmVuY29kZSA9IGZ1bmN0aW9uKGNvb3JkaW5hdGVzLCBwcmVjaXNpb24pIHtcbiAgICBpZiAoIWNvb3JkaW5hdGVzLmxlbmd0aCkgeyByZXR1cm4gJyc7IH1cblxuICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDUpLFxuICAgICAgICBvdXRwdXQgPSBlbmNvZGUoY29vcmRpbmF0ZXNbMF1bMF0sIDAsIGZhY3RvcikgKyBlbmNvZGUoY29vcmRpbmF0ZXNbMF1bMV0sIDAsIGZhY3Rvcik7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhID0gY29vcmRpbmF0ZXNbaV0sIGIgPSBjb29yZGluYXRlc1tpIC0gMV07XG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoYVswXSwgYlswXSwgZmFjdG9yKTtcbiAgICAgICAgb3V0cHV0ICs9IGVuY29kZShhWzFdLCBiWzFdLCBmYWN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5mdW5jdGlvbiBmbGlwcGVkKGNvb3Jkcykge1xuICAgIHZhciBmbGlwcGVkID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZmxpcHBlZC5wdXNoKGNvb3Jkc1tpXS5zbGljZSgpLnJldmVyc2UoKSk7XG4gICAgfVxuICAgIHJldHVybiBmbGlwcGVkO1xufVxuXG4vKipcbiAqIEVuY29kZXMgYSBHZW9KU09OIExpbmVTdHJpbmcgZmVhdHVyZS9nZW9tZXRyeS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2VvanNvblxuICogQHBhcmFtIHtOdW1iZXJ9IHByZWNpc2lvblxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xucG9seWxpbmUuZnJvbUdlb0pTT04gPSBmdW5jdGlvbihnZW9qc29uLCBwcmVjaXNpb24pIHtcbiAgICBpZiAoZ2VvanNvbiAmJiBnZW9qc29uLnR5cGUgPT09ICdGZWF0dXJlJykge1xuICAgICAgICBnZW9qc29uID0gZ2VvanNvbi5nZW9tZXRyeTtcbiAgICB9XG4gICAgaWYgKCFnZW9qc29uIHx8IGdlb2pzb24udHlwZSAhPT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW5wdXQgbXVzdCBiZSBhIEdlb0pTT04gTGluZVN0cmluZycpO1xuICAgIH1cbiAgICByZXR1cm4gcG9seWxpbmUuZW5jb2RlKGZsaXBwZWQoZ2VvanNvbi5jb29yZGluYXRlcyksIHByZWNpc2lvbik7XG59O1xuXG4vKipcbiAqIERlY29kZXMgdG8gYSBHZW9KU09OIExpbmVTdHJpbmcgZ2VvbWV0cnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtOdW1iZXJ9IHByZWNpc2lvblxuICogQHJldHVybnMge09iamVjdH1cbiAqL1xucG9seWxpbmUudG9HZW9KU09OID0gZnVuY3Rpb24oc3RyLCBwcmVjaXNpb24pIHtcbiAgICB2YXIgY29vcmRzID0gcG9seWxpbmUuZGVjb2RlKHN0ciwgcHJlY2lzaW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBmbGlwcGVkKGNvb3JkcylcbiAgICB9O1xufTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwb2x5bGluZTtcbn1cbiIsIi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICogYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICogTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gKiBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLiBUaGUgZnVuY3Rpb24gYWxzbyBoYXMgYSBwcm9wZXJ0eSAnY2xlYXInIFxuICogdGhhdCBpcyBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgY2xlYXIgdGhlIHRpbWVyIHRvIHByZXZlbnQgcHJldmlvdXNseSBzY2hlZHVsZWQgZXhlY3V0aW9ucy4gXG4gKlxuICogQHNvdXJjZSB1bmRlcnNjb3JlLmpzXG4gKiBAc2VlIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbiB0byB3cmFwXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZW91dCBpbiBtcyAoYDEwMGApXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdoZXRoZXIgdG8gZXhlY3V0ZSBhdCB0aGUgYmVnaW5uaW5nIChgZmFsc2VgKVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSl7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcbiAgaWYgKG51bGwgPT0gd2FpdCkgd2FpdCA9IDEwMDtcblxuICBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICB2YXIgbGFzdCA9IERhdGUubm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIGRlYm91bmNlZCA9IGZ1bmN0aW9uKCl7XG4gICAgY29udGV4dCA9IHRoaXM7XG4gICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSB7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgZGVib3VuY2VkLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZGVib3VuY2VkO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKCdxdWV1ZScsIGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5xdWV1ZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBzbGljZSA9IFtdLnNsaWNlO1xuXG4gIGZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4gIHZhciBub2Fib3J0ID0ge307XG4gIHZhciBzdWNjZXNzID0gW251bGxdO1xuICBmdW5jdGlvbiBuZXdRdWV1ZShjb25jdXJyZW5jeSkge1xuICAgIGlmICghKGNvbmN1cnJlbmN5ID49IDEpKSB0aHJvdyBuZXcgRXJyb3I7XG5cbiAgICB2YXIgcSxcbiAgICAgICAgdGFza3MgPSBbXSxcbiAgICAgICAgcmVzdWx0cyA9IFtdLFxuICAgICAgICB3YWl0aW5nID0gMCxcbiAgICAgICAgYWN0aXZlID0gMCxcbiAgICAgICAgZW5kZWQgPSAwLFxuICAgICAgICBzdGFydGluZywgLy8gaW5zaWRlIGEgc3luY2hyb25vdXMgdGFzayBjYWxsYmFjaz9cbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGNhbGxiYWNrID0gbm9vcCxcbiAgICAgICAgY2FsbGJhY2tBbGwgPSB0cnVlO1xuXG4gICAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICBpZiAoc3RhcnRpbmcpIHJldHVybjsgLy8gbGV0IHRoZSBjdXJyZW50IHRhc2sgY29tcGxldGVcbiAgICAgIHdoaWxlIChzdGFydGluZyA9IHdhaXRpbmcgJiYgYWN0aXZlIDwgY29uY3VycmVuY3kpIHtcbiAgICAgICAgdmFyIGkgPSBlbmRlZCArIGFjdGl2ZSxcbiAgICAgICAgICAgIHQgPSB0YXNrc1tpXSxcbiAgICAgICAgICAgIGogPSB0Lmxlbmd0aCAtIDEsXG4gICAgICAgICAgICBjID0gdFtqXTtcbiAgICAgICAgdFtqXSA9IGVuZChpKTtcbiAgICAgICAgLS13YWl0aW5nLCArK2FjdGl2ZSwgdGFza3NbaV0gPSBjLmFwcGx5KG51bGwsIHQpIHx8IG5vYWJvcnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kKGkpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlLCByKSB7XG4gICAgICAgIGlmICghdGFza3NbaV0pIHRocm93IG5ldyBFcnJvcjsgLy8gZGV0ZWN0IG11bHRpcGxlIGNhbGxiYWNrc1xuICAgICAgICAtLWFjdGl2ZSwgKytlbmRlZCwgdGFza3NbaV0gPSBudWxsO1xuICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuOyAvLyBvbmx5IHJlcG9ydCB0aGUgZmlyc3QgZXJyb3JcbiAgICAgICAgaWYgKGUgIT0gbnVsbCkge1xuICAgICAgICAgIGFib3J0KGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHNbaV0gPSByO1xuICAgICAgICAgIGlmICh3YWl0aW5nKSBzdGFydCgpO1xuICAgICAgICAgIGVsc2UgaWYgKCFhY3RpdmUpIG5vdGlmeSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFib3J0KGUpIHtcbiAgICAgIGVycm9yID0gZTsgLy8gaWdub3JlIG5ldyB0YXNrcyBhbmQgc3F1ZWxjaCBhY3RpdmUgY2FsbGJhY2tzXG4gICAgICB3YWl0aW5nID0gTmFOOyAvLyBzdG9wIHF1ZXVlZCB0YXNrcyBmcm9tIHN0YXJ0aW5nXG4gICAgICBub3RpZnkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgZWxzZSBpZiAoY2FsbGJhY2tBbGwpIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuICAgICAgZWxzZSBjYWxsYmFjay5hcHBseShudWxsLCBzdWNjZXNzLmNvbmNhdChyZXN1bHRzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHEgPSB7XG4gICAgICBkZWZlcjogZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT09IG5vb3ApIHRocm93IG5ldyBFcnJvcjtcbiAgICAgICAgdmFyIHQgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHQucHVzaChmKTtcbiAgICAgICAgKyt3YWl0aW5nLCB0YXNrcy5wdXNoKHQpO1xuICAgICAgICBzdGFydCgpO1xuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH0sXG4gICAgICBhYm9ydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChlcnJvciA9PSBudWxsKSB7XG4gICAgICAgICAgdmFyIGkgPSBlbmRlZCArIGFjdGl2ZSwgdDtcbiAgICAgICAgICB3aGlsZSAoLS1pID49IDApICh0ID0gdGFza3NbaV0pICYmIHQuYWJvcnQgJiYgdC5hYm9ydCgpO1xuICAgICAgICAgIGFib3J0KG5ldyBFcnJvcihcImFib3J0XCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH0sXG4gICAgICBhd2FpdDogZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT09IG5vb3ApIHRocm93IG5ldyBFcnJvcjtcbiAgICAgICAgY2FsbGJhY2sgPSBmLCBjYWxsYmFja0FsbCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXdhaXRpbmcgJiYgIWFjdGl2ZSkgbm90aWZ5KCk7XG4gICAgICAgIHJldHVybiBxO1xuICAgICAgfSxcbiAgICAgIGF3YWl0QWxsOiBmdW5jdGlvbihmKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayAhPT0gbm9vcCkgdGhyb3cgbmV3IEVycm9yO1xuICAgICAgICBjYWxsYmFjayA9IGYsIGNhbGxiYWNrQWxsID0gdHJ1ZTtcbiAgICAgICAgaWYgKCF3YWl0aW5nICYmICFhY3RpdmUpIG5vdGlmeSgpO1xuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcXVldWUoY29uY3VycmVuY3kpIHtcbiAgICByZXR1cm4gbmV3UXVldWUoYXJndW1lbnRzLmxlbmd0aCA/ICtjb25jdXJyZW5jeSA6IEluZmluaXR5KTtcbiAgfVxuXG4gIHF1ZXVlLnZlcnNpb24gPSBcIjEuMi4xXCI7XG5cbiAgcmV0dXJuIHF1ZXVlO1xuXG59KSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnZXRSZXF1ZXN0ID0gcmVxdWlyZShcIi4vZ2V0X3JlcXVlc3RcIiksXG4gICAgcG9seWxpbmUgPSByZXF1aXJlKFwiQG1hcGJveC9wb2x5bGluZVwiKSxcbiAgICBxdWV1ZSA9IHJlcXVpcmUoXCJxdWV1ZS1hc3luY1wiKTtcblxudmFyIERpcmVjdGlvbnMgPSBMLkNsYXNzLmV4dGVuZCh7XG4gICAgaW5jbHVkZXM6IFtMLk1peGluLkV2ZW50c10sXG5cbiAgICBvcHRpb25zOiB7XG4gICAgICAgIHByb3ZpZGVyOiBcIm9wZW5yb3V0ZXNlcnZpY2VcIixcbiAgICAgICAgbWFwYm94OiB7XG4gICAgICAgICAgICBhcGlfdGVtcGxhdGU6XG4gICAgICAgICAgICAgICAgXCJodHRwczovL2FwaS5tYXBib3guY29tL2RpcmVjdGlvbnMvdjUvbWFwYm94L2N5Y2xpbmcve3dheXBvaW50c30/Z2VvbWV0cmllcz1wb2x5bGluZSZhY2Nlc3NfdG9rZW49e3Rva2VufVwiLFxuICAgICAgICAgICAgZ2VvY29kZXJfdGVtcGxhdGU6XG4gICAgICAgICAgICAgICAgXCJodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L2dlb2NvZGUvbWFwYm94LnBsYWNlcy97cXVlcnl9Lmpzb24/cHJveGltaXR5PXtwcm94aW1pdHl9JmFjY2Vzc190b2tlbj17dG9rZW59XCIsXG4gICAgICAgICAgICBrZXk6XG4gICAgICAgICAgICAgICAgXCJway5leUoxSWpvaWJHeHBkU0lzSW1FaU9pSTRkVzV1VmtWSkluMC5qaGZwTG4yRXNrXzZaU0c2MnlYWU9nXCIsXG4gICAgICAgICAgICBwcm9maWxlOiBcImN5Y2xpbmdcIixcbiAgICAgICAgICAgIHBhdGhfc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBzdHJva2U6IFwiIzQyNjRmYlwiLFxuICAgICAgICAgICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogMC43OCxcbiAgICAgICAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiA1XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9wZW5yb3V0ZXNlcnZpY2U6IHtcbiAgICAgICAgICAgIGFwaV90ZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vYXBpLm9wZW5yb3V0ZXNlcnZpY2Uub3JnL2NvcnNkaXJlY3Rpb25zPyZjb29yZGluYXRlcz17Y29vcmRpbmF0ZXN9Jmluc3RydWN0aW9ucz1mYWxzZSZwcmVmZXJlbmNlPXtwcmVmZXJlbmNlfSZwcm9maWxlPXtwcm9maWxlfSZhcGlfa2V5PXt0b2tlbn1cIixcbiAgICAgICAgICAgIGtleTogXCI1OGQ5MDRhNDk3YzY3ZTAwMDE1YjQ1ZmNmMjQzZWFjZjRiMjU0MzRjNmUyOGQ3ZmQ2MWM5ZDMwOVwiLFxuICAgICAgICAgICAgcHJlZmVyZW5jZTogXCJcIixcbiAgICAgICAgICAgIHByb2ZpbGU6IFwiY3ljbGluZy1yZWd1bGFyXCIsXG4gICAgICAgICAgICBwYXRoX3N0eWxlOiB7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBcIiNjZjVmNWZcIixcbiAgICAgICAgICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDAuNzgsXG4gICAgICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogNVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnb29nbGU6IHtcbiAgICAgICAgICAgIGFwaV90ZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vbHVsaXUubWUvZ21hcHN3cmFwcGVyP29yaWdpbj17b3JpZ2lufSZkZXN0aW5hdGlvbj17ZGVzdGluYXRpb259Jm1vZGU9YmljeWNsaW5nJmtleT17dG9rZW59XCIsXG4gICAgICAgICAgICBrZXk6IFwiQUl6YVN5RGMyZ2FkV0k0bnVuWWIwaTVNeF9QM0FIX3lEVGlNekFZXCIsXG4gICAgICAgICAgICBwcm9maWxlOiBcImJpY3ljbGluZ1wiLFxuICAgICAgICAgICAgcGF0aF9zdHlsZToge1xuICAgICAgICAgICAgICAgIHN0cm9rZTogXCIjMGY5ZDU4XCIsXG4gICAgICAgICAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiAwLjc4LFxuICAgICAgICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IDVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gW107XG4gICAgfSxcblxuICAgIGdldE9yaWdpbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbjtcbiAgICB9LFxuXG4gICAgZ2V0RGVzdGluYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICB9LFxuXG4gICAgc2V0T3JpZ2luOiBmdW5jdGlvbihvcmlnaW4pIHtcbiAgICAgICAgb3JpZ2luID0gdGhpcy5fbm9ybWFsaXplV2F5cG9pbnQob3JpZ2luKTtcblxuICAgICAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAgICAgdGhpcy5maXJlKFwib3JpZ2luXCIsIHtcbiAgICAgICAgICAgIG9yaWdpbjogb3JpZ2luXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghb3JpZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl91bmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzZXREZXN0aW5hdGlvbjogZnVuY3Rpb24oZGVzdGluYXRpb24pIHtcbiAgICAgICAgZGVzdGluYXRpb24gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludChkZXN0aW5hdGlvbik7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgICB0aGlzLmZpcmUoXCJkZXN0aW5hdGlvblwiLCB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb25cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fdW5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZ2V0V2F5cG9pbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dheXBvaW50cztcbiAgICB9LFxuXG4gICAgc2V0V2F5cG9pbnRzOiBmdW5jdGlvbih3YXlwb2ludHMpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gd2F5cG9pbnRzLm1hcCh0aGlzLl9ub3JtYWxpemVXYXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBhZGRXYXlwb2ludDogZnVuY3Rpb24oaW5kZXgsIHdheXBvaW50KSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50cy5zcGxpY2UoaW5kZXgsIDAsIHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KHdheXBvaW50KSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZW1vdmVXYXlwb2ludDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzZXRXYXlwb2ludDogZnVuY3Rpb24oaW5kZXgsIHdheXBvaW50KSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50c1tpbmRleF0gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludCh3YXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzLm9yaWdpbixcbiAgICAgICAgICAgIGQgPSB0aGlzLmRlc3RpbmF0aW9uO1xuXG4gICAgICAgIHRoaXMub3JpZ2luID0gZDtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG87XG4gICAgICAgIHRoaXMuX3dheXBvaW50cy5yZXZlcnNlKCk7XG5cbiAgICAgICAgdGhpcy5maXJlKFwib3JpZ2luXCIsIHtcbiAgICAgICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW5cbiAgICAgICAgfSkuZmlyZShcImRlc3RpbmF0aW9uXCIsIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uOiB0aGlzLmRlc3RpbmF0aW9uXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzZWxlY3RSb3V0ZTogZnVuY3Rpb24ocm91dGUpIHtcbiAgICAgICAgdGhpcy5maXJlKFwic2VsZWN0Um91dGVcIiwge1xuICAgICAgICAgICAgcm91dGU6IHJvdXRlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZWxlY3RUcmFjazogZnVuY3Rpb24odHJhY2spIHtcbiAgICAgICAgdGhpcy5maXJlKFwic2VsZWN0VHJhY2tcIiwge1xuICAgICAgICAgICAgdHJhY2s6IHRyYWNrLkdlb0pTT05cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGhpZ2hsaWdodFJvdXRlOiBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICB0aGlzLmZpcmUoXCJoaWdobGlnaHRSb3V0ZVwiLCB7XG4gICAgICAgICAgICByb3V0ZTogcm91dGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGhpZ2hsaWdodFN0ZXA6IGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgICAgdGhpcy5maXJlKFwiaGlnaGxpZ2h0U3RlcFwiLCB7XG4gICAgICAgICAgICBzdGVwOiBzdGVwXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBxdWVyeVVSTDogZnVuY3Rpb24ob3B0cykge1xuICAgICAgICB0aGlzLm9wdGlvbnMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMub3B0aW9uc1t0aGlzLm9wdGlvbnMucHJvdmlkZXJdLmFwaV90ZW1wbGF0ZTtcbiAgICAgICAgdmFyIHBvaW50cyA9IFwiXCI7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucHJvdmlkZXIgPT09IFwibWFwYm94XCIpIHtcbiAgICAgICAgICAgIHBvaW50cyA9IFt0aGlzLmdldE9yaWdpbigpLCB0aGlzLmdldERlc3RpbmF0aW9uKCldXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmpvaW4oXCI7XCIpO1xuICAgICAgICAgICAgcmV0dXJuIEwuVXRpbC50ZW1wbGF0ZSh0ZW1wbGF0ZSwge1xuICAgICAgICAgICAgICAgIHRva2VuOiB0aGlzLm9wdGlvbnMubWFwYm94LmtleSxcbiAgICAgICAgICAgICAgICB3YXlwb2ludHM6IHBvaW50c1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcm92aWRlciA9PT0gXCJvcGVucm91dGVzZXJ2aWNlXCIpIHtcbiAgICAgICAgICAgIHBvaW50cyA9IFt0aGlzLmdldE9yaWdpbigpLCB0aGlzLmdldERlc3RpbmF0aW9uKCldXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmpvaW4oXCIlN0NcIik7XG4gICAgICAgICAgICBpZiAob3B0cy5oYXNPd25Qcm9wZXJ0eShcInByZWZlcmVuY2VcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub3BlbnJvdXRlc2VydmljZS5wcmVmZXJlbmNlID0gb3B0cy5wcmVmZXJlbmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdHMuaGFzT3duUHJvcGVydHkoXCJwcm9maWxlXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9wZW5yb3V0ZXNlcnZpY2UucHJvZmlsZSA9IG9wdHMucHJvZmlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBMLlV0aWwudGVtcGxhdGUodGVtcGxhdGUsIHtcbiAgICAgICAgICAgICAgICB0b2tlbjogdGhpcy5vcHRpb25zLm9wZW5yb3V0ZXNlcnZpY2Uua2V5LFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb2ludHMsXG4gICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogdGhpcy5vcHRpb25zLm9wZW5yb3V0ZXNlcnZpY2UucHJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB0aGlzLm9wdGlvbnMub3BlbnJvdXRlc2VydmljZS5wcm9maWxlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnByb3ZpZGVyID09PSBcImdvb2dsZVwiKSB7XG4gICAgICAgICAgICB2YXIgb3JpZ2luX2Nvb3JkcyA9IHRoaXMuZ2V0T3JpZ2luKCkuZ2VvbWV0cnkuY29vcmRpbmF0ZXMuc2xpY2UoKTtcbiAgICAgICAgICAgIHZhciBkZXN0X2Nvb3JkcyA9IHRoaXMuZ2V0RGVzdGluYXRpb24oKS5nZW9tZXRyeS5jb29yZGluYXRlcy5zbGljZSgpO1xuICAgICAgICAgICAgcmV0dXJuIEwuVXRpbC50ZW1wbGF0ZSh0ZW1wbGF0ZSwge1xuICAgICAgICAgICAgICAgIHRva2VuOiB0aGlzLm9wdGlvbnMuZ29vZ2xlLmtleSxcbiAgICAgICAgICAgICAgICBvcmlnaW46IG9yaWdpbl9jb29yZHMucmV2ZXJzZSgpLmpvaW4oXCIsXCIpLFxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBkZXN0X2Nvb3Jkcy5yZXZlcnNlKCkuam9pbihcIixcIilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIF9jb25zdHJ1Y3RSb3V0aW5nUmVzdWx0OiBmdW5jdGlvbihyZXNwLCBwcm92aWRlcikge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbnMgPSByZXNwO1xuICAgICAgICBpZiAocHJvdmlkZXIgPT09IFwibWFwYm94XCIpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5vcmlnaW4gPSByZXNwLndheXBvaW50c1swXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbiA9IHJlc3Aud2F5cG9pbnRzLnNsaWNlKC0xKVswXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMuZm9yRWFjaChmdW5jdGlvbih3cCkge1xuICAgICAgICAgICAgICAgIHdwLmdlb21ldHJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBvaW50XCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiB3cC5sb2NhdGlvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgd3AucHJvcGVydGllcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogd3AubmFtZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMgPSByZXNwLndheXBvaW50cy5zbGljZSgxLCAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3ZpZGVyID09PSBcIm9wZW5yb3V0ZXNlcnZpY2VcIikge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9IHJlc3AuaW5mby5xdWVyeS5jb29yZGluYXRlc1swXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbiA9IHJlc3AuaW5mby5xdWVyeS5jb29yZGluYXRlc1sxXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvdmlkZXIgPT09IFwibWFwYm94XCIgfHwgcHJvdmlkZXIgPT09IFwib3BlbnJvdXRlc2VydmljZVwiKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMucm91dGVzLmZvckVhY2goZnVuY3Rpb24ocm91dGUpIHtcbiAgICAgICAgICAgICAgICByb3V0ZS5nZW9tZXRyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJGZWF0dXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHRoaXMub3B0aW9uc1t0aGlzLm9wdGlvbnMucHJvdmlkZXJdLnBhdGhfc3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb2x5bGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kZWNvZGUocm91dGUuZ2VvbWV0cnkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm92aWRlciA9PT0gXCJnb29nbGVcIikge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9IHRoaXMub3JpZ2luO1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLmRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5yb3V0ZXMuZm9yRWFjaChmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICAgICAgICAgIHJvdXRlLmdlb21ldHJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkZlYXR1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogdGhpcy5vcHRpb25zW3RoaXMub3B0aW9ucy5wcm92aWRlcl0ucGF0aF9zdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IHBvbHlsaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRlY29kZShyb3V0ZS5vdmVydmlld19wb2x5bGluZS5wb2ludHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHF1ZXJ5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE9yaWdpbigpICYmIHRoaXMuZ2V0RGVzdGluYXRpb24oKTtcbiAgICB9LFxuXG4gICAgcXVlcnk6IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgaWYgKCFvcHRzKVxuICAgICAgICAgICAgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICBwcm92aWRlcjogdGhpcy5vcHRpb25zLnByb3ZpZGVyXG4gICAgICAgICAgICB9O1xuICAgICAgICBpZiAoIXRoaXMucXVlcnlhYmxlKCkpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLl9xdWVyeSkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnkuYWJvcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0cyAmJiB0aGlzLl9yZXF1ZXN0cy5sZW5ndGgpXG4gICAgICAgICAgICB0aGlzLl9yZXF1ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uKGdldFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICBnZXRSZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMgPSBbXTtcblxuICAgICAgICB2YXIgcSA9IHF1ZXVlKCk7XG5cbiAgICAgICAgdmFyIHB0cyA9IFt0aGlzLm9yaWdpbiwgdGhpcy5kZXN0aW5hdGlvbl0uY29uY2F0KHRoaXMuX3dheXBvaW50cyk7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHRzKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIXB0c1tpXS5nZW9tZXRyeS5jb29yZGluYXRlcyB8fFxuICAgICAgICAgICAgICAgICFwdHNbaV0ucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShcIm5hbWVcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHEuZGVmZXIoTC5iaW5kKHRoaXMuX2dlb2NvZGUsIHRoaXMpLCBwdHNbaV0sIG9wdHMucHJveGltaXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHEuYXdhaXQoXG4gICAgICAgICAgICBMLmJpbmQoZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXJlKFwiZXJyb3JcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3F1ZXJ5ID0gZ2V0UmVxdWVzdChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeVVSTChvcHRzKSxcbiAgICAgICAgICAgICAgICAgICAgTC5iaW5kKGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcXVlcnkgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlyZShcImVycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnN0cnVjdFJvdXRpbmdSZXN1bHQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucHJvdmlkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3JpZ2luLnByb3BlcnRpZXMubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5kaXJlY3Rpb25zLm9yaWdpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9IHRoaXMub3JpZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24ucHJvcGVydGllcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLmRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKFwibG9hZFwiLCB0aGlzLmRpcmVjdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfZ2VvY29kZTogZnVuY3Rpb24od2F5cG9pbnQsIHByb3hpbWl0eSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9yZXF1ZXN0cykgdGhpcy5fcmVxdWVzdHMgPSBbXTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMucHVzaChcbiAgICAgICAgICAgIGdldFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgTC5VdGlsLnRlbXBsYXRlKHRoaXMub3B0aW9ucy5tYXBib3guZ2VvY29kZXJfdGVtcGxhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHdheXBvaW50LnByb3BlcnRpZXMucXVlcnksXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiB0aGlzLm9wdGlvbnMubWFwYm94LmtleSB8fCBMLm1hcGJveC5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgcHJveGltaXR5OiBwcm94aW1pdHlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gW3Byb3hpbWl0eS5sbmcsIHByb3hpbWl0eS5sYXRdLmpvaW4oXCIsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBMLmJpbmQoZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmZlYXR1cmVzIHx8ICFyZXNwLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJObyByZXN1bHRzIGZvdW5kIGZvciBxdWVyeSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXlwb2ludC5wcm9wZXJ0aWVzLnF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcmVzcC5mZWF0dXJlc1swXS5jZW50ZXI7XG4gICAgICAgICAgICAgICAgICAgIHdheXBvaW50LnByb3BlcnRpZXMubmFtZSA9IHJlc3AuZmVhdHVyZXNbMF0ucGxhY2VfbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBfdW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gW107XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRpcmVjdGlvbnM7XG4gICAgICAgIHRoaXMuZmlyZShcInVubG9hZFwiKTtcbiAgICB9LFxuXG4gICAgX25vcm1hbGl6ZVdheXBvaW50OiBmdW5jdGlvbih3YXlwb2ludCkge1xuICAgICAgICBpZiAoIXdheXBvaW50IHx8IHdheXBvaW50LnR5cGUgPT09IFwiRmVhdHVyZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29vcmRpbmF0ZXMsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0ge307XG5cbiAgICAgICAgaWYgKHdheXBvaW50IGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgIHdheXBvaW50ID0gd2F5cG9pbnQud3JhcCgpO1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSBwcm9wZXJ0aWVzLnF1ZXJ5ID0gW3dheXBvaW50LmxuZywgd2F5cG9pbnQubGF0XTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2F5cG9pbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucXVlcnkgPSB3YXlwb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBcIkZlYXR1cmVcIixcbiAgICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJQb2ludFwiLFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgfTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBEaXJlY3Rpb25zKG9wdGlvbnMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyksXG4gICAgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtZXJyb3JzJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkIHVubG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWVycm9yLWFjdGl2ZScsIGZhbHNlKVxuICAgICAgICAgICAgLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZXJyb3ItYWN0aXZlJywgdHJ1ZSlcbiAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtZXJyb3InKVxuICAgICAgICAgICAgLnRleHQoZS5lcnJvcik7XG5cbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuaW5zZXJ0KCdzcGFuJywgJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWVycm9yLWljb24nKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZHVyYXRpb246IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBtID0gTWF0aC5mbG9vcihzIC8gNjApLFxuICAgICAgICAgICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICAgICAgcyAlPSA2MDtcbiAgICAgICAgbSAlPSA2MDtcbiAgICAgICAgaWYgKGggPT09IDAgJiYgbSA9PT0gMCkgcmV0dXJuIHMgKyAnIHMnO1xuICAgICAgICBpZiAoaCA9PT0gMCkgcmV0dXJuIG0gKyAnIG1pbic7XG4gICAgICAgIHJldHVybiBoICsgJyBoICcgKyBtICsgJyBtaW4nO1xuICAgIH0sXG5cbiAgICBpbXBlcmlhbDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIG1pID0gbSAvIDE2MDkuMzQ0O1xuICAgICAgICBpZiAobWkgPj0gMTAwKSByZXR1cm4gbWkudG9GaXhlZCgwKSArICcgbWknO1xuICAgICAgICBpZiAobWkgPj0gMTApICByZXR1cm4gbWkudG9GaXhlZCgxKSArICcgbWknO1xuICAgICAgICBpZiAobWkgPj0gMC4xKSByZXR1cm4gbWkudG9GaXhlZCgyKSArICcgbWknO1xuICAgICAgICByZXR1cm4gKG1pICogNTI4MCkudG9GaXhlZCgwKSArICcgZnQnO1xuICAgIH0sXG5cbiAgICBtZXRyaWM6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIGlmIChtID49IDEwMDAwMCkgcmV0dXJuIChtIC8gMTAwMCkudG9GaXhlZCgwKSArICcga20nO1xuICAgICAgICBpZiAobSA+PSAxMDAwMCkgIHJldHVybiAobSAvIDEwMDApLnRvRml4ZWQoMSkgKyAnIGttJztcbiAgICAgICAgaWYgKG0gPj0gMTAwKSAgICByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDIpICsgJyBrbSc7XG4gICAgICAgIHJldHVybiBtLnRvRml4ZWQoMCkgKyAnIG0nO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb3JzbGl0ZSA9IHJlcXVpcmUoJ0BtYXBib3gvY29yc2xpdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGNvcnNsaXRlKHVybCwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICBpZiAoZXJyICYmIGVyci50eXBlID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyICYmICFlcnIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3AgPSByZXNwIHx8IGVycjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcCA9IEpTT04ucGFyc2UocmVzcC5yZXNwb25zZVRleHQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHJlc3AucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzcC5lcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihyZXNwLmVycm9yKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgcmVzcCk7XG4gICAgfSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBkMyA9IHJlcXVpcmUoXCIuLi9saWIvZDNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSxcbiAgICAgICAgbWFwO1xuICAgIHZhciBvcmlnQ2hhbmdlID0gZmFsc2UsXG4gICAgICAgIGRlc3RDaGFuZ2UgPSBmYWxzZTtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbihfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkM1xuICAgICAgICAuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoXCJtYXBib3gtZGlyZWN0aW9ucy1pbnB1dHNcIiwgdHJ1ZSk7XG5cbiAgICB2YXIgZm9ybSA9IGNvbnRhaW5lci5hcHBlbmQoXCJmb3JtXCIpLm9uKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkMy5ldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChvcmlnQ2hhbmdlKSBkaXJlY3Rpb25zLnNldE9yaWdpbihvcmlnaW5JbnB1dC5wcm9wZXJ0eShcInZhbHVlXCIpKTtcbiAgICAgICAgICAgIGlmIChkZXN0Q2hhbmdlKVxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24oZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eShcInZhbHVlXCIpKTtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkaXJlY3Rpb25Qcm92aWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLmhhc093blByb3BlcnR5KGtleSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvblByb3ZpZGVyc1trZXldID09PSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5xdWVyeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveGltaXR5OiBtYXAuZ2V0Q2VudGVyKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXI6IGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBvcmlnQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICBkZXN0Q2hhbmdlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBvcmlnaW4gPSBmb3JtLmFwcGVuZChcImRpdlwiKS5hdHRyKFwiY2xhc3NcIiwgXCJtYXBib3gtZGlyZWN0aW9ucy1vcmlnaW5cIik7XG5cbiAgICBvcmlnaW5cbiAgICAgICAgLmFwcGVuZChcImxhYmVsXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXBib3gtZm9ybS1sYWJlbFwiKVxuICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLmdldE9yaWdpbigpIGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgICAgICBtYXAucGFuVG8oZGlyZWN0aW9ucy5nZXRPcmlnaW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1kZXBhcnQtaWNvblwiKTtcblxuICAgIHZhciBvcmlnaW5JbnB1dCA9IG9yaWdpblxuICAgICAgICAuYXBwZW5kKFwiaW5wdXRcIilcbiAgICAgICAgLmF0dHIoXCJ0eXBlXCIsIFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcInJlcXVpcmVkXCIsIFwicmVxdWlyZWRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcImFpci1vcmlnaW4taW5wdXRcIilcbiAgICAgICAgLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIlN0YXJ0XCIpXG4gICAgICAgIC5vbihcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFvcmlnQ2hhbmdlKSBvcmlnQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICBvcmlnaW5cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtY2xvc2UtaWNvblwiKVxuICAgICAgICAuYXR0cihcInRpdGxlXCIsIFwiQ2xlYXIgdmFsdWVcIilcbiAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldE9yaWdpbih1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgIGZvcm1cbiAgICAgICAgLmFwcGVuZChcInNwYW5cIilcbiAgICAgICAgLmF0dHIoXG4gICAgICAgICAgICBcImNsYXNzXCIsXG4gICAgICAgICAgICBcIm1hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LXJldmVyc2UtaWNvbiBtYXBib3gtZGlyZWN0aW9ucy1yZXZlcnNlLWlucHV0XCJcbiAgICAgICAgKVxuICAgICAgICAuYXR0cihcInRpdGxlXCIsIFwiUmV2ZXJzZSBvcmlnaW4gJiBkZXN0aW5hdGlvblwiKVxuICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkaXJlY3Rpb25Qcm92aWRlcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvblByb3ZpZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvblByb3ZpZGVyc1trZXldID09PSB0cnVlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMucmV2ZXJzZSgpLnF1ZXJ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBrZXlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHZhciBkZXN0aW5hdGlvbiA9IGZvcm1cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibWFwYm94LWRpcmVjdGlvbnMtZGVzdGluYXRpb25cIik7XG5cbiAgICBkZXN0aW5hdGlvblxuICAgICAgICAuYXBwZW5kKFwibGFiZWxcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcGJveC1mb3JtLWxhYmVsXCIpXG4gICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1hcnJpdmUtaWNvblwiKTtcblxuICAgIHZhciBkZXN0aW5hdGlvbklucHV0ID0gZGVzdGluYXRpb25cbiAgICAgICAgLmFwcGVuZChcImlucHV0XCIpXG4gICAgICAgIC5hdHRyKFwidHlwZVwiLCBcInRleHRcIilcbiAgICAgICAgLmF0dHIoXCJyZXF1aXJlZFwiLCBcInJlcXVpcmVkXCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJhaXItZGVzdGluYXRpb24taW5wdXRcIilcbiAgICAgICAgLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIkVuZFwiKVxuICAgICAgICAub24oXCJpbnB1dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghZGVzdENoYW5nZSkgZGVzdENoYW5nZSA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgZGVzdGluYXRpb25cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtY2xvc2UtaWNvblwiKVxuICAgICAgICAuYXR0cihcInRpdGxlXCIsIFwiQ2xlYXIgdmFsdWVcIilcbiAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgdmFyIGRpcmVjdGlvblByb3ZpZGVycyA9IHtcbiAgICAgICAgbWFwYm94OiBmYWxzZSxcbiAgICAgICAgb3BlbnJvdXRlc2VydmljZTogZmFsc2UsXG4gICAgICAgIGdvb2dsZTogZmFsc2VcbiAgICB9O1xuXG4gICAgLy9PcHRpb25zIGJsb2NrIGZvciBNYXBib3ggY3ljbGluZyBwYXRoIGZpbmRpbmdcbiAgICB2YXIgbWFwYm94RGlyZWN0aW9ucyA9IGZvcm1cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIFwibWFwYm94LWRpcmVjdGlvbnNcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGVcIik7XG5cbiAgICBtYXBib3hEaXJlY3Rpb25zXG4gICAgICAgIC5hcHBlbmQoXCJpbnB1dFwiKVxuICAgICAgICAuYXR0cihcInR5cGVcIiwgXCJjaGVja2JveFwiKVxuICAgICAgICAuYXR0cihcIm5hbWVcIiwgXCJlbmFibGVkXCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJzaG93LW1hcGJveC1jeWNsaW5nXCIpXG4gICAgICAgIC5wcm9wZXJ0eShcImNoZWNrZWRcIiwgZmFsc2UpXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLm1hcGJveCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5xdWVyeSh7XG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBcIm1hcGJveFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgZGlyZWN0aW9uUHJvdmlkZXJzLm1hcGJveCA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgIC8vbWFwYm94RGlyZWN0aW9ucy5hcHBlbmQoJ2gzJylcbiAgICAvLy5hdHRyKCd2YWx1ZScsICdNQVBCT1gnKVxuICAgIC8vLmF0dHIoJ3N0eWxlJywgJ21hcmdpbjogNXB4IDBweCAwcHggNXB4JylcbiAgICAvLy50ZXh0KCdNQVBCT1ggRElSRUNUSU9OUycpO1xuXG4gICAgbWFwYm94RGlyZWN0aW9uc1xuICAgICAgICAuYXBwZW5kKFwibGFiZWxcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImFpci1oZWFkaW5nLWxhYmVsXCIpXG4gICAgICAgIC5hdHRyKFwiZm9yXCIsIFwic2hvdy1tYXBib3gtY3ljbGluZ1wiKVxuICAgICAgICAudGV4dChcIk1BUEJPWCBESVJFQ1RJT05TXCIpO1xuXG4gICAgdmFyIGdvb2dsZURpcmVjdGlvbnMgPSBmb3JtXG4gICAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcImdvb2dsZS1kaXJlY3Rpb25zLXByb2ZpbGVcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGVcIik7XG5cbiAgICBnb29nbGVEaXJlY3Rpb25zXG4gICAgICAgIC5hcHBlbmQoXCJpbnB1dFwiKVxuICAgICAgICAuYXR0cihcInR5cGVcIiwgXCJjaGVja2JveFwiKVxuICAgICAgICAuYXR0cihcIm5hbWVcIiwgXCJlbmFibGVkXCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJzaG93LWdvb2dsZS1jeWNsaW5nXCIpXG4gICAgICAgIC5wcm9wZXJ0eShcImNoZWNrZWRcIiwgZmFsc2UpXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLmdvb2dsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5xdWVyeSh7XG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBcImdvb2dsZVwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvblByb3ZpZGVycy5nb29nbGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICBnb29nbGVEaXJlY3Rpb25zXG4gICAgICAgIC5hcHBlbmQoXCJsYWJlbFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiYWlyLWhlYWRpbmctbGFiZWxcIilcbiAgICAgICAgLmF0dHIoXCJmb3JcIiwgXCJzaG93LWdvb2dsZS1jeWNsaW5nXCIpXG4gICAgICAgIC50ZXh0KFwiR09PR0xFIE1BUFNcIik7XG5cbiAgICAvL09wdGlvbnMgYmxvY2sgZm9yIE9wZW5Sb3V0ZVNlcnZpY2UgY3ljbGluZyBwYXRoIGZpbmRpbmdcbiAgICB2YXIgb3JzRGlyZWN0aW9ucyA9IGZvcm1cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIFwib3JzLWRpcmVjdGlvbnNcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGVcIik7XG5cbiAgICBvcnNEaXJlY3Rpb25zXG4gICAgICAgIC5hcHBlbmQoXCJpbnB1dFwiKVxuICAgICAgICAuYXR0cihcInR5cGVcIiwgXCJjaGVja2JveFwiKVxuICAgICAgICAuYXR0cihcIm5hbWVcIiwgXCJlbmFibGVkXCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJzaG93LW9ycy1jeWNsaW5nXCIpXG4gICAgICAgIC5wcm9wZXJ0eShcImNoZWNrZWRcIiwgZmFsc2UpXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLm9wZW5yb3V0ZXNlcnZpY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMucXVlcnkoe1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcjogXCJvcGVucm91dGVzZXJ2aWNlXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvcnNDeWNsaW5nT3B0aW9ucy5wcm9wZXJ0eShcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLm9wZW5yb3V0ZXNlcnZpY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBvcnNDeWNsaW5nT3B0aW9ucy5wcm9wZXJ0eShcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIG9yc0RpcmVjdGlvbnNcbiAgICAgICAgLmFwcGVuZChcImxhYmVsXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJhaXItaGVhZGluZy1sYWJlbFwiKVxuICAgICAgICAuYXR0cihcImZvclwiLCBcInNob3ctb3JzLWN5Y2xpbmdcIilcbiAgICAgICAgLnRleHQoXCJPUEVOUk9VVEVTRVJWSUNFXCIpO1xuXG4gICAgdmFyIG9yc0N5Y2xpbmdPcHRpb25zID0gb3JzRGlyZWN0aW9ucy5hcHBlbmQoXCJ1bFwiKTtcbiAgICBvcnNDeWNsaW5nT3B0aW9uc1xuICAgICAgICAuYXBwZW5kKFwibGlcIilcbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXBwZW5kKFwiaW5wdXRcIilcbiAgICAgICAgLmF0dHIoXCJ0eXBlXCIsIFwicmFkaW9cIilcbiAgICAgICAgLmF0dHIoXCJuYW1lXCIsIFwib3JzUHJvZmlsZUJpY3ljbGVcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcIm9ycy1iaWN5Y2xlXCIpXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBhbGVydChkKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFwcGVuZChcImxhYmVsXCIpXG4gICAgICAgIC5hdHRyKFwiZm9yXCIsIFwib3JzLWJpY3ljbGVcIilcbiAgICAgICAgLnRleHQoXCJOb3JtYWxcIik7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQod2F5cG9pbnQpIHtcbiAgICAgICAgaWYgKCF3YXlwb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH0gZWxzZSBpZiAod2F5cG9pbnQucHJvcGVydGllcy5uYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQucHJvcGVydGllcy5uYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBNYXRoLmNlaWwoTWF0aC5sb2cobWFwLmdldFpvb20oKSkgLyBNYXRoLkxOMilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLnRvRml4ZWQocHJlY2lzaW9uKSArXG4gICAgICAgICAgICAgICAgXCIsIFwiICtcbiAgICAgICAgICAgICAgICB3YXlwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXS50b0ZpeGVkKHByZWNpc2lvbilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQucHJvcGVydGllcy5xdWVyeSB8fCBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlyZWN0aW9uc1xuICAgICAgICAub24oXCJvcmlnaW5cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoXCJ2YWx1ZVwiLCBmb3JtYXQoZS5vcmlnaW4pKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwiZGVzdGluYXRpb25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eShcInZhbHVlXCIsIGZvcm1hdChlLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcImxvYWRcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoXCJ2YWx1ZVwiLCBmb3JtYXQoZS5vcmlnaW4pKTtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uSW5wdXQucHJvcGVydHkoXCJ2YWx1ZVwiLCBmb3JtYXQoZS5kZXN0aW5hdGlvbikpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyksXG4gICAgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtaW5zdHJ1Y3Rpb25zJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignc2VsZWN0Um91dGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgcm91dGUgPSBlLnJvdXRlO1xuXG4gICAgICAgIGNvbnRhaW5lci5odG1sKCcnKTtcblxuICAgICAgICB2YXIgc3RlcHMgPSBjb250YWluZXIuYXBwZW5kKCdvbCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcHMnKVxuICAgICAgICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmRhdGEocm91dGUuc3RlcHMpXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwJyk7XG5cbiAgICAgICAgc3RlcHMuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAucHJvcGVydGllcy50eXBlID09PSAncGF0aCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1jb250aW51ZS1pY29uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RlcC5wcm9wZXJ0aWVzLnR5cGUgPT09ICdzd2l0Y2hfcG9pbnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBhaXItJyArIHN0ZXAucHJvcGVydGllcy5zd2l0Y2hfdHlwZS50b0xvd2VyQ2FzZSgpICsgJy1pY29uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcC1tYW5ldXZlcicpXG4gICAgICAgICAgICAuaHRtbChmdW5jdGlvbiAoc3RlcCkgeyBcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5wcm9wZXJ0aWVzLnR5cGUgPT09ICdwYXRoJykgeyBcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdGVwLnByb3BlcnRpZXMubW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncHJpdmF0ZV9jYXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnRHJpdmluZyc7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZm9vdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdXYWxraW5nJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JpY3ljbGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnQ3ljbGluZyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLnByb3BlcnRpZXMudGl0bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RlcC5wcm9wZXJ0aWVzLnR5cGUgPT09ICdzd2l0Y2hfcG9pbnQnKSB7IFxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcC5wcm9wZXJ0aWVzLnN3aXRjaF90eXBlID09PSAndW5kZXJncm91bmRfc3RhdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLnByb3BlcnRpZXMudGl0bGUgKyAnOiBQbGF0Zm9ybSAnICsgc3RlcC5wcm9wZXJ0aWVzLnBsYXRmb3JtO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLnByb3BlcnRpZXMudGl0bGU7IFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcC1kaXN0YW5jZScpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLnByb3BlcnRpZXMuZGlzdGFuY2UgPyBmb3JtYXRbZGlyZWN0aW9ucy5vcHRpb25zLnVuaXRzXShzdGVwLnByb3BlcnRpZXMuZGlzdGFuY2UpIDogJyc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignbW91c2VvdmVyJywgZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0U3RlcChzdGVwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RlcHMub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRTdGVwKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgaWYgKHN0ZXAubG9jKSB7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhzdGVwLmxvYykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlYm91bmNlID0gcmVxdWlyZSgnZGVib3VuY2UnKTtcblxudmFyIExheWVyID0gTC5MYXllckdyb3VwLmV4dGVuZCh7XG4gICAgb3B0aW9uczoge1xuICAgICAgICByZWFkb25seTogZmFsc2VcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oZGlyZWN0aW9ucywgb3B0aW9ucykge1xuICAgICAgICBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnMgPSBkaXJlY3Rpb25zIHx8IG5ldyBMLkRpcmVjdGlvbnMoKTtcbiAgICAgICAgTC5MYXllckdyb3VwLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX2RyYWcgPSBkZWJvdW5jZShMLmJpbmQodGhpcy5fZHJhZywgdGhpcyksIDEwMCk7XG5cbiAgICAgICAgdGhpcy5vcmlnaW5NYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogIXRoaXMub3B0aW9ucy5yZWFkb25seSxcbiAgICAgICAgICAgIGljb246IEwubWFwYm94Lm1hcmtlci5pY29uKHtcbiAgICAgICAgICAgICAgICAnbWFya2VyLXNpemUnOiAnbWVkaXVtJyxcbiAgICAgICAgICAgICAgICAnbWFya2VyLWNvbG9yJzogJyMzQkIyRDAnLFxuICAgICAgICAgICAgICAgICdtYXJrZXItc3ltYm9sJzogJ2EnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25NYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogIXRoaXMub3B0aW9ucy5yZWFkb25seSxcbiAgICAgICAgICAgIGljb246IEwubWFwYm94Lm1hcmtlci5pY29uKHtcbiAgICAgICAgICAgICAgICAnbWFya2VyLXNpemUnOiAnbWVkaXVtJyxcbiAgICAgICAgICAgICAgICAnbWFya2VyLWNvbG9yJzogJyM0NDQnLFxuICAgICAgICAgICAgICAgICdtYXJrZXItc3ltYm9sJzogJ2InXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc3RlcE1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgaWNvbjogTC5kaXZJY29uKHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdtYXBib3gtbWFya2VyLWRyYWctaWNvbiBtYXBib3gtbWFya2VyLWRyYWctaWNvbi1zdGVwJyxcbiAgICAgICAgICAgICAgICBpY29uU2l6ZTogbmV3IEwuUG9pbnQoMTIsIDEyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kcmFnTWFya2VyID0gTC5tYXJrZXIoWzAsIDBdLCB7XG4gICAgICAgICAgICBkcmFnZ2FibGU6ICF0aGlzLm9wdGlvbnMucmVhZG9ubHksXG4gICAgICAgICAgICBpY29uOiB0aGlzLl93YXlwb2ludEljb24oKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXJcbiAgICAgICAgICAgIC5vbignZHJhZ3N0YXJ0JywgdGhpcy5fZHJhZ1N0YXJ0LCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcylcbiAgICAgICAgICAgIC5vbignZHJhZ2VuZCcsIHRoaXMuX2RyYWdFbmQsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucm91dGVMYXllciA9IEwubWFwYm94LmZlYXR1cmVMYXllcigpO1xuICAgICAgICB0aGlzLnJvdXRlSGlnaGxpZ2h0TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoKTtcbiAgICAgICAgdGhpcy50cmFja0xheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKCk7XG5cbiAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMgPSBbXTtcbiAgICB9LFxuXG4gICAgb25BZGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLm9uQWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVhZG9ubHkpIHtcbiAgICAgICAgICB0aGlzLl9tYXBcbiAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuX2NsaWNrLCB0aGlzKVxuICAgICAgICAgICAgICAub24oJ21vdXNlbW92ZScsIHRoaXMuX21vdXNlbW92ZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zXG4gICAgICAgICAgICAub24oJ29yaWdpbicsIHRoaXMuX29yaWdpbiwgdGhpcylcbiAgICAgICAgICAgIC5vbignZGVzdGluYXRpb24nLCB0aGlzLl9kZXN0aW5hdGlvbiwgdGhpcylcbiAgICAgICAgICAgIC5vbignbG9hZCcsIHRoaXMuX2xvYWQsIHRoaXMpXG4gICAgICAgICAgICAub24oJ3VubG9hZCcsIHRoaXMuX3VubG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vbignc2VsZWN0Um91dGUnLCB0aGlzLl9zZWxlY3RSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vbignc2VsZWN0VHJhY2snLCB0aGlzLl9zZWxlY3RUcmFjaywgdGhpcylcbiAgICAgICAgICAgIC5vbignaGlnaGxpZ2h0Um91dGUnLCB0aGlzLl9oaWdobGlnaHRSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vbignaGlnaGxpZ2h0U3RlcCcsIHRoaXMuX2hpZ2hsaWdodFN0ZXAsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvblJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnNcbiAgICAgICAgICAgIC5vZmYoJ29yaWdpbicsIHRoaXMuX29yaWdpbiwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2Rlc3RpbmF0aW9uJywgdGhpcy5fZGVzdGluYXRpb24sIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdsb2FkJywgdGhpcy5fbG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3VubG9hZCcsIHRoaXMuX3VubG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3NlbGVjdFJvdXRlJywgdGhpcy5fc2VsZWN0Um91dGUsIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdzZWxlY3RUcmFjaycsIHRoaXMuX3NlbGVjdFRyYWNrLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignaGlnaGxpZ2h0Um91dGUnLCB0aGlzLl9oaWdobGlnaHRSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2hpZ2hsaWdodFN0ZXAnLCB0aGlzLl9oaWdobGlnaHRTdGVwLCB0aGlzKTtcblxuICAgICAgICB0aGlzLl9tYXBcbiAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywgdGhpcy5fY2xpY2ssIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdtb3VzZW1vdmUnLCB0aGlzLl9tb3VzZW1vdmUsIHRoaXMpO1xuXG4gICAgICAgIEwuTGF5ZXJHcm91cC5wcm90b3R5cGUub25SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgX2NsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlyZWN0aW9ucy5nZXRPcmlnaW4oKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXRPcmlnaW4oZS5sYXRsbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9kaXJlY3Rpb25zLmdldERlc3RpbmF0aW9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24oZS5sYXRsbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiAodGhpcy5fZGlyZWN0aW9ucy5xdWVyeWFibGUoKSkge1xuICAgICAgICAgICAgLy90aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5KCk7XG4gICAgICAgIC8vfVxuICAgIH0sXG5cbiAgICBfbW91c2Vtb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghdGhpcy5yb3V0ZUxheWVyIHx8ICF0aGlzLmhhc0xheWVyKHRoaXMucm91dGVMYXllcikgfHwgdGhpcy5fY3VycmVudFdheXBvaW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwID0gdGhpcy5fcm91dGVQb2x5bGluZSgpLmNsb3Nlc3RMYXllclBvaW50KGUubGF5ZXJQb2ludCk7XG5cbiAgICAgICAgaWYgKCFwIHx8IHAuZGlzdGFuY2UgPiAxNSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtID0gdGhpcy5fbWFwLnByb2plY3QoZS5sYXRsbmcpLFxuICAgICAgICAgICAgbyA9IHRoaXMuX21hcC5wcm9qZWN0KHRoaXMub3JpZ2luTWFya2VyLmdldExhdExuZygpKSxcbiAgICAgICAgICAgIGQgPSB0aGlzLl9tYXAucHJvamVjdCh0aGlzLmRlc3RpbmF0aW9uTWFya2VyLmdldExhdExuZygpKTtcblxuICAgICAgICBpZiAoby5kaXN0YW5jZVRvKG0pIDwgMTUgfHwgZC5kaXN0YW5jZVRvKG0pIDwgMTUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdyA9IHRoaXMuX21hcC5wcm9qZWN0KHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLmdldExhdExuZygpKTtcbiAgICAgICAgICAgIGlmIChpICE9PSB0aGlzLl9jdXJyZW50V2F5cG9pbnQgJiYgdy5kaXN0YW5jZVRvKG0pIDwgMTUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnTWFya2VyLnNldExhdExuZyh0aGlzLl9tYXAubGF5ZXJQb2ludFRvTGF0TG5nKHApKTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgIH0sXG5cbiAgICBfb3JpZ2luOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLm9yaWdpbiAmJiBlLm9yaWdpbi5nZW9tZXRyeS5jb29yZGluYXRlcykge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5NYXJrZXIuc2V0TGF0TG5nKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLm9yaWdpbi5nZW9tZXRyeS5jb29yZGluYXRlcykpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLm9yaWdpbk1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMub3JpZ2luTWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZGVzdGluYXRpb246IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuZGVzdGluYXRpb24gJiYgZS5kZXN0aW5hdGlvbi5nZW9tZXRyeS5jb29yZGluYXRlcykge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk1hcmtlci5zZXRMYXRMbmcoTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUuZGVzdGluYXRpb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5kZXN0aW5hdGlvbk1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZGVzdGluYXRpb25NYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kcmFnU3RhcnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmRyYWdNYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRXYXlwb2ludCA9IHRoaXMuX2ZpbmRXYXlwb2ludEluZGV4KGUudGFyZ2V0LmdldExhdExuZygpKTtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuYWRkV2F5cG9pbnQodGhpcy5fY3VycmVudFdheXBvaW50LCBlLnRhcmdldC5nZXRMYXRMbmcoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50V2F5cG9pbnQgPSB0aGlzLndheXBvaW50TWFya2Vycy5pbmRleE9mKGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZHJhZzogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbGF0TG5nID0gZS50YXJnZXQuZ2V0TGF0TG5nKCk7XG5cbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLm9yaWdpbk1hcmtlcikge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXRPcmlnaW4obGF0TG5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChlLnRhcmdldCA9PT0gdGhpcy5kZXN0aW5hdGlvbk1hcmtlcikge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihsYXRMbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXRXYXlwb2ludCh0aGlzLl9jdXJyZW50V2F5cG9pbnQsIGxhdExuZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9ucy5xdWVyeWFibGUoKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5xdWVyeSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kcmFnRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFdheXBvaW50ID0gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlV2F5cG9pbnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5yZW1vdmVXYXlwb2ludCh0aGlzLndheXBvaW50TWFya2Vycy5pbmRleE9mKGUudGFyZ2V0KSkucXVlcnkoKTtcbiAgICB9LFxuXG4gICAgX2xvYWQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5fb3JpZ2luKGUpO1xuICAgICAgICB0aGlzLl9kZXN0aW5hdGlvbihlKTtcblxuICAgICAgICBmdW5jdGlvbiB3YXlwb2ludExhdExuZyhpKSB7XG4gICAgICAgICAgICByZXR1cm4gTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUud2F5cG9pbnRzW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsID0gTWF0aC5taW4odGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoLCBlLndheXBvaW50cy5sZW5ndGgpLFxuICAgICAgICAgICAgaSA9IDA7XG5cbiAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nXG4gICAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLndheXBvaW50TWFya2Vyc1tpXS5zZXRMYXRMbmcod2F5cG9pbnRMYXRMbmcoaSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIG5ld1xuICAgICAgICBmb3IgKDsgaSA8IGUud2F5cG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgd2F5cG9pbnRNYXJrZXIgPSBMLm1hcmtlcih3YXlwb2ludExhdExuZyhpKSwge1xuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogIXRoaXMub3B0aW9ucy5yZWFkb25seSxcbiAgICAgICAgICAgICAgICBpY29uOiB0aGlzLl93YXlwb2ludEljb24oKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHdheXBvaW50TWFya2VyXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuX3JlbW92ZVdheXBvaW50LCB0aGlzKVxuICAgICAgICAgICAgICAgIC5vbignZHJhZ3N0YXJ0JywgdGhpcy5fZHJhZ1N0YXJ0LCB0aGlzKVxuICAgICAgICAgICAgICAgIC5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnZW5kJywgdGhpcy5fZHJhZ0VuZCwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMud2F5cG9pbnRNYXJrZXJzLnB1c2god2F5cG9pbnRNYXJrZXIpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih3YXlwb2ludE1hcmtlcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgb2xkXG4gICAgICAgIGZvciAoOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy53YXlwb2ludE1hcmtlcnNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoID0gZS53YXlwb2ludHMubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBfdW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMudHJhY2tMYXllcik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy53YXlwb2ludE1hcmtlcnNbaV0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZWxlY3RSb3V0ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLnJvdXRlTGF5ZXJcbiAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAuc2V0R2VvSlNPTihlLnJvdXRlLmdlb21ldHJ5KTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgIH0sXG5cbiAgICBfc2VsZWN0VHJhY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy50cmFja0xheWVyXG4gICAgICAgICAgICAuY2xlYXJMYXllcnMoKVxuICAgICAgICAgICAgLnNldEdlb0pTT04oZS50cmFjayk7XG4gICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy50cmFja0xheWVyKTtcbiAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgIH0sXG5cbiAgICBfaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucm91dGUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVIaWdobGlnaHRMYXllclxuICAgICAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAgICAgLnNldEdlb0pTT04oZS5yb3V0ZS5nZW9tZXRyeSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMucm91dGVIaWdobGlnaHRMYXllcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMucm91dGVIaWdobGlnaHRMYXllcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hpZ2hsaWdodFN0ZXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuc3RlcCAmJiBlLnN0ZXAubG9jKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBNYXJrZXIuc2V0TGF0TG5nKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLnN0ZXAubG9jKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuc3RlcE1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMuc3RlcE1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JvdXRlUG9seWxpbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZUxheWVyLmdldExheWVycygpWzBdO1xuICAgIH0sXG5cbiAgICBfZmluZFdheXBvaW50SW5kZXg6IGZ1bmN0aW9uKGxhdExuZykge1xuICAgICAgICB2YXIgc2VnbWVudCA9IHRoaXMuX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50KGxhdExuZyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLl9maW5kTmVhcmVzdFJvdXRlU2VnbWVudCh0aGlzLndheXBvaW50TWFya2Vyc1tpXS5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICBpZiAocyA+IHNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7XG4gICAgfSxcblxuICAgIF9maW5kTmVhcmVzdFJvdXRlU2VnbWVudDogZnVuY3Rpb24obGF0TG5nKSB7XG4gICAgICAgIHZhciBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgcCA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQobGF0TG5nKSxcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IHRoaXMuX3JvdXRlUG9seWxpbmUoKS5fb3JpZ2luYWxQb2ludHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBkID0gTC5MaW5lVXRpbC5fc3FDbG9zZXN0UG9pbnRPblNlZ21lbnQocCwgcG9zaXRpb25zW2kgLSAxXSwgcG9zaXRpb25zW2ldLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChkIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgbWluID0gZDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuICAgIF93YXlwb2ludEljb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTC5kaXZJY29uKHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcGJveC1tYXJrZXItZHJhZy1pY29uJyxcbiAgICAgICAgICAgIGljb25TaXplOiBuZXcgTC5Qb2ludCgxMiwgMTIpXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRpcmVjdGlvbnMsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IExheWVyKGRpcmVjdGlvbnMsIG9wdGlvbnMpO1xufTtcbiIsIi8qIEBmbG93ICovXG52YXIgZG9tID0gZG9jdW1lbnQ7IC8vIHRoaXMgdG8gY2xhaW0gdGhhdCB3ZSB1c2UgdGhlIGRvbSBhcGksIG5vdCByZXByZXNlbnRhdGl2ZSBvZiB0aGUgcGFnZSBkb2N1bWVudFxuXG52YXIgUGFnaW5nQ29udHJvbCA9IGZ1bmN0aW9uKFxuICAgIGVsZW1lbnQgLyo6IEVsZW1lbnQgKi8gLFxuICAgIG9wdGlvbnMgLyo6ID9PYmplY3QgKi9cbikge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLmRpc3BsYXllZCA9IG9wdGlvbnMuZGlzcGxheWVkIHx8IDEwO1xuICAgIG9wdGlvbnMudG90YWwgPSBvcHRpb25zLnRvdGFsIHx8IDEwO1xuXG4gICAgdGhpcy51cGRhdGUob3B0aW9ucyk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IDE7XG5cbiAgICAvLyBzZXQgZW1wdHkgZXZlbnQgaGFuZGxlcnNcbiAgICB0aGlzLm9uU2VsZWN0ZWQoZnVuY3Rpb24oKSB7fSk7XG59O1xuXG5QYWdpbmdDb250cm9sLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhW3JlbD1wYWdlXScpLFxuICAgICAgICBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgKTtcbn07XG5cbnZhciBjYWxjUmFuZ2UgPSBmdW5jdGlvbihmb2N1cywgZGlzcGxheWVkLCB0b3RhbCkge1xuICAgIHZhciBoYWxmID0gTWF0aC5mbG9vcihkaXNwbGF5ZWQgLyAyKTtcbiAgICB2YXIgcGFnZU1heCA9IE1hdGgubWluKHRvdGFsLCBkaXNwbGF5ZWQpO1xuICAgIGlmIChmb2N1cyAtIGhhbGYgPCAxKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDogMSxcbiAgICAgICAgICAgIGVuZDogcGFnZU1heFxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoZm9jdXMgKyBoYWxmID4gdG90YWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0OiB0b3RhbCAtIGRpc3BsYXllZCArIDEsXG4gICAgICAgICAgICBlbmQ6IHRvdGFsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBmb2N1cyAtIGhhbGYsXG4gICAgICAgIGVuZDogZm9jdXMgKyBoYWxmXG4gICAgfTtcbn07XG5cblBhZ2luZ0NvbnRyb2wucHJvdG90eXBlLm9uU2VsZWN0ZWQgPSBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXNwbGF5ZWQgPSB0aGlzLm9wdGlvbnMuZGlzcGxheWVkO1xuXG4gICAgdGhpcy5vblNlbGVjdGVkSGFuZGxlciA9IGZ1bmN0aW9uKHBhZ2VObykge1xuICAgICAgICBzZWxmLmNsZWFyKCk7XG4gICAgICAgIHZhciByYW5nZSA9IGNhbGNSYW5nZShwYWdlTm8sIGRpc3BsYXllZCwgc2VsZi5vcHRpb25zLnRvdGFsKTtcbiAgICAgICAgc2VsZi5yZW5kZXJQYWdlcyhyYW5nZS5zdGFydCwgcmFuZ2UuZW5kLCBwYWdlTm8pO1xuICAgICAgICByZXR1cm4gaGFuZGxlcihwYWdlTm8pO1xuICAgIH07XG59O1xuXG5QYWdpbmdDb250cm9sLnByb3RvdHlwZS5yZW5kZXJQYWdlcyA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIHNlbGVjdGVkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBnZW5IYW5kbGVyID0gZnVuY3Rpb24ocGFnZU5vKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYub25TZWxlY3RlZEhhbmRsZXIocGFnZU5vKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgIHZhciBwYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBwYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2VuSGFuZGxlcihpKSk7XG4gICAgICAgIHBhZ2UucmVsID0gJ3BhZ2UnO1xuICAgICAgICBwYWdlLmhyZWYgPSAnIyc7XG4gICAgICAgIHBhZ2UudGV4dENvbnRlbnQgPSBpO1xuICAgICAgICBpZiAoaSA9PT0gc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHBhZ2UuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChwYWdlKTtcbiAgICB9XG59O1xuXG5QYWdpbmdDb250cm9sLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5yZW5kZXJQYWdlcygxLCBNYXRoLm1pbihvcHRpb25zLnRvdGFsLCBvcHRpb25zLmRpc3BsYXllZCksIDEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYWdpbmdDb250cm9sO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXAsIHNlbGVjdGlvbiA9IDA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZXMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgIHZhciByb3V0ZXMgPSBjb250YWluZXIuYXBwZW5kKCd1bCcpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZGF0YShlLnJvdXRlcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlJyk7XG5cbiAgICAgICAgcm91dGVzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWhlYWRpbmcnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiAnUm91dGUgJyArIChlLnJvdXRlcy5pbmRleE9mKHJvdXRlKSArIDEpOyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLXN1bW1hcnknKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZS5zdW1tYXJ5OyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWRldGFpbHMnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdFtkaXJlY3Rpb25zLm9wdGlvbnMudW5pdHNdKHJvdXRlLmRpc3RhbmNlKSArICcsICcgKyBmb3JtYXQuZHVyYXRpb24ocm91dGUuZHVyYXRpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0Um91dGUocm91dGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRSb3V0ZShudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZWxlY3RSb3V0ZShyb3V0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRpcmVjdGlvbnMuc2VsZWN0Um91dGUoZS5yb3V0ZXNbMF0pO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignc2VsZWN0Um91dGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXIuc2VsZWN0QWxsKCcubWFwYm94LWRpcmVjdGlvbnMtcm91dGUnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWFjdGl2ZScsIGZ1bmN0aW9uIChyb3V0ZSkgeyByZXR1cm4gcm91dGUgPT09IGUucm91dGU7IH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiLyogQGZsb3cgKi9cblxudmFyIHJlbmRlclJvdyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgZGF0YSkge1xuICAgIHZhciByb3cgPSBjb250YWluZXIuaW5zZXJ0Um93KCk7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHN0cikge1xuICAgICAgICB2YXIgY2VsbCA9IHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSBzdHI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdztcbn07XG5cbnZhciByZW5kZXJIZWFkZXIgPSBmdW5jdGlvbihjb250YWluZXIsIGRhdGEpIHtcbiAgICB2YXIgcm93ID0gY29udGFpbmVyLmluc2VydFJvdygpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgdmFyIHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgdGguaW5uZXJIVE1MID0gc3RyO1xuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodGgpO1xuICAgIH0pO1xuICAgIHJldHVybiByb3c7XG59O1xuXG52YXIgVGFibGVDb250cm9sID0gZnVuY3Rpb24oXG4gICAgZWxlbWVudCAvKjogT2JqZWN0ICovLCAvKiBUYWJsZUVsZW1lbnQgKi9cbiAgICBoZWFkZXJzIC8qOiBbc3RyaW5nXSAqLyxcbiAgICBtb2RlbCAvKjogP1tbc3RyaW5nXV0gKi9cbikge1xuICAgIHJlbmRlckhlYWRlcihlbGVtZW50LmNyZWF0ZVRIZWFkKCksIGhlYWRlcnMpO1xuICAgIHRoaXMudGJvZHkgPSBlbGVtZW50LmNyZWF0ZVRCb2R5KCk7XG4gICAgdGhpcy5iaW5kKG1vZGVsIHx8IFtdKTtcbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB3aGlsZSAodGhpcy50Ym9keS5oYXNDaGlsZE5vZGVzKCkpIHsgICBcbiAgICAgICAgdGhpcy50Ym9keS5yZW1vdmVDaGlsZCh0aGlzLnRib2R5LmZpcnN0Q2hpbGQpO1xuICAgIH1cbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUub25TZWxlY3RlZCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICB0aGlzLm9uU2VsZWN0ZWRIYW5kbGVyID0gaGFuZGxlcjtcbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIC8vIGRlYWwgd2l0aCBjbG9zdXJlXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB2YXIgcm93ID0gcmVuZGVyUm93KHNlbGYudGJvZHksIGRhdGEpO1xuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9uU2VsZWN0ZWRIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vblNlbGVjdGVkSGFuZGxlcihkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlQ29udHJvbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRhYmxlQ29udHJvbCA9IHJlcXVpcmUoJy4vdGFibGVfY29udHJvbC5qcycpLCBcbiAgICBwYWdpbmdDb250cm9sID0gcmVxdWlyZSgnLi9wYWdpbmdfY29udHJvbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcDtcbiAgICB2YXIgb3JpZ0NoYW5nZSA9IGZhbHNlLCBkZXN0Q2hhbmdlID0gZmFsc2U7XG4gICAgdmFyIFRSQUNLSU5GT19BUElfVVJMID0gXCJodHRwczovL2x1bGl1Lm1lL3RyYWNrcy9hcGkvdjEvdHJhY2tpbmZvXCI7XG4gICAgdmFyIFRSQUNLX0FQSV9VUkwgPSBcImh0dHBzOi8vbHVsaXUubWUvdHJhY2tzL2FwaS92MS90cmFja3NcIjtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbihfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICAvLyBnZXQgcGFnZSAxIG9mIHRyYWNraW5mbyBhcyBpbml0IGRhdGEgZm9yIHRoZSB0YWJsZVxuICAgIC8vIFdlYiBicm93c2VyIGNvbXBhdGliaWxpdHk6XG4gICAgLy8gZm9yIElFNyssIEZpcmVmb3gsIENocm9tZSwgT3BlcmEsIFNhZmFyaVxuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8dGFibGUgaWQ9XCJ0cmFja3MtdGFibGVcIiBjbGFzcz1cInByb3NlIGFpci10cmFja3NcIj48L3RhYmxlPicpO1xuICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICc8ZGl2IGlkPVwicGFnaW5nXCIgZGF0YS1jb250cm9sPVwicGFnaW5nXCI+PC9kaXY+Jyk7XG5cbiAgICB2YXIgdHJhY2tpbmZvS2V5cyA9IFtcbiAgICAgICAgJ0lEJywgJ1NlZ21lbnRzJywgJzJEIGxlbmd0aCcsICczRCBsZW5ndGgnLCAnTW92aW5nIHRpbWUnLCAnU3RvcHBlZCB0aW1lJywgXG4gICAgICAgICdNYXggc3BlZWQnLCAnVXBoaWxsJywgJ0Rvd25oaWxsJywgJ1N0YXJ0ZWQgYXQnLCAnRW5kZWQgYXQnLCAnUG9pbnRzJywgXG4gICAgICAgICdTdGFydCBsb24nLCAnU3RhcnQgbGF0JywgJ0VuZCBsb24nLCAnRW5kIGxhdCdcbiAgICBdLFxuICAgIHZhbHVlcyA9IFtdO1xuICAgIHZhciBwYWdlID0gMSwgdG90YWxQYWdlcyA9IDEsIG51bVJlc3VsdHMgPSAxO1xuICAgIHZhciB0YyA9IG5ldyB0YWJsZUNvbnRyb2woZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYWNrcy10YWJsZScpLCBcbiAgICAgICAgICAgIHRyYWNraW5mb0tleXMsIHZhbHVlcyk7XG4gICAgdmFyIHBnID0gbmV3IHBhZ2luZ0NvbnRyb2woZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2luZycpLCBcbiAgICAgICAgICAgIHtkaXNwbGF5ZWQ6IDAsIHRvdGFsOiAwfSk7XG5cbiAgICB2YXIgdHJhY2tpbmZvWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdHJhY2tpbmZvWGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHJhY2tpbmZvWGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgdHJhY2tpbmZvWGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICB2YXIgdHJhY2tpbmZvRGF0YSA9IEpTT04ucGFyc2UodHJhY2tpbmZvWGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB0b3RhbFBhZ2VzID0gdHJhY2tpbmZvRGF0YS50b3RhbF9wYWdlcztcbiAgICAgICAgICAgIHBhZ2UgPSB0cmFja2luZm9EYXRhLnBhZ2U7XG4gICAgICAgICAgICBudW1SZXN1bHRzID0gdHJhY2tpbmZvRGF0YS5udW1fcmVzdWx0cztcbiAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgdHJhY2tpbmZvRGF0YS5vYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0cmFja2luZm9LZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChyb3cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0Yy5iaW5kKHZhbHVlcyk7XG4gICAgICAgICAgICBwZy51cGRhdGUoeyBkaXNwbGF5ZWQ6IDEwLCB0b3RhbDogdG90YWxQYWdlcyB9KTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgdHJhY2tpbmZvWGhyLm9wZW4oXCJHRVRcIiwgVFJBQ0tJTkZPX0FQSV9VUkwsIHRydWUpO1xuICAgIHRyYWNraW5mb1hoci5zZW5kKCk7XG5cbiAgICB0Yy5vblNlbGVjdGVkKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKFtkYXRhWzEyXSwgZGF0YVsxM11dKTtcbiAgICAgICAgdmFyIGVuZFBvcyA9IEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhbZGF0YVsxNF0sIGRhdGFbMTVdXSk7XG4gICAgICAgIGRpcmVjdGlvbnMuc2V0T3JpZ2luKHN0YXJ0UG9zKTtcbiAgICAgICAgZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihlbmRQb3MpO1xuICAgICAgICB2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcoXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhcnRQb3MubGF0LCBlbmRQb3MubGF0KSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhcnRQb3MubG5nLCBlbmRQb3MubG5nKSksXG4gICAgICAgICAgICBub3J0aEVhc3QgPSBMLmxhdExuZyhcbiAgICAgICAgICAgICAgICBNYXRoLm1heChzdGFydFBvcy5sYXQsIGVuZFBvcy5sYXQpLFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0UG9zLmxuZywgZW5kUG9zLmxuZykpLFxuICAgICAgICAgICAgYm91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XG4gICAgICAgIC8vIFdlYiBicm93c2VyIGNvbXBhdGliaWxpdHk6IFxuICAgICAgICAvLyBJRTcrLCBGaXJlZm94LCBDaHJvbWUsIE9wZXJhLCBTYWZhcmlcbiAgICAgICAgdmFyIHRyYWNrWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRyYWNrWGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRyYWNrWGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgdHJhY2tYaHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJhY2tEYXRhID0gSlNPTi5wYXJzZSh0cmFja1hoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuc2VsZWN0VHJhY2sodHJhY2tEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0cmFja1hoci5vcGVuKFwiR0VUXCIsIFRSQUNLX0FQSV9VUkwgKyBcIi9cIiArIGRhdGFbMF0sIHRydWUpO1xuICAgICAgICB0cmFja1hoci5zZW5kKCk7XG4gICAgfSk7XG5cbiAgICBwZy5vblNlbGVjdGVkKGZ1bmN0aW9uKHBhZ2VObykge1xuICAgICAgICB2YXIgcGFnZWRUcmFja2luZm9YaHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcGFnZWRUcmFja2luZm9YaHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocGFnZWRUcmFja2luZm9YaHIucmVhZHlTdGF0ZSA9PT0gNCAmJiBwYWdlZFRyYWNraW5mb1hoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHZhciB0cmFja2luZm9EYXRhID0gSlNPTi5wYXJzZShwYWdlZFRyYWNraW5mb1hoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgMyB2YXJpYWJsZXMgY2FuIGJlIGFxdWlyZWQgZnJvbSB0aGUgcmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgLy8gYnV0IHVzZWxlc3MgZm9yIHRoZSBtb21lbnRcbiAgICAgICAgICAgICAgICAvL3RvdGFsUGFnZXMgPSB0cmFja2luZm9EYXRhLnRvdGFsX3BhZ2VzO1xuICAgICAgICAgICAgICAgIC8vcGFnZSA9IHRyYWNraW5mb0RhdGEucGFnZTtcbiAgICAgICAgICAgICAgICAvL251bVJlc3VsdHMgPSB0cmFja2luZm9EYXRhLm51bV9yZXN1bHRzO1xuICAgICAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHRyYWNraW5mb0RhdGEub2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRyYWNraW5mb0tleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGMuYmluZCh2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhZ2VkVHJhY2tpbmZvWGhyLm9wZW4oXCJHRVRcIiwgVFJBQ0tJTkZPX0FQSV9VUkwgKyBcIj9wYWdlPVwiICsgcGFnZU5vLCB0cnVlKTtcbiAgICAgICAgcGFnZWRUcmFja2luZm9YaHIuc2VuZCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIl19
;