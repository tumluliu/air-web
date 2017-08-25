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
            profile: "cycling"
        },
        openrouteservice: {
            api_template:
                "https://api.openrouteservice.org/corsdirections?&coordinates={coordinates}&instructions=false&preference={preference}&profile={profile}&api_key={token}",
            key: "58d904a497c67e00015b45fcf243eacf4b25434c6e28d7fd61c9d309",
            preference: "",
            profile: "cycling-regular"
        },
        google: {
            api_template:
                "https://luliu.me/gmapswrapper?origin={origin}&destination={destination}&mode=bicycling&key={token}",
            key: "AIzaSyDc2gadWI4nunYb0i5Mx_P3AH_yDTiMzAY",
            profile: "bicycling"
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
                .join("|");
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
                    type: "LineString",
                    coordinates: polyline
                        .decode(route.geometry)
                        .map(function(c) {
                            return c.reverse();
                        })
                };
            });
        }
        if (provider === "google") {
            this.directions.origin = this.origin;
            this.directions.destination = this.destination;
            this.directions.waypoints = [];
            this.directions.routes.forEach(function(route) {
                route.geometry = {
                    type: "LineString",
                    coordinates: polyline
                        .decode(route.overview_polyline.points)
                        .map(function(c) {
                            return c.reverse();
                        })
                };
            });
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9pbmRleC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9saWIvZDMuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvbm9kZV9tb2R1bGVzL0BtYXBib3gvY29yc2xpdGUvY29yc2xpdGUuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvbm9kZV9tb2R1bGVzL0BtYXBib3gvcG9seWxpbmUvc3JjL3BvbHlsaW5lLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL25vZGVfbW9kdWxlcy9kZWJvdW5jZS9pbmRleC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9ub2RlX21vZHVsZXMvcXVldWUtYXN5bmMvYnVpbGQvcXVldWUuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2RpcmVjdGlvbnMuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2Vycm9yc19jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9mb3JtYXQuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2dldF9yZXF1ZXN0LmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9pbnB1dF9jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9pbnN0cnVjdGlvbnNfY29udHJvbC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9zcmMvbGF5ZXIuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL3BhZ2luZ19jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9yb3V0ZXNfY29udHJvbC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9zcmMvdGFibGVfY29udHJvbC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9zcmMvdHJhY2tzX2NvbnRyb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1aENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaWYgKCFMLm1hcGJveCkgdGhyb3cgbmV3IEVycm9yKCdpbmNsdWRlIG1hcGJveC5qcyBiZWZvcmUgYWlyLmpzJyk7XG5cbkwuYWlyID0gcmVxdWlyZSgnLi9zcmMvZGlyZWN0aW9ucycpO1xuTC5haXIuZm9ybWF0ID0gcmVxdWlyZSgnLi9zcmMvZm9ybWF0Jyk7XG5MLmFpci5sYXllciA9IHJlcXVpcmUoJy4vc3JjL2xheWVyJyk7XG5MLmFpci5pbnB1dENvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9pbnB1dF9jb250cm9sJyk7XG5MLmFpci5lcnJvcnNDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvZXJyb3JzX2NvbnRyb2wnKTtcbkwuYWlyLnJvdXRlc0NvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9yb3V0ZXNfY29udHJvbCcpO1xuTC5haXIuaW5zdHJ1Y3Rpb25zQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2luc3RydWN0aW9uc19jb250cm9sJyk7XG5MLmFpci50cmFja3NDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvdHJhY2tzX2NvbnRyb2wuanMnKTtcbiIsIiFmdW5jdGlvbigpe1xuICB2YXIgZDMgPSB7dmVyc2lvbjogXCIzLjQuMVwifTsgLy8gc2VtdmVyXG52YXIgZDNfYXJyYXlTbGljZSA9IFtdLnNsaWNlLFxuICAgIGQzX2FycmF5ID0gZnVuY3Rpb24obGlzdCkgeyByZXR1cm4gZDNfYXJyYXlTbGljZS5jYWxsKGxpc3QpOyB9OyAvLyBjb252ZXJzaW9uIGZvciBOb2RlTGlzdHNcblxudmFyIGQzX2RvY3VtZW50ID0gZG9jdW1lbnQsXG4gICAgZDNfZG9jdW1lbnRFbGVtZW50ID0gZDNfZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgIGQzX3dpbmRvdyA9IHdpbmRvdztcblxuLy8gUmVkZWZpbmUgZDNfYXJyYXkgaWYgdGhlIGJyb3dzZXIgZG9lc27igJl0IHN1cHBvcnQgc2xpY2UtYmFzZWQgY29udmVyc2lvbi5cbnRyeSB7XG4gIGQzX2FycmF5KGQzX2RvY3VtZW50RWxlbWVudC5jaGlsZE5vZGVzKVswXS5ub2RlVHlwZTtcbn0gY2F0Y2goZSkge1xuICBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICB2YXIgaSA9IGxpc3QubGVuZ3RoLCBhcnJheSA9IG5ldyBBcnJheShpKTtcbiAgICB3aGlsZSAoaS0tKSBhcnJheVtpXSA9IGxpc3RbaV07XG4gICAgcmV0dXJuIGFycmF5O1xuICB9O1xufVxudmFyIGQzX3N1YmNsYXNzID0ge30uX19wcm90b19fP1xuXG4vLyBVbnRpbCBFQ01BU2NyaXB0IHN1cHBvcnRzIGFycmF5IHN1YmNsYXNzaW5nLCBwcm90b3R5cGUgaW5qZWN0aW9uIHdvcmtzIHdlbGwuXG5mdW5jdGlvbihvYmplY3QsIHByb3RvdHlwZSkge1xuICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xufTpcblxuLy8gQW5kIGlmIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgX19wcm90b19fLCB3ZSdsbCB1c2UgZGlyZWN0IGV4dGVuc2lvbi5cbmZ1bmN0aW9uKG9iamVjdCwgcHJvdG90eXBlKSB7XG4gIGZvciAodmFyIHByb3BlcnR5IGluIHByb3RvdHlwZSkgb2JqZWN0W3Byb3BlcnR5XSA9IHByb3RvdHlwZVtwcm9wZXJ0eV07XG59O1xuXG5mdW5jdGlvbiBkM192ZW5kb3JTeW1ib2wob2JqZWN0LCBuYW1lKSB7XG4gIGlmIChuYW1lIGluIG9iamVjdCkgcmV0dXJuIG5hbWU7XG4gIG5hbWUgPSBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHJpbmcoMSk7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gZDNfdmVuZG9yUHJlZml4ZXMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgdmFyIHByZWZpeE5hbWUgPSBkM192ZW5kb3JQcmVmaXhlc1tpXSArIG5hbWU7XG4gICAgaWYgKHByZWZpeE5hbWUgaW4gb2JqZWN0KSByZXR1cm4gcHJlZml4TmFtZTtcbiAgfVxufVxuXG52YXIgZDNfdmVuZG9yUHJlZml4ZXMgPSBbXCJ3ZWJraXRcIiwgXCJtc1wiLCBcIm1velwiLCBcIk1velwiLCBcIm9cIiwgXCJPXCJdO1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb24oZ3JvdXBzKSB7XG4gIGQzX3N1YmNsYXNzKGdyb3VwcywgZDNfc2VsZWN0aW9uUHJvdG90eXBlKTtcbiAgcmV0dXJuIGdyb3Vwcztcbn1cblxudmFyIGQzX3NlbGVjdCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIG4ucXVlcnlTZWxlY3RvcihzKTsgfSxcbiAgICBkM19zZWxlY3RBbGwgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBuLnF1ZXJ5U2VsZWN0b3JBbGwocyk7IH0sXG4gICAgZDNfc2VsZWN0TWF0Y2hlciA9IGQzX2RvY3VtZW50RWxlbWVudFtkM192ZW5kb3JTeW1ib2woZDNfZG9jdW1lbnRFbGVtZW50LCBcIm1hdGNoZXNTZWxlY3RvclwiKV0sXG4gICAgZDNfc2VsZWN0TWF0Y2hlcyA9IGZ1bmN0aW9uKG4sIHMpIHsgcmV0dXJuIGQzX3NlbGVjdE1hdGNoZXIuY2FsbChuLCBzKTsgfTtcblxuLy8gUHJlZmVyIFNpenpsZSwgaWYgYXZhaWxhYmxlLlxuaWYgKHR5cGVvZiBTaXp6bGUgPT09IFwiZnVuY3Rpb25cIikge1xuICBkM19zZWxlY3QgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBTaXp6bGUocywgbilbMF0gfHwgbnVsbDsgfTtcbiAgZDNfc2VsZWN0QWxsID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gU2l6emxlLnVuaXF1ZVNvcnQoU2l6emxlKHMsIG4pKTsgfTtcbiAgZDNfc2VsZWN0TWF0Y2hlcyA9IFNpenpsZS5tYXRjaGVzU2VsZWN0b3I7XG59XG5cbmQzLnNlbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZDNfc2VsZWN0aW9uUm9vdDtcbn07XG5cbnZhciBkM19zZWxlY3Rpb25Qcm90b3R5cGUgPSBkMy5zZWxlY3Rpb24ucHJvdG90eXBlID0gW107XG5cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgc3Vibm9kZSxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICBzZWxlY3RvciA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IChncm91cCA9IHRoaXNbal0pLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKHN1Ym5vZGUgPSBzZWxlY3Rvci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKTtcbiAgICAgICAgaWYgKHN1Ym5vZGUgJiYgXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0b3IgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0KHNlbGVjdG9yLCB0aGlzKTtcbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNlbGVjdEFsbCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgbm9kZTtcblxuICBzZWxlY3RvciA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gZDNfYXJyYXkoc2VsZWN0b3IuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSkpO1xuICAgICAgICBzdWJncm91cC5wYXJlbnROb2RlID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc2VsZWN0b3JBbGwoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0b3IgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0QWxsKHNlbGVjdG9yLCB0aGlzKTtcbiAgfTtcbn1cbnZhciBkM19uc1ByZWZpeCA9IHtcbiAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gIHhodG1sOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIixcbiAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICB4bWw6IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIsXG4gIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCJcbn07XG5cbmQzLm5zID0ge1xuICBwcmVmaXg6IGQzX25zUHJlZml4LFxuICBxdWFsaWZ5OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSBuYW1lLmluZGV4T2YoXCI6XCIpLFxuICAgICAgICBwcmVmaXggPSBuYW1lO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIGkpO1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKGkgKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGQzX25zUHJlZml4Lmhhc093blByb3BlcnR5KHByZWZpeClcbiAgICAgICAgPyB7c3BhY2U6IGQzX25zUHJlZml4W3ByZWZpeF0sIGxvY2FsOiBuYW1lfVxuICAgICAgICA6IG5hbWU7XG4gIH1cbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cbiAgICAvLyBGb3IgYXR0cihzdHJpbmcpLCByZXR1cm4gdGhlIGF0dHJpYnV0ZSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgbmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSk7XG4gICAgICByZXR1cm4gbmFtZS5sb2NhbFxuICAgICAgICAgID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKVxuICAgICAgICAgIDogbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIGF0dHIob2JqZWN0KSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlXG4gICAgLy8gYXR0cmlidXRlcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZSBmdW5jdGlvbnMgdGhhdCBhcmVcbiAgICAvLyBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fYXR0cih2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2F0dHIobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9hdHRyKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpO1xuXG4gIC8vIEZvciBhdHRyKHN0cmluZywgbnVsbCksIHJlbW92ZSB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBhdHRyTnVsbCgpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuICBmdW5jdGlvbiBhdHRyTnVsbE5TKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gIH1cblxuICAvLyBGb3IgYXR0cihzdHJpbmcsIHN0cmluZyksIHNldCB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBhdHRyQ29uc3RhbnQoKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9XG4gIGZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCwgdmFsdWUpO1xuICB9XG5cbiAgLy8gRm9yIGF0dHIoc3RyaW5nLCBmdW5jdGlvbiksIGV2YWx1YXRlIHRoZSBmdW5jdGlvbiBmb3IgZWFjaCBlbGVtZW50LCBhbmQgc2V0XG4gIC8vIG9yIHJlbW92ZSB0aGUgYXR0cmlidXRlIGFzIGFwcHJvcHJpYXRlLlxuICBmdW5jdGlvbiBhdHRyRnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgeCk7XG4gIH1cbiAgZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoKSB7XG4gICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHgpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gKG5hbWUubG9jYWwgPyBhdHRyTnVsbE5TIDogYXR0ck51bGwpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24pXG4gICAgICA6IChuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQpKTtcbn1cbmZ1bmN0aW9uIGQzX2NvbGxhcHNlKHMpIHtcbiAgcmV0dXJuIHMudHJpbSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xufVxuZDMucmVxdW90ZSA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZShkM19yZXF1b3RlX3JlLCBcIlxcXFwkJlwiKTtcbn07XG5cbnZhciBkM19yZXF1b3RlX3JlID0gL1tcXFxcXFxeXFwkXFwqXFwrXFw/XFx8XFxbXFxdXFwoXFwpXFwuXFx7XFx9XS9nO1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuY2xhc3NlZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXG4gICAgLy8gRm9yIGNsYXNzZWQoc3RyaW5nKSwgcmV0dXJuIHRydWUgb25seSBpZiB0aGUgZmlyc3Qgbm9kZSBoYXMgdGhlIHNwZWNpZmllZFxuICAgIC8vIGNsYXNzIG9yIGNsYXNzZXMuIE5vdGUgdGhhdCBldmVuIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIERPTVRva2VuTGlzdCwgaXRcbiAgICAvLyBwcm9iYWJseSBkb2Vzbid0IHN1cHBvcnQgaXQgb24gU1ZHIGVsZW1lbnRzICh3aGljaCBjYW4gYmUgYW5pbWF0ZWQpLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKSxcbiAgICAgICAgICBuID0gKG5hbWUgPSBkM19zZWxlY3Rpb25fY2xhc3NlcyhuYW1lKSkubGVuZ3RoLFxuICAgICAgICAgIGkgPSAtMTtcbiAgICAgIGlmICh2YWx1ZSA9IG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIXZhbHVlLmNvbnRhaW5zKG5hbWVbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZVtpXSkudGVzdCh2YWx1ZSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZvciBjbGFzc2VkKG9iamVjdCksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBuYW1lcyBvZiBjbGFzc2VzIHRvIGFkZCBvclxuICAgIC8vIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmUgZnVuY3Rpb25zIHRoYXQgYXJlIGV2YWx1YXRlZCBmb3IgZWFjaCBlbGVtZW50LlxuICAgIGZvciAodmFsdWUgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9jbGFzc2VkKHZhbHVlLCBuYW1lW3ZhbHVlXSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBib3RoIGEgbmFtZSBhbmQgYSB2YWx1ZSBhcmUgc3BlY2lmaWVkLCBhbmQgYXJlIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2NsYXNzZWQobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZSkge1xuICByZXR1cm4gbmV3IFJlZ0V4cChcIig/Ol58XFxcXHMrKVwiICsgZDMucmVxdW90ZShuYW1lKSArIFwiKD86XFxcXHMrfCQpXCIsIFwiZ1wiKTtcbn1cblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkge1xuICByZXR1cm4gbmFtZS50cmltKCkuc3BsaXQoL158XFxzKy8pO1xufVxuXG4vLyBNdWx0aXBsZSBjbGFzcyBuYW1lcyBhcmUgYWxsb3dlZCAoZS5nLiwgXCJmb28gYmFyXCIpLlxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWQobmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jbGFzc2VzKG5hbWUpLm1hcChkM19zZWxlY3Rpb25fY2xhc3NlZE5hbWUpO1xuICB2YXIgbiA9IG5hbWUubGVuZ3RoO1xuXG4gIGZ1bmN0aW9uIGNsYXNzZWRDb25zdGFudCgpIHtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIFdoZW4gdGhlIHZhbHVlIGlzIGEgZnVuY3Rpb24sIHRoZSBmdW5jdGlvbiBpcyBzdGlsbCBldmFsdWF0ZWQgb25seSBvbmNlIHBlclxuICAvLyBlbGVtZW50IGV2ZW4gaWYgdGhlcmUgYXJlIG11bHRpcGxlIGNsYXNzIG5hbWVzLlxuICBmdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24oKSB7XG4gICAgdmFyIGkgPSAtMSwgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgd2hpbGUgKCsraSA8IG4pIG5hbWVbaV0odGhpcywgeCk7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gY2xhc3NlZEZ1bmN0aW9uXG4gICAgICA6IGNsYXNzZWRDb25zdGFudDtcbn1cblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2NsYXNzZWROYW1lKG5hbWUpIHtcbiAgdmFyIHJlID0gZDNfc2VsZWN0aW9uX2NsYXNzZWRSZShuYW1lKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgaWYgKGMgPSBub2RlLmNsYXNzTGlzdCkgcmV0dXJuIHZhbHVlID8gYy5hZGQobmFtZSkgOiBjLnJlbW92ZShuYW1lKTtcbiAgICB2YXIgYyA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIjtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgICBpZiAoIXJlLnRlc3QoYykpIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgZDNfY29sbGFwc2UoYyArIFwiIFwiICsgbmFtZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGQzX2NvbGxhcHNlKGMucmVwbGFjZShyZSwgXCIgXCIpKSk7XG4gICAgfVxuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc3R5bGUgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAobiA8IDMpIHtcblxuICAgIC8vIEZvciBzdHlsZShvYmplY3QpIG9yIHN0eWxlKG9iamVjdCwgc3RyaW5nKSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlXG4gICAgLy8gbmFtZXMgYW5kIHZhbHVlcyBvZiB0aGUgYXR0cmlidXRlcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZVxuICAgIC8vIGZ1bmN0aW9ucyB0aGF0IGFyZSBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC4gVGhlIG9wdGlvbmFsIHN0cmluZ1xuICAgIC8vIHNwZWNpZmllcyB0aGUgcHJpb3JpdHkuXG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAobiA8IDIpIHZhbHVlID0gXCJcIjtcbiAgICAgIGZvciAocHJpb3JpdHkgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9zdHlsZShwcmlvcml0eSwgbmFtZVtwcmlvcml0eV0sIHZhbHVlKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGb3Igc3R5bGUoc3RyaW5nKSwgcmV0dXJuIHRoZSBjb21wdXRlZCBzdHlsZSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKG4gPCAyKSByZXR1cm4gZDNfd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5ub2RlKCksIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG5cbiAgICAvLyBGb3Igc3R5bGUoc3RyaW5nLCBzdHJpbmcpIG9yIHN0eWxlKHN0cmluZywgZnVuY3Rpb24pLCB1c2UgdGhlIGRlZmF1bHRcbiAgICAvLyBwcmlvcml0eS4gVGhlIHByaW9yaXR5IGlzIGlnbm9yZWQgZm9yIHN0eWxlKHN0cmluZywgbnVsbCkuXG4gICAgcHJpb3JpdHkgPSBcIlwiO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBhIG5hbWUsIHZhbHVlIGFuZCBwcmlvcml0eSBhcmUgc3BlY2lmaWVkLCBhbmQgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fc3R5bGUobmFtZSwgdmFsdWUsIHByaW9yaXR5KSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc3R5bGUobmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIG51bGwpIG9yIHN0eWxlKG5hbWUsIG51bGwsIHByaW9yaXR5KSwgcmVtb3ZlIHRoZSBzdHlsZVxuICAvLyBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS4gVGhlIHByaW9yaXR5IGlzIGlnbm9yZWQuXG4gIGZ1bmN0aW9uIHN0eWxlTnVsbCgpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIHN0cmluZykgb3Igc3R5bGUobmFtZSwgc3RyaW5nLCBwcmlvcml0eSksIHNldCB0aGUgc3R5bGVcbiAgLy8gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUsIHVzaW5nIHRoZSBzcGVjaWZpZWQgcHJpb3JpdHkuXG4gIGZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQoKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9XG5cbiAgLy8gRm9yIHN0eWxlKG5hbWUsIGZ1bmN0aW9uKSBvciBzdHlsZShuYW1lLCBmdW5jdGlvbiwgcHJpb3JpdHkpLCBldmFsdWF0ZSB0aGVcbiAgLy8gZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kIHNldCBvciByZW1vdmUgdGhlIHN0eWxlIHByb3BlcnR5IGFzXG4gIC8vIGFwcHJvcHJpYXRlLiBXaGVuIHNldHRpbmcsIHVzZSB0aGUgc3BlY2lmaWVkIHByaW9yaXR5LlxuICBmdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB4LCBwcmlvcml0eSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBzdHlsZU51bGwgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gc3R5bGVGdW5jdGlvbiA6IHN0eWxlQ29uc3RhbnQpO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUucHJvcGVydHkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblxuICAgIC8vIEZvciBwcm9wZXJ0eShzdHJpbmcpLCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIGZvciB0aGUgZmlyc3Qgbm9kZS5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHJldHVybiB0aGlzLm5vZGUoKVtuYW1lXTtcblxuICAgIC8vIEZvciBwcm9wZXJ0eShvYmplY3QpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgbmFtZXMgYW5kIHZhbHVlcyBvZiB0aGVcbiAgICAvLyBwcm9wZXJ0aWVzIHRvIHNldCBvciByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlIGZ1bmN0aW9ucyB0aGF0IGFyZVxuICAgIC8vIGV2YWx1YXRlZCBmb3IgZWFjaCBlbGVtZW50LlxuICAgIGZvciAodmFsdWUgaW4gbmFtZSkgdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9wcm9wZXJ0eSh2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYm90aCBhIG5hbWUgYW5kIGEgdmFsdWUgYXJlIHNwZWNpZmllZCwgYW5kIGFyZSBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9wcm9wZXJ0eShuYW1lLCB2YWx1ZSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3Byb3BlcnR5KG5hbWUsIHZhbHVlKSB7XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIG51bGwpLCByZW1vdmUgdGhlIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxuICBmdW5jdGlvbiBwcm9wZXJ0eU51bGwoKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH1cblxuICAvLyBGb3IgcHJvcGVydHkobmFtZSwgc3RyaW5nKSwgc2V0IHRoZSBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlDb25zdGFudCgpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICAvLyBGb3IgcHJvcGVydHkobmFtZSwgZnVuY3Rpb24pLCBldmFsdWF0ZSB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kXG4gIC8vIHNldCBvciByZW1vdmUgdGhlIHByb3BlcnR5IGFzIGFwcHJvcHJpYXRlLlxuICBmdW5jdGlvbiBwcm9wZXJ0eUZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICBlbHNlIHRoaXNbbmFtZV0gPSB4O1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gcHJvcGVydHlOdWxsIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHByb3BlcnR5RnVuY3Rpb24gOiBwcm9wZXJ0eUNvbnN0YW50KTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnRleHQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZnVuY3Rpb24oKSB7IHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2OyB9IDogdmFsdWUgPT0gbnVsbFxuICAgICAgPyBmdW5jdGlvbigpIHsgdGhpcy50ZXh0Q29udGVudCA9IFwiXCI7IH1cbiAgICAgIDogZnVuY3Rpb24oKSB7IHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTsgfSlcbiAgICAgIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuaHRtbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBmdW5jdGlvbigpIHsgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB0aGlzLmlubmVySFRNTCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2OyB9IDogdmFsdWUgPT0gbnVsbFxuICAgICAgPyBmdW5jdGlvbigpIHsgdGhpcy5pbm5lckhUTUwgPSBcIlwiOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyB0aGlzLmlubmVySFRNTCA9IHZhbHVlOyB9KVxuICAgICAgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gZDNfc2VsZWN0aW9uX2NyZWF0b3IobmFtZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlbmRDaGlsZChuYW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpIHtcbiAgcmV0dXJuIHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lXG4gICAgICA6IChuYW1lID0gZDMubnMucXVhbGlmeShuYW1lKSkubG9jYWwgPyBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7IH1cbiAgICAgIDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubmFtZXNwYWNlVVJJLCBuYW1lKTsgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICBuYW1lID0gZDNfc2VsZWN0aW9uX2NyZWF0b3IobmFtZSk7XG4gIGJlZm9yZSA9IGQzX3NlbGVjdGlvbl9zZWxlY3RvcihiZWZvcmUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKG5hbWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgYmVmb3JlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gIH0pO1xufTtcblxuLy8gVE9ETyByZW1vdmUoc2VsZWN0b3IpP1xuLy8gVE9ETyByZW1vdmUobm9kZSk/XG4vLyBUT0RPIHJlbW92ZShmdW5jdGlvbik/XG5kM19zZWxlY3Rpb25Qcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIH0pO1xufTtcbmZ1bmN0aW9uIGQzX2NsYXNzKGN0b3IsIHByb3BlcnRpZXMpIHtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0b3IucHJvdG90eXBlLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHByb3BlcnRpZXNba2V5XSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGN0b3IucHJvdG90eXBlID0gcHJvcGVydGllcztcbiAgfVxufVxuXG5kMy5tYXAgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIG1hcCA9IG5ldyBkM19NYXA7XG4gIGlmIChvYmplY3QgaW5zdGFuY2VvZiBkM19NYXApIG9iamVjdC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgbWFwLnNldChrZXksIHZhbHVlKTsgfSk7XG4gIGVsc2UgZm9yICh2YXIga2V5IGluIG9iamVjdCkgbWFwLnNldChrZXksIG9iamVjdFtrZXldKTtcbiAgcmV0dXJuIG1hcDtcbn07XG5cbmZ1bmN0aW9uIGQzX01hcCgpIHt9XG5cbmQzX2NsYXNzKGQzX01hcCwge1xuICBoYXM6IGQzX21hcF9oYXMsXG4gIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXNbZDNfbWFwX3ByZWZpeCArIGtleV07XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzW2QzX21hcF9wcmVmaXggKyBrZXldID0gdmFsdWU7XG4gIH0sXG4gIHJlbW92ZTogZDNfbWFwX3JlbW92ZSxcbiAga2V5czogZDNfbWFwX2tleXMsXG4gIHZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7IHZhbHVlcy5wdXNoKHZhbHVlKTsgfSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSxcbiAgZW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyBlbnRyaWVzLnB1c2goe2tleToga2V5LCB2YWx1ZTogdmFsdWV9KTsgfSk7XG4gICAgcmV0dXJuIGVudHJpZXM7XG4gIH0sXG4gIHNpemU6IGQzX21hcF9zaXplLFxuICBlbXB0eTogZDNfbWFwX2VtcHR5LFxuICBmb3JFYWNoOiBmdW5jdGlvbihmKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpIGYuY2FsbCh0aGlzLCBrZXkuc3Vic3RyaW5nKDEpLCB0aGlzW2tleV0pO1xuICB9XG59KTtcblxudmFyIGQzX21hcF9wcmVmaXggPSBcIlxcMFwiLCAvLyBwcmV2ZW50IGNvbGxpc2lvbiB3aXRoIGJ1aWx0LWluc1xuICAgIGQzX21hcF9wcmVmaXhDb2RlID0gZDNfbWFwX3ByZWZpeC5jaGFyQ29kZUF0KDApO1xuXG5mdW5jdGlvbiBkM19tYXBfaGFzKGtleSkge1xuICByZXR1cm4gZDNfbWFwX3ByZWZpeCArIGtleSBpbiB0aGlzO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfcmVtb3ZlKGtleSkge1xuICBrZXkgPSBkM19tYXBfcHJlZml4ICsga2V5O1xuICByZXR1cm4ga2V5IGluIHRoaXMgJiYgZGVsZXRlIHRoaXNba2V5XTtcbn1cblxuZnVuY3Rpb24gZDNfbWFwX2tleXMoKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsga2V5cy5wdXNoKGtleSk7IH0pO1xuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gZDNfbWFwX3NpemUoKSB7XG4gIHZhciBzaXplID0gMDtcbiAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpICsrc2l6ZTtcbiAgcmV0dXJuIHNpemU7XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9lbXB0eSgpIHtcbiAgZm9yICh2YXIga2V5IGluIHRoaXMpIGlmIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gZDNfbWFwX3ByZWZpeENvZGUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IHRoaXMubGVuZ3RoLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIC8vIElmIG5vIHZhbHVlIGlzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBmaXJzdCB2YWx1ZS5cbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdmFsdWUgPSBuZXcgQXJyYXkobiA9IChncm91cCA9IHRoaXNbMF0pLmxlbmd0aCk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgdmFsdWVbaV0gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kKGdyb3VwLCBncm91cERhdGEpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgbiA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgbSA9IGdyb3VwRGF0YS5sZW5ndGgsXG4gICAgICAgIG4wID0gTWF0aC5taW4obiwgbSksXG4gICAgICAgIHVwZGF0ZU5vZGVzID0gbmV3IEFycmF5KG0pLFxuICAgICAgICBlbnRlck5vZGVzID0gbmV3IEFycmF5KG0pLFxuICAgICAgICBleGl0Tm9kZXMgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIG5vZGUsXG4gICAgICAgIG5vZGVEYXRhO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIG5vZGVCeUtleVZhbHVlID0gbmV3IGQzX01hcCxcbiAgICAgICAgICBkYXRhQnlLZXlWYWx1ZSA9IG5ldyBkM19NYXAsXG4gICAgICAgICAga2V5VmFsdWVzID0gW10sXG4gICAgICAgICAga2V5VmFsdWU7XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykge1xuICAgICAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKG5vZGUgPSBncm91cFtpXSwgbm9kZS5fX2RhdGFfXywgaSk7XG4gICAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7XG4gICAgICAgICAgZXhpdE5vZGVzW2ldID0gbm9kZTsgLy8gZHVwbGljYXRlIHNlbGVjdGlvbiBrZXlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGtleVZhbHVlcy5wdXNoKGtleVZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG07KSB7XG4gICAgICAgIGtleVZhbHVlID0ga2V5LmNhbGwoZ3JvdXBEYXRhLCBub2RlRGF0YSA9IGdyb3VwRGF0YVtpXSwgaSk7XG4gICAgICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlKSkge1xuICAgICAgICAgIHVwZGF0ZU5vZGVzW2ldID0gbm9kZTtcbiAgICAgICAgICBub2RlLl9fZGF0YV9fID0gbm9kZURhdGE7XG4gICAgICAgIH0gZWxzZSBpZiAoIWRhdGFCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZSkpIHsgLy8gbm8gZHVwbGljYXRlIGRhdGEga2V5XG4gICAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShub2RlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlRGF0YSk7XG4gICAgICAgIG5vZGVCeUtleVZhbHVlLnJlbW92ZShrZXlWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykge1xuICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlc1tpXSkpIHtcbiAgICAgICAgICBleGl0Tm9kZXNbaV0gPSBncm91cFtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjA7KSB7XG4gICAgICAgIG5vZGUgPSBncm91cFtpXTtcbiAgICAgICAgbm9kZURhdGEgPSBncm91cERhdGFbaV07XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IG5vZGVEYXRhO1xuICAgICAgICAgIHVwZGF0ZU5vZGVzW2ldID0gbm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnRlck5vZGVzW2ldID0gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKG5vZGVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yICg7IGkgPCBtOyArK2kpIHtcbiAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShncm91cERhdGFbaV0pO1xuICAgICAgfVxuICAgICAgZm9yICg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW50ZXJOb2Rlcy51cGRhdGVcbiAgICAgICAgPSB1cGRhdGVOb2RlcztcblxuICAgIGVudGVyTm9kZXMucGFyZW50Tm9kZVxuICAgICAgICA9IHVwZGF0ZU5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSBleGl0Tm9kZXMucGFyZW50Tm9kZVxuICAgICAgICA9IGdyb3VwLnBhcmVudE5vZGU7XG5cbiAgICBlbnRlci5wdXNoKGVudGVyTm9kZXMpO1xuICAgIHVwZGF0ZS5wdXNoKHVwZGF0ZU5vZGVzKTtcbiAgICBleGl0LnB1c2goZXhpdE5vZGVzKTtcbiAgfVxuXG4gIHZhciBlbnRlciA9IGQzX3NlbGVjdGlvbl9lbnRlcihbXSksXG4gICAgICB1cGRhdGUgPSBkM19zZWxlY3Rpb24oW10pLFxuICAgICAgZXhpdCA9IGQzX3NlbGVjdGlvbihbXSk7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGJpbmQoZ3JvdXAgPSB0aGlzW2ldLCB2YWx1ZS5jYWxsKGdyb3VwLCBncm91cC5wYXJlbnROb2RlLl9fZGF0YV9fLCBpKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBiaW5kKGdyb3VwID0gdGhpc1tpXSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZS5lbnRlciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZW50ZXI7IH07XG4gIHVwZGF0ZS5leGl0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBleGl0OyB9O1xuICByZXR1cm4gdXBkYXRlO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2RhdGFOb2RlKGRhdGEpIHtcbiAgcmV0dXJuIHtfX2RhdGFfXzogZGF0YX07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5kYXR1bSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSlcbiAgICAgIDogdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIpO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICBpZiAodHlwZW9mIGZpbHRlciAhPT0gXCJmdW5jdGlvblwiKSBmaWx0ZXIgPSBkM19zZWxlY3Rpb25fZmlsdGVyKGZpbHRlcik7XG5cbiAgZm9yICh2YXIgaiA9IDAsIG0gPSB0aGlzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSAoZ3JvdXAgPSB0aGlzW2pdKS5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgZmlsdGVyLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZmlsdGVyKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDNfc2VsZWN0TWF0Y2hlcyh0aGlzLCBzZWxlY3Rvcik7XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5vcmRlciA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBuZXh0ICE9PSBub2RlLm5leHRTaWJsaW5nKSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuZDMuYXNjZW5kaW5nID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgY29tcGFyYXRvciA9IGQzX3NlbGVjdGlvbl9zb3J0Q29tcGFyYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHRoaXNbal0uc29ydChjb21wYXJhdG9yKTtcbiAgcmV0dXJuIHRoaXMub3JkZXIoKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9zb3J0Q29tcGFyYXRvcihjb21wYXJhdG9yKSB7XG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkgY29tcGFyYXRvciA9IGQzLmFzY2VuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYSAmJiBiID8gY29tcGFyYXRvcihhLl9fZGF0YV9fLCBiLl9fZGF0YV9fKSA6ICFhIC0gIWI7XG4gIH07XG59XG5mdW5jdGlvbiBkM19ub29wKCkge31cblxuZDMuZGlzcGF0Y2ggPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRpc3BhdGNoID0gbmV3IGQzX2Rpc3BhdGNoLFxuICAgICAgaSA9IC0xLFxuICAgICAgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBkaXNwYXRjaFthcmd1bWVudHNbaV1dID0gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpO1xuICByZXR1cm4gZGlzcGF0Y2g7XG59O1xuXG5mdW5jdGlvbiBkM19kaXNwYXRjaCgpIHt9XG5cbmQzX2Rpc3BhdGNoLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBpID0gdHlwZS5pbmRleE9mKFwiLlwiKSxcbiAgICAgIG5hbWUgPSBcIlwiO1xuXG4gIC8vIEV4dHJhY3Qgb3B0aW9uYWwgbmFtZXNwYWNlLCBlLmcuLCBcImNsaWNrLmZvb1wiXG4gIGlmIChpID49IDApIHtcbiAgICBuYW1lID0gdHlwZS5zdWJzdHJpbmcoaSArIDEpO1xuICAgIHR5cGUgPSB0eXBlLnN1YnN0cmluZygwLCBpKTtcbiAgfVxuXG4gIGlmICh0eXBlKSByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICAgID8gdGhpc1t0eXBlXS5vbihuYW1lKVxuICAgICAgOiB0aGlzW3R5cGVdLm9uKG5hbWUsIGxpc3RlbmVyKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSBmb3IgKHR5cGUgaW4gdGhpcykge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkodHlwZSkpIHRoaXNbdHlwZV0ub24obmFtZSwgbnVsbCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkM19kaXNwYXRjaF9ldmVudChkaXNwYXRjaCkge1xuICB2YXIgbGlzdGVuZXJzID0gW10sXG4gICAgICBsaXN0ZW5lckJ5TmFtZSA9IG5ldyBkM19NYXA7XG5cbiAgZnVuY3Rpb24gZXZlbnQoKSB7XG4gICAgdmFyIHogPSBsaXN0ZW5lcnMsIC8vIGRlZmVuc2l2ZSByZWZlcmVuY2VcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBuID0gei5sZW5ndGgsXG4gICAgICAgIGw7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmIChsID0geltpXS5vbikgbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBkaXNwYXRjaDtcbiAgfVxuXG4gIGV2ZW50Lm9uID0gZnVuY3Rpb24obmFtZSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgbCA9IGxpc3RlbmVyQnlOYW1lLmdldChuYW1lKSxcbiAgICAgICAgaTtcblxuICAgIC8vIHJldHVybiB0aGUgY3VycmVudCBsaXN0ZW5lciwgaWYgYW55XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gbCAmJiBsLm9uO1xuXG4gICAgLy8gcmVtb3ZlIHRoZSBvbGQgbGlzdGVuZXIsIGlmIGFueSAod2l0aCBjb3B5LW9uLXdyaXRlKVxuICAgIGlmIChsKSB7XG4gICAgICBsLm9uID0gbnVsbDtcbiAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5zbGljZSgwLCBpID0gbGlzdGVuZXJzLmluZGV4T2YobCkpLmNvbmNhdChsaXN0ZW5lcnMuc2xpY2UoaSArIDEpKTtcbiAgICAgIGxpc3RlbmVyQnlOYW1lLnJlbW92ZShuYW1lKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdGhlIG5ldyBsaXN0ZW5lciwgaWYgYW55XG4gICAgaWYgKGxpc3RlbmVyKSBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lckJ5TmFtZS5zZXQobmFtZSwge29uOiBsaXN0ZW5lcn0pKTtcblxuICAgIHJldHVybiBkaXNwYXRjaDtcbiAgfTtcblxuICByZXR1cm4gZXZlbnQ7XG59XG5cbmQzLmV2ZW50ID0gbnVsbDtcblxuZnVuY3Rpb24gZDNfZXZlbnRQcmV2ZW50RGVmYXVsdCgpIHtcbiAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn1cblxuZnVuY3Rpb24gZDNfZXZlbnRTb3VyY2UoKSB7XG4gIHZhciBlID0gZDMuZXZlbnQsIHM7XG4gIHdoaWxlIChzID0gZS5zb3VyY2VFdmVudCkgZSA9IHM7XG4gIHJldHVybiBlO1xufVxuXG4vLyBMaWtlIGQzLmRpc3BhdGNoLCBidXQgZm9yIGN1c3RvbSBldmVudHMgYWJzdHJhY3RpbmcgbmF0aXZlIFVJIGV2ZW50cy4gVGhlc2Vcbi8vIGV2ZW50cyBoYXZlIGEgdGFyZ2V0IGNvbXBvbmVudCAoc3VjaCBhcyBhIGJydXNoKSwgYSB0YXJnZXQgZWxlbWVudCAoc3VjaCBhc1xuLy8gdGhlIHN2ZzpnIGVsZW1lbnQgY29udGFpbmluZyB0aGUgYnJ1c2gpIGFuZCB0aGUgc3RhbmRhcmQgYXJndW1lbnRzIGBkYCAodGhlXG4vLyB0YXJnZXQgZWxlbWVudCdzIGRhdGEpIGFuZCBgaWAgKHRoZSBzZWxlY3Rpb24gaW5kZXggb2YgdGhlIHRhcmdldCBlbGVtZW50KS5cbmZ1bmN0aW9uIGQzX2V2ZW50RGlzcGF0Y2godGFyZ2V0KSB7XG4gIHZhciBkaXNwYXRjaCA9IG5ldyBkM19kaXNwYXRjaCxcbiAgICAgIGkgPSAwLFxuICAgICAgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraSA8IG4pIGRpc3BhdGNoW2FyZ3VtZW50c1tpXV0gPSBkM19kaXNwYXRjaF9ldmVudChkaXNwYXRjaCk7XG5cbiAgLy8gQ3JlYXRlcyBhIGRpc3BhdGNoIGNvbnRleHQgZm9yIHRoZSBzcGVjaWZpZWQgYHRoaXpgICh0eXBpY2FsbHksIHRoZSB0YXJnZXRcbiAgLy8gRE9NIGVsZW1lbnQgdGhhdCByZWNlaXZlZCB0aGUgc291cmNlIGV2ZW50KSBhbmQgYGFyZ3VtZW50emAgKHR5cGljYWxseSwgdGhlXG4gIC8vIGRhdGEgYGRgIGFuZCBpbmRleCBgaWAgb2YgdGhlIHRhcmdldCBlbGVtZW50KS4gVGhlIHJldHVybmVkIGZ1bmN0aW9uIGNhbiBiZVxuICAvLyB1c2VkIHRvIGRpc3BhdGNoIGFuIGV2ZW50IHRvIGFueSByZWdpc3RlcmVkIGxpc3RlbmVyczsgdGhlIGZ1bmN0aW9uIHRha2VzIGFcbiAgLy8gc2luZ2xlIGFyZ3VtZW50IGFzIGlucHV0LCBiZWluZyB0aGUgZXZlbnQgdG8gZGlzcGF0Y2guIFRoZSBldmVudCBtdXN0IGhhdmVcbiAgLy8gYSBcInR5cGVcIiBhdHRyaWJ1dGUgd2hpY2ggY29ycmVzcG9uZHMgdG8gYSB0eXBlIHJlZ2lzdGVyZWQgaW4gdGhlXG4gIC8vIGNvbnN0cnVjdG9yLiBUaGlzIGNvbnRleHQgd2lsbCBhdXRvbWF0aWNhbGx5IHBvcHVsYXRlIHRoZSBcInNvdXJjZUV2ZW50XCIgYW5kXG4gIC8vIFwidGFyZ2V0XCIgYXR0cmlidXRlcyBvZiB0aGUgZXZlbnQsIGFzIHdlbGwgYXMgc2V0dGluZyB0aGUgYGQzLmV2ZW50YCBnbG9iYWxcbiAgLy8gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgbm90aWZpY2F0aW9uLlxuICBkaXNwYXRjaC5vZiA9IGZ1bmN0aW9uKHRoaXosIGFyZ3VtZW50eikge1xuICAgIHJldHVybiBmdW5jdGlvbihlMSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGUwID1cbiAgICAgICAgZTEuc291cmNlRXZlbnQgPSBkMy5ldmVudDtcbiAgICAgICAgZTEudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICBkMy5ldmVudCA9IGUxO1xuICAgICAgICBkaXNwYXRjaFtlMS50eXBlXS5hcHBseSh0aGl6LCBhcmd1bWVudHopO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZDMuZXZlbnQgPSBlMDtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBkaXNwYXRjaDtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLm9uID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAobiA8IDMpIHtcblxuICAgIC8vIEZvciBvbihvYmplY3QpIG9yIG9uKG9iamVjdCwgYm9vbGVhbiksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBldmVudFxuICAgIC8vIHR5cGVzIGFuZCBsaXN0ZW5lcnMgdG8gYWRkIG9yIHJlbW92ZS4gVGhlIG9wdGlvbmFsIGJvb2xlYW4gc3BlY2lmaWVzXG4gICAgLy8gd2hldGhlciB0aGUgbGlzdGVuZXIgY2FwdHVyZXMgZXZlbnRzLlxuICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKG4gPCAyKSBsaXN0ZW5lciA9IGZhbHNlO1xuICAgICAgZm9yIChjYXB0dXJlIGluIHR5cGUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fb24oY2FwdHVyZSwgdHlwZVtjYXB0dXJlXSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIEZvciBvbihzdHJpbmcpLCByZXR1cm4gdGhlIGxpc3RlbmVyIGZvciB0aGUgZmlyc3Qgbm9kZS5cbiAgICBpZiAobiA8IDIpIHJldHVybiAobiA9IHRoaXMubm9kZSgpW1wiX19vblwiICsgdHlwZV0pICYmIG4uXztcblxuICAgIC8vIEZvciBvbihzdHJpbmcsIGZ1bmN0aW9uKSwgdXNlIHRoZSBkZWZhdWx0IGNhcHR1cmUuXG4gICAgY2FwdHVyZSA9IGZhbHNlO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBhIHR5cGUsIGxpc3RlbmVyIGFuZCBjYXB0dXJlIGFyZSBzcGVjaWZpZWQsIGFuZCBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9vbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX29uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gIHZhciBuYW1lID0gXCJfX29uXCIgKyB0eXBlLFxuICAgICAgaSA9IHR5cGUuaW5kZXhPZihcIi5cIiksXG4gICAgICB3cmFwID0gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXI7XG5cbiAgaWYgKGkgPiAwKSB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMCwgaSk7XG4gIHZhciBmaWx0ZXIgPSBkM19zZWxlY3Rpb25fb25GaWx0ZXJzLmdldCh0eXBlKTtcbiAgaWYgKGZpbHRlcikgdHlwZSA9IGZpbHRlciwgd3JhcCA9IGQzX3NlbGVjdGlvbl9vbkZpbHRlcjtcblxuICBmdW5jdGlvbiBvblJlbW92ZSgpIHtcbiAgICB2YXIgbCA9IHRoaXNbbmFtZV07XG4gICAgaWYgKGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsLCBsLiQpO1xuICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25BZGQoKSB7XG4gICAgdmFyIGwgPSB3cmFwKGxpc3RlbmVyLCBkM19hcnJheShhcmd1bWVudHMpKTtcbiAgICBvblJlbW92ZS5jYWxsKHRoaXMpO1xuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzW25hbWVdID0gbCwgbC4kID0gY2FwdHVyZSk7XG4gICAgbC5fID0gbGlzdGVuZXI7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVBbGwoKSB7XG4gICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIl5fX29uKFteLl0rKVwiICsgZDMucmVxdW90ZSh0eXBlKSArIFwiJFwiKSxcbiAgICAgICAgbWF0Y2g7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICBpZiAobWF0Y2ggPSBuYW1lLm1hdGNoKHJlKSkge1xuICAgICAgICB2YXIgbCA9IHRoaXNbbmFtZV07XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihtYXRjaFsxXSwgbCwgbC4kKTtcbiAgICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGlcbiAgICAgID8gbGlzdGVuZXIgPyBvbkFkZCA6IG9uUmVtb3ZlXG4gICAgICA6IGxpc3RlbmVyID8gZDNfbm9vcCA6IHJlbW92ZUFsbDtcbn1cblxudmFyIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMgPSBkMy5tYXAoe1xuICBtb3VzZWVudGVyOiBcIm1vdXNlb3ZlclwiLFxuICBtb3VzZWxlYXZlOiBcIm1vdXNlb3V0XCJcbn0pO1xuXG5kM19zZWxlY3Rpb25fb25GaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICBpZiAoXCJvblwiICsgayBpbiBkM19kb2N1bWVudCkgZDNfc2VsZWN0aW9uX29uRmlsdGVycy5yZW1vdmUoayk7XG59KTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXIobGlzdGVuZXIsIGFyZ3VtZW50eikge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHZhciBvID0gZDMuZXZlbnQ7IC8vIEV2ZW50cyBjYW4gYmUgcmVlbnRyYW50IChlLmcuLCBmb2N1cykuXG4gICAgZDMuZXZlbnQgPSBlO1xuICAgIGFyZ3VtZW50elswXSA9IHRoaXMuX19kYXRhX187XG4gICAgdHJ5IHtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50eik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGQzLmV2ZW50ID0gbztcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbkZpbHRlcihsaXN0ZW5lciwgYXJndW1lbnR6KSB7XG4gIHZhciBsID0gZDNfc2VsZWN0aW9uX29uTGlzdGVuZXIobGlzdGVuZXIsIGFyZ3VtZW50eik7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMsIHJlbGF0ZWQgPSBlLnJlbGF0ZWRUYXJnZXQ7XG4gICAgaWYgKCFyZWxhdGVkIHx8IChyZWxhdGVkICE9PSB0YXJnZXQgJiYgIShyZWxhdGVkLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRhcmdldCkgJiA4KSkpIHtcbiAgICAgIGwuY2FsbCh0YXJnZXQsIGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICByZXR1cm4gZDNfc2VsZWN0aW9uX2VhY2godGhpcywgZnVuY3Rpb24obm9kZSwgaSwgaikge1xuICAgIGNhbGxiYWNrLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaik7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2VhY2goZ3JvdXBzLCBjYWxsYmFjaykge1xuICBmb3IgKHZhciBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGNhbGxiYWNrKG5vZGUsIGksIGopO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZ3JvdXBzO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBhcmdzID0gZDNfYXJyYXkoYXJndW1lbnRzKTtcbiAgY2FsbGJhY2suYXBwbHkoYXJnc1swXSA9IHRoaXMsIGFyZ3MpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMubm9kZSgpO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLm5vZGUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaiA9IDAsIG0gPSB0aGlzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG4gPSAwO1xuICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7ICsrbjsgfSk7XG4gIHJldHVybiBuO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2VudGVyKHNlbGVjdGlvbikge1xuICBkM19zdWJjbGFzcyhzZWxlY3Rpb24sIGQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZSk7XG4gIHJldHVybiBzZWxlY3Rpb247XG59XG5cbnZhciBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUgPSBbXTtcblxuZDMuc2VsZWN0aW9uLmVudGVyID0gZDNfc2VsZWN0aW9uX2VudGVyO1xuZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZSA9IGQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZTtcblxuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmFwcGVuZCA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5hcHBlbmQ7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuZW1wdHkgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuZW1wdHk7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUubm9kZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlO1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmNhbGwgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuY2FsbDtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5zaXplID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNpemU7XG5cblxuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHZhciBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgc3Vibm9kZSxcbiAgICAgIHVwZ3JvdXAsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgdXBncm91cCA9IChncm91cCA9IHRoaXNbal0pLnVwZGF0ZTtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBzdWJncm91cC5wYXJlbnROb2RlID0gZ3JvdXAucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2godXBncm91cFtpXSA9IHN1Ym5vZGUgPSBzZWxlY3Rvci5jYWxsKGdyb3VwLnBhcmVudE5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKTtcbiAgICAgICAgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJncm91cC5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM19zZWxlY3Rpb24oc3ViZ3JvdXBzKTtcbn07XG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSBiZWZvcmUgPSBkM19zZWxlY3Rpb25fZW50ZXJJbnNlcnRCZWZvcmUodGhpcyk7XG4gIHJldHVybiBkM19zZWxlY3Rpb25Qcm90b3R5cGUuaW5zZXJ0LmNhbGwodGhpcywgbmFtZSwgYmVmb3JlKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lbnRlckluc2VydEJlZm9yZShlbnRlcikge1xuICB2YXIgaTAsIGowO1xuICByZXR1cm4gZnVuY3Rpb24oZCwgaSwgaikge1xuICAgIHZhciBncm91cCA9IGVudGVyW2pdLnVwZGF0ZSxcbiAgICAgICAgbiA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgbm9kZTtcbiAgICBpZiAoaiAhPSBqMCkgajAgPSBqLCBpMCA9IDA7XG4gICAgaWYgKGkgPj0gaTApIGkwID0gaSArIDE7XG4gICAgd2hpbGUgKCEobm9kZSA9IGdyb3VwW2kwXSkgJiYgKytpMCA8IG4pO1xuICAgIHJldHVybiBub2RlO1xuICB9O1xufVxuXG4vLyBpbXBvcnQgXCIuLi90cmFuc2l0aW9uL3RyYW5zaXRpb25cIjtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGlkID0gZDNfdHJhbnNpdGlvbkluaGVyaXRJZCB8fCArK2QzX3RyYW5zaXRpb25JZCxcbiAgICAgIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBub2RlLFxuICAgICAgdHJhbnNpdGlvbiA9IGQzX3RyYW5zaXRpb25Jbmhlcml0IHx8IHt0aW1lOiBEYXRlLm5vdygpLCBlYXNlOiBkM19lYXNlX2N1YmljSW5PdXQsIGRlbGF5OiAwLCBkdXJhdGlvbjogMjUwfTtcblxuICBmb3IgKHZhciBqID0gLTEsIG0gPSB0aGlzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGQzX3RyYW5zaXRpb25Ob2RlKG5vZGUsIGksIGlkLCB0cmFuc2l0aW9uKTtcbiAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3RyYW5zaXRpb24oc3ViZ3JvdXBzLCBpZCk7XG59O1xuLy8gaW1wb3J0IFwiLi4vdHJhbnNpdGlvbi90cmFuc2l0aW9uXCI7XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5pbnRlcnJ1cHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25faW50ZXJydXB0KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9pbnRlcnJ1cHQoKSB7XG4gIHZhciBsb2NrID0gdGhpcy5fX3RyYW5zaXRpb25fXztcbiAgaWYgKGxvY2spICsrbG9jay5hY3RpdmU7XG59XG5cbi8vIFRPRE8gZmFzdCBzaW5nbGV0b24gaW1wbGVtZW50YXRpb24/XG5kMy5zZWxlY3QgPSBmdW5jdGlvbihub2RlKSB7XG4gIHZhciBncm91cCA9IFt0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIiA/IGQzX3NlbGVjdChub2RlLCBkM19kb2N1bWVudCkgOiBub2RlXTtcbiAgZ3JvdXAucGFyZW50Tm9kZSA9IGQzX2RvY3VtZW50RWxlbWVudDtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihbZ3JvdXBdKTtcbn07XG5cbmQzLnNlbGVjdEFsbCA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIHZhciBncm91cCA9IGQzX2FycmF5KHR5cGVvZiBub2RlcyA9PT0gXCJzdHJpbmdcIiA/IGQzX3NlbGVjdEFsbChub2RlcywgZDNfZG9jdW1lbnQpIDogbm9kZXMpO1xuICBncm91cC5wYXJlbnROb2RlID0gZDNfZG9jdW1lbnRFbGVtZW50O1xuICByZXR1cm4gZDNfc2VsZWN0aW9uKFtncm91cF0pO1xufTtcblxudmFyIGQzX3NlbGVjdGlvblJvb3QgPSBkMy5zZWxlY3QoZDNfZG9jdW1lbnRFbGVtZW50KTtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGQzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkMztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmQzID0gZDM7XG4gIH1cbn0oKTtcbiIsImZ1bmN0aW9uIGNvcnNsaXRlKHVybCwgY2FsbGJhY2ssIGNvcnMpIHtcbiAgICB2YXIgc2VudCA9IGZhbHNlO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhFcnJvcignQnJvd3NlciBub3Qgc3VwcG9ydGVkJykpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29ycyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIG0gPSB1cmwubWF0Y2goL15cXHMqaHR0cHM/OlxcL1xcL1teXFwvXSovKTtcbiAgICAgICAgY29ycyA9IG0gJiYgKG1bMF0gIT09IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3RuYW1lICtcbiAgICAgICAgICAgICAgICAobG9jYXRpb24ucG9ydCA/ICc6JyArIGxvY2F0aW9uLnBvcnQgOiAnJykpO1xuICAgIH1cblxuICAgIHZhciB4ID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgZnVuY3Rpb24gaXNTdWNjZXNzZnVsKHN0YXR1cykge1xuICAgICAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgfHwgc3RhdHVzID09PSAzMDQ7XG4gICAgfVxuXG4gICAgaWYgKGNvcnMgJiYgISgnd2l0aENyZWRlbnRpYWxzJyBpbiB4KSkge1xuICAgICAgICAvLyBJRTgtOVxuICAgICAgICB4ID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuXG4gICAgICAgIC8vIEVuc3VyZSBjYWxsYmFjayBpcyBuZXZlciBjYWxsZWQgc3luY2hyb25vdXNseSwgaS5lLiwgYmVmb3JlXG4gICAgICAgIC8vIHguc2VuZCgpIHJldHVybnMgKHRoaXMgaGFzIGJlZW4gb2JzZXJ2ZWQgaW4gdGhlIHdpbGQpLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcGJveC9tYXBib3guanMvaXNzdWVzLzQ3MlxuICAgICAgICB2YXIgb3JpZ2luYWwgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZW50KSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZGVkKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBYRG9tYWluUmVxdWVzdFxuICAgICAgICAgICAgeC5zdGF0dXMgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgLy8gbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgICAgICBpc1N1Y2Nlc3NmdWwoeC5zdGF0dXMpKSBjYWxsYmFjay5jYWxsKHgsIG51bGwsIHgpO1xuICAgICAgICBlbHNlIGNhbGxiYWNrLmNhbGwoeCwgeCwgbnVsbCk7XG4gICAgfVxuXG4gICAgLy8gQm90aCBgb25yZWFkeXN0YXRlY2hhbmdlYCBhbmQgYG9ubG9hZGAgY2FuIGZpcmUuIGBvbnJlYWR5c3RhdGVjaGFuZ2VgXG4gICAgLy8gaGFzIFtiZWVuIHN1cHBvcnRlZCBmb3IgbG9uZ2VyXShodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MTgxNTA4LzIyOTAwMSkuXG4gICAgaWYgKCdvbmxvYWQnIGluIHgpIHtcbiAgICAgICAgeC5vbmxvYWQgPSBsb2FkZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiByZWFkeXN0YXRlKCkge1xuICAgICAgICAgICAgaWYgKHgucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGxvYWRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIHdpdGggdGhlIFhNTEh0dHBSZXF1ZXN0IG9iamVjdCBhcyBhbiBlcnJvciBhbmQgcHJldmVudFxuICAgIC8vIGl0IGZyb20gZXZlciBiZWluZyBjYWxsZWQgYWdhaW4gYnkgcmVhc3NpZ25pbmcgaXQgdG8gYG5vb3BgXG4gICAgeC5vbmVycm9yID0gZnVuY3Rpb24gZXJyb3IoZXZ0KSB7XG4gICAgICAgIC8vIFhEb21haW5SZXF1ZXN0IHByb3ZpZGVzIG5vIGV2dCBwYXJhbWV0ZXJcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldnQgfHwgdHJ1ZSwgbnVsbCk7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7IH07XG4gICAgfTtcblxuICAgIC8vIElFOSBtdXN0IGhhdmUgb25wcm9ncmVzcyBiZSBzZXQgdG8gYSB1bmlxdWUgZnVuY3Rpb24uXG4gICAgeC5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7IH07XG5cbiAgICB4Lm9udGltZW91dCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2dCwgbnVsbCk7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7IH07XG4gICAgfTtcblxuICAgIHgub25hYm9ydCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2dCwgbnVsbCk7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7IH07XG4gICAgfTtcblxuICAgIC8vIEdFVCBpcyB0aGUgb25seSBzdXBwb3J0ZWQgSFRUUCBWZXJiIGJ5IFhEb21haW5SZXF1ZXN0IGFuZCBpcyB0aGVcbiAgICAvLyBvbmx5IG9uZSBzdXBwb3J0ZWQgaGVyZS5cbiAgICB4Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0LiBTZW5kaW5nIGRhdGEgaXMgbm90IHN1cHBvcnRlZC5cbiAgICB4LnNlbmQobnVsbCk7XG4gICAgc2VudCA9IHRydWU7XG5cbiAgICByZXR1cm4geDtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGNvcnNsaXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEJhc2VkIG9mZiBvZiBbdGhlIG9mZmljYWwgR29vZ2xlIGRvY3VtZW50XShodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vdXRpbGl0aWVzL3BvbHlsaW5lYWxnb3JpdGhtKVxuICpcbiAqIFNvbWUgcGFydHMgZnJvbSBbdGhpcyBpbXBsZW1lbnRhdGlvbl0oaHR0cDovL2ZhY3N0YWZmLnVuY2EuZWR1L21jbWNjbHVyL0dvb2dsZU1hcHMvRW5jb2RlUG9seWxpbmUvUG9seWxpbmVFbmNvZGVyLmpzKVxuICogYnkgW01hcmsgTWNDbHVyZV0oaHR0cDovL2ZhY3N0YWZmLnVuY2EuZWR1L21jbWNjbHVyLylcbiAqXG4gKiBAbW9kdWxlIHBvbHlsaW5lXG4gKi9cblxudmFyIHBvbHlsaW5lID0ge307XG5cbmZ1bmN0aW9uIHB5Ml9yb3VuZCh2YWx1ZSkge1xuICAgIC8vIEdvb2dsZSdzIHBvbHlsaW5lIGFsZ29yaXRobSB1c2VzIHRoZSBzYW1lIHJvdW5kaW5nIHN0cmF0ZWd5IGFzIFB5dGhvbiAyLCB3aGljaCBpcyBkaWZmZXJlbnQgZnJvbSBKUyBmb3IgbmVnYXRpdmUgdmFsdWVzXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpICsgMC41KSAqIE1hdGguc2lnbih2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGVuY29kZShjdXJyZW50LCBwcmV2aW91cywgZmFjdG9yKSB7XG4gICAgY3VycmVudCA9IHB5Ml9yb3VuZChjdXJyZW50ICogZmFjdG9yKTtcbiAgICBwcmV2aW91cyA9IHB5Ml9yb3VuZChwcmV2aW91cyAqIGZhY3Rvcik7XG4gICAgdmFyIGNvb3JkaW5hdGUgPSBjdXJyZW50IC0gcHJldmlvdXM7XG4gICAgY29vcmRpbmF0ZSA8PD0gMTtcbiAgICBpZiAoY3VycmVudCAtIHByZXZpb3VzIDwgMCkge1xuICAgICAgICBjb29yZGluYXRlID0gfmNvb3JkaW5hdGU7XG4gICAgfVxuICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICB3aGlsZSAoY29vcmRpbmF0ZSA+PSAweDIwKSB7XG4gICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgweDIwIHwgKGNvb3JkaW5hdGUgJiAweDFmKSkgKyA2Myk7XG4gICAgICAgIGNvb3JkaW5hdGUgPj49IDU7XG4gICAgfVxuICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvb3JkaW5hdGUgKyA2Myk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxuLyoqXG4gKiBEZWNvZGVzIHRvIGEgW2xhdGl0dWRlLCBsb25naXR1ZGVdIGNvb3JkaW5hdGVzIGFycmF5LlxuICpcbiAqIFRoaXMgaXMgYWRhcHRlZCBmcm9tIHRoZSBpbXBsZW1lbnRhdGlvbiBpbiBQcm9qZWN0LU9TUk0uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtOdW1iZXJ9IHByZWNpc2lvblxuICogQHJldHVybnMge0FycmF5fVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Byb2plY3QtT1NSTS9vc3JtLWZyb250ZW5kL2Jsb2IvbWFzdGVyL1dlYkNvbnRlbnQvcm91dGluZy9PU1JNLlJvdXRpbmdHZW9tZXRyeS5qc1xuICovXG5wb2x5bGluZS5kZWNvZGUgPSBmdW5jdGlvbihzdHIsIHByZWNpc2lvbikge1xuICAgIHZhciBpbmRleCA9IDAsXG4gICAgICAgIGxhdCA9IDAsXG4gICAgICAgIGxuZyA9IDAsXG4gICAgICAgIGNvb3JkaW5hdGVzID0gW10sXG4gICAgICAgIHNoaWZ0ID0gMCxcbiAgICAgICAgcmVzdWx0ID0gMCxcbiAgICAgICAgYnl0ZSA9IG51bGwsXG4gICAgICAgIGxhdGl0dWRlX2NoYW5nZSxcbiAgICAgICAgbG9uZ2l0dWRlX2NoYW5nZSxcbiAgICAgICAgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiB8fCA1KTtcblxuICAgIC8vIENvb3JkaW5hdGVzIGhhdmUgdmFyaWFibGUgbGVuZ3RoIHdoZW4gZW5jb2RlZCwgc28ganVzdCBrZWVwXG4gICAgLy8gdHJhY2sgb2Ygd2hldGhlciB3ZSd2ZSBoaXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLiBJbiBlYWNoXG4gICAgLy8gbG9vcCBpdGVyYXRpb24sIGEgc2luZ2xlIGNvb3JkaW5hdGUgaXMgZGVjb2RlZC5cbiAgICB3aGlsZSAoaW5kZXggPCBzdHIubGVuZ3RoKSB7XG5cbiAgICAgICAgLy8gUmVzZXQgc2hpZnQsIHJlc3VsdCwgYW5kIGJ5dGVcbiAgICAgICAgYnl0ZSA9IG51bGw7XG4gICAgICAgIHNoaWZ0ID0gMDtcbiAgICAgICAgcmVzdWx0ID0gMDtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBieXRlID0gc3RyLmNoYXJDb2RlQXQoaW5kZXgrKykgLSA2MztcbiAgICAgICAgICAgIHJlc3VsdCB8PSAoYnl0ZSAmIDB4MWYpIDw8IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgKz0gNTtcbiAgICAgICAgfSB3aGlsZSAoYnl0ZSA+PSAweDIwKTtcblxuICAgICAgICBsYXRpdHVkZV9jaGFuZ2UgPSAoKHJlc3VsdCAmIDEpID8gfihyZXN1bHQgPj4gMSkgOiAocmVzdWx0ID4+IDEpKTtcblxuICAgICAgICBzaGlmdCA9IHJlc3VsdCA9IDA7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgYnl0ZSA9IHN0ci5jaGFyQ29kZUF0KGluZGV4KyspIC0gNjM7XG4gICAgICAgICAgICByZXN1bHQgfD0gKGJ5dGUgJiAweDFmKSA8PCBzaGlmdDtcbiAgICAgICAgICAgIHNoaWZ0ICs9IDU7XG4gICAgICAgIH0gd2hpbGUgKGJ5dGUgPj0gMHgyMCk7XG5cbiAgICAgICAgbG9uZ2l0dWRlX2NoYW5nZSA9ICgocmVzdWx0ICYgMSkgPyB+KHJlc3VsdCA+PiAxKSA6IChyZXN1bHQgPj4gMSkpO1xuXG4gICAgICAgIGxhdCArPSBsYXRpdHVkZV9jaGFuZ2U7XG4gICAgICAgIGxuZyArPSBsb25naXR1ZGVfY2hhbmdlO1xuXG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW2xhdCAvIGZhY3RvciwgbG5nIC8gZmFjdG9yXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xufTtcblxuLyoqXG4gKiBFbmNvZGVzIHRoZSBnaXZlbiBbbGF0aXR1ZGUsIGxvbmdpdHVkZV0gY29vcmRpbmF0ZXMgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fSBjb29yZGluYXRlc1xuICogQHBhcmFtIHtOdW1iZXJ9IHByZWNpc2lvblxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xucG9seWxpbmUuZW5jb2RlID0gZnVuY3Rpb24oY29vcmRpbmF0ZXMsIHByZWNpc2lvbikge1xuICAgIGlmICghY29vcmRpbmF0ZXMubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuXG4gICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24gfHwgNSksXG4gICAgICAgIG91dHB1dCA9IGVuY29kZShjb29yZGluYXRlc1swXVswXSwgMCwgZmFjdG9yKSArIGVuY29kZShjb29yZGluYXRlc1swXVsxXSwgMCwgZmFjdG9yKTtcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGEgPSBjb29yZGluYXRlc1tpXSwgYiA9IGNvb3JkaW5hdGVzW2kgLSAxXTtcbiAgICAgICAgb3V0cHV0ICs9IGVuY29kZShhWzBdLCBiWzBdLCBmYWN0b3IpO1xuICAgICAgICBvdXRwdXQgKz0gZW5jb2RlKGFbMV0sIGJbMV0sIGZhY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmZ1bmN0aW9uIGZsaXBwZWQoY29vcmRzKSB7XG4gICAgdmFyIGZsaXBwZWQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmbGlwcGVkLnB1c2goY29vcmRzW2ldLnNsaWNlKCkucmV2ZXJzZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsaXBwZWQ7XG59XG5cbi8qKlxuICogRW5jb2RlcyBhIEdlb0pTT04gTGluZVN0cmluZyBmZWF0dXJlL2dlb21ldHJ5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBnZW9qc29uXG4gKiBAcGFyYW0ge051bWJlcn0gcHJlY2lzaW9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5wb2x5bGluZS5mcm9tR2VvSlNPTiA9IGZ1bmN0aW9uKGdlb2pzb24sIHByZWNpc2lvbikge1xuICAgIGlmIChnZW9qc29uICYmIGdlb2pzb24udHlwZSA9PT0gJ0ZlYXR1cmUnKSB7XG4gICAgICAgIGdlb2pzb24gPSBnZW9qc29uLmdlb21ldHJ5O1xuICAgIH1cbiAgICBpZiAoIWdlb2pzb24gfHwgZ2VvanNvbi50eXBlICE9PSAnTGluZVN0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBtdXN0IGJlIGEgR2VvSlNPTiBMaW5lU3RyaW5nJyk7XG4gICAgfVxuICAgIHJldHVybiBwb2x5bGluZS5lbmNvZGUoZmxpcHBlZChnZW9qc29uLmNvb3JkaW5hdGVzKSwgcHJlY2lzaW9uKTtcbn07XG5cbi8qKlxuICogRGVjb2RlcyB0byBhIEdlb0pTT04gTGluZVN0cmluZyBnZW9tZXRyeS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge051bWJlcn0gcHJlY2lzaW9uXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5wb2x5bGluZS50b0dlb0pTT04gPSBmdW5jdGlvbihzdHIsIHByZWNpc2lvbikge1xuICAgIHZhciBjb29yZHMgPSBwb2x5bGluZS5kZWNvZGUoc3RyLCBwcmVjaXNpb24pO1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IGZsaXBwZWQoY29vcmRzKVxuICAgIH07XG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHBvbHlsaW5lO1xufVxuIiwiLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gKiBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gKiBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAqIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuIFRoZSBmdW5jdGlvbiBhbHNvIGhhcyBhIHByb3BlcnR5ICdjbGVhcicgXG4gKiB0aGF0IGlzIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBjbGVhciB0aGUgdGltZXIgdG8gcHJldmVudCBwcmV2aW91c2x5IHNjaGVkdWxlZCBleGVjdXRpb25zLiBcbiAqXG4gKiBAc291cmNlIHVuZGVyc2NvcmUuanNcbiAqIEBzZWUgaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIHRvIHdyYXBcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IGluIG1zIChgMTAwYClcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gd2hldGhlciB0byBleGVjdXRlIGF0IHRoZSBiZWdpbm5pbmcgKGBmYWxzZWApXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKXtcbiAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuICBpZiAobnVsbCA9PSB3YWl0KSB3YWl0ID0gMTAwO1xuXG4gIGZ1bmN0aW9uIGxhdGVyKCkge1xuICAgIHZhciBsYXN0ID0gRGF0ZS5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID49IDApIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgZGVib3VuY2VkID0gZnVuY3Rpb24oKXtcbiAgICBjb250ZXh0ID0gdGhpcztcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBkZWJvdW5jZWQuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBkZWJvdW5jZWQ7XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoJ3F1ZXVlJywgZmFjdG9yeSkgOlxuICAoZ2xvYmFsLnF1ZXVlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHNsaWNlID0gW10uc2xpY2U7XG5cbiAgZnVuY3Rpb24gbm9vcCgpIHt9XG5cbiAgdmFyIG5vYWJvcnQgPSB7fTtcbiAgdmFyIHN1Y2Nlc3MgPSBbbnVsbF07XG4gIGZ1bmN0aW9uIG5ld1F1ZXVlKGNvbmN1cnJlbmN5KSB7XG4gICAgaWYgKCEoY29uY3VycmVuY3kgPj0gMSkpIHRocm93IG5ldyBFcnJvcjtcblxuICAgIHZhciBxLFxuICAgICAgICB0YXNrcyA9IFtdLFxuICAgICAgICByZXN1bHRzID0gW10sXG4gICAgICAgIHdhaXRpbmcgPSAwLFxuICAgICAgICBhY3RpdmUgPSAwLFxuICAgICAgICBlbmRlZCA9IDAsXG4gICAgICAgIHN0YXJ0aW5nLCAvLyBpbnNpZGUgYSBzeW5jaHJvbm91cyB0YXNrIGNhbGxiYWNrP1xuICAgICAgICBlcnJvcixcbiAgICAgICAgY2FsbGJhY2sgPSBub29wLFxuICAgICAgICBjYWxsYmFja0FsbCA9IHRydWU7XG5cbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgIGlmIChzdGFydGluZykgcmV0dXJuOyAvLyBsZXQgdGhlIGN1cnJlbnQgdGFzayBjb21wbGV0ZVxuICAgICAgd2hpbGUgKHN0YXJ0aW5nID0gd2FpdGluZyAmJiBhY3RpdmUgPCBjb25jdXJyZW5jeSkge1xuICAgICAgICB2YXIgaSA9IGVuZGVkICsgYWN0aXZlLFxuICAgICAgICAgICAgdCA9IHRhc2tzW2ldLFxuICAgICAgICAgICAgaiA9IHQubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIGMgPSB0W2pdO1xuICAgICAgICB0W2pdID0gZW5kKGkpO1xuICAgICAgICAtLXdhaXRpbmcsICsrYWN0aXZlLCB0YXNrc1tpXSA9IGMuYXBwbHkobnVsbCwgdCkgfHwgbm9hYm9ydDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmQoaSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUsIHIpIHtcbiAgICAgICAgaWYgKCF0YXNrc1tpXSkgdGhyb3cgbmV3IEVycm9yOyAvLyBkZXRlY3QgbXVsdGlwbGUgY2FsbGJhY2tzXG4gICAgICAgIC0tYWN0aXZlLCArK2VuZGVkLCB0YXNrc1tpXSA9IG51bGw7XG4gICAgICAgIGlmIChlcnJvciAhPSBudWxsKSByZXR1cm47IC8vIG9ubHkgcmVwb3J0IHRoZSBmaXJzdCBlcnJvclxuICAgICAgICBpZiAoZSAhPSBudWxsKSB7XG4gICAgICAgICAgYWJvcnQoZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0c1tpXSA9IHI7XG4gICAgICAgICAgaWYgKHdhaXRpbmcpIHN0YXJ0KCk7XG4gICAgICAgICAgZWxzZSBpZiAoIWFjdGl2ZSkgbm90aWZ5KCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJvcnQoZSkge1xuICAgICAgZXJyb3IgPSBlOyAvLyBpZ25vcmUgbmV3IHRhc2tzIGFuZCBzcXVlbGNoIGFjdGl2ZSBjYWxsYmFja3NcbiAgICAgIHdhaXRpbmcgPSBOYU47IC8vIHN0b3AgcXVldWVkIHRhc2tzIGZyb20gc3RhcnRpbmdcbiAgICAgIG5vdGlmeSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vdGlmeSgpIHtcbiAgICAgIGlmIChlcnJvciAhPSBudWxsKSBjYWxsYmFjayhlcnJvcik7XG4gICAgICBlbHNlIGlmIChjYWxsYmFja0FsbCkgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICBlbHNlIGNhbGxiYWNrLmFwcGx5KG51bGwsIHN1Y2Nlc3MuY29uY2F0KHJlc3VsdHMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcSA9IHtcbiAgICAgIGRlZmVyOiBmdW5jdGlvbihmKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayAhPT0gbm9vcCkgdGhyb3cgbmV3IEVycm9yO1xuICAgICAgICB2YXIgdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgdC5wdXNoKGYpO1xuICAgICAgICArK3dhaXRpbmcsIHRhc2tzLnB1c2godCk7XG4gICAgICAgIHN0YXJ0KCk7XG4gICAgICAgIHJldHVybiBxO1xuICAgICAgfSxcbiAgICAgIGFib3J0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGVycm9yID09IG51bGwpIHtcbiAgICAgICAgICB2YXIgaSA9IGVuZGVkICsgYWN0aXZlLCB0O1xuICAgICAgICAgIHdoaWxlICgtLWkgPj0gMCkgKHQgPSB0YXNrc1tpXSkgJiYgdC5hYm9ydCAmJiB0LmFib3J0KCk7XG4gICAgICAgICAgYWJvcnQobmV3IEVycm9yKFwiYWJvcnRcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBxO1xuICAgICAgfSxcbiAgICAgIGF3YWl0OiBmdW5jdGlvbihmKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayAhPT0gbm9vcCkgdGhyb3cgbmV3IEVycm9yO1xuICAgICAgICBjYWxsYmFjayA9IGYsIGNhbGxiYWNrQWxsID0gZmFsc2U7XG4gICAgICAgIGlmICghd2FpdGluZyAmJiAhYWN0aXZlKSBub3RpZnkoKTtcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgICB9LFxuICAgICAgYXdhaXRBbGw6IGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9PSBub29wKSB0aHJvdyBuZXcgRXJyb3I7XG4gICAgICAgIGNhbGxiYWNrID0gZiwgY2FsbGJhY2tBbGwgPSB0cnVlO1xuICAgICAgICBpZiAoIXdhaXRpbmcgJiYgIWFjdGl2ZSkgbm90aWZ5KCk7XG4gICAgICAgIHJldHVybiBxO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBxdWV1ZShjb25jdXJyZW5jeSkge1xuICAgIHJldHVybiBuZXdRdWV1ZShhcmd1bWVudHMubGVuZ3RoID8gK2NvbmN1cnJlbmN5IDogSW5maW5pdHkpO1xuICB9XG5cbiAgcXVldWUudmVyc2lvbiA9IFwiMS4yLjFcIjtcblxuICByZXR1cm4gcXVldWU7XG5cbn0pKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGdldFJlcXVlc3QgPSByZXF1aXJlKFwiLi9nZXRfcmVxdWVzdFwiKSxcbiAgICBwb2x5bGluZSA9IHJlcXVpcmUoXCJAbWFwYm94L3BvbHlsaW5lXCIpLFxuICAgIHF1ZXVlID0gcmVxdWlyZShcInF1ZXVlLWFzeW5jXCIpO1xuXG52YXIgRGlyZWN0aW9ucyA9IEwuQ2xhc3MuZXh0ZW5kKHtcbiAgICBpbmNsdWRlczogW0wuTWl4aW4uRXZlbnRzXSxcblxuICAgIG9wdGlvbnM6IHtcbiAgICAgICAgcHJvdmlkZXI6IFwib3BlbnJvdXRlc2VydmljZVwiLFxuICAgICAgICBtYXBib3g6IHtcbiAgICAgICAgICAgIGFwaV90ZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vYXBpLm1hcGJveC5jb20vZGlyZWN0aW9ucy92NS9tYXBib3gvY3ljbGluZy97d2F5cG9pbnRzfT9nZW9tZXRyaWVzPXBvbHlsaW5lJmFjY2Vzc190b2tlbj17dG9rZW59XCIsXG4gICAgICAgICAgICBnZW9jb2Rlcl90ZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQvZ2VvY29kZS9tYXBib3gucGxhY2VzL3txdWVyeX0uanNvbj9wcm94aW1pdHk9e3Byb3hpbWl0eX0mYWNjZXNzX3Rva2VuPXt0b2tlbn1cIixcbiAgICAgICAgICAgIGtleTpcbiAgICAgICAgICAgICAgICBcInBrLmV5SjFJam9pYkd4cGRTSXNJbUVpT2lJNGRXNXVWa1ZKSW4wLmpoZnBMbjJFc2tfNlpTRzYyeVhZT2dcIixcbiAgICAgICAgICAgIHByb2ZpbGU6IFwiY3ljbGluZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIG9wZW5yb3V0ZXNlcnZpY2U6IHtcbiAgICAgICAgICAgIGFwaV90ZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vYXBpLm9wZW5yb3V0ZXNlcnZpY2Uub3JnL2NvcnNkaXJlY3Rpb25zPyZjb29yZGluYXRlcz17Y29vcmRpbmF0ZXN9Jmluc3RydWN0aW9ucz1mYWxzZSZwcmVmZXJlbmNlPXtwcmVmZXJlbmNlfSZwcm9maWxlPXtwcm9maWxlfSZhcGlfa2V5PXt0b2tlbn1cIixcbiAgICAgICAgICAgIGtleTogXCI1OGQ5MDRhNDk3YzY3ZTAwMDE1YjQ1ZmNmMjQzZWFjZjRiMjU0MzRjNmUyOGQ3ZmQ2MWM5ZDMwOVwiLFxuICAgICAgICAgICAgcHJlZmVyZW5jZTogXCJcIixcbiAgICAgICAgICAgIHByb2ZpbGU6IFwiY3ljbGluZy1yZWd1bGFyXCJcbiAgICAgICAgfSxcbiAgICAgICAgZ29vZ2xlOiB7XG4gICAgICAgICAgICBhcGlfdGVtcGxhdGU6XG4gICAgICAgICAgICAgICAgXCJodHRwczovL2x1bGl1Lm1lL2dtYXBzd3JhcHBlcj9vcmlnaW49e29yaWdpbn0mZGVzdGluYXRpb249e2Rlc3RpbmF0aW9ufSZtb2RlPWJpY3ljbGluZyZrZXk9e3Rva2VufVwiLFxuICAgICAgICAgICAga2V5OiBcIkFJemFTeURjMmdhZFdJNG51blliMGk1TXhfUDNBSF95RFRpTXpBWVwiLFxuICAgICAgICAgICAgcHJvZmlsZTogXCJiaWN5Y2xpbmdcIlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgTC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl93YXlwb2ludHMgPSBbXTtcbiAgICB9LFxuXG4gICAgZ2V0T3JpZ2luOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luO1xuICAgIH0sXG5cbiAgICBnZXREZXN0aW5hdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIH0sXG5cbiAgICBzZXRPcmlnaW46IGZ1bmN0aW9uKG9yaWdpbikge1xuICAgICAgICBvcmlnaW4gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludChvcmlnaW4pO1xuXG4gICAgICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xuICAgICAgICB0aGlzLmZpcmUoXCJvcmlnaW5cIiwge1xuICAgICAgICAgICAgb3JpZ2luOiBvcmlnaW5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICAgIHRoaXMuX3VubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldERlc3RpbmF0aW9uOiBmdW5jdGlvbihkZXN0aW5hdGlvbikge1xuICAgICAgICBkZXN0aW5hdGlvbiA9IHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KGRlc3RpbmF0aW9uKTtcblxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuZmlyZShcImRlc3RpbmF0aW9uXCIsIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBkZXN0aW5hdGlvblxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl91bmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBnZXRXYXlwb2ludHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2F5cG9pbnRzO1xuICAgIH0sXG5cbiAgICBzZXRXYXlwb2ludHM6IGZ1bmN0aW9uKHdheXBvaW50cykge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMgPSB3YXlwb2ludHMubWFwKHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGFkZFdheXBvaW50OiBmdW5jdGlvbihpbmRleCwgd2F5cG9pbnQpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzLnNwbGljZShpbmRleCwgMCwgdGhpcy5fbm9ybWFsaXplV2F5cG9pbnQod2F5cG9pbnQpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZVdheXBvaW50OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldFdheXBvaW50OiBmdW5jdGlvbihpbmRleCwgd2F5cG9pbnQpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzW2luZGV4XSA9IHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KHdheXBvaW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJldmVyc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbyA9IHRoaXMub3JpZ2luLFxuICAgICAgICAgICAgZCA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICAgICAgdGhpcy5vcmlnaW4gPSBkO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbztcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzLnJldmVyc2UoKTtcblxuICAgICAgICB0aGlzLmZpcmUoXCJvcmlnaW5cIiwge1xuICAgICAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpblxuICAgICAgICB9KS5maXJlKFwiZGVzdGluYXRpb25cIiwge1xuICAgICAgICAgICAgZGVzdGluYXRpb246IHRoaXMuZGVzdGluYXRpb25cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNlbGVjdFJvdXRlOiBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICB0aGlzLmZpcmUoXCJzZWxlY3RSb3V0ZVwiLCB7XG4gICAgICAgICAgICByb3V0ZTogcm91dGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNlbGVjdFRyYWNrOiBmdW5jdGlvbih0cmFjaykge1xuICAgICAgICB0aGlzLmZpcmUoXCJzZWxlY3RUcmFja1wiLCB7XG4gICAgICAgICAgICB0cmFjazogdHJhY2suR2VvSlNPTlxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uKHJvdXRlKSB7XG4gICAgICAgIHRoaXMuZmlyZShcImhpZ2hsaWdodFJvdXRlXCIsIHtcbiAgICAgICAgICAgIHJvdXRlOiByb3V0ZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGlnaGxpZ2h0U3RlcDogZnVuY3Rpb24oc3RlcCkge1xuICAgICAgICB0aGlzLmZpcmUoXCJoaWdobGlnaHRTdGVwXCIsIHtcbiAgICAgICAgICAgIHN0ZXA6IHN0ZXBcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHF1ZXJ5VVJMOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wcm92aWRlciA9IG9wdHMucHJvdmlkZXIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gdGhpcy5vcHRpb25zW3RoaXMub3B0aW9ucy5wcm92aWRlcl0uYXBpX3RlbXBsYXRlO1xuICAgICAgICB2YXIgcG9pbnRzID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcm92aWRlciA9PT0gXCJtYXBib3hcIikge1xuICAgICAgICAgICAgcG9pbnRzID0gW3RoaXMuZ2V0T3JpZ2luKCksIHRoaXMuZ2V0RGVzdGluYXRpb24oKV1cbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuam9pbihcIjtcIik7XG4gICAgICAgICAgICByZXR1cm4gTC5VdGlsLnRlbXBsYXRlKHRlbXBsYXRlLCB7XG4gICAgICAgICAgICAgICAgdG9rZW46IHRoaXMub3B0aW9ucy5tYXBib3gua2V5LFxuICAgICAgICAgICAgICAgIHdheXBvaW50czogcG9pbnRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnByb3ZpZGVyID09PSBcIm9wZW5yb3V0ZXNlcnZpY2VcIikge1xuICAgICAgICAgICAgcG9pbnRzID0gW3RoaXMuZ2V0T3JpZ2luKCksIHRoaXMuZ2V0RGVzdGluYXRpb24oKV1cbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuam9pbihcInxcIik7XG4gICAgICAgICAgICBpZiAob3B0cy5oYXNPd25Qcm9wZXJ0eShcInByZWZlcmVuY2VcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub3BlbnJvdXRlc2VydmljZS5wcmVmZXJlbmNlID0gb3B0cy5wcmVmZXJlbmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdHMuaGFzT3duUHJvcGVydHkoXCJwcm9maWxlXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9wZW5yb3V0ZXNlcnZpY2UucHJvZmlsZSA9IG9wdHMucHJvZmlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBMLlV0aWwudGVtcGxhdGUodGVtcGxhdGUsIHtcbiAgICAgICAgICAgICAgICB0b2tlbjogdGhpcy5vcHRpb25zLm9wZW5yb3V0ZXNlcnZpY2Uua2V5LFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb2ludHMsXG4gICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogdGhpcy5vcHRpb25zLm9wZW5yb3V0ZXNlcnZpY2UucHJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB0aGlzLm9wdGlvbnMub3BlbnJvdXRlc2VydmljZS5wcm9maWxlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnByb3ZpZGVyID09PSBcImdvb2dsZVwiKSB7XG4gICAgICAgICAgICB2YXIgb3JpZ2luX2Nvb3JkcyA9IHRoaXMuZ2V0T3JpZ2luKCkuZ2VvbWV0cnkuY29vcmRpbmF0ZXMuc2xpY2UoKTtcbiAgICAgICAgICAgIHZhciBkZXN0X2Nvb3JkcyA9IHRoaXMuZ2V0RGVzdGluYXRpb24oKS5nZW9tZXRyeS5jb29yZGluYXRlcy5zbGljZSgpO1xuICAgICAgICAgICAgcmV0dXJuIEwuVXRpbC50ZW1wbGF0ZSh0ZW1wbGF0ZSwge1xuICAgICAgICAgICAgICAgIHRva2VuOiB0aGlzLm9wdGlvbnMuZ29vZ2xlLmtleSxcbiAgICAgICAgICAgICAgICBvcmlnaW46IG9yaWdpbl9jb29yZHMucmV2ZXJzZSgpLmpvaW4oXCIsXCIpLFxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBkZXN0X2Nvb3Jkcy5yZXZlcnNlKCkuam9pbihcIixcIilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIF9jb25zdHJ1Y3RSb3V0aW5nUmVzdWx0OiBmdW5jdGlvbihyZXNwLCBwcm92aWRlcikge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbnMgPSByZXNwO1xuICAgICAgICBpZiAocHJvdmlkZXIgPT09IFwibWFwYm94XCIpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5vcmlnaW4gPSByZXNwLndheXBvaW50c1swXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbiA9IHJlc3Aud2F5cG9pbnRzLnNsaWNlKC0xKVswXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMuZm9yRWFjaChmdW5jdGlvbih3cCkge1xuICAgICAgICAgICAgICAgIHdwLmdlb21ldHJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBvaW50XCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiB3cC5sb2NhdGlvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgd3AucHJvcGVydGllcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogd3AubmFtZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMgPSByZXNwLndheXBvaW50cy5zbGljZSgxLCAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3ZpZGVyID09PSBcIm9wZW5yb3V0ZXNlcnZpY2VcIikge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9IHJlc3AuaW5mby5xdWVyeS5jb29yZGluYXRlc1swXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbiA9IHJlc3AuaW5mby5xdWVyeS5jb29yZGluYXRlc1sxXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvdmlkZXIgPT09IFwibWFwYm94XCIgfHwgcHJvdmlkZXIgPT09IFwib3BlbnJvdXRlc2VydmljZVwiKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMucm91dGVzLmZvckVhY2goZnVuY3Rpb24ocm91dGUpIHtcbiAgICAgICAgICAgICAgICByb3V0ZS5nZW9tZXRyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb2x5bGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRlY29kZShyb3V0ZS5nZW9tZXRyeSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24oYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm92aWRlciA9PT0gXCJnb29nbGVcIikge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9IHRoaXMub3JpZ2luO1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLmRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5yb3V0ZXMuZm9yRWFjaChmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICAgICAgICAgIHJvdXRlLmdlb21ldHJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IHBvbHlsaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGVjb2RlKHJvdXRlLm92ZXJ2aWV3X3BvbHlsaW5lLnBvaW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24oYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHF1ZXJ5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE9yaWdpbigpICYmIHRoaXMuZ2V0RGVzdGluYXRpb24oKTtcbiAgICB9LFxuXG4gICAgcXVlcnk6IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgaWYgKCFvcHRzKVxuICAgICAgICAgICAgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICBwcm92aWRlcjogdGhpcy5vcHRpb25zLnByb3ZpZGVyXG4gICAgICAgICAgICB9O1xuICAgICAgICBpZiAoIXRoaXMucXVlcnlhYmxlKCkpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLl9xdWVyeSkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnkuYWJvcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0cyAmJiB0aGlzLl9yZXF1ZXN0cy5sZW5ndGgpXG4gICAgICAgICAgICB0aGlzLl9yZXF1ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uKGdldFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICBnZXRSZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMgPSBbXTtcblxuICAgICAgICB2YXIgcSA9IHF1ZXVlKCk7XG5cbiAgICAgICAgdmFyIHB0cyA9IFt0aGlzLm9yaWdpbiwgdGhpcy5kZXN0aW5hdGlvbl0uY29uY2F0KHRoaXMuX3dheXBvaW50cyk7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHRzKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIXB0c1tpXS5nZW9tZXRyeS5jb29yZGluYXRlcyB8fFxuICAgICAgICAgICAgICAgICFwdHNbaV0ucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShcIm5hbWVcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHEuZGVmZXIoTC5iaW5kKHRoaXMuX2dlb2NvZGUsIHRoaXMpLCBwdHNbaV0sIG9wdHMucHJveGltaXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHEuYXdhaXQoXG4gICAgICAgICAgICBMLmJpbmQoZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXJlKFwiZXJyb3JcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3F1ZXJ5ID0gZ2V0UmVxdWVzdChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeVVSTChvcHRzKSxcbiAgICAgICAgICAgICAgICAgICAgTC5iaW5kKGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcXVlcnkgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlyZShcImVycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnN0cnVjdFJvdXRpbmdSZXN1bHQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucHJvdmlkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3JpZ2luLnByb3BlcnRpZXMubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5kaXJlY3Rpb25zLm9yaWdpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9IHRoaXMub3JpZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24ucHJvcGVydGllcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLmRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKFwibG9hZFwiLCB0aGlzLmRpcmVjdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfZ2VvY29kZTogZnVuY3Rpb24od2F5cG9pbnQsIHByb3hpbWl0eSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9yZXF1ZXN0cykgdGhpcy5fcmVxdWVzdHMgPSBbXTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMucHVzaChcbiAgICAgICAgICAgIGdldFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgTC5VdGlsLnRlbXBsYXRlKHRoaXMub3B0aW9ucy5tYXBib3guZ2VvY29kZXJfdGVtcGxhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHdheXBvaW50LnByb3BlcnRpZXMucXVlcnksXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiB0aGlzLm9wdGlvbnMubWFwYm94LmtleSB8fCBMLm1hcGJveC5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgcHJveGltaXR5OiBwcm94aW1pdHlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gW3Byb3hpbWl0eS5sbmcsIHByb3hpbWl0eS5sYXRdLmpvaW4oXCIsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBMLmJpbmQoZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmZlYXR1cmVzIHx8ICFyZXNwLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJObyByZXN1bHRzIGZvdW5kIGZvciBxdWVyeSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXlwb2ludC5wcm9wZXJ0aWVzLnF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcmVzcC5mZWF0dXJlc1swXS5jZW50ZXI7XG4gICAgICAgICAgICAgICAgICAgIHdheXBvaW50LnByb3BlcnRpZXMubmFtZSA9IHJlc3AuZmVhdHVyZXNbMF0ucGxhY2VfbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBfdW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gW107XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRpcmVjdGlvbnM7XG4gICAgICAgIHRoaXMuZmlyZShcInVubG9hZFwiKTtcbiAgICB9LFxuXG4gICAgX25vcm1hbGl6ZVdheXBvaW50OiBmdW5jdGlvbih3YXlwb2ludCkge1xuICAgICAgICBpZiAoIXdheXBvaW50IHx8IHdheXBvaW50LnR5cGUgPT09IFwiRmVhdHVyZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29vcmRpbmF0ZXMsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0ge307XG5cbiAgICAgICAgaWYgKHdheXBvaW50IGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgIHdheXBvaW50ID0gd2F5cG9pbnQud3JhcCgpO1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSBwcm9wZXJ0aWVzLnF1ZXJ5ID0gW3dheXBvaW50LmxuZywgd2F5cG9pbnQubGF0XTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2F5cG9pbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucXVlcnkgPSB3YXlwb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBcIkZlYXR1cmVcIixcbiAgICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJQb2ludFwiLFxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNcbiAgICAgICAgfTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBEaXJlY3Rpb25zKG9wdGlvbnMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyksXG4gICAgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtZXJyb3JzJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkIHVubG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWVycm9yLWFjdGl2ZScsIGZhbHNlKVxuICAgICAgICAgICAgLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZXJyb3ItYWN0aXZlJywgdHJ1ZSlcbiAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtZXJyb3InKVxuICAgICAgICAgICAgLnRleHQoZS5lcnJvcik7XG5cbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuaW5zZXJ0KCdzcGFuJywgJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWVycm9yLWljb24nKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZHVyYXRpb246IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBtID0gTWF0aC5mbG9vcihzIC8gNjApLFxuICAgICAgICAgICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICAgICAgcyAlPSA2MDtcbiAgICAgICAgbSAlPSA2MDtcbiAgICAgICAgaWYgKGggPT09IDAgJiYgbSA9PT0gMCkgcmV0dXJuIHMgKyAnIHMnO1xuICAgICAgICBpZiAoaCA9PT0gMCkgcmV0dXJuIG0gKyAnIG1pbic7XG4gICAgICAgIHJldHVybiBoICsgJyBoICcgKyBtICsgJyBtaW4nO1xuICAgIH0sXG5cbiAgICBpbXBlcmlhbDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIG1pID0gbSAvIDE2MDkuMzQ0O1xuICAgICAgICBpZiAobWkgPj0gMTAwKSByZXR1cm4gbWkudG9GaXhlZCgwKSArICcgbWknO1xuICAgICAgICBpZiAobWkgPj0gMTApICByZXR1cm4gbWkudG9GaXhlZCgxKSArICcgbWknO1xuICAgICAgICBpZiAobWkgPj0gMC4xKSByZXR1cm4gbWkudG9GaXhlZCgyKSArICcgbWknO1xuICAgICAgICByZXR1cm4gKG1pICogNTI4MCkudG9GaXhlZCgwKSArICcgZnQnO1xuICAgIH0sXG5cbiAgICBtZXRyaWM6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIGlmIChtID49IDEwMDAwMCkgcmV0dXJuIChtIC8gMTAwMCkudG9GaXhlZCgwKSArICcga20nO1xuICAgICAgICBpZiAobSA+PSAxMDAwMCkgIHJldHVybiAobSAvIDEwMDApLnRvRml4ZWQoMSkgKyAnIGttJztcbiAgICAgICAgaWYgKG0gPj0gMTAwKSAgICByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDIpICsgJyBrbSc7XG4gICAgICAgIHJldHVybiBtLnRvRml4ZWQoMCkgKyAnIG0nO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb3JzbGl0ZSA9IHJlcXVpcmUoJ0BtYXBib3gvY29yc2xpdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGNvcnNsaXRlKHVybCwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICBpZiAoZXJyICYmIGVyci50eXBlID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyICYmICFlcnIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3AgPSByZXNwIHx8IGVycjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcCA9IEpTT04ucGFyc2UocmVzcC5yZXNwb25zZVRleHQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHJlc3AucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzcC5lcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihyZXNwLmVycm9yKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgcmVzcCk7XG4gICAgfSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBkMyA9IHJlcXVpcmUoXCIuLi9saWIvZDNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSxcbiAgICAgICAgbWFwO1xuICAgIHZhciBvcmlnQ2hhbmdlID0gZmFsc2UsXG4gICAgICAgIGRlc3RDaGFuZ2UgPSBmYWxzZTtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbihfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkM1xuICAgICAgICAuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoXCJtYXBib3gtZGlyZWN0aW9ucy1pbnB1dHNcIiwgdHJ1ZSk7XG5cbiAgICB2YXIgZm9ybSA9IGNvbnRhaW5lci5hcHBlbmQoXCJmb3JtXCIpLm9uKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkMy5ldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChvcmlnQ2hhbmdlKSBkaXJlY3Rpb25zLnNldE9yaWdpbihvcmlnaW5JbnB1dC5wcm9wZXJ0eShcInZhbHVlXCIpKTtcbiAgICAgICAgICAgIGlmIChkZXN0Q2hhbmdlKVxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24oZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eShcInZhbHVlXCIpKTtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkaXJlY3Rpb25Qcm92aWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLmhhc093blByb3BlcnR5KGtleSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvblByb3ZpZGVyc1trZXldID09PSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5xdWVyeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveGltaXR5OiBtYXAuZ2V0Q2VudGVyKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXI6IGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBvcmlnQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICBkZXN0Q2hhbmdlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBvcmlnaW4gPSBmb3JtLmFwcGVuZChcImRpdlwiKS5hdHRyKFwiY2xhc3NcIiwgXCJtYXBib3gtZGlyZWN0aW9ucy1vcmlnaW5cIik7XG5cbiAgICBvcmlnaW5cbiAgICAgICAgLmFwcGVuZChcImxhYmVsXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXBib3gtZm9ybS1sYWJlbFwiKVxuICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLmdldE9yaWdpbigpIGluc3RhbmNlb2YgTC5MYXRMbmcpIHtcbiAgICAgICAgICAgICAgICBtYXAucGFuVG8oZGlyZWN0aW9ucy5nZXRPcmlnaW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1kZXBhcnQtaWNvblwiKTtcblxuICAgIHZhciBvcmlnaW5JbnB1dCA9IG9yaWdpblxuICAgICAgICAuYXBwZW5kKFwiaW5wdXRcIilcbiAgICAgICAgLmF0dHIoXCJ0eXBlXCIsIFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcInJlcXVpcmVkXCIsIFwicmVxdWlyZWRcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcImFpci1vcmlnaW4taW5wdXRcIilcbiAgICAgICAgLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIlN0YXJ0XCIpXG4gICAgICAgIC5vbihcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFvcmlnQ2hhbmdlKSBvcmlnQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICBvcmlnaW5cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtY2xvc2UtaWNvblwiKVxuICAgICAgICAuYXR0cihcInRpdGxlXCIsIFwiQ2xlYXIgdmFsdWVcIilcbiAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldE9yaWdpbih1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgIGZvcm1cbiAgICAgICAgLmFwcGVuZChcInNwYW5cIilcbiAgICAgICAgLmF0dHIoXG4gICAgICAgICAgICBcImNsYXNzXCIsXG4gICAgICAgICAgICBcIm1hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LXJldmVyc2UtaWNvbiBtYXBib3gtZGlyZWN0aW9ucy1yZXZlcnNlLWlucHV0XCJcbiAgICAgICAgKVxuICAgICAgICAuYXR0cihcInRpdGxlXCIsIFwiUmV2ZXJzZSBvcmlnaW4gJiBkZXN0aW5hdGlvblwiKVxuICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkaXJlY3Rpb25Qcm92aWRlcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvblByb3ZpZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvblByb3ZpZGVyc1trZXldID09PSB0cnVlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMucmV2ZXJzZSgpLnF1ZXJ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBrZXlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHZhciBkZXN0aW5hdGlvbiA9IGZvcm1cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibWFwYm94LWRpcmVjdGlvbnMtZGVzdGluYXRpb25cIik7XG5cbiAgICBkZXN0aW5hdGlvblxuICAgICAgICAuYXBwZW5kKFwibGFiZWxcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcGJveC1mb3JtLWxhYmVsXCIpXG4gICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1hcnJpdmUtaWNvblwiKTtcblxuICAgIHZhciBkZXN0aW5hdGlvbklucHV0ID0gZGVzdGluYXRpb25cbiAgICAgICAgLmFwcGVuZChcImlucHV0XCIpXG4gICAgICAgIC5hdHRyKFwidHlwZVwiLCBcInRleHRcIilcbiAgICAgICAgLmF0dHIoXCJyZXF1aXJlZFwiLCBcInJlcXVpcmVkXCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJhaXItZGVzdGluYXRpb24taW5wdXRcIilcbiAgICAgICAgLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIkVuZFwiKVxuICAgICAgICAub24oXCJpbnB1dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghZGVzdENoYW5nZSkgZGVzdENoYW5nZSA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgZGVzdGluYXRpb25cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtY2xvc2UtaWNvblwiKVxuICAgICAgICAuYXR0cihcInRpdGxlXCIsIFwiQ2xlYXIgdmFsdWVcIilcbiAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgdmFyIGRpcmVjdGlvblByb3ZpZGVycyA9IHtcbiAgICAgICAgbWFwYm94OiBmYWxzZSxcbiAgICAgICAgb3BlbnJvdXRlc2VydmljZTogZmFsc2UsXG4gICAgICAgIGdvb2dsZTogZmFsc2VcbiAgICB9O1xuXG4gICAgLy9PcHRpb25zIGJsb2NrIGZvciBNYXBib3ggY3ljbGluZyBwYXRoIGZpbmRpbmdcbiAgICB2YXIgbWFwYm94RGlyZWN0aW9ucyA9IGZvcm1cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIFwibWFwYm94LWRpcmVjdGlvbnNcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGVcIik7XG5cbiAgICBtYXBib3hEaXJlY3Rpb25zXG4gICAgICAgIC5hcHBlbmQoXCJpbnB1dFwiKVxuICAgICAgICAuYXR0cihcInR5cGVcIiwgXCJjaGVja2JveFwiKVxuICAgICAgICAuYXR0cihcIm5hbWVcIiwgXCJlbmFibGVkXCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJzaG93LW1hcGJveC1jeWNsaW5nXCIpXG4gICAgICAgIC5wcm9wZXJ0eShcImNoZWNrZWRcIiwgZmFsc2UpXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLm1hcGJveCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5xdWVyeSh7XG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBcIm1hcGJveFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgZGlyZWN0aW9uUHJvdmlkZXJzLm1hcGJveCA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgIC8vbWFwYm94RGlyZWN0aW9ucy5hcHBlbmQoJ2gzJylcbiAgICAvLy5hdHRyKCd2YWx1ZScsICdNQVBCT1gnKVxuICAgIC8vLmF0dHIoJ3N0eWxlJywgJ21hcmdpbjogNXB4IDBweCAwcHggNXB4JylcbiAgICAvLy50ZXh0KCdNQVBCT1ggRElSRUNUSU9OUycpO1xuXG4gICAgbWFwYm94RGlyZWN0aW9uc1xuICAgICAgICAuYXBwZW5kKFwibGFiZWxcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImFpci1oZWFkaW5nLWxhYmVsXCIpXG4gICAgICAgIC5hdHRyKFwiZm9yXCIsIFwic2hvdy1tYXBib3gtY3ljbGluZ1wiKVxuICAgICAgICAudGV4dChcIk1BUEJPWCBESVJFQ1RJT05TXCIpO1xuXG4gICAgdmFyIGdvb2dsZURpcmVjdGlvbnMgPSBmb3JtXG4gICAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcImdvb2dsZS1kaXJlY3Rpb25zLXByb2ZpbGVcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGVcIik7XG5cbiAgICBnb29nbGVEaXJlY3Rpb25zXG4gICAgICAgIC5hcHBlbmQoXCJpbnB1dFwiKVxuICAgICAgICAuYXR0cihcInR5cGVcIiwgXCJjaGVja2JveFwiKVxuICAgICAgICAuYXR0cihcIm5hbWVcIiwgXCJlbmFibGVkXCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJzaG93LWdvb2dsZS1jeWNsaW5nXCIpXG4gICAgICAgIC5wcm9wZXJ0eShcImNoZWNrZWRcIiwgZmFsc2UpXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLmdvb2dsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5xdWVyeSh7XG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBcImdvb2dsZVwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvblByb3ZpZGVycy5nb29nbGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICBnb29nbGVEaXJlY3Rpb25zXG4gICAgICAgIC5hcHBlbmQoXCJsYWJlbFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiYWlyLWhlYWRpbmctbGFiZWxcIilcbiAgICAgICAgLmF0dHIoXCJmb3JcIiwgXCJzaG93LWdvb2dsZS1jeWNsaW5nXCIpXG4gICAgICAgIC50ZXh0KFwiR09PR0xFIE1BUFNcIik7XG5cbiAgICAvL09wdGlvbnMgYmxvY2sgZm9yIE9wZW5Sb3V0ZVNlcnZpY2UgY3ljbGluZyBwYXRoIGZpbmRpbmdcbiAgICB2YXIgb3JzRGlyZWN0aW9ucyA9IGZvcm1cbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIFwib3JzLWRpcmVjdGlvbnNcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGVcIik7XG5cbiAgICBvcnNEaXJlY3Rpb25zXG4gICAgICAgIC5hcHBlbmQoXCJpbnB1dFwiKVxuICAgICAgICAuYXR0cihcInR5cGVcIiwgXCJjaGVja2JveFwiKVxuICAgICAgICAuYXR0cihcIm5hbWVcIiwgXCJlbmFibGVkXCIpXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJzaG93LW9ycy1jeWNsaW5nXCIpXG4gICAgICAgIC5wcm9wZXJ0eShcImNoZWNrZWRcIiwgZmFsc2UpXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLm9wZW5yb3V0ZXNlcnZpY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMucXVlcnkoe1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcjogXCJvcGVucm91dGVzZXJ2aWNlXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvcnNDeWNsaW5nT3B0aW9ucy5wcm9wZXJ0eShcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uUHJvdmlkZXJzLm9wZW5yb3V0ZXNlcnZpY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBvcnNDeWNsaW5nT3B0aW9ucy5wcm9wZXJ0eShcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIG9yc0RpcmVjdGlvbnNcbiAgICAgICAgLmFwcGVuZChcImxhYmVsXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJhaXItaGVhZGluZy1sYWJlbFwiKVxuICAgICAgICAuYXR0cihcImZvclwiLCBcInNob3ctb3JzLWN5Y2xpbmdcIilcbiAgICAgICAgLnRleHQoXCJPUEVOUk9VVEVTRVJWSUNFXCIpO1xuXG4gICAgdmFyIG9yc0N5Y2xpbmdPcHRpb25zID0gb3JzRGlyZWN0aW9ucy5hcHBlbmQoXCJ1bFwiKTtcbiAgICBvcnNDeWNsaW5nT3B0aW9uc1xuICAgICAgICAuYXBwZW5kKFwibGlcIilcbiAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXBwZW5kKFwiaW5wdXRcIilcbiAgICAgICAgLmF0dHIoXCJ0eXBlXCIsIFwicmFkaW9cIilcbiAgICAgICAgLmF0dHIoXCJuYW1lXCIsIFwib3JzUHJvZmlsZUJpY3ljbGVcIilcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcIm9ycy1iaWN5Y2xlXCIpXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBhbGVydChkKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFwcGVuZChcImxhYmVsXCIpXG4gICAgICAgIC5hdHRyKFwiZm9yXCIsIFwib3JzLWJpY3ljbGVcIilcbiAgICAgICAgLnRleHQoXCJOb3JtYWxcIik7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQod2F5cG9pbnQpIHtcbiAgICAgICAgaWYgKCF3YXlwb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH0gZWxzZSBpZiAod2F5cG9pbnQucHJvcGVydGllcy5uYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQucHJvcGVydGllcy5uYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBNYXRoLmNlaWwoTWF0aC5sb2cobWFwLmdldFpvb20oKSkgLyBNYXRoLkxOMilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLnRvRml4ZWQocHJlY2lzaW9uKSArXG4gICAgICAgICAgICAgICAgXCIsIFwiICtcbiAgICAgICAgICAgICAgICB3YXlwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXS50b0ZpeGVkKHByZWNpc2lvbilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQucHJvcGVydGllcy5xdWVyeSB8fCBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlyZWN0aW9uc1xuICAgICAgICAub24oXCJvcmlnaW5cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoXCJ2YWx1ZVwiLCBmb3JtYXQoZS5vcmlnaW4pKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwiZGVzdGluYXRpb25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eShcInZhbHVlXCIsIGZvcm1hdChlLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcImxvYWRcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoXCJ2YWx1ZVwiLCBmb3JtYXQoZS5vcmlnaW4pKTtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uSW5wdXQucHJvcGVydHkoXCJ2YWx1ZVwiLCBmb3JtYXQoZS5kZXN0aW5hdGlvbikpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyksXG4gICAgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtaW5zdHJ1Y3Rpb25zJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignc2VsZWN0Um91dGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgcm91dGUgPSBlLnJvdXRlO1xuXG4gICAgICAgIGNvbnRhaW5lci5odG1sKCcnKTtcblxuICAgICAgICB2YXIgc3RlcHMgPSBjb250YWluZXIuYXBwZW5kKCdvbCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcHMnKVxuICAgICAgICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmRhdGEocm91dGUuc3RlcHMpXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwJyk7XG5cbiAgICAgICAgc3RlcHMuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAucHJvcGVydGllcy50eXBlID09PSAncGF0aCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1jb250aW51ZS1pY29uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RlcC5wcm9wZXJ0aWVzLnR5cGUgPT09ICdzd2l0Y2hfcG9pbnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBhaXItJyArIHN0ZXAucHJvcGVydGllcy5zd2l0Y2hfdHlwZS50b0xvd2VyQ2FzZSgpICsgJy1pY29uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcC1tYW5ldXZlcicpXG4gICAgICAgICAgICAuaHRtbChmdW5jdGlvbiAoc3RlcCkgeyBcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5wcm9wZXJ0aWVzLnR5cGUgPT09ICdwYXRoJykgeyBcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdGVwLnByb3BlcnRpZXMubW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncHJpdmF0ZV9jYXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnRHJpdmluZyc7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZm9vdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdXYWxraW5nJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JpY3ljbGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnQ3ljbGluZyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLnByb3BlcnRpZXMudGl0bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RlcC5wcm9wZXJ0aWVzLnR5cGUgPT09ICdzd2l0Y2hfcG9pbnQnKSB7IFxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcC5wcm9wZXJ0aWVzLnN3aXRjaF90eXBlID09PSAndW5kZXJncm91bmRfc3RhdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLnByb3BlcnRpZXMudGl0bGUgKyAnOiBQbGF0Zm9ybSAnICsgc3RlcC5wcm9wZXJ0aWVzLnBsYXRmb3JtO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLnByb3BlcnRpZXMudGl0bGU7IFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcC1kaXN0YW5jZScpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLnByb3BlcnRpZXMuZGlzdGFuY2UgPyBmb3JtYXRbZGlyZWN0aW9ucy5vcHRpb25zLnVuaXRzXShzdGVwLnByb3BlcnRpZXMuZGlzdGFuY2UpIDogJyc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignbW91c2VvdmVyJywgZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0U3RlcChzdGVwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RlcHMub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRTdGVwKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgaWYgKHN0ZXAubG9jKSB7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhzdGVwLmxvYykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlYm91bmNlID0gcmVxdWlyZSgnZGVib3VuY2UnKTtcblxudmFyIExheWVyID0gTC5MYXllckdyb3VwLmV4dGVuZCh7XG4gICAgb3B0aW9uczoge1xuICAgICAgICByZWFkb25seTogZmFsc2VcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oZGlyZWN0aW9ucywgb3B0aW9ucykge1xuICAgICAgICBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnMgPSBkaXJlY3Rpb25zIHx8IG5ldyBMLkRpcmVjdGlvbnMoKTtcbiAgICAgICAgTC5MYXllckdyb3VwLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX2RyYWcgPSBkZWJvdW5jZShMLmJpbmQodGhpcy5fZHJhZywgdGhpcyksIDEwMCk7XG5cbiAgICAgICAgdGhpcy5vcmlnaW5NYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogIXRoaXMub3B0aW9ucy5yZWFkb25seSxcbiAgICAgICAgICAgIGljb246IEwubWFwYm94Lm1hcmtlci5pY29uKHtcbiAgICAgICAgICAgICAgICAnbWFya2VyLXNpemUnOiAnbWVkaXVtJyxcbiAgICAgICAgICAgICAgICAnbWFya2VyLWNvbG9yJzogJyMzQkIyRDAnLFxuICAgICAgICAgICAgICAgICdtYXJrZXItc3ltYm9sJzogJ2EnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25NYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogIXRoaXMub3B0aW9ucy5yZWFkb25seSxcbiAgICAgICAgICAgIGljb246IEwubWFwYm94Lm1hcmtlci5pY29uKHtcbiAgICAgICAgICAgICAgICAnbWFya2VyLXNpemUnOiAnbWVkaXVtJyxcbiAgICAgICAgICAgICAgICAnbWFya2VyLWNvbG9yJzogJyM0NDQnLFxuICAgICAgICAgICAgICAgICdtYXJrZXItc3ltYm9sJzogJ2InXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc3RlcE1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgaWNvbjogTC5kaXZJY29uKHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdtYXBib3gtbWFya2VyLWRyYWctaWNvbiBtYXBib3gtbWFya2VyLWRyYWctaWNvbi1zdGVwJyxcbiAgICAgICAgICAgICAgICBpY29uU2l6ZTogbmV3IEwuUG9pbnQoMTIsIDEyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kcmFnTWFya2VyID0gTC5tYXJrZXIoWzAsIDBdLCB7XG4gICAgICAgICAgICBkcmFnZ2FibGU6ICF0aGlzLm9wdGlvbnMucmVhZG9ubHksXG4gICAgICAgICAgICBpY29uOiB0aGlzLl93YXlwb2ludEljb24oKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXJcbiAgICAgICAgICAgIC5vbignZHJhZ3N0YXJ0JywgdGhpcy5fZHJhZ1N0YXJ0LCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcylcbiAgICAgICAgICAgIC5vbignZHJhZ2VuZCcsIHRoaXMuX2RyYWdFbmQsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucm91dGVMYXllciA9IEwubWFwYm94LmZlYXR1cmVMYXllcigpO1xuICAgICAgICB0aGlzLnJvdXRlSGlnaGxpZ2h0TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoKTtcbiAgICAgICAgdGhpcy50cmFja0xheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKCk7XG5cbiAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMgPSBbXTtcbiAgICB9LFxuXG4gICAgb25BZGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLm9uQWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVhZG9ubHkpIHtcbiAgICAgICAgICB0aGlzLl9tYXBcbiAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuX2NsaWNrLCB0aGlzKVxuICAgICAgICAgICAgICAub24oJ21vdXNlbW92ZScsIHRoaXMuX21vdXNlbW92ZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zXG4gICAgICAgICAgICAub24oJ29yaWdpbicsIHRoaXMuX29yaWdpbiwgdGhpcylcbiAgICAgICAgICAgIC5vbignZGVzdGluYXRpb24nLCB0aGlzLl9kZXN0aW5hdGlvbiwgdGhpcylcbiAgICAgICAgICAgIC5vbignbG9hZCcsIHRoaXMuX2xvYWQsIHRoaXMpXG4gICAgICAgICAgICAub24oJ3VubG9hZCcsIHRoaXMuX3VubG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vbignc2VsZWN0Um91dGUnLCB0aGlzLl9zZWxlY3RSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vbignc2VsZWN0VHJhY2snLCB0aGlzLl9zZWxlY3RUcmFjaywgdGhpcylcbiAgICAgICAgICAgIC5vbignaGlnaGxpZ2h0Um91dGUnLCB0aGlzLl9oaWdobGlnaHRSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vbignaGlnaGxpZ2h0U3RlcCcsIHRoaXMuX2hpZ2hsaWdodFN0ZXAsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvblJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnNcbiAgICAgICAgICAgIC5vZmYoJ29yaWdpbicsIHRoaXMuX29yaWdpbiwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2Rlc3RpbmF0aW9uJywgdGhpcy5fZGVzdGluYXRpb24sIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdsb2FkJywgdGhpcy5fbG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3VubG9hZCcsIHRoaXMuX3VubG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3NlbGVjdFJvdXRlJywgdGhpcy5fc2VsZWN0Um91dGUsIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdzZWxlY3RUcmFjaycsIHRoaXMuX3NlbGVjdFRyYWNrLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignaGlnaGxpZ2h0Um91dGUnLCB0aGlzLl9oaWdobGlnaHRSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2hpZ2hsaWdodFN0ZXAnLCB0aGlzLl9oaWdobGlnaHRTdGVwLCB0aGlzKTtcblxuICAgICAgICB0aGlzLl9tYXBcbiAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywgdGhpcy5fY2xpY2ssIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdtb3VzZW1vdmUnLCB0aGlzLl9tb3VzZW1vdmUsIHRoaXMpO1xuXG4gICAgICAgIEwuTGF5ZXJHcm91cC5wcm90b3R5cGUub25SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgX2NsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlyZWN0aW9ucy5nZXRPcmlnaW4oKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXRPcmlnaW4oZS5sYXRsbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9kaXJlY3Rpb25zLmdldERlc3RpbmF0aW9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24oZS5sYXRsbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiAodGhpcy5fZGlyZWN0aW9ucy5xdWVyeWFibGUoKSkge1xuICAgICAgICAgICAgLy90aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5KCk7XG4gICAgICAgIC8vfVxuICAgIH0sXG5cbiAgICBfbW91c2Vtb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghdGhpcy5yb3V0ZUxheWVyIHx8ICF0aGlzLmhhc0xheWVyKHRoaXMucm91dGVMYXllcikgfHwgdGhpcy5fY3VycmVudFdheXBvaW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwID0gdGhpcy5fcm91dGVQb2x5bGluZSgpLmNsb3Nlc3RMYXllclBvaW50KGUubGF5ZXJQb2ludCk7XG5cbiAgICAgICAgaWYgKCFwIHx8IHAuZGlzdGFuY2UgPiAxNSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtID0gdGhpcy5fbWFwLnByb2plY3QoZS5sYXRsbmcpLFxuICAgICAgICAgICAgbyA9IHRoaXMuX21hcC5wcm9qZWN0KHRoaXMub3JpZ2luTWFya2VyLmdldExhdExuZygpKSxcbiAgICAgICAgICAgIGQgPSB0aGlzLl9tYXAucHJvamVjdCh0aGlzLmRlc3RpbmF0aW9uTWFya2VyLmdldExhdExuZygpKTtcblxuICAgICAgICBpZiAoby5kaXN0YW5jZVRvKG0pIDwgMTUgfHwgZC5kaXN0YW5jZVRvKG0pIDwgMTUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdyA9IHRoaXMuX21hcC5wcm9qZWN0KHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLmdldExhdExuZygpKTtcbiAgICAgICAgICAgIGlmIChpICE9PSB0aGlzLl9jdXJyZW50V2F5cG9pbnQgJiYgdy5kaXN0YW5jZVRvKG0pIDwgMTUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnTWFya2VyLnNldExhdExuZyh0aGlzLl9tYXAubGF5ZXJQb2ludFRvTGF0TG5nKHApKTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgIH0sXG5cbiAgICBfb3JpZ2luOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLm9yaWdpbiAmJiBlLm9yaWdpbi5nZW9tZXRyeS5jb29yZGluYXRlcykge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5NYXJrZXIuc2V0TGF0TG5nKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLm9yaWdpbi5nZW9tZXRyeS5jb29yZGluYXRlcykpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLm9yaWdpbk1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMub3JpZ2luTWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZGVzdGluYXRpb246IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuZGVzdGluYXRpb24gJiYgZS5kZXN0aW5hdGlvbi5nZW9tZXRyeS5jb29yZGluYXRlcykge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk1hcmtlci5zZXRMYXRMbmcoTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUuZGVzdGluYXRpb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5kZXN0aW5hdGlvbk1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZGVzdGluYXRpb25NYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kcmFnU3RhcnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmRyYWdNYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRXYXlwb2ludCA9IHRoaXMuX2ZpbmRXYXlwb2ludEluZGV4KGUudGFyZ2V0LmdldExhdExuZygpKTtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuYWRkV2F5cG9pbnQodGhpcy5fY3VycmVudFdheXBvaW50LCBlLnRhcmdldC5nZXRMYXRMbmcoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50V2F5cG9pbnQgPSB0aGlzLndheXBvaW50TWFya2Vycy5pbmRleE9mKGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZHJhZzogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbGF0TG5nID0gZS50YXJnZXQuZ2V0TGF0TG5nKCk7XG5cbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLm9yaWdpbk1hcmtlcikge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXRPcmlnaW4obGF0TG5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChlLnRhcmdldCA9PT0gdGhpcy5kZXN0aW5hdGlvbk1hcmtlcikge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihsYXRMbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXRXYXlwb2ludCh0aGlzLl9jdXJyZW50V2F5cG9pbnQsIGxhdExuZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9ucy5xdWVyeWFibGUoKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5xdWVyeSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kcmFnRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFdheXBvaW50ID0gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlV2F5cG9pbnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5yZW1vdmVXYXlwb2ludCh0aGlzLndheXBvaW50TWFya2Vycy5pbmRleE9mKGUudGFyZ2V0KSkucXVlcnkoKTtcbiAgICB9LFxuXG4gICAgX2xvYWQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5fb3JpZ2luKGUpO1xuICAgICAgICB0aGlzLl9kZXN0aW5hdGlvbihlKTtcblxuICAgICAgICBmdW5jdGlvbiB3YXlwb2ludExhdExuZyhpKSB7XG4gICAgICAgICAgICByZXR1cm4gTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUud2F5cG9pbnRzW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsID0gTWF0aC5taW4odGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoLCBlLndheXBvaW50cy5sZW5ndGgpLFxuICAgICAgICAgICAgaSA9IDA7XG5cbiAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nXG4gICAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLndheXBvaW50TWFya2Vyc1tpXS5zZXRMYXRMbmcod2F5cG9pbnRMYXRMbmcoaSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIG5ld1xuICAgICAgICBmb3IgKDsgaSA8IGUud2F5cG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgd2F5cG9pbnRNYXJrZXIgPSBMLm1hcmtlcih3YXlwb2ludExhdExuZyhpKSwge1xuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogIXRoaXMub3B0aW9ucy5yZWFkb25seSxcbiAgICAgICAgICAgICAgICBpY29uOiB0aGlzLl93YXlwb2ludEljb24oKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHdheXBvaW50TWFya2VyXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuX3JlbW92ZVdheXBvaW50LCB0aGlzKVxuICAgICAgICAgICAgICAgIC5vbignZHJhZ3N0YXJ0JywgdGhpcy5fZHJhZ1N0YXJ0LCB0aGlzKVxuICAgICAgICAgICAgICAgIC5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnZW5kJywgdGhpcy5fZHJhZ0VuZCwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMud2F5cG9pbnRNYXJrZXJzLnB1c2god2F5cG9pbnRNYXJrZXIpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih3YXlwb2ludE1hcmtlcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgb2xkXG4gICAgICAgIGZvciAoOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy53YXlwb2ludE1hcmtlcnNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoID0gZS53YXlwb2ludHMubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBfdW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMudHJhY2tMYXllcik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy53YXlwb2ludE1hcmtlcnNbaV0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZWxlY3RSb3V0ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLnJvdXRlTGF5ZXJcbiAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAuc2V0R2VvSlNPTihlLnJvdXRlLmdlb21ldHJ5KTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgIH0sXG5cbiAgICBfc2VsZWN0VHJhY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy50cmFja0xheWVyXG4gICAgICAgICAgICAuY2xlYXJMYXllcnMoKVxuICAgICAgICAgICAgLnNldEdlb0pTT04oZS50cmFjayk7XG4gICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy50cmFja0xheWVyKTtcbiAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgIH0sXG5cbiAgICBfaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucm91dGUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVIaWdobGlnaHRMYXllclxuICAgICAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAgICAgLnNldEdlb0pTT04oZS5yb3V0ZS5nZW9tZXRyeSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMucm91dGVIaWdobGlnaHRMYXllcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMucm91dGVIaWdobGlnaHRMYXllcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hpZ2hsaWdodFN0ZXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuc3RlcCAmJiBlLnN0ZXAubG9jKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBNYXJrZXIuc2V0TGF0TG5nKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLnN0ZXAubG9jKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuc3RlcE1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMuc3RlcE1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JvdXRlUG9seWxpbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZUxheWVyLmdldExheWVycygpWzBdO1xuICAgIH0sXG5cbiAgICBfZmluZFdheXBvaW50SW5kZXg6IGZ1bmN0aW9uKGxhdExuZykge1xuICAgICAgICB2YXIgc2VnbWVudCA9IHRoaXMuX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50KGxhdExuZyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLl9maW5kTmVhcmVzdFJvdXRlU2VnbWVudCh0aGlzLndheXBvaW50TWFya2Vyc1tpXS5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICBpZiAocyA+IHNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7XG4gICAgfSxcblxuICAgIF9maW5kTmVhcmVzdFJvdXRlU2VnbWVudDogZnVuY3Rpb24obGF0TG5nKSB7XG4gICAgICAgIHZhciBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgcCA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQobGF0TG5nKSxcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IHRoaXMuX3JvdXRlUG9seWxpbmUoKS5fb3JpZ2luYWxQb2ludHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBkID0gTC5MaW5lVXRpbC5fc3FDbG9zZXN0UG9pbnRPblNlZ21lbnQocCwgcG9zaXRpb25zW2kgLSAxXSwgcG9zaXRpb25zW2ldLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChkIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgbWluID0gZDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuICAgIF93YXlwb2ludEljb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTC5kaXZJY29uKHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcGJveC1tYXJrZXItZHJhZy1pY29uJyxcbiAgICAgICAgICAgIGljb25TaXplOiBuZXcgTC5Qb2ludCgxMiwgMTIpXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRpcmVjdGlvbnMsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IExheWVyKGRpcmVjdGlvbnMsIG9wdGlvbnMpO1xufTtcbiIsIi8qIEBmbG93ICovXG52YXIgZG9tID0gZG9jdW1lbnQ7IC8vIHRoaXMgdG8gY2xhaW0gdGhhdCB3ZSB1c2UgdGhlIGRvbSBhcGksIG5vdCByZXByZXNlbnRhdGl2ZSBvZiB0aGUgcGFnZSBkb2N1bWVudFxuXG52YXIgUGFnaW5nQ29udHJvbCA9IGZ1bmN0aW9uKFxuICAgIGVsZW1lbnQgLyo6IEVsZW1lbnQgKi8gLFxuICAgIG9wdGlvbnMgLyo6ID9PYmplY3QgKi9cbikge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLmRpc3BsYXllZCA9IG9wdGlvbnMuZGlzcGxheWVkIHx8IDEwO1xuICAgIG9wdGlvbnMudG90YWwgPSBvcHRpb25zLnRvdGFsIHx8IDEwO1xuXG4gICAgdGhpcy51cGRhdGUob3B0aW9ucyk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IDE7XG5cbiAgICAvLyBzZXQgZW1wdHkgZXZlbnQgaGFuZGxlcnNcbiAgICB0aGlzLm9uU2VsZWN0ZWQoZnVuY3Rpb24oKSB7fSk7XG59O1xuXG5QYWdpbmdDb250cm9sLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhW3JlbD1wYWdlXScpLFxuICAgICAgICBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgKTtcbn07XG5cbnZhciBjYWxjUmFuZ2UgPSBmdW5jdGlvbihmb2N1cywgZGlzcGxheWVkLCB0b3RhbCkge1xuICAgIHZhciBoYWxmID0gTWF0aC5mbG9vcihkaXNwbGF5ZWQgLyAyKTtcbiAgICB2YXIgcGFnZU1heCA9IE1hdGgubWluKHRvdGFsLCBkaXNwbGF5ZWQpO1xuICAgIGlmIChmb2N1cyAtIGhhbGYgPCAxKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDogMSxcbiAgICAgICAgICAgIGVuZDogcGFnZU1heFxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoZm9jdXMgKyBoYWxmID4gdG90YWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0OiB0b3RhbCAtIGRpc3BsYXllZCArIDEsXG4gICAgICAgICAgICBlbmQ6IHRvdGFsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBmb2N1cyAtIGhhbGYsXG4gICAgICAgIGVuZDogZm9jdXMgKyBoYWxmXG4gICAgfTtcbn07XG5cblBhZ2luZ0NvbnRyb2wucHJvdG90eXBlLm9uU2VsZWN0ZWQgPSBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXNwbGF5ZWQgPSB0aGlzLm9wdGlvbnMuZGlzcGxheWVkO1xuXG4gICAgdGhpcy5vblNlbGVjdGVkSGFuZGxlciA9IGZ1bmN0aW9uKHBhZ2VObykge1xuICAgICAgICBzZWxmLmNsZWFyKCk7XG4gICAgICAgIHZhciByYW5nZSA9IGNhbGNSYW5nZShwYWdlTm8sIGRpc3BsYXllZCwgc2VsZi5vcHRpb25zLnRvdGFsKTtcbiAgICAgICAgc2VsZi5yZW5kZXJQYWdlcyhyYW5nZS5zdGFydCwgcmFuZ2UuZW5kLCBwYWdlTm8pO1xuICAgICAgICByZXR1cm4gaGFuZGxlcihwYWdlTm8pO1xuICAgIH07XG59O1xuXG5QYWdpbmdDb250cm9sLnByb3RvdHlwZS5yZW5kZXJQYWdlcyA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIHNlbGVjdGVkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBnZW5IYW5kbGVyID0gZnVuY3Rpb24ocGFnZU5vKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYub25TZWxlY3RlZEhhbmRsZXIocGFnZU5vKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgIHZhciBwYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBwYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2VuSGFuZGxlcihpKSk7XG4gICAgICAgIHBhZ2UucmVsID0gJ3BhZ2UnO1xuICAgICAgICBwYWdlLmhyZWYgPSAnIyc7XG4gICAgICAgIHBhZ2UudGV4dENvbnRlbnQgPSBpO1xuICAgICAgICBpZiAoaSA9PT0gc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHBhZ2UuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChwYWdlKTtcbiAgICB9XG59O1xuXG5QYWdpbmdDb250cm9sLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5yZW5kZXJQYWdlcygxLCBNYXRoLm1pbihvcHRpb25zLnRvdGFsLCBvcHRpb25zLmRpc3BsYXllZCksIDEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYWdpbmdDb250cm9sO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXAsIHNlbGVjdGlvbiA9IDA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZXMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgIHZhciByb3V0ZXMgPSBjb250YWluZXIuYXBwZW5kKCd1bCcpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZGF0YShlLnJvdXRlcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlJyk7XG5cbiAgICAgICAgcm91dGVzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWhlYWRpbmcnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiAnUm91dGUgJyArIChlLnJvdXRlcy5pbmRleE9mKHJvdXRlKSArIDEpOyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLXN1bW1hcnknKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZS5zdW1tYXJ5OyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWRldGFpbHMnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdFtkaXJlY3Rpb25zLm9wdGlvbnMudW5pdHNdKHJvdXRlLmRpc3RhbmNlKSArICcsICcgKyBmb3JtYXQuZHVyYXRpb24ocm91dGUuZHVyYXRpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0Um91dGUocm91dGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRSb3V0ZShudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZWxlY3RSb3V0ZShyb3V0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRpcmVjdGlvbnMuc2VsZWN0Um91dGUoZS5yb3V0ZXNbMF0pO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignc2VsZWN0Um91dGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXIuc2VsZWN0QWxsKCcubWFwYm94LWRpcmVjdGlvbnMtcm91dGUnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWFjdGl2ZScsIGZ1bmN0aW9uIChyb3V0ZSkgeyByZXR1cm4gcm91dGUgPT09IGUucm91dGU7IH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiLyogQGZsb3cgKi9cblxudmFyIHJlbmRlclJvdyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgZGF0YSkge1xuICAgIHZhciByb3cgPSBjb250YWluZXIuaW5zZXJ0Um93KCk7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHN0cikge1xuICAgICAgICB2YXIgY2VsbCA9IHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSBzdHI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdztcbn07XG5cbnZhciByZW5kZXJIZWFkZXIgPSBmdW5jdGlvbihjb250YWluZXIsIGRhdGEpIHtcbiAgICB2YXIgcm93ID0gY29udGFpbmVyLmluc2VydFJvdygpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgdmFyIHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgdGguaW5uZXJIVE1MID0gc3RyO1xuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodGgpO1xuICAgIH0pO1xuICAgIHJldHVybiByb3c7XG59O1xuXG52YXIgVGFibGVDb250cm9sID0gZnVuY3Rpb24oXG4gICAgZWxlbWVudCAvKjogT2JqZWN0ICovLCAvKiBUYWJsZUVsZW1lbnQgKi9cbiAgICBoZWFkZXJzIC8qOiBbc3RyaW5nXSAqLyxcbiAgICBtb2RlbCAvKjogP1tbc3RyaW5nXV0gKi9cbikge1xuICAgIHJlbmRlckhlYWRlcihlbGVtZW50LmNyZWF0ZVRIZWFkKCksIGhlYWRlcnMpO1xuICAgIHRoaXMudGJvZHkgPSBlbGVtZW50LmNyZWF0ZVRCb2R5KCk7XG4gICAgdGhpcy5iaW5kKG1vZGVsIHx8IFtdKTtcbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB3aGlsZSAodGhpcy50Ym9keS5oYXNDaGlsZE5vZGVzKCkpIHsgICBcbiAgICAgICAgdGhpcy50Ym9keS5yZW1vdmVDaGlsZCh0aGlzLnRib2R5LmZpcnN0Q2hpbGQpO1xuICAgIH1cbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUub25TZWxlY3RlZCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICB0aGlzLm9uU2VsZWN0ZWRIYW5kbGVyID0gaGFuZGxlcjtcbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIC8vIGRlYWwgd2l0aCBjbG9zdXJlXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB2YXIgcm93ID0gcmVuZGVyUm93KHNlbGYudGJvZHksIGRhdGEpO1xuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9uU2VsZWN0ZWRIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vblNlbGVjdGVkSGFuZGxlcihkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlQ29udHJvbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRhYmxlQ29udHJvbCA9IHJlcXVpcmUoJy4vdGFibGVfY29udHJvbC5qcycpLCBcbiAgICBwYWdpbmdDb250cm9sID0gcmVxdWlyZSgnLi9wYWdpbmdfY29udHJvbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcDtcbiAgICB2YXIgb3JpZ0NoYW5nZSA9IGZhbHNlLCBkZXN0Q2hhbmdlID0gZmFsc2U7XG4gICAgdmFyIFRSQUNLSU5GT19BUElfVVJMID0gXCJodHRwczovL2x1bGl1Lm1lL3RyYWNrcy9hcGkvdjEvdHJhY2tpbmZvXCI7XG4gICAgdmFyIFRSQUNLX0FQSV9VUkwgPSBcImh0dHBzOi8vbHVsaXUubWUvdHJhY2tzL2FwaS92MS90cmFja3NcIjtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbihfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICAvLyBnZXQgcGFnZSAxIG9mIHRyYWNraW5mbyBhcyBpbml0IGRhdGEgZm9yIHRoZSB0YWJsZVxuICAgIC8vIFdlYiBicm93c2VyIGNvbXBhdGliaWxpdHk6XG4gICAgLy8gZm9yIElFNyssIEZpcmVmb3gsIENocm9tZSwgT3BlcmEsIFNhZmFyaVxuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8dGFibGUgaWQ9XCJ0cmFja3MtdGFibGVcIiBjbGFzcz1cInByb3NlIGFpci10cmFja3NcIj48L3RhYmxlPicpO1xuICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICc8ZGl2IGlkPVwicGFnaW5nXCIgZGF0YS1jb250cm9sPVwicGFnaW5nXCI+PC9kaXY+Jyk7XG5cbiAgICB2YXIgdHJhY2tpbmZvS2V5cyA9IFtcbiAgICAgICAgJ0lEJywgJ1NlZ21lbnRzJywgJzJEIGxlbmd0aCcsICczRCBsZW5ndGgnLCAnTW92aW5nIHRpbWUnLCAnU3RvcHBlZCB0aW1lJywgXG4gICAgICAgICdNYXggc3BlZWQnLCAnVXBoaWxsJywgJ0Rvd25oaWxsJywgJ1N0YXJ0ZWQgYXQnLCAnRW5kZWQgYXQnLCAnUG9pbnRzJywgXG4gICAgICAgICdTdGFydCBsb24nLCAnU3RhcnQgbGF0JywgJ0VuZCBsb24nLCAnRW5kIGxhdCdcbiAgICBdLFxuICAgIHZhbHVlcyA9IFtdO1xuICAgIHZhciBwYWdlID0gMSwgdG90YWxQYWdlcyA9IDEsIG51bVJlc3VsdHMgPSAxO1xuICAgIHZhciB0YyA9IG5ldyB0YWJsZUNvbnRyb2woZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYWNrcy10YWJsZScpLCBcbiAgICAgICAgICAgIHRyYWNraW5mb0tleXMsIHZhbHVlcyk7XG4gICAgdmFyIHBnID0gbmV3IHBhZ2luZ0NvbnRyb2woZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2luZycpLCBcbiAgICAgICAgICAgIHtkaXNwbGF5ZWQ6IDAsIHRvdGFsOiAwfSk7XG5cbiAgICB2YXIgdHJhY2tpbmZvWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdHJhY2tpbmZvWGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHJhY2tpbmZvWGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgdHJhY2tpbmZvWGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICB2YXIgdHJhY2tpbmZvRGF0YSA9IEpTT04ucGFyc2UodHJhY2tpbmZvWGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB0b3RhbFBhZ2VzID0gdHJhY2tpbmZvRGF0YS50b3RhbF9wYWdlcztcbiAgICAgICAgICAgIHBhZ2UgPSB0cmFja2luZm9EYXRhLnBhZ2U7XG4gICAgICAgICAgICBudW1SZXN1bHRzID0gdHJhY2tpbmZvRGF0YS5udW1fcmVzdWx0cztcbiAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgdHJhY2tpbmZvRGF0YS5vYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0cmFja2luZm9LZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChyb3cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0Yy5iaW5kKHZhbHVlcyk7XG4gICAgICAgICAgICBwZy51cGRhdGUoeyBkaXNwbGF5ZWQ6IDEwLCB0b3RhbDogdG90YWxQYWdlcyB9KTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgdHJhY2tpbmZvWGhyLm9wZW4oXCJHRVRcIiwgVFJBQ0tJTkZPX0FQSV9VUkwsIHRydWUpO1xuICAgIHRyYWNraW5mb1hoci5zZW5kKCk7XG5cbiAgICB0Yy5vblNlbGVjdGVkKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKFtkYXRhWzEyXSwgZGF0YVsxM11dKTtcbiAgICAgICAgdmFyIGVuZFBvcyA9IEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhbZGF0YVsxNF0sIGRhdGFbMTVdXSk7XG4gICAgICAgIGRpcmVjdGlvbnMuc2V0T3JpZ2luKHN0YXJ0UG9zKTtcbiAgICAgICAgZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihlbmRQb3MpO1xuICAgICAgICB2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcoXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhcnRQb3MubGF0LCBlbmRQb3MubGF0KSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhcnRQb3MubG5nLCBlbmRQb3MubG5nKSksXG4gICAgICAgICAgICBub3J0aEVhc3QgPSBMLmxhdExuZyhcbiAgICAgICAgICAgICAgICBNYXRoLm1heChzdGFydFBvcy5sYXQsIGVuZFBvcy5sYXQpLFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0UG9zLmxuZywgZW5kUG9zLmxuZykpLFxuICAgICAgICAgICAgYm91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XG4gICAgICAgIC8vIFdlYiBicm93c2VyIGNvbXBhdGliaWxpdHk6IFxuICAgICAgICAvLyBJRTcrLCBGaXJlZm94LCBDaHJvbWUsIE9wZXJhLCBTYWZhcmlcbiAgICAgICAgdmFyIHRyYWNrWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRyYWNrWGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRyYWNrWGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgdHJhY2tYaHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJhY2tEYXRhID0gSlNPTi5wYXJzZSh0cmFja1hoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuc2VsZWN0VHJhY2sodHJhY2tEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0cmFja1hoci5vcGVuKFwiR0VUXCIsIFRSQUNLX0FQSV9VUkwgKyBcIi9cIiArIGRhdGFbMF0sIHRydWUpO1xuICAgICAgICB0cmFja1hoci5zZW5kKCk7XG4gICAgfSk7XG5cbiAgICBwZy5vblNlbGVjdGVkKGZ1bmN0aW9uKHBhZ2VObykge1xuICAgICAgICB2YXIgcGFnZWRUcmFja2luZm9YaHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcGFnZWRUcmFja2luZm9YaHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocGFnZWRUcmFja2luZm9YaHIucmVhZHlTdGF0ZSA9PT0gNCAmJiBwYWdlZFRyYWNraW5mb1hoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHZhciB0cmFja2luZm9EYXRhID0gSlNPTi5wYXJzZShwYWdlZFRyYWNraW5mb1hoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgMyB2YXJpYWJsZXMgY2FuIGJlIGFxdWlyZWQgZnJvbSB0aGUgcmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgLy8gYnV0IHVzZWxlc3MgZm9yIHRoZSBtb21lbnRcbiAgICAgICAgICAgICAgICAvL3RvdGFsUGFnZXMgPSB0cmFja2luZm9EYXRhLnRvdGFsX3BhZ2VzO1xuICAgICAgICAgICAgICAgIC8vcGFnZSA9IHRyYWNraW5mb0RhdGEucGFnZTtcbiAgICAgICAgICAgICAgICAvL251bVJlc3VsdHMgPSB0cmFja2luZm9EYXRhLm51bV9yZXN1bHRzO1xuICAgICAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHRyYWNraW5mb0RhdGEub2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRyYWNraW5mb0tleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGMuYmluZCh2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhZ2VkVHJhY2tpbmZvWGhyLm9wZW4oXCJHRVRcIiwgVFJBQ0tJTkZPX0FQSV9VUkwgKyBcIj9wYWdlPVwiICsgcGFnZU5vLCB0cnVlKTtcbiAgICAgICAgcGFnZWRUcmFja2luZm9YaHIuc2VuZCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIl19
;