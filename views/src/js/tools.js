!(function(t) {
  var e = {};
  function n(o) {
    if (e[o]) return e[o].exports;
    var r = (e[o] = { i: o, l: !1, exports: {} });
    return t[o].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
  }
  (n.m = t),
    (n.c = e),
    (n.d = function(t, e, o) {
      n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: o });
    }),
    (n.r = function(t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (n.t = function(t, e) {
      if ((1 & e && (t = n(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var o = Object.create(null);
      if (
        (n.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var r in t)
          n.d(
            o,
            r,
            function(e) {
              return t[e];
            }.bind(null, r)
          );
      return o;
    }),
    (n.n = function(t) {
      var e =
        t && t.__esModule
          ? function() {
              return t.default;
            }
          : function() {
              return t;
            };
      return n.d(e, "a", e), e;
    }),
    (n.o = function(t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (n.p = ""),
    n((n.s = 2));
})({
  2: function(t, e) {
    !(function(t) {
      var e = {
        bindTap: function(t, e) {
          var n = 0,
            o = !1;
          t.addEventListener("touchstart", function() {
            n = new Date();
          }),
            t.addEventListener("touchmove", function() {
              o = !0;
            }),
            t.addEventListener("touchend", function(t) {
              !o && new Date() - n > 50 && e && e.call(this, t),
                (n = 0),
                (o = !1);
            });
        },
        bindSwipeVertical: function(t, e, n) {
          var o = 0,
            r = 0,
            i = !1;
          t.addEventListener("touchstart", function(t) {
            o = t.touches[0].clientX;
          }),
            t.addEventListener("touchmove", function(t) {
              (i = !0), (r = t.touches[0].clientX - o);
            }),
            t.addEventListener("touchend", function(t) {
              i &&
                Math.abs(r) > 50 &&
                (r > 0 ? n && n.call(this, t) : e && e.call(this, t));
            });
        },
        bindSwipeHorizontal: function(t, e, n) {
          var o = 0,
            r = !1;
          t.addEventListener("touchstart", function(t) {
            startX = t.touches[0].clientY;
          }),
            t.addEventListener("touchmove", function(t) {
              (r = !0), (o = t.touches[0].clientY - 0);
            }),
            t.addEventListener("touchend", function(t) {
              r &&
                Math.abs(o) > 50 &&
                (o > 0 ? n && n.call(this, t) : e && e.call(this, t));
            });
        }
      };
      window._$ = e;
    })();
  }
});
