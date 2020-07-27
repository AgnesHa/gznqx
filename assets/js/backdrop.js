(function (win, doc, undefined) {
  function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
      i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }

  function whichType(d) {
    return Object.prototype.toString.call(d, null).slice(8, -1);
  }

  function isString(d) {
    return typeof d === 'undefined';
  }

  function isTrue(d) {
    return d === true;
  }

  function isUndefined(d) {
    return typeof d === 'undefined';
  }

  function isNull(d) {
    return d === null;
  }

  function isObject(obj) {
    return (obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object);
  }

  function isBoolean(d) {
    return typeof d === 'boolean';
  }

  function isEmptyObject(d) {
    return isObject(d) && d.length === 0;
  }

  function isEmptyArray(d) {
    return Array.isArray(d) && d.length === 0;
  }

  function toArray(el) {
    return [].slice.call(el);
  }

  function getClassSelector(el) {
    var arr = toArray(el.classList);
    return isEmptyArray(arr) ? '' : '.' + arr.join('.');
  }

  function closest(ele, tar) {
    if (!Element.prototype.isPrototypeOf(ele)) {
      throw new TypeError(ele + 'is not a Element!');
    }
    var elArr = (function () {
      if (tar instanceof HTMLElement) return [tar];
      try {
        tar = doc.querySelectorAll(tar);
      } catch (e) {
        console.log(e);
      }
      if (['NodeList', 'HTMLCollection', 'Array'].indexOf(whichType(tar)) > -1) return toArray(tar);
    })();
    do {
      if (elArr.indexOf(ele) > -1) return ele;
      ele = ele.parentElement;
    } while (ele !== null);
    return null;
  }

  function flatArray(arr, d) {
    d = d || 1;
    return d > 0 ? arr.reduce(function (prev, now) {
      return prev.concat(Array.isArray(now) ? flatArray(now, d - 1) : now);
    }, []) : arr.slice();
  }

  function getObjValues(obj) {
    if (obj !== Object(obj)) throw new TypeError(obj + 'is a non-object');
    return Object.keys(obj).map(function (e) {
      return obj[e];
    });
  }

  function getTransitionEventName() {
    var el = document.createElement('div');
    var transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend'
    }
    for (var attr in transitions) {
      if (el.style[attr] !== undefined) return transitions[attr];
    }
  }

  function insertCssRules(rules) {
    var sheets = toArray(doc.styleSheets),
      lastSheet = null;
    sheets = sheets.filter(function (e) {
      return !isTrue(e.disabled) && e.ownerNode.tagName.toLowerCase() === 'style';
    })
    if (sheets.length === 0) {
      var s = doc.createElement('style');
      doc.head.appendChild(s);
      sheets = toArray(doc.styleSheets);
    }
    lastSheet = sheets[sheets.length - 1];
    rules.forEach(function (e) {
      try {
        lastSheet.insertRule(e, lastSheet.cssRules.length);
      } catch (err) {
        console.log(err)
      }
    });
  }

  function extend(tarObj, initObj) {
    tarObj === void 0 && (tarObj = {});
    initObj === void 0 && (initObj = {});
    Object.keys(initObj).forEach(function (key) {
      if (isUndefined(tarObj[key])) {
        tarObj[key] = initObj[key];
      } else if (isObject(initObj[key]) && isObject(tarObj[key]) && Object.keys(initObj[key]).length > 0) {
        extend(tarObj[key], initObj[key]);
      }
    })
  }
  var defaults = {
    direction: 'horizontal',
    transition: {
      value: '500ms',
      waitForTransition: false
    },
    autoplay: {
      enable: false,
      delay: 7000
    },
    isClickSlide: false,
    scale: {
      x: 1,
      y: 1
    },
    navigation: {
      nextEl: null,
      prevEl: null
    },
    baseZIndex: 10
  }

  function setParams(params) {
    extend(params, defaults);
    var autoplay = params.autoplay;
    if (isTrue(autoplay)) {
      params.autoplay = {
        enable: true,
        delay: 7000
      }
    }
    var transition = params.transition;
    if (!isObject(transition)) {
      params.transition = {
        value: params.transition,
        waitForTransition: false
      }
    }
    var scale = params.scale;
    if (!isUndefined(scale) && isFinite(+scale)) {
      params.scale = {
        x: scale,
        y: scale
      }
    }
    return params;
  }

  function appendStyleRules() {
    var backdrop = this,
      wrapper = backdrop.wrapper,
      params = backdrop.params,
      slides = backdrop.slides,
      length = slides.length,
      mediant = slides.mediant,
      dataAttrArr = slides.dataAttrArr;
    var cssRuleArr = [];

    function calcSlideCssRule(index) {
      var relativeI = index - mediant,
        absN = Math.abs(relativeI),
        zIndex = mediant - absN;
      var cssObj = {},
        wrapperSizeObj = wrapper.getBoundingClientRect();
      cssObj['z-index'] = params.baseZIndex + zIndex;
      if (params.opacity) {
        cssObj['opacity'] = Math.pow(params.opacity, absN);
      }
      if (params.transformOrigin) {
        cssObj['transform-origin'] = params.transformOrigin;
      }
      var translate = '';
      if (params.direction === 'horizontal') {
        var x = parseFloat(params.offsetDistance) || wrapperSizeObj.width / length - 1;
        translate = 'translate3d(' + x * relativeI + 'px, 0 , 0)';
      } else if (params.direction === 'vertical') {
        var y = parseFloat(params.offsetDistance) || wrapperSizeObj.height / length - 1;
        translate = 'translate3d(0,' + y * relativeI + 'px,0)';
      }
      var scale = params.scale;
      if (scale) {
        var scaleX = Math.pow(scale.x, absN),
          scaleY = Math.pow(scale.y, absN);
        scaleVal = 'scale(' + scaleX + ',' + scaleY + ')';
      }
      cssObj['transform'] = translate + ' ' + scaleVal;
      if (params.transition) {
        cssObj['transition'] = params.transition.value
      };
      return cssObj;
    }

    function fillCssRuleArr(slideId, cssObj) {
      var cssRuleKey = '[' + slides.uId + '=' + slideId + ']';
      var cssRulValue = Object.keys(cssObj).map(function (key) {
        return key + ':' + cssObj[key] + '!important;';
      }).join('');
      var cssRuleStr = cssRuleKey + '{' + cssRulValue + '}';
      cssRuleArr.push(cssRuleStr);
    }
    slides.list.forEach(function (el, index) {
      var uidVal = uuid(14, 16),
        slideId = 'slide' + uidVal;
      dataAttrArr.push({
        slideId: slideId,
        index: index
      });
      var cssObj = calcSlideCssRule(index);
      fillCssRuleArr(slideId, cssObj);
    });
    insertCssRules(cssRuleArr);
    backdrop.updateSlideDataAttr();
  }

  function getSlides() {
    var backdrop = this,
      wrapper = backdrop.wrapper,
      isClickSlide = backdrop.params.isClickSlide,
      slides = backdrop.slides;
    var list = toArray(wrapper.children),
      length = list.length,
      mediant = Math.floor(length / 2),
      uId = 'data-slide-id',
      clickable = isClickSlide,
      dataAttrArr = [];
    var slides = {
      list: list,
      length: length,
      mediant: mediant,
      uId: uId,
      clickable: clickable,
      dataAttrArr: dataAttrArr
    }
    return slides;
  }

  function slideToPrev() {
    var backdrop = this,
      dataAttrArr = backdrop.slides.dataAttrArr;
    dataAttrArr.push(dataAttrArr.shift());
    backdrop.updateSlideDataAttr();
  }

  function slideToNext() {
    var backdrop = this,
      dataAttrArr = backdrop.slides.dataAttrArr;
    dataAttrArr.unshift(dataAttrArr.pop());
    backdrop.updateSlideDataAttr();
  }

  function slideToGraphic(target) {
    var backdrop = this,
      slides = backdrop.slides,
      mediant = slides.mediant,
      dataAttrArr = slides.dataAttrArr,
      waitForTransition = backdrop.params.transition.waitForTransition;
    var index = +target.getAttribute('data-index'),
      diffI = 0;
    if (index === mediant) {
      waitForTransition && (backdrop.isTransitionEnd = true);
      backdrop.autoplay.init();
      return;
    }
    diffI = mediant - index;
    slides.dataAttrArr = dataAttrArr.splice(diffI).concat(dataAttrArr);
    backdrop.updateSlideDataAttr();
  }
  var slideTo = {
    slideToPrev: slideToPrev,
    slideToNext: slideToNext,
    slideToGraphic: slideToGraphic
  }
  var Autoplay = {
    init: function () {
      var backdrop = this,
        enable = backdrop.params.autoplay.enable;
      enable && backdrop.autoplay.run();
    },
    run: function () {
      var backdrop = this,
        delay = backdrop.params.autoplay.delay;
      backdrop.autoplay.stop();
      backdrop.autoplay.timer = setInterval(function () {
        backdrop.slideToNext();
      }, delay);
    },
    stop: function () {
      var backdrop = this;
      if (backdrop.autoplay.timer) {
        clearInterval(backdrop.autoplay.timer);
        backdrop.autoplay.timer = undefined;
      }
      return true;
    }
  }
  var transitionendName = getTransitionEventName();

  function addTransitionEnd() {
    var backdrop = this,
      waitForTransition = backdrop.params.transition.waitForTransition,
      firstSlidesList = backdrop.slides.list[0];
    firstSlidesList.addEventListener(transitionendName, function () {
      waitForTransition && (backdrop.isTransitionEnd = true);
      backdrop.autoplay.init();
    });
  }
  var transition = {
    addTransitionEnd: addTransitionEnd
  }

  function updateSlideDataAttr() {
    var backdrop = this,
      slides = backdrop.slides,
      dataAttrArr = slides.dataAttrArr;
    slides.list.forEach(function (el, index) {
      el.setAttribute(slides.uId, dataAttrArr[index].slideId);
      el.setAttribute('data-index', dataAttrArr[index].index);
    });
  }
  var update = {
    updateSlideDataAttr: updateSlideDataAttr
  }
  var Click = {
    canClickEles: [],
    setCanClickEles: function () {
      var backdrop = this,
        navigation = backdrop.params.navigation,
        slides = backdrop.slides,
        canClickEles = backdrop.click.canClickEles;
      Object.keys(navigation).forEach(function (e) {
        !isNull(navigation[e]) && canClickEles.push(navigation[e]);
      });
      isTrue(slides.clickable) && canClickEles.push(slides.list);
      backdrop.click.canClickEles = flatArray(canClickEles, Infinity);
    },
    init: function () {
      var backdrop = this;
      backdrop.click.setCanClickEles();
      if (isEmptyArray(backdrop.click.canClickEles)) return;
      backdrop.click.run();
    },
    run: function () {
      var backdrop = this,
        wrapper = backdrop.wrapper,
        canClickEles = backdrop.click.canClickEles,
        navigation = backdrop.params.navigation,
        waitForTransition = backdrop.params.transition.waitForTransition;
      wrapper.parentElement.addEventListener('click', function (ev) {
        var target = ev.target,
          willTar = null,
          ele = null;
        for (var i = 0, len = canClickEles.length; i < len; i++) {
          ele = canClickEles[i];
          if (ele === closest(target, ele)) {
            willTar = ele;
            break;
          }
        }
        if (isNull(willTar)) return;
        if (waitForTransition) {
          if (!backdrop.isTransitionEnd) return
          backdrop.isTransitionEnd = false;
        }
        backdrop.autoplay.stop();
        if (willTar === navigation.prevEl) {
          backdrop.slideToPrev();
        } else if (willTar === navigation.nextEl) {
          backdrop.slideToNext();
        } else {
          backdrop.slideToGraphic(willTar);
        }
      });
    }
  }
  var prototypes = {
    slideTo: slideTo,
    update: update,
    transition: transition
  }
  var Backdrop = function (wrapper, params) {
    this.wrapper = wrapper;
    this.params = setParams(params);
    extend(this, {
      slides: getSlides.call(this),
      autoplay: {
        init: Autoplay.init.bind(this),
        run: Autoplay.run.bind(this),
        stop: Autoplay.stop.bind(this)
      },
      click: {
        canClickEles: Click.canClickEles,
        setCanClickEles: Click.setCanClickEles.bind(this),
        init: Click.init.bind(this),
        run: Click.run.bind(this)
      }
    });
    Object.keys(prototypes).forEach(function (group) {
      Object.keys(prototypes[group]).forEach(function (method) {
        !Backdrop.prototype[method] && (Backdrop.prototype[method] = prototypes[group][method]);
      });
    });
    this.init();
  }
  Backdrop.prototype.init = function () {
    var backdrop = this;
    appendStyleRules.call(backdrop);
    backdrop.autoplay.init();
    backdrop.click.init();
    backdrop.addTransitionEnd();
  }
  win.Backdrop = Backdrop;
}(window, document))