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

},{"./src/directions":12,"./src/errors_control":13,"./src/format":14,"./src/input_control":15,"./src/instructions_control":16,"./src/layer":17,"./src/routes_control":20,"./src/tracks_control.js":22}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

function min(array, f) {
  var i = -1,
      n = array.length,
      a,
      b;

  if (arguments.length === 1) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = array[i]) != null && a > b) a = b;
  }

  else {
    while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
  }

  return a;
};

function transpose$1(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
};

function length(d) {
  return d.length;
}

function zip() {
  return transpose$1(arguments);
};

function number(x) {
  return x === null ? NaN : +x;
};

function variance(array, f) {
  var n = array.length,
      m = 0,
      a,
      d,
      s = 0,
      i = -1,
      j = 0;

  if (arguments.length === 1) {
    while (++i < n) {
      if (!isNaN(a = number(array[i]))) {
        d = a - m;
        m += d / ++j;
        s += d * (a - m);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(a = number(f.call(array, array[i], i)))) {
        d = a - m;
        m += d / ++j;
        s += d * (a - m);
      }
    }
  }

  if (j > 1) return s / (j - 1);
};

function values$1(map) {
  var values = [];
  for (var key in map) values.push(map[key]);
  return values;
};

function sum(array, f) {
  var s = 0,
      n = array.length,
      a,
      i = -1;

  if (arguments.length === 1) {
    while (++i < n) if (!isNaN(a = +array[i])) s += a; // Note: zero and null are equivalent.
  }

  else {
    while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;
  }

  return s;
};

function shuffle(array, i0, i1) {
  if ((m = arguments.length) < 3) {
    i1 = array.length;
    if (m < 2) i0 = 0;
  }

  var m = i1 - i0,
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
};

var prefix = "$";

function Map() {}

Map.prototype = map.prototype = {
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    return this[prefix + key] = value;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  forEach: function(f) {
    for (var property in this) if (property[0] === prefix) f.call(this, property.slice(1), this[property]);
  }
};

function map(object, f) {
  var map = new Map;

  // Copy constructor.
  if (object instanceof Map) object.forEach(function(key, value) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (arguments.length === 1) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f.call(object, o = object[i], i), o);
  }

  // Convert object to map.
  else for (var key in object) map.set(key, object[key]);

  return map;
}

function Set() {}

var proto = map.prototype;

Set.prototype = set.prototype = {
  has: proto.has,
  add: function(value) {
    value += "";
    this[prefix + value] = true;
    return value;
  },
  remove: proto.remove,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  forEach: function(f) {
    for (var property in this) if (property[0] === prefix) f.call(this, property.slice(1));
  }
};

function set(array) {
  var set = new Set;
  if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
  return set;
}

function range$1(start, stop, step) {
  if ((n = arguments.length) < 3) {
    step = 1;
    if (n < 2) {
      stop = start;
      start = 0;
    }
  }

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

// R-7 per <http://en.wikipedia.org/wiki/Quantile>
function quantile(values, p) {
  var H = (values.length - 1) * p + 1,
      h = Math.floor(H),
      v = +values[h - 1],
      e = H - h;
  return e ? v + e * (values[h] - v) : v;
};

function permute(array, indexes) {
  var i = indexes.length, permutes = new Array(i);
  while (i--) permutes[i] = array[indexes[i]];
  return permutes;
};

function pairs$1(array) {
  var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
  while (i < n) pairs[i] = [p0 = p1, p1 = array[++i]];
  return pairs;
};

function nest$1() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) return rollup
        ? rollup.call(nest, array) : (sortValues
        ? array.sort(sortValues)
        : array);

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = map(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.forEach(function(key, values) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map, depth) {
    if (depth >= keys.length) return map;

    var array = [],
        sortKey = sortKeys[depth++];

    map.forEach(function(key, value) {
      array.push({key: key, values: entries(value, depth)});
    });

    return sortKey
        ? array.sort(function(a, b) { return sortKey(a.key, b.key); })
        : array;
  }

  return nest = {
    object: function(array) { return apply(array, 0, createObject, setObject); },
    map: function(array) { return apply(array, 0, createMap, setMap); },
    entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
    key: function(d) { keys.push(d); return nest; },
    sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
    sortValues: function(order) { sortValues = order; return nest; },
    rollup: function(f) { rollup = f; return nest; }
  };
};

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map();
}

function setMap(map, key, value) {
  map.set(key, value);
}

function merge(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;
  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
};

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

function median(array, f) {
  var numbers = [],
      n = array.length,
      a,
      i = -1;

  if (arguments.length === 1) {
    while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
  }

  else {
    while (++i < n) if (!isNaN(a = number(f.call(array, array[i], i)))) numbers.push(a);
  }

  if (numbers.length) return quantile(numbers.sort(ascending), .5);
};

function mean(array, f) {
  var s = 0,
      n = array.length,
      a,
      i = -1,
      j = n;

  if (arguments.length === 1) {
    while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
  }

  else {
    while (++i < n) if (!isNaN(a = number(f.call(array, array[i], i)))) s += a; else --j;
  }

  if (j) return s / j;
};

function max(array, f) {
  var i = -1,
      n = array.length,
      a,
      b;

  if (arguments.length === 1) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = array[i]) != null && b > a) a = b;
  }

  else {
    while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
  }

  return a;
};

function keys(map) {
  var keys = [];
  for (var key in map) keys.push(key);
  return keys;
};

function extent(array, f) {
  var i = -1,
      n = array.length,
      a,
      b,
      c;

  if (arguments.length === 1) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
    while (++i < n) if ((b = array[i]) != null) {
      if (a > b) a = b;
      if (c < b) c = b;
    }
  }

  else {
    while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = c = b; break; }
    while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
      if (a > b) a = b;
      if (c < b) c = b;
    }
  }

  return [a, c];
};

function entries(map) {
  var entries = [];
  for (var key in map) entries.push({key: key, value: map[key]});
  return entries;
};

function deviation() {
  var v = variance.apply(this, arguments);
  return v ? Math.sqrt(v) : v;
};

function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
};

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
};

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;

exports.ascending = ascending;
exports.bisect = bisectRight;
exports.bisectLeft = bisectLeft;
exports.bisectRight = bisectRight;
exports.bisector = bisector;
exports.descending = descending;
exports.deviation = deviation;
exports.entries = entries;
exports.extent = extent;
exports.keys = keys;
exports.map = map;
exports.max = max;
exports.mean = mean;
exports.median = median;
exports.merge = merge;
exports.min = min;
exports.nest = nest$1;
exports.pairs = pairs$1;
exports.permute = permute;
exports.quantile = quantile;
exports.range = range$1;
exports.set = set;
exports.shuffle = shuffle;
exports.sum = sum;
exports.transpose = transpose$1;
exports.values = values$1;
exports.variance = variance;
exports.zip = zip;
},{}],5:[function(require,module,exports){
'use strict';

var d3Arrays = require('d3-arrays');
var d3Dispatch = require('d3-dispatch');
var d3Dsv = require('d3-dsv');

function xhr(url, callback) {
  var xhr,
      event = d3Dispatch.dispatch("beforesend", "progress", "load", "error"),
      mimeType,
      headers = d3Arrays.map(),
      request = new XMLHttpRequest,
      response,
      responseType;

  // If IE does not support CORS, use XDomainRequest.
  if (typeof XDomainRequest !== "undefined"
      && !("withCredentials" in request)
      && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest;

  "onload" in request
      ? request.onload = request.onerror = respond
      : request.onreadystatechange = function() { request.readyState > 3 && respond(); };

  function respond() {
    var status = request.status, result;
    if (!status && hasResponse(request)
        || status >= 200 && status < 300
        || status === 304) {
      if (response) {
        try {
          result = response.call(xhr, request);
        } catch (e) {
          event.error.call(xhr, e);
          return;
        }
      } else {
        result = request;
      }
      event.load.call(xhr, result);
    } else {
      event.error.call(xhr, request);
    }
  }

  request.onprogress = function(e) {
    event.progress.call(xhr, e);
  };

  xhr = {
    header: function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers.get(name);
      if (value == null) headers.remove(name);
      else headers.set(name, value + "");
      return xhr;
    },

    // If mimeType is non-null and no Accept header is set, a default is used.
    mimeType: function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return xhr;
    },

    // Specifies what type the response value should take;
    // for instance, arraybuffer, blob, document, or text.
    responseType: function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return xhr;
    },

    // Specify how to convert the response content to a specific type;
    // changes the callback value on "load" events.
    response: function(value) {
      response = value;
      return xhr;
    },

    // Alias for send("GET", …).
    get: function(data, callback) {
      return xhr.send("GET", data, callback);
    },

    // Alias for send("POST", …).
    post: function(data, callback) {
      return xhr.send("POST", data, callback);
    },

    // If callback is non-null, it will be used for error and load events.
    send: function(method, data, callback) {
      if (!callback && typeof data === "function") callback = data, data = null;
      if (callback && callback.length === 1) callback = fixCallback(callback);
      request.open(method, url, true);
      if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
      if (request.setRequestHeader) headers.forEach(function(name, value) { request.setRequestHeader(name, value); });
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
      if (responseType != null) request.responseType = responseType;
      if (callback) xhr.on("error", callback).on("load", function(request) { callback(null, request); });
      event.beforesend.call(xhr, request);
      request.send(data == null ? null : data);
      return xhr;
    },

    abort: function() {
      request.abort();
      return xhr;
    },

    on: function() {
      var value = event.on.apply(event, arguments);
      return value === event ? xhr : value;
    }
  };

  return callback
      ? xhr.get(callback)
      : xhr;
};

function fixCallback(callback) {
  return function(error, request) {
    callback(error == null ? request : null);
  };
}

function hasResponse(request) {
  var type = request.responseType;
  return type && type !== "text"
      ? request.response // null on error
      : request.responseText; // "" on error
}

function xhrDsv(defaultMimeType, dsv) {
  return function(url, row, callback) {
    if (arguments.length < 3) callback = row, row = null;
    var r = xhr(url).mimeType(defaultMimeType);
    r.row = function(_) { return arguments.length ? r.response(responseOf(dsv, row = _)) : row; };
    r.row(row);
    return callback ? r.get(callback) : r;
  };
};

function responseOf(dsv, row) {
  return function(request) {
    return dsv.parse(request.responseText, row);
  };
}

var tsv = xhrDsv("text/tab-separated-values", d3Dsv.tsv);

var csv = xhrDsv("text/csv", d3Dsv.csv);

function xhrType(defaultMimeType, response) {
  return function(url, callback) {
    var r = xhr(url).mimeType(defaultMimeType).response(response);
    return callback ? r.get(callback) : r;
  };
};

var xml = xhrType("application/xml", function(request) {
  return request.responseXML;
});

var text = xhrType("text/plain", function(request) {
  return request.responseText;
});

var json = xhrType("application/json", function(request) {
  return JSON.parse(request.responseText);
});

var html = xhrType("text/html", function(request) {
  return document.createRange().createContextualFragment(request.responseText);
});

