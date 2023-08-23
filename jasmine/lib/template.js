function getGlobal() {
  try {
    if (typeof window !== "undefined") {
      return window;
    }
  } catch (e) {
    e;
  }
  try {
    if (typeof global !== "undefined") {
      return global;
    }
  } catch (e) {
    e;
  }
  throw new Error(`getGlobal error: can't find global`);
}

var template = (function (t, delimiters) {
  var escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
  };
  var escapes = {
    "'": "'",
    "\\": "\\",
    "\r": "r",
    "\n": "n",
    "\u2028": "u2028",
    "\u2029": "u2029",
  };
  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
  var createEscaper = function (map) {
    var escaper = function (match) {
      return map[match];
    };
    var l = [];
    for (var i in map) {
      l.push(i);
    }
    // Regexes for identifying a key that needs to be escaped
    var source = "(?:" + l.join("|") + ")";
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, "g");
    return function (string) {
      string = string == null ? "" : "" + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  t._esc = createEscaper(escapeMap);
  var escapeChar = function (match) {
    return "\\" + escapes[match];
  };
  function isObject(obj) {
    var type = typeof obj;
    return type === "function" || (type === "object" && !!obj);
  }
  function defaults(obj) {
    if (!isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  }

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  return function (text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, delimiters);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp(
      [
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source,
      ].join("|") + "|$",
      "g",
    );

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_esc(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";

    source =
      "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source +
      "return __p;\n";

    try {
      var render = new Function(settings.variable || "obj", "_", source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function (data) {
      return render.call(this, data);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || "obj";
    template.source = "function(" + argument + "){\n" + source + "}";

    return template;
  };
})(getGlobal(), {
  //            evaluate    : /<%([\s\S]+?)%>/g,
  //            interpolate : /<%=([\s\S]+?)%>/g,
  //            escape      : /<%-([\s\S]+?)%>/g
  evaluate: /<#([\s\S]+?)#>/g,
  interpolate: /<#=([\s\S]+?)#>/g,
  escape: /<#-([\s\S]+?)#>/g,
});

// export default template;
module.exports = template;

