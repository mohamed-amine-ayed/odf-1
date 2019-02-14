window.FF_DEBUG = -1 !== location.href.indexOf("debug=1"),
Array.prototype.find = Array.prototype.find || function(e) {
    if (null === this)
        throw new TypeError("Array.prototype.find called on null or undefined");
    if ("function" != typeof e)
        throw new TypeError("callback must be a function");
    for (var t = Object(this), i = t.length >>> 0, s = arguments[1], n = 0; n < i; n++) {
        var o = t[n];
        if (e.call(s, o, n, t))
            return o
    }
}
,
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = function(t, i) {
        return void 0 === i && (i = "undefined" != typeof window ? require("jquery") : require("jquery")(t)),
        e(i),
        i
    }
    : e(jQuery)
}(function(e) {
    "use strict";
    var t = e(document)
      , i = e(window)
      , s = "selectric"
      , n = ".sl"
      , o = ["a", "e", "i", "o", "u", "n", "c", "y"]
      , r = [/[\xE0-\xE5]/g, /[\xE8-\xEB]/g, /[\xEC-\xEF]/g, /[\xF2-\xF6]/g, /[\xF9-\xFC]/g, /[\xF1]/g, /[\xE7]/g, /[\xFD-\xFF]/g]
      , a = function(t, i) {
        var s = this;
        s.element = t,
        s.$element = e(t),
        s.state = {
            multiple: !!s.$element.attr("multiple"),
            enabled: !1,
            opened: !1,
            currValue: -1,
            selectedIdx: -1,
            highlightedIdx: -1
        },
        s.eventTriggers = {
            open: s.open,
            close: s.close,
            destroy: s.destroy,
            refresh: s.refresh,
            init: s.init
        },
        s.init(i)
    };
    a.prototype = {
        utils: {
            isMobile: function() {
                return /android|ip(hone|od|ad)/i.test(navigator.userAgent)
            },
            escapeRegExp: function(e) {
                return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            },
            replaceDiacritics: function(e) {
                for (var t = r.length; t--; )
                    e = e.toLowerCase().replace(r[t], o[t]);
                return e
            },
            format: function(e) {
                var t = arguments;
                return ("" + e).replace(/\{(?:(\d+)|(\w+))\}/g, function(e, i, s) {
                    return s && t[1] ? t[1][s] : t[i]
                })
            },
            nextEnabledItem: function(e, t) {
                for (; e[t = (t + 1) % e.length].disabled; )
                    ;
                return t
            },
            previousEnabledItem: function(e, t) {
                for (; e[t = (t > 0 ? t : e.length) - 1].disabled; )
                    ;
                return t
            },
            toDash: function(e) {
                return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
            },
            triggerCallback: function(t, i) {
                var n = i.element
                  , o = i.options["on" + t]
                  , r = [n].concat([].slice.call(arguments).slice(1));
                e.isFunction(o) && o.apply(n, r),
                e(n).trigger(s + "-" + this.toDash(t), r)
            },
            arrayToClassname: function(t) {
                var i = e.grep(t, function(e) {
                    return !!e
                });
                return e.trim(i.join(" "))
            }
        },
        init: function(t) {
            var i = this;
            if (i.options = e.extend(!0, {}, e.fn[s].defaults, i.options, t),
            i.utils.triggerCallback("BeforeInit", i),
            i.destroy(!0),
            i.options.disableOnMobile && i.utils.isMobile())
                i.disableOnMobile = !0;
            else {
                i.classes = i.getClassNames();
                var n = e("<input/>", {
                    class: i.classes.input,
                    readonly: i.utils.isMobile()
                })
                  , o = e("<div/>", {
                    class: i.classes.items,
                    tabindex: -1
                })
                  , r = e("<div/>", {
                    class: i.classes.scroll
                })
                  , a = e("<div/>", {
                    class: i.classes.prefix,
                    html: i.options.arrowButtonMarkup
                })
                  , l = e("<span/>", {
                    class: "label"
                })
                  , d = i.$element.wrap("<div/>").parent().append(a.prepend(l), o, n)
                  , c = e("<div/>", {
                    class: i.classes.hideselect
                });
                i.elements = {
                    input: n,
                    items: o,
                    itemsScroll: r,
                    wrapper: a,
                    label: l,
                    outerWrapper: d
                },
                i.options.nativeOnMobile && i.utils.isMobile() && (i.elements.input = void 0,
                c.addClass(i.classes.prefix + "-is-native"),
                i.$element.on("change", function() {
                    i.refresh()
                })),
                i.$element.on(i.eventTriggers).wrap(c),
                i.originalTabindex = i.$element.prop("tabindex"),
                i.$element.prop("tabindex", -1),
                i.populate(),
                i.activate(),
                i.utils.triggerCallback("Init", i)
            }
        },
        activate: function() {
            var e = this
              , t = e.elements.items.closest(":visible").children(":hidden").addClass(e.classes.tempshow)
              , i = e.$element.width();
            t.removeClass(e.classes.tempshow),
            e.utils.triggerCallback("BeforeActivate", e),
            e.elements.outerWrapper.prop("class", e.utils.arrayToClassname([e.classes.wrapper, e.$element.prop("class").replace(/\S+/g, e.classes.prefix + "-$&"), e.options.responsive ? e.classes.responsive : ""])),
            e.options.inheritOriginalWidth && i > 0 && e.elements.outerWrapper.width(i),
            e.unbindEvents(),
            e.$element.prop("disabled") ? (e.elements.outerWrapper.addClass(e.classes.disabled),
            e.elements.input && e.elements.input.prop("disabled", !0)) : (e.state.enabled = !0,
            e.elements.outerWrapper.removeClass(e.classes.disabled),
            e.$li = e.elements.items.removeAttr("style").find("li"),
            e.bindEvents()),
            e.utils.triggerCallback("Activate", e)
        },
        getClassNames: function() {
            var t = this
              , i = t.options.customClass
              , s = {};
            return e.each("Input Items Open Disabled TempShow HideSelect Wrapper Focus Hover Responsive Above Scroll Group GroupLabel".split(" "), function(e, n) {
                var o = i.prefix + n;
                s[n.toLowerCase()] = i.camelCase ? o : t.utils.toDash(o)
            }),
            s.prefix = i.prefix,
            s
        },
        setLabel: function() {
            var t = this
              , i = t.options.labelBuilder;
            if (t.state.multiple) {
                var s = e.isArray(t.state.currValue) ? t.state.currValue : [t.state.currValue];
                s = 0 === s.length ? [0] : s;
                var n = e.map(s, function(i) {
                    return e.grep(t.lookupItems, function(e) {
                        return e.index === i
                    })[0]
                });
                n = e.grep(n, function(t) {
                    return n.length > 1 || 0 === n.length ? "" !== e.trim(t.value) : t
                }),
                n = e.map(n, function(s) {
                    return e.isFunction(i) ? i(s) : t.utils.format(i, s)
                }),
                t.options.multiple.maxLabelEntries && (n.length >= t.options.multiple.maxLabelEntries + 1 ? (n = n.slice(0, t.options.multiple.maxLabelEntries)).push(e.isFunction(i) ? i({
                    text: "..."
                }) : t.utils.format(i, {
                    text: "..."
                })) : n.slice(n.length - 1)),
                t.elements.label.html(n.join(t.options.multiple.separator))
            } else {
                var o = t.lookupItems[t.state.currValue];
                t.elements.label.html(e.isFunction(i) ? i(o) : t.utils.format(i, o))
            }
        },
        populate: function() {
            var t = this
              , i = t.$element.children()
              , s = t.$element.find("option")
              , n = s.filter(":selected")
              , o = s.index(n)
              , r = 0
              , a = t.state.multiple ? [] : 0;
            n.length > 1 && t.state.multiple && (o = [],
            n.each(function() {
                o.push(e(this).index())
            })),
            t.state.currValue = ~o ? o : a,
            t.state.selectedIdx = t.state.currValue,
            t.state.highlightedIdx = t.state.currValue,
            t.items = [],
            t.lookupItems = [],
            i.length && (i.each(function(i) {
                var s = e(this);
                if (s.is("optgroup")) {
                    var n = {
                        element: s,
                        label: s.prop("label"),
                        groupDisabled: s.prop("disabled"),
                        items: []
                    };
                    s.children().each(function(i) {
                        var s = e(this);
                        n.items[i] = t.getItemData(r, s, n.groupDisabled || s.prop("disabled")),
                        t.lookupItems[r] = n.items[i],
                        r++
                    }),
                    t.items[i] = n
                } else
                    t.items[i] = t.getItemData(r, s, s.prop("disabled")),
                    t.lookupItems[r] = t.items[i],
                    r++
            }),
            t.setLabel(),
            t.elements.items.append(t.elements.itemsScroll.html(t.getItemsMarkup(t.items))))
        },
        getItemData: function(t, i, s) {
            var n = this;
            return {
                index: t,
                element: i,
                value: i.val(),
                className: i.prop("class"),
                text: i.html(),
                slug: e.trim(n.utils.replaceDiacritics(i.html())),
                selected: i.prop("selected"),
                disabled: s
            }
        },
        getItemsMarkup: function(t) {
            var i = this
              , s = "<ul>";
            return e.isFunction(i.options.listBuilder) && i.options.listBuilder && (t = i.options.listBuilder(t)),
            e.each(t, function(t, n) {
                void 0 !== n.label ? (s += i.utils.format('<ul class="{1}"><li class="{2}">{3}</li>', i.utils.arrayToClassname([i.classes.group, n.groupDisabled ? "disabled" : "", n.element.prop("class")]), i.classes.grouplabel, n.element.prop("label")),
                e.each(n.items, function(e, t) {
                    s += i.getItemMarkup(t.index, t)
                }),
                s += "</ul>") : s += i.getItemMarkup(n.index, n)
            }),
            s + "</ul>"
        },
        getItemMarkup: function(t, i) {
            var s = this
              , n = s.options.optionsItemBuilder
              , o = {
                value: i.value,
                text: i.text,
                slug: i.slug,
                index: i.index
            };
            return s.utils.format('<li data-index="{1}" class="{2}">{3}</li>', t, s.utils.arrayToClassname([i.className, t === s.items.length - 1 ? "last" : "", i.disabled ? "disabled" : "", i.selected ? "selected" : ""]), e.isFunction(n) ? s.utils.format(n(i), i) : s.utils.format(n, o))
        },
        unbindEvents: function() {
            var e = this;
            e.elements.wrapper.add(e.$element).add(e.elements.outerWrapper).add(e.elements.input).off(n)
        },
        bindEvents: function() {
            var t = this;
            t.elements.outerWrapper.on("mouseenter.sl mouseleave" + n, function(i) {
                e(this).toggleClass(t.classes.hover, "mouseenter" === i.type),
                t.options.openOnHover && (clearTimeout(t.closeTimer),
                "mouseleave" === i.type ? t.closeTimer = setTimeout(e.proxy(t.close, t), t.options.hoverIntentTimeout) : t.open())
            }),
            t.elements.wrapper.on("click" + n, function(e) {
                t.state.opened ? t.close() : t.open(e)
            }),
            t.options.nativeOnMobile && t.utils.isMobile() || (t.$element.on("focus" + n, function() {
                t.elements.input.focus()
            }),
            t.elements.input.prop({
                tabindex: t.originalTabindex,
                disabled: !1
            }).on("keydown" + n, e.proxy(t.handleKeys, t)).on("focusin" + n, function(e) {
                t.elements.outerWrapper.addClass(t.classes.focus),
                t.elements.input.one("blur", function() {
                    t.elements.input.blur()
                }),
                t.options.openOnFocus && !t.state.opened && t.open(e)
            }).on("focusout" + n, function() {
                t.elements.outerWrapper.removeClass(t.classes.focus)
            }).on("input propertychange", function() {
                var i = t.elements.input.val()
                  , s = new RegExp("^" + t.utils.escapeRegExp(i),"i");
                clearTimeout(t.resetStr),
                t.resetStr = setTimeout(function() {
                    t.elements.input.val("")
                }, t.options.keySearchTimeout),
                i.length && e.each(t.items, function(e, i) {
                    (!i.disabled && s.test(i.text) || s.test(i.slug)) && t.highlight(e)
                })
            })),
            t.$li.on({
                mousedown: function(e) {
                    e.preventDefault(),
                    e.stopPropagation()
                },
                click: function() {
                    return t.select(e(this).data("index")),
                    !1
                }
            })
        },
        handleKeys: function(t) {
            var i = this
              , s = t.which
              , n = i.options.keys
              , o = e.inArray(s, n.previous) > -1
              , r = e.inArray(s, n.next) > -1
              , a = e.inArray(s, n.select) > -1
              , l = e.inArray(s, n.open) > -1
              , d = i.state.highlightedIdx
              , c = o && 0 === d || r && d + 1 === i.items.length
              , p = 0;
            if (13 !== s && 32 !== s || t.preventDefault(),
            o || r) {
                if (!i.options.allowWrap && c)
                    return;
                o && (p = i.utils.previousEnabledItem(i.lookupItems, d)),
                r && (p = i.utils.nextEnabledItem(i.lookupItems, d)),
                i.highlight(p)
            }
            return a && i.state.opened ? (i.select(d),
            void (i.state.multiple && i.options.multiple.keepMenuOpen || i.close())) : void (l && !i.state.opened && i.open())
        },
        refresh: function() {
            var e = this;
            e.populate(),
            e.activate(),
            e.utils.triggerCallback("Refresh", e)
        },
        setOptionsDimensions: function() {
            var e = this
              , t = e.elements.items.closest(":visible").children(":hidden").addClass(e.classes.tempshow)
              , i = e.options.maxHeight
              , s = e.elements.items.outerWidth()
              , n = e.elements.wrapper.outerWidth() - (s - e.elements.items.width());
            !e.options.expandToItemText || n > s ? e.finalWidth = n : (e.elements.items.css("overflow", "scroll"),
            e.elements.outerWrapper.width(9e4),
            e.finalWidth = e.elements.items.width(),
            e.elements.items.css("overflow", ""),
            e.elements.outerWrapper.width("")),
            e.elements.items.width(e.finalWidth).height() > i && e.elements.items.height(i),
            t.removeClass(e.classes.tempshow)
        },
        isInViewport: function() {
            var e = this
              , t = i.scrollTop()
              , s = i.height()
              , n = e.elements.outerWrapper.offset().top
              , o = n + e.elements.outerWrapper.outerHeight() + e.itemsHeight <= t + s
              , r = n - e.itemsHeight > t
              , a = !o && r;
            e.elements.outerWrapper.toggleClass(e.classes.above, a)
        },
        detectItemVisibility: function(t) {
            var i = this
              , s = i.$li.filter("[data-index]");
            i.state.multiple && (t = e.isArray(t) && 0 === t.length ? 0 : t,
            t = e.isArray(t) ? Math.min.apply(Math, t) : t);
            var n = s.eq(t).outerHeight()
              , o = s[t].offsetTop
              , r = i.elements.itemsScroll.scrollTop()
              , a = o + 2 * n;
            i.elements.itemsScroll.scrollTop(a > r + i.itemsHeight ? a - i.itemsHeight : o - n < r ? o - n : r)
        },
        open: function(i) {
            var o = this;
            return (!o.options.nativeOnMobile || !o.utils.isMobile()) && (o.utils.triggerCallback("BeforeOpen", o),
            i && (i.preventDefault(),
            o.options.stopPropagation && i.stopPropagation()),
            void (o.state.enabled && (o.setOptionsDimensions(),
            e("." + o.classes.hideselect, "." + o.classes.open).children()[s]("close"),
            o.state.opened = !0,
            o.itemsHeight = o.elements.items.outerHeight(),
            o.itemsInnerHeight = o.elements.items.height(),
            o.elements.outerWrapper.addClass(o.classes.open),
            o.elements.input.val(""),
            i && "focusin" !== i.type && o.elements.input.focus(),
            setTimeout(function() {
                t.on("click" + n, e.proxy(o.close, o)).on("scroll" + n, e.proxy(o.isInViewport, o))
            }, 1),
            o.isInViewport(),
            o.options.preventWindowScroll && t.on("mousewheel.sl DOMMouseScroll" + n, "." + o.classes.scroll, function(t) {
                var i = t.originalEvent
                  , s = e(this).scrollTop()
                  , n = 0;
                "detail"in i && (n = -1 * i.detail),
                "wheelDelta"in i && (n = i.wheelDelta),
                "wheelDeltaY"in i && (n = i.wheelDeltaY),
                "deltaY"in i && (n = -1 * i.deltaY),
                (s === this.scrollHeight - o.itemsInnerHeight && n < 0 || 0 === s && n > 0) && t.preventDefault()
            }),
            o.detectItemVisibility(o.state.selectedIdx),
            o.highlight(o.state.multiple ? -1 : o.state.selectedIdx),
            o.utils.triggerCallback("Open", o))))
        },
        close: function() {
            var e = this;
            e.utils.triggerCallback("BeforeClose", e),
            t.off(n),
            e.elements.outerWrapper.removeClass(e.classes.open),
            e.state.opened = !1,
            e.utils.triggerCallback("Close", e)
        },
        change: function() {
            var t = this;
            t.utils.triggerCallback("BeforeChange", t),
            t.state.multiple ? (e.each(t.lookupItems, function(e) {
                t.lookupItems[e].selected = !1,
                t.$element.find("option").prop("selected", !1)
            }),
            e.each(t.state.selectedIdx, function(e, i) {
                t.lookupItems[i].selected = !0,
                t.$element.find("option").eq(i).prop("selected", !0)
            }),
            t.state.currValue = t.state.selectedIdx,
            t.setLabel(),
            t.utils.triggerCallback("Change", t)) : t.state.currValue !== t.state.selectedIdx && (t.$element.prop("selectedIndex", t.state.currValue = t.state.selectedIdx).data("value", t.lookupItems[t.state.selectedIdx].text),
            t.setLabel(),
            t.utils.triggerCallback("Change", t))
        },
        highlight: function(e) {
            var t = this
              , i = t.$li.filter("[data-index]").removeClass("highlighted");
            t.utils.triggerCallback("BeforeHighlight", t),
            void 0 === e || -1 === e || t.lookupItems[e].disabled || (i.eq(t.state.highlightedIdx = e).addClass("highlighted"),
            t.detectItemVisibility(e),
            t.utils.triggerCallback("Highlight", t))
        },
        select: function(t) {
            var i = this
              , s = i.$li.filter("[data-index]");
            if (i.utils.triggerCallback("BeforeSelect", i, t),
            void 0 !== t && -1 !== t && !i.lookupItems[t].disabled) {
                if (i.state.multiple) {
                    i.state.selectedIdx = e.isArray(i.state.selectedIdx) ? i.state.selectedIdx : [i.state.selectedIdx];
                    var n = e.inArray(t, i.state.selectedIdx);
                    -1 !== n ? i.state.selectedIdx.splice(n, 1) : i.state.selectedIdx.push(t),
                    s.removeClass("selected").filter(function(t) {
                        return -1 !== e.inArray(t, i.state.selectedIdx)
                    }).addClass("selected")
                } else
                    s.removeClass("selected").eq(i.state.selectedIdx = t).addClass("selected");
                i.state.multiple && i.options.multiple.keepMenuOpen || i.close(),
                i.change(),
                i.utils.triggerCallback("Select", i, t)
            }
        },
        destroy: function(e) {
            var t = this;
            t.state && t.state.enabled && (t.elements.items.add(t.elements.wrapper).add(t.elements.input).remove(),
            e || t.$element.removeData(s).removeData("value"),
            t.$element.prop("tabindex", t.originalTabindex).off(n).off(t.eventTriggers).unwrap().unwrap(),
            t.state.enabled = !1)
        }
    },
    e.fn[s] = function(t) {
        return this.each(function() {
            var i = e.data(this, s);
            i && !i.disableOnMobile ? "string" == typeof t && i[t] ? i[t]() : i.init(t) : e.data(this, s, new a(this,t))
        })
    }
    ,
    e.fn[s].defaults = {
        onChange: function(t) {
            e(t).change()
        },
        maxHeight: 300,
        keySearchTimeout: 500,
        arrowButtonMarkup: '<b class="button">&#x25be;</b>',
        disableOnMobile: !1,
        nativeOnMobile: !0,
        openOnFocus: !0,
        openOnHover: !1,
        hoverIntentTimeout: 500,
        expandToItemText: !1,
        responsive: !1,
        preventWindowScroll: !0,
        inheritOriginalWidth: !1,
        allowWrap: !0,
        stopPropagation: !0,
        optionsItemBuilder: "{text}",
        labelBuilder: "{text}",
        listBuilder: !1,
        keys: {
            previous: [37, 38],
            next: [39, 40],
            select: [9, 13, 27],
            open: [13, 32, 37, 38, 39, 40],
            close: [9, 27]
        },
        customClass: {
            prefix: s,
            camelCase: !1
        },
        multiple: {
            separator: ", ",
            keepMenuOpen: !0,
            maxLabelEntries: !1
        }
    }
}),
function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof module && module.exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    "use strict";
    var t = window.Slick || {};
    (t = function() {
        var t = 0;
        return function(i, s) {
            var n, o = this;
            o.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: e(i),
                appendDots: e(i),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(t, i) {
                    return e('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            },
            o.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            },
            e.extend(o, o.initials),
            o.activeBreakpoint = null,
            o.animType = null,
            o.animProp = null,
            o.breakpoints = [],
            o.breakpointSettings = [],
            o.cssTransitions = !1,
            o.focussed = !1,
            o.interrupted = !1,
            o.hidden = "hidden",
            o.paused = !0,
            o.positionProp = null,
            o.respondTo = null,
            o.rowCount = 1,
            o.shouldClick = !0,
            o.$slider = e(i),
            o.$slidesCache = null,
            o.transformType = null,
            o.transitionType = null,
            o.visibilityChange = "visibilitychange",
            o.windowWidth = 0,
            o.windowTimer = null,
            n = e(i).data("slick") || {},
            o.options = e.extend({}, o.defaults, s, n),
            o.currentSlide = o.options.initialSlide,
            o.originalSettings = o.options,
            void 0 !== document.mozHidden ? (o.hidden = "mozHidden",
            o.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (o.hidden = "webkitHidden",
            o.visibilityChange = "webkitvisibilitychange"),
            o.autoPlay = e.proxy(o.autoPlay, o),
            o.autoPlayClear = e.proxy(o.autoPlayClear, o),
            o.autoPlayIterator = e.proxy(o.autoPlayIterator, o),
            o.changeSlide = e.proxy(o.changeSlide, o),
            o.clickHandler = e.proxy(o.clickHandler, o),
            o.selectHandler = e.proxy(o.selectHandler, o),
            o.setPosition = e.proxy(o.setPosition, o),
            o.swipeHandler = e.proxy(o.swipeHandler, o),
            o.dragHandler = e.proxy(o.dragHandler, o),
            o.keyHandler = e.proxy(o.keyHandler, o),
            o.instanceUid = t++,
            o.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
            o.registerBreakpoints(),
            o.init(!0)
        }
    }()).prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }
    ,
    t.prototype.addSlide = t.prototype.slickAdd = function(t, i, s) {
        var n = this;
        if ("boolean" == typeof i)
            s = i,
            i = null;
        else if (0 > i || i >= n.slideCount)
            return !1;
        n.unload(),
        "number" == typeof i ? 0 === i && 0 === n.$slides.length ? e(t).appendTo(n.$slideTrack) : s ? e(t).insertBefore(n.$slides.eq(i)) : e(t).insertAfter(n.$slides.eq(i)) : !0 === s ? e(t).prependTo(n.$slideTrack) : e(t).appendTo(n.$slideTrack),
        n.$slides = n.$slideTrack.children(this.options.slide),
        n.$slideTrack.children(this.options.slide).detach(),
        n.$slideTrack.append(n.$slides),
        n.$slides.each(function(t, i) {
            e(i).attr("data-slick-index", t)
        }),
        n.$slidesCache = n.$slides,
        n.reinit()
    }
    ,
    t.prototype.animateHeight = function() {
        var e = this;
        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
            e.$list.animate({
                height: t
            }, e.options.speed)
        }
    }
    ,
    t.prototype.animateSlide = function(t, i) {
        var s = {}
          , n = this;
        n.animateHeight(),
        !0 === n.options.rtl && !1 === n.options.vertical && (t = -t),
        !1 === n.transformsEnabled ? !1 === n.options.vertical ? n.$slideTrack.animate({
            left: t
        }, n.options.speed, n.options.easing, i) : n.$slideTrack.animate({
            top: t
        }, n.options.speed, n.options.easing, i) : !1 === n.cssTransitions ? (!0 === n.options.rtl && (n.currentLeft = -n.currentLeft),
        e({
            animStart: n.currentLeft
        }).animate({
            animStart: t
        }, {
            duration: n.options.speed,
            easing: n.options.easing,
            step: function(e) {
                e = Math.ceil(e),
                !1 === n.options.vertical ? (s[n.animType] = "translate(" + e + "px, 0px)",
                n.$slideTrack.css(s)) : (s[n.animType] = "translate(0px," + e + "px)",
                n.$slideTrack.css(s))
            },
            complete: function() {
                i && i.call()
            }
        })) : (n.applyTransition(),
        t = Math.ceil(t),
        !1 === n.options.vertical ? s[n.animType] = "translate3d(" + t + "px, 0px, 0px)" : s[n.animType] = "translate3d(0px," + t + "px, 0px)",
        n.$slideTrack.css(s),
        i && setTimeout(function() {
            n.disableTransition(),
            i.call()
        }, n.options.speed))
    }
    ,
    t.prototype.getNavTarget = function() {
        var t = this
          , i = t.options.asNavFor;
        return i && null !== i && (i = e(i).not(t.$slider)),
        i
    }
    ,
    t.prototype.asNavFor = function(t) {
        var i = this.getNavTarget();
        null !== i && "object" == typeof i && i.each(function() {
            var i = e(this).slick("getSlick");
            i.unslicked || i.slideHandler(t, !0)
        })
    }
    ,
    t.prototype.applyTransition = function(e) {
        var t = this
          , i = {};
        !1 === t.options.fade ? i[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : i[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase,
        !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
    }
    ,
    t.prototype.autoPlay = function() {
        var e = this;
        e.autoPlayClear(),
        e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
    }
    ,
    t.prototype.autoPlayClear = function() {
        var e = this;
        e.autoPlayTimer && clearInterval(e.autoPlayTimer)
    }
    ,
    t.prototype.autoPlayIterator = function() {
        var e = this
          , t = e.currentSlide + e.options.slidesToScroll;
        e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll,
        e.currentSlide - 1 == 0 && (e.direction = 1))),
        e.slideHandler(t))
    }
    ,
    t.prototype.buildArrows = function() {
        var t = this;
        !0 === t.options.arrows && (t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow"),
        t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow"),
        t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows),
        t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows),
        !0 !== t.options.infinite && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }
    ,
    t.prototype.buildDots = function() {
        var t, i, s = this;
        if (!0 === s.options.dots && s.slideCount > s.options.slidesToShow) {
            for (s.$slider.addClass("slick-dotted"),
            i = e("<ul />").addClass(s.options.dotsClass),
            t = 0; t <= s.getDotCount(); t += 1)
                i.append(e("<li />").append(s.options.customPaging.call(this, s, t)));
            s.$dots = i.appendTo(s.options.appendDots),
            s.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false")
        }
    }
    ,
    t.prototype.buildOut = function() {
        var t = this;
        t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
        t.slideCount = t.$slides.length,
        t.$slides.each(function(t, i) {
            e(i).attr("data-slick-index", t).data("originalStyling", e(i).attr("style") || "")
        }),
        t.$slider.addClass("slick-slider"),
        t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent(),
        t.$list = t.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),
        t.$slideTrack.css("opacity", 0),
        (!0 === t.options.centerMode || !0 === t.options.swipeToSlide) && (t.options.slidesToScroll = 1),
        e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"),
        t.setupInfinite(),
        t.buildArrows(),
        t.buildDots(),
        t.updateDots(),
        t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0),
        !0 === t.options.draggable && t.$list.addClass("draggable")
    }
    ,
    t.prototype.buildRows = function() {
        var e, t, i, s, n, o, r, a = this;
        if (s = document.createDocumentFragment(),
        o = a.$slider.children(),
        a.options.rows > 1) {
            for (r = a.options.slidesPerRow * a.options.rows,
            n = Math.ceil(o.length / r),
            e = 0; n > e; e++) {
                var l = document.createElement("div");
                for (t = 0; t < a.options.rows; t++) {
                    var d = document.createElement("div");
                    for (i = 0; i < a.options.slidesPerRow; i++) {
                        var c = e * r + (t * a.options.slidesPerRow + i);
                        o.get(c) && d.appendChild(o.get(c))
                    }
                    l.appendChild(d)
                }
                s.appendChild(l)
            }
            a.$slider.empty().append(s),
            a.$slider.children().children().children().css({
                width: 100 / a.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }
    ,
    t.prototype.checkResponsive = function(t, i) {
        var s, n, o, r = this, a = !1, l = r.$slider.width(), d = window.innerWidth || e(window).width();
        if ("window" === r.respondTo ? o = d : "slider" === r.respondTo ? o = l : "min" === r.respondTo && (o = Math.min(d, l)),
        r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
            n = null;
            for (s in r.breakpoints)
                r.breakpoints.hasOwnProperty(s) && (!1 === r.originalSettings.mobileFirst ? o < r.breakpoints[s] && (n = r.breakpoints[s]) : o > r.breakpoints[s] && (n = r.breakpoints[s]));
            null !== n ? null !== r.activeBreakpoint ? (n !== r.activeBreakpoint || i) && (r.activeBreakpoint = n,
            "unslick" === r.breakpointSettings[n] ? r.unslick(n) : (r.options = e.extend({}, r.originalSettings, r.breakpointSettings[n]),
            !0 === t && (r.currentSlide = r.options.initialSlide),
            r.refresh(t)),
            a = n) : (r.activeBreakpoint = n,
            "unslick" === r.breakpointSettings[n] ? r.unslick(n) : (r.options = e.extend({}, r.originalSettings, r.breakpointSettings[n]),
            !0 === t && (r.currentSlide = r.options.initialSlide),
            r.refresh(t)),
            a = n) : null !== r.activeBreakpoint && (r.activeBreakpoint = null,
            r.options = r.originalSettings,
            !0 === t && (r.currentSlide = r.options.initialSlide),
            r.refresh(t),
            a = n),
            t || !1 === a || r.$slider.trigger("breakpoint", [r, a])
        }
    }
    ,
    t.prototype.changeSlide = function(t, i) {
        var s, n, o, r = this, a = e(t.currentTarget);
        switch (a.is("a") && t.preventDefault(),
        a.is("li") || (a = a.closest("li")),
        o = r.slideCount % r.options.slidesToScroll != 0,
        s = o ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll,
        t.data.message) {
        case "previous":
            n = 0 === s ? r.options.slidesToScroll : r.options.slidesToShow - s,
            r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - n, !1, i);
            break;
        case "next":
            n = 0 === s ? r.options.slidesToScroll : s,
            r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + n, !1, i);
            break;
        case "index":
            var l = 0 === t.data.index ? 0 : t.data.index || a.index() * r.options.slidesToScroll;
            r.slideHandler(r.checkNavigable(l), !1, i),
            a.children().trigger("focus");
            break;
        default:
            return
        }
    }
    ,
    t.prototype.checkNavigable = function(e) {
        var t, i;
        if (t = this.getNavigableIndexes(),
        i = 0,
        e > t[t.length - 1])
            e = t[t.length - 1];
        else
            for (var s in t) {
                if (e < t[s]) {
                    e = i;
                    break
                }
                i = t[s]
            }
        return e
    }
    ,
    t.prototype.cleanUpEvents = function() {
        var t = this;
        t.options.dots && null !== t.$dots && e("li", t.$dots).off("click.slick", t.changeSlide).off("mouseenter.slick", e.proxy(t.interrupt, t, !0)).off("mouseleave.slick", e.proxy(t.interrupt, t, !1)),
        t.$slider.off("focus.slick blur.slick"),
        !0 === t.options.arrows && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide),
        t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide)),
        t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler),
        t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler),
        t.$list.off("touchend.slick mouseup.slick", t.swipeHandler),
        t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler),
        t.$list.off("click.slick", t.clickHandler),
        e(document).off(t.visibilityChange, t.visibility),
        t.cleanUpSlideEvents(),
        !0 === t.options.accessibility && t.$list.off("keydown.slick", t.keyHandler),
        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().off("click.slick", t.selectHandler),
        e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange),
        e(window).off("resize.slick.slick-" + t.instanceUid, t.resize),
        e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault),
        e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition),
        e(document).off("ready.slick.slick-" + t.instanceUid, t.setPosition)
    }
    ,
    t.prototype.cleanUpSlideEvents = function() {
        var t = this;
        t.$list.off("mouseenter.slick", e.proxy(t.interrupt, t, !0)),
        t.$list.off("mouseleave.slick", e.proxy(t.interrupt, t, !1))
    }
    ,
    t.prototype.cleanUpRows = function() {
        var e, t = this;
        t.options.rows > 1 && ((e = t.$slides.children().children()).removeAttr("style"),
        t.$slider.empty().append(e))
    }
    ,
    t.prototype.clickHandler = function(e) {
        !1 === this.shouldClick && (e.stopImmediatePropagation(),
        e.stopPropagation(),
        e.preventDefault())
    }
    ,
    t.prototype.destroy = function(t) {
        var i = this;
        i.autoPlayClear(),
        i.touchObject = {},
        i.cleanUpEvents(),
        e(".slick-cloned", i.$slider).detach(),
        i.$dots && i.$dots.remove(),
        i.$prevArrow && i.$prevArrow.length && (i.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()),
        i.$nextArrow && i.$nextArrow.length && (i.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()),
        i.$slides && (i.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            e(this).attr("style", e(this).data("originalStyling"))
        }),
        i.$slideTrack.children(this.options.slide).detach(),
        i.$slideTrack.detach(),
        i.$list.detach(),
        i.$slider.append(i.$slides)),
        i.cleanUpRows(),
        i.$slider.removeClass("slick-slider"),
        i.$slider.removeClass("slick-initialized"),
        i.$slider.removeClass("slick-dotted"),
        i.unslicked = !0,
        t || i.$slider.trigger("destroy", [i])
    }
    ,
    t.prototype.disableTransition = function(e) {
        var t = this
          , i = {};
        i[t.transitionType] = "",
        !1 === t.options.fade ? t.$slideTrack.css(i) : t.$slides.eq(e).css(i)
    }
    ,
    t.prototype.fadeSlide = function(e, t) {
        var i = this;
        !1 === i.cssTransitions ? (i.$slides.eq(e).css({
            zIndex: i.options.zIndex
        }),
        i.$slides.eq(e).animate({
            opacity: 1
        }, i.options.speed, i.options.easing, t)) : (i.applyTransition(e),
        i.$slides.eq(e).css({
            opacity: 1,
            zIndex: i.options.zIndex
        }),
        t && setTimeout(function() {
            i.disableTransition(e),
            t.call()
        }, i.options.speed))
    }
    ,
    t.prototype.fadeSlideOut = function(e) {
        var t = this;
        !1 === t.cssTransitions ? t.$slides.eq(e).animate({
            opacity: 0,
            zIndex: t.options.zIndex - 2
        }, t.options.speed, t.options.easing) : (t.applyTransition(e),
        t.$slides.eq(e).css({
            opacity: 0,
            zIndex: t.options.zIndex - 2
        }))
    }
    ,
    t.prototype.filterSlides = t.prototype.slickFilter = function(e) {
        var t = this;
        null !== e && (t.$slidesCache = t.$slides,
        t.unload(),
        t.$slideTrack.children(this.options.slide).detach(),
        t.$slidesCache.filter(e).appendTo(t.$slideTrack),
        t.reinit())
    }
    ,
    t.prototype.focusHandler = function() {
        var t = this;
        t.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*:not(.slick-arrow)", function(i) {
            i.stopImmediatePropagation();
            var s = e(this);
            setTimeout(function() {
                t.options.pauseOnFocus && (t.focussed = s.is(":focus"),
                t.autoPlay())
            }, 0)
        })
    }
    ,
    t.prototype.getCurrent = t.prototype.slickCurrentSlide = function() {
        return this.currentSlide
    }
    ,
    t.prototype.getDotCount = function() {
        var e = this
          , t = 0
          , i = 0
          , s = 0;
        if (!0 === e.options.infinite)
            for (; t < e.slideCount; )
                ++s,
                t = i + e.options.slidesToScroll,
                i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else if (!0 === e.options.centerMode)
            s = e.slideCount;
        else if (e.options.asNavFor)
            for (; t < e.slideCount; )
                ++s,
                t = i + e.options.slidesToScroll,
                i += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else
            s = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
        return s - 1
    }
    ,
    t.prototype.getLeft = function(e) {
        var t, i, s, n = this, o = 0;
        return n.slideOffset = 0,
        i = n.$slides.first().outerHeight(!0),
        !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1,
        o = i * n.options.slidesToShow * -1),
        n.slideCount % n.options.slidesToScroll != 0 && e + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (e > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (e - n.slideCount)) * n.slideWidth * -1,
        o = (n.options.slidesToShow - (e - n.slideCount)) * i * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1,
        o = n.slideCount % n.options.slidesToScroll * i * -1))) : e + n.options.slidesToShow > n.slideCount && (n.slideOffset = (e + n.options.slidesToShow - n.slideCount) * n.slideWidth,
        o = (e + n.options.slidesToShow - n.slideCount) * i),
        n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0,
        o = 0),
        !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0,
        n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)),
        t = !1 === n.options.vertical ? e * n.slideWidth * -1 + n.slideOffset : e * i * -1 + o,
        !0 === n.options.variableWidth && (s = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(e) : n.$slideTrack.children(".slick-slide").eq(e + n.options.slidesToShow),
        t = !0 === n.options.rtl ? s[0] ? -1 * (n.$slideTrack.width() - s[0].offsetLeft - s.width()) : 0 : s[0] ? -1 * s[0].offsetLeft : 0,
        !0 === n.options.centerMode && (s = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(e) : n.$slideTrack.children(".slick-slide").eq(e + n.options.slidesToShow + 1),
        t = !0 === n.options.rtl ? s[0] ? -1 * (n.$slideTrack.width() - s[0].offsetLeft - s.width()) : 0 : s[0] ? -1 * s[0].offsetLeft : 0,
        t += (n.$list.width() - s.outerWidth()) / 2)),
        t
    }
    ,
    t.prototype.getOption = t.prototype.slickGetOption = function(e) {
        return this.options[e]
    }
    ,
    t.prototype.getNavigableIndexes = function() {
        var e, t = this, i = 0, s = 0, n = [];
        for (!1 === t.options.infinite ? e = t.slideCount : (i = -1 * t.options.slidesToScroll,
        s = -1 * t.options.slidesToScroll,
        e = 2 * t.slideCount); e > i; )
            n.push(i),
            i = s + t.options.slidesToScroll,
            s += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
        return n
    }
    ,
    t.prototype.getSlick = function() {
        return this
    }
    ,
    t.prototype.getSlideCount = function() {
        var t, i, s = this;
        return i = !0 === s.options.centerMode ? s.slideWidth * Math.floor(s.options.slidesToShow / 2) : 0,
        !0 === s.options.swipeToSlide ? (s.$slideTrack.find(".slick-slide").each(function(n, o) {
            return o.offsetLeft - i + e(o).outerWidth() / 2 > -1 * s.swipeLeft ? (t = o,
            !1) : void 0
        }),
        Math.abs(e(t).attr("data-slick-index") - s.currentSlide) || 1) : s.options.slidesToScroll
    }
    ,
    t.prototype.goTo = t.prototype.slickGoTo = function(e, t) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(e)
            }
        }, t)
    }
    ,
    t.prototype.init = function(t) {
        var i = this;
        e(i.$slider).hasClass("slick-initialized") || (e(i.$slider).addClass("slick-initialized"),
        i.buildRows(),
        i.buildOut(),
        i.setProps(),
        i.startLoad(),
        i.loadSlider(),
        i.initializeEvents(),
        i.updateArrows(),
        i.updateDots(),
        i.checkResponsive(!0),
        i.focusHandler()),
        t && i.$slider.trigger("init", [i]),
        !0 === i.options.accessibility && i.initADA(),
        i.options.autoplay && (i.paused = !1,
        i.autoPlay())
    }
    ,
    t.prototype.initADA = function() {
        var t = this;
        t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }),
        t.$slideTrack.attr("role", "listbox"),
        t.$slides.not(t.$slideTrack.find(".slick-cloned")).each(function(i) {
            e(this).attr({
                role: "option",
                "aria-describedby": "slick-slide" + t.instanceUid + i
            })
        }),
        null !== t.$dots && t.$dots.attr("role", "tablist").find("li").each(function(i) {
            e(this).attr({
                role: "presentation",
                "aria-selected": "false",
                "aria-controls": "navigation" + t.instanceUid + i,
                id: "slick-slide" + t.instanceUid + i
            })
        }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"),
        t.activateADA()
    }
    ,
    t.prototype.initArrowEvents = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, e.changeSlide),
        e.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, e.changeSlide))
    }
    ,
    t.prototype.initDotEvents = function() {
        var t = this;
        !0 === t.options.dots && t.slideCount > t.options.slidesToShow && e("li", t.$dots).on("click.slick", {
            message: "index"
        }, t.changeSlide),
        !0 === t.options.dots && !0 === t.options.pauseOnDotsHover && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.interrupt, t, !0)).on("mouseleave.slick", e.proxy(t.interrupt, t, !1))
    }
    ,
    t.prototype.initSlideEvents = function() {
        var t = this;
        t.options.pauseOnHover && (t.$list.on("mouseenter.slick", e.proxy(t.interrupt, t, !0)),
        t.$list.on("mouseleave.slick", e.proxy(t.interrupt, t, !1)))
    }
    ,
    t.prototype.initializeEvents = function() {
        var t = this;
        t.initArrowEvents(),
        t.initDotEvents(),
        t.initSlideEvents(),
        t.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, t.swipeHandler),
        t.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, t.swipeHandler),
        t.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, t.swipeHandler),
        t.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, t.swipeHandler),
        t.$list.on("click.slick", t.clickHandler),
        e(document).on(t.visibilityChange, e.proxy(t.visibility, t)),
        !0 === t.options.accessibility && t.$list.on("keydown.slick", t.keyHandler),
        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler),
        e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)),
        e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)),
        e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault),
        e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition),
        e(document).on("ready.slick.slick-" + t.instanceUid, t.setPosition)
    }
    ,
    t.prototype.initUI = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(),
        e.$nextArrow.show()),
        !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show()
    }
    ,
    t.prototype.keyHandler = function(e) {
        var t = this;
        e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === t.options.accessibility ? t.changeSlide({
            data: {
                message: !0 === t.options.rtl ? "next" : "previous"
            }
        }) : 39 === e.keyCode && !0 === t.options.accessibility && t.changeSlide({
            data: {
                message: !0 === t.options.rtl ? "previous" : "next"
            }
        }))
    }
    ,
    t.prototype.lazyLoad = function() {
        function t(t) {
            e("img[data-lazy]", t).each(function() {
                var t = e(this)
                  , i = e(this).attr("data-lazy")
                  , s = document.createElement("img");
                s.onload = function() {
                    t.animate({
                        opacity: 0
                    }, 100, function() {
                        t.attr("src", i).animate({
                            opacity: 1
                        }, 200, function() {
                            t.removeAttr("data-lazy").removeClass("slick-loading")
                        }),
                        o.$slider.trigger("lazyLoaded", [o, t, i])
                    })
                }
                ,
                s.onerror = function() {
                    t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                    o.$slider.trigger("lazyLoadError", [o, t, i])
                }
                ,
                s.src = i
            })
        }
        var i, s, n, o = this;
        !0 === o.options.centerMode ? !0 === o.options.infinite ? (s = o.currentSlide + (o.options.slidesToShow / 2 + 1),
        n = s + o.options.slidesToShow + 2) : (s = Math.max(0, o.currentSlide - (o.options.slidesToShow / 2 + 1)),
        n = o.options.slidesToShow / 2 + 1 + 2 + o.currentSlide) : (s = o.options.infinite ? o.options.slidesToShow + o.currentSlide : o.currentSlide,
        n = Math.ceil(s + o.options.slidesToShow),
        !0 === o.options.fade && (s > 0 && s--,
        n <= o.slideCount && n++)),
        t(o.$slider.find(".slick-slide").slice(s, n)),
        o.slideCount <= o.options.slidesToShow ? (i = o.$slider.find(".slick-slide"),
        t(i)) : o.currentSlide >= o.slideCount - o.options.slidesToShow ? (i = o.$slider.find(".slick-cloned").slice(0, o.options.slidesToShow),
        t(i)) : 0 === o.currentSlide && (i = o.$slider.find(".slick-cloned").slice(-1 * o.options.slidesToShow),
        t(i))
    }
    ,
    t.prototype.loadSlider = function() {
        var e = this;
        e.setPosition(),
        e.$slideTrack.css({
            opacity: 1
        }),
        e.$slider.removeClass("slick-loading"),
        e.initUI(),
        "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
    }
    ,
    t.prototype.next = t.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        })
    }
    ,
    t.prototype.orientationChange = function() {
        var e = this;
        e.checkResponsive(),
        e.setPosition()
    }
    ,
    t.prototype.pause = t.prototype.slickPause = function() {
        var e = this;
        e.autoPlayClear(),
        e.paused = !0
    }
    ,
    t.prototype.play = t.prototype.slickPlay = function() {
        var e = this;
        e.autoPlay(),
        e.options.autoplay = !0,
        e.paused = !1,
        e.focussed = !1,
        e.interrupted = !1
    }
    ,
    t.prototype.postSlide = function(e) {
        var t = this;
        t.unslicked || (t.$slider.trigger("afterChange", [t, e]),
        t.animating = !1,
        t.setPosition(),
        t.swipeLeft = null,
        t.options.autoplay && t.autoPlay(),
        !0 === t.options.accessibility && t.initADA())
    }
    ,
    t.prototype.prev = t.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        })
    }
    ,
    t.prototype.preventDefault = function(e) {
        e.preventDefault()
    }
    ,
    t.prototype.progressiveLazyLoad = function(t) {
        t = t || 1;
        var i, s, n, o = this, r = e("img[data-lazy]", o.$slider);
        r.length ? (i = r.first(),
        s = i.attr("data-lazy"),
        n = document.createElement("img"),
        n.onload = function() {
            i.attr("src", s).removeAttr("data-lazy").removeClass("slick-loading"),
            !0 === o.options.adaptiveHeight && o.setPosition(),
            o.$slider.trigger("lazyLoaded", [o, i, s]),
            o.progressiveLazyLoad()
        }
        ,
        n.onerror = function() {
            3 > t ? setTimeout(function() {
                o.progressiveLazyLoad(t + 1)
            }, 500) : (i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
            o.$slider.trigger("lazyLoadError", [o, i, s]),
            o.progressiveLazyLoad())
        }
        ,
        n.src = s) : o.$slider.trigger("allImagesLoaded", [o])
    }
    ,
    t.prototype.refresh = function(t) {
        var i, s, n = this;
        s = n.slideCount - n.options.slidesToShow,
        !n.options.infinite && n.currentSlide > s && (n.currentSlide = s),
        n.slideCount <= n.options.slidesToShow && (n.currentSlide = 0),
        i = n.currentSlide,
        n.destroy(!0),
        e.extend(n, n.initials, {
            currentSlide: i
        }),
        n.init(),
        t || n.changeSlide({
            data: {
                message: "index",
                index: i
            }
        }, !1)
    }
    ,
    t.prototype.registerBreakpoints = function() {
        var t, i, s, n = this, o = n.options.responsive || null;
        if ("array" === e.type(o) && o.length) {
            n.respondTo = n.options.respondTo || "window";
            for (t in o)
                if (s = n.breakpoints.length - 1,
                i = o[t].breakpoint,
                o.hasOwnProperty(t)) {
                    for (; s >= 0; )
                        n.breakpoints[s] && n.breakpoints[s] === i && n.breakpoints.splice(s, 1),
                        s--;
                    n.breakpoints.push(i),
                    n.breakpointSettings[i] = o[t].settings
                }
            n.breakpoints.sort(function(e, t) {
                return n.options.mobileFirst ? e - t : t - e
            })
        }
    }
    ,
    t.prototype.reinit = function() {
        var t = this;
        t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide"),
        t.slideCount = t.$slides.length,
        t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll),
        t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0),
        t.registerBreakpoints(),
        t.setProps(),
        t.setupInfinite(),
        t.buildArrows(),
        t.updateArrows(),
        t.initArrowEvents(),
        t.buildDots(),
        t.updateDots(),
        t.initDotEvents(),
        t.cleanUpSlideEvents(),
        t.initSlideEvents(),
        t.checkResponsive(!1, !0),
        !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler),
        t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0),
        t.setPosition(),
        t.focusHandler(),
        t.paused = !t.options.autoplay,
        t.autoPlay(),
        t.$slider.trigger("reInit", [t])
    }
    ,
    t.prototype.resize = function() {
        var t = this;
        e(window).width() !== t.windowWidth && (clearTimeout(t.windowDelay),
        t.windowDelay = window.setTimeout(function() {
            t.windowWidth = e(window).width(),
            t.checkResponsive(),
            t.unslicked || t.setPosition()
        }, 50))
    }
    ,
    t.prototype.removeSlide = t.prototype.slickRemove = function(e, t, i) {
        var s = this;
        return "boolean" == typeof e ? (t = e,
        e = !0 === t ? 0 : s.slideCount - 1) : e = !0 === t ? --e : e,
        !(s.slideCount < 1 || 0 > e || e > s.slideCount - 1) && (s.unload(),
        !0 === i ? s.$slideTrack.children().remove() : s.$slideTrack.children(this.options.slide).eq(e).remove(),
        s.$slides = s.$slideTrack.children(this.options.slide),
        s.$slideTrack.children(this.options.slide).detach(),
        s.$slideTrack.append(s.$slides),
        s.$slidesCache = s.$slides,
        void s.reinit())
    }
    ,
    t.prototype.setCSS = function(e) {
        var t, i, s = this, n = {};
        !0 === s.options.rtl && (e = -e),
        t = "left" == s.positionProp ? Math.ceil(e) + "px" : "0px",
        i = "top" == s.positionProp ? Math.ceil(e) + "px" : "0px",
        n[s.positionProp] = e,
        !1 === s.transformsEnabled ? s.$slideTrack.css(n) : (n = {},
        !1 === s.cssTransitions ? (n[s.animType] = "translate(" + t + ", " + i + ")",
        s.$slideTrack.css(n)) : (n[s.animType] = "translate3d(" + t + ", " + i + ", 0px)",
        s.$slideTrack.css(n)))
    }
    ,
    t.prototype.setDimensions = function() {
        var e = this;
        !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
            padding: "0px " + e.options.centerPadding
        }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow),
        !0 === e.options.centerMode && e.$list.css({
            padding: e.options.centerPadding + " 0px"
        })),
        e.listWidth = e.$list.width(),
        e.listHeight = e.$list.height(),
        !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow),
        e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth),
        e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
        var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
        !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
    }
    ,
    t.prototype.setFade = function() {
        var t, i = this;
        i.$slides.each(function(s, n) {
            t = i.slideWidth * s * -1,
            !0 === i.options.rtl ? e(n).css({
                position: "relative",
                right: t,
                top: 0,
                zIndex: i.options.zIndex - 2,
                opacity: 0
            }) : e(n).css({
                position: "relative",
                left: t,
                top: 0,
                zIndex: i.options.zIndex - 2,
                opacity: 0
            })
        }),
        i.$slides.eq(i.currentSlide).css({
            zIndex: i.options.zIndex - 1,
            opacity: 1
        })
    }
    ,
    t.prototype.setHeight = function() {
        var e = this;
        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
            e.$list.css("height", t)
        }
    }
    ,
    t.prototype.setOption = t.prototype.slickSetOption = function() {
        var t, i, s, n, o, r = this, a = !1;
        if ("object" === e.type(arguments[0]) ? (s = arguments[0],
        a = arguments[1],
        o = "multiple") : "string" === e.type(arguments[0]) && (s = arguments[0],
        n = arguments[1],
        a = arguments[2],
        "responsive" === arguments[0] && "array" === e.type(arguments[1]) ? o = "responsive" : void 0 !== arguments[1] && (o = "single")),
        "single" === o)
            r.options[s] = n;
        else if ("multiple" === o)
            e.each(s, function(e, t) {
                r.options[e] = t
            });
        else if ("responsive" === o)
            for (i in n)
                if ("array" !== e.type(r.options.responsive))
                    r.options.responsive = [n[i]];
                else {
                    for (t = r.options.responsive.length - 1; t >= 0; )
                        r.options.responsive[t].breakpoint === n[i].breakpoint && r.options.responsive.splice(t, 1),
                        t--;
                    r.options.responsive.push(n[i])
                }
        a && (r.unload(),
        r.reinit())
    }
    ,
    t.prototype.setPosition = function() {
        var e = this;
        e.setDimensions(),
        e.setHeight(),
        !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(),
        e.$slider.trigger("setPosition", [e])
    }
    ,
    t.prototype.setProps = function() {
        var e = this
          , t = document.body.style;
        e.positionProp = !0 === e.options.vertical ? "top" : "left",
        "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"),
        (void 0 !== t.WebkitTransition || void 0 !== t.MozTransition || void 0 !== t.msTransition) && !0 === e.options.useCSS && (e.cssTransitions = !0),
        e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex),
        void 0 !== t.OTransform && (e.animType = "OTransform",
        e.transformType = "-o-transform",
        e.transitionType = "OTransition",
        void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
        void 0 !== t.MozTransform && (e.animType = "MozTransform",
        e.transformType = "-moz-transform",
        e.transitionType = "MozTransition",
        void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)),
        void 0 !== t.webkitTransform && (e.animType = "webkitTransform",
        e.transformType = "-webkit-transform",
        e.transitionType = "webkitTransition",
        void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
        void 0 !== t.msTransform && (e.animType = "msTransform",
        e.transformType = "-ms-transform",
        e.transitionType = "msTransition",
        void 0 === t.msTransform && (e.animType = !1)),
        void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform",
        e.transformType = "transform",
        e.transitionType = "transition"),
        e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
    }
    ,
    t.prototype.setSlideClasses = function(e) {
        var t, i, s, n, o = this;
        i = o.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
        o.$slides.eq(e).addClass("slick-current"),
        !0 === o.options.centerMode ? (t = Math.floor(o.options.slidesToShow / 2),
        !0 === o.options.infinite && (e >= t && e <= o.slideCount - 1 - t ? o.$slides.slice(e - t, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (s = o.options.slidesToShow + e,
        i.slice(s - t + 1, s + t + 2).addClass("slick-active").attr("aria-hidden", "false")),
        0 === e ? i.eq(i.length - 1 - o.options.slidesToShow).addClass("slick-center") : e === o.slideCount - 1 && i.eq(o.options.slidesToShow).addClass("slick-center")),
        o.$slides.eq(e).addClass("slick-center")) : e >= 0 && e <= o.slideCount - o.options.slidesToShow ? o.$slides.slice(e, e + o.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : i.length <= o.options.slidesToShow ? i.addClass("slick-active").attr("aria-hidden", "false") : (n = o.slideCount % o.options.slidesToShow,
        s = !0 === o.options.infinite ? o.options.slidesToShow + e : e,
        o.options.slidesToShow == o.options.slidesToScroll && o.slideCount - e < o.options.slidesToShow ? i.slice(s - (o.options.slidesToShow - n), s + n).addClass("slick-active").attr("aria-hidden", "false") : i.slice(s, s + o.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")),
        "ondemand" === o.options.lazyLoad && o.lazyLoad()
    }
    ,
    t.prototype.setupInfinite = function() {
        var t, i, s, n = this;
        if (!0 === n.options.fade && (n.options.centerMode = !1),
        !0 === n.options.infinite && !1 === n.options.fade && (i = null,
        n.slideCount > n.options.slidesToShow)) {
            for (s = !0 === n.options.centerMode ? n.options.slidesToShow + 1 : n.options.slidesToShow,
            t = n.slideCount; t > n.slideCount - s; t -= 1)
                i = t - 1,
                e(n.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i - n.slideCount).prependTo(n.$slideTrack).addClass("slick-cloned");
            for (t = 0; s > t; t += 1)
                i = t,
                e(n.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i + n.slideCount).appendTo(n.$slideTrack).addClass("slick-cloned");
            n.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                e(this).attr("id", "")
            })
        }
    }
    ,
    t.prototype.interrupt = function(e) {
        var t = this;
        e || t.autoPlay(),
        t.interrupted = e
    }
    ,
    t.prototype.selectHandler = function(t) {
        var i = this
          , s = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide")
          , n = parseInt(s.attr("data-slick-index"));
        return n || (n = 0),
        i.slideCount <= i.options.slidesToShow ? (i.setSlideClasses(n),
        void i.asNavFor(n)) : void i.slideHandler(n)
    }
    ,
    t.prototype.slideHandler = function(e, t, i) {
        var s, n, o, r, a, l = null, d = this;
        return t = t || !1,
        !0 === d.animating && !0 === d.options.waitForAnimate || !0 === d.options.fade && d.currentSlide === e || d.slideCount <= d.options.slidesToShow ? void 0 : (!1 === t && d.asNavFor(e),
        s = e,
        l = d.getLeft(s),
        r = d.getLeft(d.currentSlide),
        d.currentLeft = null === d.swipeLeft ? r : d.swipeLeft,
        !1 === d.options.infinite && !1 === d.options.centerMode && (0 > e || e > d.getDotCount() * d.options.slidesToScroll) ? void (!1 === d.options.fade && (s = d.currentSlide,
        !0 !== i ? d.animateSlide(r, function() {
            d.postSlide(s)
        }) : d.postSlide(s))) : !1 === d.options.infinite && !0 === d.options.centerMode && (0 > e || e > d.slideCount - d.options.slidesToScroll) ? void (!1 === d.options.fade && (s = d.currentSlide,
        !0 !== i ? d.animateSlide(r, function() {
            d.postSlide(s)
        }) : d.postSlide(s))) : (d.options.autoplay && clearInterval(d.autoPlayTimer),
        n = 0 > s ? d.slideCount % d.options.slidesToScroll != 0 ? d.slideCount - d.slideCount % d.options.slidesToScroll : d.slideCount + s : s >= d.slideCount ? d.slideCount % d.options.slidesToScroll != 0 ? 0 : s - d.slideCount : s,
        d.animating = !0,
        d.$slider.trigger("beforeChange", [d, d.currentSlide, n]),
        o = d.currentSlide,
        d.currentSlide = n,
        d.setSlideClasses(d.currentSlide),
        d.options.asNavFor && (a = d.getNavTarget(),
        (a = a.slick("getSlick")).slideCount <= a.options.slidesToShow && a.setSlideClasses(d.currentSlide)),
        d.updateDots(),
        d.updateArrows(),
        !0 === d.options.fade ? (!0 !== i ? (d.fadeSlideOut(o),
        d.fadeSlide(n, function() {
            d.postSlide(n)
        })) : d.postSlide(n),
        void d.animateHeight()) : void (!0 !== i ? d.animateSlide(l, function() {
            d.postSlide(n)
        }) : d.postSlide(n))))
    }
    ,
    t.prototype.startLoad = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(),
        e.$nextArrow.hide()),
        !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(),
        e.$slider.addClass("slick-loading")
    }
    ,
    t.prototype.swipeDirection = function() {
        var e, t, i, s, n = this;
        return e = n.touchObject.startX - n.touchObject.curX,
        t = n.touchObject.startY - n.touchObject.curY,
        i = Math.atan2(t, e),
        0 > (s = Math.round(180 * i / Math.PI)) && (s = 360 - Math.abs(s)),
        45 >= s && s >= 0 ? !1 === n.options.rtl ? "left" : "right" : 360 >= s && s >= 315 ? !1 === n.options.rtl ? "left" : "right" : s >= 135 && 225 >= s ? !1 === n.options.rtl ? "right" : "left" : !0 === n.options.verticalSwiping ? s >= 35 && 135 >= s ? "down" : "up" : "vertical"
    }
    ,
    t.prototype.swipeEnd = function(e) {
        var t, i, s = this;
        if (s.dragging = !1,
        s.interrupted = !1,
        s.shouldClick = !(s.touchObject.swipeLength > 10),
        void 0 === s.touchObject.curX)
            return !1;
        if (!0 === s.touchObject.edgeHit && s.$slider.trigger("edge", [s, s.swipeDirection()]),
        s.touchObject.swipeLength >= s.touchObject.minSwipe) {
            switch (i = s.swipeDirection()) {
            case "left":
            case "down":
                t = s.options.swipeToSlide ? s.checkNavigable(s.currentSlide + s.getSlideCount()) : s.currentSlide + s.getSlideCount(),
                s.currentDirection = 0;
                break;
            case "right":
            case "up":
                t = s.options.swipeToSlide ? s.checkNavigable(s.currentSlide - s.getSlideCount()) : s.currentSlide - s.getSlideCount(),
                s.currentDirection = 1
            }
            "vertical" != i && (s.slideHandler(t),
            s.touchObject = {},
            s.$slider.trigger("swipe", [s, i]))
        } else
            s.touchObject.startX !== s.touchObject.curX && (s.slideHandler(s.currentSlide),
            s.touchObject = {})
    }
    ,
    t.prototype.swipeHandler = function(e) {
        var t = this;
        if (!(!1 === t.options.swipe || "ontouchend"in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse")))
            switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1,
            t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold,
            !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold),
            e.data.action) {
            case "start":
                t.swipeStart(e);
                break;
            case "move":
                t.swipeMove(e);
                break;
            case "end":
                t.swipeEnd(e)
            }
    }
    ,
    t.prototype.swipeMove = function(e) {
        var t, i, s, n, o, r = this;
        return o = void 0 !== e.originalEvent ? e.originalEvent.touches : null,
        !(!r.dragging || o && 1 !== o.length) && (t = r.getLeft(r.currentSlide),
        r.touchObject.curX = void 0 !== o ? o[0].pageX : e.clientX,
        r.touchObject.curY = void 0 !== o ? o[0].pageY : e.clientY,
        r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curX - r.touchObject.startX, 2))),
        !0 === r.options.verticalSwiping && (r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curY - r.touchObject.startY, 2)))),
        i = r.swipeDirection(),
        "vertical" !== i ? (void 0 !== e.originalEvent && r.touchObject.swipeLength > 4 && e.preventDefault(),
        n = (!1 === r.options.rtl ? 1 : -1) * (r.touchObject.curX > r.touchObject.startX ? 1 : -1),
        !0 === r.options.verticalSwiping && (n = r.touchObject.curY > r.touchObject.startY ? 1 : -1),
        s = r.touchObject.swipeLength,
        r.touchObject.edgeHit = !1,
        !1 === r.options.infinite && (0 === r.currentSlide && "right" === i || r.currentSlide >= r.getDotCount() && "left" === i) && (s = r.touchObject.swipeLength * r.options.edgeFriction,
        r.touchObject.edgeHit = !0),
        !1 === r.options.vertical ? r.swipeLeft = t + s * n : r.swipeLeft = t + s * (r.$list.height() / r.listWidth) * n,
        !0 === r.options.verticalSwiping && (r.swipeLeft = t + s * n),
        !0 !== r.options.fade && !1 !== r.options.touchMove && (!0 === r.animating ? (r.swipeLeft = null,
        !1) : void r.setCSS(r.swipeLeft))) : void 0)
    }
    ,
    t.prototype.swipeStart = function(e) {
        var t, i = this;
        return i.interrupted = !0,
        1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow ? (i.touchObject = {},
        !1) : (void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]),
        i.touchObject.startX = i.touchObject.curX = void 0 !== t ? t.pageX : e.clientX,
        i.touchObject.startY = i.touchObject.curY = void 0 !== t ? t.pageY : e.clientY,
        void (i.dragging = !0))
    }
    ,
    t.prototype.unfilterSlides = t.prototype.slickUnfilter = function() {
        var e = this;
        null !== e.$slidesCache && (e.unload(),
        e.$slideTrack.children(this.options.slide).detach(),
        e.$slidesCache.appendTo(e.$slideTrack),
        e.reinit())
    }
    ,
    t.prototype.unload = function() {
        var t = this;
        e(".slick-cloned", t.$slider).remove(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(),
        t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(),
        t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }
    ,
    t.prototype.unslick = function(e) {
        var t = this;
        t.$slider.trigger("unslick", [t, e]),
        t.destroy()
    }
    ,
    t.prototype.updateArrows = function() {
        var e = this;
        Math.floor(e.options.slidesToShow / 2),
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }
    ,
    t.prototype.updateDots = function() {
        var e = this;
        null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"),
        e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"))
    }
    ,
    t.prototype.visibility = function() {
        var e = this;
        e.options.autoplay && (document[e.hidden] ? e.interrupted = !0 : e.interrupted = !1)
    }
    ,
    e.fn.slick = function() {
        var e, i, s = this, n = arguments[0], o = Array.prototype.slice.call(arguments, 1), r = s.length;
        for (e = 0; r > e; e++)
            if ("object" == typeof n || void 0 === n ? s[e].slick = new t(s[e],n) : i = s[e].slick[n].apply(s[e].slick, o),
            void 0 !== i)
                return i;
        return s
    }
}),
window.CustomModernizr = function(e, t, i) {
    function s(e) {
        m.cssText = e
    }
    function n(e, t) {
        return typeof e === t
    }
    function o(e, t) {
        return !!~("" + e).indexOf(t)
    }
    function r(e, t) {
        for (var s in e) {
            var n = e[s];
            if (!o(n, "-") && m[n] !== i)
                return "pfx" != t || n
        }
        return !1
    }
    function a(e, t, s) {
        for (var o in e) {
            var r = t[e[o]];
            if (r !== i)
                return !1 === s ? e[o] : n(r, "function") ? r.bind(s || t) : r
        }
        return !1
    }
    function l(e, t, i) {
        var s = e.charAt(0).toUpperCase() + e.slice(1)
          , o = (e + " " + w.join(s + " ") + s).split(" ");
        return n(t, "string") || n(t, "undefined") ? r(o, t) : (o = (e + " " + y.join(s + " ") + s).split(" "),
        a(o, t, i))
    }
    var d, c, p = {}, f = t.documentElement, u = "modernizr", h = t.createElement(u), m = h.style, g = " -webkit- -moz- -o- -ms- ".split(" "), v = "Webkit Moz O ms", w = v.split(" "), y = v.toLowerCase().split(" "), b = {}, x = [], k = x.slice, T = function(e, i, s, n) {
        var o, r, a, l, d = t.createElement("div"), c = t.body, p = c || t.createElement("body");
        if (parseInt(s, 10))
            for (; s--; )
                a = t.createElement("div"),
                a.id = n ? n[s] : u + (s + 1),
                d.appendChild(a);
        return o = ["&#173;", '<style id="s', u, '">', e, "</style>"].join(""),
        d.id = u,
        (c ? d : p).innerHTML += o,
        p.appendChild(d),
        c || (p.style.background = "",
        p.style.overflow = "hidden",
        l = f.style.overflow,
        f.style.overflow = "hidden",
        f.appendChild(p)),
        r = i(d, e),
        c ? d.parentNode.removeChild(d) : (p.parentNode.removeChild(p),
        f.style.overflow = l),
        !!r
    }, C = {}.hasOwnProperty;
    c = n(C, "undefined") || n(C.call, "undefined") ? function(e, t) {
        return t in e && n(e.constructor.prototype[t], "undefined")
    }
    : function(e, t) {
        return C.call(e, t)
    }
    ,
    Function.prototype.bind || (Function.prototype.bind = function(e) {
        var t = this;
        if ("function" != typeof t)
            throw new TypeError;
        var i = k.call(arguments, 1)
          , s = function() {
            if (this instanceof s) {
                var n = function() {};
                n.prototype = t.prototype;
                var o = new n
                  , r = t.apply(o, i.concat(k.call(arguments)));
                return Object(r) === r ? r : o
            }
            return t.apply(e, i.concat(k.call(arguments)))
        };
        return s
    }
    ),
    b.csstransforms = function() {
        return !!l("transform")
    }
    ,
    b.csstransforms3d = function() {
        var e = !!l("perspective");
        return e && "webkitPerspective"in f.style && T("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(t, i) {
            e = 9 === t.offsetLeft && 3 === t.offsetHeight
        }),
        e
    }
    ,
    b.csstransitions = function() {
        return l("transition")
    }
    ;
    for (var S in b)
        c(b, S) && (d = S.toLowerCase(),
        p[d] = b[S](),
        x.push((p[d] ? "" : "no-") + d));
    return p.addTest = function(e, t) {
        if ("object" == typeof e)
            for (var s in e)
                c(e, s) && p.addTest(s, e[s]);
        else {
            if (e = e.toLowerCase(),
            p[e] !== i)
                return p;
            t = "function" == typeof t ? t() : t,
            f.className += " " + (t ? "" : "no-") + e,
            p[e] = t
        }
        return p
    }
    ,
    s(""),
    h = null,
    p._version = "2.6.2",
    p._prefixes = g,
    p._domPrefixes = y,
    p._cssomPrefixes = w,
    p.testProp = function(e) {
        return r([e])
    }
    ,
    p.testAllProps = l,
    p.testStyles = T,
    p.prefixed = function(e, t, i) {
        return t ? l(e, t, i) : l(e, "pfx")
    }
    ,
    f.className = f.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + " js " + x.join(" "),
    p
}(0, this.document),
window.findAndReplaceDOMText = function() {
    function e(e) {
        return String(e).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
    }
    function t() {
        return i.apply(null, arguments) || s.apply(null, arguments)
    }
    function i(e, i, n, o, r) {
        if (i && !i.nodeType && arguments.length <= 2)
            return !1;
        var a = "function" == typeof n;
        a && (n = function(e) {
            return function(t, i) {
                return e(t.text, i.startIndex)
            }
        }(n));
        var l = s(i, {
            find: e,
            wrap: a ? null : n,
            replace: a ? n : "$" + (o || "&"),
            prepMatch: function(e, t) {
                if (!e[0])
                    throw "findAndReplaceDOMText cannot handle zero-length matches";
                if (o > 0) {
                    var i = e[o];
                    e.index += e[0].indexOf(i),
                    e[0] = i
                }
                return e.endIndex = e.index + e[0].length,
                e.startIndex = e.index,
                e.index = t,
                e
            },
            filterElements: r
        });
        return t.revert = function() {
            return l.revert()
        }
        ,
        !0
    }
    function s(e, t) {
        return new n(e,t)
    }
    function n(e, t) {
        t.portionMode = t.portionMode || o,
        this.node = e,
        this.options = t,
        this.prepMatch = t.prepMatch || this.prepMatch,
        this.reverts = [],
        this.matches = this.search(),
        this.matches.length && this.processMatches()
    }
    var o = "retain"
      , r = document;
    return t.Finder = n,
    n.prototype = {
        search: function() {
            var t, i = 0, s = this.options.find, n = this.getAggregateText(), o = [];
            if ((s = "string" == typeof s ? RegExp(e(s), "g") : s).global)
                for (; t = s.exec(n); )
                    o.push(this.prepMatch(t, i++));
            else
                (t = n.match(s)) && o.push(this.prepMatch(t, 0));
            return o
        },
        prepMatch: function(e, t) {
            if (!e[0])
                throw new Error("findAndReplaceDOMText cannot handle zero-length matches");
            return e.endIndex = e.index + e[0].length,
            e.startIndex = e.index,
            e.index = t,
            e
        },
        getAggregateText: function() {
            function e(i) {
                if (3 === i.nodeType)
                    return i.data;
                if (t && !t(i))
                    return "";
                var s = "";
                if (i = i.firstChild)
                    do {
                        s += e(i)
                    } while (i = i.nextSibling);return s
            }
            var t = this.options.filterElements;
            return e(this.node)
        },
        processMatches: function() {
            var e, t, i, s = this.matches, n = this.node, o = this.options.filterElements, r = [], a = n, l = s.shift(), d = 0, c = 0, p = 0, f = [n];
            e: for (; ; ) {
                if (3 === a.nodeType && (!t && a.length + d >= l.endIndex ? t = {
                    node: a,
                    index: p++,
                    text: a.data.substring(l.startIndex - d, l.endIndex - d),
                    indexInMatch: d - l.startIndex,
                    indexInNode: l.startIndex - d,
                    endIndexInNode: l.endIndex - d,
                    isEnd: !0
                } : e && r.push({
                    node: a,
                    index: p++,
                    text: a.data,
                    indexInMatch: d - l.startIndex,
                    indexInNode: 0
                }),
                !e && a.length + d > l.startIndex && (e = {
                    node: a,
                    index: p++,
                    indexInMatch: 0,
                    indexInNode: l.startIndex - d,
                    endIndexInNode: l.endIndex - d,
                    text: a.data.substring(l.startIndex - d, l.endIndex - d)
                }),
                d += a.data.length),
                i = 1 === a.nodeType && o && !o(a),
                e && t) {
                    if (a = this.replaceMatch(l, e, r, t),
                    d -= t.node.data.length - t.endIndexInNode,
                    e = null,
                    t = null,
                    r = [],
                    l = s.shift(),
                    p = 0,
                    c++,
                    !l)
                        break
                } else if (!i && (a.firstChild || a.nextSibling)) {
                    a.firstChild ? (f.push(a),
                    a = a.firstChild) : a = a.nextSibling;
                    continue
                }
                for (; ; ) {
                    if (a.nextSibling) {
                        a = a.nextSibling;
                        break
                    }
                    if ((a = f.pop()) === n)
                        break e
                }
            }
        },
        revert: function() {
            for (var e = this.reverts.length; e--; )
                this.reverts[e]();
            this.reverts = []
        },
        prepareReplacementString: function(e, t, i, s) {
            var n = this.options.portionMode;
            return "first" === n && t.indexInMatch > 0 ? "" : (e = e.replace(/\$(\d+|&|`|')/g, function(e, t) {
                var s;
                switch (t) {
                case "&":
                    s = i[0];
                    break;
                case "`":
                    s = i.input.substring(0, i.startIndex);
                    break;
                case "'":
                    s = i.input.substring(i.endIndex);
                    break;
                default:
                    s = i[+t]
                }
                return s
            }),
            "first" === n ? e : t.isEnd ? e.substring(t.indexInMatch) : e.substring(t.indexInMatch, t.indexInMatch + t.text.length))
        },
        getPortionReplacementNode: function(e, t, i) {
            var s = this.options.replace || "$&"
              , n = this.options.clss
              , o = this.options.wrap;
            if (o && o.nodeType) {
                var a = r.createElement("div");
                a.innerHTML = o.outerHTML || (new XMLSerializer).serializeToString(o),
                o = a.firstChild
            }
            if ("function" == typeof s)
                return s = s(e, t, i),
                s && s.nodeType ? s : r.createTextNode(String(s));
            var l = "string" == typeof o ? r.createElement(o) : o;
            return n && (l.className = n),
            (s = r.createTextNode(this.prepareReplacementString(s, e, t, i))).data && l ? (l.appendChild(s),
            l) : s
        },
        replaceMatch: function(e, t, i, s) {
            var n, o, a = t.node, l = s.node;
            if (a === l) {
                var d = a;
                t.indexInNode > 0 && (n = r.createTextNode(d.data.substring(0, t.indexInNode)),
                d.parentNode.insertBefore(n, d));
                var c = this.getPortionReplacementNode(s, e);
                return d.parentNode.insertBefore(c, d),
                s.endIndexInNode < d.length && (o = r.createTextNode(d.data.substring(s.endIndexInNode)),
                d.parentNode.insertBefore(o, d)),
                d.parentNode.removeChild(d),
                this.reverts.push(function() {
                    n === c.previousSibling && n.parentNode.removeChild(n),
                    o === c.nextSibling && o.parentNode.removeChild(o),
                    c.parentNode.replaceChild(d, c)
                }),
                c
            }
            n = r.createTextNode(a.data.substring(0, t.indexInNode)),
            o = r.createTextNode(l.data.substring(s.endIndexInNode));
            for (var p = this.getPortionReplacementNode(t, e), f = [], u = 0, h = i.length; u < h; ++u) {
                var m = i[u]
                  , g = this.getPortionReplacementNode(m, e);
                m.node.parentNode.replaceChild(g, m.node),
                this.reverts.push(function(e, t) {
                    return function() {
                        t.parentNode.replaceChild(e.node, t)
                    }
                }(m, g)),
                f.push(g)
            }
            var v = this.getPortionReplacementNode(s, e);
            return a.parentNode.insertBefore(n, a),
            a.parentNode.insertBefore(p, a),
            a.parentNode.removeChild(a),
            l.parentNode.insertBefore(v, l),
            l.parentNode.insertBefore(o, l),
            l.parentNode.removeChild(l),
            this.reverts.push(function() {
                n.parentNode.removeChild(n),
                p.parentNode.replaceChild(a, p),
                o.parentNode.removeChild(o),
                v.parentNode.replaceChild(l, v)
            }),
            v
        }
    },
    t
}(),
function(e, t) {
    function i(e, t, i) {
        var s = e.children()
          , n = !1;
        e.empty();
        for (var r = 0, a = s.length; a > r; r++) {
            var l = s.eq(r);
            if (e.append(l),
            i && e.append(i),
            o(e, t)) {
                l.remove(),
                n = !0;
                break
            }
            i && i.detach()
        }
        return n
    }
    function s(t, i, r, a, l) {
        var d = !1;
        return t.contents().detach().each(function() {
            var c = this
              , p = e(c);
            if (void 0 === c)
                return !0;
            if (p.is("script, .dotdotdot-keep"))
                t.append(p);
            else {
                if (d)
                    return !0;
                t.append(p),
                !l || p.is(a.after) || p.find(a.after).length || t[t.is("a, table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, blockquote, select, optgroup, option, textarea, script, style") ? "after" : "append"](l),
                o(r, a) && (d = 3 == c.nodeType ? n(p, i, r, a, l) : s(p, i, r, a, l)),
                d || l && l.detach()
            }
        }),
        i.addClass("is-truncated"),
        d
    }
    function n(t, i, s, n, a) {
        var c = t[0];
        if (!c)
            return !1;
        var f = d(c)
          , u = -1 !== f.indexOf(" ") ? " " : "　"
          , h = "letter" == n.wrap ? "" : u
          , m = f.split(h)
          , g = -1
          , v = -1
          , w = 0
          , y = m.length - 1;
        for (n.fallbackToLetter && 0 == w && 0 == y && (h = "",
        m = f.split(h),
        y = m.length - 1); y >= w && (0 != w || 0 != y); ) {
            var b = Math.floor((w + y) / 2);
            if (b == v)
                break;
            v = b,
            l(c, m.slice(0, v + 1).join(h) + n.ellipsis),
            s.children().each(function() {
                e(this).toggle().toggle()
            }),
            o(s, n) ? (y = v,
            n.fallbackToLetter && 0 == w && 0 == y && (h = "",
            m = m[0].split(h),
            g = -1,
            v = -1,
            w = 0,
            y = m.length - 1)) : (g = v,
            w = v)
        }
        if (-1 == g || 1 == m.length && 0 == m[0].length) {
            var x = t.parent();
            t.detach();
            var k = a && a.closest(x).length ? a.length : 0;
            if (x.contents().length > k ? c = p(x.contents().eq(-1 - k), i) : (c = p(x, i, !0),
            k || x.detach()),
            c && (f = r(d(c), n),
            l(c, f),
            k && a)) {
                var T = a.parent();
                e(c).parent().append(a),
                e.trim(T.html()) || T.remove()
            }
        } else
            f = r(m.slice(0, g + 1).join(h), n),
            l(c, f);
        return !0
    }
    function o(e, t) {
        return e.innerHeight() > t.maxHeight
    }
    function r(t, i) {
        for (; e.inArray(t.slice(-1), i.lastCharacter.remove) > -1; )
            t = t.slice(0, -1);
        return e.inArray(t.slice(-1), i.lastCharacter.noEllipsis) < 0 && (t += i.ellipsis),
        t
    }
    function a(e) {
        return {
            width: e.innerWidth(),
            height: e.innerHeight()
        }
    }
    function l(e, t) {
        e.innerText ? e.innerText = t : e.nodeValue ? e.nodeValue = t : e.textContent && (e.textContent = t)
    }
    function d(e) {
        return e.innerText ? e.innerText : e.nodeValue ? e.nodeValue : e.textContent ? e.textContent : ""
    }
    function c(e) {
        do {
            e = e.previousSibling
        } while (e && 1 !== e.nodeType && 3 !== e.nodeType);return e
    }
    function p(t, i, s) {
        var n, o = t && t[0];
        if (o) {
            if (!s) {
                if (3 === o.nodeType)
                    return o;
                if (e.trim(t.text()))
                    return p(t.contents().last(), i)
            }
            for (n = c(o); !n; ) {
                if ((t = t.parent()).is(i) || !t.length)
                    return !1;
                n = c(t[0])
            }
            if (n)
                return p(e(n), i)
        }
        return !1
    }
    function f(t, i) {
        return !!t && ("string" == typeof t ? !!(t = e(t, i)).length && t : !!t.jquery && t)
    }
    function u(e) {
        for (var t = e.innerHeight(), i = ["paddingTop", "paddingBottom"], s = 0, n = i.length; n > s; s++) {
            var o = parseInt(e.css(i[s]), 10);
            isNaN(o) && (o = 0),
            t -= o
        }
        return t
    }
    if (!e.fn.dotdotdot) {
        e.fn.dotdotdot = function(t) {
            if (0 == this.length)
                return e.fn.dotdotdot.debug('No element found for "' + this.selector + '".'),
                this;
            if (this.length > 1)
                return this.each(function() {
                    e(this).dotdotdot(t)
                });
            var n = this
              , r = n.contents();
            n.data("dotdotdot") && n.trigger("destroy.dot"),
            n.data("dotdotdot-style", n.attr("style") || ""),
            n.css("word-wrap", "break-word"),
            "nowrap" === n.css("white-space") && n.css("white-space", "normal"),
            n.bind_events = function() {
                return n.bind("update.dot", function(t, a) {
                    switch (n.removeClass("is-truncated"),
                    t.preventDefault(),
                    t.stopPropagation(),
                    typeof l.height) {
                    case "number":
                        l.maxHeight = l.height;
                        break;
                    case "function":
                        l.maxHeight = l.height.call(n[0]);
                        break;
                    default:
                        l.maxHeight = u(n)
                    }
                    l.maxHeight += l.tolerance,
                    void 0 !== a && (("string" == typeof a || "nodeType"in a && 1 === a.nodeType) && (a = e("<div />").append(a).contents()),
                    a instanceof e && (r = a)),
                    (m = n.wrapInner('<div class="dotdotdot" />').children()).contents().detach().end().append(r.clone(!0)).find("br").replaceWith("  <br />  ").end().css({
                        height: "auto",
                        width: "auto",
                        border: "none",
                        padding: 0,
                        margin: 0
                    });
                    var c = !1
                      , p = !1;
                    return d.afterElement && ((c = d.afterElement.clone(!0)).show(),
                    d.afterElement.detach()),
                    o(m, l) && (p = "children" == l.wrap ? i(m, l, c) : s(m, n, m, l, c)),
                    m.replaceWith(m.contents()),
                    m = null,
                    e.isFunction(l.callback) && l.callback.call(n[0], p, r),
                    d.isTruncated = p,
                    p
                }).bind("isTruncated.dot", function(e, t) {
                    return e.preventDefault(),
                    e.stopPropagation(),
                    "function" == typeof t && t.call(n[0], d.isTruncated),
                    d.isTruncated
                }).bind("originalContent.dot", function(e, t) {
                    return e.preventDefault(),
                    e.stopPropagation(),
                    "function" == typeof t && t.call(n[0], r),
                    r
                }).bind("destroy.dot", function(e) {
                    e.preventDefault(),
                    e.stopPropagation(),
                    n.unwatch().unbind_events().contents().detach().end().append(r).attr("style", n.data("dotdotdot-style") || "").removeClass("is-truncated").data("dotdotdot", !1)
                }),
                n
            }
            ,
            n.unbind_events = function() {
                return n.unbind(".dot"),
                n
            }
            ,
            n.watch = function() {
                if (n.unwatch(),
                "window" == l.watch) {
                    var t = e(window)
                      , i = t.width()
                      , s = t.height();
                    t.bind("resize.dot" + d.dotId, function() {
                        i == t.width() && s == t.height() && l.windowResizeFix || (i = t.width(),
                        s = t.height(),
                        p && clearInterval(p),
                        p = setTimeout(function() {
                            n.trigger("update.dot")
                        }, 100))
                    })
                } else
                    c = a(n),
                    p = setInterval(function() {
                        if (n.is(":visible")) {
                            var e = a(n);
                            c.width == e.width && c.height == e.height || (n.trigger("update.dot"),
                            c = e)
                        }
                    }, 500);
                return n
            }
            ,
            n.unwatch = function() {
                return e(window).unbind("resize.dot" + d.dotId),
                p && clearInterval(p),
                n
            }
            ;
            var l = e.extend(!0, {}, e.fn.dotdotdot.defaults, t)
              , d = {}
              , c = {}
              , p = null
              , m = null;
            return l.lastCharacter.remove instanceof Array || (l.lastCharacter.remove = e.fn.dotdotdot.defaultArrays.lastCharacter.remove),
            l.lastCharacter.noEllipsis instanceof Array || (l.lastCharacter.noEllipsis = e.fn.dotdotdot.defaultArrays.lastCharacter.noEllipsis),
            d.afterElement = f(l.after, n),
            d.isTruncated = !1,
            d.dotId = h++,
            n.data("dotdotdot", !0).bind_events().trigger("update.dot"),
            l.watch && n.watch(),
            n
        }
        ,
        e.fn.dotdotdot.defaults = {
            ellipsis: "... ",
            wrap: "word",
            fallbackToLetter: !0,
            lastCharacter: {},
            tolerance: 0,
            callback: null,
            after: null,
            height: null,
            watch: !1,
            windowResizeFix: !0
        },
        e.fn.dotdotdot.defaultArrays = {
            lastCharacter: {
                remove: [" ", "　", ",", ";", ".", "!", "?"],
                noEllipsis: []
            }
        },
        e.fn.dotdotdot.debug = function(e) {}
        ;
        var h = 1
          , m = e.fn.html;
        e.fn.html = function(i) {
            return i != t && !e.isFunction(i) && this.data("dotdotdot") ? this.trigger("update", [i]) : m.apply(this, arguments)
        }
        ;
        var g = e.fn.text;
        e.fn.text = function(i) {
            return i != t && !e.isFunction(i) && this.data("dotdotdot") ? (i = e("<div />").text(i).html(),
            this.trigger("update", [i])) : g.apply(this, arguments)
        }
    }
}(jQuery),
jQuery(document).ready(function(e) {
    e(".dot-ellipsis").each(function() {
        var t = e(this).hasClass("dot-resize-update")
          , i = e(this).hasClass("dot-timer-update")
          , s = 0
          , n = e(this).attr("class").split(/\s+/);
        e.each(n, function(e, t) {
            var i = t.match(/^dot-height-(\d+)$/);
            null !== i && (s = Number(i[1]))
        });
        var o = new Object;
        i && (o.watch = !0),
        t && (o.watch = "window"),
        s > 0 && (o.height = s),
        e(this).dotdotdot(o)
    })
}),
jQuery(window).on("load", function() {
    jQuery(".dot-ellipsis.dot-load-update").trigger("update.dot")
}),
function(e) {
    window.ShuffleCustom = e(window.jQuery, window.CustomModernizr)
}(function(e, t, i) {
    "use strict";
    function s(e, t, i) {
        for (var s = 0, n = e.length; s < n; s++)
            if (t.call(i, e[s], s, e) === {})
                return
    }
    function n(t, i, s) {
        return setTimeout(e.proxy(t, i), s)
    }
    function o(e) {
        return Math.max.apply(Math, e)
    }
    function r(e) {
        return Math.min.apply(Math, e)
    }
    function a(t) {
        return e.isNumeric(t) ? t : 0
    }
    function l(e) {
        var t, i, s = e.length;
        if (!s)
            return e;
        for (; --s; )
            t = e[i = Math.floor(Math.random() * (s + 1))],
            e[i] = e[s],
            e[s] = t;
        return e
    }
    if ("object" != typeof t)
        throw new Error("Shuffle.js requires Modernizr.\nhttp://vestride.github.io/Shuffle/#dependencies");
    var d = t.prefixed("transition")
      , c = t.prefixed("transitionDelay")
      , p = t.prefixed("transitionDuration")
      , f = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend"
    }[d]
      , u = t.prefixed("transform")
      , h = function(e) {
        return e ? e.replace(/([A-Z])/g, function(e, t) {
            return "-" + t.toLowerCase()
        }).replace(/^ms-/, "-ms-") : ""
    }(u)
      , m = t.csstransforms && t.csstransitions
      , g = t.csstransforms3d
      , v = function(e, t) {
        this.x = a(e),
        this.y = a(t)
    };
    v.equals = function(e, t) {
        return e.x === t.x && e.y === t.y
    }
    ;
    var w = 0
      , y = e(window)
      , b = 0
      , x = function(t, i, s) {
        i = i || {},
        e.extend(this, x.options, i, x.settings),
        this.$el = e(t),
        this.id = b++,
        this.element = t,
        this.only_sort = s,
        this.unique = "shuffle_" + w++,
        this._fire(x.EventType.LOADING),
        this._init(),
        n(function() {
            this.initialized = !0,
            this._fire(x.EventType.DONE)
        }, this, 16)
    };
    return x.EventType = {
        LOADING: "loading",
        DONE: "done",
        LAYOUT: "layout",
        REMOVED: "removed"
    },
    x.ClassName = {
        BASE: "shuffle",
        SHUFFLE_ITEM: "shuffle-item",
        FILTERED: "filtered",
        CONCEALED: "concealed"
    },
    x.options = {
        group: "all",
        speed: 250,
        easing: "ease-out",
        itemSelector: "",
        sizer: null,
        gutterWidth: 0,
        columnWidth: 0,
        delimeter: null,
        buffer: 0,
        initialSort: null,
        throttle: function(t, i, s) {
            var n, o, r, a = null, l = 0;
            s = s || {};
            var d = function() {
                l = !1 === s.leading ? 0 : e.now(),
                a = null,
                r = t.apply(n, o),
                n = o = null
            };
            return function() {
                var c = e.now();
                l || !1 !== s.leading || (l = c);
                var p = i - (c - l);
                return n = this,
                o = arguments,
                p <= 0 || p > i ? (clearTimeout(a),
                a = null,
                l = c,
                r = t.apply(n, o),
                n = o = null) : a || !1 === s.trailing || (a = setTimeout(d, p)),
                r
            }
        },
        throttleTime: 100,
        sequentialFadeDelay: 150,
        supported: m
    },
    x.settings = {
        useSizer: !1,
        itemCss: {
            position: "absolute",
            top: 0,
            left: 0,
            visibility: "visible"
        },
        revealAppendedDelay: 300,
        lastSort: {},
        lastFilter: "all",
        enabled: !0,
        destroyed: !1,
        initialized: !1,
        _animations: [],
        styleQueue: []
    },
    x.Point = v,
    x._getItemTransformString = function(e, t) {
        return g ? "translate3d(" + e.x + "px, " + e.y + "px, 0) scale3d(" + t + ", " + t + ", 1)" : "translate(" + e.x + "px, " + e.y + "px) scale(" + t + ")"
    }
    ,
    x._getNumberStyle = function(t, i) {
        return x._getFloat(e(t).css(i))
    }
    ,
    x._getInt = function(e) {
        return a(parseInt(e, 10))
    }
    ,
    x._getFloat = function(e) {
        return a(parseFloat(e))
    }
    ,
    x._getOuterWidth = function(t, i) {
        return e(t).outerWidth(!!i)
    }
    ,
    x._getOuterHeight = function(t, i) {
        return e(t).outerHeight(!!i)
    }
    ,
    x._skipTransition = function(e, t, i) {
        var s = e.style[p];
        e.style[p] = "0ms",
        t.call(i);
        e.offsetWidth;
        e.style[p] = s
    }
    ,
    x.prototype._init = function() {
        if (this.$items = this._getItems(),
        !this.only_sort) {
            this.sizer = this._getElementOption(this.sizer),
            this.sizer && (this.useSizer = !0),
            this.$el.addClass(x.ClassName.BASE),
            this.containerWidth = x._getOuterWidth(this.element),
            this._itemMargin = this._getGutterSize(this.containerWidth),
            this._initItems(),
            y.on("resize.shuffle." + this.unique, this._getResizeFunction());
            var e = this.$el.css(["position", "overflow"])
              , t = x._getOuterWidth(this.element);
            this._validateStyles(e),
            this._setColumns(t)
        }
        this.shuffle(this.group, this.initialSort),
        this.supported && n(function() {
            this.destroyed || (this._setTransitions(),
            this.element.style[d] = "height " + this.speed + "ms " + this.easing)
        }, this)
    }
    ,
    x.prototype._getResizeFunction = function() {
        var t = e.proxy(this._onResize, this);
        return this.throttle ? this.throttle(t, this.throttleTime) : t
    }
    ,
    x.prototype._getElementOption = function(e) {
        return "string" == typeof e ? this.$el.find(e)[0] || null : e && e.nodeType && 1 === e.nodeType ? e : e && e.jquery ? e[0] : null
    }
    ,
    x.prototype._validateStyles = function(e) {
        "static" === e.position && (this.element.style.position = "relative"),
        e.overflow
    }
    ,
    x.prototype._filter = function(e, t) {
        e = e || this.lastFilter,
        t = t || this.$items;
        var i = this._getFilteredSets(e, t);
        return this._toggleFilterClasses(i.filtered, i.concealed),
        this.lastFilter = e,
        "string" == typeof e && (this.group = e),
        i.filtered
    }
    ,
    x.prototype._getFilteredSets = function(t, i) {
        var n = e()
          , o = e();
        return "all" === t ? n = i : s(i, function(i) {
            var s = e(i);
            this._doesPassFilter(t, s) || s.is(".ff-ad") ? n = n.add(s) : o = o.add(s)
        }, this),
        {
            filtered: n,
            concealed: o
        }
    }
    ,
    x.prototype._doesPassFilter = function(t, i) {
        if (e.isFunction(t))
            return t.call(i[0], i, this);
        var s = i.data("groups")
          , n = this.delimeter && !e.isArray(s) ? s.split(this.delimeter) : s;
        return e.inArray(t, n) > -1
    }
    ,
    x.prototype._toggleFilterClasses = function(e, t) {
        e.removeClass(x.ClassName.CONCEALED).addClass(x.ClassName.FILTERED),
        t.removeClass(x.ClassName.FILTERED).addClass(x.ClassName.CONCEALED)
    }
    ,
    x.prototype._initItems = function(t, i, s) {
        var n, o, r, a, l, d, c, p, f, u, h = this, m = t || this.$items, g = this.columnWidth(this.containerWidth, this._itemMargin), w = this.streamOpts.layout, y = this.streamOpts.trueLayout;
        if ("carousel" === y) {
            this.$el.data("slick") && (l = this.$el.slick("slickCurrentSlide"),
            this.$el.slick("unslick").off("destroy").off("beforeChange"),
            this.$el.find(".ff-carousel-slide").each(function() {
                e(this).find(".ff-item").unwrap()
            }),
            s && this.$el.append(t),
            this.$items = this._getItems(),
            this.$el.data("slick", null));
            for (var b = 0; b < this.$items.length; b += this.streamOpts.itemsPerSlide)
                this.$items.slice(b, b + this.streamOpts.itemsPerSlide).wrapAll("<div class='ff-carousel-slide'></div>");
            this._itemMargin > 0 && (a = parseInt(this._itemMargin / 2),
            (c = document.getElementById("ff-carousel-css")) && c.parentNode.removeChild(c),
            this._addStyleSheet(".ff-stream-wrapper { padding: " + a + "px;} .ff-truelayout-carousel .ff-item {margin: " + a + "px}", "ff-carousel-css"))
        }
        this.itemCss.width = g,
        this.gridLayout = w,
        i && "carousel" !== y || (m.addClass([x.ClassName.SHUFFLE_ITEM, x.ClassName.FILTERED].join(" ")),
        m.css(this.itemCss).data("point", new v).data("scale", 1)),
        "grid" === w ? (n = this.streamOpts["g-ratio-h"] * g / this.streamOpts["g-ratio-w"],
        n = Math.floor(n),
        o = Math.floor(n * this._altEval(this.streamOpts["g-ratio-img"])),
        d = m.first(),
        r = d.find(".ff-item-meta").height(),
        (c = document.getElementById("ff-grid-css")) && c.parentNode.removeChild(c),
        this._addStyleSheet("#ff-stream-" + this.streamOpts.id + " .ff-item-cont { height: " + (n - 44) + "px; /*overflow:hidden*/} #ff-stream-" + this.streamOpts.id + " .ff-ad .ff-item-cont { height: " + n + "px; overflow:hidden} #ff-stream-" + this.streamOpts.id + " .ff-has-overlay .ff-item-cont { height: " + n + "px; /*overflow:hidden*/} #ff-stream-" + this.streamOpts.id + " .ff-item .ff-img-holder{height: " + o + "px}#ff-stream-" + this.streamOpts.id + " .ff-has-overlay .ff-img-holder{height: " + n + "px}", "ff-grid-css")) : this.streamOpts.isOverlay && (d = m.first(),
        r = d.find(".ff-item-meta").height()),
        m.each(function(t) {
            var s, a, l, d, c, p, f, u, m, v, y, b, x, k = e(this), T = k.data(), C = T.media && T.media.split(";"), S = k.find(".ff-img-holder img"), I = {}, $ = h.streamOpts.isOverlay && S.length;
            C ? (a = (s = {
                width: C[4] || C[0],
                height: C[5] || C[1]
            }).width && s.height ? h._calcImageProportion(g, s) : 0,
            S.css("minHeight", a)) : S.length && (C = S.data("size")) && (a = (s = {
                width: C.width,
                height: C.height
            }).width && s.height ? h._calcImageProportion(g, s) : 0,
            S.css("minHeight", a)),
            ("grid" === w || $) && (m = k.find($ ? ".ff-overlay-wrapper" : ".ff-item-cont"),
            f = k.find(".ff-content"),
            u = m.find("> h4"),
            v = m.children(),
            $ && (v = v.not(".ff-overlay")),
            "label1" === h.streamOpts["icon-style"] && k.is(".ff-meta-first") || (v = v.not(".ff-label-wrapper")),
            b = parseInt(v.first().css("marginTop")),
            x = parseInt(v.last().css("marginBottom")),
            p = .07 * g,
            y = (v.length - 1) * p + b + x,
            c = u.length ? u.height() : 0,
            (l = (n || a || S.height()) - ("ad" === k.data("type") ? 0 : (S.length && !$ ? o : 0) + c + r + 44) - y) < 21 && (l = l >= 20 ? 20 : c ? 0 : l < 0 ? 21 + l - p : l),
            I = {
                height: l
            },
            f.css(I),
            0 !== I.height && f.length || (d = n - (S.length && !$ ? o : 0) - r - 44 - y,
            I = {},
            (d = Math.floor(d)) <= 21 && (d >= 20 ? (u.addClass("ff-header-min"),
            d = 21) : (d = d < 0 ? 21 + d - p : d,
            I.textIndent = "-9999px")),
            I.height = d,
            d <= 0 && u.detach(),
            u.css(I)),
            i && k.find(".ff-content").dotdotdot({
                ellipsis: "...",
                after: ""
            }))
        }),
        "carousel" === y && (u = this.streamOpts["c-autoplay"] ? this.streamOpts["c-autoplay"].trim() : "",
        f = "yep" == this.streamOpts["c-arrows-always"] ? "ff-arrows-always" : "ff-arrows-hover",
        p = {
            infinite: !0,
            dots: !0,
            slidesToShow: 1,
            initialSlide: l || 0,
            prevArrow: '<span class="flaticon-chevron-left slick-prev"></span>',
            nextArrow: '<span class="flaticon-chevron-right slick-next"></span>'
        },
        "" != u && (p.autoplay = !0,
        p.autoplaySpeed = 1e3 * +u),
        h.$el.slick(p).addClass(f).on("destroy", function() {
            h.$el.trigger("slick-destroyed")
        }).on("beforeChange", function(e, t, i, s) {
            s > i && s === t.slideCount - 1 && h.$el.trigger("slick-last-slide", {
                slick: t
            })
        }).data("slick", h.$el.slick("getSlick")))
    }
    ,
    x.prototype._calcImageProportion = function(e, t) {
        var i = e / t.width;
        return Math.round(t.height * i)
    }
    ,
    x.prototype._addCSSRule = function(e, t, i) {
        if (e && e.cssRules) {
            for (var s = e.cssRules.length - 1, n = s; n > 0; n--) {
                var o = e.cssRules[n];
                o.selectorText === t && (i = o.style.cssText + i,
                e.deleteRule(n),
                s = n)
            }
            return e.insertRule ? e.insertRule(t + "{" + i + "}", s) : e.addRule(t, i, s),
            e.cssRules[s].cssText
        }
    }
    ,
    x.prototype._altEval = function(e) {
        return new Function("return " + e)()
    }
    ,
    x.prototype._addStyleSheet = function(e, t) {
        var i = document.createElement("style");
        return i.type = "text/css",
        t && (i.id = t),
        /WebKit|MSIE/i.test(navigator.userAgent) ? i.styleSheet ? i.styleSheet.cssText = e : i.innerText = e : i.innerHTML = e,
        document.getElementsByTagName("head")[0].appendChild(i),
        i
    }
    ,
    x.prototype._updateItemCount = function() {
        this.visibleItems = this._getFilteredItems().length
    }
    ,
    x.prototype._setTransition = function(e) {
        e.style[d] = h + " " + this.speed + "ms " + this.easing + ", opacity " + this.speed + "ms " + this.easing
    }
    ,
    x.prototype._setTransitions = function(e) {
        s(e = e || this.$items, function(e) {
            this._setTransition(e)
        }, this)
    }
    ,
    x.prototype._setSequentialDelay = function(e) {
        this.supported && s(e, function(e, t) {
            e.style[c] = "0ms," + (t + 1) * this.sequentialFadeDelay + "ms"
        }, this)
    }
    ,
    x.prototype._getItems = function() {
        return this.$el.find(this.itemSelector)
    }
    ,
    x.prototype._getFilteredItems = function() {
        return this.destroyed ? e() : this.$items.filter("." + x.ClassName.FILTERED)
    }
    ,
    x.prototype._getConcealedItems = function() {
        return this.$items.filter("." + x.ClassName.CONCEALED)
    }
    ,
    x.prototype._getColumnSize = function(t, i) {
        var s;
        return 0 === (s = e.isFunction(this.columnWidth) ? this.columnWidth(t, i) : this.useSizer ? x._getOuterWidth(this.sizer) : this.columnWidth ? this.columnWidth : this.$items.length > 0 ? x._getOuterWidth(this.$items[0], !0) : t) && (s = t),
        s + i
    }
    ,
    x.prototype._getGutterSize = function(t) {
        return e.isFunction(this.gutterWidth) ? this.gutterWidth(t) : this.useSizer ? x._getNumberStyle(this.sizer, "marginLeft") : this.gutterWidth
    }
    ,
    x.prototype._setColumns = function(e) {
        var t = e || x._getOuterWidth(this.element)
          , i = this._itemMargin = this._getGutterSize(t)
          , s = this._getColumnSize(t, i);
        this.containerWidth = t;
        var n = ((t -= 2 * i) + i) / s;
        this.cols = Math.max(Math.floor(n), 1),
        this.colWidth = s
    }
    ,
    x.prototype._setContainerSize = function() {
        this.$el.css("height", this._getContainerSize())
    }
    ,
    x.prototype._getContainerSize = function() {
        return o(this.positions)
    }
    ,
    x.prototype._fire = function(e, t) {
        this.$el.trigger(e + ".shuffle", t && t.length ? t : [this])
    }
    ,
    x.prototype._resetCols = function() {
        var e = this.cols;
        for (this.positions = []; e--; )
            this.positions.push(0)
    }
    ,
    x.prototype._layout = function(e, t) {
        var i = this;
        s(e, function(e) {
            i._layoutItem(e, !!t)
        }, i),
        i._processStyleQueue(),
        i._setContainerSize()
    }
    ,
    x.prototype._layoutItem = function(t, i) {
        var s = e(t)
          , n = s.data()
          , o = (n.point,
        n.scale,
        {
            width: x._getOuterWidth(t, !0),
            height: x._getOuterHeight(t, !0)
        })
          , r = this._getItemPosition(o);
        n.point = r,
        n.scale = 1,
        this.styleQueue.push({
            $item: s,
            point: r,
            scale: 1,
            width: this.itemCss.width,
            opacity: i ? 0 : 1,
            skipTransition: i,
            callfront: function() {
                i || s.css("visibility", "visible")
            },
            callback: function() {
                i && s.css("visibility", "hidden")
            }
        })
    }
    ,
    x.prototype._getItemPosition = function(e, t) {
        var i = this._getColumnSpan(e.width, this.colWidth, this.cols)
          , s = this._getColumnSet(i, this.cols)
          , n = this._getShortColumn(s, this.buffer)
          , o = Math.round((this.containerWidth - (e.width * this.cols + this._itemMargin * (this.cols - 1))) / 2)
          , r = new v(Math.round(this.colWidth * n + (o > 0 ? o : 0)),Math.round(s[n]));
        0 != r.y && (r.y = r.y + this._itemMargin);
        for (var a = s[n] + e.height + (0 != r.y ? this._itemMargin : 0), l = this.cols + 1 - s.length, d = 0; d < l; d++)
            this.positions[n + d] = a;
        return r
    }
    ,
    x.prototype._getColumnSpan = function(e, t, i) {
        var s = e / t;
        return Math.abs(Math.round(s) - s) < .3 && (s = Math.round(s)),
        Math.min(Math.ceil(s), i)
    }
    ,
    x.prototype._getColumnSet = function(e, t) {
        if (1 === e)
            return this.positions;
        for (var i = t + 1 - e, s = [], n = 0; n < i; n++)
            s[n] = o(this.positions.slice(n, n + e));
        return s
    }
    ,
    x.prototype._getShortColumn = function(e, t) {
        for (var i = r(e), s = 0, n = e.length; s < n; s++)
            if (e[s] >= i - t && e[s] <= i + t)
                return s;
        return 0
    }
    ,
    x.prototype._shrink = function(t) {
        s(t || this._getConcealedItems(), function(t) {
            var i = e(t)
              , s = i.data();
            .001 !== s.scale && (s.scale = .001,
            this.styleQueue.push({
                $item: i,
                point: s.point,
                scale: .001,
                opacity: 0,
                callback: function() {
                    i.css("visibility", "hidden")
                }
            }))
        }, this)
    }
    ,
    x.prototype._onResize = function() {
        if (this.enabled && !this.destroyed && !this.isTransitioning) {
            var e = x._getOuterWidth(this.element);
            if (e !== this.containerWidth) {
                if (this.containerWidth = e,
                this._itemMargin = this._getGutterSize(this.containerWidth),
                "grid" === this.gridLayout) {
                    var t = document.getElementById("ff-grid-css")
                      , i = document.getElementById("ff-carousel-css");
                    t.parentNode.removeChild(t),
                    i && i.parentNode.removeChild(i)
                }
                this._initItems(this.$items, !0),
                this.update()
            }
        }
    }
    ,
    x.prototype._getStylesForTransition = function(e, t) {
        var i = {
            opacity: e.opacity
        };
        return e.width && (i.width = e.width),
        this.supported ? i[u] = x._getItemTransformString(e.point, e.scale) : (i.left = e.point.x,
        i.top = e.point.y),
        i
    }
    ,
    x.prototype._transition = function(t) {
        var i = this._getStylesForTransition(t);
        t.$item.data("keep-pos") ? (t.$item.removeData("keep-pos"),
        n(function() {
            this._startItemAnimation(t.$item, i, t.callfront || e.noop, t.callback || e.noop)
        }, this, 1e3)) : this._startItemAnimation(t.$item, i, t.callfront || e.noop, t.callback || e.noop)
    }
    ,
    x.prototype._startItemAnimation = function(t, i, s, n) {
        function o(t) {
            t.target === t.currentTarget && (e(t.target).off(f, o),
            n())
        }
        if (s(),
        !this.initialized)
            return t.css(i),
            void n();
        if (this.supported)
            t.css(i),
            t.on(f, o);
        else {
            var r = t.stop(!0).animate(i, this.speed, "swing", n);
            this._animations.push(r.promise())
        }
    }
    ,
    x.prototype._processStyleQueue = function(t) {
        var i = e();
        s(this.styleQueue, function(e) {
            e.skipTransition ? this._styleImmediately(e) : (i = i.add(e.$item),
            this._transition(e))
        }, this),
        i.length > 0 && this.initialized ? (this.isTransitioning = !0,
        this.supported ? (this._whenCollectionDone(i, f, this._movementFinished),
        this.isTransitioning = !1) : (this._whenAnimationsDone(this._movementFinished),
        this.isTransitioning = !1)) : t || n(this._layoutEnd, this),
        this.styleQueue.length = 0
    }
    ,
    x.prototype._styleImmediately = function(e) {
        x._skipTransition(e.$item[0], function() {
            e.$item.css(this._getStylesForTransition(e))
        }, this)
    }
    ,
    x.prototype._movementFinished = function() {
        this._layoutEnd()
    }
    ,
    x.prototype._layoutEnd = function() {
        this.destroyed || this._fire(x.EventType.LAYOUT)
    }
    ,
    x.prototype._addItems = function(e, t, i) {
        this._initItems(e, !1, !0),
        this._setTransitions(e),
        this.$items = this._getItems(),
        this._shrink(e),
        s(this.styleQueue, function(e) {
            e.skipTransition = !0
        }),
        this._processStyleQueue(!0),
        t ? this._addItemsToEnd(e, i) : this.shuffle(this.lastFilter)
    }
    ,
    x.prototype._addItemsToEnd = function(e, t) {
        var i = this._filter(null, e).get();
        this._updateItemCount(),
        this._layout(i, !0),
        t && this.supported && this._setSequentialDelay(i),
        this._revealAppended(i)
    }
    ,
    x.prototype._revealAppended = function(t) {
        n(function() {
            s(t, function(t) {
                var i = e(t);
                this._transition({
                    $item: i,
                    opacity: 1,
                    point: i.data("point"),
                    scale: 1
                })
            }, this),
            this._whenCollectionDone(e(t), f, function() {
                e(t).css(c, "0ms"),
                this._movementFinished()
            })
        }, this, this.revealAppendedDelay)
    }
    ,
    x.prototype._whenCollectionDone = function(t, i, s) {
        function n(t) {
            t.target === t.currentTarget && (e(t.target).off(i, n),
            ++o === r && s.call(a))
        }
        var o = 0
          , r = t.length
          , a = this;
        t.on(i, n)
    }
    ,
    x.prototype._whenAnimationsDone = function(t) {
        e.when.apply(null, this._animations).always(e.proxy(function() {
            this._animations.length = 0,
            t.call(this)
        }, this))
    }
    ,
    x.prototype.shuffle = function(e, t) {
        this.enabled && !this.isTransitioning && (e || (e = "all"),
        this._filter(e),
        this._updateItemCount(),
        this._shrink(),
        this.sort(t))
    }
    ,
    x.prototype.sort = function(e) {
        if (this.enabled && !this.isTransitioning) {
            this._resetCols();
            var t = e || this.lastSort
              , i = this._getFilteredItems().sorted(t);
            this._layout(i),
            this.lastSort = t
        }
    }
    ,
    x.prototype.update = function(t) {
        var i = this;
        this.enabled && !this.isTransitioning && (t || (this._setColumns(),
        this.$items.css("width", this.colWidth - this._itemMargin),
        this.$items.each(function(t, s) {
            var n = e(this)
              , o = n.data()
              , r = o.media && o.media.split(";");
            if (r) {
                var a = {
                    width: r[4],
                    height: r[5]
                }
                  , l = i._calcImageProportion(i.colWidth - i._itemMargin, a);
                n.find(".ff-img-holder img").css("minHeight", l)
            }
        }),
        this.itemCss.width = this.colWidth - this._itemMargin),
        i.sort())
    }
    ,
    x.prototype.layout = function() {
        this.destroyed || this.update(!0)
    }
    ,
    x.prototype.appended = function(e, t, i) {
        this._addItems(e, !0, !0)
    }
    ,
    x.prototype.disable = function() {
        this.enabled = !1
    }
    ,
    x.prototype.enable = function(e) {
        this.enabled = !0,
        !1 !== e && this.update()
    }
    ,
    x.prototype.remove = function(t) {
        t.length && t.jquery && (this._toggleFilterClasses(e(), t),
        this._shrink(t),
        this.sort(),
        this.$el.one(x.EventType.LAYOUT + ".shuffle", e.proxy(function() {
            t.remove(),
            this.$items = this._getItems(),
            this._updateItemCount(),
            this._fire(x.EventType.REMOVED, [t, this]),
            t = null
        }, this)))
    }
    ,
    x.prototype.destroy = function() {
        y.off("." + this.unique),
        this.$el.removeClass("shuffle").removeAttr("style").removeData("shuffle"),
        this.$items.removeAttr("style").removeData("point").removeData("scale").removeClass([x.ClassName.CONCEALED, x.ClassName.FILTERED, x.ClassName.SHUFFLE_ITEM].join(" ")),
        this.$items = null,
        this.$el = null,
        this.sizer = null,
        this.element = null,
        this.destroyed = !0
    }
    ,
    e.fn.shuffleCustom = function(t) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var s = e(this)
              , n = s.data("shuffle");
            n ? "string" == typeof t && n[t] && n[t].apply(n, i) : (n = new x(this,t,"only_sort" === i[1]),
            s.data("shuffle", n))
        })
    }
    ,
    e.fn.sorted = function(t) {
        var s = e.extend({}, e.fn.sorted.defaults, t)
          , n = this.get()
          , o = !1;
        return n.length ? s.randomize ? l(n) : (e.isFunction(s.by) && n.sort(function(t, n) {
            if (o)
                return 0;
            var r = s.by(e(t))
              , a = s.by(e(n));
            return r === i && a === i ? (o = !0,
            0) : r < a || "sortFirst" === r || "sortLast" === a ? -1 : r > a || "sortLast" === r || "sortFirst" === a ? 1 : 0
        }),
        o ? this.get() : (s.reverse && n.reverse(),
        n)) : []
    }
    ,
    e.fn.sorted.defaults = {
        reverse: !1,
        by: null,
        randomize: !1
    },
    x
}),
function(e, t) {
    var i, s = e.jQuery || e.Cowboy || (e.Cowboy = {});
    s.throttle = i = function(e, i, n, o) {
        function r() {
            function s() {
                l = +new Date,
                n.apply(r, c)
            }
            var r = this
              , d = +new Date - l
              , c = arguments;
            o && !a && s(),
            a && clearTimeout(a),
            o === t && d > e ? s() : !0 !== i && (a = setTimeout(o ? function() {
                a = t
            }
            : s, o === t ? e - d : e))
        }
        var a, l = 0;
        return "boolean" != typeof i && (o = n,
        n = i,
        i = t),
        s.guid && (r.guid = n.guid = n.guid || s.guid++),
        r
    }
    ,
    s.debounce = function(e, s, n) {
        return n === t ? i(e, s, !1) : i(e, n, !1 !== s)
    }
}(this),
function(e) {
    "use strict";
    var t = null
      , i = e(window)
      , s = function(t) {
        var i = this;
        if (e.extend(i, s.options, t, s.settings),
        !e.isFunction(i.enter))
            throw new TypeError("Viewport.add :: No `enter` function provided in Viewport options.");
        "string" == typeof i.threshold && i.threshold.indexOf("%") > -1 ? (i.isThresholdPercentage = !0,
        i.threshold = parseFloat(i.threshold) / 100) : i.threshold < 1 && i.threshold > 0 && (i.isThresholdPercentage = !0),
        i.hasLeaveCallback = e.isFunction(i.leave),
        i.$element = e(i.element),
        i.update()
    };
    s.prototype.update = function() {
        var e = this;
        e.offset = e.$element.offset(),
        e.height = e.$element.height(),
        e.$element.data("height", e.height),
        e.width = e.$element.width(),
        e.$element.data("width", e.width)
    }
    ,
    s.options = {
        threshold: 200,
        delay: 0
    },
    s.settings = {
        triggered: !1,
        isThresholdPercentage: !1
    };
    var n = function(e) {
        this.init(e)
    };
    n.prototype = {
        init: function(e) {
            window.FF_DEBUG;
            var t = this;
            t.list = [],
            t.lastScrollY = 0,
            t.windowHeight = i.height(),
            t.windowWidth = i.width(),
            t.screenSize = {
                w: t.windowWidth,
                h: t.windowHeight
            },
            t.throttleTime = 100,
            t.onResize(),
            t.bindEvents(e.viewportin),
            t.willProcessNextFrame = !0,
            requestAnimationFrame(function() {
                t.setScrollTop(),
                t.process(),
                t.willProcessNextFrame = !1
            })
        },
        bindEvents: function(t) {
            var s = this;
            i.on("resize.viewport", e.proxy(s.onResize, s)),
            t && i.on("scroll.viewport", e.throttle(s.throttleTime, e.proxy(s.onScroll, s))),
            s.hasActiveHandlers = !0
        },
        unbindEvents: function() {
            i.off(".viewport"),
            this.hasActiveHandlers = !1
        },
        maybeUnbindEvents: function() {
            var e = this;
            e.list.length || e.unbindEvents()
        },
        add: function(e) {
            var t = this;
            t.list.push(e),
            t.hasActiveHandlers || t.bindEvents(),
            t.willProcessNextFrame || (t.willProcessNextFrame = !0,
            requestAnimationFrame(function() {
                t.willProcessNextFrame = !1,
                t.process()
            }))
        },
        saveDimensions: function() {
            var t = this;
            e.each(t.list, function(e, t) {
                t.update()
            }),
            t.windowHeight = i.height(),
            t.windowWidth = i.width(),
            t.screenSize = {
                w: t.windowWidth,
                h: t.windowHeight
            }
        },
        onScroll: function() {
            var e = this;
            e.list.length && (e.setScrollTop(),
            e.process())
        },
        onResize: function() {
            this.refresh()
        },
        refresh: function() {
            this.list.length && this.saveDimensions()
        },
        isInViewport: function(e) {
            var t, i = this, s = e.offset, n = e.threshold, o = n, r = i.lastScrollY;
            return e.isThresholdPercentage && (n = 0),
            (t = i.isTopInView(r, i.windowHeight, s.top, e.height, n)) && e.isThresholdPercentage && (t = i.isTopPastPercent(r, i.windowHeight, s.top, e.height, o)),
            t
        },
        isTopInView: function(e, t, i, s, n) {
            var o = e + t;
            return i + n >= e && i + n < o
        },
        isTopPastPercent: function(e, t, i, s, n) {
            return (e + t - i) / t >= n
        },
        isOutOfViewport: function(e, t) {
            var i, s = this, n = e.offset, o = s.lastScrollY;
            return "bottom" === t && (i = !s.isBottomInView(o, s.windowHeight, n.top, e.height)),
            i
        },
        isBottomInView: function(e, t, i, s) {
            var n = e + t
              , o = i + s;
            return o > e && o <= n
        },
        triggerEnter: function(t) {
            var i = this;
            setTimeout(function() {
                t.enter.call(t.element, t)
            }, t.delay),
            e.isFunction(t.leave) ? t.triggered = !0 : i.list.splice(e.inArray(t, i.list), 1),
            i.maybeUnbindEvents()
        },
        getScreenSize: function() {
            return this.screenSize
        },
        triggerLeave: function(e) {
            setTimeout(function() {
                e.leave.call(e.element, e)
            }, e.delay),
            e.triggered = !1
        },
        setScrollTop: function() {
            this.lastScrollY = i.scrollTop()
        },
        process: function() {
            var t = this
              , i = e.extend([], t.list);
            e.each(i, function(e, i) {
                var s = t.isInViewport(i)
                  , n = i.hasLeaveCallback && t.isOutOfViewport(i, "bottom");
                return !i.triggered && s ? t.triggerEnter(i) : !s && n && i.triggered ? t.triggerLeave(i) : void 0
            })
        }
    },
    n.add = function(e) {
        return n.getInstance(e).add(new s(e))
    }
    ,
    n.refresh = function() {
        n.getInstance().refresh()
    }
    ,
    n.getInstance = function(e) {
        return t || (t = new n(e)),
        t
    }
    ,
    window.FF_Viewport = n
}(jQuery),
function(e, t, i) {
    "use strict";
    function s(e, t) {
        e.style.WebkitTransform = t,
        e.style.msTransform = t,
        e.style.transform = t
    }
    function n() {
        var t = l.clientWidth
          , i = e.innerWidth;
        return t < i ? i : t
    }
    function o() {
        var t = l.clientHeight
          , i = e.innerHeight;
        return t < i ? i : t
    }
    function r(e, t) {
        for (var i in t)
            t.hasOwnProperty(i) && (e[i] = t[i]);
        return e
    }
    function a(e, t) {
        return this.el = e[0],
        this.$el = e,
        this.options = r({}, this.options),
        r(this.options, t),
        this._init()
    }
    var l = e.document.documentElement
      , d = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        msTransition: "MSTransitionEnd",
        transition: "transitionend"
    }[t.prefixed("transition")]
      , c = {
        transitions: t.csstransitions,
        support3d: t.csstransforms3d
    };
    a.prototype.options = {},
    a.prototype._init = function() {
        return this.$body = i("body"),
        this.grid = this.el.querySelector(".ff-stream-wrapper"),
        this.gridItems = [].slice.call(this.grid.querySelectorAll(".ff-item:not(.ff-ad)")),
        this.itemsCount = this.gridItems.length,
        this.$wrapper = this.$el.find(".ff-slideshow"),
        this.slideshow = this.el.querySelector(".ff-slideshow > ul"),
        this.$slideshow = i(this.slideshow),
        this.$slideshow.data("media", !1),
        this.$wrapper.addClass("ff-" + this.options.iconStyle + "-icon"),
        this._addSlideShowItems(this.gridItems),
        this.slideshowItems = [].slice.call(this.slideshow.children),
        this.current = -1,
        this.ctrlPrev = this.el.querySelector(".ff-nav-prev"),
        this.ctrlNext = this.el.querySelector(".ff-nav-next"),
        this.ctrlClose = this.el.querySelector(".ff-nav-close"),
        this.plugin = this.$el.data("plugin"),
        this._initEvents(),
        this
    }
    ,
    a.prototype._addSlideShowItems = function(e, t) {
        var s = this
          , n = i();
        e.forEach(function(e, t) {
            var o, r, a, l, d, c, p, f, u = i(e), h = i('<li><div class="ff-slide-wrapper"></div></li>'), m = h.find(".ff-slide-wrapper"), g = u.find(".picture-item__inner").children().clone(), v = u.attr("data-type"), w = "", y = !1, b = FlowFlowOpts.view_on + " " + v, x = u.attr("data-media");
            if ("rss" != v && "posts" != v || (b = FlowFlowOpts.view_on_site),
            x ? (s.$slideshow.data("media", !0),
            a = x.split(";"),
            c = parseInt(a[0]),
            l = parseInt(a[1]),
            p = a[2],
            d = a[3],
            m.data("media", x),
            o = i('<div class="ff-media-wrapper' + ("image" == d ? "" : " ff-video") + '" style="max-height: ' + l + 'px;"></div>'),
            m.prepend(o),
            "image" == d ? (f = l / c,
            l > 1e3 && (c *= 1e3 / l,
            l = 1e3),
            c > 800 && (l *= 800 / c,
            c = 800),
            w = '<span class="ff-img-holder ' + (f ? " ff-img-landscape" : "") + '" style="width: ' + c + "px; max-height: " + l + "px; height: " + l + "px; background-image: url(" + p + ");" + (f ? "padding-bottom:" + 100 * f + "%" : "") + '"></span>',
            o.addClass("ff-slide-img-loading").data("media-image", a[2])) : "video/mp4" == d ? w = '<video controls width="' + c + '" height="' + l + '"><source src="' + a[2] + '" type="video/mp4">Your browser does not support the video tag.</video>' : (p = p.replace("http:", "").replace("https:", "").replace("/v/", "/embed/").replace("autoplay=1", "autoplay=0&fs=1"),
            w = '<iframe width="' + c + '" height="' + l + '" src="' + p + '" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen autoplay="1" wmode="opaque"></iframe>',
            p.indexOf("facebook.com/video/embed") + 1 && o.after('<span class="ff-cta">(Click image to play video)</span>')),
            o.data("media", w),
            g.find(".ff-img-holder").remove()) : g.find(".ff-img-holder").length ? g.find(".ff-img-holder").each(function(e, t) {
                var s = i(this)
                  , n = i(this).find("img")
                  , o = n.get(0);
                y ? s.remove() : (s.removeClass("ff-img-loading").addClass("ff-img-loaded").css({
                    "background-image": 'url("' + o.src + '")',
                    width: parseInt(o.style.width),
                    height: parseInt(o.style.height)
                }),
                n.remove(),
                y = !0,
                l = parseInt(o.style.height))
            }) : (o = i('<div class="ff-media-wrapper"></div>'),
            m.prepend(o),
            l = "initial"),
            m.append(g.not(".ff-img-holder")),
            (r = m.find(".ff-item-cont")).append(h.find("h4")),
            r.append(h.find(".ff-article")),
            r.append(h.find(".ff-item-meta")),
            r.find(".ff-userpic").append(h.find(".ff-icon")),
            r.find(".ff-item-meta").prepend(r.find(".ff-userpic")).append(m.find(".ff-item-bar")).append(m.find(".ff-name")),
            r.find(".ff-name").removeClass("ff-name").addClass("ff-external-link").html(b).attr("href", r.find(".ff-timestamp").attr("href")),
            r.find(".ff-item-meta").append('<div class="ff-dropdown"></div>'),
            r.find(".ff-dropdown").append(r.find(".ff-external-link")).append(r.find(".ff-share-wrapper")).append('<span class="flaticon-share2"></span>'),
            r.find(".ff-item-bar").append(r.find(".ff-timestamp")).append(r.find(".ff-location")),
            r.find(".ff-item-bar").before(r.find(".ff-content")),
            r.find(".ff-content").prepend(r.find("h4")),
            "" != r.find(".ff-content").html() && r.find(".ff-content").addClass("not-empty"),
            l = "initial" == l ? l : l < 420 ? "420px" : l > 1e3 ? "1000px" : l + "px",
            r.closest(".ff-slide-wrapper").css("max-height", l),
            r.css("height", l),
            "twitter" == v && r.find(".ff-comments").remove(),
            r.append('<div class="ff-comments-list"><div class="ff-comments-list-inner"><div class="ff-slide-loader"><span>Loading...</span></div></div></div>'),
            h.attr("data-type", u.attr("data-type")).attr("post-id", u.attr("post-id")).attr("data-feed", u.attr("data-feed")),
            u.hasClass("ff-supports-comments")) {
                h.addClass("ff-supports-comments ff-slide-" + v + (x ? " ff-slide-media" : ""));
                var k = r.find(".ff-item-meta").outerHeight()
                  , T = l - k;
                r.find(".ff-comments-list").css("min-height", T + "px")
            } else
                h.addClass("ff-no-comments ff-slide-" + v + (x ? " ff-slide-media" : ""));
            n = n.add(h)
        }),
        s.$slideshow.append(n),
        t && (s.gridItems = s.gridItems.concat(e)),
        s.$slideshow.data("media") && s.$slideshow.addClass("ff-slideshow-media")
    }
    ,
    a.prototype._initEvents = function(t) {
        var s = this;
        this.initItemsEvents(this.gridItems),
        i(this.ctrlPrev).on("click", function() {
            s._navigate("prev")
        }),
        i(this.ctrlNext).on("click", function() {
            s._navigate("next")
        }),
        i(this.ctrlClose).on("click", function() {
            s._closeSlideshow()
        }),
        this.$wrapper.on("click", function(e) {
            i(e.target).closest("li, nav").length || s._closeSlideshow()
        }),
        i(e).on("resize", function() {
            s._resizeHandler()
        }),
        i(document).on("keydown", function(e) {
            if (s.isSlideshowVisible)
                switch (e.keyCode || e.which) {
                case 37:
                    s._navigate("prev");
                    break;
                case 39:
                    s._navigate("next");
                    break;
                case 27:
                    s._closeSlideshow()
                }
        }),
        this.$wrapper.on("touchmove", function(e) {
            e.stopPropagation()
        })
    }
    ,
    a.prototype.initItemsEvents = function(e, t) {
        var s = this
          , n = i(this.grid).data("opts") && i(this.grid).data("opts").titles;
        t = t || 0,
        e.forEach(function(e, o) {
            i(e).find(".picture-item__inner").on("click", function(e) {
                var r = i(this).closest(".ff-stream").data("plugin")
                  , a = i(e.target)
                  , l = a.closest("a")
                  , d = a.closest("h4").length
                  , c = a.closest(".ff-icon-share").length;
                if (l.length && !a.is("img") || c) {
                    if ("yep" === n && d)
                        return;
                    if (!d)
                        return
                }
                e.preventDefault(),
                s._openSlideshow(r, o + t)
            })
        })
    }
    ,
    a.prototype._freezeScroll = function(e) {
        i(".ff-item-cont:hover").length > 0 || e.preventDefault()
    }
    ,
    a.prototype.checkScrollbar = function() {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight,
        this.scrollbarWidth = this.measureScrollbar(),
        this.scrollbarWidth > 0 && (this.scrollbarVisible = !0)
    }
    ,
    a.prototype.setScrollbar = function() {
        var e = parseInt(this.$body.css("padding-right") || 0, 10);
        this.bodyIsOverflowing && this.$body.css("padding-right", e + this.scrollbarWidth)
    }
    ,
    a.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", "")
    }
    ,
    a.prototype.measureScrollbar = function() {
        var e = document.createElement("div");
        e.className = "ff-modal-scrollbar-measure",
        this.$body.append(e);
        var t = e.offsetWidth - e.clientWidth;
        return this.$body[0].removeChild(e),
        t
    }
    ,
    a.prototype.loadCommentsAndCarousel = function(e, t, s) {
        var n, o = this.$slideshow.find('[post-id="' + s + '"]'), r = o.find(".ff-comments-list-inner"), a = this.$el.find('[post-id="' + s + '"]');
        if ("added" !== r.data("comments") && "added" !== o.data("carousel")) {
            var l = i.post(FlowFlowOpts.ajaxurl, {
                action: e + "_load_comments_and_carousel",
                feed_id4post: t,
                post_id: s
            });
            r.find(".ff-slide-loader").show(),
            i.when(l).then(function(e) {
                var t = ""
                  , i = e.comments;
                i && 0 !== i.length ? i.forEach(function(e, i, s) {
                    var n, r, a = "string" == typeof e.from && e.from && "Facebook user" !== e.from ? JSON.parse(e.from) : e.from, l = e.text;
                    "instagram" == o.data("type") && (r = "https://www.instagram.com/" + (n = a.username)),
                    "facebook" == o.data("type") && (n = a && a.name ? a.name : a || "",
                    r = "https://www.facebook.com/" + (a ? a.id : "")),
                    "youtube" == o.data("type") && (n = a.full_name,
                    r = "https://www.youtube.com/channel/" + a.id),
                    "google" == o.data("type") && (n = a.full_name,
                    r = "https://plus.google.com/" + a.id),
                    "posts" == o.data("type") && (r = "/author/" + (n = a.name)),
                    t += '<div class="ff-slide-comment">',
                    n ? (t += '<a href="' + r + '" target="_blank" title="' + n + '">',
                    t += "<b>" + n + "</b>",
                    t += "</a>",
                    t += "<span>" + l + "</span>") : t += '<span>"' + l + '"</span>',
                    t += "</div>"
                }) : t += "<div>" + (FlowFlowOpts && FlowFlowOpts.no_comments ? FlowFlowOpts.no_comments : "No comments yet.") + ' <a href="' + o.find(".ff-comments").attr("href") + '" target="_blank">' + (FlowFlowOpts && FlowFlowOpts.be_first ? FlowFlowOpts.be_first : "Be the first!") + "</a></div>",
                r.html(t).data("comments", "added"),
                setTimeout(function() {
                    r.addClass("ff-comments-ready")
                }, 0),
                n = o.find(".ff-img-holder").height();
                var s = e.carousel;
                if (!(s.length < 2 || a.hasClass("ff-video-preview"))) {
                    var l = o.find(".ff-img-holder").outerWidth()
                      , d = o.find(".ff-img-holder").outerHeight();
                    o.find(".ff-media-wrapper").css("width", l + "px").css("height", d + "px"),
                    o.find(".ff-media-wrapper").find(".ff-slideshow-carousel").remove(),
                    o.find(".ff-media-wrapper").append('<div class="ff-slideshow-carousel" style="height:' + d + 'px"></div>'),
                    s.forEach(function(e, t) {
                        if ("image" == e.media_type || "photo" == e.media_type)
                            var i = '<span class="ff-img-holder" style="background-image: url(' + e.media_url + ')">';
                        o.find(".ff-slideshow-carousel").append(i)
                    });
                    var c = {
                        adaptiveHeight: !0,
                        infinite: !0,
                        arrows: !0,
                        dots: !0,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        prevArrow: '<span class="ff-arrow-left slick-prev"></span>',
                        nextArrow: '<span class="ff-arrow-right slick-next"></span>'
                    };
                    o.find(".ff-media-wrapper > .ff-img-holder").hide(),
                    o.find(".ff-slideshow-carousel").slick(c),
                    o.data("carousel", "added")
                }
            }, function(e) {
                r.html("Sorry, something went wrong during loading comments for this post. Try to re-open lightbox.")
            })
        }
    }
    ,
    a.prototype._openSlideshow = function(e, t) {
        this.isSlideshowVisible = !0,
        this.current = t,
        this.checkScrollbar(),
        this.setScrollbar(),
        this.$body.addClass("ff-modal-open" + (this.scrollbarVisible ? " ff-modal-scrollbar" : ""));
        var r = this;
        r._setViewportItems();
        var a = i(r.currentItem)
          , l = i(r.nextItem)
          , d = i(r.prevItem)
          , p = n()
          , f = o();
        r.$curr = a,
        this.loadCommentsAndCarousel(e, a.attr("data-feed"), a.attr("post-id")),
        a.find(".ff-media-wrapper").each(function(e, t) {
            var s = i(this)
              , n = s.parent().parent().data("type");
            if (s.data("media") && "inserted" !== s.data("media")) {
                if (s.data("media-image")) {
                    var o = new Image;
                    o.src = s.data("media-image"),
                    o.onload = function() {
                        s.removeClass("ff-slide-img-loading")
                    }
                }
                "soundcloud" == n ? s.parent().parent().find(".ff-item-meta").after(s.data("media")) : s.append(s.data("media")),
                s.data("media", "inserted")
            }
        }),
        l.add(d).find(".ff-media-wrapper").each(function(e, t) {
            var s = i(this)
              , n = s.data("media")
              , o = s.parent().parent().data("type");
            if (n && "inserted" !== n && !/iframe|video/.test(n)) {
                if (s.data("media-image")) {
                    var r = new Image;
                    r.src = s.data("media-image"),
                    r.onload = function() {
                        s.removeClass("ff-slide-img-loading")
                    }
                }
                "soundcloud" == o ? s.parent().parent().find(".ff-item-meta").after(s.data("media")) : s.append(s.data("media")),
                s.data("media", "inserted")
            }
        }),
        a.addClass("ff-current ff-show");
        var u = parseInt(Number(r.currentItem.offsetHeight / 2 * 1));
        if (2 * u > f ? u = parseInt(f / 2) - 25 : u -= 25,
        s(r.currentItem, c.support3d ? "translate3d(" + parseInt(Number(r.currentItem.offsetWidth / 2 * -1)) + "px, -" + u + "px, 0px)" : "translate(-50%, -50%)"),
        r.prevItem) {
            d.addClass("ff-show");
            h = Number(-1 * (p / 2 + r.prevItem.offsetWidth / 2));
            s(r.prevItem, c.support3d ? "translate3d(" + (h + 100) + "px, -50%, 0px)" : "translate(" + h + "px, -50%)")
        }
        if (r.nextItem) {
            l.addClass("ff-show");
            var h = Number(p / 2 + r.nextItem.offsetWidth / 2);
            s(r.nextItem, c.support3d ? "translate3d(" + (h - 100) + "px,-50%, 0px)" : "translate(" + h + "px, -50%)")
        }
        setTimeout(function() {
            r.$wrapper.addClass("ff-slideshow-open").scrollTop(0)
        }, 200)
    }
    ,
    a.prototype._navigate = function(e) {
        if (!this.isAnimating)
            if ("next" === e && this.current === this.itemsCount - 1 || "prev" === e && 0 === this.current)
                this._closeSlideshow();
            else {
                if ("next" === e && this.current < this.itemsCount)
                    t = this.current + 1;
                if ("prev" === e && this.current > 0)
                    var t = this.current - 1;
                this.loadCommentsAndCarousel(this.plugin, this.gridItems[t].attributes["data-feed"].value, this.gridItems[t].attributes["post-id"].value),
                this.isAnimating = !0,
                this._setViewportItems();
                var r, a, l, p = this, f = n(), u = o(), h = this.currentItem.offsetWidth, m = c.support3d ? "translate3d(-" + Number(f / 2 + h / 2) + "px, -50%, -150px)" : "translate(-" + Number(f / 2 + h / 2) + "px, -50%)", g = c.support3d ? "translate3d(" + Number(f / 2 + h / 2) + "px, -50%, -150px)" : "translate(" + Number(f / 2 + h / 2) + "px, -50%)";
                "next" === e ? (r = c.support3d ? "translate3d( -" + Number(2 * f / 2 + h / 2) + "px, -50%, -150px )" : "translate(-" + Number(2 * f / 2 + h / 2) + "px, -50%)",
                a = c.support3d ? "translate3d( " + Number(2 * f / 2 + h / 2) + "px, -50%, -150px )" : "translate(" + Number(2 * f / 2 + h / 2) + "px, -50%)") : (r = c.support3d ? "translate3d( " + Number(2 * f / 2 + h / 2) + "px, -50%, -150px )" : "translate(" + Number(2 * f / 2 + h / 2) + "px)",
                a = c.support3d ? "translate3d( -" + Number(2 * f / 2 + h / 2) + "px, -50%, -150px )" : "translate(-" + Number(2 * f / 2 + h / 2) + "px, -50%)"),
                p.$slideshow.removeClass("ff-animatable"),
                ("next" === e && this.current < this.itemsCount - 2 || "prev" === e && this.current > 1) && (s(l = this.slideshowItems["next" === e ? this.current + 2 : this.current - 2], a),
                i(l).addClass("ff-show").find(".ff-media-wrapper").each(function(e, t) {
                    var s = i(this)
                      , n = s.data("media")
                      , o = s.parent().parent().data("type");
                    if (n && "inserted" !== n && !/iframe|video/.test(n)) {
                        if (s.data("media-image")) {
                            var r = new Image;
                            r.src = s.data("media-image"),
                            r.onload = function() {
                                s.removeClass("ff-slide-img-loading")
                            }
                        }
                        "soundcloud" == o ? s.parent().parent().find(".ff-item-meta").after(s.data("media")) : s.prepend(s.data("media")),
                        s.data("media", "inserted")
                    }
                }));
                setTimeout(function() {
                    var t;
                    p.$slideshow.addClass("ff-animatable"),
                    p.$curr.removeClass("ff-current");
                    var n = "next" === e ? p.nextItem : p.prevItem;
                    i(n).addClass("ff-current").find(".ff-media-wrapper").each(function(e, t) {
                        var s = i(this)
                          , n = s.data("media")
                          , o = s.parent().parent().data("type");
                        if (n && "inserted" !== n) {
                            if (s.data("media-image")) {
                                var r = new Image;
                                r.src = s.data("media-image"),
                                r.onload = function() {
                                    s.removeClass("ff-slide-img-loading")
                                }
                            }
                            "soundcloud" == o ? s.parent().parent().find(".ff-item-meta").after(s.data("media")) : s.prepend(s.data("media")),
                            s.data("media", "inserted")
                        }
                    }),
                    s(p.currentItem, "next" === e ? m : g),
                    p.nextItem && (2 * (t = parseInt(Number(p.nextItem.offsetHeight / 2 * 1))) > u ? t = parseInt(u / 2) - 25 : "next" === e && p.$wrapper.scrollTop(0),
                    s(p.nextItem, "next" === e ? c.support3d ? "translate3d(" + parseInt(Number(p.nextItem.offsetWidth / 2 * -1)) + "px, -" + t + "px, 0px)" : "translate(-50%, -50%)" : r)),
                    p.prevItem && (2 * (t = parseInt(Number(p.prevItem.offsetHeight / 2 * 1))) > u ? (t = parseInt(u / 2) - 25,
                    "prev" === e && p.$slideshow.scrollTop(0)) : "prev" === e && p.$wrapper.scrollTop(0),
                    s(p.prevItem, "next" === e ? r : c.support3d ? "translate3d(" + parseInt(Number(p.prevItem.offsetWidth / 2 * -1)) + "px, -" + t + "px, 0px)" : "translate(-50%, -50%)")),
                    l && s(l, "next" === e ? g : m);
                    var o = function(t) {
                        if (c.transitions && f >= 800) {
                            if (-1 === t.originalEvent.propertyName.indexOf("transform"))
                                return !1;
                            i(this).off(d, o)
                        }
                        p.prevItem && "next" === e ? i(p.prevItem).removeClass("ff-show") : p.nextItem && "prev" === e && i(p.nextItem).removeClass("ff-show"),
                        p._resetMedia(i(p.currentItem)),
                        "next" === e ? (p.prevItem = p.currentItem,
                        p.currentItem = p.nextItem,
                        l && (p.nextItem = l)) : (p.nextItem = p.currentItem,
                        p.currentItem = p.prevItem,
                        l && (p.prevItem = l)),
                        p.$curr = i(p.currentItem),
                        p.current = "next" === e ? p.current + 1 : p.current - 1,
                        p.isAnimating = !1
                    };
                    c.transitions && f >= 800 ? p.$curr.on(d, o) : o()
                }, 25)
            }
    }
    ,
    a.prototype._closeSlideshow = function(e) {
        this.$wrapper.removeClass("ff-slideshow-open"),
        this.$slideshow.removeClass("ff-animatable"),
        this.resetScrollbar(),
        this.$body.removeClass("ff-modal-open ff-modal-scrollbar");
        var t = this
          , n = function(e) {
            if (c.transitions && e) {
                if ("section" !== e.target.tagName.toLowerCase())
                    return;
                i(this).off(d, n)
            }
            var o = i(t.currentItem);
            t.$curr = o,
            o.removeClass("ff-current"),
            o.removeClass("ff-show"),
            t._resetMedia(o),
            t.prevItem && i(t.prevItem).removeClass("ff-show"),
            t.nextItem && i(t.nextItem).removeClass("ff-show"),
            t.slideshowItems.forEach(function(e) {
                s(e, "")
            }),
            t.isSlideshowVisible = !1
        };
        c.transitions ? this.$wrapper.on(d, n) : n()
    }
    ,
    a.prototype._resetMedia = function(e) {
        var t = e.attr("data-type");
        if ("vine" !== t && "soundcloud" !== t) {
            var i = e.find(".ff-video")
              , s = i.find("iframe, video");
            i.prepend(s)
        }
    }
    ,
    a.prototype._setViewportItems = function() {
        this.currentItem = null,
        this.prevItem = null,
        this.nextItem = null,
        this.$curr = null,
        this.current > 0 && (this.prevItem = this.slideshowItems[this.current - 1]),
        this.current < this.itemsCount - 1 && (this.nextItem = this.slideshowItems[this.current + 1]),
        this.currentItem = this.slideshowItems[this.current],
        this.$curr = i(this.currentItem)
    }
    ,
    a.prototype._resizeHandler = function() {
        var e = this;
        this._resizeTimeout && clearTimeout(this._resizeTimeout),
        this._resizeTimeout = setTimeout(function() {
            e._resize(),
            e._resizeTimeout = null
        }, 50)
    }
    ,
    a.prototype._resize = function() {
        if (this.isSlideshowVisible) {
            if (this.prevItem) {
                e = Number(-1 * (n() / 2 + this.prevItem.offsetWidth / 2));
                s(this.prevItem, c.support3d ? "translate3d(" + e + "px, -50%, -150px)" : "translate(" + e + "px, -50%)")
            }
            if (this.nextItem) {
                var e = Number(n() / 2 + this.nextItem.offsetWidth / 2);
                s(this.nextItem, c.support3d ? "translate3d(" + e + "px, -50%, -150px)" : "translate(" + e + "px, -50%)")
            }
            var t = o()
              , i = parseInt(Number(this.currentItem.offsetHeight / 2 * 1));
            2 * i > t && (i = parseInt(t / 2) - 25),
            s(this.currentItem, c.support3d ? "translate3d(" + parseInt(Number(this.currentItem.offsetWidth / 2 * -1)) + "px, -" + i + "px, 0px)" : "translate(-50%, -50%)")
        }
    }
    ,
    e.CBPGridGallery = a
}(window, window.CustomModernizr, window.jQuery),
function(e) {
    function t(e, t, i, s) {
        var n = i / t;
        return Math.round(e * n)
    }
    function i(t, i, s, o) {
        var r = n(s, i);
        return r.filtered.each(function() {
            var t = e(this);
            t.add(t.find(".ff-img-holder, .picture-item__inner")).removeAttr("style")
        }),
        r.concealed.hide(),
        e(t).data("group", r.filtered),
        r.filtered
    }
    function s(e, t, i) {
        for (var s = 0, n = e.length; s < n; s++)
            if (t.call(i, e[s], s, e) === {})
                return
    }
    function n(t, i) {
        var n = e()
          , r = e();
        return s(i, function(i) {
            var s = e(i);
            o(t, s) || s.is(".ff-ad") ? n = n.add(s) : r = r.add(s)
        }, this),
        {
            filtered: n,
            concealed: r
        }
    }
    function o(e, t) {
        return e.call(t[0], t)
    }
    function r(i, s, n) {
        function o(e, t) {
            var i, s, n;
            for (i = t.length; i--; )
                if (n = t[i].size,
                e < n) {
                    s = parseInt(t[i].val);
                    break
                }
            return s
        }
        var r, a, l, d, c = 0, p = [], f = (n = jQuery.makeArray(n || i.querySelectorAll(s.itemSelector))).length, u = e(i), h = e(n), m = i.getBoundingClientRect(), g = s.sizes.spacing;
        for (S = g.length; S--; )
            if (d = g[S].size,
            m.width < d) {
                l = parseInt(g[S].val);
                break
            }
        for (var v, w, y, b, x = Math.floor(m.right - m.left) - 2 * l, k = [], T = o(x, s.sizes.row), C = o(x, s.sizes.spacing), S = 0; S < f; ++S)
            !(v = n[S].getElementsByTagName("img")[0]) || n[S].className.indexOf("ff-ad") + 1 ? (w = 300,
            y = T) : ((b = v.getAttribute("data-size")) && (b = b.split(";"),
            w = parseInt(b[0]),
            y = parseInt(b[1])),
            w && y || ((w = parseInt(v.getAttribute("width"))) || v.setAttribute("width", w = v.offsetWidth),
            (y = parseInt(v.getAttribute("height"))) || v.setAttribute("height", y = v.offsetHeight))),
            k[S] = {
                width: t(w, y, T, C),
                height: T
            };
        u.css("padding", "0 " + l + "px"),
        f = n.length;
        for (var I = 0; I < f; ++I) {
            if (n[I].classList ? (n[I].classList.remove(s.firstItemClass),
            n[I].classList.remove(s.lastRowClass)) : n[I].className = n[I].className.replace(new RegExp("(^|\\b)" + s.firstItemClass + "|" + s.lastRowClass + "(\\b|$)","gi"), " "),
            c += k[I].width,
            p.push(n[I]),
            I === f - 1)
                for (E = 0; E < p.length; E++)
                    0 === E && (p[E].className += " " + s.lastRowClass),
                    p[E].style.cssText = "width: " + k[I + parseInt(E) - p.length + 1].width + "px;height: " + k[I + parseInt(E) - p.length + 1].height + "px;margin-right:" + (E < p.length - 1 ? C + "px" : 0);
            if (c + C * (p.length - 1) > x) {
                for (var $, _ = c + C * (p.length - 1) - x, O = (p.length,
                0), E = 0; E < p.length; E++) {
                    $ = p[E];
                    var A = k[I + parseInt(E) - p.length + 1].width
                      , M = A - A / c * _
                      , z = Math.round(k[I + parseInt(E) - p.length + 1].height * (M / A));
                    O + 1 - M % 1 >= .5 ? (O -= M % 1,
                    M = Math.floor(M)) : (O += 1 - M % 1,
                    M = Math.ceil(M)),
                    $.style.cssText = "width: " + M + "px;height: " + z + "px;margin-right: " + (E < p.length - 1 ? C : 0) + "px;margin-bottom: " + C + "px",
                    $.querySelectorAll(".ff-img-holder").length ? $.querySelectorAll(".ff-img-holder")[0].style.cssText = "width: " + M + "px;height: " + z + "px;" : $.querySelectorAll(".picture-item__inner")[0].style.cssText = "width: " + M + "px;height: " + z + "px;",
                    e($).data("newHeight", z),
                    e($).data("newWidth", M),
                    0 === E && ($.className += " " + s.firstItemClass)
                }
                p = [],
                c = 0
            }
        }
        a = h.not(".ff-ad").first(),
        r = a.find(".ff-item-meta").height(),
        h.each(function(t) {
            var i, n, o, a, l, d, c, p, f, u, h, m = e(this), g = m.data(), v = (g.media && g.media.split(";"),
            {}), w = !!m.find(".ff-img-holder img").length;
            c = m.find(w ? ".ff-overlay-wrapper" : ".ff-item-cont"),
            l = m.find(".ff-content"),
            d = m.find(".ff-overlay-wrapper > h4"),
            p = (p = c.children()).not(".ff-overlay"),
            "label1" === s.streamOpts["icon-style"] && m.is(".ff-meta-first") || (p = p.not(".ff-label-wrapper")),
            u = parseInt(p.first().css("marginTop")),
            h = parseInt(p.last().css("marginBottom")),
            a = .07 * m.data("newWidth"),
            f = (p.length - 1) * a + u + h,
            o = d.length ? d.height() : 0,
            (i = m.data("newHeight") - o - r - 44 - f) < 21 && (i = i >= 20 ? 20 : o ? 0 : i < 0 ? 21 + i - a : i),
            v = {
                height: i
            },
            l.css(v),
            0 !== v.height && l.length || (n = m.data("newHeight") - r - 44 - f,
            v = {},
            (n = Math.floor(n)) <= 21 && (n + a >= 20 ? (d.addClass("ff-header-min"),
            n = 21) : (n = n < 0 ? 21 + n - a : n,
            v.textIndent = "-9999px")),
            v.height = n,
            n <= 0 && d.detach(),
            d.css(v))
        })
    }
    e.fn.rowGrid = function(t, s) {
        return this.each(function() {
            var n, o, a = e(this);
            "appended" === t ? (t = a.data("grid-options"),
            n = (o = a.children("." + t.lastRowClass)).nextAll(t.itemSelector).add(o),
            r(this, t, n)) : "shuffle" === t ? (t = a.data("grid-options"),
            n = i(this, n = a.data("items"), s),
            r(this, t, n)) : (t = e.extend({}, e.fn.rowGrid.defaults, t),
            a.data("grid-options", t),
            r(this, t),
            t.resize && e(window).on("resize.rowGrid", {
                container: this
            }, function(i) {
                var s = e(i.data.container).data("group");
                s && s.each(function() {
                    var t = e(this);
                    t.add(t.find(".ff-img-holder, .picture-item__inner")).removeAttr("style")
                }),
                e(i.data.container).find(".ff-item:not(.ff-ad) .ff-content").dotdotdot({
                    ellipsis: "...",
                    after: ""
                }),
                r(i.data.container, t, s)
            }))
        })
    }
    ,
    e.fn.rowGrid.defaults = {
        minMargin: null,
        maxMargin: null,
        resize: !0,
        lastRowClass: "last-row",
        firstItemClass: null
    }
}(jQuery),
function(e) {
    "use strict";
    function t(e) {
        if (document.createEvent) {
            var t = document.createEvent("MouseEvents");
            t.initEvent("click", !1, !0),
            e.dispatchEvent(t)
        } else
            document.createEventObject ? e.fireEvent("onclick") : "function" == typeof e.onclick && e.onclick()
    }
    function i(e, t) {
        if (!e)
            return "";
        var i = /(http|ftp|https:\/\/[\w\-_]+\.{1}[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi
          , s = /\#\w+(?!\w)/g
          , n = /\@(\w+)(?!\w)/g
          , o = !0 === t || null == t ? "_blank" : "";
        return e.replace(i, function(e) {
            return '<a href="' + (/^(?:(?:https?|ftp):\/\/)/i.test(e) ? e : "http://" + e) + '" target="' + o + '">' + e + "</a>"
        }).replace(n, function(e) {
            return '<a href="https://www.instagram.com/' + e.replace("@", "") + '" target="' + o + '">' + e + "</a>"
        }).replace(s, function(e) {
            return '<a href="https://www.instagram.com/explore/tags/' + e.replace("#", "") + '" target="' + o + '">' + e + "</a>"
        })
    }
    function s(e, t, i, s) {
        if (e = Number(e),
        !1 !== (s = s || !1))
            return n(e, t, i, s);
        var o;
        return o = e >= 1e12 ? "T" : e >= 1e9 ? "B" : e >= 1e6 ? "M" : e >= 1e3 ? "K" : "",
        n(e, t, i, o)
    }
    function n(e, t, i, s) {
        var n = 0;
        switch (s) {
        case "T":
            n = e / 1e12;
            break;
        case "B":
            n = e / 1e9;
            break;
        case "M":
            n = e / 1e6;
            break;
        case "K":
            n = e / 1e3;
            break;
        case "":
            n = e
        }
        return !1 !== t && new RegExp("\\.\\d{" + (t + 1) + ",}$").test("" + n) && (n = n.toFixed(t)),
        !1 !== i && (n = Number(n).toFixed(i)),
        n + s
    }
    var o, r, a = e("html"), l = navigator.userAgent.toLowerCase(), d = /safari|chrome/.test(l), c = /android|blackBerry|iphone|ipad|ipod|opera mini|iemobile/i.test(l), p = /msie|trident.*rv\:11\./.test(l), f = /firefox/.test(l), u = !1, h = window.FlowFlowOpts;
    if (p) {
        if (/msie 8/.test(l))
            return;
        o = /msie 9/.test(l)
    }
    a.addClass("ff-browser-" + (d ? /chrome/.test(l) ? "chrome" : "safari" : p ? "ie" + (o ? " ff-ie9" : "") : f ? "ff" : "")),
    e.expr.createPseudo && "function" == typeof e.expr.createPseudo ? e.expr[":"].contains = e.expr.createPseudo(function(t) {
        return function(i) {
            return e(i).text().toUpperCase().indexOf(t.toUpperCase()) >= 0
        }
    }) : jQuery.expr[":"].contains = function(e, t, i) {
        return jQuery(e).text().toUpperCase().indexOf(i[3].toUpperCase()) >= 0
    }
    ;
    var m = function(e) {
        function n() {
            return e(document).bind("ffimgloaded", function(e, t) {
                var i = t.$grid.data("shuffle");
                i && i.layout()
            }),
            n = function() {
                return m
            }
            ,
            m
        }
        function o(e, t) {
            t = Math.pow(10, t);
            for (var i = ["k", "m", "b", "t"], s = i.length - 1; s >= 0; s--) {
                var n = Math.pow(10, 3 * (s + 1));
                if (n <= e) {
                    1e3 == (e = Math.round(e * t / n) / t) && s < i.length - 1 && (e = 1,
                    s++),
                    e += i[s];
                    break
                }
            }
            return e
        }
        function a(e) {
            switch (e) {
            case "user_timeline":
                return '<i class="flaticon-feed_type_user"></i>';
            case "likes":
            case "liked":
                return '<i class="flaticon-feed_type_like"></i>';
            case "tag":
                return '<i class="flaticon-feed_type_hash"></i>';
            case "location":
            case "coordinates":
                return '<i class="flaticon-feed_type_loc"></i>';
            default:
                return ""
            }
        }
        function l(t) {
            var i = t.find(".ff-filter-holder")
              , s = t.find(".selectric-ff-filters-select")
              , n = t.find(".ff-filter-holder .ff-filter")
              , o = i.width()
              , r = t.find(".ff-search").outerWidth() + 24
              , a = 0;
            e.each(n, function() {
                a += e(this).outerWidth() + 12
            }),
            s.hide(),
            n.show(),
            a + r > o && (s.css("display", "inline-block"),
            n.hide())
        }
        function d(t, i) {
            for (var s, n = 0, o = i.template.length; n < o; n++)
                "image" === i.template[n] && (s = n);
            t.each(function(t, i) {
                var n, o, r = e(i), a = r.find(".ff-img-holder"), l = "insertBefore";
                a.closest(".ff-content").length && (n = r.find(".ff-item-cont").children().not(".ff-label-wrapper"),
                s >= n.length ? (o = n.length - 1,
                s > n.length && (l = "insertAfter")) : o = s,
                a[l](n.eq(o))),
                r.addClass("ff-" + (a.length ? "" : "no-") + "image")
            })
        }
        function p(t) {
            var i, s, n, o, r = e(this), a = this, l = r.parent(), d = l.is("a") ? l : r;
            (n = r.data("size")) && (i = n.split(";")[1],
            s = i && 0 != i),
            s || (i = r.attr("height") || r.height(),
            s = i && 0 != i),
            n || r.data("size", {
                height: i,
                width: r.attr("width") || r.width()
            }),
            l.is(".ff-img-holder") || (r.removeAttr("width").removeAttr("height"),
            o = e('<span class="ff-img-holder ff-img-loading" style="width: 100%;max-height: none"></span>'),
            d.wrap(o)),
            a.onload = function() {
                s || e(document).trigger("ffimgloaded", {
                    $grid: t
                }),
                r.closest(".ff-img-holder").removeClass("ff-img-loading").addClass("ff-img-loaded"),
                r = null,
                a = null
            }
            ,
            a.onerror = function() {
                r.closest(".ff-img-holder").removeClass("ff-img-loading").addClass("ff-img-loaded"),
                r = null,
                a = null
            }
            ,
            l = null,
            d = null
        }
        function f(e) {
            var t, i, s, n, o, r, a = h.server_time, l = a - e, d = new Date(1e3 * e);
            for (r = E.length - 1; r >= 0 && (t = l / E[r]) <= 1; r--)
                ;
            switch (r < 0 && (r = 0),
            t = Math.floor(t),
            r) {
            case 3:
                if (1 == t) {
                    i = h.dates.Yesterday;
                    break
                }
            case 4:
            case 5:
                s = d.getMonth(),
                n = d.getDate(),
                i = A[s] + " " + n;
                break;
            case 6:
            case 7:
                s = d.getMonth(),
                n = d.getDate(),
                o = d.getFullYear(),
                i = A[s] + " " + n + ", " + o;
                break;
            default:
                i = g(t, a, a - l % E[r], 0, r)
            }
            return i
        }
        function g(e, t, i, s, n) {
            var o = M;
            return e + (o = o[n]) + " " + h.dates.ago
        }
        function v(e, t, i, n, o, r) {
            var l, d, p, f, u, m, g, v, w, y, b, x, k, T, C, S, I, $, E, A, M = e.length, z = "", F = "", N = "", P = o["icon-style"] && o["icon-style"].indexOf("stamp") > -1, H = t, W = "yep" === o["max-res"];
            r || (r = 0),
            o && "randomCompare" == o.order && (e = _(e));
            var L = o.feeds.reduce(function(e, t) {
                return e[t.id] ? e : (e[t.id] = {
                    id: t.id,
                    type: t["timeline-type"],
                    content: t["location-meta"] ? t["location-meta"].name : t.content
                },
                e)
            }, {});
            for (l = 0; l < M; l++) {
                if (p = e[l],
                d = l + 1,
                w = N = v = A = F = "",
                T = {},
                E = o.isOverlay && (!!p.img || -1 !== p.text.indexOf("<img")),
                "insta_flow" === o.plugin && (p.carousel_size > 0 && (v += '<div class="ff-carousel-icon"></div>'),
                p.media && "video/mp4" == p.media.type && (v += '<div class="ff-video-icon"></div>')),
                "ad" !== p.type) {
                    g = void 0 !== p.source ? p.source : p.permalink,
                    n && p.mod && (I = "new" == p.status ? " ff-moderation-new-post" : "",
                    $ = "approved" == p.status ? "checked" : "",
                    F = '<div class="ff-moderation-wrapper ' + ("approved" == p.status ? "ff-approved" : "") + I + '"><span>Approve</span> <label for="ff-mod-' + (H + r) + '"><input id="ff-mod-' + (H + r) + '" type="checkbox" class="ff-switcher" value="yes" ' + $ + "/><div><span></span></div></label></div>"),
                    p.additional && ("twitter" === p.type && (w += '<a href="https://twitter.com/intent/tweet?in_reply_to=' + p.id + '" class="ff-comments"> <i class="ff-icon-reply"></i></a>'),
                    (k = parseInt(p.additional.views)) > -1 && (w += '<a href="' + p.permalink + '" class="ff-views"><i class="ff-icon-view"></i> <span>' + (k < 0 ? "" : s(k, 2)) + "</span></a>"),
                    (y = parseInt(p.additional.likes)) > -1 && "twitter" !== p.type && (w += '<a href="' + p.permalink + '" class="ff-likes"><i class="ff-icon-like"></i> <span>' + (y < 0 ? "" : s(y, 2)) + "</span></a>"),
                    (x = parseInt(p.additional.shares)) > -1 && (w += '<a href="' + ("twitter" === p.type ? "https://twitter.com/intent/retweet?tweet_id=" + p.id : p.permalink) + '" class="ff-shares"><i class="ff-icon-shares"></i> <span>' + (x < 0 ? "" : s(x, 2)) + "</span></a>"),
                    y > -1 && "twitter" === p.type && (w += '<a href="https://twitter.com/intent/favorite?tweet_id=' + p.id + '" class="ff-likes"><i class="ff-icon-like"></i> <span>' + (y < 0 ? "" : s(y, 2)) + "</span></a>"),
                    b = parseInt(p.additional.comments),
                    "twitter" !== p.type && b > -1 && (w += '<a href="' + p.permalink + '" class="ff-comments"><i class="ff-icon-comment"></i> <span>' + (b > -1 ? s(b, 2) : "") + "</span></a>")),
                    i && (N += '<div class="ff-share-wrapper"><i class="ff-icon-share"></i><div class="ff-share-popup"><a href="http://www.facebook.com/sharer.php?u=' + (m = encodeURIComponent(p.permalink)) + '" class="ff-fb-share"><span>Facebook</span></a><a href="https://twitter.com/share?' + (p.header ? "text=" + encodeURIComponent(p.header) + "&" : "") + "url=" + m + '" class="ff-tw-share"><span>Twitter</span></a><a href="https://plus.google.com/share?url=' + m + '" class="ff-gp-share"><span>Google+</span></a><a href="https://www.pinterest.com/pin/create/button/?url=' + m + (p.media ? "&media=" + encodeURIComponent(p.media.url) : "") + '" class="ff-pin-share"><span>Pinterest</span></a><a href="https://www.linkedin.com/cws/share?url=' + m + '" class="ff-li-share"><span>Linkedin</span></a><a href="mailto:?subject=' + (p.header ? encodeURIComponent(p.header) : "") + "&body=" + m + '" class="ff-email-share"><span>Email</span></a></div></div>'),
                    A = p.media ? ' data-media="' + p.media.width + ";" + p.media.height + ";" + ("yep" === h.forceHTTPS ? p.media.url.replace("http:", "https:") : p.media.url) + ";" + p.media.type + (p.img ? ";" + p.img.width + ";" + p.img.height : "") + '"' : "",
                    S = W && p.media && "image" === p.media.type ? p.media : p.img,
                    T.image = S ? '<span class="ff-img-holder ff-img-loading' + (S.width / S.height > 1 ? " ff-img-landscape" : " ff-img-portrait ") + '" ' + A + '><img class="ff-initial-image" src="' + ("yep" === h.forceHTTPS ? S.url.replace("http:", "https:") : S.url) + '" data-size="' + S.width + ";" + S.height + '" /></span>' : "",
                    T.header = p.header ? '<h4><a rel="nofollow" href="' + g + '">' + p.header + "</a></h4>" : "",
                    T.text = '<div class="ff-content">' + p.text + "</div>",
                    T.meta = '<div class="ff-item-meta"><span class="ff-userpic" style="background:url(' + ("yep" === h.forceHTTPS ? p.userpic.replace("http:", "https:") : p.userpic) + ')"><i class="ff-icon ff-label-' + L[p.feed].type + '"><i class="ff-icon-inner"></i></i></span><h6><a rel="nofollow" href="' + p.userlink + '" class="ff-name ' + (p.userlink ? "" : " ff-no-link") + '">' + p.screenname + '</a></h6><a rel="nofollow" href="' + p.userlink + '" class="ff-nickname' + (p.userlink ? "" : " ff-no-link") + '">' + (p.nickname ? p.nickname : p.screenname) + '</a><a rel="nofollow" href="' + p.permalink + '" class="ff-timestamp">' + O(p.system_timestamp, p.timestamp) + "</a>",
                    p.location && (T.meta += '<span class="ff-location">' + p.location.name + "</span>"),
                    T.meta += "</div>",
                    "flow_flow" == o.plugin && (T.labelIcon = P ? "" : '<h6 class="ff-label-wrapper"><i class="ff-icon ff-label-' + L[p.feed].type + '"><i class="ff-icon-inner"><span class="ff-label-text">' + p.type + ("google" === p.type ? "+" : "") + "</span></i></i></h6>"),
                    "insta_flow" == o.plugin && (C = a(L[p.feed].type),
                    T.labelIcon = P ? "" : '<h6 class="ff-label-wrapper"><i class="ff-icon ff-label-' + L[p.feed].type + '"><i class="ff-icon-inner"><span class="ff-label-text">' + C + L[p.feed].content + "</span></i></i></h6>");
                    for (var D = 0, j = o.template.length; D < j; D++)
                        1 === D && E && (v += '<div class="ff-overlay-wrapper">'),
                        v += T[o.template[D]],
                        "meta" === o.template[D] && (v += T.labelIcon),
                        D === j - 1 && E && (v += '<h6 class="ff-item-bar">' + w + N + "</h6>",
                        v += '<div class="ff-overlay"></div></div>');
                    z += '<article class="ff-item' + (p.media && "image" != p.media.type ? " ff-video-preview" : "") + " ff-" + p.type + ("meta" === o.template[o.isOverlay ? 1 : 0] || !p.img && "meta" === o.template[1] ? " ff-meta-first" : "") + (p.header ? " ff-has-header" : "") + (p.img ? " ff-image" : " ff-no-image") + (E ? " ff-has-overlay" : "") + (p.with_comments ? " ff-supports-comments" : "") + '" id="ff-uid-' + H + '" post-id="' + p.id + '" data-type="' + p.type + '" data-feed="' + p.feed + '" data-index="' + (d + r) + '"' + A + ' data-timestamp="' + p.system_timestamp + '">' + (n && p.mod ? F : "") + '<div class="picture-item__inner"><div class="ff-item-cont">' + v + "</div>" + (E ? "" : '<h6 class="ff-item-bar">' + w + N + "</h6>"),
                    c && (z += '<a class="ff-mob-link" href="' + p.permalink + '"></a>'),
                    z += "</div>",
                    z += "</article>"
                } else
                    f = "yep" === p.label ? 'data-label="' + p.labelTxt + ";" + p.labelCol + '"' : "",
                    u = 'style="' + (p.textCol ? "color:" + p.textCol + ";" : "") + ("js" === p.adtype ? "height:" + p.height + "px" : "") + '"',
                    z += '<div class="ff-item ff-' + p.type + (p.permalink ? " ff-ad-link" : "") + '" id="ff-uid-' + H + '" post-id="' + p.id + '" data-type="' + p.type + '" data-adtype="' + p.adtype + '" data-index="' + d + '" ' + f + '><div class="picture-item__inner" style="' + (p.cardBG ? "background-color:" + p.cardBG + ";" : "") + '"><div class="ff-item-cont"><div class="ff-content" ' + u + ">" + p.text.replace(/document\.write\((.+?)\)/i, function(e, t) {
                        return "jQuery(" + t + ').appendTo(jQuery("#ff-uid-' + H + ' .ff-content"))'
                    }) + "</div>",
                    p.permalink && (z += '<a class="ff-link" href="' + p.permalink + '"></a>'),
                    z += "</div></div></div>";
                H++
            }
            return z
        }
        function w(t, i) {
            clearTimeout(r),
            u || (t.find(".ff-item").each(T),
            u = !0),
            r = setTimeout(function() {
                w.finder,
                t.find(".ff-highlight").each(function() {
                    e(this).replaceWith(this.childNodes)
                });
                var s = "justified" !== t.data("opts").layout ? "shuffleCustom" : "rowGrid";
                t[s]("shuffle", function(t, s) {
                    var n, o;
                    return (!s || "all" === s.group || -1 !== e.inArray(s.group, t.data("groups"))) && ((n = t.find(':contains("' + i + '")')).length && n.first().find("*").filter(function() {
                        var t = e(this);
                        return !t.children().length || t.is("p")
                    }).each(function(t, s) {
                        e(s).is("p") ? w.finder = window.findAndReplaceDOMText(s, {
                            find: new RegExp(i,"i"),
                            wrap: "span",
                            clss: "ff-highlight"
                        }) : e(s).html(function(e, t) {
                            return t.replace(new RegExp(i,"i"), function(e) {
                                return '<span class="ff-highlight">' + e + "</span>"
                            })
                        })
                    }),
                    n.length || (o = -1 !== (o = e.trim(t.attr("data-type")).toLowerCase()).indexOf(i)),
                    n.length || o)
                }, "only_sort")
            }, 100)
        }
        function y(t, i, s) {
            u || (i.find(".ff-item").each(T),
            u = !0),
            i["justified" !== i.data("opts").layout ? "shuffleCustom" : "rowGrid"]("shuffle", function(i, n) {
                if (n && "all" !== n.group && -1 === e.inArray(n.group, i.data("groups")))
                    return !1;
                var o;
                return "flow_flow" == t && (o = e.trim(i.attr("data-type")).toLowerCase()),
                "insta_flow" == t && (o = e.trim(i.attr("data-feed")).toLowerCase()),
                s ? -1 !== o.indexOf(s) : 1
            }, "only_sort")
        }
        function b(t, i, s, n, o, r) {
            function a(i, s) {
                var n = e(this)
                  , a = r.find(".ff-loader")
                  , f = r.find(".ff-item").not(".ff-ad").length
                  , u = {
                    action: ("insta_flow" === g ? "insta_flow_" : "") + "fetch_posts",
                    "stream-id": o.id,
                    page: o["next-page"],
                    countOfPages: o.countOfPages,
                    hash: o.hash
                };
                s ? n.addClass("ff-fetching-posts") : (n.css("opacity", 0),
                a.insertAfter(n).show().removeClass("ff-squeezed")),
                e.get(FlowFlowOpts.ajaxurl, u, function(i) {
                    var u = JSON.parse(i)
                      , m = u.items
                      , g = (m.length,
                    v(m, e('[id^="ff-uid-"]').length + 1 || 1, !0, h.moderation, o))
                      , w = e(g)
                      , y = w.not(".ff-ad")
                      , b = y.toArray();
                    if (t.trigger("loaded_more", {
                        items: w
                    }),
                    o.hash = u.hash,
                    o["next-page"] = u.page + 1,
                    o.countOfPages = u.countOfPages,
                    "carousel" !== o.trueLayout && t.append(w),
                    "justified" !== o.layout ? t.shuffleCustom("appended", w) : t.rowGrid("appended"),
                    k(w),
                    x(t, w, "yep" === o.viewportin),
                    y.each(function() {
                        e(this).find("img").not(":first").remove()
                    }),
                    w.find("img").each(function() {
                        p.apply(this, [t])
                    }),
                    c && (c._addSlideShowItems(b, "appended"),
                    c.initItemsEvents(b, f),
                    c.slideshowItems = [].slice.call(c.slideshow.children),
                    c.itemsCount = c.itemsCount + y.length),
                    "yep" === h.open_in_new) {
                        var T = location.hostname;
                        w.find("a").filter(function() {
                            return this.hostname != T
                        }).attr("target", "_blank")
                    }
                    if (d(y, o),
                    a.addClass("ff-squeezed").delay(300).hide(),
                    setTimeout(function() {
                        y.filter(":lt(5)").addClass("in"),
                        y.find(".ff-content").dotdotdot({
                            ellipsis: "...",
                            after: ""
                        }),
                        setTimeout(function() {
                            u.page + 1 != u.countOfPages ? s || n.css("opacity", 1) : s ? r.off("beforeChange") : n.remove(),
                            l.layout(),
                            s && n.removeClass("ff-fetching-posts")
                        }, 200)
                    }, 14),
                    FlowFlowOpts.dependencies.ads && u.ads) {
                        var C = jQuery.post(h.ajaxurl, {
                            action: "flow_flow_ad_action",
                            status: "view",
                            id: u.ads
                        });
                        e.when(C).always(function(e) {})
                    }
                })
            }
            t.find(".shuffle__sizer");
            var l, c, f, u, m = t.find(".ff-item"), g = r.data("plugin"), w = "insta_flow" == g ? o.trueLayout : o.layout, y = "grid" === w ? "" : "masonry" === w ? "m-" : "carousel" === w ? "c-" : "j-", b = {
                columns: [{
                    size: 1e4,
                    val: o[y + "c-desktop"]
                }, {
                    size: 1200,
                    val: o[y + "c-laptop"]
                }, {
                    size: 1024,
                    val: o[y + "c-tablet-l"]
                }, {
                    size: 768,
                    val: o[y + "c-tablet-p"]
                }, {
                    size: 480,
                    val: o[y + "c-smart-l"]
                }, {
                    size: 380,
                    val: o[y + "c-smart-p"]
                }],
                rows: [{
                    size: 1e4,
                    val: o[y + "r-desktop"]
                }, {
                    size: 1200,
                    val: o[y + "r-laptop"]
                }, {
                    size: 1024,
                    val: o[y + "r-tablet-l"]
                }, {
                    size: 768,
                    val: o[y + "r-tablet-p"]
                }, {
                    size: 480,
                    val: o[y + "r-smart-l"]
                }, {
                    size: 380,
                    val: o[y + "r-smart-p"]
                }],
                spacing: [{
                    size: 1e4,
                    val: o[y + "s-desktop"]
                }, {
                    size: 1200,
                    val: o[y + "s-laptop"]
                }, {
                    size: 1024,
                    val: o[y + "s-tablet-l"]
                }, {
                    size: 768,
                    val: o[y + "s-tablet-p"]
                }, {
                    size: 480,
                    val: o[y + "s-smart-l"]
                }, {
                    size: 380,
                    val: o[y + "s-smart-p"]
                }],
                row: [{
                    size: 1e4,
                    val: o[y + "h-desktop"]
                }, {
                    size: 1200,
                    val: o[y + "h-laptop"]
                }, {
                    size: 1024,
                    val: o[y + "h-tablet-l"]
                }, {
                    size: 768,
                    val: o[y + "h-tablet-p"]
                }, {
                    size: 480,
                    val: o[y + "h-smart-l"]
                }, {
                    size: 380,
                    val: o[y + "h-smart-p"]
                }]
            };
            return k(m),
            "justified" !== o.layout ? (t.shuffleCustom({
                itemSelector: ".ff-item",
                gutterWidth: function(e) {
                    var t = Array.prototype.slice.call(arguments);
                    return t.push(b.spacing),
                    function(e, t) {
                        var i, s, n;
                        for (i = t.length; i--; )
                            if (n = t[i].size,
                            e < n) {
                                s = parseInt(t[i].val);
                                break
                            }
                        return s
                    }
                    .apply(null, t)
                },
                columnWidth: function(e, t) {
                    var i = Array.prototype.slice.call(arguments)
                      , s = (t || this._itemMargin,
                    this);
                    return i.push(b),
                    i.push(this.streamOpts.trueLayout),
                    function(e, t, i, n) {
                        var o, r, a, l, d, c = i.columns;
                        for (o = c.length; o--; )
                            if (a = c[o].size,
                            e < a) {
                                l = parseInt(c[o].val),
                                "carousel" === n ? (d = i.rows[o].val,
                                r = (e - 2 * t - t * (l - 1)) / l,
                                s.streamOpts.itemsPerSlide = l * d) : r = (e - 2 * t - t * (l - 1)) / l;
                                break
                            }
                        return r || 260
                    }
                    .apply(null, i)
                },
                streamOpts: o
            }),
            t.on("done.shuffle", function() {
                setTimeout(function() {
                    l.layout(),
                    r.find(".ff-loadmore-wrapper").css("visibility", "visible")
                }, 0)
            })) : (t.rowGrid({
                minMargin: 5,
                maxMargin: 5,
                itemSelector: ".ff-item",
                firstItemClass: "first-item",
                resize: !0,
                sizes: b,
                streamOpts: o
            }),
            setTimeout(function() {
                r.find(".ff-loadmore-wrapper").css("visibility", "visible")
            }, 0)),
            n && (f = t.parent(),
            c = new CBPGridGallery(f,{
                iconStyle: o["icons-style"]
            }),
            u = f.find(".ff-slideshow").attr("id", f.attr("id") + "-slideshow"),
            "yep" === o.hidemeta && u.addClass("ff-hide-meta"),
            setTimeout(function() {
                document.body.appendChild(u.get(0))
            }, 0)),
            x(t, m, "yep" === o.viewportin),
            t.find(".ff-item:not(.ff-ad) .ff-content").dotdotdot({
                ellipsis: "...",
                after: ""
            }),
            l = t.data("shuffle"),
            i && (i = parseInt(i),
            t.addClass("ff-slider").parent().css("paddingBottom", "70px"),
            S(t, i, l, s),
            t.shuffleCustom("shuffle", function(e, t) {
                return parseInt(e.attr("data-index")) <= i
            }),
            t.data("num", m.length),
            t.data("visible", 0)),
            r.find(".ff-loadmore-wrapper span").click(a),
            r.on("slick-last-slide", a),
            r.on("slick-destroyed", function() {}),
            l
        }
        function x(e, t, i) {
            t.each(function() {
                FF_Viewport.add({
                    element: this,
                    threshold: 130,
                    enter: T,
                    leave: C,
                    needScroll: i
                })
            })
        }
        function k(e) {
            e.find(".picture-item__inner").addClass("picture-item__inner--transition")
        }
        function T() {
            e(this).addClass("in").data("viewport", "in")
        }
        function C() {
            e(this).data("viewport", "out")
        }
        function S(t, i, s, n) {
            function o() {
                var e = d.data("currentSlide") - 1;
                e < 1 && (e = u),
                d.data("currentSlide", e),
                a(e),
                n && setTimeout(l, 0)
            }
            function r() {
                var e = d.data("currentSlide") + 1;
                e > u && (e = 1),
                d.data("currentSlide", e),
                a(e),
                n && setTimeout(l, 0)
            }
            function a(s) {
                t.shuffleCustom("shuffle", function(t, n) {
                    var o, r, a;
                    return ("all" === n.group || -1 !== e.inArray(n.group, t.data("groups"))) && (o = t.attr("data-index"),
                    r = i * (s - 1),
                    a = i * s,
                    o > r && o <= a)
                })
            }
            function l() {
                var i = t.offset().top;
                e("html, body").animate({
                    scrollTop: i - 100
                }, 300)
            }
            var d, p = e('<span class="ff-control-prev"/>'), f = e('<span class="ff-control-next"/>'), u = Math.ceil(s.$items.length / i);
            p.on("click", o),
            f.on("click", r),
            c && I(t, o, r),
            (d = e('<div class="ff-controls-wrapper"></div>').append(p).append(f)).data("currentSlide", 1),
            t.on("layout.shuffle", function() {}),
            t.append(d)
        }
        function I(e, t, i) {
            var s, n, o, r, a;
            e.bind("touchstart", function(e) {
                o = (new Date).getTime(),
                s = e.originalEvent.touches[0].pageX,
                n = e.originalEvent.touches[0].clientY
            }).bind("touchmove", function(e) {
                r = e.originalEvent.touches[0].pageX,
                a = e.originalEvent.touches[0].clientY
            }).bind("touchend", function() {
                var e = r > s ? "right" : "left"
                  , l = a - n > 60 || -60 > a - n
                  , d = r - s > 60 || -60 > r - s;
                if (!((new Date).getTime() - o > 300 || l) && d)
                    switch (e) {
                    case "left":
                        i();
                        break;
                    case "right":
                        t()
                    }
            })
        }
        function $(t, i, s) {
            var n = s.id
              , o = s.hash
              , r = {};
            t.find(".ff-moderation-apply").click(function(t) {
                var i = e.post(FlowFlowOpts.ajaxurl, {
                    action: "flow_flow_moderation_apply_action",
                    moderation_action: "custom_approve",
                    stream: n,
                    changed: r,
                    hash: o
                });
                e.when(i).done(function(e) {
                    location.reload()
                })
            }),
            t.find(".ff-moderation-approve-new").click(function(t) {
                var i = e.post(FlowFlowOpts.ajaxurl, {
                    action: "flow_flow_moderation_apply_action",
                    moderation_action: "new_posts_approve",
                    stream: n,
                    hash: o
                });
                e.when(i).done(function(e) {
                    location.reload()
                })
            }),
            t.on("change", ".ff-moderation-wrapper input", function(t) {
                var i = e(this)
                  , s = i.is(":checked")
                  , n = i.closest(".ff-item").attr("post-id");
                i.closest(".ff-moderation-wrapper")[s ? "addClass" : "removeClass"]("ff-approved"),
                r[n] = {
                    approved: s
                }
            })
        }
        function _(e) {
            for (var t, i, s = e.length; 0 !== s; )
                i = Math.floor(Math.random() * s),
                t = e[s -= 1],
                e[s] = e[i],
                e[i] = t;
            return e
        }
        var O = "agoStyleDate" === h.date_style ? function(e, t) {
            return f(e)
        }
        : function(e, t) {
            return t
        }
          , E = [1, 60, 3600, 86400, 604800, 2630880, 31570560, 315705600]
          , A = h.dates.months
          , M = [h.dates.s, h.dates.m, h.dates.h]
          , z = {};
        return {
            init: n,
            streams: z,
            addTransitionToItems: k,
            addViewportItems: x,
            prepareImageFor: p,
            adjustItems: d,
            shuffle: b,
            recalcLayout: function(e) {
                e.$el.layout()
            },
            buildItems: v,
            buildStreamWith: function(s, n, r, f) {
                var u, m, g, b, x, k, T, C, S, I, _, O = "";
                if (FF_Viewport.getInstance(n),
                !n.feeds || "[]" === n.feeds)
                    return "<p>No feeds to show. Add at least one</p>";
                if (!n.layout)
                    return "<p>Please choose stream layout on options page</p>";
                "string" == typeof n.feeds && (n.feeds = JSON.parse(n.feeds)),
                x = n.feeds,
                n.hash = s.hash,
                n["next-page"] = s.page + 1,
                n.countOfPages = s.countOfPages;
                var E = s.items
                  , A = 0
                  , M = E.length
                  , F = e('[id^="ff-uid-"]').length + 1 || 1;
                if ("yep" === n.gallery && (O += '<section class="ff-slideshow"><ul></ul><nav><span class="ff-nav-prev"></span><span class="icon ff-nav-next"></span><span class="ff-nav-close"></span></nav><div class="ff-nav-info-keys">' + window.FlowFlowOpts.lightbox_navigate + "</div></section>"),
                O += '<div class="ff-header ff-loading">',
                n.heading && (O += "<h1>" + n.heading.replace(/\\/g, "") + "</h1>"),
                n.subheading && (O += "<h2>" + n.subheading.replace(/\\/g, "") + "</h2>"),
                "yep" == n["show-profile"] && E.length > 0 && 1 === n.feeds.length && "user_timeline" == n.feeds[0]["timeline-type"]) {
                    var N = E[0];
                    O += '<div class="ff-stream-profile">                        <div class="ff-stream-profile-fixed">                            <div class="ff-stream-profile-inner">                                <div class="ff-stream-profile-avatar" style="background-image: url(' + N.userpic + ')"></div>\t\t\t\t\t\t\t\t<div class="ff-stream-profile-content">\t\t\t\t\t\t\t\t\t<div class="ff-stream-profile-header">\t\t\t\t\t\t\t\t\t\t<h3>' + N.nickname + '</h3>\t\t\t\t\t\t\t\t\t\t<a href="https://www.instagram.com/' + N.nickname + '" target="_blank" title="Follow ' + N.screenname + '">follow</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<ul class="ff-stream-profile-meta">\t\t\t\t\t\t\t\t\t\t<li><b>' + o(N.user_counts_media, 0) + "</b> " + window.FlowFlowOpts.posts + "</li><li><b>" + o(N.user_counts_followed_by, 0) + "</b> " + window.FlowFlowOpts.followers + "</li><li><b>" + o(N.user_counts_follows, 0) + "</b> " + window.FlowFlowOpts.following + '</li>\t\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t\t\t<div class="ff-stream-profile-bio"><strong>' + N.screenname + "</strong>" + i(N.user_bio) + "</div>\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t</div>"
                }
                if ("yep" === n.filter) {
                    if ("flow_flow" == n.plugin) {
                        for (T = "",
                        k = {},
                        I = 0,
                        A = 0; A < M; A++)
                            k[E[A].type] = 1;
                        for (var P in k)
                            "ad" !== P && (I += 1,
                            T += '<span class="ff-filter" data-filter="' + P + '"><i class="ff-type-' + P + '"></i></span>',
                            C += '<option class="ff-filter-option ff-type-' + P + '" value="' + P + '">' + P + "</option>");
                        C = I > 1 ? '<option class="ff-filter-option ff-type-all" value="">' + h.filter_all + "</option>" + C : C,
                        T += '<select class="ff-filters-select">' + C + "</select>",
                        O += '<div class="ff-filter-holder">' + (I > 1 ? '<span class="ff-filter ff-type-all ff-filter--active">' + h.filter_all + "</span>" + T : "") + '<span class="ff-search"><input type="text" placeholder="' + h.filter_search + '"/></span></div>'
                    }
                    "insta_flow" == n.plugin && (C = "",
                    T = "",
                    S = [],
                    I = 0,
                    x.forEach(function(e, t, i) {
                        var s = e.content;
                        e.hasOwnProperty("location-meta") && e["location-meta"].hasOwnProperty("name") && (s = e["location-meta"].name),
                        S.push({
                            id: e.id,
                            type: e["timeline-type"],
                            label: s
                        })
                    }),
                    S.forEach(function(e, t, i) {
                        if ("ad" !== e.type) {
                            var s = a(e.type);
                            I += 1,
                            T += '<span class="ff-filter ff-type-' + e.type + '" data-filter="' + e.id + '">\t\t\t\t\t\t' + s + "<span>" + e.label + "</span></span>",
                            C += '<option class="ff-filter-option" value="' + e.id + '">' + e.label + "</option>"
                        }
                    }),
                    C = I > 1 ? '<option class="ff-filter-option ff-type-all" value="">' + h.filter_all + "</option>" + C : C,
                    T += '<select class="ff-filters-select">' + C + "</select>",
                    O += '<div class="ff-filter-holder">' + (I > 1 ? '<span class="ff-filter ff-type-all ff-filter--active">' + h.filter_all + "</span>" + T : "") + '<span class="ff-search"><input type="text" placeholder="' + h.filter_search + '"/></span></div>')
                }
                if (r && (h.moderation = r,
                O += '<div class="ff-moderation-holder"><p><strong>PREMODERATION MODE IS ON</strong>. APPROVE POSTS AND HIT <strong>APPLY CHANGES</strong>.</p><span class="ff-moderation-button ff-moderation-apply">Apply changes</span><span class="ff-moderation-button ff-moderation-approve-new">Approve new posts</span></div>'),
                O += "</div>",
                n["gc-style"],
                O += '<div class="ff-stream-wrapper ff-' + (c ? "mobile" : "desktop") + " shuffle--container" + ("yep" === n.viewportin && !c && window.requestAnimationFrame && "carousel" !== n.trueLayout ? " shuffle--animatein" : " shuffle--animateoff") + " ff-layout-" + n.layout + " ff-truelayout-" + n.trueLayout + " ff-upic-" + n["upic-pos"] + " ff-upic-" + n["upic-style"] + " ff-align-" + n.talign + " ff-sc-" + n["icon-style"] + " ff-" + n["icons-style"] + '-icon">',
                _ = v(E, F, !0, r, n),
                O += _,
                "carousel" != n.trueLayout && (O += '<div class="shuffle__sizer"></div>'),
                O += "</div>",
                s.countOfPages > 1 && s.page + 1 != s.countOfPages && ("yep" !== n.mobileslider || !c) && "carousel" != n.trueLayout && (O += '<div class="ff-loadmore-wrapper"><span class="ff-btn">' + window.FlowFlowOpts.show_more + "</span></div>"),
                "carousel" === n.trueLayout && (O += '<div class="ff-slide-overlay"><div class="ff-slide-loader"><span>Loading<br>posts...</span></div></div>'),
                (u = e(O)).each(function(t) {
                    if (this.className.indexOf("ff-stream-wrapper") + 1)
                        return m = e(this),
                        !1
                }),
                g = u.find(".ff-item"),
                b = g.not(".ff-ad"),
                m.data("opts", n).data("items", g),
                b.each(function() {
                    var t = e(this);
                    t.is(".ff-image") ? t.find("img").not(".ff-initial-image").remove() : t.find("img").not(":first").remove()
                }),
                u.find("p:empty, .ff-content a:empty").remove(),
                u.find(".ff-filters-select").selectric({
                    nativeOnMobile: !1,
                    labelBuilder: function(e) {
                        var t = n.feeds.find(function(t) {
                            return t.id == e.value
                        });
                        return (t ? a(t["timeline-type"]) : "") + e.text
                    },
                    optionsItemBuilder: function(e, t, i) {
                        var s = n.feeds.find(function(t) {
                            return t.id == e.value
                        });
                        return (s ? a(s["timeline-type"]) : "") + e.text
                    }
                }).on("change", function(e) {
                    var t = this.value;
                    y(n.plugin, m, t)
                }),
                setTimeout(l.bind(this, u), 4),
                e(window).on("resize", l.bind(this, u)),
                u.find("img").each(function() {
                    p.apply(this, [m])
                }),
                u.find(".ff-filter").click(function() {
                    u.find(".ff-filter--active").removeClass("ff-filter--active");
                    var t = e(this).addClass("ff-filter--active").attr("data-filter");
                    y(n.plugin, m, t)
                }).mouseenter(function() {
                    var t, i = e(this), s = i.data("filter");
                    "flow_flow" == n.plugin && (t = m.find(s ? "[data-type=" + s + "]" : ".ff-item").length),
                    "insta_flow" == n.plugin && (t = m.find(s ? "[data-feed=" + s + "]" : ".ff-item").length),
                    i.attr("data-num", t)
                }),
                u.find(".ff-search input").on("keyup", function() {
                    var e = this.value.toLowerCase();
                    w(m, e)
                }),
                u.on("click", "a", function(t) {
                    var i = e(this)
                      , s = e(this).attr("href");
                    return -1 == s.indexOf("mailto:?") && i.closest(".ff-share-popup").length ? (window.open(s, "sharer", "toolbar=0,status=0,width=626,height=436"),
                    !1) : (!i.is(".ff-no-link") || "nope" !== n.gallery && !c) && void 0
                }),
                u.on("click", ".ff-share-wrapper", function(t) {
                    var i = e(this);
                    i.data("opened") ? (i.removeClass("ff-popup__visible"),
                    i.data("opened", !1)) : (i.addClass("ff-popup__visible"),
                    i.data("opened", !0))
                }),
                "nope" === n.gallery ? (m.addClass("ff-gallery-off").on("click", '.ff-item:not(".ff-ad") .picture-item__inner', function(i) {
                    var s = e(i.target)
                      , n = e(this);
                    if (!s.closest("a, .ff-share-wrapper").length || s.is("img"))
                        return c ? n.toggleClass("ff-taped") : t(n.find(".ff-timestamp")[0]),
                        !1
                }),
                m.on("click", ".ff-timestamp", function(e) {
                    e.stopImmediatePropagation()
                })) : m.addClass("ff-gallery-on"),
                "yep" === h.open_in_new) {
                    var H = location.hostname;
                    u.find("a").filter(function() {
                        return this.hostname != H && -1 == e(this).attr("href").indexOf("mailto")
                    }).attr("target", "_blank")
                }
                d(b, n),
                r && $(u, E, n),
                z[n.id] = m;
                for (var W in f)
                    f[W] && this[W].init(m);
                return u
            },
            setupGrid: function(e, t, i, s, n, o) {
                setTimeout(function() {
                    b(e, t, i, s, n, o);//console.log("e : ", e)
                }, 0)
            },
            adjustImgHeight: function(t, i) {
                t.find("img").each(function() {
                    var t = e(this)
                      , s = parseInt(t.css("height"))
                      , n = parseInt(t.css("width"))
                      , o = i / n;
                    t.css("height", Math.round(s * o) + "px")
                })
            }
        }
    }(e);
    window.FlowFlow = m.init()
}(jQuery),
jQuery(document).on("done.shuffle", function(e, t) {
    jQuery(function() {
        setTimeout(function() {}, 500)
    })
});