exports.xhr = xhr;
exports.html = html;
exports.json = json;
exports.text = text;
exports.xml = xml;
exports.csv = csv;
exports.tsv = tsv;

},{"d3-arrays":4,"d3-dispatch":6,"d3-dsv":7}],6:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3_dispatch = {})));
}(this, function (exports) { 'use strict';

  function dispatch() {
    return new Dispatch(arguments);
  }

  function Dispatch(types) {
    var i = -1,
        n = types.length,
        callbacksByType = {},
        callbackByName = {},
        type,
        that = this;

    that.on = function(type, callback) {
      type = parseType(type);

      // Return the current callback, if any.
      if (arguments.length < 2) {
        return (callback = callbackByName[type.name]) && callback.value;
      }

      // If a type was specified…
      if (type.type) {
        var callbacks = callbacksByType[type.type],
            callback0 = callbackByName[type.name],
            i;

        // Remove the current callback, if any, using copy-on-remove.
        if (callback0) {
          callback0.value = null;
          i = callbacks.indexOf(callback0);
          callbacksByType[type.type] = callbacks = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
          delete callbackByName[type.name];
        }

        // Add the new callback, if any.
        if (callback) {
          callback = {value: callback};
          callbackByName[type.name] = callback;
          callbacks.push(callback);
        }
      }

      // Otherwise, if a null callback was specified, remove all callbacks with the given name.
      else if (callback == null) {
        for (var otherType in callbacksByType) {
          if (callback = callbackByName[otherType + type.name]) {
            callback.value = null;
            callbacks = callbacksByType[otherType];
            i = callbacks.indexOf(callback);
            callbacksByType[otherType] = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
            delete callbackByName[callback.name];
          }
        }
      }

      return that;
    };

    while (++i < n) {
      type = types[i] + "";
      if (!type || (type in that)) throw new Error("illegal or duplicate type: " + type);
      callbacksByType[type] = [];
      that[type] = applier(type);
    }

    function parseType(type) {
      var i = (type += "").indexOf("."), name = type;
      if (i >= 0) type = type.slice(0, i); else name += ".";
      if (type && !callbacksByType.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      return {type: type, name: name};
    }

    function applier(type) {
      return function() {
        var callbacks = callbacksByType[type], // Defensive reference; copy-on-remove.
            callbackValue,
            i = -1,
            n = callbacks.length;

        while (++i < n) {
          if (callbackValue = callbacks[i].value) {
            callbackValue.apply(this, arguments);
          }
        }

        return that;
      };
    }
  }

  dispatch.prototype = Dispatch.prototype;

  var version = "0.2.6";

  exports.version = version;
  exports.dispatch = dispatch;

}));
},{}],7:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.dsv = {}));
}(this, function (exports) { 'use strict';

  var dsv = function(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
        delimiterCode = delimiter.charCodeAt(0);

    function parse(text, f) {
      var o;
      return parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) { return f(a(row), i); } : a;
      });
    }

    function parseRows(text, f) {
      var EOL = {}, // sentinel value for end-of-line
          EOF = {}, // sentinel value for end-of-file
          rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // the current line number
          t, // the current token
          eol; // is the current token followed by EOL?

      function token() {
        if (I >= N) return EOF; // special case: end of file
        if (eol) return eol = false, EOL; // special case: end of line

        // special case: quotes
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, "\"");
        }

        // common case: find next delimiter or newline
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; // \n
          else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
          else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }

        // special case: last token before EOF
        return text.slice(j);
      }

      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }

      return rows;
    }

    function format(rows) {
      if (Array.isArray(rows[0])) return formatRows(rows); // deprecated; use formatRows
      var fieldSet = Object.create(null), fields = [];

      // Compute unique fields in order of discovery.
      rows.forEach(function(row) {
        for (var field in row) {
          if (!((field += "") in fieldSet)) {
            fields.push(fieldSet[field] = field);
          }
        }
      });

      return [fields.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
      return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatRows: formatRows
    };
  }

  exports.csv = dsv(",");
  exports.tsv = dsv("\t");

  exports.dsv = dsv;

}));
},{}],8:[function(require,module,exports){
/**
 * Debounces a function by the given threshold.
 *
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, threshold, execAsap){
  var timeout;

  return function debounced(){
    var obj = this, args = arguments;

    function delayed () {
      if (!execAsap) {
        func.apply(obj, args);
      }
      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = setTimeout(delayed, threshold || 100);
  };
};

},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 * http://spin.js.org/
 *
 * Example:
    var opts = {
      lines: 12             // The number of lines to draw
    , length: 7             // The length of each line
    , width: 5              // The line thickness
    , radius: 10            // The radius of the inner circle
    , scale: 1.0            // Scales overall size of the spinner
    , corners: 1            // Roundness (0..1)
    , color: '#000'         // #rgb or #rrggbb
    , opacity: 1/4          // Opacity of the lines
    , rotate: 0             // Rotation offset
    , direction: 1          // 1: clockwise, -1: counterclockwise
    , speed: 1              // Rounds per second
    , trail: 100            // Afterglow percentage
    , fps: 20               // Frames per second when using setTimeout()
    , zIndex: 2e9           // Use a high z-index by default
    , className: 'spinner'  // CSS class to assign to the element
    , top: '50%'            // center vertically
    , left: '50%'           // center horizontally
    , shadow: false         // Whether to render a shadow
    , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
    , position: 'absolute'  // Element positioning
    }
    var target = document.getElementById('foo')
    var spinner = new Spinner(opts).spin(target)
 */
;(function (root, factory) {

  /* CommonJS */
  if (typeof exports == 'object') module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}(this, function () {
  "use strict"

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */
    , sheet /* A stylesheet to hold the @keyframe or VML rules. */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl (tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for (n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins (parent /* child1, child2, ...*/) {
    for (var i = 1, n = arguments.length; i < n; i++) {
      parent.appendChild(arguments[i])
    }

    return parent
  }

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation (alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor (el, prop) {
    var s = el.style
      , pp
      , i

    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    if (s[prop] !== undefined) return prop
    for (i = 0; i < prefixes.length; i++) {
      pp = prefixes[i]+prop
      if (s[pp] !== undefined) return pp
    }
  }

  /**
   * Sets multiple style properties at once.
   */
  function css (el, prop) {
    for (var n in prop) {
      el.style[vendor(el, n) || n] = prop[n]
    }

    return el
  }

  /**
   * Fills in default values.
   */
  function merge (obj) {
    for (var i = 1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def) {
        if (obj[n] === undefined) obj[n] = def[n]
      }
    }
    return obj
  }

  /**
   * Returns the line color from the given string or array.
   */
  function getColor (color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length]
  }

  // Built-in defaults

  var defaults = {
    lines: 12             // The number of lines to draw
  , length: 7             // The length of each line
  , width: 5              // The line thickness
  , radius: 10            // The radius of the inner circle
  , scale: 1.0            // Scales overall size of the spinner
  , corners: 1            // Roundness (0..1)
  , color: '#000'         // #rgb or #rrggbb
  , opacity: 1/4          // Opacity of the lines
  , rotate: 0             // Rotation offset
  , direction: 1          // 1: clockwise, -1: counterclockwise
  , speed: 1              // Rounds per second
  , trail: 100            // Afterglow percentage
  , fps: 20               // Frames per second when using setTimeout()
  , zIndex: 2e9           // Use a high z-index by default
  , className: 'spinner'  // CSS class to assign to the element
  , top: '50%'            // center vertically
  , left: '50%'           // center horizontally
  , shadow: false         // Whether to render a shadow
  , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
  , position: 'absolute'  // Element positioning
  }

  /** The constructor */
  function Spinner (o) {
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function (target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = createEl(null, {className: o.className})

      css(el, {
        position: o.position
      , width: 0
      , zIndex: o.zIndex
      , left: o.left
      , top: o.top
      })

      if (target) {
        target.insertBefore(el, target.firstChild || null)
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps / o.speed
          , ostep = (1 - o.opacity) / (f * o.trail / 100)
          , astep = f / o.lines

        ;(function anim () {
          i++
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
        })()
      }
      return self
    }

    /**
     * Stops and removes the Spinner.
     */
  , stop: function () {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    }

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
  , lines: function (el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill (color, shadow) {
        return css(createEl(), {
          position: 'absolute'
        , width: o.scale * (o.length + o.width) + 'px'
        , height: o.scale * o.width + 'px'
        , background: color
        , boxShadow: shadow
        , transformOrigin: 'left'
        , transform: 'rotate(' + ~~(360/o.lines*i + o.rotate) + 'deg) translate(' + o.scale*o.radius + 'px' + ',0)'
        , borderRadius: (o.corners * o.scale * o.width >> 1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute'
        , top: 1 + ~(o.scale * o.width / 2) + 'px'
        , transform: o.hwaccel ? 'translate3d(0,0,0)' : ''
        , opacity: o.opacity
        , animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px #000'), {top: '2px'}))
        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    }

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
  , opacity: function (el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML () {

    /* Utility function to create a VML tag */
    function vml (tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function (el, o) {
      var r = o.scale * (o.length + o.width)
        , s = o.scale * 2 * r

      function grp () {
        return css(
          vml('group', {
            coordsize: s + ' ' + s
          , coordorigin: -r + ' ' + -r
          })
        , { width: s, height: s }
        )
      }

      var margin = -(o.width + o.length) * o.scale * 2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg (i, dx, filter) {
        ins(
          g
        , ins(
            css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx})
          , ins(
              css(
                vml('roundrect', {arcsize: o.corners})
              , { width: r
                , height: o.scale * o.width
                , left: o.scale * o.radius
                , top: -o.scale * o.width >> 1
                , filter: filter
                }
              )
            , vml('fill', {color: getColor(o.color, i), opacity: o.opacity})
            , vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++) {
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')
        }

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function (el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i + o < c.childNodes.length) {
        c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  if (typeof document !== 'undefined') {
    sheet = (function () {
      var el = createEl('style', {type : 'text/css'})
      ins(document.getElementsByTagName('head')[0], el)
      return el.sheet || el.styleSheet
    }())

    var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

    if (!vendor(probe, 'transform') && probe.adj) initVML()
    else useCssAnimations = vendor(probe, 'animation')
  }

  return Spinner

}));

},{}],11:[function(require,module,exports){
'use strict';

var d3xhr = require('d3-xhr'),
    Spinner = require('spin.js');


function d3post(url, reqData, callback, cors) {
    var sent = false;

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.hostname +
                (location.port ? ':' + location.port : ''));
    }

    var respData;
    var findPathButton = document.getElementById('find-mmpaths');
    //var spinner = new Spinner({color:'#fff', lines: 12});

    d3xhr.xhr(url)
        .header("Content-Type", "application/json")
        .on("beforesend", function(request) { 
            findPathButton.value = "Searching paths...";
            findPathButton.disabled = true;
            //findPathButton.appendChild(spinner.spin().el);
            //spinner.spin(findPathButton);
        })
        .post(
                JSON.stringify(reqData),
                function(err, rawData){
                    findPathButton.value = "Find multimodal paths";
                    findPathButton.disabled = false;
                    //spinner.stop();
                    respData = rawData;
                    callback.call(err, respData, null);
                }
             );

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    return respData;
}

if (typeof module !== 'undefined') module.exports = d3post;

},{"d3-xhr":5,"spin.js":10}],12:[function(require,module,exports){
'use strict';

var request = require('./request'),
    polyline = require('@mapbox/polyline'),
    d3 = require('../lib/d3'),
    queue = require('queue-async');

var Directions = L.Class.extend({
    includes: [L.Mixin.Events],

    options: {
        units: 'metric',
        mapbox_token: 'pk.eyJ1IjoibGxpdSIsImEiOiI4dW5uVkVJIn0.jhfpLn2Esk_6ZSG62yXYOg',
        ors_api_key: '58d904a497c67e00015b45fccf79677fabb0435874e4d8f94dc34eaa',
        google_api_key: 'AIzaSyDc2gadWI4nunYb0i5Mx_P3AH_yDTiMzAY'
    },

    statics: {
        MAPBOX_API_TEMPLATE: 'https://api.mapbox.com/directions/v5/mapbox/cycling/{waypoints}?access_token={token}',
        ORS_API_TEMPLATE: 'https://api.openrouteservice.org/directions?&coordinates={coordinates}&geometry_format=geojson&instructions=false&preference={preference}&profile={profile}&api_key={token}',
        GOOGLE_API_TEMPLATE: 'https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&avoid={avoid}&mode=bicycling&key={token}',
        GEOCODER_TEMPLATE: 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/{query}.json?proximity={proximity}&access_token={token}'
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._waypoints = [];
        this.profile = {
            "available_public_modes": ['underground'],
            "can_use_taxi": false,
            "has_bicycle": false,
            "has_motorcycle": false,
            "has_private_car": true,
            "need_parking": true,
            "objective": "fastest",
            "driving_distance_limit": 500,
            "source": {
                "type": "coordinate",
                "value": {
                    "x": 0.0,
                    "y": 0.0,
                    "srid": 4326
                }
            },
            "target": {
                "type": "coordinate",
                "value": {
                    "x": 0.0,
                    "y": 0.0,
                    "srid": 4326
                }
            }
        };
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
        this.fire('origin', {
            origin: origin
        });

        if (!origin) {
            this._unload();
        }

        if (origin) {
            this.profile.source.value.x = this.origin.geometry.coordinates[
                0];
            this.profile.source.value.y = this.origin.geometry.coordinates[
                1];
        }

        return this;
    },

    setDestination: function(destination) {
        destination = this._normalizeWaypoint(destination);

        this.destination = destination;
        this.fire('destination', {
            destination: destination
        });

        if (!destination) {
            this._unload();
        }

        if (destination) {
            this.profile.target.value.x = this.destination.geometry
                .coordinates[0];
            this.profile.target.value.y = this.destination.geometry
                .coordinates[1];
        }

        return this;
    },

    getProfile: function() {
        //return this.profile || this.options.profile || 'mapbox.driving';
        return this.profile;
    },

    setProfile: function(key, value) {
        this.profile[key] = value;
        //this.fire('profile', {profile: profile});
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
        this._waypoints.splice(index, 0, this._normalizeWaypoint(
            waypoint));
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

        this.fire('origin', {
                origin: this.origin
            })
            .fire('destination', {
                destination: this.destination
            });

        return this;
    },

    selectRoute: function(route) {
        this.fire('selectRoute', {
            route: route
        });
    },

    selectTrack: function(track) {
        this.fire('selectTrack', {
            track: track.GeoJSON
        });
    },

    highlightRoute: function(route) {
        this.fire('highlightRoute', {
            route: route
        });
    },

    highlightStep: function(step) {
        this.fire('highlightStep', {
            step: step
        });
    },

    queryURL: function(opts) {
        if (opts.provider.toLowerCase() === 'mapbox')
            return this._queryMapboxURL(opts);
        if (opts.provider.toLowerCase() === 'openrouteservice')
            return this._queryOpenRouteServiceURL(opts);
        if (opts.provider.toLowerCase() === 'google')
            return this._queryGoogleURL(opts);

        return null;
    },

    _queryMapboxURL: function(opts) {
        var template = Directions.MAPBOX_API_TEMPLATE,
            points = [this.origin].concat([this.destination])
                .map(function(point) {
                    return point.geometry.coordinates;
                }).join(';');
        return L.Util.template(template, {
            token: this.options.mapbox_token,
            waypoints: points
        });
    },

    _queryOpenRouteServiceURL: function(opts) {
        var template = Directions.ORS_API_TEMPLATE,
            points = [this.origin].concat([this.destination])
                .map(function(point) {
                    return point.geometry.coordinates;
                }).join('|');
        return L.Util.template(template, {
            token: this.options.ors_api_key,
            coordinates: points,
            preference: opts.preference,
            profile: opts.profile
        });
    },

    _queryGoogleURL: function(opts) {
        var template = Directions.GOOGLE_API_TEMPLATE;
        return L.Util.template(template, {
            token: this.options.google_api_key,
            origin: this.origin.geometry.coordinates,
            destination: this.origin.geometry.coordinates,
            avoid: opts.avoid
        });
    },

    queryable: function() {
        return this.getOrigin() && this.getDestination();
    },

    query: function(opts) {
        if (!opts) opts = {};
        if (!this.queryable()) return this;

        if (this._query) {
            this._query.abort();
        }

        if (this._requests && this._requests.length) this._requests
            .forEach(function(request) {
                request.abort();
            });
        this._requests = [];

        var q = queue();

        var pts = [this.origin, this.destination].concat(this._waypoints);
        for (var i in pts) {
            if (!pts[i].geometry.coordinates) {
                q.defer(L.bind(this._geocode, this), pts[i], opts.proximity);
            }
        }

        q.await(L.bind(function(err) {
            if (err) {
                return this.fire('error', {
                    error: err.message
                });
            }

            var reqData = {
                "id": 1,
                "jsonrpc": "2.0",
                "method": "air.getPaths"
            };
            reqData.params = [this.profile];

            this._query = request(this.queryURL(opts),
                reqData, L.bind(function(err, resp) {
                    this._query = null;

                    if (err) {
                        return this.fire(
                            'error', {
                                error: err
                                    .message
                            });
                    }

                    this.directions = resp;
                    this.directions.waypoints = [];
                    this.directions.origin =
                        resp.source;
                    this.directions.destination =
                        resp.target;
                    this.directions.routes.forEach(
                        function(route) {
                            route.geometry =
                                route.geojson;
                            route.duration =
                                route.duration *
                                60;
                            route.steps = [];
                            var i = 0;
                            for (i = 0; i <
                                route.geojson
                                .features.length; i++
                            ) {
                                var
                                    stepInfo =
                                    route.geojson
                                    .features[
                                        i];
                                if (
                                    stepInfo
                                    .properties
                                    .type ===
                                    'path'
                                ) {
                                    route.steps
                                        .push({
                                            properties: route
                                                .geojson
                                                .features[
                                                    i
                                                ]
                                                .properties,
                                            loc: route
                                                .geojson
                                                .features[
                                                    i
                                                ]
                                                .geometry
                                                .coordinates[
                                                    0
                                                ]
                                        });
                                } else if (
                                    stepInfo
                                    .properties
                                    .type ===
                                    'switch_point'
                                ) {
                                    route.steps
                                        .push({
                                            properties: route
                                                .geojson
                                                .features[
                                                    i
                                                ]
                                                .properties,
                                            loc: route
                                                .geojson
                                                .features[
                                                    i
                                                ]
                                                .geometry
                                                .coordinates
                                        });
                                }
                            }
                        });

                    if (!this.origin.properties
                        .name) {
                        this.origin = this.directions
                            .origin;
                    } else {
                        this.directions.origin =
                            this.origin;
                    }

                    if (!this.destination.properties
                        .name) {
                        this.destination =
                            this.directions.destination;
                    } else {
                        this.directions.destination =
                            this.destination;
                    }

                    this.fire('load', this.directions);
                }, this), this);
        }, this));

        return this;
    },

    _geocode: function(waypoint, proximity, cb) {
        if (!this._requests) this._requests = [];
        this._requests.push(request(L.Util.template(Directions.GEOCODER_TEMPLATE, {
            query: waypoint.properties.query,
            token: this.options.accessToken || L.mapbox
                .accessToken,
            proximity: proximity ? [proximity.lng,
                proximity.lat
            ].join(',') : ''
        }), L.bind(function(err, resp) {
            if (err) {
                return cb(err);
            }

            if (!resp.features || !resp.features.length) {
                return cb(new Error(
                    "No results found for query " +
                    waypoint.properties.query
                ));
            }

            waypoint.geometry.coordinates = resp.features[
                0].center;
            waypoint.properties.name = resp.features[
                0].place_name;

            return cb();
        }, this)));
    },

    _unload: function() {
        this._waypoints = [];
        delete this.directions;
        this.fire('unload');
    },

    _normalizeWaypoint: function(waypoint) {
        if (!waypoint || waypoint.type === 'Feature') {
            return waypoint;
        }

        var coordinates,
            properties = {};

        if (waypoint instanceof L.LatLng) {
            waypoint = waypoint.wrap();
            coordinates = properties.query = [waypoint.lng,
                waypoint.lat
            ];
        } else if (typeof waypoint === 'string') {
            properties.query = waypoint;
        }

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates
            },
            properties: properties
        };
    }
});

module.exports = function(options) {
    return new Directions(options);
};

},{"../lib/d3":2,"./request":19,"@mapbox/polyline":3,"queue-async":9}],13:[function(require,module,exports){
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

},{"../lib/d3":2,"./format":14}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3');

module.exports = function(container, directions) {
    var control = {},
        map;
    var origChange = false,
        destChange = false;

    control.addTo = function(_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-inputs', true);

    var form = container.append('form')
        .on('keypress', function() {
            if (d3.event.keyCode === 13) {
                d3.event.preventDefault();

                if (origChange)
                    directions.setOrigin(originInput.property('value'));
                if (destChange)
                    directions.setDestination(destinationInput.property('value'));

                if (directions.queryable())
                    directions.query({
                        proximity: map.getCenter()
                    });

                origChange = false;
                destChange = false;
            }
        });

    var origin = form.append('div')
        .attr('class', 'mapbox-directions-origin');

    origin.append('label')
        .attr('class', 'mapbox-form-label')
        .on('click', function() {
            if (directions.getOrigin() instanceof L.LatLng) {
                map.panTo(directions.getOrigin());
            }
        })
        .append('span')
        .attr('class', 'mapbox-directions-icon mapbox-depart-icon');

    var originInput = origin.append('input')
        .attr('type', 'text')
        .attr('required', 'required')
        .attr('id', 'air-origin-input')
        .attr('placeholder', 'Start')
        .on('input', function() {
            if (!origChange) origChange = true;
        });

    origin.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function() {
            directions.setOrigin(undefined);
        });

    form.append('span')
        .attr('class', 'mapbox-directions-icon mapbox-reverse-icon mapbox-directions-reverse-input')
        .attr('title', 'Reverse origin & destination')
        .on('click', function() {
            directions.reverse().query();
        });

    var destination = form.append('div')
        .attr('class', 'mapbox-directions-destination');

    destination.append('label')
        .attr('class', 'mapbox-form-label')
        .on('click', function() {
            if (directions.getDestination() instanceof L.LatLng) {
                map.panTo(directions.getDestination());
            }
        })
        .append('span')
        .attr('class', 'mapbox-directions-icon mapbox-arrive-icon');

    var destinationInput = destination.append('input')
        .attr('type', 'text')
        .attr('required', 'required')
        .attr('id', 'air-destination-input')
        .attr('placeholder', 'End')
        .on('input', function() {
            if (!destChange) destChange = true;
        });

    destination.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function() {
            directions.setDestination(undefined);
        });

    var mapboxDirections = form.append('div')
        .attr('id', 'mapbox-directions')
        .attr('class', 'mapbox-directions-profile');

    mapboxDirections.append('h3')
        .attr('value', 'MAPBOX')
        .attr('style', 'margin: 5px 0px 0px 5px')
        .text('MAPBOX DIRECTIONS');

    mapboxDirections.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'enabled')
        .attr('id', 'show-mapbox-cycling')
        .property('checked', false)
        .on('change', function(d) {
           if (this.checked) {
               directions.query({provider: 'mapbox'});
           }
        });

    mapboxDirections.append('label')
        .attr('for', 'show-mapbox-cycling')
        .text('Show cycling path');

    var car_profile = form.append('div')
        .attr('id', 'air-car-profiles')
        .attr('class', 'mapbox-directions-profile');

    car_profile.append('h3')
        .attr('value', 'DRIVING')
        .attr('style', 'margin: 5px 0px 0px 5px')
        .text('DRIVING OPTIONS');

    car_profile.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'profile')
        .attr('id', 'air-profile-cycling')
        .property('checked', true)
        .on('change', function(d) {
            if (this.checked) {
                carParking.property('disabled', false);
                carParking.property('checked', true);
                isDrivingDistLimited.property('disabled', false);
                isDrivingDistLimited.property('checked', true);
                distanceLimit.property('disabled', false);
            } else {
                carParking.property('disabled', true);
                carParking.property('checked', false);
                isDrivingDistLimited.property('disabled', true);
                isDrivingDistLimited.property('checked', false);
                distanceLimit.property('disabled', true);
            }
            directions.setProfile('has_private_car', this.checked);
        });

    car_profile.append('label')
        .attr('for', 'air-profile-private-car')
        .text('Private car available on departure');

    var carParking = car_profile.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'profile')
        .attr('id', 'air-profile-car-parking')
        .property('checked', true)
        .property('disabled', false)
        .on('change', function(d) {
            directions.setProfile('need_parking', this.checked);
        });

    car_profile.append('label')
        .attr('for', 'air-profile-car-parking')
        .text('Need parking for the car');

    var isDrivingDistLimited = car_profile.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'driving-profile')
        .attr('id', 'driving-distance-limit')
        .property('checked', true)
        .on('change', function(d) {
            if (this.checked) {
                distanceLimit.property('disabled', false);
            } else
                distanceLimit.property('disabled', true);
        });

    car_profile.append('label')
        .attr('for', 'driving-distance-limit')
        .attr('style', 'width: 150px')
        .text('Distance limit (km): ');

    var distanceLimit = car_profile.append('input')
        .attr('type', 'number')
        .attr('min', '10')
        .attr('max', '2617')
        .property('value', '500')
        .attr('id', 'air-driving-distance-limit')
        .attr('style', 'width: 80px;padding-left: 10px;padding-top: 2px;padding-bottom: 2px;background-color: white;border: 1px solid rgba(0,0,0,0.1);height: 30px;vertical-align: middle;');

    var public_profile = form.append('div')
        .attr('id', 'air-public-profiles')
        .attr('class', 'mapbox-directions-profile');

    public_profile.append('h3')
        .attr('value', 'PUBLIC TRANSIT')
        .attr('style', 'margin: 5px 0px 0px 5px')
        .text('PUBLIC TRANSIT PREFERENCES');

    var public_profiles = public_profile.selectAll('span')
        .data([
            ['air.suburban', 'suburban', 'Suburban'],
            ['air.underground', 'underground', 'Underground'],
            ['air.tram', 'tram', 'Tram']
        ])
        .enter()
        .append('span');

    public_profiles.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'profile')
        .attr('id', function(d) {
            return 'air-profile-' + d[1];
        })
        .property('checked', function(d, i) {
            return i === 1;
        })
        .on('change', function(d) {
            if (this.checked) {
                publicTransitSelection.push(d[1]);
            } else {
                var index = publicTransitSelection.indexOf(d[1]);
                if (index > -1) {
                    publicTransitSelection.splice(index, 1);
                }
            }
        });

    public_profiles.append('label')
        .attr('for', function(d) {
            return 'air-profile-' + d[1];
        })
        .text(function(d) {
            return d[2];
        });

    public_profile.append('input')
        .attr('type', 'button')
        .attr('value', 'Find multimodal paths')
        .attr('name', 'find paths')
        .attr('id', 'find-mmpaths')
        .attr('class', 'button')
        .on('click', function(d) {
            if (isDrivingDistLimited.property('checked') === true) {
                directions.setProfile('driving_distance_limit', distanceLimit.property('value'));
            }
            directions.setProfile('available_public_modes', publicTransitSelection);
            directions.query();
        });

    function format(waypoint) {
        if (!waypoint) {
            return '';
        } else if (waypoint.properties.name) {
            return waypoint.properties.name;
        } else if (waypoint.geometry.coordinates) {
            var precision = Math.max(0, Math.ceil(Math.log(map.getZoom()) / Math.LN2));
            return waypoint.geometry.coordinates[0].toFixed(precision) + ', ' +
                waypoint.geometry.coordinates[1].toFixed(precision);
        } else {
            return waypoint.properties.query || '';
        }
    }

    directions
        .on('origin', function(e) {
            originInput.property('value', format(e.origin));
        })
        .on('destination', function(e) {
            destinationInput.property('value', format(e.destination));
        })
        .on('profile', function(e) {
            profiles.selectAll('input')
                .property('checked', function(d) {
                    return d[0] === e.profile;
                });
        })
        .on('load', function(e) {
            originInput.property('value', format(e.origin));
            destinationInput.property('value', format(e.destination));
        });

    return control;
};

},{"../lib/d3":2}],16:[function(require,module,exports){
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

},{"../lib/d3":2,"./format":14}],17:[function(require,module,exports){
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

},{"debounce":8}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
'use strict';

var d3post = require('./d3_post');

module.exports = function(url, reqData, callback) {
    return d3post(url, reqData, function (err, resp) {
        if (err && err.type === 'abort') {
            return;
        }

        if (err && !err.responseText) {
            return callback(err);
        }

        resp = resp || err;

        try {
            resp = JSON.parse(resp.response);
        } catch (e) {
            return callback(new Error(resp));
        }

        if (resp.error) {
            return callback(new Error(resp.error));
        }

        return callback(null, resp.result);
    });
};

},{"./d3_post":11}],20:[function(require,module,exports){
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

},{"../lib/d3":2,"./format":14}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"./paging_control.js":18,"./table_control.js":21}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9pbmRleC5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9saWIvZDMuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvbm9kZV9tb2R1bGVzL0BtYXBib3gvcG9seWxpbmUvc3JjL3BvbHlsaW5lLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL25vZGVfbW9kdWxlcy9kMy1hcnJheXMvYnVpbGQvYXJyYXlzLmNqcy5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9ub2RlX21vZHVsZXMvZDMteGhyL2J1aWxkL3hoci5janMuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvbm9kZV9tb2R1bGVzL2QzLXhoci9ub2RlX21vZHVsZXMvZDMtZGlzcGF0Y2gvYnVpbGQvZDMtZGlzcGF0Y2guanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvbm9kZV9tb2R1bGVzL2QzLXhoci9ub2RlX21vZHVsZXMvZDMtZHN2L2J1aWxkL2Rzdi5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9ub2RlX21vZHVsZXMvZGVib3VuY2UvaW5kZXguanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvbm9kZV9tb2R1bGVzL3F1ZXVlLWFzeW5jL2J1aWxkL3F1ZXVlLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL25vZGVfbW9kdWxlcy9zcGluLmpzL3NwaW4uanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2QzX3Bvc3QuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2RpcmVjdGlvbnMuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2Vycm9yc19jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9mb3JtYXQuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2lucHV0X2NvbnRyb2wuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL2luc3RydWN0aW9uc19jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy9sYXllci5qcyIsIi9Vc2Vycy9sbGl1L1Byb2plY3RzL2Fpci5qcy9zcmMvcGFnaW5nX2NvbnRyb2wuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL3JlcXVlc3QuanMiLCIvVXNlcnMvbGxpdS9Qcm9qZWN0cy9haXIuanMvc3JjL3JvdXRlc19jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy90YWJsZV9jb250cm9sLmpzIiwiL1VzZXJzL2xsaXUvUHJvamVjdHMvYWlyLmpzL3NyYy90cmFja3NfY29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmlmICghTC5tYXBib3gpIHRocm93IG5ldyBFcnJvcignaW5jbHVkZSBtYXBib3guanMgYmVmb3JlIGFpci5qcycpO1xuXG5MLmFpciA9IHJlcXVpcmUoJy4vc3JjL2RpcmVjdGlvbnMnKTtcbkwuYWlyLmZvcm1hdCA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdCcpO1xuTC5haXIubGF5ZXIgPSByZXF1aXJlKCcuL3NyYy9sYXllcicpO1xuTC5haXIuaW5wdXRDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvaW5wdXRfY29udHJvbCcpO1xuTC5haXIuZXJyb3JzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2Vycm9yc19jb250cm9sJyk7XG5MLmFpci5yb3V0ZXNDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvcm91dGVzX2NvbnRyb2wnKTtcbkwuYWlyLmluc3RydWN0aW9uc0NvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9pbnN0cnVjdGlvbnNfY29udHJvbCcpO1xuTC5haXIudHJhY2tzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL3RyYWNrc19jb250cm9sLmpzJyk7XG4iLCIhZnVuY3Rpb24oKXtcbiAgdmFyIGQzID0ge3ZlcnNpb246IFwiMy40LjFcIn07IC8vIHNlbXZlclxudmFyIGQzX2FycmF5U2xpY2UgPSBbXS5zbGljZSxcbiAgICBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHsgcmV0dXJuIGQzX2FycmF5U2xpY2UuY2FsbChsaXN0KTsgfTsgLy8gY29udmVyc2lvbiBmb3IgTm9kZUxpc3RzXG5cbnZhciBkM19kb2N1bWVudCA9IGRvY3VtZW50LFxuICAgIGQzX2RvY3VtZW50RWxlbWVudCA9IGQzX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICBkM193aW5kb3cgPSB3aW5kb3c7XG5cbi8vIFJlZGVmaW5lIGQzX2FycmF5IGlmIHRoZSBicm93c2VyIGRvZXNu4oCZdCBzdXBwb3J0IHNsaWNlLWJhc2VkIGNvbnZlcnNpb24uXG50cnkge1xuICBkM19hcnJheShkM19kb2N1bWVudEVsZW1lbnQuY2hpbGROb2RlcylbMF0ubm9kZVR5cGU7XG59IGNhdGNoKGUpIHtcbiAgZDNfYXJyYXkgPSBmdW5jdGlvbihsaXN0KSB7XG4gICAgdmFyIGkgPSBsaXN0Lmxlbmd0aCwgYXJyYXkgPSBuZXcgQXJyYXkoaSk7XG4gICAgd2hpbGUgKGktLSkgYXJyYXlbaV0gPSBsaXN0W2ldO1xuICAgIHJldHVybiBhcnJheTtcbiAgfTtcbn1cbnZhciBkM19zdWJjbGFzcyA9IHt9Ll9fcHJvdG9fXz9cblxuLy8gVW50aWwgRUNNQVNjcmlwdCBzdXBwb3J0cyBhcnJheSBzdWJjbGFzc2luZywgcHJvdG90eXBlIGluamVjdGlvbiB3b3JrcyB3ZWxsLlxuZnVuY3Rpb24ob2JqZWN0LCBwcm90b3R5cGUpIHtcbiAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbn06XG5cbi8vIEFuZCBpZiB5b3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IF9fcHJvdG9fXywgd2UnbGwgdXNlIGRpcmVjdCBleHRlbnNpb24uXG5mdW5jdGlvbihvYmplY3QsIHByb3RvdHlwZSkge1xuICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm90b3R5cGUpIG9iamVjdFtwcm9wZXJ0eV0gPSBwcm90b3R5cGVbcHJvcGVydHldO1xufTtcblxuZnVuY3Rpb24gZDNfdmVuZG9yU3ltYm9sKG9iamVjdCwgbmFtZSkge1xuICBpZiAobmFtZSBpbiBvYmplY3QpIHJldHVybiBuYW1lO1xuICBuYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEpO1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGQzX3ZlbmRvclByZWZpeGVzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIHZhciBwcmVmaXhOYW1lID0gZDNfdmVuZG9yUHJlZml4ZXNbaV0gKyBuYW1lO1xuICAgIGlmIChwcmVmaXhOYW1lIGluIG9iamVjdCkgcmV0dXJuIHByZWZpeE5hbWU7XG4gIH1cbn1cblxudmFyIGQzX3ZlbmRvclByZWZpeGVzID0gW1wid2Via2l0XCIsIFwibXNcIiwgXCJtb3pcIiwgXCJNb3pcIiwgXCJvXCIsIFwiT1wiXTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uKGdyb3Vwcykge1xuICBkM19zdWJjbGFzcyhncm91cHMsIGQzX3NlbGVjdGlvblByb3RvdHlwZSk7XG4gIHJldHVybiBncm91cHM7XG59XG5cbnZhciBkM19zZWxlY3QgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBuLnF1ZXJ5U2VsZWN0b3Iocyk7IH0sXG4gICAgZDNfc2VsZWN0QWxsID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gbi5xdWVyeVNlbGVjdG9yQWxsKHMpOyB9LFxuICAgIGQzX3NlbGVjdE1hdGNoZXIgPSBkM19kb2N1bWVudEVsZW1lbnRbZDNfdmVuZG9yU3ltYm9sKGQzX2RvY3VtZW50RWxlbWVudCwgXCJtYXRjaGVzU2VsZWN0b3JcIildLFxuICAgIGQzX3NlbGVjdE1hdGNoZXMgPSBmdW5jdGlvbihuLCBzKSB7IHJldHVybiBkM19zZWxlY3RNYXRjaGVyLmNhbGwobiwgcyk7IH07XG5cbi8vIFByZWZlciBTaXp6bGUsIGlmIGF2YWlsYWJsZS5cbmlmICh0eXBlb2YgU2l6emxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgZDNfc2VsZWN0ID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gU2l6emxlKHMsIG4pWzBdIHx8IG51bGw7IH07XG4gIGQzX3NlbGVjdEFsbCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIFNpenpsZS51bmlxdWVTb3J0KFNpenpsZShzLCBuKSk7IH07XG4gIGQzX3NlbGVjdE1hdGNoZXMgPSBTaXp6bGUubWF0Y2hlc1NlbGVjdG9yO1xufVxuXG5kMy5zZWxlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvblJvb3Q7XG59O1xuXG52YXIgZDNfc2VsZWN0aW9uUHJvdG90eXBlID0gZDMuc2VsZWN0aW9uLnByb3RvdHlwZSA9IFtdO1xuXG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIHN1Ym5vZGUsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSAoZ3JvdXAgPSB0aGlzW2pdKS5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChzdWJub2RlID0gc2VsZWN0b3IuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgIGlmIChzdWJub2RlICYmIFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdChzZWxlY3RvciwgdGhpcyk7XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3RBbGwgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IGQzX2FycmF5KHNlbGVjdG9yLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpKTtcbiAgICAgICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yQWxsKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdEFsbChzZWxlY3RvciwgdGhpcyk7XG4gIH07XG59XG52YXIgZDNfbnNQcmVmaXggPSB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuXG5kMy5ucyA9IHtcbiAgcHJlZml4OiBkM19uc1ByZWZpeCxcbiAgcXVhbGlmeTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gbmFtZS5pbmRleE9mKFwiOlwiKSxcbiAgICAgICAgcHJlZml4ID0gbmFtZTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBpKTtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZyhpICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBkM19uc1ByZWZpeC5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpXG4gICAgICAgID8ge3NwYWNlOiBkM19uc1ByZWZpeFtwcmVmaXhdLCBsb2NhbDogbmFtZX1cbiAgICAgICAgOiBuYW1lO1xuICB9XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXG4gICAgLy8gRm9yIGF0dHIoc3RyaW5nKSwgcmV0dXJuIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpO1xuICAgICAgcmV0dXJuIG5hbWUubG9jYWxcbiAgICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbClcbiAgICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgIH1cblxuICAgIC8vIEZvciBhdHRyKG9iamVjdCksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBuYW1lcyBhbmQgdmFsdWVzIG9mIHRoZVxuICAgIC8vIGF0dHJpYnV0ZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmUgZnVuY3Rpb25zIHRoYXQgYXJlXG4gICAgLy8gZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuXG4gICAgZm9yICh2YWx1ZSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2F0dHIodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9hdHRyKG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fYXR0cihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gZDMubnMucXVhbGlmeShuYW1lKTtcblxuICAvLyBGb3IgYXR0cihzdHJpbmcsIG51bGwpLCByZW1vdmUgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gYXR0ck51bGwoKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gYXR0ck51bGxOUygpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICB9XG5cbiAgLy8gRm9yIGF0dHIoc3RyaW5nLCBzdHJpbmcpLCBzZXQgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gYXR0ckNvbnN0YW50KCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBhdHRyQ29uc3RhbnROUygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIEZvciBhdHRyKHN0cmluZywgZnVuY3Rpb24pLCBldmFsdWF0ZSB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kIHNldFxuICAvLyBvciByZW1vdmUgdGhlIGF0dHJpYnV0ZSBhcyBhcHByb3ByaWF0ZS5cbiAgZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHgpO1xuICB9XG4gIGZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB4KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IChuYW1lLmxvY2FsID8gYXR0ck51bGxOUyA6IGF0dHJOdWxsKSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAobmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAobmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KSk7XG59XG5mdW5jdGlvbiBkM19jb2xsYXBzZShzKSB7XG4gIHJldHVybiBzLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbn1cbmQzLnJlcXVvdGUgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzLnJlcGxhY2UoZDNfcmVxdW90ZV9yZSwgXCJcXFxcJCZcIik7XG59O1xuXG52YXIgZDNfcmVxdW90ZV9yZSA9IC9bXFxcXFxcXlxcJFxcKlxcK1xcP1xcfFxcW1xcXVxcKFxcKVxcLlxce1xcfV0vZztcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNsYXNzZWQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblxuICAgIC8vIEZvciBjbGFzc2VkKHN0cmluZyksIHJldHVybiB0cnVlIG9ubHkgaWYgdGhlIGZpcnN0IG5vZGUgaGFzIHRoZSBzcGVjaWZpZWRcbiAgICAvLyBjbGFzcyBvciBjbGFzc2VzLiBOb3RlIHRoYXQgZXZlbiBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBET01Ub2tlbkxpc3QsIGl0XG4gICAgLy8gcHJvYmFibHkgZG9lc24ndCBzdXBwb3J0IGl0IG9uIFNWRyBlbGVtZW50cyAod2hpY2ggY2FuIGJlIGFuaW1hdGVkKS5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCksXG4gICAgICAgICAgbiA9IChuYW1lID0gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkpLmxlbmd0aCxcbiAgICAgICAgICBpID0gLTE7XG4gICAgICBpZiAodmFsdWUgPSBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCF2YWx1ZS5jb250YWlucyhuYW1lW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWVbaV0pLnRlc3QodmFsdWUpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGb3IgY2xhc3NlZChvYmplY3QpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgbmFtZXMgb2YgY2xhc3NlcyB0byBhZGQgb3JcbiAgICAvLyByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlIGZ1bmN0aW9ucyB0aGF0IGFyZSBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fY2xhc3NlZCh2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYm90aCBhIG5hbWUgYW5kIGEgdmFsdWUgYXJlIHNwZWNpZmllZCwgYW5kIGFyZSBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoPzpefFxcXFxzKylcIiArIGQzLnJlcXVvdGUobmFtZSkgKyBcIig/OlxcXFxzK3wkKVwiLCBcImdcIik7XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VzKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuLy8gTXVsdGlwbGUgY2xhc3MgbmFtZXMgYXJlIGFsbG93ZWQgKGUuZy4sIFwiZm9vIGJhclwiKS5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBkM19zZWxlY3Rpb25fY2xhc3NlcyhuYW1lKS5tYXAoZDNfc2VsZWN0aW9uX2NsYXNzZWROYW1lKTtcbiAgdmFyIG4gPSBuYW1lLmxlbmd0aDtcblxuICBmdW5jdGlvbiBjbGFzc2VkQ29uc3RhbnQoKSB7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB3aGlsZSAoKytpIDwgbikgbmFtZVtpXSh0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCB0aGUgZnVuY3Rpb24gaXMgc3RpbGwgZXZhbHVhdGVkIG9ubHkgb25jZSBwZXJcbiAgLy8gZWxlbWVudCBldmVuIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjbGFzcyBuYW1lcy5cbiAgZnVuY3Rpb24gY2xhc3NlZEZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gLTEsIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHgpO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvblxuICAgICAgOiBjbGFzc2VkQ29uc3RhbnQ7XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkTmFtZShuYW1lKSB7XG4gIHZhciByZSA9IGQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZSk7XG4gIHJldHVybiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgIGlmIChjID0gbm9kZS5jbGFzc0xpc3QpIHJldHVybiB2YWx1ZSA/IGMuYWRkKG5hbWUpIDogYy5yZW1vdmUobmFtZSk7XG4gICAgdmFyIGMgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCI7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgICAgaWYgKCFyZS50ZXN0KGMpKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGQzX2NvbGxhcHNlKGMgKyBcIiBcIiArIG5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBkM19jb2xsYXBzZShjLnJlcGxhY2UocmUsIFwiIFwiKSkpO1xuICAgIH1cbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnN0eWxlID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKG4gPCAzKSB7XG5cbiAgICAvLyBGb3Igc3R5bGUob2JqZWN0KSBvciBzdHlsZShvYmplY3QsIHN0cmluZyksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZVxuICAgIC8vIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlIGF0dHJpYnV0ZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmVcbiAgICAvLyBmdW5jdGlvbnMgdGhhdCBhcmUgZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuIFRoZSBvcHRpb25hbCBzdHJpbmdcbiAgICAvLyBzcGVjaWZpZXMgdGhlIHByaW9yaXR5LlxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKG4gPCAyKSB2YWx1ZSA9IFwiXCI7XG4gICAgICBmb3IgKHByaW9yaXR5IGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fc3R5bGUocHJpb3JpdHksIG5hbWVbcHJpb3JpdHldLCB2YWx1ZSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRm9yIHN0eWxlKHN0cmluZyksIHJldHVybiB0aGUgY29tcHV0ZWQgc3R5bGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmIChuIDwgMikgcmV0dXJuIGQzX3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMubm9kZSgpLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xuXG4gICAgLy8gRm9yIHN0eWxlKHN0cmluZywgc3RyaW5nKSBvciBzdHlsZShzdHJpbmcsIGZ1bmN0aW9uKSwgdXNlIHRoZSBkZWZhdWx0XG4gICAgLy8gcHJpb3JpdHkuIFRoZSBwcmlvcml0eSBpcyBpZ25vcmVkIGZvciBzdHlsZShzdHJpbmcsIG51bGwpLlxuICAgIHByaW9yaXR5ID0gXCJcIjtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYSBuYW1lLCB2YWx1ZSBhbmQgcHJpb3JpdHkgYXJlIHNwZWNpZmllZCwgYW5kIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBudWxsKSBvciBzdHlsZShuYW1lLCBudWxsLCBwcmlvcml0eSksIHJlbW92ZSB0aGUgc3R5bGVcbiAgLy8gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuIFRoZSBwcmlvcml0eSBpcyBpZ25vcmVkLlxuICBmdW5jdGlvbiBzdHlsZU51bGwoKSB7XG4gICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgfVxuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBzdHJpbmcpIG9yIHN0eWxlKG5hbWUsIHN0cmluZywgcHJpb3JpdHkpLCBzZXQgdGhlIHN0eWxlXG4gIC8vIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLCB1c2luZyB0aGUgc3BlY2lmaWVkIHByaW9yaXR5LlxuICBmdW5jdGlvbiBzdHlsZUNvbnN0YW50KCkge1xuICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUsIHByaW9yaXR5KTtcbiAgfVxuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBmdW5jdGlvbikgb3Igc3R5bGUobmFtZSwgZnVuY3Rpb24sIHByaW9yaXR5KSwgZXZhbHVhdGUgdGhlXG4gIC8vIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZCBzZXQgb3IgcmVtb3ZlIHRoZSBzdHlsZSBwcm9wZXJ0eSBhc1xuICAvLyBhcHByb3ByaWF0ZS4gV2hlbiBzZXR0aW5nLCB1c2UgdGhlIHNwZWNpZmllZCBwcmlvcml0eS5cbiAgZnVuY3Rpb24gc3R5bGVGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgeCwgcHJpb3JpdHkpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gc3R5bGVOdWxsIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHN0eWxlRnVuY3Rpb24gOiBzdHlsZUNvbnN0YW50KTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cbiAgICAvLyBGb3IgcHJvcGVydHkoc3RyaW5nKSwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiKSByZXR1cm4gdGhpcy5ub2RlKClbbmFtZV07XG5cbiAgICAvLyBGb3IgcHJvcGVydHkob2JqZWN0KSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlXG4gICAgLy8gcHJvcGVydGllcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZSBmdW5jdGlvbnMgdGhhdCBhcmVcbiAgICAvLyBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fcHJvcGVydHkodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBPdGhlcndpc2UsIGJvdGggYSBuYW1lIGFuZCBhIHZhbHVlIGFyZSBzcGVjaWZpZWQsIGFuZCBhcmUgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fcHJvcGVydHkobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9wcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuXG4gIC8vIEZvciBwcm9wZXJ0eShuYW1lLCBudWxsKSwgcmVtb3ZlIHRoZSBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlOdWxsKCkge1xuICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICB9XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIHN0cmluZyksIHNldCB0aGUgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuXG4gIGZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQoKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIGZ1bmN0aW9uKSwgZXZhbHVhdGUgdGhlIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZFxuICAvLyBzZXQgb3IgcmVtb3ZlIHRoZSBwcm9wZXJ0eSBhcyBhcHByb3ByaWF0ZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgZWxzZSB0aGlzW25hbWVdID0geDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IHByb3BlcnR5TnVsbCA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uIDogcHJvcGVydHlDb25zdGFudCk7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS50ZXh0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGZ1bmN0aW9uKCkgeyB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjsgfSA6IHZhbHVlID09IG51bGxcbiAgICAgID8gZnVuY3Rpb24oKSB7IHRoaXMudGV4dENvbnRlbnQgPSBcIlwiOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7IH0pXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmh0bWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZnVuY3Rpb24oKSB7IHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjsgfSA6IHZhbHVlID09IG51bGxcbiAgICAgID8gZnVuY3Rpb24oKSB7IHRoaXMuaW5uZXJIVE1MID0gXCJcIjsgfVxuICAgICAgOiBmdW5jdGlvbigpIHsgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTsgfSlcbiAgICAgIDogdGhpcy5ub2RlKCkuaW5uZXJIVE1MO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQobmFtZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY3JlYXRvcihuYW1lKSB7XG4gIHJldHVybiB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZVxuICAgICAgOiAobmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSkpLmxvY2FsID8gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5hbWVzcGFjZVVSSSwgbmFtZSk7IH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICBiZWZvcmUgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShuYW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIGJlZm9yZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn07XG5cbi8vIFRPRE8gcmVtb3ZlKHNlbGVjdG9yKT9cbi8vIFRPRE8gcmVtb3ZlKG5vZGUpP1xuLy8gVE9ETyByZW1vdmUoZnVuY3Rpb24pP1xuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICB9KTtcbn07XG5mdW5jdGlvbiBkM19jbGFzcyhjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdG9yLnByb3RvdHlwZSwga2V5LCB7XG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzW2tleV0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjdG9yLnByb3RvdHlwZSA9IHByb3BlcnRpZXM7XG4gIH1cbn1cblxuZDMubWFwID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBtYXAgPSBuZXcgZDNfTWFwO1xuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgZDNfTWFwKSBvYmplY3QuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7IG1hcC5zZXQoa2V5LCB2YWx1ZSk7IH0pO1xuICBlbHNlIGZvciAodmFyIGtleSBpbiBvYmplY3QpIG1hcC5zZXQoa2V5LCBvYmplY3Rba2V5XSk7XG4gIHJldHVybiBtYXA7XG59O1xuXG5mdW5jdGlvbiBkM19NYXAoKSB7fVxuXG5kM19jbGFzcyhkM19NYXAsIHtcbiAgaGFzOiBkM19tYXBfaGFzLFxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0aGlzW2QzX21hcF9wcmVmaXggKyBrZXldO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpc1tkM19tYXBfcHJlZml4ICsga2V5XSA9IHZhbHVlO1xuICB9LFxuICByZW1vdmU6IGQzX21hcF9yZW1vdmUsXG4gIGtleXM6IGQzX21hcF9rZXlzLFxuICB2YWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyB2YWx1ZXMucHVzaCh2YWx1ZSk7IH0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0sXG4gIGVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbnRyaWVzID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgZW50cmllcy5wdXNoKHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlfSk7IH0pO1xuICAgIHJldHVybiBlbnRyaWVzO1xuICB9LFxuICBzaXplOiBkM19tYXBfc2l6ZSxcbiAgZW1wdHk6IGQzX21hcF9lbXB0eSxcbiAgZm9yRWFjaDogZnVuY3Rpb24oZikge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSBmLmNhbGwodGhpcywga2V5LnN1YnN0cmluZygxKSwgdGhpc1trZXldKTtcbiAgfVxufSk7XG5cbnZhciBkM19tYXBfcHJlZml4ID0gXCJcXDBcIiwgLy8gcHJldmVudCBjb2xsaXNpb24gd2l0aCBidWlsdC1pbnNcbiAgICBkM19tYXBfcHJlZml4Q29kZSA9IGQzX21hcF9wcmVmaXguY2hhckNvZGVBdCgwKTtcblxuZnVuY3Rpb24gZDNfbWFwX2hhcyhrZXkpIHtcbiAgcmV0dXJuIGQzX21hcF9wcmVmaXggKyBrZXkgaW4gdGhpcztcbn1cblxuZnVuY3Rpb24gZDNfbWFwX3JlbW92ZShrZXkpIHtcbiAga2V5ID0gZDNfbWFwX3ByZWZpeCArIGtleTtcbiAgcmV0dXJuIGtleSBpbiB0aGlzICYmIGRlbGV0ZSB0aGlzW2tleV07XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9rZXlzKCkge1xuICB2YXIga2V5cyA9IFtdO1xuICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7IGtleXMucHVzaChrZXkpOyB9KTtcbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9zaXplKCkge1xuICB2YXIgc2l6ZSA9IDA7XG4gIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSArK3NpemU7XG4gIHJldHVybiBzaXplO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfZW1wdHkoKSB7XG4gIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgdmFyIGkgPSAtMSxcbiAgICAgIG4gPSB0aGlzLmxlbmd0aCxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICAvLyBJZiBubyB2YWx1ZSBpcyBzcGVjaWZpZWQsIHJldHVybiB0aGUgZmlyc3QgdmFsdWUuXG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHZhbHVlID0gbmV3IEFycmF5KG4gPSAoZ3JvdXAgPSB0aGlzWzBdKS5sZW5ndGgpO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHZhbHVlW2ldID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYmluZChncm91cCwgZ3JvdXBEYXRhKSB7XG4gICAgdmFyIGksXG4gICAgICAgIG4gPSBncm91cC5sZW5ndGgsXG4gICAgICAgIG0gPSBncm91cERhdGEubGVuZ3RoLFxuICAgICAgICBuMCA9IE1hdGgubWluKG4sIG0pLFxuICAgICAgICB1cGRhdGVOb2RlcyA9IG5ldyBBcnJheShtKSxcbiAgICAgICAgZW50ZXJOb2RlcyA9IG5ldyBBcnJheShtKSxcbiAgICAgICAgZXhpdE5vZGVzID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBub2RlLFxuICAgICAgICBub2RlRGF0YTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciBub2RlQnlLZXlWYWx1ZSA9IG5ldyBkM19NYXAsXG4gICAgICAgICAgZGF0YUJ5S2V5VmFsdWUgPSBuZXcgZDNfTWFwLFxuICAgICAgICAgIGtleVZhbHVlcyA9IFtdLFxuICAgICAgICAgIGtleVZhbHVlO1xuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIHtcbiAgICAgICAga2V5VmFsdWUgPSBrZXkuY2FsbChub2RlID0gZ3JvdXBbaV0sIG5vZGUuX19kYXRhX18sIGkpO1xuICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICAgIGV4aXROb2Rlc1tpXSA9IG5vZGU7IC8vIGR1cGxpY2F0ZSBzZWxlY3Rpb24ga2V5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlWYWx1ZXMucHVzaChrZXlWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBtOykge1xuICAgICAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKGdyb3VwRGF0YSwgbm9kZURhdGEgPSBncm91cERhdGFbaV0sIGkpO1xuICAgICAgICBpZiAobm9kZSA9IG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZSkpIHtcbiAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IG5vZGVEYXRhO1xuICAgICAgICB9IGVsc2UgaWYgKCFkYXRhQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7IC8vIG5vIGR1cGxpY2F0ZSBkYXRhIGtleVxuICAgICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUobm9kZURhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGRhdGFCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZURhdGEpO1xuICAgICAgICBub2RlQnlLZXlWYWx1ZS5yZW1vdmUoa2V5VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIHtcbiAgICAgICAgaWYgKG5vZGVCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG4wOykge1xuICAgICAgICBub2RlID0gZ3JvdXBbaV07XG4gICAgICAgIG5vZGVEYXRhID0gZ3JvdXBEYXRhW2ldO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIG5vZGUuX19kYXRhX18gPSBub2RlRGF0YTtcbiAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShub2RlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoOyBpIDwgbTsgKytpKSB7XG4gICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUoZ3JvdXBEYXRhW2ldKTtcbiAgICAgIH1cbiAgICAgIGZvciAoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGV4aXROb2Rlc1tpXSA9IGdyb3VwW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyTm9kZXMudXBkYXRlXG4gICAgICAgID0gdXBkYXRlTm9kZXM7XG5cbiAgICBlbnRlck5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSB1cGRhdGVOb2Rlcy5wYXJlbnROb2RlXG4gICAgICAgID0gZXhpdE5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSBncm91cC5wYXJlbnROb2RlO1xuXG4gICAgZW50ZXIucHVzaChlbnRlck5vZGVzKTtcbiAgICB1cGRhdGUucHVzaCh1cGRhdGVOb2Rlcyk7XG4gICAgZXhpdC5wdXNoKGV4aXROb2Rlcyk7XG4gIH1cblxuICB2YXIgZW50ZXIgPSBkM19zZWxlY3Rpb25fZW50ZXIoW10pLFxuICAgICAgdXBkYXRlID0gZDNfc2VsZWN0aW9uKFtdKSxcbiAgICAgIGV4aXQgPSBkM19zZWxlY3Rpb24oW10pO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBiaW5kKGdyb3VwID0gdGhpc1tpXSwgdmFsdWUuY2FsbChncm91cCwgZ3JvdXAucGFyZW50Tm9kZS5fX2RhdGFfXywgaSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgYmluZChncm91cCA9IHRoaXNbaV0sIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUuZW50ZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGVudGVyOyB9O1xuICB1cGRhdGUuZXhpdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhpdDsgfTtcbiAgcmV0dXJuIHVwZGF0ZTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9kYXRhTm9kZShkYXRhKSB7XG4gIHJldHVybiB7X19kYXRhX186IGRhdGF9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZGF0dW0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiKTtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgdmFyIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09IFwiZnVuY3Rpb25cIikgZmlsdGVyID0gZDNfc2VsZWN0aW9uX2ZpbHRlcihmaWx0ZXIpO1xuXG4gIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBzdWJncm91cC5wYXJlbnROb2RlID0gKGdyb3VwID0gdGhpc1tqXSkucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIGZpbHRlci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2ZpbHRlcihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdE1hdGNoZXModGhpcywgc2VsZWN0b3IpO1xuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUub3JkZXIgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gZ3JvdXAubGVuZ3RoIC0gMSwgbmV4dCA9IGdyb3VwW2ldLCBub2RlOyAtLWkgPj0gMDspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgaWYgKG5leHQgJiYgbmV4dCAhPT0gbm9kZS5uZXh0U2libGluZykgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcbmQzLmFzY2VuZGluZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gIGNvbXBhcmF0b3IgPSBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB0aGlzW2pdLnNvcnQoY29tcGFyYXRvcik7XG4gIHJldHVybiB0aGlzLm9yZGVyKCk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IoY29tcGFyYXRvcikge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIGNvbXBhcmF0b3IgPSBkMy5hc2NlbmRpbmc7XG4gIHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmF0b3IoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9O1xufVxuZnVuY3Rpb24gZDNfbm9vcCgpIHt9XG5cbmQzLmRpc3BhdGNoID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkaXNwYXRjaCA9IG5ldyBkM19kaXNwYXRjaCxcbiAgICAgIGkgPSAtMSxcbiAgICAgIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgZGlzcGF0Y2hbYXJndW1lbnRzW2ldXSA9IGQzX2Rpc3BhdGNoX2V2ZW50KGRpc3BhdGNoKTtcbiAgcmV0dXJuIGRpc3BhdGNoO1xufTtcblxuZnVuY3Rpb24gZDNfZGlzcGF0Y2goKSB7fVxuXG5kM19kaXNwYXRjaC5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgaSA9IHR5cGUuaW5kZXhPZihcIi5cIiksXG4gICAgICBuYW1lID0gXCJcIjtcblxuICAvLyBFeHRyYWN0IG9wdGlvbmFsIG5hbWVzcGFjZSwgZS5nLiwgXCJjbGljay5mb29cIlxuICBpZiAoaSA+PSAwKSB7XG4gICAgbmFtZSA9IHR5cGUuc3Vic3RyaW5nKGkgKyAxKTtcbiAgICB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMCwgaSk7XG4gIH1cblxuICBpZiAodHlwZSkgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgICA/IHRoaXNbdHlwZV0ub24obmFtZSlcbiAgICAgIDogdGhpc1t0eXBlXS5vbihuYW1lLCBsaXN0ZW5lcik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkgZm9yICh0eXBlIGluIHRoaXMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHR5cGUpKSB0aGlzW3R5cGVdLm9uKG5hbWUsIG51bGwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxuZnVuY3Rpb24gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpIHtcbiAgdmFyIGxpc3RlbmVycyA9IFtdLFxuICAgICAgbGlzdGVuZXJCeU5hbWUgPSBuZXcgZDNfTWFwO1xuXG4gIGZ1bmN0aW9uIGV2ZW50KCkge1xuICAgIHZhciB6ID0gbGlzdGVuZXJzLCAvLyBkZWZlbnNpdmUgcmVmZXJlbmNlXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IHoubGVuZ3RoLFxuICAgICAgICBsO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAobCA9IHpbaV0ub24pIGwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH1cblxuICBldmVudC5vbiA9IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIGwgPSBsaXN0ZW5lckJ5TmFtZS5nZXQobmFtZSksXG4gICAgICAgIGk7XG5cbiAgICAvLyByZXR1cm4gdGhlIGN1cnJlbnQgbGlzdGVuZXIsIGlmIGFueVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIGwgJiYgbC5vbjtcblxuICAgIC8vIHJlbW92ZSB0aGUgb2xkIGxpc3RlbmVyLCBpZiBhbnkgKHdpdGggY29weS1vbi13cml0ZSlcbiAgICBpZiAobCkge1xuICAgICAgbC5vbiA9IG51bGw7XG4gICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuc2xpY2UoMCwgaSA9IGxpc3RlbmVycy5pbmRleE9mKGwpKS5jb25jYXQobGlzdGVuZXJzLnNsaWNlKGkgKyAxKSk7XG4gICAgICBsaXN0ZW5lckJ5TmFtZS5yZW1vdmUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBuZXcgbGlzdGVuZXIsIGlmIGFueVxuICAgIGlmIChsaXN0ZW5lcikgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXJCeU5hbWUuc2V0KG5hbWUsIHtvbjogbGlzdGVuZXJ9KSk7XG5cbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5kMy5ldmVudCA9IG51bGw7XG5cbmZ1bmN0aW9uIGQzX2V2ZW50UHJldmVudERlZmF1bHQoKSB7XG4gIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmZ1bmN0aW9uIGQzX2V2ZW50U291cmNlKCkge1xuICB2YXIgZSA9IGQzLmV2ZW50LCBzO1xuICB3aGlsZSAocyA9IGUuc291cmNlRXZlbnQpIGUgPSBzO1xuICByZXR1cm4gZTtcbn1cblxuLy8gTGlrZSBkMy5kaXNwYXRjaCwgYnV0IGZvciBjdXN0b20gZXZlbnRzIGFic3RyYWN0aW5nIG5hdGl2ZSBVSSBldmVudHMuIFRoZXNlXG4vLyBldmVudHMgaGF2ZSBhIHRhcmdldCBjb21wb25lbnQgKHN1Y2ggYXMgYSBicnVzaCksIGEgdGFyZ2V0IGVsZW1lbnQgKHN1Y2ggYXNcbi8vIHRoZSBzdmc6ZyBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGJydXNoKSBhbmQgdGhlIHN0YW5kYXJkIGFyZ3VtZW50cyBgZGAgKHRoZVxuLy8gdGFyZ2V0IGVsZW1lbnQncyBkYXRhKSBhbmQgYGlgICh0aGUgc2VsZWN0aW9uIGluZGV4IG9mIHRoZSB0YXJnZXQgZWxlbWVudCkuXG5mdW5jdGlvbiBkM19ldmVudERpc3BhdGNoKHRhcmdldCkge1xuICB2YXIgZGlzcGF0Y2ggPSBuZXcgZDNfZGlzcGF0Y2gsXG4gICAgICBpID0gMCxcbiAgICAgIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2kgPCBuKSBkaXNwYXRjaFthcmd1bWVudHNbaV1dID0gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpO1xuXG4gIC8vIENyZWF0ZXMgYSBkaXNwYXRjaCBjb250ZXh0IGZvciB0aGUgc3BlY2lmaWVkIGB0aGl6YCAodHlwaWNhbGx5LCB0aGUgdGFyZ2V0XG4gIC8vIERPTSBlbGVtZW50IHRoYXQgcmVjZWl2ZWQgdGhlIHNvdXJjZSBldmVudCkgYW5kIGBhcmd1bWVudHpgICh0eXBpY2FsbHksIHRoZVxuICAvLyBkYXRhIGBkYCBhbmQgaW5kZXggYGlgIG9mIHRoZSB0YXJnZXQgZWxlbWVudCkuIFRoZSByZXR1cm5lZCBmdW5jdGlvbiBjYW4gYmVcbiAgLy8gdXNlZCB0byBkaXNwYXRjaCBhbiBldmVudCB0byBhbnkgcmVnaXN0ZXJlZCBsaXN0ZW5lcnM7IHRoZSBmdW5jdGlvbiB0YWtlcyBhXG4gIC8vIHNpbmdsZSBhcmd1bWVudCBhcyBpbnB1dCwgYmVpbmcgdGhlIGV2ZW50IHRvIGRpc3BhdGNoLiBUaGUgZXZlbnQgbXVzdCBoYXZlXG4gIC8vIGEgXCJ0eXBlXCIgYXR0cmlidXRlIHdoaWNoIGNvcnJlc3BvbmRzIHRvIGEgdHlwZSByZWdpc3RlcmVkIGluIHRoZVxuICAvLyBjb25zdHJ1Y3Rvci4gVGhpcyBjb250ZXh0IHdpbGwgYXV0b21hdGljYWxseSBwb3B1bGF0ZSB0aGUgXCJzb3VyY2VFdmVudFwiIGFuZFxuICAvLyBcInRhcmdldFwiIGF0dHJpYnV0ZXMgb2YgdGhlIGV2ZW50LCBhcyB3ZWxsIGFzIHNldHRpbmcgdGhlIGBkMy5ldmVudGAgZ2xvYmFsXG4gIC8vIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIG5vdGlmaWNhdGlvbi5cbiAgZGlzcGF0Y2gub2YgPSBmdW5jdGlvbih0aGl6LCBhcmd1bWVudHopIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZTEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBlMCA9XG4gICAgICAgIGUxLnNvdXJjZUV2ZW50ID0gZDMuZXZlbnQ7XG4gICAgICAgIGUxLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgZDMuZXZlbnQgPSBlMTtcbiAgICAgICAgZGlzcGF0Y2hbZTEudHlwZV0uYXBwbHkodGhpeiwgYXJndW1lbnR6KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGQzLmV2ZW50ID0gZTA7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gZGlzcGF0Y2g7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKG4gPCAzKSB7XG5cbiAgICAvLyBGb3Igb24ob2JqZWN0KSBvciBvbihvYmplY3QsIGJvb2xlYW4pLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgZXZlbnRcbiAgICAvLyB0eXBlcyBhbmQgbGlzdGVuZXJzIHRvIGFkZCBvciByZW1vdmUuIFRoZSBvcHRpb25hbCBib29sZWFuIHNwZWNpZmllc1xuICAgIC8vIHdoZXRoZXIgdGhlIGxpc3RlbmVyIGNhcHR1cmVzIGV2ZW50cy5cbiAgICBpZiAodHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmIChuIDwgMikgbGlzdGVuZXIgPSBmYWxzZTtcbiAgICAgIGZvciAoY2FwdHVyZSBpbiB0eXBlKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX29uKGNhcHR1cmUsIHR5cGVbY2FwdHVyZV0sIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGb3Igb24oc3RyaW5nKSwgcmV0dXJuIHRoZSBsaXN0ZW5lciBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKG4gPCAyKSByZXR1cm4gKG4gPSB0aGlzLm5vZGUoKVtcIl9fb25cIiArIHR5cGVdKSAmJiBuLl87XG5cbiAgICAvLyBGb3Igb24oc3RyaW5nLCBmdW5jdGlvbiksIHVzZSB0aGUgZGVmYXVsdCBjYXB0dXJlLlxuICAgIGNhcHR1cmUgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYSB0eXBlLCBsaXN0ZW5lciBhbmQgY2FwdHVyZSBhcmUgc3BlY2lmaWVkLCBhbmQgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICB2YXIgbmFtZSA9IFwiX19vblwiICsgdHlwZSxcbiAgICAgIGkgPSB0eXBlLmluZGV4T2YoXCIuXCIpLFxuICAgICAgd3JhcCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyO1xuXG4gIGlmIChpID4gMCkgdHlwZSA9IHR5cGUuc3Vic3RyaW5nKDAsIGkpO1xuICB2YXIgZmlsdGVyID0gZDNfc2VsZWN0aW9uX29uRmlsdGVycy5nZXQodHlwZSk7XG4gIGlmIChmaWx0ZXIpIHR5cGUgPSBmaWx0ZXIsIHdyYXAgPSBkM19zZWxlY3Rpb25fb25GaWx0ZXI7XG5cbiAgZnVuY3Rpb24gb25SZW1vdmUoKSB7XG4gICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgIGlmIChsKSB7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbCwgbC4kKTtcbiAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uQWRkKCkge1xuICAgIHZhciBsID0gd3JhcChsaXN0ZW5lciwgZDNfYXJyYXkoYXJndW1lbnRzKSk7XG4gICAgb25SZW1vdmUuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpc1tuYW1lXSA9IGwsIGwuJCA9IGNhcHR1cmUpO1xuICAgIGwuXyA9IGxpc3RlbmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsKCkge1xuICAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCJeX19vbihbXi5dKylcIiArIGQzLnJlcXVvdGUodHlwZSkgKyBcIiRcIiksXG4gICAgICAgIG1hdGNoO1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgaWYgKG1hdGNoID0gbmFtZS5tYXRjaChyZSkpIHtcbiAgICAgICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobWF0Y2hbMV0sIGwsIGwuJCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpXG4gICAgICA/IGxpc3RlbmVyID8gb25BZGQgOiBvblJlbW92ZVxuICAgICAgOiBsaXN0ZW5lciA/IGQzX25vb3AgOiByZW1vdmVBbGw7XG59XG5cbnZhciBkM19zZWxlY3Rpb25fb25GaWx0ZXJzID0gZDMubWFwKHtcbiAgbW91c2VlbnRlcjogXCJtb3VzZW92ZXJcIixcbiAgbW91c2VsZWF2ZTogXCJtb3VzZW91dFwiXG59KTtcblxuZDNfc2VsZWN0aW9uX29uRmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgaWYgKFwib25cIiArIGsgaW4gZDNfZG9jdW1lbnQpIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMucmVtb3ZlKGspO1xufSk7XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgbyA9IGQzLmV2ZW50OyAvLyBFdmVudHMgY2FuIGJlIHJlZW50cmFudCAoZS5nLiwgZm9jdXMpLlxuICAgIGQzLmV2ZW50ID0gZTtcbiAgICBhcmd1bWVudHpbMF0gPSB0aGlzLl9fZGF0YV9fO1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHopO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkMy5ldmVudCA9IG87XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fb25GaWx0ZXIobGlzdGVuZXIsIGFyZ3VtZW50eikge1xuICB2YXIgbCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopO1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLCByZWxhdGVkID0gZS5yZWxhdGVkVGFyZ2V0O1xuICAgIGlmICghcmVsYXRlZCB8fCAocmVsYXRlZCAhPT0gdGFyZ2V0ICYmICEocmVsYXRlZC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0YXJnZXQpICYgOCkpKSB7XG4gICAgICBsLmNhbGwodGFyZ2V0LCBlKTtcbiAgICB9XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbl9lYWNoKHRoaXMsIGZ1bmN0aW9uKG5vZGUsIGksIGopIHtcbiAgICBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lYWNoKGdyb3VwcywgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjayhub2RlLCBpLCBqKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGdyb3Vwcztcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgYXJncyA9IGQzX2FycmF5KGFyZ3VtZW50cyk7XG4gIGNhbGxiYWNrLmFwcGx5KGFyZ3NbMF0gPSB0aGlzLCBhcmdzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgaWYgKG5vZGUpIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuID0gMDtcbiAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyArK247IH0pO1xuICByZXR1cm4gbjtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lbnRlcihzZWxlY3Rpb24pIHtcbiAgZDNfc3ViY2xhc3Moc2VsZWN0aW9uLCBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUpO1xuICByZXR1cm4gc2VsZWN0aW9uO1xufVxuXG52YXIgZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlID0gW107XG5cbmQzLnNlbGVjdGlvbi5lbnRlciA9IGQzX3NlbGVjdGlvbl9lbnRlcjtcbmQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUgPSBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGU7XG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5hcHBlbmQgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuYXBwZW5kO1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmVtcHR5ID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVtcHR5O1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLm5vZGUgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUubm9kZTtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5jYWxsID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGw7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuc2l6ZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplO1xuXG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIHN1Ym5vZGUsXG4gICAgICB1cGdyb3VwLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHVwZ3JvdXAgPSAoZ3JvdXAgPSB0aGlzW2pdKS51cGRhdGU7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IGdyb3VwLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKHVwZ3JvdXBbaV0gPSBzdWJub2RlID0gc2VsZWN0b3IuY2FsbChncm91cC5wYXJlbnROb2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgYmVmb3JlID0gZDNfc2VsZWN0aW9uX2VudGVySW5zZXJ0QmVmb3JlKHRoaXMpO1xuICByZXR1cm4gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydC5jYWxsKHRoaXMsIG5hbWUsIGJlZm9yZSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZW50ZXJJbnNlcnRCZWZvcmUoZW50ZXIpIHtcbiAgdmFyIGkwLCBqMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQsIGksIGopIHtcbiAgICB2YXIgZ3JvdXAgPSBlbnRlcltqXS51cGRhdGUsXG4gICAgICAgIG4gPSBncm91cC5sZW5ndGgsXG4gICAgICAgIG5vZGU7XG4gICAgaWYgKGogIT0gajApIGowID0gaiwgaTAgPSAwO1xuICAgIGlmIChpID49IGkwKSBpMCA9IGkgKyAxO1xuICAgIHdoaWxlICghKG5vZGUgPSBncm91cFtpMF0pICYmICsraTAgPCBuKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcbn1cblxuLy8gaW1wb3J0IFwiLi4vdHJhbnNpdGlvbi90cmFuc2l0aW9uXCI7XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpZCA9IGQzX3RyYW5zaXRpb25Jbmhlcml0SWQgfHwgKytkM190cmFuc2l0aW9uSWQsXG4gICAgICBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgbm9kZSxcbiAgICAgIHRyYW5zaXRpb24gPSBkM190cmFuc2l0aW9uSW5oZXJpdCB8fCB7dGltZTogRGF0ZS5ub3coKSwgZWFzZTogZDNfZWFzZV9jdWJpY0luT3V0LCBkZWxheTogMCwgZHVyYXRpb246IDI1MH07XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBkM190cmFuc2l0aW9uTm9kZShub2RlLCBpLCBpZCwgdHJhbnNpdGlvbik7XG4gICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM190cmFuc2l0aW9uKHN1Ymdyb3VwcywgaWQpO1xufTtcbi8vIGltcG9ydCBcIi4uL3RyYW5zaXRpb24vdHJhbnNpdGlvblwiO1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuaW50ZXJydXB0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2ludGVycnVwdCk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25faW50ZXJydXB0KCkge1xuICB2YXIgbG9jayA9IHRoaXMuX190cmFuc2l0aW9uX187XG4gIGlmIChsb2NrKSArK2xvY2suYWN0aXZlO1xufVxuXG4vLyBUT0RPIGZhc3Qgc2luZ2xldG9uIGltcGxlbWVudGF0aW9uP1xuZDMuc2VsZWN0ID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgZ3JvdXAgPSBbdHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIgPyBkM19zZWxlY3Qobm9kZSwgZDNfZG9jdW1lbnQpIDogbm9kZV07XG4gIGdyb3VwLnBhcmVudE5vZGUgPSBkM19kb2N1bWVudEVsZW1lbnQ7XG4gIHJldHVybiBkM19zZWxlY3Rpb24oW2dyb3VwXSk7XG59O1xuXG5kMy5zZWxlY3RBbGwgPSBmdW5jdGlvbihub2Rlcykge1xuICB2YXIgZ3JvdXAgPSBkM19hcnJheSh0eXBlb2Ygbm9kZXMgPT09IFwic3RyaW5nXCIgPyBkM19zZWxlY3RBbGwobm9kZXMsIGQzX2RvY3VtZW50KSA6IG5vZGVzKTtcbiAgZ3JvdXAucGFyZW50Tm9kZSA9IGQzX2RvY3VtZW50RWxlbWVudDtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihbZ3JvdXBdKTtcbn07XG5cbnZhciBkM19zZWxlY3Rpb25Sb290ID0gZDMuc2VsZWN0KGQzX2RvY3VtZW50RWxlbWVudCk7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShkMyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZDM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kMyA9IGQzO1xuICB9XG59KCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQmFzZWQgb2ZmIG9mIFt0aGUgb2ZmaWNhbCBHb29nbGUgZG9jdW1lbnRdKGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi91dGlsaXRpZXMvcG9seWxpbmVhbGdvcml0aG0pXG4gKlxuICogU29tZSBwYXJ0cyBmcm9tIFt0aGlzIGltcGxlbWVudGF0aW9uXShodHRwOi8vZmFjc3RhZmYudW5jYS5lZHUvbWNtY2NsdXIvR29vZ2xlTWFwcy9FbmNvZGVQb2x5bGluZS9Qb2x5bGluZUVuY29kZXIuanMpXG4gKiBieSBbTWFyayBNY0NsdXJlXShodHRwOi8vZmFjc3RhZmYudW5jYS5lZHUvbWNtY2NsdXIvKVxuICpcbiAqIEBtb2R1bGUgcG9seWxpbmVcbiAqL1xuXG52YXIgcG9seWxpbmUgPSB7fTtcblxuZnVuY3Rpb24gcHkyX3JvdW5kKHZhbHVlKSB7XG4gICAgLy8gR29vZ2xlJ3MgcG9seWxpbmUgYWxnb3JpdGhtIHVzZXMgdGhlIHNhbWUgcm91bmRpbmcgc3RyYXRlZ3kgYXMgUHl0aG9uIDIsIHdoaWNoIGlzIGRpZmZlcmVudCBmcm9tIEpTIGZvciBuZWdhdGl2ZSB2YWx1ZXNcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLmFicyh2YWx1ZSkgKyAwLjUpICogTWF0aC5zaWduKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gZW5jb2RlKGN1cnJlbnQsIHByZXZpb3VzLCBmYWN0b3IpIHtcbiAgICBjdXJyZW50ID0gcHkyX3JvdW5kKGN1cnJlbnQgKiBmYWN0b3IpO1xuICAgIHByZXZpb3VzID0gcHkyX3JvdW5kKHByZXZpb3VzICogZmFjdG9yKTtcbiAgICB2YXIgY29vcmRpbmF0ZSA9IGN1cnJlbnQgLSBwcmV2aW91cztcbiAgICBjb29yZGluYXRlIDw8PSAxO1xuICAgIGlmIChjdXJyZW50IC0gcHJldmlvdXMgPCAwKSB7XG4gICAgICAgIGNvb3JkaW5hdGUgPSB+Y29vcmRpbmF0ZTtcbiAgICB9XG4gICAgdmFyIG91dHB1dCA9ICcnO1xuICAgIHdoaWxlIChjb29yZGluYXRlID49IDB4MjApIHtcbiAgICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKDB4MjAgfCAoY29vcmRpbmF0ZSAmIDB4MWYpKSArIDYzKTtcbiAgICAgICAgY29vcmRpbmF0ZSA+Pj0gNTtcbiAgICB9XG4gICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29vcmRpbmF0ZSArIDYzKTtcbiAgICByZXR1cm4gb3V0cHV0O1xufVxuXG4vKipcbiAqIERlY29kZXMgdG8gYSBbbGF0aXR1ZGUsIGxvbmdpdHVkZV0gY29vcmRpbmF0ZXMgYXJyYXkuXG4gKlxuICogVGhpcyBpcyBhZGFwdGVkIGZyb20gdGhlIGltcGxlbWVudGF0aW9uIGluIFByb2plY3QtT1NSTS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge051bWJlcn0gcHJlY2lzaW9uXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vUHJvamVjdC1PU1JNL29zcm0tZnJvbnRlbmQvYmxvYi9tYXN0ZXIvV2ViQ29udGVudC9yb3V0aW5nL09TUk0uUm91dGluZ0dlb21ldHJ5LmpzXG4gKi9cbnBvbHlsaW5lLmRlY29kZSA9IGZ1bmN0aW9uKHN0ciwgcHJlY2lzaW9uKSB7XG4gICAgdmFyIGluZGV4ID0gMCxcbiAgICAgICAgbGF0ID0gMCxcbiAgICAgICAgbG5nID0gMCxcbiAgICAgICAgY29vcmRpbmF0ZXMgPSBbXSxcbiAgICAgICAgc2hpZnQgPSAwLFxuICAgICAgICByZXN1bHQgPSAwLFxuICAgICAgICBieXRlID0gbnVsbCxcbiAgICAgICAgbGF0aXR1ZGVfY2hhbmdlLFxuICAgICAgICBsb25naXR1ZGVfY2hhbmdlLFxuICAgICAgICBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDUpO1xuXG4gICAgLy8gQ29vcmRpbmF0ZXMgaGF2ZSB2YXJpYWJsZSBsZW5ndGggd2hlbiBlbmNvZGVkLCBzbyBqdXN0IGtlZXBcbiAgICAvLyB0cmFjayBvZiB3aGV0aGVyIHdlJ3ZlIGhpdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuIEluIGVhY2hcbiAgICAvLyBsb29wIGl0ZXJhdGlvbiwgYSBzaW5nbGUgY29vcmRpbmF0ZSBpcyBkZWNvZGVkLlxuICAgIHdoaWxlIChpbmRleCA8IHN0ci5sZW5ndGgpIHtcblxuICAgICAgICAvLyBSZXNldCBzaGlmdCwgcmVzdWx0LCBhbmQgYnl0ZVxuICAgICAgICBieXRlID0gbnVsbDtcbiAgICAgICAgc2hpZnQgPSAwO1xuICAgICAgICByZXN1bHQgPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGJ5dGUgPSBzdHIuY2hhckNvZGVBdChpbmRleCsrKSAtIDYzO1xuICAgICAgICAgICAgcmVzdWx0IHw9IChieXRlICYgMHgxZikgPDwgc2hpZnQ7XG4gICAgICAgICAgICBzaGlmdCArPSA1O1xuICAgICAgICB9IHdoaWxlIChieXRlID49IDB4MjApO1xuXG4gICAgICAgIGxhdGl0dWRlX2NoYW5nZSA9ICgocmVzdWx0ICYgMSkgPyB+KHJlc3VsdCA+PiAxKSA6IChyZXN1bHQgPj4gMSkpO1xuXG4gICAgICAgIHNoaWZ0ID0gcmVzdWx0ID0gMDtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBieXRlID0gc3RyLmNoYXJDb2RlQXQoaW5kZXgrKykgLSA2MztcbiAgICAgICAgICAgIHJlc3VsdCB8PSAoYnl0ZSAmIDB4MWYpIDw8IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgKz0gNTtcbiAgICAgICAgfSB3aGlsZSAoYnl0ZSA+PSAweDIwKTtcblxuICAgICAgICBsb25naXR1ZGVfY2hhbmdlID0gKChyZXN1bHQgJiAxKSA/IH4ocmVzdWx0ID4+IDEpIDogKHJlc3VsdCA+PiAxKSk7XG5cbiAgICAgICAgbGF0ICs9IGxhdGl0dWRlX2NoYW5nZTtcbiAgICAgICAgbG5nICs9IGxvbmdpdHVkZV9jaGFuZ2U7XG5cbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbbGF0IC8gZmFjdG9yLCBsbmcgLyBmYWN0b3JdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG59O1xuXG4vKipcbiAqIEVuY29kZXMgdGhlIGdpdmVuIFtsYXRpdHVkZSwgbG9uZ2l0dWRlXSBjb29yZGluYXRlcyBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxBcnJheS48TnVtYmVyPj59IGNvb3JkaW5hdGVzXG4gKiBAcGFyYW0ge051bWJlcn0gcHJlY2lzaW9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5wb2x5bGluZS5lbmNvZGUgPSBmdW5jdGlvbihjb29yZGluYXRlcywgcHJlY2lzaW9uKSB7XG4gICAgaWYgKCFjb29yZGluYXRlcy5sZW5ndGgpIHsgcmV0dXJuICcnOyB9XG5cbiAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiB8fCA1KSxcbiAgICAgICAgb3V0cHV0ID0gZW5jb2RlKGNvb3JkaW5hdGVzWzBdWzBdLCAwLCBmYWN0b3IpICsgZW5jb2RlKGNvb3JkaW5hdGVzWzBdWzFdLCAwLCBmYWN0b3IpO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYSA9IGNvb3JkaW5hdGVzW2ldLCBiID0gY29vcmRpbmF0ZXNbaSAtIDFdO1xuICAgICAgICBvdXRwdXQgKz0gZW5jb2RlKGFbMF0sIGJbMF0sIGZhY3Rvcik7XG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoYVsxXSwgYlsxXSwgZmFjdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuZnVuY3Rpb24gZmxpcHBlZChjb29yZHMpIHtcbiAgICB2YXIgZmxpcHBlZCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZsaXBwZWQucHVzaChjb29yZHNbaV0uc2xpY2UoKS5yZXZlcnNlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZmxpcHBlZDtcbn1cblxuLyoqXG4gKiBFbmNvZGVzIGEgR2VvSlNPTiBMaW5lU3RyaW5nIGZlYXR1cmUvZ2VvbWV0cnkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdlb2pzb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBwcmVjaXNpb25cbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbnBvbHlsaW5lLmZyb21HZW9KU09OID0gZnVuY3Rpb24oZ2VvanNvbiwgcHJlY2lzaW9uKSB7XG4gICAgaWYgKGdlb2pzb24gJiYgZ2VvanNvbi50eXBlID09PSAnRmVhdHVyZScpIHtcbiAgICAgICAgZ2VvanNvbiA9IGdlb2pzb24uZ2VvbWV0cnk7XG4gICAgfVxuICAgIGlmICghZ2VvanNvbiB8fCBnZW9qc29uLnR5cGUgIT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0IG11c3QgYmUgYSBHZW9KU09OIExpbmVTdHJpbmcnKTtcbiAgICB9XG4gICAgcmV0dXJuIHBvbHlsaW5lLmVuY29kZShmbGlwcGVkKGdlb2pzb24uY29vcmRpbmF0ZXMpLCBwcmVjaXNpb24pO1xufTtcblxuLyoqXG4gKiBEZWNvZGVzIHRvIGEgR2VvSlNPTiBMaW5lU3RyaW5nIGdlb21ldHJ5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBwcmVjaXNpb25cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbnBvbHlsaW5lLnRvR2VvSlNPTiA9IGZ1bmN0aW9uKHN0ciwgcHJlY2lzaW9uKSB7XG4gICAgdmFyIGNvb3JkcyA9IHBvbHlsaW5lLmRlY29kZShzdHIsIHByZWNpc2lvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICBjb29yZGluYXRlczogZmxpcHBlZChjb29yZHMpXG4gICAgfTtcbn07XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gcG9seWxpbmU7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG1pbihhcnJheSwgZikge1xuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGEsXG4gICAgICBiO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYjsgYnJlYWs7IH1cbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gYXJyYXlbaV0pICE9IG51bGwgJiYgYSA+IGIpIGEgPSBiO1xuICB9XG5cbiAgZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYjsgYnJlYWs7IH1cbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gZi5jYWxsKGFycmF5LCBhcnJheVtpXSwgaSkpICE9IG51bGwgJiYgYSA+IGIpIGEgPSBiO1xuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG5mdW5jdGlvbiB0cmFuc3Bvc2UkMShtYXRyaXgpIHtcbiAgaWYgKCEobiA9IG1hdHJpeC5sZW5ndGgpKSByZXR1cm4gW107XG4gIGZvciAodmFyIGkgPSAtMSwgbSA9IG1pbihtYXRyaXgsIGxlbmd0aCksIHRyYW5zcG9zZSA9IG5ldyBBcnJheShtKTsgKytpIDwgbTspIHtcbiAgICBmb3IgKHZhciBqID0gLTEsIG4sIHJvdyA9IHRyYW5zcG9zZVtpXSA9IG5ldyBBcnJheShuKTsgKytqIDwgbjspIHtcbiAgICAgIHJvd1tqXSA9IG1hdHJpeFtqXVtpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRyYW5zcG9zZTtcbn07XG5cbmZ1bmN0aW9uIGxlbmd0aChkKSB7XG4gIHJldHVybiBkLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gemlwKCkge1xuICByZXR1cm4gdHJhbnNwb3NlJDEoYXJndW1lbnRzKTtcbn07XG5cbmZ1bmN0aW9uIG51bWJlcih4KSB7XG4gIHJldHVybiB4ID09PSBudWxsID8gTmFOIDogK3g7XG59O1xuXG5mdW5jdGlvbiB2YXJpYW5jZShhcnJheSwgZikge1xuICB2YXIgbiA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIG0gPSAwLFxuICAgICAgYSxcbiAgICAgIGQsXG4gICAgICBzID0gMCxcbiAgICAgIGkgPSAtMSxcbiAgICAgIGogPSAwO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmICghaXNOYU4oYSA9IG51bWJlcihhcnJheVtpXSkpKSB7XG4gICAgICAgIGQgPSBhIC0gbTtcbiAgICAgICAgbSArPSBkIC8gKytqO1xuICAgICAgICBzICs9IGQgKiAoYSAtIG0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVsc2Uge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAoIWlzTmFOKGEgPSBudW1iZXIoZi5jYWxsKGFycmF5LCBhcnJheVtpXSwgaSkpKSkge1xuICAgICAgICBkID0gYSAtIG07XG4gICAgICAgIG0gKz0gZCAvICsrajtcbiAgICAgICAgcyArPSBkICogKGEgLSBtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaiA+IDEpIHJldHVybiBzIC8gKGogLSAxKTtcbn07XG5cbmZ1bmN0aW9uIHZhbHVlcyQxKG1hcCkge1xuICB2YXIgdmFsdWVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBtYXApIHZhbHVlcy5wdXNoKG1hcFtrZXldKTtcbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cbmZ1bmN0aW9uIHN1bShhcnJheSwgZikge1xuICB2YXIgcyA9IDAsXG4gICAgICBuID0gYXJyYXkubGVuZ3RoLFxuICAgICAgYSxcbiAgICAgIGkgPSAtMTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWlzTmFOKGEgPSArYXJyYXlbaV0pKSBzICs9IGE7IC8vIE5vdGU6IHplcm8gYW5kIG51bGwgYXJlIGVxdWl2YWxlbnQuXG4gIH1cblxuICBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFpc05hTihhID0gK2YuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSkgcyArPSBhO1xuICB9XG5cbiAgcmV0dXJuIHM7XG59O1xuXG5mdW5jdGlvbiBzaHVmZmxlKGFycmF5LCBpMCwgaTEpIHtcbiAgaWYgKChtID0gYXJndW1lbnRzLmxlbmd0aCkgPCAzKSB7XG4gICAgaTEgPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKG0gPCAyKSBpMCA9IDA7XG4gIH1cblxuICB2YXIgbSA9IGkxIC0gaTAsXG4gICAgICB0LFxuICAgICAgaTtcblxuICB3aGlsZSAobSkge1xuICAgIGkgPSBNYXRoLnJhbmRvbSgpICogbS0tIHwgMDtcbiAgICB0ID0gYXJyYXlbbSArIGkwXTtcbiAgICBhcnJheVttICsgaTBdID0gYXJyYXlbaSArIGkwXTtcbiAgICBhcnJheVtpICsgaTBdID0gdDtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn07XG5cbnZhciBwcmVmaXggPSBcIiRcIjtcblxuZnVuY3Rpb24gTWFwKCkge31cblxuTWFwLnByb3RvdHlwZSA9IG1hcC5wcm90b3R5cGUgPSB7XG4gIGhhczogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIChwcmVmaXggKyBrZXkpIGluIHRoaXM7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXNbcHJlZml4ICsga2V5XTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXNbcHJlZml4ICsga2V5XSA9IHZhbHVlO1xuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBwcm9wZXJ0eSA9IHByZWZpeCArIGtleTtcbiAgICByZXR1cm4gcHJvcGVydHkgaW4gdGhpcyAmJiBkZWxldGUgdGhpc1twcm9wZXJ0eV07XG4gIH0sXG4gIGtleXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykgaWYgKHByb3BlcnR5WzBdID09PSBwcmVmaXgpIGtleXMucHVzaChwcm9wZXJ0eS5zbGljZSgxKSk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH0sXG4gIHZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIGlmIChwcm9wZXJ0eVswXSA9PT0gcHJlZml4KSB2YWx1ZXMucHVzaCh0aGlzW3Byb3BlcnR5XSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSxcbiAgZW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSBpZiAocHJvcGVydHlbMF0gPT09IHByZWZpeCkgZW50cmllcy5wdXNoKHtrZXk6IHByb3BlcnR5LnNsaWNlKDEpLCB2YWx1ZTogdGhpc1twcm9wZXJ0eV19KTtcbiAgICByZXR1cm4gZW50cmllcztcbiAgfSxcbiAgc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNpemUgPSAwO1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIGlmIChwcm9wZXJ0eVswXSA9PT0gcHJlZml4KSArK3NpemU7XG4gICAgcmV0dXJuIHNpemU7XG4gIH0sXG4gIGVtcHR5OiBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSBpZiAocHJvcGVydHlbMF0gPT09IHByZWZpeCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBmb3JFYWNoOiBmdW5jdGlvbihmKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykgaWYgKHByb3BlcnR5WzBdID09PSBwcmVmaXgpIGYuY2FsbCh0aGlzLCBwcm9wZXJ0eS5zbGljZSgxKSwgdGhpc1twcm9wZXJ0eV0pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBtYXAob2JqZWN0LCBmKSB7XG4gIHZhciBtYXAgPSBuZXcgTWFwO1xuXG4gIC8vIENvcHkgY29uc3RydWN0b3IuXG4gIGlmIChvYmplY3QgaW5zdGFuY2VvZiBNYXApIG9iamVjdC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgbWFwLnNldChrZXksIHZhbHVlKTsgfSk7XG5cbiAgLy8gSW5kZXggYXJyYXkgYnkgbnVtZXJpYyBpbmRleCBvciBzcGVjaWZpZWQga2V5IGZ1bmN0aW9uLlxuICBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcbiAgICB2YXIgaSA9IC0xLFxuICAgICAgICBuID0gb2JqZWN0Lmxlbmd0aCxcbiAgICAgICAgbztcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB3aGlsZSAoKytpIDwgbikgbWFwLnNldChpLCBvYmplY3RbaV0pO1xuICAgIGVsc2Ugd2hpbGUgKCsraSA8IG4pIG1hcC5zZXQoZi5jYWxsKG9iamVjdCwgbyA9IG9iamVjdFtpXSwgaSksIG8pO1xuICB9XG5cbiAgLy8gQ29udmVydCBvYmplY3QgdG8gbWFwLlxuICBlbHNlIGZvciAodmFyIGtleSBpbiBvYmplY3QpIG1hcC5zZXQoa2V5LCBvYmplY3Rba2V5XSk7XG5cbiAgcmV0dXJuIG1hcDtcbn1cblxuZnVuY3Rpb24gU2V0KCkge31cblxudmFyIHByb3RvID0gbWFwLnByb3RvdHlwZTtcblxuU2V0LnByb3RvdHlwZSA9IHNldC5wcm90b3R5cGUgPSB7XG4gIGhhczogcHJvdG8uaGFzLFxuICBhZGQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFsdWUgKz0gXCJcIjtcbiAgICB0aGlzW3ByZWZpeCArIHZhbHVlXSA9IHRydWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICByZW1vdmU6IHByb3RvLnJlbW92ZSxcbiAgdmFsdWVzOiBwcm90by5rZXlzLFxuICBzaXplOiBwcm90by5zaXplLFxuICBlbXB0eTogcHJvdG8uZW1wdHksXG4gIGZvckVhY2g6IGZ1bmN0aW9uKGYpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSBpZiAocHJvcGVydHlbMF0gPT09IHByZWZpeCkgZi5jYWxsKHRoaXMsIHByb3BlcnR5LnNsaWNlKDEpKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0KGFycmF5KSB7XG4gIHZhciBzZXQgPSBuZXcgU2V0O1xuICBpZiAoYXJyYXkpIGZvciAodmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgKytpKSBzZXQuYWRkKGFycmF5W2ldKTtcbiAgcmV0dXJuIHNldDtcbn1cblxuZnVuY3Rpb24gcmFuZ2UkMShzdGFydCwgc3RvcCwgc3RlcCkge1xuICBpZiAoKG4gPSBhcmd1bWVudHMubGVuZ3RoKSA8IDMpIHtcbiAgICBzdGVwID0gMTtcbiAgICBpZiAobiA8IDIpIHtcbiAgICAgIHN0b3AgPSBzdGFydDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gIH1cblxuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IE1hdGgubWF4KDAsIE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApKSB8IDAsXG4gICAgICByYW5nZSA9IG5ldyBBcnJheShuKTtcblxuICB3aGlsZSAoKytpIDwgbikge1xuICAgIHJhbmdlW2ldID0gc3RhcnQgKyBpICogc3RlcDtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn07XG5cbi8vIFItNyBwZXIgPGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUXVhbnRpbGU+XG5mdW5jdGlvbiBxdWFudGlsZSh2YWx1ZXMsIHApIHtcbiAgdmFyIEggPSAodmFsdWVzLmxlbmd0aCAtIDEpICogcCArIDEsXG4gICAgICBoID0gTWF0aC5mbG9vcihIKSxcbiAgICAgIHYgPSArdmFsdWVzW2ggLSAxXSxcbiAgICAgIGUgPSBIIC0gaDtcbiAgcmV0dXJuIGUgPyB2ICsgZSAqICh2YWx1ZXNbaF0gLSB2KSA6IHY7XG59O1xuXG5mdW5jdGlvbiBwZXJtdXRlKGFycmF5LCBpbmRleGVzKSB7XG4gIHZhciBpID0gaW5kZXhlcy5sZW5ndGgsIHBlcm11dGVzID0gbmV3IEFycmF5KGkpO1xuICB3aGlsZSAoaS0tKSBwZXJtdXRlc1tpXSA9IGFycmF5W2luZGV4ZXNbaV1dO1xuICByZXR1cm4gcGVybXV0ZXM7XG59O1xuXG5mdW5jdGlvbiBwYWlycyQxKGFycmF5KSB7XG4gIHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aCAtIDEsIHAwLCBwMSA9IGFycmF5WzBdLCBwYWlycyA9IG5ldyBBcnJheShuIDwgMCA/IDAgOiBuKTtcbiAgd2hpbGUgKGkgPCBuKSBwYWlyc1tpXSA9IFtwMCA9IHAxLCBwMSA9IGFycmF5WysraV1dO1xuICByZXR1cm4gcGFpcnM7XG59O1xuXG5mdW5jdGlvbiBuZXN0JDEoKSB7XG4gIHZhciBrZXlzID0gW10sXG4gICAgICBzb3J0S2V5cyA9IFtdLFxuICAgICAgc29ydFZhbHVlcyxcbiAgICAgIHJvbGx1cCxcbiAgICAgIG5lc3Q7XG5cbiAgZnVuY3Rpb24gYXBwbHkoYXJyYXksIGRlcHRoLCBjcmVhdGVSZXN1bHQsIHNldFJlc3VsdCkge1xuICAgIGlmIChkZXB0aCA+PSBrZXlzLmxlbmd0aCkgcmV0dXJuIHJvbGx1cFxuICAgICAgICA/IHJvbGx1cC5jYWxsKG5lc3QsIGFycmF5KSA6IChzb3J0VmFsdWVzXG4gICAgICAgID8gYXJyYXkuc29ydChzb3J0VmFsdWVzKVxuICAgICAgICA6IGFycmF5KTtcblxuICAgIHZhciBpID0gLTEsXG4gICAgICAgIG4gPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIGtleSA9IGtleXNbZGVwdGgrK10sXG4gICAgICAgIGtleVZhbHVlLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgdmFsdWVzQnlLZXkgPSBtYXAoKSxcbiAgICAgICAgdmFsdWVzLFxuICAgICAgICByZXN1bHQgPSBjcmVhdGVSZXN1bHQoKTtcblxuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAodmFsdWVzID0gdmFsdWVzQnlLZXkuZ2V0KGtleVZhbHVlID0ga2V5KHZhbHVlID0gYXJyYXlbaV0pICsgXCJcIikpIHtcbiAgICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzQnlLZXkuc2V0KGtleVZhbHVlLCBbdmFsdWVdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YWx1ZXNCeUtleS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWVzKSB7XG4gICAgICBzZXRSZXN1bHQocmVzdWx0LCBrZXksIGFwcGx5KHZhbHVlcywgZGVwdGgsIGNyZWF0ZVJlc3VsdCwgc2V0UmVzdWx0KSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZW50cmllcyhtYXAsIGRlcHRoKSB7XG4gICAgaWYgKGRlcHRoID49IGtleXMubGVuZ3RoKSByZXR1cm4gbWFwO1xuXG4gICAgdmFyIGFycmF5ID0gW10sXG4gICAgICAgIHNvcnRLZXkgPSBzb3J0S2V5c1tkZXB0aCsrXTtcblxuICAgIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIGFycmF5LnB1c2goe2tleToga2V5LCB2YWx1ZXM6IGVudHJpZXModmFsdWUsIGRlcHRoKX0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNvcnRLZXlcbiAgICAgICAgPyBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIHNvcnRLZXkoYS5rZXksIGIua2V5KTsgfSlcbiAgICAgICAgOiBhcnJheTtcbiAgfVxuXG4gIHJldHVybiBuZXN0ID0ge1xuICAgIG9iamVjdDogZnVuY3Rpb24oYXJyYXkpIHsgcmV0dXJuIGFwcGx5KGFycmF5LCAwLCBjcmVhdGVPYmplY3QsIHNldE9iamVjdCk7IH0sXG4gICAgbWFwOiBmdW5jdGlvbihhcnJheSkgeyByZXR1cm4gYXBwbHkoYXJyYXksIDAsIGNyZWF0ZU1hcCwgc2V0TWFwKTsgfSxcbiAgICBlbnRyaWVzOiBmdW5jdGlvbihhcnJheSkgeyByZXR1cm4gZW50cmllcyhhcHBseShhcnJheSwgMCwgY3JlYXRlTWFwLCBzZXRNYXApLCAwKTsgfSxcbiAgICBrZXk6IGZ1bmN0aW9uKGQpIHsga2V5cy5wdXNoKGQpOyByZXR1cm4gbmVzdDsgfSxcbiAgICBzb3J0S2V5czogZnVuY3Rpb24ob3JkZXIpIHsgc29ydEtleXNba2V5cy5sZW5ndGggLSAxXSA9IG9yZGVyOyByZXR1cm4gbmVzdDsgfSxcbiAgICBzb3J0VmFsdWVzOiBmdW5jdGlvbihvcmRlcikgeyBzb3J0VmFsdWVzID0gb3JkZXI7IHJldHVybiBuZXN0OyB9LFxuICAgIHJvbGx1cDogZnVuY3Rpb24oZikgeyByb2xsdXAgPSBmOyByZXR1cm4gbmVzdDsgfVxuICB9O1xufTtcblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0KCkge1xuICByZXR1cm4ge307XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWFwKCkge1xuICByZXR1cm4gbWFwKCk7XG59XG5cbmZ1bmN0aW9uIHNldE1hcChtYXAsIGtleSwgdmFsdWUpIHtcbiAgbWFwLnNldChrZXksIHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2UoYXJyYXlzKSB7XG4gIHZhciBuID0gYXJyYXlzLmxlbmd0aCxcbiAgICAgIG0sXG4gICAgICBpID0gLTEsXG4gICAgICBqID0gMCxcbiAgICAgIG1lcmdlZCxcbiAgICAgIGFycmF5O1xuXG4gIHdoaWxlICgrK2kgPCBuKSBqICs9IGFycmF5c1tpXS5sZW5ndGg7XG4gIG1lcmdlZCA9IG5ldyBBcnJheShqKTtcblxuICB3aGlsZSAoLS1uID49IDApIHtcbiAgICBhcnJheSA9IGFycmF5c1tuXTtcbiAgICBtID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlICgtLW0gPj0gMCkge1xuICAgICAgbWVyZ2VkWy0tal0gPSBhcnJheVttXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWVyZ2VkO1xufTtcblxuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufTtcblxuZnVuY3Rpb24gbWVkaWFuKGFycmF5LCBmKSB7XG4gIHZhciBudW1iZXJzID0gW10sXG4gICAgICBuID0gYXJyYXkubGVuZ3RoLFxuICAgICAgYSxcbiAgICAgIGkgPSAtMTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWlzTmFOKGEgPSBudW1iZXIoYXJyYXlbaV0pKSkgbnVtYmVycy5wdXNoKGEpO1xuICB9XG5cbiAgZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICghaXNOYU4oYSA9IG51bWJlcihmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkpKSBudW1iZXJzLnB1c2goYSk7XG4gIH1cblxuICBpZiAobnVtYmVycy5sZW5ndGgpIHJldHVybiBxdWFudGlsZShudW1iZXJzLnNvcnQoYXNjZW5kaW5nKSwgLjUpO1xufTtcblxuZnVuY3Rpb24gbWVhbihhcnJheSwgZikge1xuICB2YXIgcyA9IDAsXG4gICAgICBuID0gYXJyYXkubGVuZ3RoLFxuICAgICAgYSxcbiAgICAgIGkgPSAtMSxcbiAgICAgIGogPSBuO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICghaXNOYU4oYSA9IG51bWJlcihhcnJheVtpXSkpKSBzICs9IGE7IGVsc2UgLS1qO1xuICB9XG5cbiAgZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICghaXNOYU4oYSA9IG51bWJlcihmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkpKSBzICs9IGE7IGVsc2UgLS1qO1xuICB9XG5cbiAgaWYgKGopIHJldHVybiBzIC8gajtcbn07XG5cbmZ1bmN0aW9uIG1heChhcnJheSwgZikge1xuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGEsXG4gICAgICBiO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYjsgYnJlYWs7IH1cbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gYXJyYXlbaV0pICE9IG51bGwgJiYgYiA+IGEpIGEgPSBiO1xuICB9XG5cbiAgZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYjsgYnJlYWs7IH1cbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gZi5jYWxsKGFycmF5LCBhcnJheVtpXSwgaSkpICE9IG51bGwgJiYgYiA+IGEpIGEgPSBiO1xuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG5mdW5jdGlvbiBrZXlzKG1hcCkge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gbWFwKSBrZXlzLnB1c2goa2V5KTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG5mdW5jdGlvbiBleHRlbnQoYXJyYXksIGYpIHtcbiAgdmFyIGkgPSAtMSxcbiAgICAgIG4gPSBhcnJheS5sZW5ndGgsXG4gICAgICBhLFxuICAgICAgYixcbiAgICAgIGM7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gYXJyYXlbaV0pICE9IG51bGwgJiYgYiA+PSBiKSB7IGEgPSBjID0gYjsgYnJlYWs7IH1cbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gYXJyYXlbaV0pICE9IG51bGwpIHtcbiAgICAgIGlmIChhID4gYikgYSA9IGI7XG4gICAgICBpZiAoYyA8IGIpIGMgPSBiO1xuICAgIH1cbiAgfVxuXG4gIGVsc2Uge1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkgIT0gbnVsbCAmJiBiID49IGIpIHsgYSA9IGMgPSBiOyBicmVhazsgfVxuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkgIT0gbnVsbCkge1xuICAgICAgaWYgKGEgPiBiKSBhID0gYjtcbiAgICAgIGlmIChjIDwgYikgYyA9IGI7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFthLCBjXTtcbn07XG5cbmZ1bmN0aW9uIGVudHJpZXMobWFwKSB7XG4gIHZhciBlbnRyaWVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBtYXApIGVudHJpZXMucHVzaCh7a2V5OiBrZXksIHZhbHVlOiBtYXBba2V5XX0pO1xuICByZXR1cm4gZW50cmllcztcbn07XG5cbmZ1bmN0aW9uIGRldmlhdGlvbigpIHtcbiAgdmFyIHYgPSB2YXJpYW5jZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdiA/IE1hdGguc3FydCh2KSA6IHY7XG59O1xuXG5mdW5jdGlvbiBkZXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGIgPCBhID8gLTEgOiBiID4gYSA/IDEgOiBiID49IGEgPyAwIDogTmFOO1xufTtcblxuZnVuY3Rpb24gYmlzZWN0b3IoY29tcGFyZSkge1xuICBpZiAoY29tcGFyZS5sZW5ndGggPT09IDEpIGNvbXBhcmUgPSBhc2NlbmRpbmdDb21wYXJhdG9yKGNvbXBhcmUpO1xuICByZXR1cm4ge1xuICAgIGxlZnQ6IGZ1bmN0aW9uKGEsIHgsIGxvLCBoaSkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBsbyA9IDA7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIGhpID0gYS5sZW5ndGg7XG4gICAgICB3aGlsZSAobG8gPCBoaSkge1xuICAgICAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICAgICAgaWYgKGNvbXBhcmUoYVttaWRdLCB4KSA8IDApIGxvID0gbWlkICsgMTtcbiAgICAgICAgZWxzZSBoaSA9IG1pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsbztcbiAgICB9LFxuICAgIHJpZ2h0OiBmdW5jdGlvbihhLCB4LCBsbywgaGkpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgbG8gPSAwO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCA0KSBoaSA9IGEubGVuZ3RoO1xuICAgICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgIGlmIChjb21wYXJlKGFbbWlkXSwgeCkgPiAwKSBoaSA9IG1pZDtcbiAgICAgICAgZWxzZSBsbyA9IG1pZCArIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbG87XG4gICAgfVxuICB9O1xufTtcblxuZnVuY3Rpb24gYXNjZW5kaW5nQ29tcGFyYXRvcihmKSB7XG4gIHJldHVybiBmdW5jdGlvbihkLCB4KSB7XG4gICAgcmV0dXJuIGFzY2VuZGluZyhmKGQpLCB4KTtcbiAgfTtcbn1cblxudmFyIGFzY2VuZGluZ0Jpc2VjdCA9IGJpc2VjdG9yKGFzY2VuZGluZyk7XG52YXIgYmlzZWN0UmlnaHQgPSBhc2NlbmRpbmdCaXNlY3QucmlnaHQ7XG52YXIgYmlzZWN0TGVmdCA9IGFzY2VuZGluZ0Jpc2VjdC5sZWZ0O1xuXG5leHBvcnRzLmFzY2VuZGluZyA9IGFzY2VuZGluZztcbmV4cG9ydHMuYmlzZWN0ID0gYmlzZWN0UmlnaHQ7XG5leHBvcnRzLmJpc2VjdExlZnQgPSBiaXNlY3RMZWZ0O1xuZXhwb3J0cy5iaXNlY3RSaWdodCA9IGJpc2VjdFJpZ2h0O1xuZXhwb3J0cy5iaXNlY3RvciA9IGJpc2VjdG9yO1xuZXhwb3J0cy5kZXNjZW5kaW5nID0gZGVzY2VuZGluZztcbmV4cG9ydHMuZGV2aWF0aW9uID0gZGV2aWF0aW9uO1xuZXhwb3J0cy5lbnRyaWVzID0gZW50cmllcztcbmV4cG9ydHMuZXh0ZW50ID0gZXh0ZW50O1xuZXhwb3J0cy5rZXlzID0ga2V5cztcbmV4cG9ydHMubWFwID0gbWFwO1xuZXhwb3J0cy5tYXggPSBtYXg7XG5leHBvcnRzLm1lYW4gPSBtZWFuO1xuZXhwb3J0cy5tZWRpYW4gPSBtZWRpYW47XG5leHBvcnRzLm1lcmdlID0gbWVyZ2U7XG5leHBvcnRzLm1pbiA9IG1pbjtcbmV4cG9ydHMubmVzdCA9IG5lc3QkMTtcbmV4cG9ydHMucGFpcnMgPSBwYWlycyQxO1xuZXhwb3J0cy5wZXJtdXRlID0gcGVybXV0ZTtcbmV4cG9ydHMucXVhbnRpbGUgPSBxdWFudGlsZTtcbmV4cG9ydHMucmFuZ2UgPSByYW5nZSQxO1xuZXhwb3J0cy5zZXQgPSBzZXQ7XG5leHBvcnRzLnNodWZmbGUgPSBzaHVmZmxlO1xuZXhwb3J0cy5zdW0gPSBzdW07XG5leHBvcnRzLnRyYW5zcG9zZSA9IHRyYW5zcG9zZSQxO1xuZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXMkMTtcbmV4cG9ydHMudmFyaWFuY2UgPSB2YXJpYW5jZTtcbmV4cG9ydHMuemlwID0gemlwOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzQXJyYXlzID0gcmVxdWlyZSgnZDMtYXJyYXlzJyk7XG52YXIgZDNEaXNwYXRjaCA9IHJlcXVpcmUoJ2QzLWRpc3BhdGNoJyk7XG52YXIgZDNEc3YgPSByZXF1aXJlKCdkMy1kc3YnKTtcblxuZnVuY3Rpb24geGhyKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHhocixcbiAgICAgIGV2ZW50ID0gZDNEaXNwYXRjaC5kaXNwYXRjaChcImJlZm9yZXNlbmRcIiwgXCJwcm9ncmVzc1wiLCBcImxvYWRcIiwgXCJlcnJvclwiKSxcbiAgICAgIG1pbWVUeXBlLFxuICAgICAgaGVhZGVycyA9IGQzQXJyYXlzLm1hcCgpLFxuICAgICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlLFxuICAgICAgcmVzcG9uc2VUeXBlO1xuXG4gIC8vIElmIElFIGRvZXMgbm90IHN1cHBvcnQgQ09SUywgdXNlIFhEb21haW5SZXF1ZXN0LlxuICBpZiAodHlwZW9mIFhEb21haW5SZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICAmJiAhKFwid2l0aENyZWRlbnRpYWxzXCIgaW4gcmVxdWVzdClcbiAgICAgICYmIC9eKGh0dHAocyk/Oik/XFwvXFwvLy50ZXN0KHVybCkpIHJlcXVlc3QgPSBuZXcgWERvbWFpblJlcXVlc3Q7XG5cbiAgXCJvbmxvYWRcIiBpbiByZXF1ZXN0XG4gICAgICA/IHJlcXVlc3Qub25sb2FkID0gcmVxdWVzdC5vbmVycm9yID0gcmVzcG9uZFxuICAgICAgOiByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkgeyByZXF1ZXN0LnJlYWR5U3RhdGUgPiAzICYmIHJlc3BvbmQoKTsgfTtcblxuICBmdW5jdGlvbiByZXNwb25kKCkge1xuICAgIHZhciBzdGF0dXMgPSByZXF1ZXN0LnN0YXR1cywgcmVzdWx0O1xuICAgIGlmICghc3RhdHVzICYmIGhhc1Jlc3BvbnNlKHJlcXVlc3QpXG4gICAgICAgIHx8IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwXG4gICAgICAgIHx8IHN0YXR1cyA9PT0gMzA0KSB7XG4gICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXN1bHQgPSByZXNwb25zZS5jYWxsKHhociwgcmVxdWVzdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBldmVudC5lcnJvci5jYWxsKHhociwgZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSByZXF1ZXN0O1xuICAgICAgfVxuICAgICAgZXZlbnQubG9hZC5jYWxsKHhociwgcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQuZXJyb3IuY2FsbCh4aHIsIHJlcXVlc3QpO1xuICAgIH1cbiAgfVxuXG4gIHJlcXVlc3Qub25wcm9ncmVzcyA9IGZ1bmN0aW9uKGUpIHtcbiAgICBldmVudC5wcm9ncmVzcy5jYWxsKHhociwgZSk7XG4gIH07XG5cbiAgeGhyID0ge1xuICAgIGhlYWRlcjogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICAgIG5hbWUgPSAobmFtZSArIFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHJldHVybiBoZWFkZXJzLmdldChuYW1lKTtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSBoZWFkZXJzLnJlbW92ZShuYW1lKTtcbiAgICAgIGVsc2UgaGVhZGVycy5zZXQobmFtZSwgdmFsdWUgKyBcIlwiKTtcbiAgICAgIHJldHVybiB4aHI7XG4gICAgfSxcblxuICAgIC8vIElmIG1pbWVUeXBlIGlzIG5vbi1udWxsIGFuZCBubyBBY2NlcHQgaGVhZGVyIGlzIHNldCwgYSBkZWZhdWx0IGlzIHVzZWQuXG4gICAgbWltZVR5cGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBtaW1lVHlwZTtcbiAgICAgIG1pbWVUeXBlID0gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiB2YWx1ZSArIFwiXCI7XG4gICAgICByZXR1cm4geGhyO1xuICAgIH0sXG5cbiAgICAvLyBTcGVjaWZpZXMgd2hhdCB0eXBlIHRoZSByZXNwb25zZSB2YWx1ZSBzaG91bGQgdGFrZTtcbiAgICAvLyBmb3IgaW5zdGFuY2UsIGFycmF5YnVmZmVyLCBibG9iLCBkb2N1bWVudCwgb3IgdGV4dC5cbiAgICByZXNwb25zZVR5cGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByZXNwb25zZVR5cGU7XG4gICAgICByZXNwb25zZVR5cGUgPSB2YWx1ZTtcbiAgICAgIHJldHVybiB4aHI7XG4gICAgfSxcblxuICAgIC8vIFNwZWNpZnkgaG93IHRvIGNvbnZlcnQgdGhlIHJlc3BvbnNlIGNvbnRlbnQgdG8gYSBzcGVjaWZpYyB0eXBlO1xuICAgIC8vIGNoYW5nZXMgdGhlIGNhbGxiYWNrIHZhbHVlIG9uIFwibG9hZFwiIGV2ZW50cy5cbiAgICByZXNwb25zZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJlc3BvbnNlID0gdmFsdWU7XG4gICAgICByZXR1cm4geGhyO1xuICAgIH0sXG5cbiAgICAvLyBBbGlhcyBmb3Igc2VuZChcIkdFVFwiLCDigKYpLlxuICAgIGdldDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB4aHIuc2VuZChcIkdFVFwiLCBkYXRhLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8vIEFsaWFzIGZvciBzZW5kKFwiUE9TVFwiLCDigKYpLlxuICAgIHBvc3Q6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4geGhyLnNlbmQoXCJQT1NUXCIsIGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLy8gSWYgY2FsbGJhY2sgaXMgbm9uLW51bGwsIGl0IHdpbGwgYmUgdXNlZCBmb3IgZXJyb3IgYW5kIGxvYWQgZXZlbnRzLlxuICAgIHNlbmQ6IGZ1bmN0aW9uKG1ldGhvZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIGlmICghY2FsbGJhY2sgJiYgdHlwZW9mIGRhdGEgPT09IFwiZnVuY3Rpb25cIikgY2FsbGJhY2sgPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgICAgIGlmIChjYWxsYmFjayAmJiBjYWxsYmFjay5sZW5ndGggPT09IDEpIGNhbGxiYWNrID0gZml4Q2FsbGJhY2soY2FsbGJhY2spO1xuICAgICAgcmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgIGlmIChtaW1lVHlwZSAhPSBudWxsICYmICFoZWFkZXJzLmhhcyhcImFjY2VwdFwiKSkgaGVhZGVycy5zZXQoXCJhY2NlcHRcIiwgbWltZVR5cGUgKyBcIiwqLypcIik7XG4gICAgICBpZiAocmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKSBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24obmFtZSwgdmFsdWUpIHsgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKTsgfSk7XG4gICAgICBpZiAobWltZVR5cGUgIT0gbnVsbCAmJiByZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUpIHJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZShtaW1lVHlwZSk7XG4gICAgICBpZiAocmVzcG9uc2VUeXBlICE9IG51bGwpIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlO1xuICAgICAgaWYgKGNhbGxiYWNrKSB4aHIub24oXCJlcnJvclwiLCBjYWxsYmFjaykub24oXCJsb2FkXCIsIGZ1bmN0aW9uKHJlcXVlc3QpIHsgY2FsbGJhY2sobnVsbCwgcmVxdWVzdCk7IH0pO1xuICAgICAgZXZlbnQuYmVmb3Jlc2VuZC5jYWxsKHhociwgcmVxdWVzdCk7XG4gICAgICByZXF1ZXN0LnNlbmQoZGF0YSA9PSBudWxsID8gbnVsbCA6IGRhdGEpO1xuICAgICAgcmV0dXJuIHhocjtcbiAgICB9LFxuXG4gICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgcmV0dXJuIHhocjtcbiAgICB9LFxuXG4gICAgb246IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gZXZlbnQub24uYXBwbHkoZXZlbnQsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IGV2ZW50ID8geGhyIDogdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBjYWxsYmFja1xuICAgICAgPyB4aHIuZ2V0KGNhbGxiYWNrKVxuICAgICAgOiB4aHI7XG59O1xuXG5mdW5jdGlvbiBmaXhDYWxsYmFjayhjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24oZXJyb3IsIHJlcXVlc3QpIHtcbiAgICBjYWxsYmFjayhlcnJvciA9PSBudWxsID8gcmVxdWVzdCA6IG51bGwpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBoYXNSZXNwb25zZShyZXF1ZXN0KSB7XG4gIHZhciB0eXBlID0gcmVxdWVzdC5yZXNwb25zZVR5cGU7XG4gIHJldHVybiB0eXBlICYmIHR5cGUgIT09IFwidGV4dFwiXG4gICAgICA/IHJlcXVlc3QucmVzcG9uc2UgLy8gbnVsbCBvbiBlcnJvclxuICAgICAgOiByZXF1ZXN0LnJlc3BvbnNlVGV4dDsgLy8gXCJcIiBvbiBlcnJvclxufVxuXG5mdW5jdGlvbiB4aHJEc3YoZGVmYXVsdE1pbWVUeXBlLCBkc3YpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHVybCwgcm93LCBjYWxsYmFjaykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgY2FsbGJhY2sgPSByb3csIHJvdyA9IG51bGw7XG4gICAgdmFyIHIgPSB4aHIodXJsKS5taW1lVHlwZShkZWZhdWx0TWltZVR5cGUpO1xuICAgIHIucm93ID0gZnVuY3Rpb24oXykgeyByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IHIucmVzcG9uc2UocmVzcG9uc2VPZihkc3YsIHJvdyA9IF8pKSA6IHJvdzsgfTtcbiAgICByLnJvdyhyb3cpO1xuICAgIHJldHVybiBjYWxsYmFjayA/IHIuZ2V0KGNhbGxiYWNrKSA6IHI7XG4gIH07XG59O1xuXG5mdW5jdGlvbiByZXNwb25zZU9mKGRzdiwgcm93KSB7XG4gIHJldHVybiBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIGRzdi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCwgcm93KTtcbiAgfTtcbn1cblxudmFyIHRzdiA9IHhockRzdihcInRleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXNcIiwgZDNEc3YudHN2KTtcblxudmFyIGNzdiA9IHhockRzdihcInRleHQvY3N2XCIsIGQzRHN2LmNzdik7XG5cbmZ1bmN0aW9uIHhoclR5cGUoZGVmYXVsdE1pbWVUeXBlLCByZXNwb25zZSkge1xuICByZXR1cm4gZnVuY3Rpb24odXJsLCBjYWxsYmFjaykge1xuICAgIHZhciByID0geGhyKHVybCkubWltZVR5cGUoZGVmYXVsdE1pbWVUeXBlKS5yZXNwb25zZShyZXNwb25zZSk7XG4gICAgcmV0dXJuIGNhbGxiYWNrID8gci5nZXQoY2FsbGJhY2spIDogcjtcbiAgfTtcbn07XG5cbnZhciB4bWwgPSB4aHJUeXBlKFwiYXBwbGljYXRpb24veG1sXCIsIGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgcmV0dXJuIHJlcXVlc3QucmVzcG9uc2VYTUw7XG59KTtcblxudmFyIHRleHQgPSB4aHJUeXBlKFwidGV4dC9wbGFpblwiLCBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gIHJldHVybiByZXF1ZXN0LnJlc3BvbnNlVGV4dDtcbn0pO1xuXG52YXIganNvbiA9IHhoclR5cGUoXCJhcHBsaWNhdGlvbi9qc29uXCIsIGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xufSk7XG5cbnZhciBodG1sID0geGhyVHlwZShcInRleHQvaHRtbFwiLCBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG59KTtcblxuZXhwb3J0cy54aHIgPSB4aHI7XG5leHBvcnRzLmh0bWwgPSBodG1sO1xuZXhwb3J0cy5qc29uID0ganNvbjtcbmV4cG9ydHMudGV4dCA9IHRleHQ7XG5leHBvcnRzLnhtbCA9IHhtbDtcbmV4cG9ydHMuY3N2ID0gY3N2O1xuZXhwb3J0cy50c3YgPSB0c3Y7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIChmYWN0b3J5KChnbG9iYWwuZDNfZGlzcGF0Y2ggPSB7fSkpKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICAgIHJldHVybiBuZXcgRGlzcGF0Y2goYXJndW1lbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIERpc3BhdGNoKHR5cGVzKSB7XG4gICAgdmFyIGkgPSAtMSxcbiAgICAgICAgbiA9IHR5cGVzLmxlbmd0aCxcbiAgICAgICAgY2FsbGJhY2tzQnlUeXBlID0ge30sXG4gICAgICAgIGNhbGxiYWNrQnlOYW1lID0ge30sXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhhdC5vbiA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICB0eXBlID0gcGFyc2VUeXBlKHR5cGUpO1xuXG4gICAgICAvLyBSZXR1cm4gdGhlIGN1cnJlbnQgY2FsbGJhY2ssIGlmIGFueS5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gKGNhbGxiYWNrID0gY2FsbGJhY2tCeU5hbWVbdHlwZS5uYW1lXSkgJiYgY2FsbGJhY2sudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGEgdHlwZSB3YXMgc3BlY2lmaWVk4oCmXG4gICAgICBpZiAodHlwZS50eXBlKSB7XG4gICAgICAgIHZhciBjYWxsYmFja3MgPSBjYWxsYmFja3NCeVR5cGVbdHlwZS50eXBlXSxcbiAgICAgICAgICAgIGNhbGxiYWNrMCA9IGNhbGxiYWNrQnlOYW1lW3R5cGUubmFtZV0sXG4gICAgICAgICAgICBpO1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgY3VycmVudCBjYWxsYmFjaywgaWYgYW55LCB1c2luZyBjb3B5LW9uLXJlbW92ZS5cbiAgICAgICAgaWYgKGNhbGxiYWNrMCkge1xuICAgICAgICAgIGNhbGxiYWNrMC52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgaSA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrMCk7XG4gICAgICAgICAgY2FsbGJhY2tzQnlUeXBlW3R5cGUudHlwZV0gPSBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCwgaSkuY29uY2F0KGNhbGxiYWNrcy5zbGljZShpICsgMSkpO1xuICAgICAgICAgIGRlbGV0ZSBjYWxsYmFja0J5TmFtZVt0eXBlLm5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRoZSBuZXcgY2FsbGJhY2ssIGlmIGFueS5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSB7dmFsdWU6IGNhbGxiYWNrfTtcbiAgICAgICAgICBjYWxsYmFja0J5TmFtZVt0eXBlLm5hbWVdID0gY2FsbGJhY2s7XG4gICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE90aGVyd2lzZSwgaWYgYSBudWxsIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIHJlbW92ZSBhbGwgY2FsbGJhY2tzIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAgICBlbHNlIGlmIChjYWxsYmFjayA9PSBudWxsKSB7XG4gICAgICAgIGZvciAodmFyIG90aGVyVHlwZSBpbiBjYWxsYmFja3NCeVR5cGUpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sgPSBjYWxsYmFja0J5TmFtZVtvdGhlclR5cGUgKyB0eXBlLm5hbWVdKSB7XG4gICAgICAgICAgICBjYWxsYmFjay52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBjYWxsYmFja3MgPSBjYWxsYmFja3NCeVR5cGVbb3RoZXJUeXBlXTtcbiAgICAgICAgICAgIGkgPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICBjYWxsYmFja3NCeVR5cGVbb3RoZXJUeXBlXSA9IGNhbGxiYWNrcy5zbGljZSgwLCBpKS5jb25jYXQoY2FsbGJhY2tzLnNsaWNlKGkgKyAxKSk7XG4gICAgICAgICAgICBkZWxldGUgY2FsbGJhY2tCeU5hbWVbY2FsbGJhY2submFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGF0O1xuICAgIH07XG5cbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgdHlwZSA9IHR5cGVzW2ldICsgXCJcIjtcbiAgICAgIGlmICghdHlwZSB8fCAodHlwZSBpbiB0aGF0KSkgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBvciBkdXBsaWNhdGUgdHlwZTogXCIgKyB0eXBlKTtcbiAgICAgIGNhbGxiYWNrc0J5VHlwZVt0eXBlXSA9IFtdO1xuICAgICAgdGhhdFt0eXBlXSA9IGFwcGxpZXIodHlwZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VUeXBlKHR5cGUpIHtcbiAgICAgIHZhciBpID0gKHR5cGUgKz0gXCJcIikuaW5kZXhPZihcIi5cIiksIG5hbWUgPSB0eXBlO1xuICAgICAgaWYgKGkgPj0gMCkgdHlwZSA9IHR5cGUuc2xpY2UoMCwgaSk7IGVsc2UgbmFtZSArPSBcIi5cIjtcbiAgICAgIGlmICh0eXBlICYmICFjYWxsYmFja3NCeVR5cGUuaGFzT3duUHJvcGVydHkodHlwZSkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICAgIHJldHVybiB7dHlwZTogdHlwZSwgbmFtZTogbmFtZX07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbGllcih0eXBlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjYWxsYmFja3MgPSBjYWxsYmFja3NCeVR5cGVbdHlwZV0sIC8vIERlZmVuc2l2ZSByZWZlcmVuY2U7IGNvcHktb24tcmVtb3ZlLlxuICAgICAgICAgICAgY2FsbGJhY2tWYWx1ZSxcbiAgICAgICAgICAgIGkgPSAtMSxcbiAgICAgICAgICAgIG4gPSBjYWxsYmFja3MubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrVmFsdWUgPSBjYWxsYmFja3NbaV0udmFsdWUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrVmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2gucHJvdG90eXBlID0gRGlzcGF0Y2gucHJvdG90eXBlO1xuXG4gIHZhciB2ZXJzaW9uID0gXCIwLjIuNlwiO1xuXG4gIGV4cG9ydHMudmVyc2lvbiA9IHZlcnNpb247XG4gIGV4cG9ydHMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcblxufSkpOyIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLmRzdiA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgZHN2ID0gZnVuY3Rpb24oZGVsaW1pdGVyKSB7XG4gICAgdmFyIHJlRm9ybWF0ID0gbmV3IFJlZ0V4cChcIltcXFwiXCIgKyBkZWxpbWl0ZXIgKyBcIlxcbl1cIiksXG4gICAgICAgIGRlbGltaXRlckNvZGUgPSBkZWxpbWl0ZXIuY2hhckNvZGVBdCgwKTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlKHRleHQsIGYpIHtcbiAgICAgIHZhciBvO1xuICAgICAgcmV0dXJuIHBhcnNlUm93cyh0ZXh0LCBmdW5jdGlvbihyb3csIGkpIHtcbiAgICAgICAgaWYgKG8pIHJldHVybiBvKHJvdywgaSAtIDEpO1xuICAgICAgICB2YXIgYSA9IG5ldyBGdW5jdGlvbihcImRcIiwgXCJyZXR1cm4ge1wiICsgcm93Lm1hcChmdW5jdGlvbihuYW1lLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5hbWUpICsgXCI6IGRbXCIgKyBpICsgXCJdXCI7XG4gICAgICAgIH0pLmpvaW4oXCIsXCIpICsgXCJ9XCIpO1xuICAgICAgICBvID0gZiA/IGZ1bmN0aW9uKHJvdywgaSkgeyByZXR1cm4gZihhKHJvdyksIGkpOyB9IDogYTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUm93cyh0ZXh0LCBmKSB7XG4gICAgICB2YXIgRU9MID0ge30sIC8vIHNlbnRpbmVsIHZhbHVlIGZvciBlbmQtb2YtbGluZVxuICAgICAgICAgIEVPRiA9IHt9LCAvLyBzZW50aW5lbCB2YWx1ZSBmb3IgZW5kLW9mLWZpbGVcbiAgICAgICAgICByb3dzID0gW10sIC8vIG91dHB1dCByb3dzXG4gICAgICAgICAgTiA9IHRleHQubGVuZ3RoLFxuICAgICAgICAgIEkgPSAwLCAvLyBjdXJyZW50IGNoYXJhY3RlciBpbmRleFxuICAgICAgICAgIG4gPSAwLCAvLyB0aGUgY3VycmVudCBsaW5lIG51bWJlclxuICAgICAgICAgIHQsIC8vIHRoZSBjdXJyZW50IHRva2VuXG4gICAgICAgICAgZW9sOyAvLyBpcyB0aGUgY3VycmVudCB0b2tlbiBmb2xsb3dlZCBieSBFT0w/XG5cbiAgICAgIGZ1bmN0aW9uIHRva2VuKCkge1xuICAgICAgICBpZiAoSSA+PSBOKSByZXR1cm4gRU9GOyAvLyBzcGVjaWFsIGNhc2U6IGVuZCBvZiBmaWxlXG4gICAgICAgIGlmIChlb2wpIHJldHVybiBlb2wgPSBmYWxzZSwgRU9MOyAvLyBzcGVjaWFsIGNhc2U6IGVuZCBvZiBsaW5lXG5cbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlOiBxdW90ZXNcbiAgICAgICAgdmFyIGogPSBJO1xuICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGopID09PSAzNCkge1xuICAgICAgICAgIHZhciBpID0gajtcbiAgICAgICAgICB3aGlsZSAoaSsrIDwgTikge1xuICAgICAgICAgICAgaWYgKHRleHQuY2hhckNvZGVBdChpKSA9PT0gMzQpIHtcbiAgICAgICAgICAgICAgaWYgKHRleHQuY2hhckNvZGVBdChpICsgMSkgIT09IDM0KSBicmVhaztcbiAgICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBJID0gaSArIDI7XG4gICAgICAgICAgdmFyIGMgPSB0ZXh0LmNoYXJDb2RlQXQoaSArIDEpO1xuICAgICAgICAgIGlmIChjID09PSAxMykge1xuICAgICAgICAgICAgZW9sID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0ZXh0LmNoYXJDb2RlQXQoaSArIDIpID09PSAxMCkgKytJO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gMTApIHtcbiAgICAgICAgICAgIGVvbCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGogKyAxLCBpKS5yZXBsYWNlKC9cIlwiL2csIFwiXFxcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbW1vbiBjYXNlOiBmaW5kIG5leHQgZGVsaW1pdGVyIG9yIG5ld2xpbmVcbiAgICAgICAgd2hpbGUgKEkgPCBOKSB7XG4gICAgICAgICAgdmFyIGMgPSB0ZXh0LmNoYXJDb2RlQXQoSSsrKSwgayA9IDE7XG4gICAgICAgICAgaWYgKGMgPT09IDEwKSBlb2wgPSB0cnVlOyAvLyBcXG5cbiAgICAgICAgICBlbHNlIGlmIChjID09PSAxMykgeyBlb2wgPSB0cnVlOyBpZiAodGV4dC5jaGFyQ29kZUF0KEkpID09PSAxMCkgKytJLCArK2s7IH0gLy8gXFxyfFxcclxcblxuICAgICAgICAgIGVsc2UgaWYgKGMgIT09IGRlbGltaXRlckNvZGUpIGNvbnRpbnVlO1xuICAgICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGosIEkgLSBrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZTogbGFzdCB0b2tlbiBiZWZvcmUgRU9GXG4gICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGopO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAoKHQgPSB0b2tlbigpKSAhPT0gRU9GKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIHdoaWxlICh0ICE9PSBFT0wgJiYgdCAhPT0gRU9GKSB7XG4gICAgICAgICAgYS5wdXNoKHQpO1xuICAgICAgICAgIHQgPSB0b2tlbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmICYmIChhID0gZihhLCBuKyspKSA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgcm93cy5wdXNoKGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQocm93cykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocm93c1swXSkpIHJldHVybiBmb3JtYXRSb3dzKHJvd3MpOyAvLyBkZXByZWNhdGVkOyB1c2UgZm9ybWF0Um93c1xuICAgICAgdmFyIGZpZWxkU2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKSwgZmllbGRzID0gW107XG5cbiAgICAgIC8vIENvbXB1dGUgdW5pcXVlIGZpZWxkcyBpbiBvcmRlciBvZiBkaXNjb3ZlcnkuXG4gICAgICByb3dzLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgICAgIGZvciAodmFyIGZpZWxkIGluIHJvdykge1xuICAgICAgICAgIGlmICghKChmaWVsZCArPSBcIlwiKSBpbiBmaWVsZFNldCkpIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkU2V0W2ZpZWxkXSA9IGZpZWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gW2ZpZWxkcy5tYXAoZm9ybWF0VmFsdWUpLmpvaW4oZGVsaW1pdGVyKV0uY29uY2F0KHJvd3MubWFwKGZ1bmN0aW9uKHJvdykge1xuICAgICAgICByZXR1cm4gZmllbGRzLm1hcChmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgIHJldHVybiBmb3JtYXRWYWx1ZShyb3dbZmllbGRdKTtcbiAgICAgICAgfSkuam9pbihkZWxpbWl0ZXIpO1xuICAgICAgfSkpLmpvaW4oXCJcXG5cIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0Um93cyhyb3dzKSB7XG4gICAgICByZXR1cm4gcm93cy5tYXAoZm9ybWF0Um93KS5qb2luKFwiXFxuXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFJvdyhyb3cpIHtcbiAgICAgIHJldHVybiByb3cubWFwKGZvcm1hdFZhbHVlKS5qb2luKGRlbGltaXRlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VmFsdWUodGV4dCkge1xuICAgICAgcmV0dXJuIHJlRm9ybWF0LnRlc3QodGV4dCkgPyBcIlxcXCJcIiArIHRleHQucmVwbGFjZSgvXFxcIi9nLCBcIlxcXCJcXFwiXCIpICsgXCJcXFwiXCIgOiB0ZXh0O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwYXJzZTogcGFyc2UsXG4gICAgICBwYXJzZVJvd3M6IHBhcnNlUm93cyxcbiAgICAgIGZvcm1hdDogZm9ybWF0LFxuICAgICAgZm9ybWF0Um93czogZm9ybWF0Um93c1xuICAgIH07XG4gIH1cblxuICBleHBvcnRzLmNzdiA9IGRzdihcIixcIik7XG4gIGV4cG9ydHMudHN2ID0gZHN2KFwiXFx0XCIpO1xuXG4gIGV4cG9ydHMuZHN2ID0gZHN2O1xuXG59KSk7IiwiLyoqXG4gKiBEZWJvdW5jZXMgYSBmdW5jdGlvbiBieSB0aGUgZ2l2ZW4gdGhyZXNob2xkLlxuICpcbiAqIEBzZWUgaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIHRvIHdyYXBcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IGluIG1zIChgMTAwYClcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gd2hldGhlciB0byBleGVjdXRlIGF0IHRoZSBiZWdpbm5pbmcgKGBmYWxzZWApXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgdGhyZXNob2xkLCBleGVjQXNhcCl7XG4gIHZhciB0aW1lb3V0O1xuXG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoKXtcbiAgICB2YXIgb2JqID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgaWYgKCFleGVjQXNhcCkge1xuICAgICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICB9XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIH0gZWxzZSBpZiAoZXhlY0FzYXApIHtcbiAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICB9XG5cbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTtcbiAgfTtcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZSgncXVldWUnLCBmYWN0b3J5KSA6XG4gIChnbG9iYWwucXVldWUgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgc2xpY2UgPSBbXS5zbGljZTtcblxuICBmdW5jdGlvbiBub29wKCkge31cblxuICB2YXIgbm9hYm9ydCA9IHt9O1xuICB2YXIgc3VjY2VzcyA9IFtudWxsXTtcbiAgZnVuY3Rpb24gbmV3UXVldWUoY29uY3VycmVuY3kpIHtcbiAgICBpZiAoIShjb25jdXJyZW5jeSA+PSAxKSkgdGhyb3cgbmV3IEVycm9yO1xuXG4gICAgdmFyIHEsXG4gICAgICAgIHRhc2tzID0gW10sXG4gICAgICAgIHJlc3VsdHMgPSBbXSxcbiAgICAgICAgd2FpdGluZyA9IDAsXG4gICAgICAgIGFjdGl2ZSA9IDAsXG4gICAgICAgIGVuZGVkID0gMCxcbiAgICAgICAgc3RhcnRpbmcsIC8vIGluc2lkZSBhIHN5bmNocm9ub3VzIHRhc2sgY2FsbGJhY2s/XG4gICAgICAgIGVycm9yLFxuICAgICAgICBjYWxsYmFjayA9IG5vb3AsXG4gICAgICAgIGNhbGxiYWNrQWxsID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgaWYgKHN0YXJ0aW5nKSByZXR1cm47IC8vIGxldCB0aGUgY3VycmVudCB0YXNrIGNvbXBsZXRlXG4gICAgICB3aGlsZSAoc3RhcnRpbmcgPSB3YWl0aW5nICYmIGFjdGl2ZSA8IGNvbmN1cnJlbmN5KSB7XG4gICAgICAgIHZhciBpID0gZW5kZWQgKyBhY3RpdmUsXG4gICAgICAgICAgICB0ID0gdGFza3NbaV0sXG4gICAgICAgICAgICBqID0gdC5sZW5ndGggLSAxLFxuICAgICAgICAgICAgYyA9IHRbal07XG4gICAgICAgIHRbal0gPSBlbmQoaSk7XG4gICAgICAgIC0td2FpdGluZywgKythY3RpdmUsIHRhc2tzW2ldID0gYy5hcHBseShudWxsLCB0KSB8fCBub2Fib3J0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZChpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZSwgcikge1xuICAgICAgICBpZiAoIXRhc2tzW2ldKSB0aHJvdyBuZXcgRXJyb3I7IC8vIGRldGVjdCBtdWx0aXBsZSBjYWxsYmFja3NcbiAgICAgICAgLS1hY3RpdmUsICsrZW5kZWQsIHRhc2tzW2ldID0gbnVsbDtcbiAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybjsgLy8gb25seSByZXBvcnQgdGhlIGZpcnN0IGVycm9yXG4gICAgICAgIGlmIChlICE9IG51bGwpIHtcbiAgICAgICAgICBhYm9ydChlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzW2ldID0gcjtcbiAgICAgICAgICBpZiAod2FpdGluZykgc3RhcnQoKTtcbiAgICAgICAgICBlbHNlIGlmICghYWN0aXZlKSBub3RpZnkoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYm9ydChlKSB7XG4gICAgICBlcnJvciA9IGU7IC8vIGlnbm9yZSBuZXcgdGFza3MgYW5kIHNxdWVsY2ggYWN0aXZlIGNhbGxiYWNrc1xuICAgICAgd2FpdGluZyA9IE5hTjsgLy8gc3RvcCBxdWV1ZWQgdGFza3MgZnJvbSBzdGFydGluZ1xuICAgICAgbm90aWZ5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm90aWZ5KCkge1xuICAgICAgaWYgKGVycm9yICE9IG51bGwpIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgIGVsc2UgaWYgKGNhbGxiYWNrQWxsKSBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICAgIGVsc2UgY2FsbGJhY2suYXBwbHkobnVsbCwgc3VjY2Vzcy5jb25jYXQocmVzdWx0cykpO1xuICAgIH1cblxuICAgIHJldHVybiBxID0ge1xuICAgICAgZGVmZXI6IGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9PSBub29wKSB0aHJvdyBuZXcgRXJyb3I7XG4gICAgICAgIHZhciB0ID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICB0LnB1c2goZik7XG4gICAgICAgICsrd2FpdGluZywgdGFza3MucHVzaCh0KTtcbiAgICAgICAgc3RhcnQoKTtcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgICB9LFxuICAgICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZXJyb3IgPT0gbnVsbCkge1xuICAgICAgICAgIHZhciBpID0gZW5kZWQgKyBhY3RpdmUsIHQ7XG4gICAgICAgICAgd2hpbGUgKC0taSA+PSAwKSAodCA9IHRhc2tzW2ldKSAmJiB0LmFib3J0ICYmIHQuYWJvcnQoKTtcbiAgICAgICAgICBhYm9ydChuZXcgRXJyb3IoXCJhYm9ydFwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHE7XG4gICAgICB9LFxuICAgICAgYXdhaXQ6IGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9PSBub29wKSB0aHJvdyBuZXcgRXJyb3I7XG4gICAgICAgIGNhbGxiYWNrID0gZiwgY2FsbGJhY2tBbGwgPSBmYWxzZTtcbiAgICAgICAgaWYgKCF3YWl0aW5nICYmICFhY3RpdmUpIG5vdGlmeSgpO1xuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH0sXG4gICAgICBhd2FpdEFsbDogZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT09IG5vb3ApIHRocm93IG5ldyBFcnJvcjtcbiAgICAgICAgY2FsbGJhY2sgPSBmLCBjYWxsYmFja0FsbCA9IHRydWU7XG4gICAgICAgIGlmICghd2FpdGluZyAmJiAhYWN0aXZlKSBub3RpZnkoKTtcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHF1ZXVlKGNvbmN1cnJlbmN5KSB7XG4gICAgcmV0dXJuIG5ld1F1ZXVlKGFyZ3VtZW50cy5sZW5ndGggPyArY29uY3VycmVuY3kgOiBJbmZpbml0eSk7XG4gIH1cblxuICBxdWV1ZS52ZXJzaW9uID0gXCIxLjIuMVwiO1xuXG4gIHJldHVybiBxdWV1ZTtcblxufSkpOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQgRmVsaXggR25hc3NcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL3NwaW4uanMub3JnL1xuICpcbiAqIEV4YW1wbGU6XG4gICAgdmFyIG9wdHMgPSB7XG4gICAgICBsaW5lczogMTIgICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyB0byBkcmF3XG4gICAgLCBsZW5ndGg6IDcgICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcbiAgICAsIHdpZHRoOiA1ICAgICAgICAgICAgICAvLyBUaGUgbGluZSB0aGlja25lc3NcbiAgICAsIHJhZGl1czogMTAgICAgICAgICAgICAvLyBUaGUgcmFkaXVzIG9mIHRoZSBpbm5lciBjaXJjbGVcbiAgICAsIHNjYWxlOiAxLjAgICAgICAgICAgICAvLyBTY2FsZXMgb3ZlcmFsbCBzaXplIG9mIHRoZSBzcGlubmVyXG4gICAgLCBjb3JuZXJzOiAxICAgICAgICAgICAgLy8gUm91bmRuZXNzICgwLi4xKVxuICAgICwgY29sb3I6ICcjMDAwJyAgICAgICAgIC8vICNyZ2Igb3IgI3JyZ2diYlxuICAgICwgb3BhY2l0eTogMS80ICAgICAgICAgIC8vIE9wYWNpdHkgb2YgdGhlIGxpbmVzXG4gICAgLCByb3RhdGU6IDAgICAgICAgICAgICAgLy8gUm90YXRpb24gb2Zmc2V0XG4gICAgLCBkaXJlY3Rpb246IDEgICAgICAgICAgLy8gMTogY2xvY2t3aXNlLCAtMTogY291bnRlcmNsb2Nrd2lzZVxuICAgICwgc3BlZWQ6IDEgICAgICAgICAgICAgIC8vIFJvdW5kcyBwZXIgc2Vjb25kXG4gICAgLCB0cmFpbDogMTAwICAgICAgICAgICAgLy8gQWZ0ZXJnbG93IHBlcmNlbnRhZ2VcbiAgICAsIGZwczogMjAgICAgICAgICAgICAgICAvLyBGcmFtZXMgcGVyIHNlY29uZCB3aGVuIHVzaW5nIHNldFRpbWVvdXQoKVxuICAgICwgekluZGV4OiAyZTkgICAgICAgICAgIC8vIFVzZSBhIGhpZ2ggei1pbmRleCBieSBkZWZhdWx0XG4gICAgLCBjbGFzc05hbWU6ICdzcGlubmVyJyAgLy8gQ1NTIGNsYXNzIHRvIGFzc2lnbiB0byB0aGUgZWxlbWVudFxuICAgICwgdG9wOiAnNTAlJyAgICAgICAgICAgIC8vIGNlbnRlciB2ZXJ0aWNhbGx5XG4gICAgLCBsZWZ0OiAnNTAlJyAgICAgICAgICAgLy8gY2VudGVyIGhvcml6b250YWxseVxuICAgICwgc2hhZG93OiBmYWxzZSAgICAgICAgIC8vIFdoZXRoZXIgdG8gcmVuZGVyIGEgc2hhZG93XG4gICAgLCBod2FjY2VsOiBmYWxzZSAgICAgICAgLy8gV2hldGhlciB0byB1c2UgaGFyZHdhcmUgYWNjZWxlcmF0aW9uIChtaWdodCBiZSBidWdneSlcbiAgICAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnICAvLyBFbGVtZW50IHBvc2l0aW9uaW5nXG4gICAgfVxuICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9vJylcbiAgICB2YXIgc3Bpbm5lciA9IG5ldyBTcGlubmVyKG9wdHMpLnNwaW4odGFyZ2V0KVxuICovXG47KGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cbiAgLyogQ29tbW9uSlMgKi9cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnKSBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxuXG4gIC8qIEFNRCBtb2R1bGUgKi9cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShmYWN0b3J5KVxuXG4gIC8qIEJyb3dzZXIgZ2xvYmFsICovXG4gIGVsc2Ugcm9vdC5TcGlubmVyID0gZmFjdG9yeSgpXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCJcblxuICB2YXIgcHJlZml4ZXMgPSBbJ3dlYmtpdCcsICdNb3onLCAnbXMnLCAnTyddIC8qIFZlbmRvciBwcmVmaXhlcyAqL1xuICAgICwgYW5pbWF0aW9ucyA9IHt9IC8qIEFuaW1hdGlvbiBydWxlcyBrZXllZCBieSB0aGVpciBuYW1lICovXG4gICAgLCB1c2VDc3NBbmltYXRpb25zIC8qIFdoZXRoZXIgdG8gdXNlIENTUyBhbmltYXRpb25zIG9yIHNldFRpbWVvdXQgKi9cbiAgICAsIHNoZWV0IC8qIEEgc3R5bGVzaGVldCB0byBob2xkIHRoZSBAa2V5ZnJhbWUgb3IgVk1MIHJ1bGVzLiAqL1xuXG4gIC8qKlxuICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBlbGVtZW50cy4gSWYgbm8gdGFnIG5hbWUgaXMgZ2l2ZW4sXG4gICAqIGEgRElWIGlzIGNyZWF0ZWQuIE9wdGlvbmFsbHkgcHJvcGVydGllcyBjYW4gYmUgcGFzc2VkLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlRWwgKHRhZywgcHJvcCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnIHx8ICdkaXYnKVxuICAgICAgLCBuXG5cbiAgICBmb3IgKG4gaW4gcHJvcCkgZWxbbl0gPSBwcm9wW25dXG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBjaGlsZHJlbiBhbmQgcmV0dXJucyB0aGUgcGFyZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gaW5zIChwYXJlbnQgLyogY2hpbGQxLCBjaGlsZDIsIC4uLiovKSB7XG4gICAgZm9yICh2YXIgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoYXJndW1lbnRzW2ldKVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG9wYWNpdHkga2V5ZnJhbWUgYW5pbWF0aW9uIHJ1bGUgYW5kIHJldHVybnMgaXRzIG5hbWUuXG4gICAqIFNpbmNlIG1vc3QgbW9iaWxlIFdlYmtpdHMgaGF2ZSB0aW1pbmcgaXNzdWVzIHdpdGggYW5pbWF0aW9uLWRlbGF5LFxuICAgKiB3ZSBjcmVhdGUgc2VwYXJhdGUgcnVsZXMgZm9yIGVhY2ggbGluZS9zZWdtZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gYWRkQW5pbWF0aW9uIChhbHBoYSwgdHJhaWwsIGksIGxpbmVzKSB7XG4gICAgdmFyIG5hbWUgPSBbJ29wYWNpdHknLCB0cmFpbCwgfn4oYWxwaGEgKiAxMDApLCBpLCBsaW5lc10uam9pbignLScpXG4gICAgICAsIHN0YXJ0ID0gMC4wMSArIGkvbGluZXMgKiAxMDBcbiAgICAgICwgeiA9IE1hdGgubWF4KDEgLSAoMS1hbHBoYSkgLyB0cmFpbCAqICgxMDAtc3RhcnQpLCBhbHBoYSlcbiAgICAgICwgcHJlZml4ID0gdXNlQ3NzQW5pbWF0aW9ucy5zdWJzdHJpbmcoMCwgdXNlQ3NzQW5pbWF0aW9ucy5pbmRleE9mKCdBbmltYXRpb24nKSkudG9Mb3dlckNhc2UoKVxuICAgICAgLCBwcmUgPSBwcmVmaXggJiYgJy0nICsgcHJlZml4ICsgJy0nIHx8ICcnXG5cbiAgICBpZiAoIWFuaW1hdGlvbnNbbmFtZV0pIHtcbiAgICAgIHNoZWV0Lmluc2VydFJ1bGUoXG4gICAgICAgICdAJyArIHByZSArICdrZXlmcmFtZXMgJyArIG5hbWUgKyAneycgK1xuICAgICAgICAnMCV7b3BhY2l0eTonICsgeiArICd9JyArXG4gICAgICAgIHN0YXJ0ICsgJyV7b3BhY2l0eTonICsgYWxwaGEgKyAnfScgK1xuICAgICAgICAoc3RhcnQrMC4wMSkgKyAnJXtvcGFjaXR5OjF9JyArXG4gICAgICAgIChzdGFydCt0cmFpbCkgJSAxMDAgKyAnJXtvcGFjaXR5OicgKyBhbHBoYSArICd9JyArXG4gICAgICAgICcxMDAle29wYWNpdHk6JyArIHogKyAnfScgK1xuICAgICAgICAnfScsIHNoZWV0LmNzc1J1bGVzLmxlbmd0aClcblxuICAgICAgYW5pbWF0aW9uc1tuYW1lXSA9IDFcbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaWVzIHZhcmlvdXMgdmVuZG9yIHByZWZpeGVzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBzdXBwb3J0ZWQgcHJvcGVydHkuXG4gICAqL1xuICBmdW5jdGlvbiB2ZW5kb3IgKGVsLCBwcm9wKSB7XG4gICAgdmFyIHMgPSBlbC5zdHlsZVxuICAgICAgLCBwcFxuICAgICAgLCBpXG5cbiAgICBwcm9wID0gcHJvcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3Auc2xpY2UoMSlcbiAgICBpZiAoc1twcm9wXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcHJvcFxuICAgIGZvciAoaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcHAgPSBwcmVmaXhlc1tpXStwcm9wXG4gICAgICBpZiAoc1twcF0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHBwXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgbXVsdGlwbGUgc3R5bGUgcHJvcGVydGllcyBhdCBvbmNlLlxuICAgKi9cbiAgZnVuY3Rpb24gY3NzIChlbCwgcHJvcCkge1xuICAgIGZvciAodmFyIG4gaW4gcHJvcCkge1xuICAgICAgZWwuc3R5bGVbdmVuZG9yKGVsLCBuKSB8fCBuXSA9IHByb3Bbbl1cbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxscyBpbiBkZWZhdWx0IHZhbHVlcy5cbiAgICovXG4gIGZ1bmN0aW9uIG1lcmdlIChvYmopIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlZiA9IGFyZ3VtZW50c1tpXVxuICAgICAgZm9yICh2YXIgbiBpbiBkZWYpIHtcbiAgICAgICAgaWYgKG9ialtuXSA9PT0gdW5kZWZpbmVkKSBvYmpbbl0gPSBkZWZbbl1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9ialxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpbmUgY29sb3IgZnJvbSB0aGUgZ2l2ZW4gc3RyaW5nIG9yIGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q29sb3IgKGNvbG9yLCBpZHgpIHtcbiAgICByZXR1cm4gdHlwZW9mIGNvbG9yID09ICdzdHJpbmcnID8gY29sb3IgOiBjb2xvcltpZHggJSBjb2xvci5sZW5ndGhdXG4gIH1cblxuICAvLyBCdWlsdC1pbiBkZWZhdWx0c1xuXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICBsaW5lczogMTIgICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyB0byBkcmF3XG4gICwgbGVuZ3RoOiA3ICAgICAgICAgICAgIC8vIFRoZSBsZW5ndGggb2YgZWFjaCBsaW5lXG4gICwgd2lkdGg6IDUgICAgICAgICAgICAgIC8vIFRoZSBsaW5lIHRoaWNrbmVzc1xuICAsIHJhZGl1czogMTAgICAgICAgICAgICAvLyBUaGUgcmFkaXVzIG9mIHRoZSBpbm5lciBjaXJjbGVcbiAgLCBzY2FsZTogMS4wICAgICAgICAgICAgLy8gU2NhbGVzIG92ZXJhbGwgc2l6ZSBvZiB0aGUgc3Bpbm5lclxuICAsIGNvcm5lcnM6IDEgICAgICAgICAgICAvLyBSb3VuZG5lc3MgKDAuLjEpXG4gICwgY29sb3I6ICcjMDAwJyAgICAgICAgIC8vICNyZ2Igb3IgI3JyZ2diYlxuICAsIG9wYWNpdHk6IDEvNCAgICAgICAgICAvLyBPcGFjaXR5IG9mIHRoZSBsaW5lc1xuICAsIHJvdGF0ZTogMCAgICAgICAgICAgICAvLyBSb3RhdGlvbiBvZmZzZXRcbiAgLCBkaXJlY3Rpb246IDEgICAgICAgICAgLy8gMTogY2xvY2t3aXNlLCAtMTogY291bnRlcmNsb2Nrd2lzZVxuICAsIHNwZWVkOiAxICAgICAgICAgICAgICAvLyBSb3VuZHMgcGVyIHNlY29uZFxuICAsIHRyYWlsOiAxMDAgICAgICAgICAgICAvLyBBZnRlcmdsb3cgcGVyY2VudGFnZVxuICAsIGZwczogMjAgICAgICAgICAgICAgICAvLyBGcmFtZXMgcGVyIHNlY29uZCB3aGVuIHVzaW5nIHNldFRpbWVvdXQoKVxuICAsIHpJbmRleDogMmU5ICAgICAgICAgICAvLyBVc2UgYSBoaWdoIHotaW5kZXggYnkgZGVmYXVsdFxuICAsIGNsYXNzTmFtZTogJ3NwaW5uZXInICAvLyBDU1MgY2xhc3MgdG8gYXNzaWduIHRvIHRoZSBlbGVtZW50XG4gICwgdG9wOiAnNTAlJyAgICAgICAgICAgIC8vIGNlbnRlciB2ZXJ0aWNhbGx5XG4gICwgbGVmdDogJzUwJScgICAgICAgICAgIC8vIGNlbnRlciBob3Jpem9udGFsbHlcbiAgLCBzaGFkb3c6IGZhbHNlICAgICAgICAgLy8gV2hldGhlciB0byByZW5kZXIgYSBzaGFkb3dcbiAgLCBod2FjY2VsOiBmYWxzZSAgICAgICAgLy8gV2hldGhlciB0byB1c2UgaGFyZHdhcmUgYWNjZWxlcmF0aW9uIChtaWdodCBiZSBidWdneSlcbiAgLCBwb3NpdGlvbjogJ2Fic29sdXRlJyAgLy8gRWxlbWVudCBwb3NpdGlvbmluZ1xuICB9XG5cbiAgLyoqIFRoZSBjb25zdHJ1Y3RvciAqL1xuICBmdW5jdGlvbiBTcGlubmVyIChvKSB7XG4gICAgdGhpcy5vcHRzID0gbWVyZ2UobyB8fCB7fSwgU3Bpbm5lci5kZWZhdWx0cywgZGVmYXVsdHMpXG4gIH1cblxuICAvLyBHbG9iYWwgZGVmYXVsdHMgdGhhdCBvdmVycmlkZSB0aGUgYnVpbHQtaW5zOlxuICBTcGlubmVyLmRlZmF1bHRzID0ge31cblxuICBtZXJnZShTcGlubmVyLnByb3RvdHlwZSwge1xuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIHNwaW5uZXIgdG8gdGhlIGdpdmVuIHRhcmdldCBlbGVtZW50LiBJZiB0aGlzIGluc3RhbmNlIGlzIGFscmVhZHlcbiAgICAgKiBzcGlubmluZywgaXQgaXMgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gaXRzIHByZXZpb3VzIHRhcmdldCBiIGNhbGxpbmdcbiAgICAgKiBzdG9wKCkgaW50ZXJuYWxseS5cbiAgICAgKi9cbiAgICBzcGluOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICB0aGlzLnN0b3AoKVxuXG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgLCBvID0gc2VsZi5vcHRzXG4gICAgICAgICwgZWwgPSBzZWxmLmVsID0gY3JlYXRlRWwobnVsbCwge2NsYXNzTmFtZTogby5jbGFzc05hbWV9KVxuXG4gICAgICBjc3MoZWwsIHtcbiAgICAgICAgcG9zaXRpb246IG8ucG9zaXRpb25cbiAgICAgICwgd2lkdGg6IDBcbiAgICAgICwgekluZGV4OiBvLnpJbmRleFxuICAgICAgLCBsZWZ0OiBvLmxlZnRcbiAgICAgICwgdG9wOiBvLnRvcFxuICAgICAgfSlcblxuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQuZmlyc3RDaGlsZCB8fCBudWxsKVxuICAgICAgfVxuXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKVxuICAgICAgc2VsZi5saW5lcyhlbCwgc2VsZi5vcHRzKVxuXG4gICAgICBpZiAoIXVzZUNzc0FuaW1hdGlvbnMpIHtcbiAgICAgICAgLy8gTm8gQ1NTIGFuaW1hdGlvbiBzdXBwb3J0LCB1c2Ugc2V0VGltZW91dCgpIGluc3RlYWRcbiAgICAgICAgdmFyIGkgPSAwXG4gICAgICAgICAgLCBzdGFydCA9IChvLmxpbmVzIC0gMSkgKiAoMSAtIG8uZGlyZWN0aW9uKSAvIDJcbiAgICAgICAgICAsIGFscGhhXG4gICAgICAgICAgLCBmcHMgPSBvLmZwc1xuICAgICAgICAgICwgZiA9IGZwcyAvIG8uc3BlZWRcbiAgICAgICAgICAsIG9zdGVwID0gKDEgLSBvLm9wYWNpdHkpIC8gKGYgKiBvLnRyYWlsIC8gMTAwKVxuICAgICAgICAgICwgYXN0ZXAgPSBmIC8gby5saW5lc1xuXG4gICAgICAgIDsoZnVuY3Rpb24gYW5pbSAoKSB7XG4gICAgICAgICAgaSsrXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvLmxpbmVzOyBqKyspIHtcbiAgICAgICAgICAgIGFscGhhID0gTWF0aC5tYXgoMSAtIChpICsgKG8ubGluZXMgLSBqKSAqIGFzdGVwKSAlIGYgKiBvc3RlcCwgby5vcGFjaXR5KVxuXG4gICAgICAgICAgICBzZWxmLm9wYWNpdHkoZWwsIGogKiBvLmRpcmVjdGlvbiArIHN0YXJ0LCBhbHBoYSwgbylcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi50aW1lb3V0ID0gc2VsZi5lbCAmJiBzZXRUaW1lb3V0KGFuaW0sIH5+KDEwMDAgLyBmcHMpKVxuICAgICAgICB9KSgpXG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3BzIGFuZCByZW1vdmVzIHRoZSBTcGlubmVyLlxuICAgICAqL1xuICAsIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICAgIGlmIChlbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSkgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcbiAgICAgICAgdGhpcy5lbCA9IHVuZGVmaW5lZFxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdGhhdCBkcmF3cyB0aGUgaW5kaXZpZHVhbCBsaW5lcy4gV2lsbCBiZSBvdmVyd3JpdHRlblxuICAgICAqIGluIFZNTCBmYWxsYmFjayBtb2RlIGJlbG93LlxuICAgICAqL1xuICAsIGxpbmVzOiBmdW5jdGlvbiAoZWwsIG8pIHtcbiAgICAgIHZhciBpID0gMFxuICAgICAgICAsIHN0YXJ0ID0gKG8ubGluZXMgLSAxKSAqICgxIC0gby5kaXJlY3Rpb24pIC8gMlxuICAgICAgICAsIHNlZ1xuXG4gICAgICBmdW5jdGlvbiBmaWxsIChjb2xvciwgc2hhZG93KSB7XG4gICAgICAgIHJldHVybiBjc3MoY3JlYXRlRWwoKSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICwgd2lkdGg6IG8uc2NhbGUgKiAoby5sZW5ndGggKyBvLndpZHRoKSArICdweCdcbiAgICAgICAgLCBoZWlnaHQ6IG8uc2NhbGUgKiBvLndpZHRoICsgJ3B4J1xuICAgICAgICAsIGJhY2tncm91bmQ6IGNvbG9yXG4gICAgICAgICwgYm94U2hhZG93OiBzaGFkb3dcbiAgICAgICAgLCB0cmFuc2Zvcm1PcmlnaW46ICdsZWZ0J1xuICAgICAgICAsIHRyYW5zZm9ybTogJ3JvdGF0ZSgnICsgfn4oMzYwL28ubGluZXMqaSArIG8ucm90YXRlKSArICdkZWcpIHRyYW5zbGF0ZSgnICsgby5zY2FsZSpvLnJhZGl1cyArICdweCcgKyAnLDApJ1xuICAgICAgICAsIGJvcmRlclJhZGl1czogKG8uY29ybmVycyAqIG8uc2NhbGUgKiBvLndpZHRoID4+IDEpICsgJ3B4J1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmb3IgKDsgaSA8IG8ubGluZXM7IGkrKykge1xuICAgICAgICBzZWcgPSBjc3MoY3JlYXRlRWwoKSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICwgdG9wOiAxICsgfihvLnNjYWxlICogby53aWR0aCAvIDIpICsgJ3B4J1xuICAgICAgICAsIHRyYW5zZm9ybTogby5od2FjY2VsID8gJ3RyYW5zbGF0ZTNkKDAsMCwwKScgOiAnJ1xuICAgICAgICAsIG9wYWNpdHk6IG8ub3BhY2l0eVxuICAgICAgICAsIGFuaW1hdGlvbjogdXNlQ3NzQW5pbWF0aW9ucyAmJiBhZGRBbmltYXRpb24oby5vcGFjaXR5LCBvLnRyYWlsLCBzdGFydCArIGkgKiBvLmRpcmVjdGlvbiwgby5saW5lcykgKyAnICcgKyAxIC8gby5zcGVlZCArICdzIGxpbmVhciBpbmZpbml0ZSdcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoby5zaGFkb3cpIGlucyhzZWcsIGNzcyhmaWxsKCcjMDAwJywgJzAgMCA0cHggIzAwMCcpLCB7dG9wOiAnMnB4J30pKVxuICAgICAgICBpbnMoZWwsIGlucyhzZWcsIGZpbGwoZ2V0Q29sb3Ioby5jb2xvciwgaSksICcwIDAgMXB4IHJnYmEoMCwwLDAsLjEpJykpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVsXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHRoYXQgYWRqdXN0cyB0aGUgb3BhY2l0eSBvZiBhIHNpbmdsZSBsaW5lLlxuICAgICAqIFdpbGwgYmUgb3ZlcndyaXR0ZW4gaW4gVk1MIGZhbGxiYWNrIG1vZGUgYmVsb3cuXG4gICAgICovXG4gICwgb3BhY2l0eTogZnVuY3Rpb24gKGVsLCBpLCB2YWwpIHtcbiAgICAgIGlmIChpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGgpIGVsLmNoaWxkTm9kZXNbaV0uc3R5bGUub3BhY2l0eSA9IHZhbFxuICAgIH1cblxuICB9KVxuXG5cbiAgZnVuY3Rpb24gaW5pdFZNTCAoKSB7XG5cbiAgICAvKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFZNTCB0YWcgKi9cbiAgICBmdW5jdGlvbiB2bWwgKHRhZywgYXR0cikge1xuICAgICAgcmV0dXJuIGNyZWF0ZUVsKCc8JyArIHRhZyArICcgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwic3Bpbi12bWxcIj4nLCBhdHRyKVxuICAgIH1cblxuICAgIC8vIE5vIENTUyB0cmFuc2Zvcm1zIGJ1dCBWTUwgc3VwcG9ydCwgYWRkIGEgQ1NTIHJ1bGUgZm9yIFZNTCBlbGVtZW50czpcbiAgICBzaGVldC5hZGRSdWxlKCcuc3Bpbi12bWwnLCAnYmVoYXZpb3I6dXJsKCNkZWZhdWx0I1ZNTCknKVxuXG4gICAgU3Bpbm5lci5wcm90b3R5cGUubGluZXMgPSBmdW5jdGlvbiAoZWwsIG8pIHtcbiAgICAgIHZhciByID0gby5zY2FsZSAqIChvLmxlbmd0aCArIG8ud2lkdGgpXG4gICAgICAgICwgcyA9IG8uc2NhbGUgKiAyICogclxuXG4gICAgICBmdW5jdGlvbiBncnAgKCkge1xuICAgICAgICByZXR1cm4gY3NzKFxuICAgICAgICAgIHZtbCgnZ3JvdXAnLCB7XG4gICAgICAgICAgICBjb29yZHNpemU6IHMgKyAnICcgKyBzXG4gICAgICAgICAgLCBjb29yZG9yaWdpbjogLXIgKyAnICcgKyAtclxuICAgICAgICAgIH0pXG4gICAgICAgICwgeyB3aWR0aDogcywgaGVpZ2h0OiBzIH1cbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICB2YXIgbWFyZ2luID0gLShvLndpZHRoICsgby5sZW5ndGgpICogby5zY2FsZSAqIDIgKyAncHgnXG4gICAgICAgICwgZyA9IGNzcyhncnAoKSwge3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IG1hcmdpbiwgbGVmdDogbWFyZ2lufSlcbiAgICAgICAgLCBpXG5cbiAgICAgIGZ1bmN0aW9uIHNlZyAoaSwgZHgsIGZpbHRlcikge1xuICAgICAgICBpbnMoXG4gICAgICAgICAgZ1xuICAgICAgICAsIGlucyhcbiAgICAgICAgICAgIGNzcyhncnAoKSwge3JvdGF0aW9uOiAzNjAgLyBvLmxpbmVzICogaSArICdkZWcnLCBsZWZ0OiB+fmR4fSlcbiAgICAgICAgICAsIGlucyhcbiAgICAgICAgICAgICAgY3NzKFxuICAgICAgICAgICAgICAgIHZtbCgncm91bmRyZWN0Jywge2FyY3NpemU6IG8uY29ybmVyc30pXG4gICAgICAgICAgICAgICwgeyB3aWR0aDogclxuICAgICAgICAgICAgICAgICwgaGVpZ2h0OiBvLnNjYWxlICogby53aWR0aFxuICAgICAgICAgICAgICAgICwgbGVmdDogby5zY2FsZSAqIG8ucmFkaXVzXG4gICAgICAgICAgICAgICAgLCB0b3A6IC1vLnNjYWxlICogby53aWR0aCA+PiAxXG4gICAgICAgICAgICAgICAgLCBmaWx0ZXI6IGZpbHRlclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgLCB2bWwoJ2ZpbGwnLCB7Y29sb3I6IGdldENvbG9yKG8uY29sb3IsIGkpLCBvcGFjaXR5OiBvLm9wYWNpdHl9KVxuICAgICAgICAgICAgLCB2bWwoJ3N0cm9rZScsIHtvcGFjaXR5OiAwfSkgLy8gdHJhbnNwYXJlbnQgc3Ryb2tlIHRvIGZpeCBjb2xvciBibGVlZGluZyB1cG9uIG9wYWNpdHkgY2hhbmdlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGlmIChvLnNoYWRvdylcbiAgICAgICAgZm9yIChpID0gMTsgaSA8PSBvLmxpbmVzOyBpKyspIHtcbiAgICAgICAgICBzZWcoaSwgLTIsICdwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQmx1cihwaXhlbHJhZGl1cz0yLG1ha2VzaGFkb3c9MSxzaGFkb3dvcGFjaXR5PS4zKScpXG4gICAgICAgIH1cblxuICAgICAgZm9yIChpID0gMTsgaSA8PSBvLmxpbmVzOyBpKyspIHNlZyhpKVxuICAgICAgcmV0dXJuIGlucyhlbCwgZylcbiAgICB9XG5cbiAgICBTcGlubmVyLnByb3RvdHlwZS5vcGFjaXR5ID0gZnVuY3Rpb24gKGVsLCBpLCB2YWwsIG8pIHtcbiAgICAgIHZhciBjID0gZWwuZmlyc3RDaGlsZFxuICAgICAgbyA9IG8uc2hhZG93ICYmIG8ubGluZXMgfHwgMFxuICAgICAgaWYgKGMgJiYgaSArIG8gPCBjLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGMgPSBjLmNoaWxkTm9kZXNbaSArIG9dOyBjID0gYyAmJiBjLmZpcnN0Q2hpbGQ7IGMgPSBjICYmIGMuZmlyc3RDaGlsZFxuICAgICAgICBpZiAoYykgYy5vcGFjaXR5ID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzaGVldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZWwgPSBjcmVhdGVFbCgnc3R5bGUnLCB7dHlwZSA6ICd0ZXh0L2Nzcyd9KVxuICAgICAgaW5zKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0sIGVsKVxuICAgICAgcmV0dXJuIGVsLnNoZWV0IHx8IGVsLnN0eWxlU2hlZXRcbiAgICB9KCkpXG5cbiAgICB2YXIgcHJvYmUgPSBjc3MoY3JlYXRlRWwoJ2dyb3VwJyksIHtiZWhhdmlvcjogJ3VybCgjZGVmYXVsdCNWTUwpJ30pXG5cbiAgICBpZiAoIXZlbmRvcihwcm9iZSwgJ3RyYW5zZm9ybScpICYmIHByb2JlLmFkaikgaW5pdFZNTCgpXG4gICAgZWxzZSB1c2VDc3NBbmltYXRpb25zID0gdmVuZG9yKHByb2JlLCAnYW5pbWF0aW9uJylcbiAgfVxuXG4gIHJldHVybiBTcGlubmVyXG5cbn0pKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzeGhyID0gcmVxdWlyZSgnZDMteGhyJyksXG4gICAgU3Bpbm5lciA9IHJlcXVpcmUoJ3NwaW4uanMnKTtcblxuXG5mdW5jdGlvbiBkM3Bvc3QodXJsLCByZXFEYXRhLCBjYWxsYmFjaywgY29ycykge1xuICAgIHZhciBzZW50ID0gZmFsc2U7XG5cbiAgICBpZiAodHlwZW9mIGNvcnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBtID0gdXJsLm1hdGNoKC9eXFxzKmh0dHBzPzpcXC9cXC9bXlxcL10qLyk7XG4gICAgICAgIGNvcnMgPSBtICYmIChtWzBdICE9PSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0bmFtZSArXG4gICAgICAgICAgICAgICAgKGxvY2F0aW9uLnBvcnQgPyAnOicgKyBsb2NhdGlvbi5wb3J0IDogJycpKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzcERhdGE7XG4gICAgdmFyIGZpbmRQYXRoQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmQtbW1wYXRocycpO1xuICAgIC8vdmFyIHNwaW5uZXIgPSBuZXcgU3Bpbm5lcih7Y29sb3I6JyNmZmYnLCBsaW5lczogMTJ9KTtcblxuICAgIGQzeGhyLnhocih1cmwpXG4gICAgICAgIC5oZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG4gICAgICAgIC5vbihcImJlZm9yZXNlbmRcIiwgZnVuY3Rpb24ocmVxdWVzdCkgeyBcbiAgICAgICAgICAgIGZpbmRQYXRoQnV0dG9uLnZhbHVlID0gXCJTZWFyY2hpbmcgcGF0aHMuLi5cIjtcbiAgICAgICAgICAgIGZpbmRQYXRoQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vZmluZFBhdGhCdXR0b24uYXBwZW5kQ2hpbGQoc3Bpbm5lci5zcGluKCkuZWwpO1xuICAgICAgICAgICAgLy9zcGlubmVyLnNwaW4oZmluZFBhdGhCdXR0b24pO1xuICAgICAgICB9KVxuICAgICAgICAucG9zdChcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShyZXFEYXRhKSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnIsIHJhd0RhdGEpe1xuICAgICAgICAgICAgICAgICAgICBmaW5kUGF0aEJ1dHRvbi52YWx1ZSA9IFwiRmluZCBtdWx0aW1vZGFsIHBhdGhzXCI7XG4gICAgICAgICAgICAgICAgICAgIGZpbmRQYXRoQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vc3Bpbm5lci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BEYXRhID0gcmF3RGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlcnIsIHJlc3BEYXRhLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgKTtcblxuICAgIGZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bChzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0O1xuICAgIH1cblxuICAgIHJldHVybiByZXNwRGF0YTtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGQzcG9zdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKSxcbiAgICBwb2x5bGluZSA9IHJlcXVpcmUoJ0BtYXBib3gvcG9seWxpbmUnKSxcbiAgICBkMyA9IHJlcXVpcmUoJy4uL2xpYi9kMycpLFxuICAgIHF1ZXVlID0gcmVxdWlyZSgncXVldWUtYXN5bmMnKTtcblxudmFyIERpcmVjdGlvbnMgPSBMLkNsYXNzLmV4dGVuZCh7XG4gICAgaW5jbHVkZXM6IFtMLk1peGluLkV2ZW50c10sXG5cbiAgICBvcHRpb25zOiB7XG4gICAgICAgIHVuaXRzOiAnbWV0cmljJyxcbiAgICAgICAgbWFwYm94X3Rva2VuOiAncGsuZXlKMUlqb2liR3hwZFNJc0ltRWlPaUk0ZFc1dVZrVkpJbjAuamhmcExuMkVza182WlNHNjJ5WFlPZycsXG4gICAgICAgIG9yc19hcGlfa2V5OiAnNThkOTA0YTQ5N2M2N2UwMDAxNWI0NWZjY2Y3OTY3N2ZhYmIwNDM1ODc0ZTRkOGY5NGRjMzRlYWEnLFxuICAgICAgICBnb29nbGVfYXBpX2tleTogJ0FJemFTeURjMmdhZFdJNG51blliMGk1TXhfUDNBSF95RFRpTXpBWSdcbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBNQVBCT1hfQVBJX1RFTVBMQVRFOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS9kaXJlY3Rpb25zL3Y1L21hcGJveC9jeWNsaW5nL3t3YXlwb2ludHN9P2FjY2Vzc190b2tlbj17dG9rZW59JyxcbiAgICAgICAgT1JTX0FQSV9URU1QTEFURTogJ2h0dHBzOi8vYXBpLm9wZW5yb3V0ZXNlcnZpY2Uub3JnL2RpcmVjdGlvbnM/JmNvb3JkaW5hdGVzPXtjb29yZGluYXRlc30mZ2VvbWV0cnlfZm9ybWF0PWdlb2pzb24maW5zdHJ1Y3Rpb25zPWZhbHNlJnByZWZlcmVuY2U9e3ByZWZlcmVuY2V9JnByb2ZpbGU9e3Byb2ZpbGV9JmFwaV9rZXk9e3Rva2VufScsXG4gICAgICAgIEdPT0dMRV9BUElfVEVNUExBVEU6ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZGlyZWN0aW9ucy9qc29uP29yaWdpbj17b3JpZ2lufSZkZXN0aW5hdGlvbj17ZGVzdGluYXRpb259JmF2b2lkPXthdm9pZH0mbW9kZT1iaWN5Y2xpbmcma2V5PXt0b2tlbn0nLFxuICAgICAgICBHRU9DT0RFUl9URU1QTEFURTogJ2h0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQvZ2VvY29kZS9tYXBib3gucGxhY2VzL3txdWVyeX0uanNvbj9wcm94aW1pdHk9e3Byb3hpbWl0eX0mYWNjZXNzX3Rva2VuPXt0b2tlbn0nXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgTC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl93YXlwb2ludHMgPSBbXTtcbiAgICAgICAgdGhpcy5wcm9maWxlID0ge1xuICAgICAgICAgICAgXCJhdmFpbGFibGVfcHVibGljX21vZGVzXCI6IFsndW5kZXJncm91bmQnXSxcbiAgICAgICAgICAgIFwiY2FuX3VzZV90YXhpXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJoYXNfYmljeWNsZVwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiaGFzX21vdG9yY3ljbGVcIjogZmFsc2UsXG4gICAgICAgICAgICBcImhhc19wcml2YXRlX2NhclwiOiB0cnVlLFxuICAgICAgICAgICAgXCJuZWVkX3BhcmtpbmdcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwib2JqZWN0aXZlXCI6IFwiZmFzdGVzdFwiLFxuICAgICAgICAgICAgXCJkcml2aW5nX2Rpc3RhbmNlX2xpbWl0XCI6IDUwMCxcbiAgICAgICAgICAgIFwic291cmNlXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJjb29yZGluYXRlXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwieFwiOiAwLjAsXG4gICAgICAgICAgICAgICAgICAgIFwieVwiOiAwLjAsXG4gICAgICAgICAgICAgICAgICAgIFwic3JpZFwiOiA0MzI2XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidGFyZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJjb29yZGluYXRlXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwieFwiOiAwLjAsXG4gICAgICAgICAgICAgICAgICAgIFwieVwiOiAwLjAsXG4gICAgICAgICAgICAgICAgICAgIFwic3JpZFwiOiA0MzI2XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBnZXRPcmlnaW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW47XG4gICAgfSxcblxuICAgIGdldERlc3RpbmF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb247XG4gICAgfSxcblxuICAgIHNldE9yaWdpbjogZnVuY3Rpb24ob3JpZ2luKSB7XG4gICAgICAgIG9yaWdpbiA9IHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KG9yaWdpbik7XG5cbiAgICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XG4gICAgICAgIHRoaXMuZmlyZSgnb3JpZ2luJywge1xuICAgICAgICAgICAgb3JpZ2luOiBvcmlnaW5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICAgIHRoaXMuX3VubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9yaWdpbikge1xuICAgICAgICAgICAgdGhpcy5wcm9maWxlLnNvdXJjZS52YWx1ZS54ID0gdGhpcy5vcmlnaW4uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgMF07XG4gICAgICAgICAgICB0aGlzLnByb2ZpbGUuc291cmNlLnZhbHVlLnkgPSB0aGlzLm9yaWdpbi5nZW9tZXRyeS5jb29yZGluYXRlc1tcbiAgICAgICAgICAgICAgICAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzZXREZXN0aW5hdGlvbjogZnVuY3Rpb24oZGVzdGluYXRpb24pIHtcbiAgICAgICAgZGVzdGluYXRpb24gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludChkZXN0aW5hdGlvbik7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgICB0aGlzLmZpcmUoJ2Rlc3RpbmF0aW9uJywge1xuICAgICAgICAgICAgZGVzdGluYXRpb246IGRlc3RpbmF0aW9uXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX3VubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlc3RpbmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnByb2ZpbGUudGFyZ2V0LnZhbHVlLnggPSB0aGlzLmRlc3RpbmF0aW9uLmdlb21ldHJ5XG4gICAgICAgICAgICAgICAgLmNvb3JkaW5hdGVzWzBdO1xuICAgICAgICAgICAgdGhpcy5wcm9maWxlLnRhcmdldC52YWx1ZS55ID0gdGhpcy5kZXN0aW5hdGlvbi5nZW9tZXRyeVxuICAgICAgICAgICAgICAgIC5jb29yZGluYXRlc1sxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBnZXRQcm9maWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5wcm9maWxlIHx8IHRoaXMub3B0aW9ucy5wcm9maWxlIHx8ICdtYXBib3guZHJpdmluZyc7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2ZpbGU7XG4gICAgfSxcblxuICAgIHNldFByb2ZpbGU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5wcm9maWxlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgLy90aGlzLmZpcmUoJ3Byb2ZpbGUnLCB7cHJvZmlsZTogcHJvZmlsZX0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZ2V0V2F5cG9pbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dheXBvaW50cztcbiAgICB9LFxuXG4gICAgc2V0V2F5cG9pbnRzOiBmdW5jdGlvbih3YXlwb2ludHMpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gd2F5cG9pbnRzLm1hcCh0aGlzLl9ub3JtYWxpemVXYXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBhZGRXYXlwb2ludDogZnVuY3Rpb24oaW5kZXgsIHdheXBvaW50KSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50cy5zcGxpY2UoaW5kZXgsIDAsIHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KFxuICAgICAgICAgICAgd2F5cG9pbnQpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZVdheXBvaW50OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldFdheXBvaW50OiBmdW5jdGlvbihpbmRleCwgd2F5cG9pbnQpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzW2luZGV4XSA9IHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KHdheXBvaW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJldmVyc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbyA9IHRoaXMub3JpZ2luLFxuICAgICAgICAgICAgZCA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICAgICAgdGhpcy5vcmlnaW4gPSBkO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbztcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzLnJldmVyc2UoKTtcblxuICAgICAgICB0aGlzLmZpcmUoJ29yaWdpbicsIHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpcmUoJ2Rlc3RpbmF0aW9uJywge1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiB0aGlzLmRlc3RpbmF0aW9uXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2VsZWN0Um91dGU6IGZ1bmN0aW9uKHJvdXRlKSB7XG4gICAgICAgIHRoaXMuZmlyZSgnc2VsZWN0Um91dGUnLCB7XG4gICAgICAgICAgICByb3V0ZTogcm91dGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNlbGVjdFRyYWNrOiBmdW5jdGlvbih0cmFjaykge1xuICAgICAgICB0aGlzLmZpcmUoJ3NlbGVjdFRyYWNrJywge1xuICAgICAgICAgICAgdHJhY2s6IHRyYWNrLkdlb0pTT05cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGhpZ2hsaWdodFJvdXRlOiBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFJvdXRlJywge1xuICAgICAgICAgICAgcm91dGU6IHJvdXRlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBoaWdobGlnaHRTdGVwOiBmdW5jdGlvbihzdGVwKSB7XG4gICAgICAgIHRoaXMuZmlyZSgnaGlnaGxpZ2h0U3RlcCcsIHtcbiAgICAgICAgICAgIHN0ZXA6IHN0ZXBcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHF1ZXJ5VVJMOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgICAgIGlmIChvcHRzLnByb3ZpZGVyLnRvTG93ZXJDYXNlKCkgPT09ICdtYXBib3gnKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXJ5TWFwYm94VVJMKG9wdHMpO1xuICAgICAgICBpZiAob3B0cy5wcm92aWRlci50b0xvd2VyQ2FzZSgpID09PSAnb3BlbnJvdXRlc2VydmljZScpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcXVlcnlPcGVuUm91dGVTZXJ2aWNlVVJMKG9wdHMpO1xuICAgICAgICBpZiAob3B0cy5wcm92aWRlci50b0xvd2VyQ2FzZSgpID09PSAnZ29vZ2xlJylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9xdWVyeUdvb2dsZVVSTChvcHRzKTtcblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgX3F1ZXJ5TWFwYm94VVJMOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IERpcmVjdGlvbnMuTUFQQk9YX0FQSV9URU1QTEFURSxcbiAgICAgICAgICAgIHBvaW50cyA9IFt0aGlzLm9yaWdpbl0uY29uY2F0KFt0aGlzLmRlc3RpbmF0aW9uXSlcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICAgICAgICB9KS5qb2luKCc7Jyk7XG4gICAgICAgIHJldHVybiBMLlV0aWwudGVtcGxhdGUodGVtcGxhdGUsIHtcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLm9wdGlvbnMubWFwYm94X3Rva2VuLFxuICAgICAgICAgICAgd2F5cG9pbnRzOiBwb2ludHNcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9xdWVyeU9wZW5Sb3V0ZVNlcnZpY2VVUkw6IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gRGlyZWN0aW9ucy5PUlNfQVBJX1RFTVBMQVRFLFxuICAgICAgICAgICAgcG9pbnRzID0gW3RoaXMub3JpZ2luXS5jb25jYXQoW3RoaXMuZGVzdGluYXRpb25dKVxuICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgICAgICAgICAgICAgIH0pLmpvaW4oJ3wnKTtcbiAgICAgICAgcmV0dXJuIEwuVXRpbC50ZW1wbGF0ZSh0ZW1wbGF0ZSwge1xuICAgICAgICAgICAgdG9rZW46IHRoaXMub3B0aW9ucy5vcnNfYXBpX2tleSxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb2ludHMsXG4gICAgICAgICAgICBwcmVmZXJlbmNlOiBvcHRzLnByZWZlcmVuY2UsXG4gICAgICAgICAgICBwcm9maWxlOiBvcHRzLnByb2ZpbGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9xdWVyeUdvb2dsZVVSTDogZnVuY3Rpb24ob3B0cykge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBEaXJlY3Rpb25zLkdPT0dMRV9BUElfVEVNUExBVEU7XG4gICAgICAgIHJldHVybiBMLlV0aWwudGVtcGxhdGUodGVtcGxhdGUsIHtcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLm9wdGlvbnMuZ29vZ2xlX2FwaV9rZXksXG4gICAgICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgICAgZGVzdGluYXRpb246IHRoaXMub3JpZ2luLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgICAgYXZvaWQ6IG9wdHMuYXZvaWRcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHF1ZXJ5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE9yaWdpbigpICYmIHRoaXMuZ2V0RGVzdGluYXRpb24oKTtcbiAgICB9LFxuXG4gICAgcXVlcnk6IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgaWYgKCFvcHRzKSBvcHRzID0ge307XG4gICAgICAgIGlmICghdGhpcy5xdWVyeWFibGUoKSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuX3F1ZXJ5KSB7XG4gICAgICAgICAgICB0aGlzLl9xdWVyeS5hYm9ydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3RzICYmIHRoaXMuX3JlcXVlc3RzLmxlbmd0aCkgdGhpcy5fcmVxdWVzdHNcbiAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMgPSBbXTtcblxuICAgICAgICB2YXIgcSA9IHF1ZXVlKCk7XG5cbiAgICAgICAgdmFyIHB0cyA9IFt0aGlzLm9yaWdpbiwgdGhpcy5kZXN0aW5hdGlvbl0uY29uY2F0KHRoaXMuX3dheXBvaW50cyk7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHRzKSB7XG4gICAgICAgICAgICBpZiAoIXB0c1tpXS5nZW9tZXRyeS5jb29yZGluYXRlcykge1xuICAgICAgICAgICAgICAgIHEuZGVmZXIoTC5iaW5kKHRoaXMuX2dlb2NvZGUsIHRoaXMpLCBwdHNbaV0sIG9wdHMucHJveGltaXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHEuYXdhaXQoTC5iaW5kKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpcmUoJ2Vycm9yJywge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlcURhdGEgPSB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiAxLFxuICAgICAgICAgICAgICAgIFwianNvbnJwY1wiOiBcIjIuMFwiLFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiYWlyLmdldFBhdGhzXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXFEYXRhLnBhcmFtcyA9IFt0aGlzLnByb2ZpbGVdO1xuXG4gICAgICAgICAgICB0aGlzLl9xdWVyeSA9IHJlcXVlc3QodGhpcy5xdWVyeVVSTChvcHRzKSxcbiAgICAgICAgICAgICAgICByZXFEYXRhLCBMLmJpbmQoZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3F1ZXJ5ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXJlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdlcnJvcicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucyA9IHJlc3A7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy53YXlwb2ludHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLmRlc3RpbmF0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3AudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMucm91dGVzLmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmdlb21ldHJ5ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuZ2VvanNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5kdXJhdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmR1cmF0aW9uICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgNjA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuc3RlcHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmdlb2pzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZlYXR1cmVzLmxlbmd0aDsgaSsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcEluZm8gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuZ2VvanNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZlYXR1cmVzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwSW5mb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50eXBlID09PVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BhdGgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuc3RlcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHJvdXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2VvanNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZlYXR1cmVzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2M6IHJvdXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2VvanNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZlYXR1cmVzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZW9tZXRyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvb3JkaW5hdGVzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXBJbmZvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnR5cGUgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3dpdGNoX3BvaW50J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLnN0ZXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiByb3V0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdlb2pzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mZWF0dXJlc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jOiByb3V0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdlb2pzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mZWF0dXJlc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2VvbWV0cnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb29yZGluYXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm9yaWdpbi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLmRpcmVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub3JpZ2luO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmlnaW47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24ucHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgnbG9hZCcsIHRoaXMuZGlyZWN0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcyksIHRoaXMpO1xuICAgICAgICB9LCB0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF9nZW9jb2RlOiBmdW5jdGlvbih3YXlwb2ludCwgcHJveGltaXR5LCBjYikge1xuICAgICAgICBpZiAoIXRoaXMuX3JlcXVlc3RzKSB0aGlzLl9yZXF1ZXN0cyA9IFtdO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0cy5wdXNoKHJlcXVlc3QoTC5VdGlsLnRlbXBsYXRlKERpcmVjdGlvbnMuR0VPQ09ERVJfVEVNUExBVEUsIHtcbiAgICAgICAgICAgIHF1ZXJ5OiB3YXlwb2ludC5wcm9wZXJ0aWVzLnF1ZXJ5LFxuICAgICAgICAgICAgdG9rZW46IHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbiB8fCBMLm1hcGJveFxuICAgICAgICAgICAgICAgIC5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgIHByb3hpbWl0eTogcHJveGltaXR5ID8gW3Byb3hpbWl0eS5sbmcsXG4gICAgICAgICAgICAgICAgcHJveGltaXR5LmxhdFxuICAgICAgICAgICAgXS5qb2luKCcsJykgOiAnJ1xuICAgICAgICB9KSwgTC5iaW5kKGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXJlc3AuZmVhdHVyZXMgfHwgIXJlc3AuZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJObyByZXN1bHRzIGZvdW5kIGZvciBxdWVyeSBcIiArXG4gICAgICAgICAgICAgICAgICAgIHdheXBvaW50LnByb3BlcnRpZXMucXVlcnlcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2F5cG9pbnQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSByZXNwLmZlYXR1cmVzW1xuICAgICAgICAgICAgICAgIDBdLmNlbnRlcjtcbiAgICAgICAgICAgIHdheXBvaW50LnByb3BlcnRpZXMubmFtZSA9IHJlc3AuZmVhdHVyZXNbXG4gICAgICAgICAgICAgICAgMF0ucGxhY2VfbmFtZTtcblxuICAgICAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICAgIH0sIHRoaXMpKSk7XG4gICAgfSxcblxuICAgIF91bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMgPSBbXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZGlyZWN0aW9ucztcbiAgICAgICAgdGhpcy5maXJlKCd1bmxvYWQnKTtcbiAgICB9LFxuXG4gICAgX25vcm1hbGl6ZVdheXBvaW50OiBmdW5jdGlvbih3YXlwb2ludCkge1xuICAgICAgICBpZiAoIXdheXBvaW50IHx8IHdheXBvaW50LnR5cGUgPT09ICdGZWF0dXJlJykge1xuICAgICAgICAgICAgcmV0dXJuIHdheXBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvb3JkaW5hdGVzLFxuICAgICAgICAgICAgcHJvcGVydGllcyA9IHt9O1xuXG4gICAgICAgIGlmICh3YXlwb2ludCBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICB3YXlwb2ludCA9IHdheXBvaW50LndyYXAoKTtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzID0gcHJvcGVydGllcy5xdWVyeSA9IFt3YXlwb2ludC5sbmcsXG4gICAgICAgICAgICAgICAgd2F5cG9pbnQubGF0XG4gICAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB3YXlwb2ludCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucXVlcnkgPSB3YXlwb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc1xuICAgICAgICB9O1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IERpcmVjdGlvbnMob3B0aW9ucyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1lcnJvcnMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2xvYWQgdW5sb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZXJyb3ItYWN0aXZlJywgZmFsc2UpXG4gICAgICAgICAgICAuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnRhaW5lclxuICAgICAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1lcnJvci1hY3RpdmUnLCB0cnVlKVxuICAgICAgICAgICAgLmh0bWwoJycpXG4gICAgICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1lcnJvcicpXG4gICAgICAgICAgICAudGV4dChlLmVycm9yKTtcblxuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAgIC5pbnNlcnQoJ3NwYW4nLCAnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtZXJyb3ItaWNvbicpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkdXJhdGlvbjogZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgdmFyIG0gPSBNYXRoLmZsb29yKHMgLyA2MCksXG4gICAgICAgICAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xuICAgICAgICBzICU9IDYwO1xuICAgICAgICBtICU9IDYwO1xuICAgICAgICBpZiAoaCA9PT0gMCAmJiBtID09PSAwKSByZXR1cm4gcyArICcgcyc7XG4gICAgICAgIGlmIChoID09PSAwKSByZXR1cm4gbSArICcgbWluJztcbiAgICAgICAgcmV0dXJuIGggKyAnIGggJyArIG0gKyAnIG1pbic7XG4gICAgfSxcblxuICAgIGltcGVyaWFsOiBmdW5jdGlvbiAobSkge1xuICAgICAgICB2YXIgbWkgPSBtIC8gMTYwOS4zNDQ7XG4gICAgICAgIGlmIChtaSA+PSAxMDApIHJldHVybiBtaS50b0ZpeGVkKDApICsgJyBtaSc7XG4gICAgICAgIGlmIChtaSA+PSAxMCkgIHJldHVybiBtaS50b0ZpeGVkKDEpICsgJyBtaSc7XG4gICAgICAgIGlmIChtaSA+PSAwLjEpIHJldHVybiBtaS50b0ZpeGVkKDIpICsgJyBtaSc7XG4gICAgICAgIHJldHVybiAobWkgKiA1MjgwKS50b0ZpeGVkKDApICsgJyBmdCc7XG4gICAgfSxcblxuICAgIG1ldHJpYzogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgaWYgKG0gPj0gMTAwMDAwKSByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDApICsgJyBrbSc7XG4gICAgICAgIGlmIChtID49IDEwMDAwKSAgcmV0dXJuIChtIC8gMTAwMCkudG9GaXhlZCgxKSArICcga20nO1xuICAgICAgICBpZiAobSA+PSAxMDApICAgIHJldHVybiAobSAvIDEwMDApLnRvRml4ZWQoMikgKyAnIGttJztcbiAgICAgICAgcmV0dXJuIG0udG9GaXhlZCgwKSArICcgbSc7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSxcbiAgICAgICAgbWFwO1xuICAgIHZhciBvcmlnQ2hhbmdlID0gZmFsc2UsXG4gICAgICAgIGRlc3RDaGFuZ2UgPSBmYWxzZTtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbihfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtaW5wdXRzJywgdHJ1ZSk7XG5cbiAgICB2YXIgZm9ybSA9IGNvbnRhaW5lci5hcHBlbmQoJ2Zvcm0nKVxuICAgICAgICAub24oJ2tleXByZXNzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoZDMuZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9yaWdDaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0T3JpZ2luKG9yaWdpbklucHV0LnByb3BlcnR5KCd2YWx1ZScpKTtcbiAgICAgICAgICAgICAgICBpZiAoZGVzdENoYW5nZSlcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihkZXN0aW5hdGlvbklucHV0LnByb3BlcnR5KCd2YWx1ZScpKTtcblxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLnF1ZXJ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3hpbWl0eTogbWFwLmdldENlbnRlcigpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgb3JpZ0NoYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlc3RDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB2YXIgb3JpZ2luID0gZm9ybS5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1vcmlnaW4nKTtcblxuICAgIG9yaWdpbi5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1mb3JtLWxhYmVsJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMuZ2V0T3JpZ2luKCkgaW5zdGFuY2VvZiBMLkxhdExuZykge1xuICAgICAgICAgICAgICAgIG1hcC5wYW5UbyhkaXJlY3Rpb25zLmdldE9yaWdpbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1kZXBhcnQtaWNvbicpO1xuXG4gICAgdmFyIG9yaWdpbklucHV0ID0gb3JpZ2luLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ2Fpci1vcmlnaW4taW5wdXQnKVxuICAgICAgICAuYXR0cigncGxhY2Vob2xkZXInLCAnU3RhcnQnKVxuICAgICAgICAub24oJ2lucHV0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIW9yaWdDaGFuZ2UpIG9yaWdDaGFuZ2UgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgIG9yaWdpbi5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1jbG9zZS1pY29uJylcbiAgICAgICAgLmF0dHIoJ3RpdGxlJywgJ0NsZWFyIHZhbHVlJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXRPcmlnaW4odW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICBmb3JtLmFwcGVuZCgnc3BhbicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1yZXZlcnNlLWljb24gbWFwYm94LWRpcmVjdGlvbnMtcmV2ZXJzZS1pbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0aXRsZScsICdSZXZlcnNlIG9yaWdpbiAmIGRlc3RpbmF0aW9uJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5yZXZlcnNlKCkucXVlcnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICB2YXIgZGVzdGluYXRpb24gPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWRlc3RpbmF0aW9uJyk7XG5cbiAgICBkZXN0aW5hdGlvbi5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1mb3JtLWxhYmVsJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKGRpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtYXJyaXZlLWljb24nKTtcblxuICAgIHZhciBkZXN0aW5hdGlvbklucHV0ID0gZGVzdGluYXRpb24uYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ3RleHQnKVxuICAgICAgICAuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKVxuICAgICAgICAuYXR0cignaWQnLCAnYWlyLWRlc3RpbmF0aW9uLWlucHV0JylcbiAgICAgICAgLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0VuZCcpXG4gICAgICAgIC5vbignaW5wdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghZGVzdENoYW5nZSkgZGVzdENoYW5nZSA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgZGVzdGluYXRpb24uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtY2xvc2UtaWNvbicpXG4gICAgICAgIC5hdHRyKCd0aXRsZScsICdDbGVhciB2YWx1ZScpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24odW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICB2YXIgbWFwYm94RGlyZWN0aW9ucyA9IGZvcm0uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignaWQnLCAnbWFwYm94LWRpcmVjdGlvbnMnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcHJvZmlsZScpO1xuXG4gICAgbWFwYm94RGlyZWN0aW9ucy5hcHBlbmQoJ2gzJylcbiAgICAgICAgLmF0dHIoJ3ZhbHVlJywgJ01BUEJPWCcpXG4gICAgICAgIC5hdHRyKCdzdHlsZScsICdtYXJnaW46IDVweCAwcHggMHB4IDVweCcpXG4gICAgICAgIC50ZXh0KCdNQVBCT1ggRElSRUNUSU9OUycpO1xuXG4gICAgbWFwYm94RGlyZWN0aW9ucy5hcHBlbmQoJ2lucHV0JylcbiAgICAgICAgLmF0dHIoJ3R5cGUnLCAnY2hlY2tib3gnKVxuICAgICAgICAuYXR0cignbmFtZScsICdlbmFibGVkJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ3Nob3ctbWFwYm94LWN5Y2xpbmcnKVxuICAgICAgICAucHJvcGVydHkoJ2NoZWNrZWQnLCBmYWxzZSlcbiAgICAgICAgLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgIGRpcmVjdGlvbnMucXVlcnkoe3Byb3ZpZGVyOiAnbWFwYm94J30pO1xuICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgbWFwYm94RGlyZWN0aW9ucy5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2ZvcicsICdzaG93LW1hcGJveC1jeWNsaW5nJylcbiAgICAgICAgLnRleHQoJ1Nob3cgY3ljbGluZyBwYXRoJyk7XG5cbiAgICB2YXIgY2FyX3Byb2ZpbGUgPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ2Fpci1jYXItcHJvZmlsZXMnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcHJvZmlsZScpO1xuXG4gICAgY2FyX3Byb2ZpbGUuYXBwZW5kKCdoMycpXG4gICAgICAgIC5hdHRyKCd2YWx1ZScsICdEUklWSU5HJylcbiAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ21hcmdpbjogNXB4IDBweCAwcHggNXB4JylcbiAgICAgICAgLnRleHQoJ0RSSVZJTkcgT1BUSU9OUycpO1xuXG4gICAgY2FyX3Byb2ZpbGUuYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ2NoZWNrYm94JylcbiAgICAgICAgLmF0dHIoJ25hbWUnLCAncHJvZmlsZScpXG4gICAgICAgIC5hdHRyKCdpZCcsICdhaXItcHJvZmlsZS1jeWNsaW5nJylcbiAgICAgICAgLnByb3BlcnR5KCdjaGVja2VkJywgdHJ1ZSlcbiAgICAgICAgLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgY2FyUGFya2luZy5wcm9wZXJ0eSgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY2FyUGFya2luZy5wcm9wZXJ0eSgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIGlzRHJpdmluZ0Rpc3RMaW1pdGVkLnByb3BlcnR5KCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpc0RyaXZpbmdEaXN0TGltaXRlZC5wcm9wZXJ0eSgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlTGltaXQucHJvcGVydHkoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYXJQYXJraW5nLnByb3BlcnR5KCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIGNhclBhcmtpbmcucHJvcGVydHkoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaXNEcml2aW5nRGlzdExpbWl0ZWQucHJvcGVydHkoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaXNEcml2aW5nRGlzdExpbWl0ZWQucHJvcGVydHkoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2VMaW1pdC5wcm9wZXJ0eSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0UHJvZmlsZSgnaGFzX3ByaXZhdGVfY2FyJywgdGhpcy5jaGVja2VkKTtcbiAgICAgICAgfSk7XG5cbiAgICBjYXJfcHJvZmlsZS5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2ZvcicsICdhaXItcHJvZmlsZS1wcml2YXRlLWNhcicpXG4gICAgICAgIC50ZXh0KCdQcml2YXRlIGNhciBhdmFpbGFibGUgb24gZGVwYXJ0dXJlJyk7XG5cbiAgICB2YXIgY2FyUGFya2luZyA9IGNhcl9wcm9maWxlLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICdjaGVja2JveCcpXG4gICAgICAgIC5hdHRyKCduYW1lJywgJ3Byb2ZpbGUnKVxuICAgICAgICAuYXR0cignaWQnLCAnYWlyLXByb2ZpbGUtY2FyLXBhcmtpbmcnKVxuICAgICAgICAucHJvcGVydHkoJ2NoZWNrZWQnLCB0cnVlKVxuICAgICAgICAucHJvcGVydHkoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAgIC5vbignY2hhbmdlJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXRQcm9maWxlKCduZWVkX3BhcmtpbmcnLCB0aGlzLmNoZWNrZWQpO1xuICAgICAgICB9KTtcblxuICAgIGNhcl9wcm9maWxlLmFwcGVuZCgnbGFiZWwnKVxuICAgICAgICAuYXR0cignZm9yJywgJ2Fpci1wcm9maWxlLWNhci1wYXJraW5nJylcbiAgICAgICAgLnRleHQoJ05lZWQgcGFya2luZyBmb3IgdGhlIGNhcicpO1xuXG4gICAgdmFyIGlzRHJpdmluZ0Rpc3RMaW1pdGVkID0gY2FyX3Byb2ZpbGUuYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ2NoZWNrYm94JylcbiAgICAgICAgLmF0dHIoJ25hbWUnLCAnZHJpdmluZy1wcm9maWxlJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ2RyaXZpbmctZGlzdGFuY2UtbGltaXQnKVxuICAgICAgICAucHJvcGVydHkoJ2NoZWNrZWQnLCB0cnVlKVxuICAgICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZUxpbWl0LnByb3BlcnR5KCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIGRpc3RhbmNlTGltaXQucHJvcGVydHkoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgY2FyX3Byb2ZpbGUuYXBwZW5kKCdsYWJlbCcpXG4gICAgICAgIC5hdHRyKCdmb3InLCAnZHJpdmluZy1kaXN0YW5jZS1saW1pdCcpXG4gICAgICAgIC5hdHRyKCdzdHlsZScsICd3aWR0aDogMTUwcHgnKVxuICAgICAgICAudGV4dCgnRGlzdGFuY2UgbGltaXQgKGttKTogJyk7XG5cbiAgICB2YXIgZGlzdGFuY2VMaW1pdCA9IGNhcl9wcm9maWxlLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICdudW1iZXInKVxuICAgICAgICAuYXR0cignbWluJywgJzEwJylcbiAgICAgICAgLmF0dHIoJ21heCcsICcyNjE3JylcbiAgICAgICAgLnByb3BlcnR5KCd2YWx1ZScsICc1MDAnKVxuICAgICAgICAuYXR0cignaWQnLCAnYWlyLWRyaXZpbmctZGlzdGFuY2UtbGltaXQnKVxuICAgICAgICAuYXR0cignc3R5bGUnLCAnd2lkdGg6IDgwcHg7cGFkZGluZy1sZWZ0OiAxMHB4O3BhZGRpbmctdG9wOiAycHg7cGFkZGluZy1ib3R0b206IDJweDtiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMSk7aGVpZ2h0OiAzMHB4O3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7Jyk7XG5cbiAgICB2YXIgcHVibGljX3Byb2ZpbGUgPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ2Fpci1wdWJsaWMtcHJvZmlsZXMnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcHJvZmlsZScpO1xuXG4gICAgcHVibGljX3Byb2ZpbGUuYXBwZW5kKCdoMycpXG4gICAgICAgIC5hdHRyKCd2YWx1ZScsICdQVUJMSUMgVFJBTlNJVCcpXG4gICAgICAgIC5hdHRyKCdzdHlsZScsICdtYXJnaW46IDVweCAwcHggMHB4IDVweCcpXG4gICAgICAgIC50ZXh0KCdQVUJMSUMgVFJBTlNJVCBQUkVGRVJFTkNFUycpO1xuXG4gICAgdmFyIHB1YmxpY19wcm9maWxlcyA9IHB1YmxpY19wcm9maWxlLnNlbGVjdEFsbCgnc3BhbicpXG4gICAgICAgIC5kYXRhKFtcbiAgICAgICAgICAgIFsnYWlyLnN1YnVyYmFuJywgJ3N1YnVyYmFuJywgJ1N1YnVyYmFuJ10sXG4gICAgICAgICAgICBbJ2Fpci51bmRlcmdyb3VuZCcsICd1bmRlcmdyb3VuZCcsICdVbmRlcmdyb3VuZCddLFxuICAgICAgICAgICAgWydhaXIudHJhbScsICd0cmFtJywgJ1RyYW0nXVxuICAgICAgICBdKVxuICAgICAgICAuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCdzcGFuJyk7XG5cbiAgICBwdWJsaWNfcHJvZmlsZXMuYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ2NoZWNrYm94JylcbiAgICAgICAgLmF0dHIoJ25hbWUnLCAncHJvZmlsZScpXG4gICAgICAgIC5hdHRyKCdpZCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiAnYWlyLXByb2ZpbGUtJyArIGRbMV07XG4gICAgICAgIH0pXG4gICAgICAgIC5wcm9wZXJ0eSgnY2hlY2tlZCcsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpID09PSAxO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBwdWJsaWNUcmFuc2l0U2VsZWN0aW9uLnB1c2goZFsxXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHB1YmxpY1RyYW5zaXRTZWxlY3Rpb24uaW5kZXhPZihkWzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBwdWJsaWNUcmFuc2l0U2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHB1YmxpY19wcm9maWxlcy5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2ZvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiAnYWlyLXByb2ZpbGUtJyArIGRbMV07XG4gICAgICAgIH0pXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkWzJdO1xuICAgICAgICB9KTtcblxuICAgIHB1YmxpY19wcm9maWxlLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICdidXR0b24nKVxuICAgICAgICAuYXR0cigndmFsdWUnLCAnRmluZCBtdWx0aW1vZGFsIHBhdGhzJylcbiAgICAgICAgLmF0dHIoJ25hbWUnLCAnZmluZCBwYXRocycpXG4gICAgICAgIC5hdHRyKCdpZCcsICdmaW5kLW1tcGF0aHMnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmIChpc0RyaXZpbmdEaXN0TGltaXRlZC5wcm9wZXJ0eSgnY2hlY2tlZCcpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXRQcm9maWxlKCdkcml2aW5nX2Rpc3RhbmNlX2xpbWl0JywgZGlzdGFuY2VMaW1pdC5wcm9wZXJ0eSgndmFsdWUnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldFByb2ZpbGUoJ2F2YWlsYWJsZV9wdWJsaWNfbW9kZXMnLCBwdWJsaWNUcmFuc2l0U2VsZWN0aW9uKTtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMucXVlcnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQod2F5cG9pbnQpIHtcbiAgICAgICAgaWYgKCF3YXlwb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9IGVsc2UgaWYgKHdheXBvaW50LnByb3BlcnRpZXMubmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHdheXBvaW50LnByb3BlcnRpZXMubmFtZTtcbiAgICAgICAgfSBlbHNlIGlmICh3YXlwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlcykge1xuICAgICAgICAgICAgdmFyIHByZWNpc2lvbiA9IE1hdGgubWF4KDAsIE1hdGguY2VpbChNYXRoLmxvZyhtYXAuZ2V0Wm9vbSgpKSAvIE1hdGguTE4yKSk7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0udG9GaXhlZChwcmVjaXNpb24pICsgJywgJyArXG4gICAgICAgICAgICAgICAgd2F5cG9pbnQuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0udG9GaXhlZChwcmVjaXNpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHdheXBvaW50LnByb3BlcnRpZXMucXVlcnkgfHwgJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaXJlY3Rpb25zXG4gICAgICAgIC5vbignb3JpZ2luJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoJ3ZhbHVlJywgZm9ybWF0KGUub3JpZ2luKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignZGVzdGluYXRpb24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbklucHV0LnByb3BlcnR5KCd2YWx1ZScsIGZvcm1hdChlLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigncHJvZmlsZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHByb2ZpbGVzLnNlbGVjdEFsbCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgIC5wcm9wZXJ0eSgnY2hlY2tlZCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRbMF0gPT09IGUucHJvZmlsZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdsb2FkJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoJ3ZhbHVlJywgZm9ybWF0KGUub3JpZ2luKSk7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbklucHV0LnByb3BlcnR5KCd2YWx1ZScsIGZvcm1hdChlLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1pbnN0cnVjdGlvbnMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdzZWxlY3RSb3V0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciByb3V0ZSA9IGUucm91dGU7XG5cbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgIHZhciBzdGVwcyA9IGNvbnRhaW5lci5hcHBlbmQoJ29sJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwcycpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZGF0YShyb3V0ZS5zdGVwcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXN0ZXAnKTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5wcm9wZXJ0aWVzLnR5cGUgPT09ICdwYXRoJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWNvbnRpbnVlLWljb24nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzdGVwLnByb3BlcnRpZXMudHlwZSA9PT0gJ3N3aXRjaF9wb2ludCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIGFpci0nICsgc3RlcC5wcm9wZXJ0aWVzLnN3aXRjaF90eXBlLnRvTG93ZXJDYXNlKCkgKyAnLWljb24nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwLW1hbmV1dmVyJylcbiAgICAgICAgICAgIC5odG1sKGZ1bmN0aW9uIChzdGVwKSB7IFxuICAgICAgICAgICAgICAgIGlmIChzdGVwLnByb3BlcnRpZXMudHlwZSA9PT0gJ3BhdGgnKSB7IFxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHN0ZXAucHJvcGVydGllcy5tb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdwcml2YXRlX2Nhcic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdEcml2aW5nJzsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmb290JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1dhbGtpbmcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYmljeWNsZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdDeWNsaW5nJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ZXAucHJvcGVydGllcy50aXRsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzdGVwLnByb3BlcnRpZXMudHlwZSA9PT0gJ3N3aXRjaF9wb2ludCcpIHsgXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGVwLnByb3BlcnRpZXMuc3dpdGNoX3R5cGUgPT09ICd1bmRlcmdyb3VuZF9zdGF0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ZXAucHJvcGVydGllcy50aXRsZSArICc6IFBsYXRmb3JtICcgKyBzdGVwLnByb3BlcnRpZXMucGxhdGZvcm07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ZXAucHJvcGVydGllcy50aXRsZTsgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwLWRpc3RhbmNlJylcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ZXAucHJvcGVydGllcy5kaXN0YW5jZSA/IGZvcm1hdFtkaXJlY3Rpb25zLm9wdGlvbnMudW5pdHNdKHN0ZXAucHJvcGVydGllcy5kaXN0YW5jZSkgOiAnJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRTdGVwKHN0ZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFN0ZXAobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICBpZiAoc3RlcC5sb2MpIHtcbiAgICAgICAgICAgICAgICBtYXAucGFuVG8oTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKHN0ZXAubG9jKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCdkZWJvdW5jZScpO1xuXG52YXIgTGF5ZXIgPSBMLkxheWVyR3JvdXAuZXh0ZW5kKHtcbiAgICBvcHRpb25zOiB7XG4gICAgICAgIHJlYWRvbmx5OiBmYWxzZVxuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihkaXJlY3Rpb25zLCBvcHRpb25zKSB7XG4gICAgICAgIEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9ucyA9IGRpcmVjdGlvbnMgfHwgbmV3IEwuRGlyZWN0aW9ucygpO1xuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcyk7XG5cbiAgICAgICAgdGhpcy5fZHJhZyA9IGRlYm91bmNlKEwuYmluZCh0aGlzLl9kcmFnLCB0aGlzKSwgMTAwKTtcblxuICAgICAgICB0aGlzLm9yaWdpbk1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiAhdGhpcy5vcHRpb25zLnJlYWRvbmx5LFxuICAgICAgICAgICAgaWNvbjogTC5tYXBib3gubWFya2VyLmljb24oe1xuICAgICAgICAgICAgICAgICdtYXJrZXItc2l6ZSc6ICdtZWRpdW0nLFxuICAgICAgICAgICAgICAgICdtYXJrZXItY29sb3InOiAnIzNCQjJEMCcsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAnYSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiAhdGhpcy5vcHRpb25zLnJlYWRvbmx5LFxuICAgICAgICAgICAgaWNvbjogTC5tYXBib3gubWFya2VyLmljb24oe1xuICAgICAgICAgICAgICAgICdtYXJrZXItc2l6ZSc6ICdtZWRpdW0nLFxuICAgICAgICAgICAgICAgICdtYXJrZXItY29sb3InOiAnIzQ0NCcsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAnYidcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5zdGVwTWFya2VyID0gTC5tYXJrZXIoWzAsIDBdLCB7XG4gICAgICAgICAgICBpY29uOiBMLmRpdkljb24oe1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcGJveC1tYXJrZXItZHJhZy1pY29uIG1hcGJveC1tYXJrZXItZHJhZy1pY29uLXN0ZXAnLFxuICAgICAgICAgICAgICAgIGljb25TaXplOiBuZXcgTC5Qb2ludCgxMiwgMTIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogIXRoaXMub3B0aW9ucy5yZWFkb25seSxcbiAgICAgICAgICAgIGljb246IHRoaXMuX3dheXBvaW50SWNvbigpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZHJhZ01hcmtlclxuICAgICAgICAgICAgLm9uKCdkcmFnc3RhcnQnLCB0aGlzLl9kcmFnU3RhcnQsIHRoaXMpXG4gICAgICAgICAgICAub24oJ2RyYWcnLCB0aGlzLl9kcmFnLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkcmFnZW5kJywgdGhpcy5fZHJhZ0VuZCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZUxheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKCk7XG4gICAgICAgIHRoaXMucm91dGVIaWdobGlnaHRMYXllciA9IEwubWFwYm94LmZlYXR1cmVMYXllcigpO1xuICAgICAgICB0aGlzLnRyYWNrTGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoKTtcblxuICAgICAgICB0aGlzLndheXBvaW50TWFya2VycyA9IFtdO1xuICAgIH0sXG5cbiAgICBvbkFkZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIEwuTGF5ZXJHcm91cC5wcm90b3R5cGUub25BZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZWFkb25seSkge1xuICAgICAgICAgIHRoaXMuX21hcFxuICAgICAgICAgICAgICAub24oJ2NsaWNrJywgdGhpcy5fY2xpY2ssIHRoaXMpXG4gICAgICAgICAgICAgIC5vbignbW91c2Vtb3ZlJywgdGhpcy5fbW91c2Vtb3ZlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnNcbiAgICAgICAgICAgIC5vbignb3JpZ2luJywgdGhpcy5fb3JpZ2luLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkZXN0aW5hdGlvbicsIHRoaXMuX2Rlc3RpbmF0aW9uLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdsb2FkJywgdGhpcy5fbG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vbigndW5sb2FkJywgdGhpcy5fdW5sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdzZWxlY3RSb3V0ZScsIHRoaXMuX3NlbGVjdFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdzZWxlY3RUcmFjaycsIHRoaXMuX3NlbGVjdFRyYWNrLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdoaWdobGlnaHRSb3V0ZScsIHRoaXMuX2hpZ2hsaWdodFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdoaWdobGlnaHRTdGVwJywgdGhpcy5faGlnaGxpZ2h0U3RlcCwgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uUmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1xuICAgICAgICAgICAgLm9mZignb3JpZ2luJywgdGhpcy5fb3JpZ2luLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignZGVzdGluYXRpb24nLCB0aGlzLl9kZXN0aW5hdGlvbiwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2xvYWQnLCB0aGlzLl9sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9mZigndW5sb2FkJywgdGhpcy5fdW5sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignc2VsZWN0Um91dGUnLCB0aGlzLl9zZWxlY3RSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3NlbGVjdFRyYWNrJywgdGhpcy5fc2VsZWN0VHJhY2ssIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdoaWdobGlnaHRSb3V0ZScsIHRoaXMuX2hpZ2hsaWdodFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignaGlnaGxpZ2h0U3RlcCcsIHRoaXMuX2hpZ2hsaWdodFN0ZXAsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX21hcFxuICAgICAgICAgICAgLm9mZignY2xpY2snLCB0aGlzLl9jbGljaywgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ21vdXNlbW92ZScsIHRoaXMuX21vdXNlbW92ZSwgdGhpcyk7XG5cbiAgICAgICAgTC5MYXllckdyb3VwLnByb3RvdHlwZS5vblJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBfY2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kaXJlY3Rpb25zLmdldE9yaWdpbigpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldE9yaWdpbihlLmxhdGxuZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2RpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihlLmxhdGxuZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmICh0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKSB7XG4gICAgICAgICAgICAvL3RoaXMuX2RpcmVjdGlvbnMucXVlcnkoKTtcbiAgICAgICAgLy99XG4gICAgfSxcblxuICAgIF9tb3VzZW1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJvdXRlTGF5ZXIgfHwgIXRoaXMuaGFzTGF5ZXIodGhpcy5yb3V0ZUxheWVyKSB8fCB0aGlzLl9jdXJyZW50V2F5cG9pbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHAgPSB0aGlzLl9yb3V0ZVBvbHlsaW5lKCkuY2xvc2VzdExheWVyUG9pbnQoZS5sYXllclBvaW50KTtcblxuICAgICAgICBpZiAoIXAgfHwgcC5kaXN0YW5jZSA+IDE1KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG0gPSB0aGlzLl9tYXAucHJvamVjdChlLmxhdGxuZyksXG4gICAgICAgICAgICBvID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy5vcmlnaW5NYXJrZXIuZ2V0TGF0TG5nKCkpLFxuICAgICAgICAgICAgZCA9IHRoaXMuX21hcC5wcm9qZWN0KHRoaXMuZGVzdGluYXRpb25NYXJrZXIuZ2V0TGF0TG5nKCkpO1xuXG4gICAgICAgIGlmIChvLmRpc3RhbmNlVG8obSkgPCAxNSB8fCBkLmRpc3RhbmNlVG8obSkgPCAxNSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3ID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy53YXlwb2ludE1hcmtlcnNbaV0uZ2V0TGF0TG5nKCkpO1xuICAgICAgICAgICAgaWYgKGkgIT09IHRoaXMuX2N1cnJlbnRXYXlwb2ludCAmJiB3LmRpc3RhbmNlVG8obSkgPCAxNSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXIuc2V0TGF0TG5nKHRoaXMuX21hcC5sYXllclBvaW50VG9MYXRMbmcocCkpO1xuICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgfSxcblxuICAgIF9vcmlnaW46IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUub3JpZ2luICYmIGUub3JpZ2luLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbk1hcmtlci5zZXRMYXRMbmcoTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUub3JpZ2luLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMub3JpZ2luTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5vcmlnaW5NYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kZXN0aW5hdGlvbjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5kZXN0aW5hdGlvbiAmJiBlLmRlc3RpbmF0aW9uLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uTWFya2VyLnNldExhdExuZyhMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS5kZXN0aW5hdGlvbi5nZW9tZXRyeS5jb29yZGluYXRlcykpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmRlc3RpbmF0aW9uTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kZXN0aW5hdGlvbk1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWdTdGFydDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuZHJhZ01hcmtlcikge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFdheXBvaW50ID0gdGhpcy5fZmluZFdheXBvaW50SW5kZXgoZS50YXJnZXQuZ2V0TGF0TG5nKCkpO1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5hZGRXYXlwb2ludCh0aGlzLl9jdXJyZW50V2F5cG9pbnQsIGUudGFyZ2V0LmdldExhdExuZygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRXYXlwb2ludCA9IHRoaXMud2F5cG9pbnRNYXJrZXJzLmluZGV4T2YoZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kcmFnOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBsYXRMbmcgPSBlLnRhcmdldC5nZXRMYXRMbmcoKTtcblxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMub3JpZ2luTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldE9yaWdpbihsYXRMbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmRlc3RpbmF0aW9uTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKGxhdExuZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldFdheXBvaW50KHRoaXMuX2N1cnJlbnRXYXlwb2ludCwgbGF0TG5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWdFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50V2F5cG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIF9yZW1vdmVXYXlwb2ludDogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnJlbW92ZVdheXBvaW50KHRoaXMud2F5cG9pbnRNYXJrZXJzLmluZGV4T2YoZS50YXJnZXQpKS5xdWVyeSgpO1xuICAgIH0sXG5cbiAgICBfbG9hZDogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLl9vcmlnaW4oZSk7XG4gICAgICAgIHRoaXMuX2Rlc3RpbmF0aW9uKGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdheXBvaW50TGF0TG5nKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS53YXlwb2ludHNbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGwgPSBNYXRoLm1pbih0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGgsIGUud2F5cG9pbnRzLmxlbmd0aCksXG4gICAgICAgICAgICBpID0gMDtcblxuICAgICAgICAvLyBVcGRhdGUgZXhpc3RpbmdcbiAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLnNldExhdExuZyh3YXlwb2ludExhdExuZyhpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgbmV3XG4gICAgICAgIGZvciAoOyBpIDwgZS53YXlwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3YXlwb2ludE1hcmtlciA9IEwubWFya2VyKHdheXBvaW50TGF0TG5nKGkpLCB7XG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiAhdGhpcy5vcHRpb25zLnJlYWRvbmx5LFxuICAgICAgICAgICAgICAgIGljb246IHRoaXMuX3dheXBvaW50SWNvbigpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd2F5cG9pbnRNYXJrZXJcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgdGhpcy5fcmVtb3ZlV2F5cG9pbnQsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnc3RhcnQnLCB0aGlzLl9kcmFnU3RhcnQsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLl9kcmFnRW5kLCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMucHVzaCh3YXlwb2ludE1hcmtlcik7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHdheXBvaW50TWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBvbGRcbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLndheXBvaW50TWFya2Vyc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGggPSBlLndheXBvaW50cy5sZW5ndGg7XG4gICAgfSxcblxuICAgIF91bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMucm91dGVMYXllcik7XG4gICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy50cmFja0xheWVyKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLndheXBvaW50TWFya2Vyc1tpXSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NlbGVjdFJvdXRlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMucm91dGVMYXllclxuICAgICAgICAgICAgLmNsZWFyTGF5ZXJzKClcbiAgICAgICAgICAgIC5zZXRHZW9KU09OKGUucm91dGUuZ2VvbWV0cnkpO1xuICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMucm91dGVMYXllcik7XG4gICAgfSxcblxuICAgIF9zZWxlY3RUcmFjazogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLnRyYWNrTGF5ZXJcbiAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAuc2V0R2VvSlNPTihlLnRyYWNrKTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLnRyYWNrTGF5ZXIpO1xuICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMucm91dGVMYXllcik7XG4gICAgfSxcblxuICAgIF9oaWdobGlnaHRSb3V0ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5yb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyXG4gICAgICAgICAgICAgICAgLmNsZWFyTGF5ZXJzKClcbiAgICAgICAgICAgICAgICAuc2V0R2VvSlNPTihlLnJvdXRlLmdlb21ldHJ5KTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGlnaGxpZ2h0U3RlcDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5zdGVwICYmIGUuc3RlcC5sb2MpIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcE1hcmtlci5zZXRMYXRMbmcoTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUuc3RlcC5sb2MpKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5zdGVwTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5zdGVwTWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcm91dGVQb2x5bGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlTGF5ZXIuZ2V0TGF5ZXJzKClbMF07XG4gICAgfSxcblxuICAgIF9maW5kV2F5cG9pbnRJbmRleDogZnVuY3Rpb24obGF0TG5nKSB7XG4gICAgICAgIHZhciBzZWdtZW50ID0gdGhpcy5fZmluZE5lYXJlc3RSb3V0ZVNlZ21lbnQobGF0TG5nKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50KHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLmdldExhdExuZygpKTtcbiAgICAgICAgICAgIGlmIChzID4gc2VnbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50OiBmdW5jdGlvbihsYXRMbmcpIHtcbiAgICAgICAgdmFyIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBwID0gdGhpcy5fbWFwLmxhdExuZ1RvTGF5ZXJQb2ludChsYXRMbmcpLFxuICAgICAgICAgICAgcG9zaXRpb25zID0gdGhpcy5fcm91dGVQb2x5bGluZSgpLl9vcmlnaW5hbFBvaW50cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGQgPSBMLkxpbmVVdGlsLl9zcUNsb3Nlc3RQb2ludE9uU2VnbWVudChwLCBwb3NpdGlvbnNbaSAtIDFdLCBwb3NpdGlvbnNbaV0sIHRydWUpO1xuICAgICAgICAgICAgaWYgKGQgPCBtaW4pIHtcbiAgICAgICAgICAgICAgICBtaW4gPSBkO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG4gICAgX3dheXBvaW50SWNvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBMLmRpdkljb24oe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbWFwYm94LW1hcmtlci1kcmFnLWljb24nLFxuICAgICAgICAgICAgaWNvblNpemU6IG5ldyBMLlBvaW50KDEyLCAxMilcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGlyZWN0aW9ucywgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgTGF5ZXIoZGlyZWN0aW9ucywgb3B0aW9ucyk7XG59O1xuIiwiLyogQGZsb3cgKi9cbnZhciBkb20gPSBkb2N1bWVudDsgLy8gdGhpcyB0byBjbGFpbSB0aGF0IHdlIHVzZSB0aGUgZG9tIGFwaSwgbm90IHJlcHJlc2VudGF0aXZlIG9mIHRoZSBwYWdlIGRvY3VtZW50XG5cbnZhciBQYWdpbmdDb250cm9sID0gZnVuY3Rpb24oXG4gICAgZWxlbWVudCAvKjogRWxlbWVudCAqLyAsXG4gICAgb3B0aW9ucyAvKjogP09iamVjdCAqL1xuKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMuZGlzcGxheWVkID0gb3B0aW9ucy5kaXNwbGF5ZWQgfHwgMTA7XG4gICAgb3B0aW9ucy50b3RhbCA9IG9wdGlvbnMudG90YWwgfHwgMTA7XG5cbiAgICB0aGlzLnVwZGF0ZShvcHRpb25zKTtcbiAgICB0aGlzLnNlbGVjdGVkID0gMTtcblxuICAgIC8vIHNldCBlbXB0eSBldmVudCBoYW5kbGVyc1xuICAgIHRoaXMub25TZWxlY3RlZChmdW5jdGlvbigpIHt9KTtcbn07XG5cblBhZ2luZ0NvbnRyb2wucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbcmVsPXBhZ2VdJyksXG4gICAgICAgIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICApO1xufTtcblxudmFyIGNhbGNSYW5nZSA9IGZ1bmN0aW9uKGZvY3VzLCBkaXNwbGF5ZWQsIHRvdGFsKSB7XG4gICAgdmFyIGhhbGYgPSBNYXRoLmZsb29yKGRpc3BsYXllZCAvIDIpO1xuICAgIHZhciBwYWdlTWF4ID0gTWF0aC5taW4odG90YWwsIGRpc3BsYXllZCk7XG4gICAgaWYgKGZvY3VzIC0gaGFsZiA8IDEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0OiAxLFxuICAgICAgICAgICAgZW5kOiBwYWdlTWF4XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmIChmb2N1cyArIGhhbGYgPiB0b3RhbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhcnQ6IHRvdGFsIC0gZGlzcGxheWVkICsgMSxcbiAgICAgICAgICAgIGVuZDogdG90YWxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IGZvY3VzIC0gaGFsZixcbiAgICAgICAgZW5kOiBmb2N1cyArIGhhbGZcbiAgICB9O1xufTtcblxuUGFnaW5nQ29udHJvbC5wcm90b3R5cGUub25TZWxlY3RlZCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpc3BsYXllZCA9IHRoaXMub3B0aW9ucy5kaXNwbGF5ZWQ7XG5cbiAgICB0aGlzLm9uU2VsZWN0ZWRIYW5kbGVyID0gZnVuY3Rpb24ocGFnZU5vKSB7XG4gICAgICAgIHNlbGYuY2xlYXIoKTtcbiAgICAgICAgdmFyIHJhbmdlID0gY2FsY1JhbmdlKHBhZ2VObywgZGlzcGxheWVkLCBzZWxmLm9wdGlvbnMudG90YWwpO1xuICAgICAgICBzZWxmLnJlbmRlclBhZ2VzKHJhbmdlLnN0YXJ0LCByYW5nZS5lbmQsIHBhZ2VObyk7XG4gICAgICAgIHJldHVybiBoYW5kbGVyKHBhZ2VObyk7XG4gICAgfTtcbn07XG5cblBhZ2luZ0NvbnRyb2wucHJvdG90eXBlLnJlbmRlclBhZ2VzID0gZnVuY3Rpb24oc3RhcnQsIGVuZCwgc2VsZWN0ZWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGdlbkhhbmRsZXIgPSBmdW5jdGlvbihwYWdlTm8pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5vblNlbGVjdGVkSGFuZGxlcihwYWdlTm8pO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgdmFyIHBhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIHBhZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnZW5IYW5kbGVyKGkpKTtcbiAgICAgICAgcGFnZS5yZWwgPSAncGFnZSc7XG4gICAgICAgIHBhZ2UuaHJlZiA9ICcjJztcbiAgICAgICAgcGFnZS50ZXh0Q29udGVudCA9IGk7XG4gICAgICAgIGlmIChpID09PSBzZWxlY3RlZCkge1xuICAgICAgICAgICAgcGFnZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHBhZ2UpO1xuICAgIH1cbn07XG5cblBhZ2luZ0NvbnRyb2wucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnJlbmRlclBhZ2VzKDEsIE1hdGgubWluKG9wdGlvbnMudG90YWwsIG9wdGlvbnMuZGlzcGxheWVkKSwgMSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2luZ0NvbnRyb2w7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkM3Bvc3QgPSByZXF1aXJlKCcuL2QzX3Bvc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIHJlcURhdGEsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGQzcG9zdCh1cmwsIHJlcURhdGEsIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgaWYgKGVyciAmJiBlcnIudHlwZSA9PT0gJ2Fib3J0Jykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyciAmJiAhZXJyLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICByZXNwID0gcmVzcCB8fCBlcnI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3AgPSBKU09OLnBhcnNlKHJlc3AucmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHJlc3ApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXNwLmVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHJlc3AuZXJyb3IpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCByZXNwLnJlc3VsdCk7XG4gICAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRpcmVjdGlvbnMpIHtcbiAgICB2YXIgY29udHJvbCA9IHt9LCBtYXAsIHNlbGVjdGlvbiA9IDA7XG5cbiAgICBjb250cm9sLmFkZFRvID0gZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgbWFwID0gXztcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdChMLkRvbVV0aWwuZ2V0KGNvbnRhaW5lcikpXG4gICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZGlyZWN0aW9ucy1yb3V0ZXMnLCB0cnVlKTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgIHZhciByb3V0ZXMgPSBjb250YWluZXIuYXBwZW5kKCd1bCcpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZGF0YShlLnJvdXRlcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlJyk7XG5cbiAgICAgICAgcm91dGVzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWhlYWRpbmcnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiAnUm91dGUgJyArIChlLnJvdXRlcy5pbmRleE9mKHJvdXRlKSArIDEpOyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLXN1bW1hcnknKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZS5zdW1tYXJ5OyB9KTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWRldGFpbHMnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdFtkaXJlY3Rpb25zLm9wdGlvbnMudW5pdHNdKHJvdXRlLmRpc3RhbmNlKSArICcsICcgKyBmb3JtYXQuZHVyYXRpb24ocm91dGUuZHVyYXRpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0Um91dGUocm91dGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRSb3V0ZShudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZWxlY3RSb3V0ZShyb3V0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRpcmVjdGlvbnMuc2VsZWN0Um91dGUoZS5yb3V0ZXNbMF0pO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignc2VsZWN0Um91dGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXIuc2VsZWN0QWxsKCcubWFwYm94LWRpcmVjdGlvbnMtcm91dGUnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlLWFjdGl2ZScsIGZ1bmN0aW9uIChyb3V0ZSkgeyByZXR1cm4gcm91dGUgPT09IGUucm91dGU7IH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiLyogQGZsb3cgKi9cblxudmFyIHJlbmRlclJvdyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgZGF0YSkge1xuICAgIHZhciByb3cgPSBjb250YWluZXIuaW5zZXJ0Um93KCk7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHN0cikge1xuICAgICAgICB2YXIgY2VsbCA9IHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSBzdHI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdztcbn07XG5cbnZhciByZW5kZXJIZWFkZXIgPSBmdW5jdGlvbihjb250YWluZXIsIGRhdGEpIHtcbiAgICB2YXIgcm93ID0gY29udGFpbmVyLmluc2VydFJvdygpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgdmFyIHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgdGguaW5uZXJIVE1MID0gc3RyO1xuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodGgpO1xuICAgIH0pO1xuICAgIHJldHVybiByb3c7XG59O1xuXG52YXIgVGFibGVDb250cm9sID0gZnVuY3Rpb24oXG4gICAgZWxlbWVudCAvKjogT2JqZWN0ICovLCAvKiBUYWJsZUVsZW1lbnQgKi9cbiAgICBoZWFkZXJzIC8qOiBbc3RyaW5nXSAqLyxcbiAgICBtb2RlbCAvKjogP1tbc3RyaW5nXV0gKi9cbikge1xuICAgIHJlbmRlckhlYWRlcihlbGVtZW50LmNyZWF0ZVRIZWFkKCksIGhlYWRlcnMpO1xuICAgIHRoaXMudGJvZHkgPSBlbGVtZW50LmNyZWF0ZVRCb2R5KCk7XG4gICAgdGhpcy5iaW5kKG1vZGVsIHx8IFtdKTtcbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB3aGlsZSAodGhpcy50Ym9keS5oYXNDaGlsZE5vZGVzKCkpIHsgICBcbiAgICAgICAgdGhpcy50Ym9keS5yZW1vdmVDaGlsZCh0aGlzLnRib2R5LmZpcnN0Q2hpbGQpO1xuICAgIH1cbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUub25TZWxlY3RlZCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICB0aGlzLm9uU2VsZWN0ZWRIYW5kbGVyID0gaGFuZGxlcjtcbn07XG5cblRhYmxlQ29udHJvbC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIC8vIGRlYWwgd2l0aCBjbG9zdXJlXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB2YXIgcm93ID0gcmVuZGVyUm93KHNlbGYudGJvZHksIGRhdGEpO1xuICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9uU2VsZWN0ZWRIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vblNlbGVjdGVkSGFuZGxlcihkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlQ29udHJvbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRhYmxlQ29udHJvbCA9IHJlcXVpcmUoJy4vdGFibGVfY29udHJvbC5qcycpLCBcbiAgICBwYWdpbmdDb250cm9sID0gcmVxdWlyZSgnLi9wYWdpbmdfY29udHJvbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcDtcbiAgICB2YXIgb3JpZ0NoYW5nZSA9IGZhbHNlLCBkZXN0Q2hhbmdlID0gZmFsc2U7XG4gICAgdmFyIFRSQUNLSU5GT19BUElfVVJMID0gXCJodHRwczovL2x1bGl1Lm1lL3RyYWNrcy9hcGkvdjEvdHJhY2tpbmZvXCI7XG4gICAgdmFyIFRSQUNLX0FQSV9VUkwgPSBcImh0dHBzOi8vbHVsaXUubWUvdHJhY2tzL2FwaS92MS90cmFja3NcIjtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbihfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICAvLyBnZXQgcGFnZSAxIG9mIHRyYWNraW5mbyBhcyBpbml0IGRhdGEgZm9yIHRoZSB0YWJsZVxuICAgIC8vIFdlYiBicm93c2VyIGNvbXBhdGliaWxpdHk6XG4gICAgLy8gZm9yIElFNyssIEZpcmVmb3gsIENocm9tZSwgT3BlcmEsIFNhZmFyaVxuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8dGFibGUgaWQ9XCJ0cmFja3MtdGFibGVcIiBjbGFzcz1cInByb3NlIGFpci10cmFja3NcIj48L3RhYmxlPicpO1xuICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICc8ZGl2IGlkPVwicGFnaW5nXCIgZGF0YS1jb250cm9sPVwicGFnaW5nXCI+PC9kaXY+Jyk7XG5cbiAgICB2YXIgdHJhY2tpbmZvS2V5cyA9IFtcbiAgICAgICAgJ0lEJywgJ1NlZ21lbnRzJywgJzJEIGxlbmd0aCcsICczRCBsZW5ndGgnLCAnTW92aW5nIHRpbWUnLCAnU3RvcHBlZCB0aW1lJywgXG4gICAgICAgICdNYXggc3BlZWQnLCAnVXBoaWxsJywgJ0Rvd25oaWxsJywgJ1N0YXJ0ZWQgYXQnLCAnRW5kZWQgYXQnLCAnUG9pbnRzJywgXG4gICAgICAgICdTdGFydCBsb24nLCAnU3RhcnQgbGF0JywgJ0VuZCBsb24nLCAnRW5kIGxhdCdcbiAgICBdLFxuICAgIHZhbHVlcyA9IFtdO1xuICAgIHZhciBwYWdlID0gMSwgdG90YWxQYWdlcyA9IDEsIG51bVJlc3VsdHMgPSAxO1xuICAgIHZhciB0YyA9IG5ldyB0YWJsZUNvbnRyb2woZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYWNrcy10YWJsZScpLCBcbiAgICAgICAgICAgIHRyYWNraW5mb0tleXMsIHZhbHVlcyk7XG4gICAgdmFyIHBnID0gbmV3IHBhZ2luZ0NvbnRyb2woZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2luZycpLCBcbiAgICAgICAgICAgIHtkaXNwbGF5ZWQ6IDAsIHRvdGFsOiAwfSk7XG5cbiAgICB2YXIgdHJhY2tpbmZvWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdHJhY2tpbmZvWGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHJhY2tpbmZvWGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgdHJhY2tpbmZvWGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICB2YXIgdHJhY2tpbmZvRGF0YSA9IEpTT04ucGFyc2UodHJhY2tpbmZvWGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB0b3RhbFBhZ2VzID0gdHJhY2tpbmZvRGF0YS50b3RhbF9wYWdlcztcbiAgICAgICAgICAgIHBhZ2UgPSB0cmFja2luZm9EYXRhLnBhZ2U7XG4gICAgICAgICAgICBudW1SZXN1bHRzID0gdHJhY2tpbmZvRGF0YS5udW1fcmVzdWx0cztcbiAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgdHJhY2tpbmZvRGF0YS5vYmplY3RzLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0cmFja2luZm9LZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChyb3cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0Yy5iaW5kKHZhbHVlcyk7XG4gICAgICAgICAgICBwZy51cGRhdGUoeyBkaXNwbGF5ZWQ6IDEwLCB0b3RhbDogdG90YWxQYWdlcyB9KTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgdHJhY2tpbmZvWGhyLm9wZW4oXCJHRVRcIiwgVFJBQ0tJTkZPX0FQSV9VUkwsIHRydWUpO1xuICAgIHRyYWNraW5mb1hoci5zZW5kKCk7XG5cbiAgICB0Yy5vblNlbGVjdGVkKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKFtkYXRhWzEyXSwgZGF0YVsxM11dKTtcbiAgICAgICAgdmFyIGVuZFBvcyA9IEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhbZGF0YVsxNF0sIGRhdGFbMTVdXSk7XG4gICAgICAgIGRpcmVjdGlvbnMuc2V0T3JpZ2luKHN0YXJ0UG9zKTtcbiAgICAgICAgZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihlbmRQb3MpO1xuICAgICAgICB2YXIgc291dGhXZXN0ID0gTC5sYXRMbmcoXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhcnRQb3MubGF0LCBlbmRQb3MubGF0KSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhcnRQb3MubG5nLCBlbmRQb3MubG5nKSksXG4gICAgICAgICAgICBub3J0aEVhc3QgPSBMLmxhdExuZyhcbiAgICAgICAgICAgICAgICBNYXRoLm1heChzdGFydFBvcy5sYXQsIGVuZFBvcy5sYXQpLFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0UG9zLmxuZywgZW5kUG9zLmxuZykpLFxuICAgICAgICAgICAgYm91bmRzID0gTC5sYXRMbmdCb3VuZHMoc291dGhXZXN0LCBub3J0aEVhc3QpO1xuICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XG4gICAgICAgIC8vIFdlYiBicm93c2VyIGNvbXBhdGliaWxpdHk6IFxuICAgICAgICAvLyBJRTcrLCBGaXJlZm94LCBDaHJvbWUsIE9wZXJhLCBTYWZhcmlcbiAgICAgICAgdmFyIHRyYWNrWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRyYWNrWGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRyYWNrWGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgdHJhY2tYaHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJhY2tEYXRhID0gSlNPTi5wYXJzZSh0cmFja1hoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuc2VsZWN0VHJhY2sodHJhY2tEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0cmFja1hoci5vcGVuKFwiR0VUXCIsIFRSQUNLX0FQSV9VUkwgKyBcIi9cIiArIGRhdGFbMF0sIHRydWUpO1xuICAgICAgICB0cmFja1hoci5zZW5kKCk7XG4gICAgfSk7XG5cbiAgICBwZy5vblNlbGVjdGVkKGZ1bmN0aW9uKHBhZ2VObykge1xuICAgICAgICB2YXIgcGFnZWRUcmFja2luZm9YaHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcGFnZWRUcmFja2luZm9YaHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocGFnZWRUcmFja2luZm9YaHIucmVhZHlTdGF0ZSA9PT0gNCAmJiBwYWdlZFRyYWNraW5mb1hoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHZhciB0cmFja2luZm9EYXRhID0gSlNPTi5wYXJzZShwYWdlZFRyYWNraW5mb1hoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgMyB2YXJpYWJsZXMgY2FuIGJlIGFxdWlyZWQgZnJvbSB0aGUgcmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgLy8gYnV0IHVzZWxlc3MgZm9yIHRoZSBtb21lbnRcbiAgICAgICAgICAgICAgICAvL3RvdGFsUGFnZXMgPSB0cmFja2luZm9EYXRhLnRvdGFsX3BhZ2VzO1xuICAgICAgICAgICAgICAgIC8vcGFnZSA9IHRyYWNraW5mb0RhdGEucGFnZTtcbiAgICAgICAgICAgICAgICAvL251bVJlc3VsdHMgPSB0cmFja2luZm9EYXRhLm51bV9yZXN1bHRzO1xuICAgICAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHRyYWNraW5mb0RhdGEub2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRyYWNraW5mb0tleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGMuYmluZCh2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBhZ2VkVHJhY2tpbmZvWGhyLm9wZW4oXCJHRVRcIiwgVFJBQ0tJTkZPX0FQSV9VUkwgKyBcIj9wYWdlPVwiICsgcGFnZU5vLCB0cnVlKTtcbiAgICAgICAgcGFnZWRUcmFja2luZm9YaHIuc2VuZCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIl19
;