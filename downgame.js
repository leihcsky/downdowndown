import { PlatformStyles } from './platform-styles.js';
var be, b, Ze, z, De, et, tt, it, Le, Pe, Se, nt, oe = {}, st = [], vt = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Fe = Array.isArray;
function $(i, e) {
  for (var t in e) i[t] = e[t];
  return i;
}
function Ie(i) {
  i && i.parentNode && i.parentNode.removeChild(i);
}
function yt(i, e, t) {
  var n, r, s, o = {};
  for (s in e) s == "key" ? n = e[s] : s == "ref" ? r = e[s] : o[s] = e[s];
  if (arguments.length > 2 && (o.children = arguments.length > 3 ? be.call(arguments, 2) : t), typeof i == "function" && i.defaultProps != null) for (s in i.defaultProps) o[s] == null && (o[s] = i.defaultProps[s]);
  return fe(i, o, n, r, null);
}
function fe(i, e, t, n, r) {
  var s = { type: i, props: e, key: t, ref: n, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: r ?? ++Ze, __i: -1, __u: 0 };
  return r == null && b.vnode != null && b.vnode(s), s;
}
function x(i) {
  return i.children;
}
function ge(i, e) {
  this.props = i, this.context = e;
}
function ee(i, e) {
  if (e == null) return i.__ ? ee(i.__, i.__i + 1) : null;
  for (var t; e < i.__k.length; e++) if ((t = i.__k[e]) != null && t.__e != null) return t.__e;
  return typeof i.type == "function" ? ee(i) : null;
}
function rt(i) {
  var e, t;
  if ((i = i.__) != null && i.__c != null) {
    for (i.__e = i.__c.base = null, e = 0; e < i.__k.length; e++) if ((t = i.__k[e]) != null && t.__e != null) {
      i.__e = i.__c.base = t.__e;
      break;
    }
    return rt(i);
  }
}
function Ee(i) {
  (!i.__d && (i.__d = !0) && z.push(i) && !ye.__r++ || De != b.debounceRendering) && ((De = b.debounceRendering) || et)(ye);
}
function ye() {
  for (var i, e, t, n, r, s, o, a = 1; z.length; ) z.length > a && z.sort(tt), i = z.shift(), a = z.length, i.__d && (t = void 0, r = (n = (e = i).__v).__e, s = [], o = [], e.__P && ((t = $({}, n)).__v = n.__v + 1, b.vnode && b.vnode(t), Ne(e.__P, t, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [r] : null, s, r ?? ee(n), !!(32 & n.__u), o), t.__v = n.__v, t.__.__k[t.__i] = t, at(s, t, o), t.__e != r && rt(t)));
  ye.__r = 0;
}
function ot(i, e, t, n, r, s, o, a, c, h, u) {
  var l, _, d, g, H, k, w = n && n.__k || st, y = e.length;
  for (c = wt(t, e, w, c, y), l = 0; l < y; l++) (d = t.__k[l]) != null && (_ = d.__i == -1 ? oe : w[d.__i] || oe, d.__i = l, k = Ne(i, d, _, r, s, o, a, c, h, u), g = d.__e, d.ref && _.ref != d.ref && (_.ref && Oe(_.ref, null, d), u.push(d.ref, d.__c || g, d)), H == null && g != null && (H = g), 4 & d.__u || _.__k === d.__k ? c = lt(d, c, i) : typeof d.type == "function" && k !== void 0 ? c = k : g && (c = g.nextSibling), d.__u &= -7);
  return t.__e = H, c;
}
function wt(i, e, t, n, r) {
  var s, o, a, c, h, u = t.length, l = u, _ = 0;
  for (i.__k = new Array(r), s = 0; s < r; s++) (o = e[s]) != null && typeof o != "boolean" && typeof o != "function" ? (c = s + _, (o = i.__k[s] = typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? fe(null, o, null, null, null) : Fe(o) ? fe(x, { children: o }, null, null, null) : o.constructor == null && o.__b > 0 ? fe(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : o).__ = i, o.__b = i.__b + 1, a = null, (h = o.__i = bt(o, t, c, l)) != -1 && (l--, (a = t[h]) && (a.__u |= 2)), a == null || a.__v == null ? (h == -1 && (r > u ? _-- : r < u && _++), typeof o.type != "function" && (o.__u |= 4)) : h != c && (h == c - 1 ? _-- : h == c + 1 ? _++ : (h > c ? _-- : _++, o.__u |= 4))) : i.__k[s] = null;
  if (l) for (s = 0; s < u; s++) (a = t[s]) != null && (2 & a.__u) == 0 && (a.__e == n && (n = ee(a)), ct(a, a));
  return n;
}
function lt(i, e, t) {
  var n, r;
  if (typeof i.type == "function") {
    for (n = i.__k, r = 0; n && r < n.length; r++) n[r] && (n[r].__ = i, e = lt(n[r], e, t));
    return e;
  }
  i.__e != e && (e && i.type && !t.contains(e) && (e = ee(i)), t.insertBefore(i.__e, e || null), e = i.__e);
  do
    e = e && e.nextSibling;
  while (e != null && e.nodeType == 8);
  return e;
}
function bt(i, e, t, n) {
  var r, s, o = i.key, a = i.type, c = e[t];
  if (c === null && i.key == null || c && o == c.key && a == c.type && (2 & c.__u) == 0) return t;
  if (n > (c != null && (2 & c.__u) == 0 ? 1 : 0)) for (r = t - 1, s = t + 1; r >= 0 || s < e.length; ) {
    if (r >= 0) {
      if ((c = e[r]) && (2 & c.__u) == 0 && o == c.key && a == c.type) return r;
      r--;
    }
    if (s < e.length) {
      if ((c = e[s]) && (2 & c.__u) == 0 && o == c.key && a == c.type) return s;
      s++;
    }
  }
  return -1;
}
function Ge(i, e, t) {
  e[0] == "-" ? i.setProperty(e, t ?? "") : i[e] = t == null ? "" : typeof t != "number" || vt.test(e) ? t : t + "px";
}
function de(i, e, t, n, r) {
  var s;
  e: if (e == "style") if (typeof t == "string") i.style.cssText = t;
  else {
    if (typeof n == "string" && (i.style.cssText = n = ""), n) for (e in n) t && e in t || Ge(i.style, e, "");
    if (t) for (e in t) n && t[e] == n[e] || Ge(i.style, e, t[e]);
  }
  else if (e[0] == "o" && e[1] == "n") s = e != (e = e.replace(it, "$1")), e = e.toLowerCase() in i || e == "onFocusOut" || e == "onFocusIn" ? e.toLowerCase().slice(2) : e.slice(2), i.l || (i.l = {}), i.l[e + s] = t, t ? n ? t.u = n.u : (t.u = Le, i.addEventListener(e, s ? Se : Pe, s)) : i.removeEventListener(e, s ? Se : Pe, s);
  else {
    if (r == "http://www.w3.org/2000/svg") e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (e != "width" && e != "height" && e != "href" && e != "list" && e != "form" && e != "tabIndex" && e != "download" && e != "rowSpan" && e != "colSpan" && e != "role" && e != "popover" && e in i) try {
      i[e] = t ?? "";
      break e;
    } catch {
    }
    typeof t == "function" || (t == null || t === !1 && e[4] != "-" ? i.removeAttribute(e) : i.setAttribute(e, e == "popover" && t == 1 ? "" : t));
  }
}
function Me(i) {
  return function(e) {
    if (this.l) {
      var t = this.l[e.type + i];
      if (e.t == null) e.t = Le++;
      else if (e.t < t.u) return;
      return t(b.event ? b.event(e) : e);
    }
  };
}
function Ne(i, e, t, n, r, s, o, a, c, h) {
  var u, l, _, d, g, H, k, w, y, U, I, V, W, ne, q, m, F, E = e.type;
  if (e.constructor != null) return null;
  128 & t.__u && (c = !!(32 & t.__u), s = [a = e.__e = t.__e]), (u = b.__b) && u(e);
  e: if (typeof E == "function") try {
    if (w = e.props, y = "prototype" in E && E.prototype.render, U = (u = E.contextType) && n[u.__c], I = u ? U ? U.props.value : u.__ : n, t.__c ? k = (l = e.__c = t.__c).__ = l.__E : (y ? e.__c = l = new E(w, I) : (e.__c = l = new ge(w, I), l.constructor = E, l.render = Rt), U && U.sub(l), l.props = w, l.state || (l.state = {}), l.context = I, l.__n = n, _ = l.__d = !0, l.__h = [], l._sb = []), y && l.__s == null && (l.__s = l.state), y && E.getDerivedStateFromProps != null && (l.__s == l.state && (l.__s = $({}, l.__s)), $(l.__s, E.getDerivedStateFromProps(w, l.__s))), d = l.props, g = l.state, l.__v = e, _) y && E.getDerivedStateFromProps == null && l.componentWillMount != null && l.componentWillMount(), y && l.componentDidMount != null && l.__h.push(l.componentDidMount);
    else {
      if (y && E.getDerivedStateFromProps == null && w !== d && l.componentWillReceiveProps != null && l.componentWillReceiveProps(w, I), !l.__e && l.shouldComponentUpdate != null && l.shouldComponentUpdate(w, l.__s, I) === !1 || e.__v == t.__v) {
        for (e.__v != t.__v && (l.props = w, l.state = l.__s, l.__d = !1), e.__e = t.__e, e.__k = t.__k, e.__k.some(function(O) {
          O && (O.__ = e);
        }), V = 0; V < l._sb.length; V++) l.__h.push(l._sb[V]);
        l._sb = [], l.__h.length && o.push(l);
        break e;
      }
      l.componentWillUpdate != null && l.componentWillUpdate(w, l.__s, I), y && l.componentDidUpdate != null && l.__h.push(function() {
        l.componentDidUpdate(d, g, H);
      });
    }
    if (l.context = I, l.props = w, l.__P = i, l.__e = !1, W = b.__r, ne = 0, y) {
      for (l.state = l.__s, l.__d = !1, W && W(e), u = l.render(l.props, l.state, l.context), q = 0; q < l._sb.length; q++) l.__h.push(l._sb[q]);
      l._sb = [];
    } else do
      l.__d = !1, W && W(e), u = l.render(l.props, l.state, l.context), l.state = l.__s;
    while (l.__d && ++ne < 25);
    l.state = l.__s, l.getChildContext != null && (n = $($({}, n), l.getChildContext())), y && !_ && l.getSnapshotBeforeUpdate != null && (H = l.getSnapshotBeforeUpdate(d, g)), m = u, u != null && u.type === x && u.key == null && (m = ht(u.props.children)), a = ot(i, Fe(m) ? m : [m], e, t, n, r, s, o, a, c, h), l.base = e.__e, e.__u &= -161, l.__h.length && o.push(l), k && (l.__E = l.__ = null);
  } catch (O) {
    if (e.__v = null, c || s != null) if (O.then) {
      for (e.__u |= c ? 160 : 128; a && a.nodeType == 8 && a.nextSibling; ) a = a.nextSibling;
      s[s.indexOf(a)] = null, e.__e = a;
    } else for (F = s.length; F--; ) Ie(s[F]);
    else e.__e = t.__e, e.__k = t.__k;
    b.__e(O, e, t);
  }
  else s == null && e.__v == t.__v ? (e.__k = t.__k, e.__e = t.__e) : a = e.__e = Ft(t.__e, e, t, n, r, s, o, c, h);
  return (u = b.diffed) && u(e), 128 & e.__u ? void 0 : a;
}
function at(i, e, t) {
  for (var n = 0; n < t.length; n++) Oe(t[n], t[++n], t[++n]);
  b.__c && b.__c(e, i), i.some(function(r) {
    try {
      i = r.__h, r.__h = [], i.some(function(s) {
        s.call(r);
      });
    } catch (s) {
      b.__e(s, r.__v);
    }
  });
}
function ht(i) {
  return typeof i != "object" || i == null || i.__b && i.__b > 0 ? i : Fe(i) ? i.map(ht) : $({}, i);
}
function Ft(i, e, t, n, r, s, o, a, c) {
  var h, u, l, _, d, g, H, k = t.props, w = e.props, y = e.type;
  if (y == "svg" ? r = "http://www.w3.org/2000/svg" : y == "math" ? r = "http://www.w3.org/1998/Math/MathML" : r || (r = "http://www.w3.org/1999/xhtml"), s != null) {
    for (h = 0; h < s.length; h++) if ((d = s[h]) && "setAttribute" in d == !!y && (y ? d.localName == y : d.nodeType == 3)) {
      i = d, s[h] = null;
      break;
    }
  }
  if (i == null) {
    if (y == null) return document.createTextNode(w);
    i = document.createElementNS(r, y, w.is && w), a && (b.__m && b.__m(e, s), a = !1), s = null;
  }
  if (y == null) k === w || a && i.data == w || (i.data = w);
  else {
    if (s = s && be.call(i.childNodes), k = t.props || oe, !a && s != null) for (k = {}, h = 0; h < i.attributes.length; h++) k[(d = i.attributes[h]).name] = d.value;
    for (h in k) if (d = k[h], h != "children") {
      if (h == "dangerouslySetInnerHTML") l = d;
      else if (!(h in w)) {
        if (h == "value" && "defaultValue" in w || h == "checked" && "defaultChecked" in w) continue;
        de(i, h, null, d, r);
      }
    }
    for (h in w) d = w[h], h == "children" ? _ = d : h == "dangerouslySetInnerHTML" ? u = d : h == "value" ? g = d : h == "checked" ? H = d : a && typeof d != "function" || k[h] === d || de(i, h, d, k[h], r);
    if (u) a || l && (u.__html == l.__html || u.__html == i.innerHTML) || (i.innerHTML = u.__html), e.__k = [];
    else if (l && (i.innerHTML = ""), ot(e.type == "template" ? i.content : i, Fe(_) ? _ : [_], e, t, n, y == "foreignObject" ? "http://www.w3.org/1999/xhtml" : r, s, o, s ? s[0] : t.__k && ee(t, 0), a, c), s != null) for (h = s.length; h--; ) Ie(s[h]);
    a || (h = "value", y == "progress" && g == null ? i.removeAttribute("value") : g != null && (g !== i[h] || y == "progress" && !g || y == "option" && g != k[h]) && de(i, h, g, k[h], r), h = "checked", H != null && H != i[h] && de(i, h, H, k[h], r));
  }
  return i;
}
function Oe(i, e, t) {
  try {
    if (typeof i == "function") {
      var n = typeof i.__u == "function";
      n && i.__u(), n && e == null || (i.__u = i(e));
    } else i.current = e;
  } catch (r) {
    b.__e(r, t);
  }
}
function ct(i, e, t) {
  var n, r;
  if (b.unmount && b.unmount(i), (n = i.ref) && (n.current && n.current != i.__e || Oe(n, null, e)), (n = i.__c) != null) {
    if (n.componentWillUnmount) try {
      n.componentWillUnmount();
    } catch (s) {
      b.__e(s, e);
    }
    n.base = n.__P = null;
  }
  if (n = i.__k) for (r = 0; r < n.length; r++) n[r] && ct(n[r], e, t || typeof i.type != "function");
  t || Ie(i.__e), i.__c = i.__ = i.__e = void 0;
}
function Rt(i, e, t) {
  return this.constructor(i, t);
}
function Tt(i, e, t) {
  var n, r, s, o;
  e == document && (e = document.documentElement), b.__ && b.__(i, e), r = (n = !1) ? null : e.__k, s = [], o = [], Ne(e, i = e.__k = yt(x, null, [i]), r || oe, oe, e.namespaceURI, r ? null : e.firstChild ? be.call(e.childNodes) : null, s, r ? r.__e : e.firstChild, n, o), at(s, i, o);
}
function kt(i) {
  function e(t) {
    var n, r;
    return this.getChildContext || (n = /* @__PURE__ */ new Set(), (r = {})[e.__c] = this, this.getChildContext = function() {
      return r;
    }, this.componentWillUnmount = function() {
      n = null;
    }, this.shouldComponentUpdate = function(s) {
      this.props.value != s.value && n.forEach(function(o) {
        o.__e = !0, Ee(o);
      });
    }, this.sub = function(s) {
      n.add(s);
      var o = s.componentWillUnmount;
      s.componentWillUnmount = function() {
        n && n.delete(s), o && o.call(s);
      };
    }), t.children;
  }
  return e.__c = "__cC" + nt++, e.__ = i, e.Provider = e.__l = (e.Consumer = function(t, n) {
    return t.children(n);
  }).contextType = e, e;
}
be = st.slice, b = { __e: function(i, e, t, n) {
  for (var r, s, o; e = e.__; ) if ((r = e.__c) && !r.__) try {
    if ((s = r.constructor) && s.getDerivedStateFromError != null && (r.setState(s.getDerivedStateFromError(i)), o = r.__d), r.componentDidCatch != null && (r.componentDidCatch(i, n || {}), o = r.__d), o) return r.__E = r;
  } catch (a) {
    i = a;
  }
  throw i;
} }, Ze = 0, ge.prototype.setState = function(i, e) {
  var t;
  t = this.__s != null && this.__s != this.state ? this.__s : this.__s = $({}, this.state), typeof i == "function" && (i = i($({}, t), this.props)), i && $(t, i), i != null && this.__v && (e && this._sb.push(e), Ee(this));
}, ge.prototype.forceUpdate = function(i) {
  this.__v && (this.__e = !0, i && this.__h.push(i), Ee(this));
}, ge.prototype.render = x, z = [], et = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, tt = function(i, e) {
  return i.__v.__b - e.__v.__b;
}, ye.__r = 0, it = /(PointerCapture)$|Capture$/i, Le = 0, Pe = Me(!1), Se = Me(!0), nt = 0;
var Ct = 0;
function f(i, e, t, n, r, s) {
  e || (e = {});
  var o, a, c = e;
  if ("ref" in c) for (a in c = {}, e) a == "ref" ? o = e[a] : c[a] = e[a];
  var h = { type: i, props: c, key: t, ref: o, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --Ct, __i: -1, __u: 0, __source: r, __self: s };
  if (typeof i == "function" && (o = i.defaultProps)) for (a in o) c[a] === void 0 && (c[a] = o[a]);
  return b.vnode && b.vnode(h), h;
}
var te, T, Te, $e, le = 0, dt = [], C = b, Ue = C.__b, We = C.__r, Be = C.diffed, Ve = C.__c, qe = C.unmount, Ye = C.__;
function Re(i, e) {
  C.__h && C.__h(T, i, le || e), le = 0;
  var t = T.__H || (T.__H = { __: [], __h: [] });
  return i >= t.__.length && t.__.push({}), t.__[i];
}
function Pt(i) {
  return le = 1, St(ft, i);
}
function St(i, e, t) {
  var n = Re(te++, 2);
  if (n.t = i, !n.__c && (n.__ = [ft(void 0, e), function(a) {
    var c = n.__N ? n.__N[0] : n.__[0], h = n.t(c, a);
    c !== h && (n.__N = [h, n.__[1]], n.__c.setState({}));
  }], n.__c = T, !T.__f)) {
    var r = function(a, c, h) {
      if (!n.__c.__H) return !0;
      var u = n.__c.__H.__.filter(function(_) {
        return !!_.__c;
      });
      if (u.every(function(_) {
        return !_.__N;
      })) return !s || s.call(this, a, c, h);
      var l = n.__c.props !== a;
      return u.forEach(function(_) {
        if (_.__N) {
          var d = _.__[0];
          _.__ = _.__N, _.__N = void 0, d !== _.__[0] && (l = !0);
        }
      }), s && s.call(this, a, c, h) || l;
    };
    T.__f = !0;
    var s = T.shouldComponentUpdate, o = T.componentWillUpdate;
    T.componentWillUpdate = function(a, c, h) {
      if (this.__e) {
        var u = s;
        s = void 0, r(a, c, h), s = u;
      }
      o && o.call(this, a, c, h);
    }, T.shouldComponentUpdate = r;
  }
  return n.__N || n.__;
}
function re(i, e) {
  var t = Re(te++, 3);
  !C.__s && _t(t.__H, e) && (t.__ = i, t.u = e, T.__H.__h.push(t));
}
function A(i) {
  return le = 5, ut(function() {
    return { current: i };
  }, []);
}
function ut(i, e) {
  var t = Re(te++, 7);
  return _t(t.__H, e) && (t.__ = i(), t.__H = e, t.__h = i), t.__;
}
function X(i, e) {
  return le = 8, ut(function() {
    return i;
  }, e);
}
function Et(i) {
  var e = T.context[i.__c], t = Re(te++, 9);
  return t.c = i, e ? (t.__ == null && (t.__ = !0, e.sub(T)), e.props.value) : i.__;
}
function Ht() {
  for (var i; i = dt.shift(); ) if (i.__P && i.__H) try {
    i.__H.__h.forEach(me), i.__H.__h.forEach(He), i.__H.__h = [];
  } catch (e) {
    i.__H.__h = [], C.__e(e, i.__v);
  }
}
C.__b = function(i) {
  T = null, Ue && Ue(i);
}, C.__ = function(i, e) {
  i && e.__k && e.__k.__m && (i.__m = e.__k.__m), Ye && Ye(i, e);
}, C.__r = function(i) {
  We && We(i), te = 0;
  var e = (T = i.__c).__H;
  e && (Te === T ? (e.__h = [], T.__h = [], e.__.forEach(function(t) {
    t.__N && (t.__ = t.__N), t.u = t.__N = void 0;
  })) : (e.__h.forEach(me), e.__h.forEach(He), e.__h = [], te = 0)), Te = T;
}, C.diffed = function(i) {
  Be && Be(i);
  var e = i.__c;
  e && e.__H && (e.__H.__h.length && (dt.push(e) !== 1 && $e === C.requestAnimationFrame || (($e = C.requestAnimationFrame) || At)(Ht)), e.__H.__.forEach(function(t) {
    t.u && (t.__H = t.u), t.u = void 0;
  })), Te = T = null;
}, C.__c = function(i, e) {
  e.some(function(t) {
    try {
      t.__h.forEach(me), t.__h = t.__h.filter(function(n) {
        return !n.__ || He(n);
      });
    } catch (n) {
      e.some(function(r) {
        r.__h && (r.__h = []);
      }), e = [], C.__e(n, t.__v);
    }
  }), Ve && Ve(i, e);
}, C.unmount = function(i) {
  qe && qe(i);
  var e, t = i.__c;
  t && t.__H && (t.__H.__.forEach(function(n) {
    try {
      me(n);
    } catch (r) {
      e = r;
    }
  }), t.__H = void 0, e && C.__e(e, t.__v));
};
var ze = typeof requestAnimationFrame == "function";
function At(i) {
  var e, t = function() {
    clearTimeout(n), ze && cancelAnimationFrame(e), setTimeout(i);
  }, n = setTimeout(t, 100);
  ze && (e = requestAnimationFrame(t));
}
function me(i) {
  var e = T, t = i.__c;
  typeof t == "function" && (i.__c = void 0, t()), T = e;
}
function He(i) {
  var e = T;
  i.__c = i.__(), T = e;
}
function _t(i, e) {
  return !i || i.length !== e.length || e.some(function(t, n) {
    return t !== i[n];
  });
}
function ft(i, e) {
  return typeof e == "function" ? e(i) : e;
}
class j {
  static instance;
  listeners;
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    return j.instance || (j.instance = new j()), j.instance;
  }
  on(e, t) {
    this.listeners.has(e) || this.listeners.set(e, /* @__PURE__ */ new Set()), this.listeners.get(e)?.add(t);
  }
  off(e, t) {
    this.listeners.get(e)?.delete(t);
  }
  emit(e, t) {
    this.listeners.get(e)?.forEach((n) => {
      try {
        n(t);
      } catch (r) {
        console.error(`Error in event handler for ${String(e)}:`, r);
      }
    });
  }
  clear() {
    this.listeners.clear();
  }
  // 调试辅助方法
  getListenerCount(e) {
    return this.listeners.get(e)?.size || 0;
  }
  getAllEvents() {
    return Array.from(this.listeners.keys());
  }
}
const v = j.getInstance();
var R = /* @__PURE__ */ ((i) => (i.INITIAL = "initial", i.READY = "ready", i.RUNNING = "running", i.PAUSED = "paused", i.COOLDOWN = "cooldown", i.GAMEOVER = "gameover", i))(R || {}), K = /* @__PURE__ */ ((i) => (i.NORMAL = "normal", i.SPRING = "spring", i.CONVEYOR = "conveyor", i.ARROW = "arrow", i.FAKE = "fake", i))(K || {}), ie = /* @__PURE__ */ ((i) => (i.NORMAL = "normal", i.SPRING = "spring", i.LR = "lr", i.HURT = "hurt", i.ROLL = "roll", i))(ie || {});
const gt = kt(void 0), Lt = ({ children: i, config: e }) => {
  const t = A(null), n = A(null), r = A(null), s = A(e);
  let o = e.root || location.origin;
  o.at(-1) !== "/" && (o += "/"), s.current.root = o;
  const a = localStorage.getItem(s.current.lcPrefix + "best"), [c, h] = Pt({
    soundReady: !1,
    soundEnabled: !0,
    score: 0,
    bestScore: a ? Number(a) : 0,
    life: 10,
    level: 0,
    status: R.INITIAL
  }), u = (l, _, d) => {
    r.current || (r.current = { images: {}, sounds: {} }), r.current[_][l] = d.target, v.emit("resourceLoaded", { name: l, type: _ });
  };
  return /* @__PURE__ */ f(
    gt.Provider,
    {
      value: { gameState: c, setGameState: h, resources: r, config: s },
      children: [
        i,
        /* @__PURE__ */ f("div", { id: "downfloor-resources", children: [
          /* @__PURE__ */ f("div", { id: "downfloor-images-resources", ref: t, children: [
            /* @__PURE__ */ f(
              "img",
              {
                id: "downfloor-bg",
                src: `${o}images/bg.png`,
                crossorigin: "anonymous",
                onLoad: (l) => u("bg", "images", l)
              }
            ),
            /* @__PURE__ */ f(
              "img",
              {
                id: "downfloor-hero",
                src: `${o}images/hero.png`,
                crossorigin: "anonymous",
                onLoad: (l) => u("hero", "images", l)
              }
            )
          ] }),
          /* @__PURE__ */ f("div", { id: "downfloor-audio-resources", ref: n, children: [
            /* @__PURE__ */ f(
              "audio",
              {
                id: "downfloor-normal",
                src: `${o}sounds/normal.mp3`,
                crossorigin: "anonymous",
                onCanPlayThrough: (l) => u("normal", "sounds", l)
              }
            ),
            /* @__PURE__ */ f(
              "audio",
              {
                id: "downfloor-roll",
                src: `${o}sounds/roll.mp3`,
                crossorigin: "anonymous",
                onCanPlayThrough: (l) => u("roll", "sounds", l)
              }
            ),
            /* @__PURE__ */ f(
              "audio",
              {
                id: "downfloor-spring",
                src: `${o}sounds/spring.mp3`,
                crossorigin: "anonymous",
                onCanPlayThrough: (l) => u("spring", "sounds", l)
              }
            ),
            /* @__PURE__ */ f(
              "audio",
              {
                id: "downfloor-lr",
                src: `${o}sounds/lr.mp3`,
                crossorigin: "anonymous",
                onCanPlayThrough: (l) => u("lr", "sounds", l)
              }
            ),
            /* @__PURE__ */ f(
              "audio",
              {
                id: "downfloor-hurt",
                src: `${o}sounds/hurt.mp3`,
                crossorigin: "anonymous",
                onCanPlayThrough: (l) => u("hurt", "sounds", l)
              }
            ),
            /* @__PURE__ */ f(
              "audio",
              {
                id: "downfloor-dead",
                src: `${o}sounds/dead.mp3`,
                crossorigin: "anonymous",
                onCanPlayThrough: (l) => u("dead", "sounds", l)
              }
            )
          ] })
        ] })
      ]
    }
  );
}, mt = () => {
  const i = Et(gt);
  if (!i)
    throw new Error("useGameContext must be used within a GameProvider");
  return i;
}, It = 39, N = 0, M = 10, P = 320, L = 420 + N, p = 100, S = 12, ke = 60, G = S - 4, J = 32, we = 26, Ae = 3, pe = 15, Z = 5, Nt = 2e3, Ot = 1e3, Dt = P - M * 2, xe = -0.1, Ke = 15e-4, Gt = -0.5, se = 100, ue = 100, Y = 300, Mt = 0.1, $t = 0.2, Ce = 20, Ut = ({
  onGameStart: i,
  onGameRestart: e,
  onSoundToggle: t
}) => {
  const n = A(null), { gameState: r, setGameState: s, config: o } = mt(), a = o.current.i18n, c = () => {
    s((g) => ({
      ...g,
      soundEnabled: !g.soundEnabled
    })), t?.();
  }, h = () => {
    s((g) => ({ ...g, status: R.RUNNING })), i();
  }, u = () => {
    s((g) => ({
      ...g,
      status: R.RUNNING,
      life: 10,
      score: 0,
      level: 0
    })), e();
  }, l = () => {
    n.current && (n.current.style.opacity = "0", n.current.style.visibility = "hidden");
  }, _ = () => {
    n.current && (n.current.style.opacity = "1", n.current.style.visibility = "visible");
  }, d = () => {
    localStorage.removeItem(o.current.lcPrefix + "best"), s((g) => ({
      ...g,
      bestScore: 0
    })), l();
  };
  return /* @__PURE__ */ f(x, { children: [
    /* @__PURE__ */ f("div", { className: `downfloor-overlay-container ${r.status}`, children: [
      /* @__PURE__ */ f("div", { className: "downfloor-topbar", children: [
        /* @__PURE__ */ f("div", { className: "downfloor-life-container", children: [
          /* @__PURE__ */ f("span", { className: "downfloor-life-label", children: a.life }),
          /* @__PURE__ */ f("div", { className: "downfloor-life-bar", children: Array.from({ length: 10 }).map((g, H) => /* @__PURE__ */ f(
            "div",
            {
              className: `downfloor-life-bar-unit ${H < r.life ? "active" : ""}`
            },
            H
          )) })
        ] }),
        /* @__PURE__ */ f("div", { className: "downfloor-score-container", children: [
          /* @__PURE__ */ f("div", { className: "downfloor-score", children: [
            a.score,
            " ",
            r.score
          ] }),
          /* @__PURE__ */ f(
            "button",
            {
              disabled: !r.soundReady,
              className: "downfloor-sound-toggle",
              onClick: c,
              "aria-label": r.soundEnabled ? `${a.soundOn}` : `${a.soundOff}`,
              children: /* @__PURE__ */ f(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 256 256",
                  width: "18",
                  className: `downfloor-sound-icon ${r.soundEnabled ? "sound-on" : "sound-off"}`,
                  children: /* @__PURE__ */ f("g", { fill: "#000", "fill-rule": "nonzero", children: [
                    /* @__PURE__ */ f("path", { d: "M122 39c5 2 8 7 8 12v154c0 5-3 10-8 12s-10 1-14-3l-49-47H25c-7 0-13-6-13-13v-52c0-7 6-13 13-13h34l49-47c4-4 9-5 14-3ZM187 37c5-5 13-5 18 0a128 128 0 0 1 0 183c-5 5-13 5-18 0-5-6-5-14 0-19a102 102 0 0 0 0-146c-5-5-5-13 0-18Z" }),
                    /* @__PURE__ */ f("path", { d: "M150 73c5-5 13-5 18 0a78 78 0 0 1 23 55c0 21-8 40-23 54-5 5-13 5-18 0s-5-13 0-18a51 51 0 0 0 0-73c-5-5-5-13 0-18Z" })
                  ] })
                }
              )
            }
          )
        ] })
      ] }),
      r.status !== R.RUNNING && /* @__PURE__ */ f("div", { className: "downfloor-game-controls", children: [
        r.status === R.READY && /* @__PURE__ */ f(x, { children: [
          /* @__PURE__ */ f("button", { className: "downfloor-game-button", onClick: h, children: [
            a.start,
            /* @__PURE__ */ f("span", { className: "downfloor-game-button-hint", children: a.keyHint })
          ] }),
          /* @__PURE__ */ f("div", { className: "downfloor-best-score", children: [
            a.best,
            " ",
            r.bestScore
          ] }),
          /* @__PURE__ */ f("div", { className: "downfloor-reset-button", onClick: _, children: a.reset })
        ] }),
        r.status === R.PAUSED && /* @__PURE__ */ f("button", { className: "downfloor-game-button", onClick: h, children: [
          a.continue,
          /* @__PURE__ */ f("span", { className: "downfloor-game-button-hint", children: a.keyHint })
        ] }),
        r.status === R.COOLDOWN && /* @__PURE__ */ f("div", { className: "downfloor-game-over-text", children: a.gameOver }),
        r.status === R.GAMEOVER && /* @__PURE__ */ f(x, { children: [
          /* @__PURE__ */ f(
            "button",
            {
              className: `downfloor-game-button ${r.status === R.GAMEOVER ? "restart-visible" : "restart-hidden"}`,
              onClick: u,
              children: [
                a.restart,
                /* @__PURE__ */ f("span", { className: "downfloor-game-button-hint", children: a.keyHint })
              ]
            }
          ),
          /* @__PURE__ */ f("div", { className: "downfloor-best-score", children: [
            a.best,
            " ",
            r.bestScore
          ] }),
          /* @__PURE__ */ f("div", { className: "downfloor-reset-button", onClick: _, children: a.reset })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f(
      "div",
      {
        id: "downfloor-modal-container",
        className: "downfloor-modal-container",
        ref: n,
        children: /* @__PURE__ */ f("div", { className: "downfloor-modal-box", children: [
          /* @__PURE__ */ f("div", { className: "downfloor-modal-text", children: a.resetConfirm }),
          /* @__PURE__ */ f("div", { className: "downfloor-modal-action", children: [
            /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: "downfloor-modal-btn reset-button",
                onClick: d,
                children: a.confirm
              }
            ),
            /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: "downfloor-modal-btn",
                onClick: l,
                children: a.cancel
              }
            )
          ] })
        ] })
      }
    )
  ] });
};
class Wt {
  x;
  y;
  width;
  height;
  heroSprite;
  feetWidth;
  // Store feet width for debugging if needed
  direction;
  // left -1, stay 0, right 1
  onFloor;
  vx;
  vy;
  life;
  lastHurtTime;
  // Time when hero was last hurt
  lastHealTime;
  // Time when hero last healed
  tintCanvas;
  tintCtx;
  frameIndex;
  frameTime;
  hurtTime;
  blinkTime;
  blink;
  spritePositions = {
    standing: {
      middle: [0],
      right: [32, 64, 96]
      // Walking animation frames
    },
    falling: {
      middle: [128, 160, 192],
      // Falling animation frames
      right: [128, 160, 192]
      // Same frames for falling right
    }
  };
  constructor(e = 0, t = 0, n) {
    this.heroSprite = n, this.x = e, this.y = t, this.width = J, this.height = J, this.feetWidth = we, this.direction = 0, this.onFloor = null, this.vx = 0, this.vy = 0, this.life = 10, this.lastHurtTime = 0, this.lastHealTime = 0, this.tintCanvas = document.createElement("canvas"), this.tintCanvas.width = J, this.tintCanvas.height = J;
    const r = this.tintCanvas.getContext("2d", { willReadFrequently: !0 });
    if (!r)
      throw new Error("Failed to get 2D context for tint canvas");
    this.tintCtx = r, this.frameIndex = 0, this.frameTime = 0, this.hurtTime = 0, this.blinkTime = 0, this.blink = !1;
  }
  turnLeft() {
    this.direction = -1;
  }
  turnRight() {
    this.direction = 1;
  }
  stay() {
    this.direction = 0;
  }
  draw(e, t) {
    e.save(), e.imageSmoothingEnabled = !1, this.direction < 0 ? (e.scale(-1, 1), e.translate(-this.x - this.width, this.y)) : e.translate(this.x, this.y);
    const n = this.life < 10 && this.hurtTime > 0 && t - this.hurtTime < 1e3;
    n ? (this.blinkTime < this.hurtTime || t - this.blinkTime >= 100) && (this.blinkTime = t, this.blink = !this.blink) : this.blink = !1;
    const r = this.onFloor ? this.spritePositions.standing : this.spritePositions.falling, s = this.direction === 0 ? r.middle : r.right;
    t - this.frameTime >= 60 && (this.frameTime = t, ++this.frameIndex), this.frameIndex = this.frameIndex % s.length, n ? (this.drawHurtEffect(this.heroSprite, s[this.frameIndex]), e.drawImage(
      this.tintCanvas,
      0,
      0,
      this.width,
      this.height,
      0,
      -this.height,
      this.width,
      this.height
    )) : e.drawImage(
      this.heroSprite,
      // @todo, $res.hero, image
      s[this.frameIndex],
      0,
      32,
      32,
      0,
      -this.height,
      this.width,
      this.height
    ), e.restore();
  }
  drawHurtEffect(e, t) {
    this.tintCtx.clearRect(0, 0, this.width, this.height), this.tintCtx.imageSmoothingEnabled = !1, this.tintCtx.drawImage(
      e,
      t,
      0,
      32,
      32,
      0,
      0,
      this.width,
      this.height
    );
    const n = this.tintCtx.getImageData(0, 0, this.width, this.height), r = n.data;
    for (let s = 0; s < r.length; s += 4)
      if (r[s + 3] > 0) {
        const o = this.blink ? 1.7 : 1.3;
        r[s] = Math.min(255, r[s] * o), r[s + 1] *= 0.5, r[s + 2] *= 0.5;
      }
    this.tintCtx.putImageData(n, 0, 0);
  }
  regain() {
    this.life < 10 && (++this.life, v.emit("heroHealed", { life: this.life }));
  }
  hurt(e, t) {
    this.hurtTime = t, this.lastHurtTime = t, this.life = Math.max(0, this.life - e), v.emit("heroDamaged", { life: this.life });
  }
  checkHealing(e) {
    this.life < 10 && e - this.lastHurtTime >= Nt && e - this.lastHealTime >= Ot && (this.lastHealTime = e, this.regain());
  }
  // // 可选: 用于调试的碰撞箱绘制
  drawHitbox(e) {
    e.save(), e.translate(this.x, this.y), e.strokeStyle = "red", e.lineWidth = 1, e.strokeRect(Ae, -5, we, 5), e.restore();
  }
}
const Bt = {
  lcPrefix: "downdd-",
  levelConfig: [
    {
      level_threshold: 20,
      floor_chances: [10, 3, 1, 1, 1, 2],
      // [regular, fake, arrow, rollingLeft, rollingRight, spring]
      speed_boost: 1.01
      // make all speed goes 1% faster
    },
    {
      level_threshold: 40,
      floor_chances: [7, 3, 1, 1, 1, 2],
      // fewer regular floors
      speed_boost: 1.04
      // make all speed goes 4% faster
    },
    {
      level_threshold: 60,
      floor_chances: [5, 4, 2, 2, 2, 3],
      // much fewer regular floors
      speed_boost: 1.08
      // 8% faster
    },
    {
      level_threshold: 80,
      floor_chances: [3, 5, 3, 3, 3, 3],
      // very few regular floors
      speed_boost: 1.12
      // 12% faster
    }
  ],
  i18n: {
    life: "HP:",
    score: "Floor:",
    soundOn: "Sound: ON",
    soundOff: "Sound: OFF",
    start: "Start",
    gameOver: "Game Over",
    restart: "Restart",
    continue: "Continue",
    keyHint: "(Space / Enter)",
    best: "BEST:",
    reset: "RESET",
    resetConfirm: "Are you sure you want to reset the best score?",
    confirm: "Confirm",
    cancel: "Cancel"
  }
};
function Xe(i, e, t, n, r, s) {
  n < 2 * s && (s = n * 0.5), r < 2 * s && (s = r * 0.5), i.beginPath(), i.moveTo(e + s, t), i.arcTo(e + n, t, e + n, t + r, s), i.arcTo(e + n, t + r, e, t + r, s), i.arcTo(e, t + r, e, t, s), i.arcTo(e, t, e + n, t, s), i.closePath();
}
class Q {
  _state = {
    seq: 0,
    running: !1
  };
  static instance;
  constructor() {
  }
  static getInstance() {
    return Q.instance || (Q.instance = new Q()), Q.instance;
  }
  start() {
    this._state.running = !0;
  }
  get() {
    return this._state.running ? this._state.seq++ : 0;
  }
  reset() {
    this._state = {
      seq: 0,
      running: !1
    };
  }
  current() {
    return this._state.seq;
  }
  isRunning() {
    return this._state.running;
  }
  getState() {
    return { ...this._state };
  }
}
const ve = Q.getInstance(), ae = (i) => Math.floor(i * 0.2);
class he {
  x;
  y;
  seq;
  type = K.NORMAL;
  constructor(e, t, n) {
    this.x = e, this.y = t, this.seq = ve.get(), this.type = n;
  }
}
const RC = { normal: null, conveyorLeft: new Map(), conveyorRight: new Map(), spike: null, fake: null };
function CC(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function PWConveyor() {
  const build = (dir, map) => {
    for (let o = 0; o <= 20; o++) {
      for (let h = 0; h < 4; h++) {
        const k = o + ":" + h;
        if (!map.get(k)) {
          const c = CC(p, S); const g = c.getContext("2d");
          PlatformStyles.drawConveyorPlatform(g, 0, S, p, S, dir, o, h);
          map.set(k, c);
        }
      }
    }
  };
  build("left", RC.conveyorLeft);
  build("right", RC.conveyorRight);
}
class D extends he {
  static pattern;
  constructor(e, t) {
    super(e, t, K.NORMAL);
  }
  draw(e) {
    if (!RC.normal) { const c = CC(p, S); const g = c.getContext("2d"); PlatformStyles.drawNormalPlatform(g, 0, S, p, S); RC.normal = c; }
    e.drawImage(RC.normal, this.x, this.y - S);
  }
  getHeight() {
    return S;
  }
  landing(e, t) {
    e.vy = t, v.emit("scoreUpdate", ae(this.seq)), v.emit("floorLanding", { type: ie.NORMAL });
  }
  // do nothing
  standing() {
  }
  leaving() {
  }
}
class je extends he {
  spring = G;
  restoring = !1;
  touchTime = 0;
  leavingTime = 0;
  constructor(e, t) {
    super(e, t, K.SPRING);
  }
  getHeight() {
    return this.spring + 4;
  }
  draw(e, t) {
    this.restoring && this.restore(t);
    PlatformStyles.drawSpringPlatform(
      e, this.x, this.y, p, S, this.spring, t
    );
  }
  landing(e, t, n) {
    this.touchTime = n, this.spring = G, e.vy = t, v.emit("scoreUpdate", ae(this.seq)), v.emit("floorLanding", { type: ie.SPRING });
  }
  standing(e, t) {
    const n = t - this.touchTime;
    n < se ? this.spring = G - n / se * 5 : n < se * 2 ? this.spring = G - 15 + n / se * 10 : (e.vy = Gt, e.onFloor = null, this.leaving(e, t));
  }
  leaving(e, t) {
    this.leavingTime = t, this.restoring = !0;
  }
  restore(e) {
    const t = e - this.leavingTime, n = 5 / se * t;
    this.spring < G ? (this.spring += n, this.spring >= G && (this.spring = G, this.restoring = !1)) : (this.spring -= n, this.spring <= G && (this.spring = G, this.restoring = !1));
  }
}
class _e extends he {
  direction;
  offset;
  arrowHighlightIndex = 0;
  // Track which arrow should be yellow
  highlightCounter = 0;
  // Counter for faster highlight animation
  constructor(e, t, n) {
    super(e, t, K.CONVEYOR), this.direction = n, this.offset = n === "left" ? 0 : 20;
  }
  getHeight() {
    return S;
  }
  draw(e) {
    this.direction === "left" ? ++this.offset >= 20 && (this.offset = 0) : --this.offset < 0 && (this.offset = 20);
    ++this.highlightCounter >= 7 && (this.highlightCounter = 0, this.arrowHighlightIndex = (this.arrowHighlightIndex - 1 + 4) % 4);
    const m = this.direction === "left" ? RC.conveyorLeft : RC.conveyorRight;
    const k = this.offset + ":" + this.arrowHighlightIndex;
    let img = m.get(k);
    if (!img) { img = CC(p, S); const g = img.getContext("2d"); PlatformStyles.drawConveyorPlatform(g, 0, S, p, S, this.direction, this.offset, this.arrowHighlightIndex); m.set(k, img); }
    e.drawImage(img, this.x, this.y - S);
  }
  landing(e, t) {
    e.vy = t, e.vx = this.direction === "left" ? -0.1 : Mt, v.emit("scoreUpdate", ae(this.seq)), v.emit("floorLanding", { type: ie.LR });
  }
  leaving(e) {
    e.vx = 0;
  }
  // do nothing
  standing() {
  }
}
class Je extends he {
  constructor(e, t) {
    super(e, t, K.ARROW);
  }
  getHeight() {
    return S;
  }
  draw(e) {
    if (!RC.spike) { const c = CC(p, S + 12); const g = c.getContext("2d"); PlatformStyles.drawSpikePlatform(g, 0, S + 12, p, S); RC.spike = c; }
    e.drawImage(RC.spike, this.x, this.y - S - 12);
    const t = Date.now();
    if (Math.sin(t * 0.003) > 0.7) { e.fillStyle = "rgba(239, 68, 68, 0.2)"; e.fillRect(this.x, this.y - S - 12, p, S + 12); }
  }
  landing(e, t, n) {
    e.vy = t, e.hurt(4, n), v.emit("scoreUpdate", ae(this.seq)), v.emit("floorLanding", { type: ie.HURT });
  }
  // do nothing
  standing() {
  }
  leaving() {
  }
}
class Qe extends he {
  height = S;
  restoring = !1;
  touchTime = 0;
  constructor(e, t) {
    super(e, t, K.FAKE);
  }
  getHeight() {
    return this.height;
  }
  draw(e, t) {
    this.restoring && this.restore(t);
    if (this.height === S) {
      if (!RC.fake) { const c = CC(p, S); const g = c.getContext("2d"); PlatformStyles.drawFakePlatform(g, 0, S, p, S, S); RC.fake = c; }
      e.drawImage(RC.fake, this.x, this.y - S);
    } else {
      PlatformStyles.drawFakePlatform(e, this.x, this.y, p, S, this.height, t);
    }
  }
  landing(e, t, n) {
    this.touchTime = n, e.vy = t, v.emit("scoreUpdate", ae(this.seq)), v.emit("floorLanding", { type: ie.ROLL });
  }
  standing(e, t) {
    const n = t - this.touchTime;
    n < ue ? this.height = S : n < Y ? this.height = S / (ue - Y) * (n - Y) : (this.height = 0, e.onFloor = null, this.leaving(e, t));
  }
  leaving(e, t) {
    const n = t - this.touchTime;
    n >= ue && n < Y && (this.restoring = !0);
  }
  restore(e) {
    const t = e - this.touchTime;
    t < Y ? this.height = S / (ue - Y) * (t - Y) : (this.height = 0, this.restoring = !1);
  }
}
class Vt {
  constructor(e, t, n = [
    {
      level_threshold: 999999,
      // Effectively infinite
      floor_chances: [5, 1, 1, 1, 1, 1],
      // Default distribution
      speed_boost: 1
      // Default speed
    }
  ]) {
    this.ctx = e, this.resources = t, this.levelConfig = n, this.init();
  }
  hero = null;
  floors = [];
  bgCanvas = null;
  wallsCanvas = null;
  ceilingCanvas = null;
  score = 0;
  isRunning = !1;
  isPaused = !1;
  lastTime = 0;
  animationFrameId = null;
  floorVelocity = xe;
  level = 0;
  baseFloorVelocity = xe;
  init() {
    this.prepareStaticLayers(), PWConveyor(), this.resetGameState(), this.initEventListeners();
  }
  resetGameState() {
    ve.reset(), this.floors = [], this.hero = new Wt(
      (P - J) * 0.5,
      L - ke,
      this.resources.images.hero
    ), this.level = 0, this.score = 0, this.floorVelocity = this.baseFloorVelocity * this.levelConfig[0].speed_boost, this.isRunning = !1, this.lastTime = 0;
  }
  initEventListeners() {
    this.removeEventListeners(), v.on("scoreUpdate", this.handleScoreUpdate.bind(this));
  }
  removeEventListeners() {
    v.off("scoreUpdate", this.handleScoreUpdate.bind(this));
  }
  /** =================== Render functions =================== */
  prepareStaticLayers() {
    const bc = document.createElement("canvas");
    bc.width = P; bc.height = L;
    const bctx = bc.getContext("2d");
    if (!bctx) throw new Error("Canvas context is not available");
    if (this.resources.images.bg) {
      const pat = bctx.createPattern(this.resources.images.bg, "repeat");
      if (pat) { bctx.fillStyle = pat; bctx.fillRect(0, N, P, L - N); }
    }
    this.bgCanvas = bc;
    const wc = document.createElement("canvas");
    wc.width = P; wc.height = L;
    const wctx = wc.getContext("2d");
    for (let t = N; t < L; t += 20) {
      wctx.save(); wctx.translate(0, t);
      D.pattern ? wctx.fillStyle = D.pattern : wctx.fillStyle = "#FFF"; wctx.fillRect(0, 0, M, 20);
      wctx.fillStyle = "#D3F8FF"; wctx.fillRect(0, 0, M, 2); wctx.fillRect(0, 0, 2, 20);
      wctx.fillStyle = "#000E5C"; wctx.fillRect(0, 20 - 2, M, 2); wctx.fillRect(M - 2, 0, 2, 20); wctx.restore();
    }
    for (let t = N; t < L; t += 20) {
      wctx.save(); wctx.translate(P - M, t);
      D.pattern ? wctx.fillStyle = D.pattern : wctx.fillStyle = "#FFF"; wctx.fillRect(0, 0, M, 20);
      wctx.fillStyle = "#D3F8FF"; wctx.fillRect(0, 0, M, 2); wctx.fillRect(0, 0, 2, 20);
      wctx.fillStyle = "#000E5C"; wctx.fillRect(0, 20 - 2, M, 2); wctx.fillRect(M - 2, 0, 2, 20); wctx.restore();
    }
    this.wallsCanvas = wc;
    const cc = document.createElement("canvas");
    cc.width = P; cc.height = L;
    const cctx = cc.getContext("2d");
    const t = N, n = cctx.createLinearGradient(0, t + 10 / 2, P, t + 10 / 2);
    n.addColorStop(0, "#FFFFFF"); n.addColorStop(0.5, "#000000"); n.addColorStop(1, "#FFFFFF");
    cctx.fillStyle = n; cctx.fillRect(1, t + 1, P - 2, 8);
    cctx.fillStyle = "#999"; cctx.fillRect(0, t, P, 1); cctx.fillRect(0, t, 1, 10);
    cctx.fillStyle = "#000"; cctx.fillRect(P - 1, t, 1, 10); cctx.fillRect(0, t + 10 - 1, P, 1);
    for (let r = 0.5; r < P; r += Z * 2) {
      const s = r, o = r + Z, a = Math.min(r + Z * 2, P - 0.5), c = cctx.createLinearGradient(s, N + pe / 2, a, N + pe / 2);
      c.addColorStop(0, "#333333"); c.addColorStop(0.5, "#FFFFFF"); c.addColorStop(1, "#333333");
      cctx.beginPath(); cctx.moveTo(s, t + 10); cctx.lineTo(o, t + 10 + pe); cctx.lineTo(a, t + 10); cctx.closePath();
      cctx.fillStyle = c; cctx.fill(); cctx.strokeStyle = "#555"; cctx.lineWidth = 0.5; cctx.stroke();
    }
    this.ceilingCanvas = cc;
  }
  /** =================== Update on Frame functions =================== */
  generateFloor() {
    const e = this.floors.length == 0, t = this.floors[this.floors.length - 1];
    let n = t && t.y || 0;
    const r = this.levelConfig[this.level].floor_chances;
    for (; n < L; ) {
      n += ke;
      const s = n;
      let o = M + Math.round(Math.random() * (Dt - p)), a;
      if (e && s > L - ke) {
        ve.start(), o = (P - p) * 0.5, a = new D(o, s), this.floors.push(a);
        continue;
      }
      if (r && r.length >= 6) {
        const c = r.reduce((l, _) => l + _, 0), h = Math.random() * c;
        let u = 0;
        (u += r[0]) > h ? a = new D(o, s) : (u += r[1]) > h ? a = new Qe(o, s) : (u += r[2]) > h ? a = new Je(o, s) : (u += r[3]) > h ? a = new _e(o, s, "left") : (u += r[4]) > h ? a = new _e(o, s, "right") : a = new je(o, s);
      } else {
        const c = window.DEBUG_FLOOR || Math.random();
        c > 0.5 ? a = new D(o, s) : c > 0.4 ? a = new Qe(o, s) : c > 0.3 ? a = new Je(o, s) : c > 0.2 ? a = new _e(o, s, "left") : c > 0.1 ? a = new _e(o, s, "right") : a = new je(o, s);
      }
      this.floors.push(a);
    }
  }
  removeOutboundFloor() {
    let e = 0;
    for (e = 0; e < this.floors.length && !(this.floors[e].y >= N); e++)
      ;
    e > 0 && this.floors.splice(0, e);
  }
  updateHeroHorizontalPosition(e, t) {
    if (!this.hero) return;
    const n = this.hero.vx + this.hero.direction * $t;
    if (n !== 0 && (this.hero.x = Math.min(
      Math.max(M, this.hero.x + n * e),
      P - M - J
    ), this.hero.onFloor)) {
      const r = this.hero.onFloor, s = this.hero.x + Ae;
      (s + we <= r.x || s >= r.x + p) && (this.hero.onFloor = null, r.leaving(this.hero, t));
    }
  }
  updateAllVerticalPositions(e, t) {
    const n = e * this.floorVelocity, r = this.floors.length;
    for (let s = 0; s < r; ++s)
      this.floors[s].y += n;
    if (this.hero)
      if (this.hero.onFloor) {
        const s = this.hero.onFloor;
        this.hero.y = s.y - s.getHeight();
      } else {
        const s = this.hero.vy * e + 0.5 * Ke * e * e, o = this.hero.y + s;
        let a = !1;
        const c = this.hero.x + Ae, h = c + we;
        for (let u = 0; u < r; ++u) {
          const l = this.floors[u];
          if (l.x < h && l.x + p > c && l.getHeight() > 0 && o >= l.y - l.getHeight() && this.hero.y < l.y - l.getHeight() - n) {
            window.DEBUG && console.info(
              o,
              l.y - l.getHeight(),
              this.hero.y,
              l.y - l.getHeight() - n
            ), this.hero.y = l.y - l.getHeight(), this.hero.onFloor = l, l.landing(this.hero, this.floorVelocity, t), a = !0;
            break;
          }
        }
        a || (this.hero.y = o, this.hero.vy += Ke * e);
      }
  }
  checkHittingTop(e) {
    if (this.hero && this.hero.y - this.hero.height < N && (this.hero.y = N + this.hero.height, this.hero.vy = 0, this.hero.hurt(5, e), this.hero.onFloor)) {
      const t = this.hero.onFloor;
      this.hero.onFloor = null, t.leaving(this.hero, e);
    }
  }
  checkGameOver() {
    return !this.hero || this.hero.y > L + this.hero.height || this.hero.life <= 0;
  }
  update(e, t) {
    return this.hero ? (this.hero.onFloor && this.hero.onFloor.standing(this.hero, t), this.hero.checkHealing(t), this.generateFloor(), this.removeOutboundFloor(), this.updateHeroHorizontalPosition(e, t), this.updateAllVerticalPositions(e, t), this.checkHittingTop(t), this.checkGameOver()) : !0;
  }
  /** =================== Update on Game functions =================== */
  updateLevel() {
    for (; this.level < this.levelConfig.length - 1 && this.score >= this.levelConfig[this.level + 1].level_threshold; ) {
      this.level++;
      const e = this.levelConfig[this.level];
      this.floorVelocity = this.baseFloorVelocity * e.speed_boost, console.info(
        `Difficulty increased to level: ${this.level}, at score: ${this.score}, speed boost: ${e.speed_boost}`
      );
    }
  }
  handleGameOver() {
    this.isRunning = !1, v.emit("gameOver");
  }
  handleScoreUpdate = (e) => {
    e !== this.score && (this.score = e, this.updateLevel());
  };
  frameLoop = (e) => {
    if (!this.isRunning || !this.hero) return;
    this.lastTime || (this.lastTime = e);
    const t = e - this.lastTime;
    if (t > 2e3) {
      console.info("Pause, duration: " + t), this.pause(), v.emit("gamePaused");
      return;
    }
    let n = !1, r = t;
    for (; r > Ce && (n = this.update(Ce, e - r), !n); )
      r -= Ce;
    n || (n = this.update(r, e)), n && this.handleGameOver(), this.render(e), this.lastTime = e, this.isRunning && (this.animationFrameId = requestAnimationFrame(this.frameLoop));
  };
  /** =================== Public Functions to Control Game =================== */
  // will call render() on resize, so make it public
  render(e) {
    this.ctx.imageSmoothingEnabled = !1, this.ctx.clearRect(0, 0, P, L), this.bgCanvas && this.ctx.drawImage(this.bgCanvas, 0, 0), this.wallsCanvas && this.ctx.drawImage(this.wallsCanvas, 0, 0), this.floors.forEach((t) => t.draw(this.ctx, e)), this.hero && this.hero.draw(this.ctx, e), this.ceilingCanvas && this.ctx.drawImage(this.ceilingCanvas, 0, 0);
  }
  start() {
    this.isRunning || (this.isPaused ? this.resume() : (this.resetGameState(), this.isRunning = !0, this.isPaused = !1, this.lastTime = 0, this.animationFrameId = requestAnimationFrame(this.frameLoop)));
  }
  moveLeft() {
    this.isRunning && this.hero && this.hero.turnLeft();
  }
  moveRight() {
    this.isRunning && this.hero && this.hero.turnRight();
  }
  stay() {
    this.isRunning && this.hero && this.hero.stay();
  }
  pause() {
    this.isRunning && (this.isRunning = !1, this.isPaused = !0, this.animationFrameId && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null));
  }
  resume() {
    this.isPaused && (this.isRunning = !0, this.isPaused = !1, this.lastTime = performance.now(), this.animationFrameId = requestAnimationFrame(this.frameLoop));
  }
  destroy() {
    this.isRunning = !1, this.isPaused = !1, this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null), this.removeEventListeners(), this.lastTime = 0, this.level = 0, this.score = 0, this.hero = null, this.floors = [], ve.reset(), this.ctx && this.ctx.clearRect(0, 0, P, L);
  }
}
const qt = ({
  onLeft: i,
  onRight: e,
  onStay: t,
  onSpace: n,
  onSpaceUp: r,
  enabled: s = !0
}) => {
  const o = A({
    leftPressed: null,
    rightPressed: null,
    spacePressed: null
  }), a = X(
    (d) => {
      if (s)
        switch (d.keyCode) {
          case 37:
            o.current.leftPressed = 0, i?.(), d.preventDefault(), d.stopPropagation();
            break;
          case 39:
            o.current.rightPressed = 0, e?.(), d.preventDefault(), d.stopPropagation();
            break;
          case 32:
          // space
          case 13:
            o.current.spacePressed || (o.current.spacePressed = 0, n?.()), d.preventDefault(), d.stopPropagation();
            break;
        }
    },
    [s, i, e, n]
  ), c = X(
    (d) => {
      if (s)
        switch (d.keyCode) {
          case 37:
            o.current.leftPressed = null, o.current.rightPressed !== null ? e?.() : t?.();
            break;
          case 39:
            o.current.rightPressed = null, o.current.leftPressed !== null ? i?.() : t?.();
            break;
          case 32:
          // space
          case 13:
            o.current.spacePressed !== null && (o.current.spacePressed = null, r?.());
            break;
        }
    },
    [s, i, e, t, r]
  ), h = X(
    (d) => {
      if (!s) return;
      const g = d.changedTouches[0];
      g && (g.clientX < window.innerWidth * 0.5 ? (o.current.leftPressed = g.identifier, i?.(), d.preventDefault(), d.stopPropagation()) : (o.current.rightPressed = g.identifier, e?.(), d.preventDefault(), d.stopPropagation()));
    },
    [s, i, e]
  ), u = X(
    (d) => {
      if (!s) return;
      const g = d.changedTouches[0];
      g && (g.identifier === o.current.leftPressed ? (o.current.leftPressed = null, o.current.rightPressed !== null ? e?.() : t?.()) : g.identifier === o.current.rightPressed ? (o.current.rightPressed = null, o.current.leftPressed !== null ? i?.() : t?.()) : g.identifier === o.current.spacePressed && (o.current.spacePressed = null, r?.()));
    },
    [s, i, e, t, r]
  ), l = X(
    (d) => {
      if (!s) return;
      const g = d.changedTouches[0];
      g && (g.identifier === o.current.leftPressed ? (o.current.leftPressed = null, o.current.rightPressed !== null ? e?.() : t?.()) : g.identifier === o.current.rightPressed && (o.current.rightPressed = null, o.current.leftPressed !== null ? i?.() : t?.()));
    },
    [s, i, e, t]
  ), _ = X(
    () => {
      s && o.current.spacePressed !== null && (o.current.spacePressed = null, r?.());
    },
    [s, r]
  );
  return re(() => {
    if (s)
      return window.addEventListener("keydown", a), window.addEventListener("keyup", c), window.addEventListener("touchstart", h), window.addEventListener("touchend", u), window.addEventListener("touchcancel", l), window.addEventListener("touchmove", _), () => {
        window.removeEventListener("keydown", a), window.removeEventListener("keyup", c), window.removeEventListener("touchstart", h), window.removeEventListener("touchend", u), window.removeEventListener("touchcancel", l), window.removeEventListener("touchmove", _);
      };
  }, [
    s,
    a,
    c,
    h,
    u,
    l,
    _
  ]), o.current;
};
function Yt() {
  const i = A(null), e = A(null), t = A(null), n = A(null), r = A(), { gameState: s, setGameState: o, resources: a, config: c } = mt(), h = A(s.soundEnabled), u = A(s.soundReady);
  re(() => {
    h.current = s.soundEnabled;
  }, [s.soundEnabled]), re(() => {
    u.current = s.soundReady;
  }, [s.soundReady]);
  const l = () => {
    n.current?.start();
  };
  qt({
    onLeft: () => {
      n.current?.moveLeft();
    },
    onRight: () => {
      n.current?.moveRight();
    },
    onStay: () => {
      n.current?.stay();
    },
    onSpace: () => {
      switch (s.status) {
        case R.READY:
          o((m) => ({ ...m, status: R.RUNNING })), l();
          break;
        case R.GAMEOVER:
          o((m) => ({
            ...m,
            status: R.RUNNING,
            life: 10,
            score: 0,
            level: 0
          })), l();
          break;
        case R.RUNNING:
          o((m) => ({ ...m, status: R.PAUSED })), n.current?.pause();
          break;
        case R.PAUSED:
          o((m) => ({ ...m, status: R.RUNNING })), n.current?.resume();
          break;
      }
    },
    // 移动控制只在游戏运行时启用，但空格键在任何状态都可用
    enabled: !0
  });
  const k = (m) => {
    if (!u.current)
      return;
    const F = a.current?.sounds?.[m];
    F && (F.currentTime = 0, F.play());
  }, w = () => {
    const m = i.current, F = e.current, E = t.current;
    if (!m || !F || !E) return;
    const B = m.clientWidth / P;
    F.style.width = `${P * B}px`, F.style.height = `${L * B}px`, m.style.height = `${L * B + It}px`;
    const ce = window.devicePixelRatio || 1;
    if (F.width = P * B * ce, F.height = L * B * ce, E.setTransform(B * ce, 0, 0, B * ce, 0, 0), n.current) {
      const pt = performance.now();
      n.current.render(pt);
    }
  };
  re(() => {
    const m = i.current, F = e.current;
    if (!m || !F) return;
    const E = F.getContext("2d", { willReadFrequently: !0 });
    if (!E) {
      console.error("Failed to get 2D context");
      return;
    }
    t.current = E;
    const O = () => {
      w(), s.status === R.RUNNING && F.scrollIntoView();
    };
    return window.ResizeObserver && new ResizeObserver(O).observe(m), window.addEventListener("resize", O), w(), () => {
      window.removeEventListener("resize", O);
    };
  }, []);
  const y = () => {
    if (t.current && a.current?.images?.bg && a.current?.images?.hero && !n.current) {
      o((m) => ({
        ...m,
        status: R.READY
      }));
      n.current = new Vt(
        t.current,
        a.current,
        c.current?.levelConfig
      );
      n.current.render(0);
    }
    if (a.current?.sounds?.normal && a.current?.sounds?.roll && a.current?.sounds?.spring && a.current?.sounds?.lr && a.current?.sounds?.hurt && a.current?.sounds?.dead) {
      o((m) => ({
        ...m,
        soundReady: !0
      }));
    }
  }, U = ({ type: m }) => {
    h.current && k(m);
  }, I = () => {
    h.current && k("dead"), o((m) => ({
      ...m,
      status: R.COOLDOWN
    })), r.current && clearTimeout(r.current), r.current = setTimeout(() => {
      o((m) => ({
        ...m,
        status: R.GAMEOVER
      }));
    }, 1500);
  }, V = () => {
    o((m) => ({ ...m, status: R.PAUSED }));
  }, W = ({ life: m }) => {
    h.current && k("hurt"), o((F) => ({ ...F, life: m }));
  }, ne = ({ life: m }) => {
    o((F) => ({ ...F, life: m }));
  }, q = (m) => {
    o((F) => (m > F.bestScore && localStorage.setItem(c.current.lcPrefix + "best", String(m)), {
      ...F,
      score: m,
      bestScore: Math.max(m, F.bestScore)
    }));
  };
  return re(() => (y(), v.on("resourceLoaded", y), v.on("gameOver", I), v.on("gamePaused", V), v.on("floorLanding", U), v.on("heroDamaged", W), v.on("heroHealed", ne), v.on("scoreUpdate", q), () => {
    n.current && (n.current.destroy(), n.current = null), r.current && clearTimeout(r.current), v.off("resourceLoaded", y), v.off("gameOver", I), v.off("gamePaused", V), v.off("floorLanding", U), v.off("heroDamaged", W), v.off("heroHealed", ne), v.off("scoreUpdate", q);
  }), []), /* @__PURE__ */ f("div", { className: "downfloor-container", ref: i, children: [
    /* @__PURE__ */ f("canvas", { ref: e, className: "downfloor-canvas" }),
    /* @__PURE__ */ f(
      Ut,
      {
        onGameStart: l,
        onGameRestart: l
      }
    )
  ] });
}
function zt({ config: i = {} }) {
  return i = {
    ...Bt,
    ...i
  }, /* @__PURE__ */ f(Lt, { config: i, children: /* @__PURE__ */ f(Yt, {}) });
}
const xt = {
  async init(i, e) {
    const t = typeof i == "string" ? document.querySelector(i) : i;
    if (!t) {
      console.warn("Cannot find the root element");
      const c = document.createElement("div");
      c.style.textAlign = "center", c.style.padding = "20px", c.innerHTML = "Cannot find the root element", document.body.append(c);
      return;
    }
    let { root: n = location.origin } = e;
    n.at(-1) !== "/" && (n += "/");
    const r = document.createElement("div"), s = document.createElement("div");
    r.style.cssText = `
      height: 30px;
      width: 60%;
      border: solid 2px #999;
      margin: auto;
    `, s.style.cssText = `
      width: 99%;
      height: 100%;
      background: #999;
      animation: loading 1.5s ease-in-out;
      transition: width 1.5s ease-in-out;
      transition: width 1.5s ease-in-out;
    `, r.append(s), t.append(r);
    const o = document.createElement("style");
    o.innerHTML = `
      @keyframes loading {
      0% { width: 0%; }
      100% { width: 99%; }
    }`, document.head.appendChild(o), await (async (c) => new Promise((h, u) => {
      const l = document.createElement("link");
      l.rel = "stylesheet", l.type = "text/css", l.href = c, l.onload = h, l.onerror = u, document.head.appendChild(l);
    }))(n + "downgame.css"), Tt(/* @__PURE__ */ f(zt, { config: e }), t);
  }
};
export {
  xt as default
};
