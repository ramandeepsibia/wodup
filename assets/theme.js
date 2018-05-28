var MasonryGrid, MasonryVideo,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.ThemeEditor = (function(superClass) {
  extend(ThemeEditor, superClass);

  function ThemeEditor() {
    return ThemeEditor.__super__.constructor.apply(this, arguments);
  }

  ThemeEditor.prototype.initialize = function() {
    this.instanceHandlers = {};
    this.instances = {};
    return $(document).on('shopify:section:load', (function(_this) {
      return function(event) {
        return _this._onSectionLoad(event);
      };
    })(this)).on('shopify:section:unload', (function(_this) {
      return function(event) {
        return _this._onSectionUnload(event);
      };
    })(this)).on('shopify:section:select', (function(_this) {
      return function(event) {
        return _this._onSectionSelect(event);
      };
    })(this)).on('shopify:section:deselect', (function(_this) {
      return function(event) {
        return _this._onSectionDeselect(event);
      };
    })(this)).on('shopify:section:reorder', (function(_this) {
      return function(event) {
        return _this._onSectionReorder(event);
      };
    })(this)).on('shopify:block:select', (function(_this) {
      return function(event) {
        return _this._onBlockSelect(event);
      };
    })(this)).on('shopify:block:deselect', (function(_this) {
      return function(event) {
        return _this._onBlockDeselect(event);
      };
    })(this));
  };

  ThemeEditor.prototype._findInstance = function(event) {
    var $container, instance;
    instance = this.instances[event.originalEvent.detail.sectionId];
    if (instance != null) {
      return instance;
    } else {
      $container = $('[data-section-id]', event.target);
      return this._createInstance($container);
    }
  };

  ThemeEditor.prototype._createInstance = function($container, instanceHandler) {
    var instance, sectionId, sectionType;
    sectionType = $container.attr('data-section-type');
    sectionId = $container.attr('data-section-id');
    if (sectionType == null) {
      return;
    }
    instanceHandler = instanceHandler || this.instanceHandlers[sectionType];
    instance = {
      instanceHandler: instanceHandler,
      $container: $container,
      sectionId: sectionId
    };
    this.instances[sectionId] = instance;
    return instance;
  };


  /*
      Action: A section has been added or re-rendered.
      Expected: Re-execute any JavaScript needed for the section to work and
          display properly (as if the page had just been loaded).
   */

  ThemeEditor.prototype._onSectionLoad = function(event) {
    var $container, ref, ref1;
    $container = $('[data-section-id]', event.target);
    if (!$container.length) {
      return;
    }
    return (ref = this._createInstance($container)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onSectionLoad === "function" ? ref1.onSectionLoad(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: A section has been deleted or is being re-rendered.
      Expected: Clean up any event listeners, variables, etc., so that
          nothing breaks when the page is interacted with and no memory leaks occur.
   */

  ThemeEditor.prototype._onSectionUnload = function(event) {
    var instance, ref;
    instance = this._findInstance(event);
    if (instance != null) {
      if ((ref = instance.instanceHandler) != null) {
        if (typeof ref.onSectionUnload === "function") {
          ref.onSectionUnload(event);
        }
      }
    }
    if (instance) {
      return delete this.instances[instance.sectionId];
    }
  };


  /*
      Action: User has selected the section in the sidebar.
      Expected: Make sure the section is in view and stays
          in view while selected (scrolling happens automatically).
      Example: Could be used to pause a slideshow
   */

  ThemeEditor.prototype._onSectionSelect = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onSectionSelect === "function" ? ref1.onSectionSelect(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: User has deselected the section in the sidebar.
      Expected: (None)
      Example: Could be used to restart slideshows that are no longer being interacted with.
   */

  ThemeEditor.prototype._onSectionDeselect = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onSectionDeselect === "function" ? ref1.onSectionDeselect(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: User moves section in the sidebar
      Expected: (None)
      Example: Could be used to used to change high level section classes, or fire JS dependent on first section
   */

  ThemeEditor.prototype._onSectionReorder = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onSectionReorder === "function" ? ref1.onSectionReorder(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: User has selected the block in the sidebar.
      Expected: Make sure the block is in view and stays
          in view while selected (scrolling happens automatically).
      Example: Can be used to to trigger a slideshow to bring a slide/block into view
   */

  ThemeEditor.prototype._onBlockSelect = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onBlockSelect === "function" ? ref1.onBlockSelect(event) : void 0 : void 0 : void 0;
  };


  /*
      Action: User has deselected the block in the sidebar.
      Expected: (None)
      Example: Resume a slideshow
   */

  ThemeEditor.prototype._onBlockDeselect = function(event) {
    var ref, ref1;
    return (ref = this._findInstance(event)) != null ? (ref1 = ref.instanceHandler) != null ? typeof ref1.onBlockDeselect === "function" ? ref1.onBlockDeselect(event) : void 0 : void 0 : void 0;
  };


  /*
      Auto initialisation of a section for the store front
   */

  ThemeEditor.prototype._sectionInit = function(instance) {
    var ref;
    return instance != null ? (ref = instance.instanceHandler) != null ? typeof ref.init === "function" ? ref.init(instance) : void 0 : void 0 : void 0;
  };


  /*
      Registration of a section
          - Takes a string parameter as the first argument which
            matches to `[data-section-type]`
  
       * Example
          @sections = new Sections()
          @sections.register('some-section-type', @someSectionClass)
   */

  ThemeEditor.prototype.register = function(type, instanceHandler) {

    /*
        Storage of a instanceHandler based on the sectionType allows _onSectionLoad
           to connect a new section to it's registered instanceHandler
     */
    this.instanceHandlers[type] = instanceHandler;
    return $("[data-section-type=" + type + "]").each((function(_this) {
      return function(index, container) {
        var $container;
        $container = $(container);
        return _this._sectionInit(_this._createInstance($container, instanceHandler));
      };
    })(this));
  };


  /*
      Public method to retrieve information on an instance based on the
      bubbled `event`
   */

  ThemeEditor.prototype.getInstance = function(event) {
    return this._findInstance(event);
  };

  return ThemeEditor;

})(Backbone.View);

window.ThemeUtils = {
  breakpoints: {
    xSmall: 540,
    small: 770,
    medium: 1020,
    large: 1280
  },
  extend: function() {
    var dest, i, k, len, obj, objs, v;
    dest = arguments[0], objs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = 0, len = objs.length; i < len; i++) {
      obj = objs[i];
      for (k in obj) {
        v = obj[k];
        dest[k] = v;
      }
    }
    return dest;
  },
  windowWidth: function() {
    return window.innerWidth || this.window.width();
  },
  isSmall: function() {
    return this.windowWidth() <= this.breakpoints.small;
  },
  isMedium: function() {
    return this.windowWidth() <= this.breakpoints.medium;
  },
  debounce: function(func, wait, immediate) {
    var timeout;
    timeout = null;
    return function() {
      var args, callNow, context, later;
      context = this;
      args = arguments;
      later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  },
  unique: function(array) {
    var i, key, output, ref, results, value;
    output = {};
    for (key = i = 0, ref = array.length; 0 <= ref ? i < ref : i > ref; key = 0 <= ref ? ++i : --i) {
      output[array[key]] = array[key];
    }
    results = [];
    for (key in output) {
      value = output[key];
      results.push(value);
    }
    return results;
  },
  scrollTarget: function($el) {
    if (!($el instanceof jQuery)) {
      $el = $($el);
    }
    return $('html, body').animate({
      scrollTop: $el.offset().top
    }, 500, 'linear');
  },
  inViewport: function(el, direction) {
    var inViewportH, inViewportV, rect, viewportHeight, viewportWidth;
    if (direction == null) {
      direction = 'both';
    }
    if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
    }
    rect = el.getBoundingClientRect();
    if (document.documentElement.clientWidth < window.innerWidth) {
      viewportWidth = document.documentElement.clientWidth;
    } else {
      viewportWidth = window.innerHeight;
    }
    if (document.documentElement.clientHeight < window.innerHeight) {
      viewportHeight = document.documentElement.clientHeight;
    } else {
      viewportHeight = window.innerHeight;
    }
    inViewportH = rect.right >= 0 && rect.left <= viewportWidth;
    inViewportV = rect.bottom >= 0 && rect.top <= viewportHeight;
    switch (direction) {
      case 'horizontal':
        return inViewportH;
      case 'vertical':
        return inViewportV;
      case 'both':
        return inViewportV && inViewportH;
    }
  },

  /*
      Resize Flickity slider to tallest cell in viewport
   */
  flickityResize: function(flickity) {
    var $viewport, cell, height, heights, i, len, ref;
    $viewport = $(flickity.viewport);
    heights = [];
    ref = flickity.cells;
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (this.inViewport(cell.element, 'horizontal')) {
        heights.push($(cell.element).outerHeight(true));
      }
    }
    height = Math.max.apply(null, heights);
    return $viewport.height(height);
  }
};

window.CurrencyView = (function(superClass) {
  extend(CurrencyView, superClass);

  function CurrencyView() {
    return CurrencyView.__super__.constructor.apply(this, arguments);
  }

  CurrencyView.prototype.events = {
    "change [name=currencies]": "switchCurrency",
    "switch-currency": "switchCurrency"
  };

  CurrencyView.prototype.initialize = function() {
    var doubleMoney, i, j, len, len1, money, newCurrency, ref, ref1;
    Currency.format = Theme.currencySwitcherFormat;
    Currency.money_with_currency_format = {};
    Currency.money_with_currency_format[Theme.currency] = Theme.moneyFormatCurrency;
    Currency.money_format = {};
    Currency.money_format[Theme.currency] = Theme.moneyFormat;
    newCurrency = Currency.cookie.read();
    if (newCurrency && this.$("[name=currencies] option[value=" + newCurrency + "]")) {
      Currency.currentCurrency = newCurrency;
    } else if (Theme.defaultCurrency) {
      Currency.currentCurrency = Theme.defaultCurrency;
      Currency.cookie.write(Theme.defaultCurrency);
    } else {
      Currency.currentCurrency = Theme.currency;
      Currency.cookie.write(Theme.currency);
    }
    $("[name=currencies]").val(Currency.currentCurrency);
    ref = $("span.money span.money");
    for (i = 0, len = ref.length; i < len; i++) {
      doubleMoney = ref[i];
      $(doubleMoney).parents("span.money").removeClass("money");
    }
    ref1 = $("span.money");
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      money = ref1[j];
      $(money).attr("data-currency-" + Theme.currency, $(money).html());
    }
    this.switchCurrency();
    this.moveCurrencyConverter();
    return $(window).on('resize.currency', window.ThemeUtils.debounce(this.moveCurrencyConverter, 100));
  };

  CurrencyView.prototype.unload = function() {
    this.moveCurrencyConverter();
    return $(window).off('resize.currency');
  };

  CurrencyView.prototype.switchCurrency = function() {
    var $switcher, i, len, money, newCurrency, ref;
    $switcher = $("[name=currencies]");
    newCurrency = $switcher.val();
    if (newCurrency === null) {
      newCurrency = Theme.currency;
    }
    ref = $("span.money");
    for (i = 0, len = ref.length; i < len; i++) {
      money = ref[i];
      $(money).html($(money).attr("data-currency-" + Theme.currency));
      $(money).attr("data-currency", Theme.currency);
    }
    Currency.convertAll(Theme.currency, newCurrency);
    Currency.currentCurrency = newCurrency;
    Currency.cookie.write(newCurrency);
    return this.$(".selected-currency").text(Currency.currentCurrency);
  };

  CurrencyView.prototype.moveCurrencyConverter = function() {
    var $currencyWrapper;
    $currencyWrapper = $('.currency-wrapper');
    if (window.ThemeUtils.isMedium()) {
      return $currencyWrapper.detach().insertAfter('.navigation-menu').addClass('mobile-currency-wrapper');
    } else {
      return $currencyWrapper.detach().removeClass('mobile-currency-wrapper').appendTo('[data-header-currency-switcher]');
    }
  };

  return CurrencyView;

})(Backbone.View);


/* Dynamic sections */

window.HomeSlideshowView = (function(superClass) {
  extend(HomeSlideshowView, superClass);

  function HomeSlideshowView() {
    return HomeSlideshowView.__super__.constructor.apply(this, arguments);
  }

  HomeSlideshowView.prototype.initialize = function() {
    this.$slideshow = this.$el;
    this.flickity = null;
    this.slideCount = this.$slideshow.data('slideshow-slides');
    this.autoPlay = false;
    this.autoplayHoverPause = false;
    if (this.$slideshow.is('[data-slideshow-autoplay]')) {
      this.autoPlay = parseInt(this.$slideshow.attr('data-slideshow-autoplay'), 10) * 1000;
      this.autoplayHoverPause = this.$slideshow.is('[data-slideshow-autoplay-hover-pause]');
    }
    return this._setupSlideshow();
  };

  HomeSlideshowView.prototype.unload = function() {
    if (this.flickity) {
      this.flickity.destroy();
      return this.flickity = null;
    }
  };

  HomeSlideshowView.prototype.onBlockSelect = function(event) {
    var $block, slideIndex;
    if (!this.flickity) {
      return;
    }
    $block = $(event.target);
    slideIndex = parseInt($block.data('slide-index'), 10);
    return this.flickity.select(slideIndex, true);
  };

  HomeSlideshowView.prototype._setupSlideshow = function() {
    var slideshowNavigation, slideshowPagination;
    slideshowNavigation = true;
    slideshowPagination = true;
    if (this.slideCount === 1) {
      slideshowNavigation = false;
      slideshowPagination = false;
    }
    return this.flickity = new Flickity(this.$slideshow[0], {
      adaptiveHeight: true,
      autoPlay: this.autoPlay,
      cellSelector: '[data-slideshow-slide]',
      imagesLoaded: true,
      pageDots: slideshowPagination,
      pauseAutoPlayOnHover: this.autoplayHoverPause,
      prevNextButtons: slideshowNavigation,
      resize: true,
      wrapAround: true
    });
  };

  return HomeSlideshowView;

})(Backbone.View);

window.ThemeUtils = {
  breakpoints: {
    xSmall: 540,
    small: 770,
    medium: 1020,
    large: 1280
  },
  extend: function() {
    var dest, i, k, len, obj, objs, v;
    dest = arguments[0], objs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = 0, len = objs.length; i < len; i++) {
      obj = objs[i];
      for (k in obj) {
        v = obj[k];
        dest[k] = v;
      }
    }
    return dest;
  },
  windowWidth: function() {
    return window.innerWidth || this.window.width();
  },
  isSmall: function() {
    return this.windowWidth() <= this.breakpoints.small;
  },
  isMedium: function() {
    return this.windowWidth() <= this.breakpoints.medium;
  },
  debounce: function(func, wait, immediate) {
    var timeout;
    timeout = null;
    return function() {
      var args, callNow, context, later;
      context = this;
      args = arguments;
      later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  },
  unique: function(array) {
    var i, key, output, ref, results, value;
    output = {};
    for (key = i = 0, ref = array.length; 0 <= ref ? i < ref : i > ref; key = 0 <= ref ? ++i : --i) {
      output[array[key]] = array[key];
    }
    results = [];
    for (key in output) {
      value = output[key];
      results.push(value);
    }
    return results;
  },
  scrollTarget: function($el) {
    if (!($el instanceof jQuery)) {
      $el = $($el);
    }
    return $('html, body').animate({
      scrollTop: $el.offset().top
    }, 500, 'linear');
  },
  inViewport: function(el, direction) {
    var inViewportH, inViewportV, rect, viewportHeight, viewportWidth;
    if (direction == null) {
      direction = 'both';
    }
    if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
    }
    rect = el.getBoundingClientRect();
    if (document.documentElement.clientWidth < window.innerWidth) {
      viewportWidth = document.documentElement.clientWidth;
    } else {
      viewportWidth = window.innerHeight;
    }
    if (document.documentElement.clientHeight < window.innerHeight) {
      viewportHeight = document.documentElement.clientHeight;
    } else {
      viewportHeight = window.innerHeight;
    }
    inViewportH = rect.right >= 0 && rect.left <= viewportWidth;
    inViewportV = rect.bottom >= 0 && rect.top <= viewportHeight;
    switch (direction) {
      case 'horizontal':
        return inViewportH;
      case 'vertical':
        return inViewportV;
      case 'both':
        return inViewportV && inViewportH;
    }
  },

  /*
      Resize Flickity slider to tallest cell in viewport
   */
  flickityResize: function(flickity) {
    var $viewport, cell, height, heights, i, len, ref;
    $viewport = $(flickity.viewport);
    heights = [];
    ref = flickity.cells;
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (this.inViewport(cell.element, 'horizontal')) {
        heights.push($(cell.element).outerHeight(true));
      }
    }
    height = Math.max.apply(null, heights);
    return $viewport.height(height);
  }
};

window.ModalView = (function(superClass) {
  extend(ModalView, superClass);

  function ModalView() {
    return ModalView.__super__.constructor.apply(this, arguments);
  }

  ModalView.prototype.events = {
    "click": "close",
    "click [data-modal-close]": "close"
  };

  ModalView.prototype.initialize = function(options) {
    var callbacks, defaultCallbacks;
    if (options == null) {
      options = {};
    }
    callbacks = options.callbacks || {};
    this.$body = $(document.body);
    this.$window = $(window);
    this.$modalInner = this.$el.find('[data-modal-inner]');
    this.$contents = this.$el.find('[data-modal-contents]');
    this.mobileFriendly = this.$el.attr('data-modal-mobile-friendly') != null;
    this.selectors = {
      open: 'modal-opened',
      visible: 'modal-visible',
      active: 'modal-active',
      scrollLock: 'scroll-locked'
    };
    defaultCallbacks = {
      onOpen: (function(_this) {
        return function() {
          return {};
        };
      })(this),
      onClose: (function(_this) {
        return function() {
          return {};
        };
      })(this)
    };
    return this.callbacks = $.extend({}, defaultCallbacks, callbacks);
  };


  /*
      Manually open a modal.
   */

  ModalView.prototype.open = function() {
    this.$el.addClass(this.selectors.open);
    this.$window.on('resize.modal', (function(_this) {
      return function() {
        return _this._resize();
      };
    })(this));
    return this.callbacks.onOpen({
      $modal: this.$el,
      $contents: this.$contents
    });
  };


  /*
      Close modal, and clean up
   */

  ModalView.prototype.close = function() {
    this.$el.removeClass(this.selectors.active).removeClass(this.selectors.visible).removeClass(this.selectors.open);
    this.$body.removeClass(this.selectors.scrollLock);
    this.$contents.html('');
    this.callbacks.onClose();
    this.$window.off('resize.modal');
    return this.undelegateEvents();
  };


  /*
      Make a modal visible after content has been added
   */

  ModalView.prototype.showModal = function() {
    this.$body.addClass(this.selectors.scrollLock);
    return this.$contents.imagesLoaded((function(_this) {
      return function() {
        _this._position();
        return _this.$el.addClass(_this.selectors.visible).one('trend', function() {
          return _this.$el.addClass(_this.selectors.active);
        });
      };
    })(this));
  };

  ModalView.prototype._resize = function() {
    var windowWidth;
    this._position();
    if (!this.mobileFriendly) {
      windowWidth = window.ThemeUtils.windowWidth();
      if (windowWidth > window.ThemeUtils.breakpoints.small) {
        return;
      }
      return this.close();
    }
  };


  /*
      Center modal vertically and horizontally
   */

  ModalView.prototype._position = function() {
    return this.$modalInner.css({
      marginTop: -(this.$modalInner.outerHeight() / 2),
      marginLeft: -(this.$modalInner.outerWidth() / 2)
    });
  };

  return ModalView;

})(Backbone.View);

MasonryVideo = (function() {
  function MasonryVideo($el, event) {
    var $modal, $target, modalID;
    this.$el = $el;
    this.modal = null;
    $target = $(event.currentTarget);
    modalID = $target.attr('data-masonry-video');
    $modal = this.$el.find("[data-modal-id=" + modalID + "]");
    this.modal = new ModalView({
      el: $modal,
      callbacks: {
        onOpen: (function(_this) {
          return function($els) {
            return _this._open($els);
          };
        })(this),
        onClose: (function(_this) {
          return function() {
            return _this._close();
          };
        })(this)
      }
    });
    this.modal.open();
  }

  MasonryVideo.prototype.remove = function() {
    if (this.modal) {
      return this.modal.close();
    }
  };

  MasonryVideo.prototype._open = function($els) {
    var $contents, $modal, $videoContents, $videoJson;
    $modal = $els.$modal, $contents = $els.$contents;
    $videoJson = $modal.find('[data-masonry-video]');
    try {
      $videoContents = $(JSON.parse($videoJson.text()));
    } catch (error1) {
      return console.warn('Unable to parse contents of video');
    }
    $contents.html($videoContents).fitVids();
    return this.modal.showModal();
  };

  MasonryVideo.prototype._close = function() {
    return this.modal = null;
  };

  return MasonryVideo;

})();

window.HomeMasonryView = (function(superClass) {
  extend(HomeMasonryView, superClass);

  function HomeMasonryView() {
    this._masonryVideo = bind(this._masonryVideo, this);
    this._masonryLayout = bind(this._masonryLayout, this);
    return HomeMasonryView.__super__.constructor.apply(this, arguments);
  }

  HomeMasonryView.prototype.events = {
    'click [data-masonry-url]': '_redirectMasonryFeatures',
    'click [data-masonry-video]': '_masonryVideo'
  };

  HomeMasonryView.prototype.initialize = function() {
    this.masonryVideo = null;
    this.$window = $(window);
    this.initializedClass = 'masonry-initialized';
    return this._validate();
  };

  HomeMasonryView.prototype.update = function($el) {
    this.$el = $el;
    return this._validate();
  };

  HomeMasonryView.prototype.prepareRemove = function() {
    var ref;
    if ((ref = this.masonryVideo) != null) {
      ref.remove();
    }
    return this.$window.off('resize.home-masonry');
  };

  HomeMasonryView.prototype._validate = function() {
    var isInitialized;
    this.$masonry = this.$el;
    isInitialized = this.$el.hasClass(this.initializedClass);
    this._bindEvents(isInitialized);
    return this._masonryLayout();
  };

  HomeMasonryView.prototype._bindEvents = function(isInitialized) {
    if (isInitialized) {
      return;
    }
    return this.$window.on('resize.home-masonry', window.ThemeUtils.debounce(this._masonryLayout, 10));
  };

  HomeMasonryView.prototype._masonryLayout = function() {
    if (this.$masonry.hasClass('home-masonry-feature-count-4') || this.$masonry.hasClass('home-masonry-feature-count-5') || this.$masonry.hasClass('home-masonry-feature-count-6')) {
      this._positionMasonryFeatures();
    }
    if (!window.ThemeUtils.isMedium() && !this.$masonry.hasClass('home-masonry-feature-count-1')) {
      this._setMasonryFeatureHeight();
    }
    return this._positionMasonryFeatureText();
  };

  HomeMasonryView.prototype._positionMasonryFeatures = function() {
    var bumpFeature, containerWidth, offset;
    if (this.$masonry.hasClass('home-masonry-feature-count-4') || this.$masonry.hasClass('home-masonry-feature-count-5')) {
      bumpFeature = this.$masonry.find('.home-masonry-feature-3');
    } else if (this.$masonry.hasClass('home-masonry-feature-count-6')) {
      bumpFeature = this.$masonry.find('.home-masonry-feature-4');
    }
    containerWidth = this.$masonry.outerWidth();
    offset = -(containerWidth * 0.074);
    bumpFeature.css({
      'top': offset
    });
    return this.$masonry.css({
      'marginBottom': offset
    });
  };

  HomeMasonryView.prototype._setMasonryFeatureHeight = function() {
    return this.$masonry.imagesLoaded((function(_this) {
      return function() {
        var feature, featureAspect, featureFigure, featureFigureDiff, featureWidth, height, i, image, imageAspect, len, marginBottom, preciseHeight, ref, results, width;
        ref = _this.$masonry.children('.home-masonry-feature');
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          feature = ref[i];
          feature = $(feature);
          height = feature.outerHeight(false);
          preciseHeight = feature[0].getBoundingClientRect().height;
          marginBottom = feature.css('marginBottom').replace('px', '');
          width = feature.outerWidth();
          featureFigure = feature.children('figure');
          featureWidth = featureFigure.outerWidth();
          featureFigureDiff = width / featureWidth;
          featureAspect = (height / width) * 100;
          feature.children('figure').css({
            'height': preciseHeight + "px"
          });
          image = feature.find('img, .home-masonry-feature-placeholder');
          image.css({
            'height': 'auto',
            'width': 'auto'
          });
          imageAspect = (image.height() / image.width()) * 100;
          if (imageAspect < featureAspect) {
            results.push(image.height(feature.children('figure').outerHeight()).css({
              'marginLeft': -((image.width() - width) / 2)
            }));
          } else {
            results.push(image.width(feature.children('figure').outerWidth()).css({
              'marginTop': -((image.height() - height) / 2)
            }));
          }
        }
        return results;
      };
    })(this));
  };

  HomeMasonryView.prototype._redirectMasonryFeatures = function(e) {
    var $target, url;
    $target = $(e.currentTarget);
    if (!$target.parents(this.$masonry).length) {
      return;
    }
    url = $target.data('masonry-url');
    if (url !== '') {
      return window.location = url;
    }
  };

  HomeMasonryView.prototype._positionMasonryFeatureText = function() {
    var feature, i, len, ref, results, textHeight, textWidth;
    ref = $('.home-masonry-feature-text', this.$masonry);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      feature = ref[i];
      feature = $(feature);
      textHeight = feature.height();
      textWidth = feature.outerWidth();
      results.push(feature.css({
        'marginTop': -(textHeight / 2),
        'marginLeft': -(textWidth / 2)
      }));
    }
    return results;
  };

  HomeMasonryView.prototype._masonryVideo = function(event) {
    return this.masonryVideo = new MasonryVideo(this.$el, event);
  };

  return HomeMasonryView;

})(Backbone.View);

window.HomeMasonryAlternativeView = (function(superClass) {
  extend(HomeMasonryAlternativeView, superClass);

  function HomeMasonryAlternativeView() {
    this._masonryVideo = bind(this._masonryVideo, this);
    this._masonryLayout = bind(this._masonryLayout, this);
    return HomeMasonryAlternativeView.__super__.constructor.apply(this, arguments);
  }

  HomeMasonryAlternativeView.prototype.events = {
    'click [data-masonry-url]': '_redirectMasonryFeatures',
    'click [data-masonry-video]': '_masonryVideo'
  };

  HomeMasonryAlternativeView.prototype.initialize = function() {
    this.$window = $(window);
    this.masonryVideo = null;
    this.initializedClass = 'masonry-initialized';
    return this._validate();
  };

  HomeMasonryAlternativeView.prototype.update = function($el) {
    this.$el = $el;
    return this._validate();
  };

  HomeMasonryAlternativeView.prototype.prepareRemove = function() {
    var ref;
    if ((ref = this.masonryVideo) != null) {
      ref.remove();
    }
    return this.$window.off('resize.home-masonry');
  };

  HomeMasonryAlternativeView.prototype._validate = function() {
    var isInitialized;
    this.$masonry = this.$el;
    isInitialized = this.$el.hasClass(this.initializedClass);
    this._bindEvents(isInitialized);
    return this._masonryLayout();
  };

  HomeMasonryAlternativeView.prototype._bindEvents = function(isInitialized) {
    if (isInitialized) {
      return;
    }
    return this.$window.on('resize.home-masonry', window.ThemeUtils.debounce(this._masonryLayout, 10));
  };

  HomeMasonryAlternativeView.prototype._masonryLayout = function() {
    if (!window.ThemeUtils.isMedium()) {
      this.setupAlternativeMasonryFeatures('desktop');
    } else {
      this.setupAlternativeMasonryFeatures('mobile');
    }
    return this._positionMasonryFeatureText();
  };

  HomeMasonryAlternativeView.prototype._redirectMasonryFeatures = function(e) {
    var $target, url;
    $target = $(e.currentTarget);
    if (!$target.parents(this.$masonry).length) {
      return;
    }
    url = $target.data('masonry-url');
    if (url !== '') {
      return window.location = url;
    }
  };

  HomeMasonryAlternativeView.prototype._positionMasonryFeatureText = function() {
    var feature, i, len, ref, results, textHeight, textWidth;
    ref = $('.home-masonry-feature-text', this.$masonry);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      feature = ref[i];
      feature = $(feature);
      textHeight = feature.height();
      textWidth = feature.outerWidth();
      results.push(feature.css({
        'marginTop': -(textHeight / 2),
        'marginLeft': -(textWidth / 2)
      }));
    }
    return results;
  };

  HomeMasonryAlternativeView.prototype.setupAlternativeMasonryFeatures = function(layout) {
    var windowHeight;
    this.masonryFeaturesContainer = this.$masonry;
    this.masonryFeatures = this.$('.home-masonry-feature');
    windowHeight = document.documentElement.clientHeight;
    if (layout === 'desktop') {
      this.masonryFeaturesContainer.height(windowHeight);
      this.masonryFeatures.removeClass('mobile natural');
      if (this.masonryFeaturesContainer.hasClass('home-masonry-feature-count-1') || this.masonryFeaturesContainer.hasClass('home-masonry-feature-count-2') || this.masonryFeaturesContainer.hasClass('home-masonry-feature-count-3')) {
        this.masonryFeatures.css({
          'height': '100%'
        });
      } else if (this.masonryFeaturesContainer.hasClass('home-masonry-feature-count-4')) {
        this.$('.home-masonry-feature-1, .home-masonry-feature-4').css({
          'height': windowHeight * 0.45
        });
        this.$('.home-masonry-feature-2, .home-masonry-feature-3').css({
          'height': windowHeight * 0.55
        });
        this.$('.home-masonry-feature-3').css({
          'marginTop': -windowHeight * 0.1
        });
      } else if (this.masonryFeaturesContainer.hasClass('home-masonry-feature-count-5')) {
        this.$('.home-masonry-feature-1, .home-masonry-feature-4, .home-masonry-feature-5').css({
          'height': windowHeight * 0.45
        });
        this.$('.home-masonry-feature-2, .home-masonry-feature-3').css({
          'height': windowHeight * 0.55
        });
        this.$('.home-masonry-feature-3').css({
          'marginTop': -windowHeight * 0.1
        });
      } else if (this.masonryFeaturesContainer.hasClass('home-masonry-feature-count-6')) {
        this.$('.home-masonry-feature-1, .home-masonry-feature-5, .home-masonry-feature-6').css({
          'height': windowHeight * 0.45
        });
        this.$('.home-masonry-feature-2, .home-masonry-feature-3, .home-masonry-feature-4').css({
          'height': windowHeight * 0.55
        });
        this.$('.home-masonry-feature-4').css({
          'marginTop': -windowHeight * 0.1
        });
      }
      return this.positionMasonryFeatures();
    } else if (layout === 'mobile') {
      this.masonryFeaturesContainer.css({
        'height': 'auto'
      });
      this.masonryFeatures.addClass('mobile natural');
      return $(document.body).imagesLoaded((function(_this) {
        return function() {
          var containerHeight;
          containerHeight = _this.masonryFeaturesContainer.height();
          if (windowHeight > containerHeight) {
            _this.masonryFeatures.removeClass('natural').css({
              'height': windowHeight / _this.$('.enable-mobile-true').length
            });
            return _this.positionMasonryFeatures();
          } else {
            return _this.masonryFeatures.children('figure').css({
              'marginLeft': 0
            });
          }
        };
      })(this));
    }
  };

  HomeMasonryAlternativeView.prototype.positionMasonryFeatures = function() {
    return $(document.body).imagesLoaded((function(_this) {
      return function() {
        var feature, featureAspect, figure, figureAspect, height, i, len, preciseHeight, ref, results, width;
        ref = _this.masonryFeatures;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          feature = ref[i];
          feature = $(feature);
          height = feature.outerHeight(false);
          preciseHeight = feature[0].getBoundingClientRect().height;
          width = feature.outerWidth();
          featureAspect = height / width;
          figure = feature.children('figure');
          figure.css({
            'height': 'auto',
            'width': 'auto',
            'marginLeft': 0,
            'marginTop': 0
          });
          figureAspect = figure.height() / figure.width();
          if (figureAspect < featureAspect) {
            results.push(figure.width(height / figureAspect).css({
              'marginLeft': -((figure.width() - width) / 2)
            }));
          } else {
            results.push(figure.css({
              'marginTop': -((figure.height() - height) / 2)
            }));
          }
        }
        return results;
      };
    })(this));
  };

  HomeMasonryAlternativeView.prototype._masonryVideo = function(event) {
    return this.masonryVideo = new MasonryVideo(this.$el, event);
  };

  return HomeMasonryAlternativeView;

})(Backbone.View);

window.HomeCollectionsView = (function(superClass) {
  extend(HomeCollectionsView, superClass);

  function HomeCollectionsView() {
    return HomeCollectionsView.__super__.constructor.apply(this, arguments);
  }

  HomeCollectionsView.prototype.events = {
    "click .home-collection-overlay-wrapper": "_redirectCollection"
  };

  HomeCollectionsView.prototype.initialize = function() {
    this.initializedClass = 'collection-initialized';
    this._bindEvents();
    return this._validate();
  };

  HomeCollectionsView.prototype._validate = function() {
    var isInitialized;
    this.$collectionsContainer = this.$("[data-collections]", this.$el);
    isInitialized = this.$el.hasClass(this.initializedClass);
    return this._setupCollections();
  };

  HomeCollectionsView.prototype.update = function($el) {
    this.$el = $el;
    return this._validate();
  };

  HomeCollectionsView.prototype.remove = function() {
    HomeCollectionsView.__super__.remove.apply(this, arguments);
    return $(window).off("resize.blog-view");
  };

  HomeCollectionsView.prototype.onBlockSelect = function(event) {
    return this._validate();
  };

  HomeCollectionsView.prototype.onBlockDeselect = function(event) {
    return this._validate();
  };

  HomeCollectionsView.prototype._bindEvents = function() {
    return $(window).on("resize.collections-view", (function(_this) {
      return function() {
        _this._setupCollections();
        if (!Modernizr.csstransforms) {
          return _this._centerCollectionText();
        }
      };
    })(this));
  };

  HomeCollectionsView.prototype._setupCollections = function() {
    var collectionHeight, featuredCollectionImage;
    collectionHeight = 10000;
    featuredCollectionImage = this.$(".home-collection-image img, .home-collection-image svg");
    featuredCollectionImage.css({
      'height': 'auto'
    });
    return this.$(".home-collections-content").imagesLoaded().done((function(_this) {
      return function() {
        var collectionImage, i, len;
        for (i = 0, len = featuredCollectionImage.length; i < len; i++) {
          collectionImage = featuredCollectionImage[i];
          if (collectionImage.getBoundingClientRect().height < collectionHeight) {
            collectionHeight = collectionImage.getBoundingClientRect().height;
          }
        }
        featuredCollectionImage.css({
          'height': ''
        });
        return _this.$(".home-collection-image").height(collectionHeight);
      };
    })(this));
  };

  HomeCollectionsView.prototype._centerCollectionText = function() {
    var collectionText, i, len, ref, results, textHeight, textWidth;
    ref = this.$(".home-collection-overlay", this.$collectionsContainer);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      collectionText = ref[i];
      collectionText = $(collectionText);
      textHeight = collectionText.height();
      textWidth = collectionText.outerWidth();
      results.push(collectionText.css({
        "marginTop": -(textHeight / 2),
        "marginLeft": -(textWidth / 2)
      }));
    }
    return results;
  };

  HomeCollectionsView.prototype._redirectCollection = function(e) {
    var url;
    if (!$(e.target).parents(this.$collectionsContainer).length) {

    } else {
      url = $(e.target).data("url");
      if (url !== "") {
        return window.location = url;
      }
    }
  };

  return HomeCollectionsView;

})(Backbone.View);

MasonryGrid = (function() {
  function MasonryGrid(options) {
    var defaultSettings;
    this.$el = options.$el;
    defaultSettings = {
      itemSelector: '[data-masonry-item]',
      columnWidth: '[data-masonry-sizer]',
      gutter: 0,
      percentPosition: false
    };
    this.settings = window.ThemeUtils.extend(defaultSettings, options.settings);
    this.$masonry = this.$el.masonry(this.settings);
    this.$masonry.imagesLoaded().progress((function(_this) {
      return function() {
        return _this.$masonry.masonry('layout');
      };
    })(this));
  }

  MasonryGrid.prototype.unload = function() {
    return this.$masonry.masonry('destroy');
  };

  return MasonryGrid;

})();

window.ProductMasonryLayoutView = (function(superClass) {
  extend(ProductMasonryLayoutView, superClass);

  function ProductMasonryLayoutView() {
    this._initLayout = bind(this._initLayout, this);
    return ProductMasonryLayoutView.__super__.constructor.apply(this, arguments);
  }

  ProductMasonryLayoutView.prototype.initialize = function() {
    this.$window = $(window);
    this.selectors = {
      gallery: {
        el: '[data-masonry-gallery]',
        itemSelector: '.product-image',
        columnWidth: '[data-masonry-image-sizer]'
      },
      relatedProducts: {
        el: '[data-masonry-products]',
        itemSelector: '.product-list-item',
        columnWidth: '[data-masonry-products-sizer]'
      }
    };
    this.masonry = {
      gallery: null,
      relatedProducts: null
    };
    this.flickity = {
      gallery: null,
      relatedProducts: null
    };
    this.$gallery = this.$(this.selectors.gallery.el);
    this.$relatedProducts = $(this.selectors.relatedProducts.el);
    this.hasGallery = this.$gallery.length;
    this.hasRelatedProducts = this.$relatedProducts.length;
    this._initLayout();
    return this._bindEvents();
  };

  ProductMasonryLayoutView.prototype.prepareRemove = function() {
    this.$window.off('resize.product-masonry-layout');
    this.$gallery.off('product-masonry-layout');
    this.$relatedProducts.off('product-masonry-layout');
    if (this.flickity) {
      this._destroyFlickity();
    }
    if (this.masonry) {
      return this._destroyMasonry();
    }
  };

  ProductMasonryLayoutView.prototype._bindEvents = function() {
    return this.$window.on('resize.product-masonry-layout', window.ThemeUtils.debounce(this._initLayout, 100));
  };

  ProductMasonryLayoutView.prototype._initLayout = function() {
    if (window.ThemeUtils.isSmall()) {
      return this._initMobile();
    } else {
      return this._initDesktop();
    }
  };

  ProductMasonryLayoutView.prototype._initMobile = function() {
    this._destroyMasonry();
    return this._initFlickity();
  };

  ProductMasonryLayoutView.prototype._initDesktop = function() {
    this._destroyFlickity();
    return this._initMasonry();
  };

  ProductMasonryLayoutView.prototype._initFlickity = function() {
    if (this.hasGallery && !this.flickity.gallery) {
      this._galleryReset();
      this.flickity.gallery = new Flickity(this.$gallery[0], {
        cellAlign: 'left',
        cellSelector: this.selectors.gallery.itemSelector,
        contain: false,
        percentPosition: false,
        prevNextButtons: false,
        pageDots: false,
        imagesLoaded: true,
        setGallerySize: false
      });
      this._flickityEvents({
        $el: this.$gallery,
        flickity: this.flickity.gallery
      });
    }
    if (this.hasRelatedProducts && !this.flickity.relatedProducts) {
      this._relatedProductsReset();
      this.flickity.relatedProducts = new Flickity(this.$relatedProducts[0], {
        cellAlign: 'left',
        cellSelector: this.selectors.relatedProducts.itemSelector,
        contain: true,
        prevNextButtons: false,
        pageDots: false,
        imagesLoaded: true,
        setGallerySize: false
      });
      return this._flickityEvents({
        $el: this.$relatedProducts,
        flickity: this.flickity.relatedProducts
      });
    }
  };

  ProductMasonryLayoutView.prototype._destroyFlickity = function() {
    if (this.flickity.gallery) {
      this.flickity.gallery.destroy();
      this.flickity.gallery = null;
      this.$window.off('resize.product-images-flickity');
    }
    if (this.flickity.relatedProducts) {
      this.flickity.relatedProducts.destroy();
      return this.flickity.relatedProducts = null;
    }
  };

  ProductMasonryLayoutView.prototype._initMasonry = function() {
    if (this.hasGallery && !this.masonry.gallery) {
      this._galleryReset();
      this.masonry.gallery = new MasonryGrid({
        $el: this.$gallery,
        settings: {
          itemSelector: this.selectors.gallery.itemSelector,
          columnWidth: this.selectors.gallery.columnWidth
        }
      });
    }
    if (this.hasRelatedProducts && !this.masonry.relatedProducts) {
      this._relatedProductsReset();
      return this.masonry.relatedProducts = new MasonryGrid({
        $el: this.$relatedProducts,
        settings: {
          itemSelector: this.selectors.relatedProducts.itemSelector,
          columnWidth: this.selectors.relatedProducts.columnWidth
        }
      });
    }
  };

  ProductMasonryLayoutView.prototype._destroyMasonry = function() {
    if (this.masonry.gallery) {
      this.masonry.gallery.unload();
      this.masonry.gallery = null;
    }
    if (this.masonry.relatedProducts) {
      this.masonry.relatedProducts.unload();
      return this.masonry.relatedProducts = null;
    }
  };

  ProductMasonryLayoutView.prototype._galleryReset = function() {
    return this.$gallery.find(this.selectors.gallery.itemSelector).css('');
  };

  ProductMasonryLayoutView.prototype._relatedProductsReset = function() {
    return this.$relatedProducts.find(this.selectors.relatedProducts.itemSelector).css('');
  };

  ProductMasonryLayoutView.prototype._flickityEvents = function(options) {
    var $el, flickity;
    $el = options.$el, flickity = options.flickity;
    flickity.on('cellSelect', (function(_this) {
      return function() {
        return $el.trigger('product-masonry-layout');
      };
    })(this));
    flickity.on('settle', (function(_this) {
      return function() {
        return $el.trigger('product-masonry-layout');
      };
    })(this));
    $el.on('product-masonry-layout', (function(_this) {
      return function() {
        return window.ThemeUtils.flickityResize(flickity);
      };
    })(this));
    $el.trigger('product-masonry-layout');
    return this.$window.on('resize.product-images-flickity', window.ThemeUtils.debounce((function(_this) {
      return function() {
        return $el.trigger('product-masonry-layout');
      };
    })(this), 10));
  };

  return ProductMasonryLayoutView;

})(Backbone.View);

window.LinkedOptions = (function() {
  function LinkedOptions(options) {
    this.options = options;
    this._init();
  }

  LinkedOptions.prototype._init = function() {
    return this._mapVariants(this.options.productJSON);
  };

  LinkedOptions.prototype._getCurrent = function(optionIndex) {
    var key, option1, option2, selector;
    if (this.options.type === 'select') {
      switch (optionIndex) {
        case 0:
          key = 'root';
          selector = this.options.$selector.eq(0);
          break;
        case 1:
          key = this.options.$selector.eq(0).val();
          selector = this.options.$selector.eq(1);
          break;
        case 2:
          key = (this.options.$selector.eq(0).val()) + " / " + (this.options.$selector.eq(1).val());
          selector = this.options.$selector.eq(2);
      }
    }
    if (this.options.type === 'radio') {
      switch (optionIndex) {
        case 0:
          key = 'root';
          selector = this.options.$selector.filter('[data-option-index=0]').filter(':checked');
          break;
        case 1:
          key = this.options.$selector.filter('[data-option-index=0]').filter(':checked').val();
          selector = this.options.$selector.filter('[data-option-index=1]').filter(':checked');
          break;
        case 2:
          option1 = this.options.$selector.filter('[data-option-index=0]').filter(':checked').val();
          option2 = this.options.$selector.filter('[data-option-index=1]').filter(':checked').val();
          key = option1 + " / " + option2;
          selector = this.options.$selector.filter('[data-option-index=2]').filter(':checked');
      }
    }
    return {
      key: key,
      selector: selector
    };
  };

  LinkedOptions.prototype._updateOptions = function(optionIndex, optionsMap) {
    var $nextOption, $option, $selector, $selectorOptions, availableOptions, i, initialValue, j, key, len, len1, nextSelector, option, ref, selector, updateSelected;
    nextSelector = optionIndex + 1;
    updateSelected = false;
    ref = this._getCurrent(optionIndex), key = ref.key, selector = ref.selector;
    availableOptions = optionsMap[key] || [];
    if (this.options.type === 'select') {
      $selector = this.options.$productForm.find(selector);
      initialValue = $selector.val();
      $selectorOptions = $selector.find('option');
      for (i = 0, len = $selectorOptions.length; i < len; i++) {
        option = $selectorOptions[i];
        $option = $(option);
        if (availableOptions.indexOf(option.value) === -1) {
          if (option.selected) {
            updateSelected = true;
          }
          $option.prop('disabled', true).prop('selected', false);
        } else {
          $option.prop('disabled', false);
        }
      }
      if (availableOptions.indexOf(initialValue) !== -1) {
        $selector.val(initialValue);
      }
      if (updateSelected) {
        $selectorOptions.filter(':not(:disabled)').eq(0).prop('selected', true);
      }
    }
    if (this.options.type === 'radio') {
      $selector = this.options.$selector.filter("[data-option-index=" + optionIndex + "]");
      for (j = 0, len1 = $selector.length; j < len1; j++) {
        option = $selector[j];
        $option = $(option);
        if (availableOptions.indexOf(option.value) === -1) {
          if (option.checked) {
            updateSelected = true;
          }
          $option.prop('disabled', true).prop('checked', false);
        } else {
          $option.prop('disabled', false);
        }
      }
      if (updateSelected) {
        $selector.filter(':not(:disabled)').eq(0).attr('checked', true).trigger('click');
      }
    }
    $selector.trigger('change');
    $nextOption = this.options.$selector.filter("[data-option-index=" + nextSelector + "]");
    if ($nextOption.length !== 0) {
      return this._updateOptions(nextSelector, optionsMap);
    }
  };

  LinkedOptions.prototype._mapVariants = function(product) {
    var i, key, len, optionsMap, ref, variant;
    optionsMap = [];
    optionsMap['root'] = [];
    ref = product.variants;
    for (i = 0, len = ref.length; i < len; i++) {
      variant = ref[i];
      if (variant.available) {
        optionsMap['root'].push(variant.option1);
        optionsMap['root'] = window.ThemeUtils.unique(optionsMap['root']);
        if (product.options.length > 1) {
          key = variant.option1;
          optionsMap[key] = optionsMap[key] || [];
          optionsMap[key].push(variant.option2);
          optionsMap[key] = window.ThemeUtils.unique(optionsMap[key]);
        }
        if (product.options.length > 2) {
          key = variant.option1 + " / " + variant.option2;
          optionsMap[key] = optionsMap[key] || [];
          optionsMap[key].push(variant.option3);
          optionsMap[key] = window.ThemeUtils.unique(optionsMap[key]);
        }
      }
    }
    this._updateOptions(0, optionsMap);
    return this.options.$selector.on('change', (function(_this) {
      return function(event) {
        var index, nextSelector;
        index = parseInt($(event.currentTarget).attr('data-option-index'), 10);
        nextSelector = index + 1;
        return _this._updateOptions(nextSelector, optionsMap);
      };
    })(this));
  };

  return LinkedOptions;

})();

window.VariantHelper = (function() {
  function VariantHelper(options) {
    var defaultOptions, isShopify;
    defaultOptions = {
      $addToCartButton: null,
      $priceFields: null,
      $productForm: null,
      $productThumbnails: null,
      $selector: null,
      type: 'select',
      productJSON: null,
      productSettings: null
    };
    this.options = window.ThemeUtils.extend(defaultOptions, options);
    this.$body = $(document.body);
    this.linkedOptions = null;
    this.enableHistory = false;
    this.$masterSelect = this.options.$productForm.find("#product-select-" + this.options.formID);
    isShopify = window.Shopify && window.Shopify.preview_host;
    if (window.history && window.history.replaceState && this.options.productSettings.enableHistory && !isShopify) {
      this.enableHistory = true;
    }
    this._init();
    this._bindEvents();
  }

  VariantHelper.prototype._init = function() {
    var i, len, ref, select;
    if (this.options.type === 'select') {
      ref = this.options.$selector;
      for (i = 0, len = ref.length; i < len; i++) {
        select = ref[i];
        this._setSelectLabel(null, $(select));
      }
    }
    if (this.options.productSettings.linkedOptions) {
      this.linkedOptions = new LinkedOptions(this.options);
    }
    return this._updateCurrency();
  };

  VariantHelper.prototype._bindEvents = function() {
    return this.options.$selector.on('change.variant-helper', (function(_this) {
      return function(event) {
        return _this._variantChange(event);
      };
    })(this));
  };

  VariantHelper.prototype.unload = function() {
    return this.options.$selector.off('.variant-helper');
  };

  VariantHelper.prototype._setSelectLabel = function(event, $target) {
    var selectedOption;
    if (event == null) {
      event = null;
    }
    if ($target == null) {
      $target = false;
    }
    if (!$target) {
      $target = $(event.currentTarget);
    }
    selectedOption = $target.find('option:selected').val();
    return $target.prev('[data-select-text]').find('[data-selected-option]').text(selectedOption);
  };

  VariantHelper.prototype._getCurrentOptions = function() {
    var $inputs, productOptions;
    productOptions = [];
    $inputs = this.options.$selector;
    if (this.options.type === 'radio') {
      $inputs = $inputs.filter(':checked');
    }
    $inputs.each(function(index, element) {
      return productOptions.push($(element).val());
    });
    return productOptions;
  };

  VariantHelper.prototype._getVariantFromOptions = function(productOptions) {
    var foundVariant, i, isMatch, len, ref, variant;
    if (this.options.productJSON.variants == null) {
      return;
    }
    foundVariant = null;
    ref = this.options.productJSON.variants;
    for (i = 0, len = ref.length; i < len; i++) {
      variant = ref[i];
      isMatch = productOptions.every(function(value) {
        return variant.options.indexOf(value) !== -1;
      });
      if (isMatch) {
        foundVariant = variant;
      }
    }
    return foundVariant;
  };

  VariantHelper.prototype._updateMasterSelect = function(variant) {
    var ref;
    if (variant == null) {
      return;
    }
    if ((ref = this.$masterSelect.find("[data-variant-id=" + variant.id + "]")) != null) {
      ref.prop('selected', true);
    }
    return this.$masterSelect.trigger('change');
  };

  VariantHelper.prototype._updatePrice = function(variant) {
    var $addToCartButton, $moneyEl, $priceFields, attribute, i, j, len, len1, priceField, productSettings, ref;
    $addToCartButton = this.options.$addToCartButton;
    $priceFields = this.options.$priceFields;
    productSettings = this.options.productSettings;
    if (variant) {
      for (i = 0, len = $priceFields.length; i < len; i++) {
        priceField = $priceFields[i];
        $moneyEl = $(priceField).children('.money');
        ref = $moneyEl[0].attributes;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          attribute = ref[j];
          if (attribute.name.indexOf("data-") > -1) {
            $moneyEl.attr(attribute.name, "");
          }
        }
      }
      if (variant.available) {
        $addToCartButton.val(productSettings.addToCartText).removeClass('disabled').removeAttr('disabled');
      } else {
        $addToCartButton.val(productSettings.soldOutText).addClass('disabled').attr('disabled', 'disabled');
      }
      if (variant.compare_at_price > variant.price) {
        $priceFields.find('.money:not(.original)').html(Shopify.formatMoney(variant.price, Theme.moneyFormat)).attr("data-currency-" + Theme.currency, Shopify.formatMoney(variant.price, Theme.moneyFormat)).attr("data-currency", Theme.currency);
        $priceFields.find('.original').html(Shopify.formatMoney(variant.compare_at_price, Theme.moneyFormat)).addClass('visible').attr("data-currency-" + Theme.currency, Shopify.formatMoney(variant.compare_at_price, Theme.moneyFormat)).attr("data-currency", Theme.currency);
      } else {
        $priceFields.find('.money').html(Shopify.formatMoney(variant.price, Theme.moneyFormat)).attr("data-currency-" + Theme.currency, Shopify.formatMoney(variant.price, Theme.moneyFormat)).attr("data-currency", Theme.currency);
        $priceFields.find('.original').removeClass('visible').attr("data-currency-" + Theme.currency, Shopify.formatMoney(variant.compare_at_price, Theme.moneyFormat)).attr("data-currency", Theme.currency);
      }
    } else {
      $addToCartButton.val(productSettings.unavailableText).addClass('disabled').attr('disabled', 'disabled');
    }
    return this._updateCurrency();
  };

  VariantHelper.prototype._updateImages = function(variant) {
    var $thumbById, $thumbByIndex, imageId, imagePosition, ref, ref1;
    imageId = variant != null ? (ref = variant.featured_image) != null ? ref.id : void 0 : void 0;
    imagePosition = (variant != null ? (ref1 = variant.featured_image) != null ? ref1.position : void 0 : void 0) - 1;
    $thumbById = this.options.$productThumbnails.filter("[data-image-id='" + imageId + "']");
    $thumbByIndex = this.options.$productThumbnails.filter("[data-image-position='" + imagePosition + "']");
    if ((imageId != null) && $thumbById.length) {
      $thumbById.trigger('click');
    }
    if ((imagePosition != null) && $thumbByIndex.length) {
      return $thumbByIndex.trigger('click');
    }
  };

  VariantHelper.prototype._updateHistory = function(variant) {
    var newUrl, variantUrl;
    if (!(this.enableHistory && (variant != null))) {
      return;
    }
    newUrl = [window.location.protocol, '//', window.location.host, window.location.pathname, '?variant=', variant.id];
    variantUrl = newUrl.join('');
    return window.history.replaceState({
      path: variantUrl
    }, '', variantUrl);
  };

  VariantHelper.prototype._variantChange = function(event) {
    var productOptions, variant;
    if (this.options.type === 'select') {
      this._setSelectLabel(event);
    }
    productOptions = this._getCurrentOptions();
    variant = this._getVariantFromOptions(productOptions);
    this._updateMasterSelect(variant);
    this._updatePrice(variant);
    this._updateImages(variant);
    return this._updateHistory(variant);
  };

  VariantHelper.prototype._updateCurrency = function() {
    if (Theme.currencySwitcher) {
      return $(".currency-switcher").trigger('switch-currency');
    }
  };

  return VariantHelper;

})();

window.ImageZoomView = (function(superClass) {
  extend(ImageZoomView, superClass);

  function ImageZoomView() {
    return ImageZoomView.__super__.constructor.apply(this, arguments);
  }

  ImageZoomView.prototype.events = {
    "prepare-zoom": "prepareZoom",
    "click": "toggleZoom",
    "mouseout .product-zoom": "toggleZoom",
    "mousemove .product-zoom": "zoomImage"
  };

  ImageZoomView.prototype.initialize = function() {
    this.zoomArea = this.$(".product-zoom");
    return this.$el.imagesLoaded((function(_this) {
      return function() {
        return _this.prepareZoom();
      };
    })(this));
  };

  ImageZoomView.prototype.prepareZoom = function() {
    var newImage, photoAreaHeight, photoAreaWidth;
    photoAreaWidth = this.$el.width();
    photoAreaHeight = this.$el.height();
    newImage = new Image();
    $(newImage).on("load", (function(_this) {
      return function() {
        var ratio, ratios;
        _this.zoomImageWidth = newImage.width;
        _this.zoomImageHeight = newImage.height;
        ratios = new Array();
        ratios[0] = _this.zoomImageWidth / photoAreaWidth;
        ratios[1] = _this.zoomImageHeight / photoAreaHeight;
        ratio = Math.max.apply(Math, ratios);
        if (ratio < 1.4) {
          _this.$el.removeClass("zoom-enabled");
        } else {
          _this.$el.addClass("zoom-enabled");
          return _this.zoomArea.css({
            backgroundImage: "url(" + newImage.src + ")"
          });
        }
      };
    })(this));
    return newImage.src = this.$("img").attr("src");
  };

  ImageZoomView.prototype.toggleZoom = function(e) {
    if (this.$el.hasClass("zoom-enabled")) {
      if (e.type === "mouseout") {
        this.zoomArea.removeClass("active");
        return;
      }
      this.zoomArea.toggleClass("active");
      return this.zoomImage(e);
    }
  };

  ImageZoomView.prototype.zoomImage = function(e) {
    var bigImageOffset, bigImageX, bigImageY, mousePositionX, mousePositionY, newBackgroundPosition, ratioX, ratioY, zoomHeight, zoomWidth;
    zoomWidth = this.zoomArea.width();
    zoomHeight = this.zoomArea.height();
    bigImageOffset = this.$el.offset();
    bigImageX = Math.round(bigImageOffset.left);
    bigImageY = Math.round(bigImageOffset.top);
    mousePositionX = e.pageX - bigImageX;
    mousePositionY = e.pageY - bigImageY;
    if (mousePositionX < zoomWidth && mousePositionY < zoomHeight && mousePositionX > 0 && mousePositionY > 0) {
      if (this.zoomArea.hasClass("active")) {
        ratioX = Math.round(mousePositionX / zoomWidth * this.zoomImageWidth - zoomWidth / 2) * -1;
        ratioY = Math.round(mousePositionY / zoomHeight * this.zoomImageHeight - zoomHeight / 2) * -1;
        if (ratioX > 0) {
          ratioX = 0;
        }
        if (ratioY > 0) {
          ratioY = 0;
        }
        if (ratioX < -(this.zoomImageWidth - zoomWidth)) {
          ratioX = -(this.zoomImageWidth - zoomWidth);
        }
        if (ratioY < -(this.zoomImageHeight - zoomHeight)) {
          ratioY = -(this.zoomImageHeight - zoomHeight);
        }
        newBackgroundPosition = ratioX + "px " + ratioY + "px";
        return this.zoomArea.css({
          backgroundPosition: newBackgroundPosition
        });
      }
    }
  };

  return ImageZoomView;

})(Backbone.View);

window.ProductSlideshowView = (function(superClass) {
  extend(ProductSlideshowView, superClass);

  function ProductSlideshowView() {
    return ProductSlideshowView.__super__.constructor.apply(this, arguments);
  }

  ProductSlideshowView.prototype.events = {
    "click .product-thumbnails-navigation-previous, .product-thumbnails-navigation-next": "moveProductThumbnails"
  };

  ProductSlideshowView.prototype.initialize = function() {
    this.isQuickShop = this.$el.parent().hasClass("quick-shop");
    this.productThumbnailsWrapper = this.$(".product-thumbnails-wrapper");
    this.productThumbnails = this.$(".product-thumbnails");
    this.productThumbnail = this.$(".product-thumbnail");
    if (this.$(".product-thumbnails").hasClass("has-side-scroll")) {
      this.setupProductSlideshow();
      return $(window).resize((function(_this) {
        return function() {
          _this.setupProductSlideshow();
          return _this.productThumbnails.css({
            "left": 0
          });
        };
      })(this));
    }
  };

  ProductSlideshowView.prototype.setupProductSlideshow = function() {
    var containerWidth, tallestImageHeight;
    tallestImageHeight = 0;
    containerWidth = 0;
    return this.productThumbnails.imagesLoaded((function(_this) {
      return function() {
        var currentImageHeight, currentImageWidth, i, image, len, ref;
        _this.productThumbnailPadding = parseInt(_this.productThumbnail.css("padding-left"), 10) * 2;
        _this.productThumbnail.width((_this.productThumbnailsWrapper.width() / 4) - _this.productThumbnailPadding);
        ref = _this.productThumbnail;
        for (i = 0, len = ref.length; i < len; i++) {
          image = ref[i];
          currentImageHeight = image.getBoundingClientRect().height;
          currentImageWidth = image.getBoundingClientRect().width;
          if (currentImageHeight > tallestImageHeight) {
            tallestImageHeight = currentImageHeight;
          }
          containerWidth += currentImageWidth;
        }
        _this.productThumbnailsWrapper.height(tallestImageHeight);
        return _this.productThumbnails.width(containerWidth);
      };
    })(this));
  };

  ProductSlideshowView.prototype.moveProductThumbnails = function(e) {
    var containerWidth, currentPosition;
    containerWidth = this.productThumbnailsWrapper.width();
    currentPosition = this.productThumbnails.position().left;
    if ($(e.currentTarget).hasClass("product-thumbnails-navigation-next") && (currentPosition - containerWidth) > -(this.$(".product-thumbnails").outerWidth())) {
      return this.productThumbnails.css({
        "left": currentPosition - containerWidth
      });
    } else if ($(e.target).hasClass("product-thumbnails-navigation-previous") && currentPosition < 0) {
      return this.productThumbnails.css({
        "left": currentPosition + containerWidth
      });
    }
  };

  return ProductSlideshowView;

})(Backbone.View);

window.ProductView = (function(superClass) {
  extend(ProductView, superClass);

  function ProductView() {
    this.setupProductDetails = bind(this.setupProductDetails, this);
    this.scrollFunction = bind(this.scrollFunction, this);
    return ProductView.__super__.constructor.apply(this, arguments);
  }

  ProductView.prototype.events = {
    'click .product-thumbnails img': 'swapProductImage',
    'click .add-to-cart input': 'addToCart'
  };

  ProductView.prototype.initialize = function() {
    this.window = $(window);
    this.zoomView = null;
    this.variantHelpers = null;
    this.productSlideshow = null;
    this.productMasonryLayout = null;
    this.rteViews = [];
    this.selectsViews = [];
    this.useImagesList = this.$el.is('[data-images-list-view]');
    this.useZoom = this.$el.is('[data-zoom]');
    this.useLinkedOptions = this.$el.is('[data-linked-options]');
    this.useAJAX = true;
    this.useMasonry = this.$el.is('[data-product-masonry]');
    Shopify.onError = (function(_this) {
      return function(XMLHttpRequest) {
        return _this.handleErrors(XMLHttpRequest);
      };
    })(this);
    return this.render();
  };

  ProductView.prototype.onSectionUnload = function() {
    var i, j, len, len1, ref, ref1, rte, select;
    if (this.zoomView) {
      this.zoomView.remove();
    }
    if (this.variantHelpers) {
      this.variantHelpers.unload();
    }
    if (this.productSlideshow) {
      this.productSlideshow.remove();
    }
    if (this.productMasonryLayout) {
      this.productMasonryLayout.prepareRemove();
      this.productMasonryLayout.remove();
    }
    ref = this.rteViews;
    for (i = 0, len = ref.length; i < len; i++) {
      rte = ref[i];
      rte.remove();
    }
    ref1 = this.selectsViews;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      select = ref1[j];
      select.remove();
    }
    return this.window.off('.product-images-list');
  };

  ProductView.prototype.render = function() {
    var $productJSON, $productSettings, i, j, len, len1, ref, ref1, rte, select;
    this.isQuickShop = this.$el.hasClass('quick-shop-wrapper');
    this.productId = this.$el.data('product-id');
    this.minimumPriceArea = this.$('.product-price-minimum');
    this.productImages = this.$('.product-images');
    this.mainImage = this.$('.product-main-image img');
    this.productThumbnail = this.$('.product-thumbnail');
    this.productDetailsWrapper = this.$('.product-details-wrapper');
    this.productDetails = this.$('.product-details');
    this.productMessages = this.$('.product-message');
    this.$productForm = this.$('[data-product-form]');
    this.formID = parseInt(this.$productForm.attr('data-product-form'), 10);
    this.productForm = "product-form-" + this.formID;
    this.$productThumbnails = this.$('.product-thumbnails img');
    this.$addToCartButton = this.$('.add-to-cart input');
    this.$priceArea = this.$('.product-price');
    $productJSON = this.$("[data-product-json-" + this.formID + "]");
    $productSettings = this.$("[data-product-settings-" + this.formID + "]");
    if (!$productJSON.length) {
      return;
    }
    this.productJSON = JSON.parse($productJSON.text());
    this.productSettings = JSON.parse($productSettings.text());
    this.$variantDropdowns = this.$("[data-option-select=" + this.formID + "]");
    this.options = this.productJSON.options;
    this.variants = this.productJSON.variants;
    this.setupVariants();
    if (this.useMasonry) {
      this.productMasonryLayout = new ProductMasonryLayoutView({
        el: this.$el
      });
    } else if (this.useImagesList) {
      this.window.on('load.product-images-list resize.product-images-list', window.ThemeUtils.debounce(this.setupProductDetails, 100));
      this.window.on('scroll.product-images-list', window.ThemeUtils.debounce(this.scrollFunction, 10));
    } else {
      this.productSlideshow = new ProductSlideshowView({
        el: this.productImages
      });
    }
    if (this.useZoom && !this.useImagesList) {
      this.zoomView = new ImageZoomView({
        el: this.$('.product-main-image')
      });
    }
    ref = this.$('.rte');
    for (i = 0, len = ref.length; i < len; i++) {
      rte = ref[i];
      this.rteViews.push(new RTEView({
        el: rte
      }));
    }
    ref1 = this.$('select');
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      select = ref1[j];
      if (!select.hasAttribute('data-select-ignore')) {
        this.selectsViews.push(new SelectView({
          el: select
        }));
      } else {
        continue;
      }
    }
    if (Theme.currencySwitcher) {
      return $('.currency-switcher').trigger('switch-currency');
    }
  };

  ProductView.prototype.scrollFunction = function() {
    if (window.innerWidth > 770 && document.documentElement.getBoundingClientRect().height > this.detailsHeight) {
      return this.triggerFixedProductInfo(this.stickyNavHeight, this.detailsWrapperOffset, this.detailsHeight);
    } else {
      return this.productDetails.css({
        'position': 'static'
      });
    }
  };

  ProductView.prototype.setupVariants = function() {
    var dropdownSettings, variantHelperDefaults;
    if (!(this.variants.length > 1)) {
      return;
    }
    variantHelperDefaults = {
      $addToCartButton: this.$addToCartButton,
      $priceFields: this.$priceArea,
      $productForm: this.$productForm,
      $productThumbnails: this.$productThumbnails,
      formID: this.formID,
      productSettings: this.productSettings,
      productJSON: this.productJSON
    };
    if (this.$variantDropdowns.length) {
      dropdownSettings = {
        $selector: this.$variantDropdowns,
        type: 'select'
      };
      dropdownSettings = window.ThemeUtils.extend(variantHelperDefaults, dropdownSettings);
      return this.variantHelpers = new VariantHelper(dropdownSettings);
    }
  };

  ProductView.prototype.swapProductImage = function(e, imageSrc) {
    var newImage;
    this.productThumbnail.removeClass('active');
    if (e) {
      this.$(e.currentTarget).parent().addClass('active');
      newImage = this.$(e.currentTarget).data('high-res');
      return this.$(e.currentTarget).closest(this.$el).find('.product-main-image img').attr('src', newImage).trigger('prepare-zoom');
    } else {
      newImage = imageSrc;
      return this.$('.product-main-image img').attr('src', newImage).trigger('prepare-zoom');
    }
  };

  ProductView.prototype.setupProductDetails = function() {
    if (!this.useImagesList) {
      return;
    }
    this.productDetails.width(this.productDetailsWrapper.width());
    this.stickyNavHeight = 0;
    this.detailsWrapperOffset = this.productDetailsWrapper.offset().top;
    this.detailsHeight = this.productDetails.get(0).getBoundingClientRect().height;
    return this.scrollFunction();
  };

  ProductView.prototype.triggerFixedProductInfo = function(stickyNavHeight, detailsWrapperOffset, detailsHeight) {
    var detailsOffset, imagesOffset, scrollTop;
    if (!this.useImagesList) {
      return;
    }
    scrollTop = this.window.scrollTop();
    detailsOffset = this.productDetails.offset().top + detailsHeight;
    imagesOffset = this.productImages.offset().top + this.productImages.get(0).getBoundingClientRect().height;
    if (this.productDetails.get(0).getBoundingClientRect().height < this.productImages.get(0).getBoundingClientRect().height) {
      if (detailsWrapperOffset - scrollTop < 0) {
        if ((detailsOffset < imagesOffset) || scrollTop < (imagesOffset - (detailsHeight + stickyNavHeight))) {
          return this.productDetails.css({
            'position': 'fixed',
            'top': stickyNavHeight
          });
        } else if (detailsOffset >= imagesOffset) {
          return this.productDetails.css({
            'position': 'absolute',
            'top': this.productImages.get(0).getBoundingClientRect().height - this.detailsHeight
          });
        } else {
          return this.productDetails.css({
            'position': 'static'
          });
        }
      } else {
        return this.productDetails.css({
          'position': 'static'
        });
      }
    }
  };

  ProductView.prototype.addToCart = function(e) {
    var productId;
    if (!this.useAJAX) {
      return;
    }
    e.preventDefault();
    this.productMessages.html('');
    productId = this.$el.data('product-id');
    return Shopify.addItemFromForm("product-form-" + productId, (function(_this) {
      return function(item) {
        var message;
        message = Theme.addToCartSuccess.replace('**product**', _this.productJSON.title).replace('**cart_link**', "<a href='/cart'>cart</a>").replace('**continue_link**', "<a href='/collections/all'>continue shopping</a>").replace('**checkout_link**', "<a href='/checkout'>check out</a>");
        return setTimeout(function() {
          _this.productMessages.html(message).addClass('success-message').removeClass('error-message');
          return _this.updateCart(item);
        }, 500);
      };
    })(this));
  };

  ProductView.prototype.updateCart = function(newItem) {
    console.log("update cart called");
    var miniCartItemWrapper;
    $('.mini-cart').removeClass('empty');
    miniCartItemWrapper = $('.mini-cart-item-wrapper');
    return Shopify.getCart((function(_this) {
      return function(cart) {
        var currencySwitcher, currencyValue, i, image, item, len, price, ref;
        miniCartItemWrapper.empty();
        $('[data-cart-count]').html("<span class='cart-count-text'>" + Theme.cartText + "</span> (<span class='cart-count-number'>" + cart.item_count + "</span>)");
        ref = cart.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          price = Shopify.formatMoney(item.price, Theme.moneyFormat);
          image = item.image != null ? item.image : "//cdn.shopify.com/s/files/1/2135/4653/t/6/assets/no-image.svg?2846198504672219531";
          miniCartItemWrapper.append("<article class='mini-cart-item' data-variant='" + item.variant_id + "' data-url='" + item.url + "' data-title='" + item.title + "'>\n    <figure class='mini-cart-item-image'>\n        <a href='" + item.url + "'>\n            <img alt='" + item.title + "' src='" + image + "'>\n        </a>\n    </figure>\n    <div class='mini-cart-item-details'>\n        <p class='mini-cart-item-quantity'>\n            Qty: <span>" + item.quantity + "</span>\n        </p>\n        <p class='mini-cart-item-title'>\n            <a href='" + item.url + "'>" + item.title + "</a>\n        </p>\n        <p class='mini-cart-item-price'>\n            <span class='money'>" + price + "</span>\n        </p>\n    </div>\n</article>");
        }
        $('.mini-cart').show();
        
        $('.mini-cart-item-wrapper').prepend('<div class="cls"> X </div>');
          
          
        currencySwitcher = $('.currency-switcher select');
        currencyValue = currencySwitcher.val();
        return currencySwitcher.val(Theme.currency).trigger('reset-currency').val(currencyValue).trigger('reset-currency');
      };
    })(this));
  };

  ProductView.prototype.handleErrors = function(error) {
    var max, message, target, variant, variantID;
    if (error.responseJSON.message === 'Cart Error') {
      variantID = parseInt(this.$("#product-select-" + this.productId).val(), 10);
      target = (function() {
        var i, len, ref, results;
        ref = this.variants;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          variant = ref[i];
          if (variant.id === variantID) {
            results.push(variant);
          }
        }
        return results;
      }).call(this);
      max = target[0].inventory_quantity;
      message = "Unable to add more than **stock** to your cart.".replace('**stock**', max);
    } else {
      message = "We were unable to add this product to your cart. Please try again later. Contact us if you continue to have issues.";
    }
    return setTimeout((function(_this) {
      return function() {
        return _this.$('.product-message').html(message).addClass('error-message').removeClass('success-message');
      };
    })(this), 1000);
  };

  return ProductView;

})(Backbone.View);

window.SelectView = (function(superClass) {
  extend(SelectView, superClass);

  function SelectView() {
    return SelectView.__super__.constructor.apply(this, arguments);
  }

  SelectView.prototype.events = {
    "change": "updateSelectText"
  };

  SelectView.prototype.initialize = function() {
    if (!(this.$el.parent(".select-wrapper").length || this.$el.hasClass("product-variants") || this.$el.hasClass("select-disable-wrapper"))) {
      this.$el.wrap("<div class='select-wrapper' />").parent().prepend("<span class='selected-text'></span>");
    }
    return this.updateSelectText();
  };

  SelectView.prototype.updateSelectText = function() {
    var newOption;
    newOption = this.$el.find("option:selected").prop("selected", true).text();
    return this.$el.siblings(".selected-text").text(newOption);
  };

  return SelectView;

})(Backbone.View);

window.RTEView = (function(superClass) {
  extend(RTEView, superClass);

  function RTEView() {
    return RTEView.__super__.constructor.apply(this, arguments);
  }

  RTEView.prototype.events = {
    "click .tabs li": "switchTabs"
  };

  RTEView.prototype.initialize = function() {
    this.setupTabs();
    return this.resizeVideos();
  };

  RTEView.prototype.switchTabs = function(e) {
    var content, position, tab, tabContainer, tabContentContainer;
    e.preventDefault();
    tab = $(e.currentTarget);
    tabContainer = tab.parent();
    tabContentContainer = tabContainer.next();
    position = tab.index();
    content = tabContentContainer.find("> li").eq(position);
    tabContainer.find("> li").removeClass("active");
    tabContentContainer.find("> li").removeClass("active");
    tab.addClass("active");
    return content.addClass("active");
  };

  RTEView.prototype.setupTabs = function() {
    var tabs;
    tabs = this.$el.find(".tabs");
    tabs.find("li:first").addClass("active");
    return tabs.next().find("li:first").addClass("active");
  };

  RTEView.prototype.resizeVideos = function() {
    var i, len, ref, results, video;
    this.$el.fitVids({
      customSelector: "iframe"
    });
    ref = this.$("iframe");
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      video = ref[i];
      video = $(video);
      if (video.hasClass("highlight")) {
        results.push(video.parent().addClass("highlight"));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return RTEView;

})(Backbone.View);

window.QuickShopView = (function(superClass) {
  extend(QuickShopView, superClass);

  function QuickShopView() {
    return QuickShopView.__super__.constructor.apply(this, arguments);
  }

  QuickShopView.prototype.events = {
    "click": "closeQuickShop"
  };

  QuickShopView.prototype.initialize = function() {
    this.productImages = this.$(".product-images");
    this.mainImage = this.$(".product-main-image");
    this.thumbnailsOuterWrapper = this.$(".product-thumbnails-outer-wrapper");
    this.thumbnailsWrapper = this.thumbnailsOuterWrapper.find(".product-thumbnails-wrapper");
    this.thumbnails = this.$(".product-thumbnails");
    this.productDetails = this.$(".product-details");
    this.quickShop = this.$(".quick-shop");
    this.productJSON = this.$el.data("product-json");
    this.productSettingsJSON = this.$el.data("product-settings-json");
    Shopify.getProduct(this.$el.data("product-handle"), (function(_this) {
      return function(item) {
        $(document.body).addClass("scroll-locked");
        _this.quickShop.data("item", item);
        _this.$el.addClass("visible");
        _this.setupProductDetails(item);
        return new ProductView({
          el: _this.$el
        });
      };
    })(this));
    return $(window).resize((function(_this) {
      return function() {
        _this.positionQuickShop();
        if (window.innerWidth <= 1020 && $(document.body).hasClass("quick-shop-open")) {
          return _this.closeQuickShop();
        }
      };
    })(this));
  };

  QuickShopView.prototype.closeQuickShop = function(e) {
    if (!this.$(e.target).closest(".quick-shop").length || this.$(e.target).parent().hasClass("quick-shop-close")) {
      return this.$el.removeClass("visible").one("trend", (function(_this) {
        return function() {
          $(document.body).removeClass("scroll-locked");
          _this.$el.add(_this.quickShop).removeClass("active");
          _this.mainImage.add(_this.thumbnails).add(_this.productDetails).empty();
          _this.thumbnailsWrapper.add(_this.thumbnails).removeAttr("style");
          _this.thumbnails.removeClass("has-side-scroll");
          return _this.$(".product-thumbnails-navigation").remove();
        };
      })(this));
    }
  };

  QuickShopView.prototype.setupProductDetails = function(item) {
    var addToCartButton, compactImage, compare_at_hidden, description, firstVariant, hasFeaturedImage, hasVariantImage, i, image, index, itemCompareAtPrice, itemPrice, j, l, largeImage, len, len1, len2, len3, m, option, ref, ref1, ref2, ref3, stock, value, variant, variantPrice, vendor, vendorURL, zoom;
    if (item.images.length > 4) {
      this.thumbnails.addClass("has-side-scroll");
    }
    ref = item.images;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      image = ref[index];
      largeImage = Shopify.resizeImage(image, "1024x1024");
      compactImage = Shopify.resizeImage(image, "compact");
      if (item.images.length > 1) {
        this.thumbnails.append("<span class=\"product-thumbnail\">\n    <img data-high-res=\"" + largeImage + "\" src=\"" + compactImage + "\" data-image-position=\"" + index + "\">\n</span>");
      }
    }
    if (item.images.length > 4) {
      this.thumbnailsOuterWrapper.prepend("<span class=\"product-thumbnails-navigation product-thumbnails-navigation-previous\">&#xe601;</span>");
      this.thumbnailsOuterWrapper.append("<span class=\"product-thumbnails-navigation product-thumbnails-navigation-next\">&#xe600;</span>");
    }
    zoom = "";
    zoom = "<div class='product-zoom'></div>";
    firstVariant = item.variants[0];
    hasVariantImage = firstVariant.featured_image != null;
    hasFeaturedImage = item.featured_image != null;
    if (hasVariantImage) {
      largeImage = Shopify.resizeImage(firstVariant.featured_image.src, "1024x1024");
      this.mainImage.prepend("<img class=\"product-image\" src=\"" + largeImage + "\">\n" + zoom);
    } else if (hasFeaturedImage) {
      largeImage = Shopify.resizeImage(item.featured_image, "1024x1024");
      this.mainImage.prepend("<img class=\"product-image\" src=\"" + largeImage + "\">\n" + zoom);
    } else {
      this.mainImage.prepend('<svg class="placeholder-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 525.5 525.5"><path d="M375.5 345.2c0-.1 0-.1 0 0 0-.1 0-.1 0 0-1.1-2.9-2.3-5.5-3.4-7.8-1.4-4.7-2.4-13.8-.5-19.8 3.4-10.6 3.6-40.6 1.2-54.5-2.3-14-12.3-29.8-18.5-36.9-5.3-6.2-12.8-14.9-15.4-17.9 8.6-5.6 13.3-13.3 14-23 0-.3 0-.6.1-.8.4-4.1-.6-9.9-3.9-13.5-2.1-2.3-4.8-3.5-8-3.5h-54.9c-.8-7.1-3-13-5.2-17.5-6.8-13.9-12.5-16.5-21.2-16.5h-.7c-8.7 0-14.4 2.5-21.2 16.5-2.2 4.5-4.4 10.4-5.2 17.5h-48.5c-3.2 0-5.9 1.2-8 3.5-3.2 3.6-4.3 9.3-3.9 13.5 0 .2 0 .5.1.8.7 9.8 5.4 17.4 14 23-2.6 3.1-10.1 11.7-15.4 17.9-6.1 7.2-16.1 22.9-18.5 36.9-2.2 13.3-1.2 47.4 1 54.9 1.1 3.8 1.4 14.5-.2 19.4-1.2 2.4-2.3 5-3.4 7.9-4.4 11.6-6.2 26.3-5 32.6 1.8 9.9 16.5 14.4 29.4 14.4h176.8c12.9 0 27.6-4.5 29.4-14.4 1.2-6.5-.5-21.1-5-32.7zm-97.7-178c.3-3.2.8-10.6-.2-18 2.4 4.3 5 10.5 5.9 18h-5.7zm-36.3-17.9c-1 7.4-.5 14.8-.2 18h-5.7c.9-7.5 3.5-13.7 5.9-18zm4.5-6.9c0-.1.1-.2.1-.4 4.4-5.3 8.4-5.8 13.1-5.8h.7c4.7 0 8.7.6 13.1 5.8 0 .1 0 .2.1.4 3.2 8.9 2.2 21.2 1.8 25h-30.7c-.4-3.8-1.3-16.1 1.8-25zm-70.7 42.5c0-.3 0-.6-.1-.9-.3-3.4.5-8.4 3.1-11.3 1-1.1 2.1-1.7 3.4-2.1l-.6.6c-2.8 3.1-3.7 8.1-3.3 11.6 0 .2 0 .5.1.8.3 3.5.9 11.7 10.6 18.8.3.2.8.2 1-.2.2-.3.2-.8-.2-1-9.2-6.7-9.8-14.4-10-17.7 0-.3 0-.6-.1-.8-.3-3.2.5-7.7 3-10.5.8-.8 1.7-1.5 2.6-1.9h155.7c1 .4 1.9 1.1 2.6 1.9 2.5 2.8 3.3 7.3 3 10.5 0 .2 0 .5-.1.8-.3 3.6-1 13.1-13.8 20.1-.3.2-.5.6-.3 1 .1.2.4.4.6.4.1 0 .2 0 .3-.1 13.5-7.5 14.3-17.5 14.6-21.3 0-.3 0-.5.1-.8.4-3.5-.5-8.5-3.3-11.6l-.6-.6c1.3.4 2.5 1.1 3.4 2.1 2.6 2.9 3.5 7.9 3.1 11.3 0 .3 0 .6-.1.9-1.5 20.9-23.6 31.4-65.5 31.4h-43.8c-41.8 0-63.9-10.5-65.4-31.4zm91 89.1h-7c0-1.5 0-3-.1-4.2-.2-12.5-2.2-31.1-2.7-35.1h3.6c.8 0 1.4-.6 1.4-1.4v-14.1h2.4v14.1c0 .8.6 1.4 1.4 1.4h3.7c-.4 3.9-2.4 22.6-2.7 35.1v4.2zm65.3 11.9h-16.8c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h16.8v2.8h-62.2c0-.9-.1-1.9-.1-2.8h33.9c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-33.9c-.1-3.2-.1-6.3-.1-9h62.5v9zm-12.5 24.4h-6.3l.2-1.6h5.9l.2 1.6zm-5.8-4.5l1.6-12.3h2l1.6 12.3h-5.2zm-57-19.9h-62.4v-9h62.5c0 2.7 0 5.8-.1 9zm-62.4 1.4h62.4c0 .9-.1 1.8-.1 2.8H194v-2.8zm65.2 0h7.3c0 .9.1 1.8.1 2.8H259c.1-.9.1-1.8.1-2.8zm7.2-1.4h-7.2c.1-3.2.1-6.3.1-9h7c0 2.7 0 5.8.1 9zm-7.7-66.7v6.8h-9v-6.8h9zm-8.9 8.3h9v.7h-9v-.7zm0 2.1h9v2.3h-9v-2.3zm26-1.4h-9v-.7h9v.7zm-9 3.7v-2.3h9v2.3h-9zm9-5.9h-9v-6.8h9v6.8zm-119.3 91.1c-2.1-7.1-3-40.9-.9-53.6 2.2-13.5 11.9-28.6 17.8-35.6 5.6-6.5 13.5-15.7 15.7-18.3 11.4 6.4 28.7 9.6 51.8 9.6h6v14.1c0 .8.6 1.4 1.4 1.4h5.4c.3 3.1 2.4 22.4 2.7 35.1 0 1.2.1 2.6.1 4.2h-63.9c-.8 0-1.4.6-1.4 1.4v16.1c0 .8.6 1.4 1.4 1.4H256c-.8 11.8-2.8 24.7-8 33.3-2.6 4.4-4.9 8.5-6.9 12.2-.4.7-.1 1.6.6 1.9.2.1.4.2.6.2.5 0 1-.3 1.3-.8 1.9-3.7 4.2-7.7 6.8-12.1 5.4-9.1 7.6-22.5 8.4-34.7h7.8c.7 11.2 2.6 23.5 7.1 32.4.2.5.8.8 1.3.8.2 0 .4 0 .6-.2.7-.4 1-1.2.6-1.9-4.3-8.5-6.1-20.3-6.8-31.1H312l-2.4 18.6c-.1.4.1.8.3 1.1.3.3.7.5 1.1.5h9.6c.4 0 .8-.2 1.1-.5.3-.3.4-.7.3-1.1l-2.4-18.6H333c.8 0 1.4-.6 1.4-1.4v-16.1c0-.8-.6-1.4-1.4-1.4h-63.9c0-1.5 0-2.9.1-4.2.2-12.7 2.3-32 2.7-35.1h5.2c.8 0 1.4-.6 1.4-1.4v-14.1h6.2c23.1 0 40.4-3.2 51.8-9.6 2.3 2.6 10.1 11.8 15.7 18.3 5.9 6.9 15.6 22.1 17.8 35.6 2.2 13.4 2 43.2-1.1 53.1-1.2 3.9-1.4 8.7-1 13-1.7-2.8-2.9-4.4-3-4.6-.2-.3-.6-.5-.9-.6h-.5c-.2 0-.4.1-.5.2-.6.5-.8 1.4-.3 2 0 0 .2.3.5.8 1.4 2.1 5.6 8.4 8.9 16.7h-42.9v-43.8c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v44.9c0 .1-.1.2-.1.3 0 .1 0 .2.1.3v9c-1.1 2-3.9 3.7-10.5 3.7h-7.5c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h7.5c5 0 8.5-.9 10.5-2.8-.1 3.1-1.5 6.5-10.5 6.5H210.4c-9 0-10.5-3.4-10.5-6.5 2 1.9 5.5 2.8 10.5 2.8h67.4c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-67.4c-6.7 0-9.4-1.7-10.5-3.7v-54.5c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v43.8h-43.6c4.2-10.2 9.4-17.4 9.5-17.5.5-.6.3-1.5-.3-2s-1.5-.3-2 .3c-.1.2-1.4 2-3.2 5 .1-4.9-.4-10.2-1.1-12.8zm221.4 60.2c-1.5 8.3-14.9 12-26.6 12H174.4c-11.8 0-25.1-3.8-26.6-12-1-5.7.6-19.3 4.6-30.2H197v9.8c0 6.4 4.5 9.7 13.4 9.7h105.4c8.9 0 13.4-3.3 13.4-9.7v-9.8h44c4 10.9 5.6 24.5 4.6 30.2z"/><path d="M286.1 359.3c0 .4.3.7.7.7h14.7c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-14.7c-.3 0-.7.3-.7.7zm5.3-145.6c13.5-.5 24.7-2.3 33.5-5.3.4-.1.6-.5.4-.9-.1-.4-.5-.6-.9-.4-8.6 3-19.7 4.7-33 5.2-.4 0-.7.3-.7.7 0 .4.3.7.7.7zm-11.3.1c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7H242c-19.9 0-35.3-2.5-45.9-7.4-.4-.2-.8 0-.9.3-.2.4 0 .8.3.9 10.8 5 26.4 7.5 46.5 7.5h38.1zm-7.2 116.9c.4.1.9.1 1.4.1 1.7 0 3.4-.7 4.7-1.9 1.4-1.4 1.9-3.2 1.5-5-.2-.8-.9-1.2-1.7-1.1-.8.2-1.2.9-1.1 1.7.3 1.2-.4 2-.7 2.4-.9.9-2.2 1.3-3.4 1-.8-.2-1.5.3-1.7 1.1s.2 1.5 1 1.7z"/><path d="M275.5 331.6c-.8 0-1.4.6-1.5 1.4 0 .8.6 1.4 1.4 1.5h.3c3.6 0 7-2.8 7.7-6.3.2-.8-.4-1.5-1.1-1.7-.8-.2-1.5.4-1.7 1.1-.4 2.3-2.8 4.2-5.1 4zm5.4 1.6c-.6.5-.6 1.4-.1 2 1.1 1.3 2.5 2.2 4.2 2.8.2.1.3.1.5.1.6 0 1.1-.3 1.3-.9.3-.7-.1-1.6-.8-1.8-1.2-.5-2.2-1.2-3-2.1-.6-.6-1.5-.6-2.1-.1zm-38.2 12.7c.5 0 .9 0 1.4-.1.8-.2 1.3-.9 1.1-1.7-.2-.8-.9-1.3-1.7-1.1-1.2.3-2.5-.1-3.4-1-.4-.4-1-1.2-.8-2.4.2-.8-.3-1.5-1.1-1.7-.8-.2-1.5.3-1.7 1.1-.4 1.8.1 3.7 1.5 5 1.2 1.2 2.9 1.9 4.7 1.9z"/><path d="M241.2 349.6h.3c.8 0 1.4-.7 1.4-1.5s-.7-1.4-1.5-1.4c-2.3.1-4.6-1.7-5.1-4-.2-.8-.9-1.3-1.7-1.1-.8.2-1.3.9-1.1 1.7.7 3.5 4.1 6.3 7.7 6.3zm-9.7 3.6c.2 0 .3 0 .5-.1 1.6-.6 3-1.6 4.2-2.8.5-.6.5-1.5-.1-2s-1.5-.5-2 .1c-.8.9-1.8 1.6-3 2.1-.7.3-1.1 1.1-.8 1.8 0 .6.6.9 1.2.9z"/></svg>');
    }
    vendor = "";
    vendorURL = this.$el.data("vendor-url");
    vendor = "<a class='product-vendor' href='" + vendorURL + "'>" + item.vendor + "</a>";
    itemPrice = Shopify.formatMoney(firstVariant.price, Theme.moneyFormat);
    itemCompareAtPrice = "";
    if (firstVariant.compare_at_price > firstVariant.price) {
      itemCompareAtPrice = Shopify.formatMoney(firstVariant.compare_at_price, Theme.moneyFormat);
    }
    stock = "InStock";
    addToCartButton = "<input type='submit' value='Add to cart' />";
    if (!item.available) {
      stock = "OutOfStock";
      addToCartButton = "<input type='submit' class='disabled' disabled='disabled' value='Sold out' />";
    }
    description = "";
    if (item.description !== null) {
      description = "<div class='product-description rte' itemprop='description'>" + item.description + "</div>";
    }
    compare_at_hidden = firstVariant.price < firstVariant.compare_at_price ? "" : "hidden";
    this.productDetails.append(vendor + "\n\n<h2 class=\"product-title\">" + item.title + "</h2>\n\n<p class=\"product-price\" itemprop=\"offers\" itemscope itemtype=\"http://schema.org/Offer\">\n    <span class=\"product-price-minimum money\">" + itemPrice + "</span>\n    <span class=\"product-price-compare money original " + compare_at_hidden + "\">" + itemCompareAtPrice + "</span>\n    <link itemprop=\"availability\" href=\"http://schema.org/" + stock + "\">\n</p>\n\n<form action=\"/cart/add\" method=\"post\" id=\"product-form-" + item.id + "\" data-product-form=\"" + item.id + "\" data-product-id=\"" + item.id + "\">\n\n    <script type=\"application/json\" data-product-json-" + item.id + ">\n        " + this.productJSON + "\n    </script>\n\n    <script type=\"application/json\" data-product-settings-" + item.id + ">\n        " + this.productSettingsJSON + "\n    </script>\n\n    <div class=\"product-options\">\n    </div>\n\n    <div class=\"product-quantity inline-input-wrapper\">\n        <label>Quantity</label>\n        <input type=\"text\" name=\"quantity\" value=\"1\" />\n    </div>\n\n    <div class=\"add-to-cart\">\n        " + addToCartButton + "\n    </div>\n\n    <div class=\"product-message\"></div>\n\n</form>\n\n" + description + "\n\n<a class=\"view-product\" href=\"" + item.url + "\">View product</a>");
    if (!(item.options.length === 1 && item.options[0].values[0] === 'Default Title')) {
      ref1 = item.options;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        option = ref1[j];
        this.$(".product-options").append("<div class=\"inline-field-wrapper js-required\">\n    <div class=\"selector-wrapper\">\n        <label class=\"select-text\" for=\"single-option-" + item.id + "-" + (option.position - 1) + "\" data-select-text=\"\">\n            <strong>" + option.name + ":</strong>\n        </label>\n        <div class=\"select-wrapper\">\n            <span class=\"selected-text\">\n            " + option.values[0] + "\n            </span>\n            <select class=\"single-option-selector\" id=\"single-option-" + item.id + "-" + (option.position - 1) + "\" data-option-select=\"" + item.id + "\" data-option-index=\"" + (option.position - 1) + "\">");
        ref2 = option.values;
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          value = ref2[l];
          this.$("#single-option-" + item.id + "-" + (option.position - 1)).append("<option value='" + value + "'>" + value + "</option>");
        }
        this.$(".product-options").append("            </select>\n        </div>\n    </div>\n</div>");
      }
    }
    this.$(".product-options").append("<div class=\"product-options\">\n    <div class=\"selector-wrapper no-js-required\">\n        <label for=\"product-select-" + item.id + "\"></label>\n        <div class=\"select-wrapper\">\n            <span class=\"selected-text\">\n            </span>\n            <select class=\"product-select\" name=\"id\" id=\"product-select-" + item.id + "\">");
    ref3 = item.variants;
    for (m = 0, len3 = ref3.length; m < len3; m++) {
      variant = ref3[m];
      variantPrice = Shopify.formatMoney(variant.price, Theme.moneyFormat);
      if (variant.available) {
        this.$("#product-select-" + item.id).append("<option value='" + variant.id + "' data-variant-id='" + variant.id + "' data-sku='" + variant.sku + "'>" + variant.title + " - " + variantPrice + "</option>");
      } else {
        this.$("#product-select-" + item.id).append("<option value='" + variant.id + "' data-variant-id='" + variant.id + "' data-sku='" + variant.sku + "' disabled='disabled'>" + variant.title + " - " + variantPrice + "</option>");
      }
    }
    this.$(".product-options").append("            </select>\n        </div>\n    </div>\n</div>");
    return this.productImages.imagesLoaded((function(_this) {
      return function() {
        _this.quickShop.addClass("active");
        return _this.positionQuickShop();
      };
    })(this));
  };

  QuickShopView.prototype.positionQuickShop = function() {
    return this.quickShop.css({
      marginTop: -(this.quickShop.outerHeight() / 2),
      marginLeft: -(this.quickShop.outerWidth() / 2)
    });
  };

  return QuickShopView;

})(Backbone.View);

window.ProductListItemView = (function(superClass) {
  extend(ProductListItemView, superClass);

  function ProductListItemView() {
    return ProductListItemView.__super__.constructor.apply(this, arguments);
  }

  ProductListItemView.prototype.events = {
    "click .product-list-item-thumbnail": "redirectToProduct",
    "click .quick-shop-modal-trigger": "openQuickShop"
  };

  ProductListItemView.prototype.initialize = function() {
    this.productHover = $('[data-product-hover]').data('product-hover');
    if (this.productHover === 'quick-shop' || this.productHover === 'stock-level') {
      return this.centerProductItemOverlay();
    }
  };

  ProductListItemView.prototype.centerProductItemOverlay = function() {
    var trigger;
    if (this.productHover === 'quick-shop') {
      return trigger = this.$(".quick-shop-modal-trigger");
    } else if (this.productHover === 'stock-level') {
      return trigger = this.$(".product-list-item-inventory");
    }
  };

  ProductListItemView.prototype.redirectToProduct = function(e) {
    var $target, isSlider, url;
    $target = $(e.target);
    url = !$target.hasClass('quick-shop-modal-trigger') ? $target.data('url') : null;
    isSlider = $target.closest('.flickity-slider').length;
    if (isSlider) {
      return;
    }
    if (url) {
      return window.location = url;
    }
  };

  ProductListItemView.prototype.openQuickShop = function(e) {
    var quickShopWrapper;
    quickShopWrapper = $(".quick-shop-wrapper");
    quickShopWrapper.data("product-handle", $(e.target).data("product-handle")).data("product-id", $(e.target).data("product-id")).data("variant-id", $(e.target).data("variant-id")).data("vendor-url", $(e.target).data("vendor-url")).data("product-json", $(e.target).siblings("[data-product-json]").text()).data("product-settings-json", $(e.target).siblings("[data-product-settings-json]").text());
    return this.quickshop = new QuickShopView({
      el: quickShopWrapper
    });
  };

  return ProductListItemView;

})(Backbone.View);

window.HomeProductsView = (function(superClass) {
  extend(HomeProductsView, superClass);

  function HomeProductsView() {
    this._flickity = bind(this._flickity, this);
    return HomeProductsView.__super__.constructor.apply(this, arguments);
  }

  HomeProductsView.prototype.initialize = function() {
    this.$window = $(window);
    this.productViews = [];
    this.$container = this.$('[data-products-container]');
    this.slide = '.product-list-item';
    this.flickity = null;
    this._setupProducts();
    this._bindEvents();
    return this._flickity();
  };

  HomeProductsView.prototype.prepareRemove = function() {
    var i, len, productView, ref, results;
    this.$window.off('resize.home-featured-collections');
    this._destroyFlickity();
    if (this.productViews.length) {
      ref = this.productViews;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        productView = ref[i];
        results.push(productView.remove());
      }
      return results;
    }
  };

  HomeProductsView.prototype._bindEvents = function() {
    return this.$window.on('resize.home-featured-collections', window.ThemeUtils.debounce(this._flickity, 100));
  };

  HomeProductsView.prototype._setupProducts = function() {
    var i, len, productItem, ref, results;
    ref = $(".product-list-item", this.$el);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      productItem = ref[i];
      results.push(this.productViews.push(new ProductListItemView({
        el: productItem
      })));
    }
    return results;
  };

  HomeProductsView.prototype._flickity = function() {
    if (!this.$container.length) {
      return;
    }
    if (!window.ThemeUtils.isSmall()) {
      return this._destroyFlickity();
    }
    if (this.flickity) {
      return;
    }
    this.flickity = new Flickity(this.$container[0], {
      cellAlign: 'left',
      cellSelector: this.slide,
      contain: false,
      prevNextButtons: false,
      pageDots: false,
      imagesLoaded: true,
      setGallerySize: false
    });
    return this._flickityEvents();
  };

  HomeProductsView.prototype._destroyFlickity = function() {
    if (this.flickity) {
      this.flickity.destroy();
      this.flickity = null;
      this.$window.off('resize.home-featured-collections-flickity');
      return this.$container.off('home-featured-collections-height');
    }
  };

  HomeProductsView.prototype._flickityEvents = function() {
    this.flickity.on('cellSelect', (function(_this) {
      return function() {
        return _this.$container.trigger('home-featured-collections-height');
      };
    })(this));
    this.flickity.on('settle', (function(_this) {
      return function() {
        return _this.$container.trigger('home-featured-collections-height');
      };
    })(this));
    this.$container.on('home-featured-collections-height', (function(_this) {
      return function() {
        return window.ThemeUtils.flickityResize(_this.flickity);
      };
    })(this));
    this.$container.trigger('home-featured-collections-height');
    return this.$window.on('resize.home-featured-collections-flickity', window.ThemeUtils.debounce((function(_this) {
      return function() {
        return _this.$container.trigger('home-featured-collections-height');
      };
    })(this), 10));
  };

  return HomeProductsView;

})(Backbone.View);


/**
 * Get URLs to square versions of an Instagram photo.
 *
 * @param {*} photo The instagram photo object, as returned by their API.
 * @return Object An object with `small` and `large` URLs.
 */
function instagramSquared(photo) {
  var response = { small:'', large:'', thumbnail:'' };

  // At a bare minimum we need the following:
  if (!photo || !photo.images || !photo.images.standard_resolution) {
    console.error('Instagram: can not parse photo data.');
    return response;
  }

  // Set fallbacks in case we can't resize
  response.large = photo.images.standard_resolution.url;
  response.small = photo.images.low_resolution
    ? photo.images.low_resolution.url
    : photo.images.standard_resolution.url;
  response.thumbnail = photo.images.thumbnail
    ? photo.images.thumbnail.url
    : photo.images.standard_resolution.url;

  // We need the cropping information from the thumbnail URL
  if (!photo.images.thumbnail) return response;

  // Crop each size
  response.large = getSquareUrl(response.large, photo.images.thumbnail.url);
  response.small = getSquareUrl(response.small, photo.images.thumbnail.url);

  return response;
}

/**
 * Resize the template URL based off another URL's sizes.
 *
 * This pulls the size information from one URL (in a format like `s320x320`)
 * and and moves it to another URL.
 *
 * This lets us use the cropping information from one URL, and the sizing
 * information from another. Currently, only the thumbnail size has the crop
 * info, so the templateU
 *
 * @param url
 *        An Instagram photo URL to pull the sizing information from.
 *
 * @param templateUrl
 *        An Instagram photo URL that has cropping information.
 */
function getSquareUrl(url, templateUrl) {
  var sizes = url.match(/\/[ps]([0-9]+)x([0-9]+)\//);
  if (!sizes || sizes.length < 3) return templateUrl;

  var size = Math.round(Math.max(
    parseInt(sizes[1], 10),
    parseInt(sizes[2], 10)
  ));

  return templateUrl.replace(
    /\/[ps][0-9]+x[0-9]+\//,
    "/s" + size + "x" + size + "/"
  );
}
;

window.HomeInstagramWidgetView = (function(superClass) {
  extend(HomeInstagramWidgetView, superClass);

  function HomeInstagramWidgetView() {
    return HomeInstagramWidgetView.__super__.constructor.apply(this, arguments);
  }

  HomeInstagramWidgetView.prototype.initialize = function() {
    this.initializedClass = 'instagram-initialized';
    return this._validate();
  };

  HomeInstagramWidgetView.prototype._validate = function() {
    var accessToken, isInitialized, photoCount;
    this.$photoContainer = $("[data-instagram-photos]", this.$el);
    accessToken = $('[data-instagram-token]', this.$el).attr('data-instagram-token');
    photoCount = $('[data-instagram-photo-count]', this.$el).attr('data-instagram-photo-count');
    isInitialized = this.$el.hasClass(this.initializedClass);
    return this._getPhotos(accessToken, photoCount, isInitialized);
  };

  HomeInstagramWidgetView.prototype._getPhotos = function(accessToken, photoCount, isInitialized) {
    var url;
    if (!accessToken.length) {
      return this._hasError(false);
    }
    if (isInitialized) {
      return;
    }
    url = "https://api.instagram.com/v1/users/self/media/recent?access_token=" + accessToken + "&count=" + photoCount + "&callback=";
    return $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: url,
      success: (function(_this) {
        return function(response) {
          var i, len, photo, ref, results, sizes;
          if (response.meta.code === 200) {
            _this.$photoContainer.empty();
            ref = response.data;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              photo = ref[i];
              sizes = instagramSquared(photo);
              results.push(_this.$photoContainer.append("<a class='instagram-photo' target='_blank' href='" + photo.link + "'><img src='" + sizes.small + "'/></a>"));
            }
            return results;
          } else {
            _this.$photoContainer.append("<div class='instagram-error'>Instagram error: " + response.meta.error_message + "</div>");
            return console.log("Instagram error: " + response.meta.error_message);
          }
        };
      })(this),
      error: (function(_this) {
        return function(response) {
          _this.$photoContainer.empty();
          return console.log("Instagram error: " + response.meta.error_message);
        };
      })(this)
    });
  };

  HomeInstagramWidgetView.prototype._hasError = function(response) {
    this.$el.toggleClass(this.initializedClass, false);
    if (response) {
      return console.log("Instagram error: " + response.meta.error_message);
    }
  };

  HomeInstagramWidgetView.prototype.update = function($el) {
    this.$el = $el;
    return this._validate();
  };

  return HomeInstagramWidgetView;

})(Backbone.View);

window.HomeTwitterWidgetView = (function(superClass) {
  extend(HomeTwitterWidgetView, superClass);

  function HomeTwitterWidgetView() {
    this._renderTweets = bind(this._renderTweets, this);
    return HomeTwitterWidgetView.__super__.constructor.apply(this, arguments);
  }

  HomeTwitterWidgetView.prototype.initialize = function() {
    this.initializedClass = 'twitter-initialized';
    return this._validate();
  };

  HomeTwitterWidgetView.prototype._validate = function() {
    var isInitialized, showImages, showRetweets;
    this.$tweetContainer = $("[data-twitter-tweets]", this.$el);
    this.username = $("[data-twitter-username]", this.$el).attr("data-twitter-username");
    showRetweets = $("[data-twitter-show-retweets]", this.$el).length;
    showImages = $("[data-twitter-show-images]", this.$el).length;
    isInitialized = this.$el.hasClass(this.initializedClass) && this.$tweetContainer.length;
    return this._getTweets(showRetweets, showImages, isInitialized);
  };

  HomeTwitterWidgetView.prototype._getTweets = function(showRetweets, showImages, isInitialized) {
    var config;
    if (!this.username.length) {
      return this._hasError(false);
    }
    if (isInitialized) {
      return;
    }
    config = {
      "profile": {
        "screenName": this.username
      },
      "maxTweets": 1,
      "enableLinks": true,
      "showUser": true,
      "showTime": true,
      "showRetweet": showRetweets,
      "showImages": showImages,
      "showInteraction": true,
      "customCallback": this._renderTweets,
      "showInteraction": false,
      "useEmoji": true
    };
    return twitterFetcher.fetch(config);
  };

  HomeTwitterWidgetView.prototype._renderTweets = function(tweets) {
    var i, len, media, timestamp, tweet, user;
    if (tweets.length) {
      this.$("[data-tweet]", this.$tweetContainer).empty();
      for (i = 0, len = tweets.length; i < len; i++) {
        tweet = tweets[i];
        tweet = $(tweet);
        this.$("[data-tweet]", this.$tweetContainer).append(tweet);
      }
      media = this.$(".media");
      user = this.$(".user");
      this.$("[data-tweet]", this.$tweetContainer).prepend(media);
      this.$("[data-tweet]", this.$tweetContainer).prepend(user);
      if (("@" + (this.username.toLowerCase())) !== this.$('[data-scribe="element:screen_name"]').text().toLowerCase()) {
        this.$('[data-scribe="element:user_link"]').prepend('<svg class="retweet-svg" viewBox="0 0 32 32"> <path class="path1" d="M4 10h20v6l8-8-8-8v6h-24v12h4zM28 22h-20v-6l-8 8 8 8v-6h24v-12h-4z"></path> </svg>');
      }
      timestamp = this.$(".timePosted").text().split(" ");
      return this.$(".timePosted").prepend("<span class='twitter-icon'>&#xF12E;</span>");
    } else {
      return console.log("No tweets to display. Most probable cause is an incorrectly entered Widget ID.");
    }
  };

  HomeTwitterWidgetView.prototype._hasError = function(response) {
    this.$el.toggleClass(this.initializedClass, false);
    this.$tweetContainer.html();
    if (response) {
      return console.log("Twitter error: " + response.meta.error_message);
    }
  };

  HomeTwitterWidgetView.prototype.update = function($el) {
    this.$el = $el;
    return this._validate();
  };

  return HomeTwitterWidgetView;

})(Backbone.View);

window.HomeSocialWidgetsView = (function(superClass) {
  extend(HomeSocialWidgetsView, superClass);

  function HomeSocialWidgetsView() {
    return HomeSocialWidgetsView.__super__.constructor.apply(this, arguments);
  }

  HomeSocialWidgetsView.prototype.initialize = function() {
    if ($('[data-instagram]', this.$el).length) {
      this.instagram = new HomeInstagramWidgetView({
        el: this.$el
      });
    }
    if ($('[data-twitter]', this.$el).length) {
      return this.twitter = new HomeTwitterWidgetView({
        el: this.$el
      });
    }
  };

  HomeSocialWidgetsView.prototype.update = function($el) {
    this.$el = $el;
    if (this.instagram) {
      this.instagram.update(this.$el);
    }
    if (this.twitter) {
      return this.twitter.update(this.$el);
    }
  };

  HomeSocialWidgetsView.prototype.remove = function() {
    this.instagram = null;
    return this.twitter = null;
  };

  return HomeSocialWidgetsView;

})(Backbone.View);

window.HomeVideoWithTextOverlay = (function(superClass) {
  extend(HomeVideoWithTextOverlay, superClass);

  function HomeVideoWithTextOverlay() {
    return HomeVideoWithTextOverlay.__super__.constructor.apply(this, arguments);
  }

  HomeVideoWithTextOverlay.prototype.events = {
    'click [data-play-video]': 'playVideo'
  };

  HomeVideoWithTextOverlay.prototype.playVideo = function() {
    var $overlay, $video, delimiter, videoSrc, videoSrcNew;
    $overlay = this.$el.find('[data-video-overlay]');
    $video = this.$el.find('iframe');
    if (!$video.length) {
      return;
    }
    videoSrc = $video.attr('src');
    delimiter = (videoSrc != null ? videoSrc.indexOf('?') : void 0) === -1 ? '?' : '&';
    videoSrcNew = "" + videoSrc + delimiter + "autoplay=1";
    return $overlay.addClass('overlay-inactive').one('trend', (function(_this) {
      return function() {
        $video.attr('src', videoSrcNew);
        return $overlay.remove();
      };
    })(this));
  };

  HomeVideoWithTextOverlay.prototype.prepareRemove = function() {
    var ref;
    return (ref = this.video) != null ? ref.remove() : void 0;
  };

  return HomeVideoWithTextOverlay;

})(Backbone.View);

window.HomeTestimonialsView = (function(superClass) {
  extend(HomeTestimonialsView, superClass);

  function HomeTestimonialsView() {
    this._flickity = bind(this._flickity, this);
    return HomeTestimonialsView.__super__.constructor.apply(this, arguments);
  }

  HomeTestimonialsView.prototype.initialize = function() {
    this.container = 'data-testimonials-container';
    this.slide = 'data-testimonial-item';
    this.$window = $(window);
    this.$testimonialsContainer = this.$el.find("[" + this.container + "]");
    this.flickity = null;
    this._bindEvents();
    return this._flickity();
  };

  HomeTestimonialsView.prototype.prepareRemove = function() {
    this.$window.off('resize.testimonials');
    return this._destroyFlickity();
  };

  HomeTestimonialsView.prototype._bindEvents = function() {
    return this.$window.on('resize.testimonials', window.ThemeUtils.debounce(this._flickity, 100));
  };

  HomeTestimonialsView.prototype._flickity = function() {
    if (!this.$testimonialsContainer.length) {
      return;
    }
    if (!window.ThemeUtils.isSmall()) {
      return this._destroyFlickity();
    }
    if (this.flickity) {
      return;
    }
    return this.flickity = new Flickity(this.$testimonialsContainer[0], {
      cellAlign: 'center',
      cellSelector: "[" + this.slide + "]",
      contain: true,
      prevNextButtons: false,
      pageDots: false,
      imagesLoaded: true
    });
  };

  HomeTestimonialsView.prototype._destroyFlickity = function() {
    if (this.flickity) {
      this.flickity.destroy();
      return this.flickity = null;
    }
  };

  HomeTestimonialsView.prototype.onBlockSelect = function(event) {
    var index;
    if (!this.flickity) {
      return;
    }
    index = parseInt($(event.target).attr(this.slide), 10) - 1;
    return this.flickity.select(index, true);
  };

  return HomeTestimonialsView;

})(Backbone.View);

window.HomePromotionView = (function(superClass) {
  extend(HomePromotionView, superClass);

  function HomePromotionView() {
    this._headerOffset = bind(this._headerOffset, this);
    this.adjustHeight = bind(this.adjustHeight, this);
    return HomePromotionView.__super__.constructor.apply(this, arguments);
  }

  HomePromotionView.prototype.initialize = function() {
    this.$window = $(window);
    this.$body = $('body');
    this.$header = $('[data-section-type="header"]');
    this.$parent = this.$el.parent();
    this.$wrapper = this.$('[data-promotion-wrapper]');
    this.$content = this.$('[data-promotion-content]');
    this.$image = this.$('[data-promotion-image]');
    this.$imageContainer = this.$('[data-promotion-image-container]');
    this.isFullScreen = this.$el.is('[data-section-full-screen]');
    this._bindEvents();
    return this.adjustHeight();
  };

  HomePromotionView.prototype.prepareRemove = function() {
    return this.$window.off('.home-promotion');
  };

  HomePromotionView.prototype.onSectionReorder = function() {
    return this._headerOffset();
  };

  HomePromotionView.prototype.adjustHeight = function() {
    var heights, minHeight;
    heights = [];
    if (this.$imageContainer.length) {
      if (this.$content.length) {
        heights.push(this.$content.outerHeight(true));
      }
      if (this.$image.length) {
        heights.push(this.$image.outerHeight(true));
      }
      minHeight = Math.max.apply(null, heights);
      this.$imageContainer.css({
        minHeight: minHeight
      });
    }
    return this._headerOffset();
  };

  HomePromotionView.prototype._bindEvents = function() {
    this.$window.on('resize.home-promotion', window.ThemeUtils.debounce(this.adjustHeight, 100));
    return this.$window.on('scroll.home-promotion', window.ThemeUtils.debounce(this.adjustHeight, 10));
  };

  HomePromotionView.prototype._headerOffset = function() {
    var headerHeight, headerScrolledHeight, isFirstChild, isStickyEnabled, maxHeight, newHeight;
    if (!this.isFullScreen) {
      return;
    }
    headerHeight = this.$header.outerHeight(true);
    headerScrolledHeight = this.$header.find('.navigation').outerHeight(true);
    isFirstChild = this.$parent.is(':first-child');
    isStickyEnabled = this.$body.hasClass('sticky-header');
    maxHeight = this.$window.height();
    if (window.ThemeUtils.isMedium()) {
      this.$wrapper.css('height', '');
    }
    if (isFirstChild) {
      newHeight = maxHeight - headerHeight;
      return this.$wrapper.height(newHeight);
    } else if (!window.ThemeUtils.isMedium() && isStickyEnabled) {
      newHeight = maxHeight - headerScrolledHeight;
      return this.$wrapper.height(newHeight);
    } else {
      return this.$wrapper.css('height', '');
    }
  };

  return HomePromotionView;

})(Backbone.View);

window.HomeBlogView = (function(superClass) {
  extend(HomeBlogView, superClass);

  function HomeBlogView() {
    this._flickity = bind(this._flickity, this);
    return HomeBlogView.__super__.constructor.apply(this, arguments);
  }

  HomeBlogView.prototype.initialize = function() {
    this.container = 'data-blog-container';
    this.slide = '.home-blog-post';
    this.$window = $(window);
    this.$container = this.$el.find("[" + this.container + "]");
    this.flickity = null;
    this._bindEvents();
    return this._flickity();
  };

  HomeBlogView.prototype.prepareRemove = function() {
    this.$window.off('resize.home-blog-posts');
    return this._destroyFlickity();
  };

  HomeBlogView.prototype._bindEvents = function() {
    return this.$window.on('resize.home-blog-posts', window.ThemeUtils.debounce(this._flickity, 100));
  };

  HomeBlogView.prototype._flickity = function() {
    if (!this.$container.length) {
      return;
    }
    if (!window.ThemeUtils.isSmall()) {
      return this._destroyFlickity();
    }
    if (this.flickity) {
      return;
    }
    this.flickity = new Flickity(this.$container[0], {
      cellAlign: 'left',
      cellSelector: this.slide,
      contain: false,
      prevNextButtons: false,
      pageDots: false,
      imagesLoaded: true,
      setGallerySize: false
    });
    return this._flickityEvents();
  };

  HomeBlogView.prototype._destroyFlickity = function() {
    if (this.flickity) {
      this.flickity.destroy();
      this.flickity = null;
      this.$window.off('resize.home-blog-posts-flickity');
      return this.$container.off('home-blog-posts-height');
    }
  };

  HomeBlogView.prototype._flickityEvents = function() {
    this.flickity.on('cellSelect', (function(_this) {
      return function() {
        return _this.$container.trigger('home-blog-posts-height');
      };
    })(this));
    this.flickity.on('settle', (function(_this) {
      return function() {
        return _this.$container.trigger('home-blog-posts-height');
      };
    })(this));
    this.$container.on('home-blog-posts-height', (function(_this) {
      return function() {
        return window.ThemeUtils.flickityResize(_this.flickity);
      };
    })(this));
    this.$container.trigger('home-blog-posts-height');
    return this.$window.on('resize.home-blog-posts-flickity', window.ThemeUtils.debounce((function(_this) {
      return function() {
        return _this.$container.trigger('home-blog-posts-height');
      };
    })(this), 10));
  };

  return HomeBlogView;

})(Backbone.View);

window.HomeView = (function(superClass) {
  extend(HomeView, superClass);

  function HomeView() {
    return HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.initialize = function() {
    return this.sectionBinding();
  };

  HomeView.prototype.sectionBinding = function() {
    this.sections = new ThemeEditor();
    this.sections.register('home-slideshow', this.homeSlideshow(this.sections));
    this.sections.register('home-masonry', this.homeMasonry(this.sections));
    this.sections.register('home-masonry-alternative', this.homeMasonryAlternative(this.sections));
    this.sections.register('home-collection-list', this.collectionList(this.sections));
    this.sections.register('home-featured-collection', this.featuredCollection(this.sections));
    this.sections.register('home-social-widgets', this.socialWidgets(this.sections));
    this.sections.register('home-testimonials', this.testimonials(this.sections));
    this.sections.register('home-video-with-text-overlay', this.videoWithTextOverlay(this.sections));
    this.sections.register('home-promotion', this.homePromotion(this.sections));
    return this.sections.register('home-blog', this.homeBlog(this.sections));
  };

  HomeView.prototype.homeSlideshow = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeSlideshowView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onBlockSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.onBlockSelect(event) : void 0;
      },
      onSectionUnload: function(event) {
        var instance, ref, ref1;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.unload();
        }
        if ((ref1 = this.instances[instance.sectionId]) != null) {
          ref1.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.homeMasonry = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeMasonryView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionDeselect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].prepareRemove();
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.homeMasonryAlternative = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeMasonryAlternativeView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionDeselect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.socialWidgets = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeSocialWidgetsView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionDeselect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.collectionList = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeCollectionsView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionDeselect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      },
      onBlockSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.onBlockSelect(event) : void 0;
      },
      onBlockDeselect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.onBlockDeselect(event) : void 0;
      }
    };
  };

  HomeView.prototype.featuredCollection = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeProductsView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance, ref, ref1;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.prepareRemove();
        }
        if ((ref1 = this.instances[instance.sectionId]) != null) {
          ref1.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.socialWidgets = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeSocialWidgetsView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionDeselect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.testimonials = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeTestimonialsView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        return this.onSectionLoad(event);
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].prepareRemove();
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      },
      onBlockSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.onBlockSelect(event) : void 0;
      }
    };
  };

  HomeView.prototype.videoWithTextOverlay = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeVideoWithTextOverlay({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        return this.onSectionLoad(event);
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].prepareRemove();
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.homePromotion = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomePromotionView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance;
        instance = sections.getInstance(event);
        return this.instances[instance.sectionId].adjustHeight();
      },
      onSectionDeSelect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionReorder: function() {
        var i, instance, len, ref, results;
        ref = this.instances;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          instance = ref[i];
          results.push(instance.onSectionReorder());
        }
        return results;
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].prepareRemove();
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      }
    };
  };

  HomeView.prototype.homeBlog = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HomeBlogView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].prepareRemove();
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      }
    };
  };

  return HomeView;

})(Backbone.View);

window.AccountView = (function(superClass) {
  extend(AccountView, superClass);

  function AccountView() {
    return AccountView.__super__.constructor.apply(this, arguments);
  }

  AccountView.prototype.events = {
    "click .delete-address": "deleteAddress",
    "click .edit-address": "editAddress",
    "click .add-new-address": "addNewAddress",
    "click .toggle-forgetfulness": "recoverPassword",
    "change .address-country": "updateProvinceSelectText"
  };

  AccountView.prototype.initialize = function() {
    var body;
    body = $(document.body);
    if (body.hasClass("template-customers-addresses")) {
      this.prepareAddresses();
    }
    if (body.hasClass("template-customers-login")) {
      this.checkForReset();
    }
    if (window.location.hash === "#recover") {
      return this.recoverPassword();
    }
  };

  AccountView.prototype.recoverPassword = function() {
    this.$(".recover-password").toggle();
    return this.$(".customer-login").toggle();
  };

  AccountView.prototype.checkForReset = function() {
    if (this.$(".reset-check").data("successful-reset") === true) {
      return this.$(".successful-reset").show();
    }
  };

  AccountView.prototype.prepareAddresses = function() {
    var address, addressID, addresses, i, len, results;
    new Shopify.CountryProvinceSelector("address-country", "address-province", {
      hideElement: "address-province-container"
    });
    addresses = this.$(".customer-address");
    if (addresses.length) {
      results = [];
      for (i = 0, len = addresses.length; i < len; i++) {
        address = addresses[i];
        addressID = $(address).data("address-id");
        results.push(new Shopify.CountryProvinceSelector("address-country-" + addressID, "address-province-" + addressID, {
          hideElement: "address-province-container-" + addressID
        }));
      }
      return results;
    }
  };

  AccountView.prototype.deleteAddress = function(e) {
    var addressID;
    addressID = $(e.target).parents("[data-address-id]").data("address-id");
    return Shopify.CustomerAddress.destroy(addressID);
  };

  AccountView.prototype.editAddress = function(e) {
    var addressID;
    addressID = $(e.target).parents("[data-address-id]").data("address-id");
    this.$(".customer-address").removeClass("editing").find(".edit-address").removeClass("disabled");
    this.$(".customer-address[data-address-id='" + addressID + "']").addClass("editing").find(".edit-address").addClass("disabled");
    this.$(".customer-address-edit-form, .customer-new-address").addClass("hidden");
    return this.$(".customer-address-edit-form[data-address-id='" + addressID + "']").removeClass("hidden");
  };

  AccountView.prototype.addNewAddress = function() {
    this.$(".customer-address").removeClass("editing").find(".edit-address").removeClass("disabled");
    this.$(".customer-address-edit-form").addClass("hidden");
    return this.$(".customer-new-address").removeClass("hidden");
  };

  AccountView.prototype.updateProvinceSelectText = function() {
    return this.$(".address-province").siblings(".selected-text").text("-- " + Theme.pleaseSelectText + " --");
  };

  return AccountView;

})(Backbone.View);

window.NotFoundView = (function(superClass) {
  extend(NotFoundView, superClass);

  function NotFoundView() {
    return NotFoundView.__super__.constructor.apply(this, arguments);
  }

  NotFoundView.prototype.events = {};

  NotFoundView.prototype.initialize = function() {};

  return NotFoundView;

})(Backbone.View);

window.PasswordView = (function(superClass) {
  extend(PasswordView, superClass);

  function PasswordView() {
    return PasswordView.__super__.constructor.apply(this, arguments);
  }

  PasswordView.prototype.el = document.body;

  PasswordView.prototype.events = {
    "click": "closeModal",
    "click .admin-login-modal": "openModal"
  };

  PasswordView.prototype.initialize = function() {
    this.modalWrapper = $(".password-page-modal-wrapper");
    this.modalContent = this.modalWrapper.find(".password-page-modal");
    this.openByDefault = this.modalWrapper.find("[data-open-modal]").length;
    if (this.openByDefault) {
      this.openModal();
    }
    return $(window).resize((function(_this) {
      return function() {
        return _this.positionModal();
      };
    })(this));
  };

  PasswordView.prototype.closeModal = function(e) {
    if (this.$(e.target).hasClass("visible")) {
      return this.modalWrapper.removeClass("visible").one("trend", (function(_this) {
        return function() {
          return _this.$el.removeClass("scroll-locked");
        };
      })(this));
    }
  };

  PasswordView.prototype.openModal = function() {
    this.$el.addClass("scroll-locked");
    this.positionModal();
    return this.modalWrapper.addClass("visible");
  };

  PasswordView.prototype.positionModal = function() {
    return this.modalContent.css({
      marginTop: -(this.modalContent.outerHeight() / 2),
      marginLeft: -(this.modalContent.outerWidth() / 2)
    });
  };

  return PasswordView;

})(Backbone.View);

window.GiftCardView = (function(superClass) {
  extend(GiftCardView, superClass);

  function GiftCardView() {
    return GiftCardView.__super__.constructor.apply(this, arguments);
  }

  GiftCardView.prototype.initialize = function() {
    return this.addQrCode();
  };

  GiftCardView.prototype.addQrCode = function() {
    var qrWrapper;
    qrWrapper = $('[data-qr-code]');
    return new QRCode(qrWrapper[0], {
      text: qrWrapper.data('qr-code'),
      width: 120,
      height: 120
    });
  };

  return GiftCardView;

})(Backbone.View);

window.BlogStaticView = (function(superClass) {
  extend(BlogStaticView, superClass);

  function BlogStaticView() {
    return BlogStaticView.__super__.constructor.apply(this, arguments);
  }

  BlogStaticView.prototype.events = {
    "change .blog-sidebar select": "filterBlog"
  };

  BlogStaticView.prototype.initialize = function() {
    this.initializedClass = 'blog-initialized';
    return this._validate();
  };

  BlogStaticView.prototype.update = function($el) {
    this.$el = $el;
    this._validate();
    if (this.$('.blog-tag-filter select')) {
      return new SelectView({
        el: this.$('.blog-tag-filter select')
      });
    }
  };

  BlogStaticView.prototype.remove = function() {
    BlogStaticView.__super__.remove.apply(this, arguments);
    return $(window).off("resize.blog-view");
  };

  BlogStaticView.prototype._validate = function() {
    if (window.innerWidth <= 1020) {
      this.positionSidebar("below");
    } else {
      this.positionSidebar();
    }
    this.$el.imagesLoaded((function(_this) {
      return function() {
        _this.setupFeaturedImage();
        return _this.setupFullWidthImages();
      };
    })(this));
    return $(window).on("resize.blog-view", (function(_this) {
      return function() {
        _this.setupFullWidthImages();
        if (window.innerWidth <= 1020) {
          return _this.positionSidebar("below");
        } else {
          _this.positionSidebar();
          return _this.setupFeaturedImage();
        }
      };
    })(this));
  };

  BlogStaticView.prototype.filterBlog = function(e) {
    var tag, url;
    if (!this.$el.is('[data-tag-filter]')) {
      return;
    }
    tag = this.$(e.target).val();
    url = this.$(e.target).data("url");
    if (tag === "all") {
      return window.location.href = "/blogs/" + url;
    } else {
      return window.location.href = "/blogs/" + url + "/tagged/" + tag;
    }
  };

  BlogStaticView.prototype.setupFeaturedImage = function(setup) {
    var i, image, len, post, ref, results;
    ref = this.$(".blog-post");
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      post = ref[i];
      post = $(post);
      image = post.find("img.highlight").first();
      if (image.length) {
        results.push(post.find(".blog-post-inner").css({
          "paddingTop": image.height() - 60
        }));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  BlogStaticView.prototype.setupFullWidthImages = function() {
    var i, image, len, postContent, postContentMargin, postContentWidth, ref, results;
    postContent = this.$(".post-content");
    postContentWidth = postContent.outerWidth(true);
    postContentMargin = postContent.css("marginLeft");
    ref = this.$("img.full-width");
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      image = ref[i];
      image = $(image);
      results.push(image.css({
        "width": postContentWidth,
        "left": "-" + postContentMargin
      }));
    }
    return results;
  };

  BlogStaticView.prototype.positionSidebar = function(position) {
    var sidebar;
    sidebar = this.$(".blog-sidebar");
    if (position === "below") {
      return sidebar.insertAfter(".blog-posts");
    } else {
      return sidebar.insertBefore(".blog-posts");
    }
  };

  return BlogStaticView;

})(Backbone.View);

window.BlogMasonryView = (function(superClass) {
  extend(BlogMasonryView, superClass);

  function BlogMasonryView() {
    return BlogMasonryView.__super__.constructor.apply(this, arguments);
  }

  BlogMasonryView.prototype.initialize = function() {
    this.$masonry = this.$el.find('[data-masonry-grid]');
    return this.masonryGrid = new MasonryGrid({
      $el: this.$masonry
    });
  };

  BlogMasonryView.prototype.onSectionUnload = function() {
    return this.masonryGrid.unload();
  };

  return BlogMasonryView;

})(Backbone.View);

window.BlogViewHandler = (function() {
  function BlogViewHandler($el) {
    var hasMasonryBlog, hasStaticBlog, selectors;
    this.$el = $el;
    this.sections = new ThemeEditor();
    selectors = {
      staticBlog: 'blog-static',
      masonryBlog: 'blog-masonry'
    };
    hasStaticBlog = this.$el.find("[data-section-type='" + selectors.staticBlog + "']").length;
    hasMasonryBlog = this.$el.find("[data-section-type='" + selectors.masonryBlog + "']").length;
    if (hasStaticBlog) {
      this.sections.register(selectors.staticBlog, this.staticBlog(this.sections));
    }
    if (hasMasonryBlog) {
      this.sections.register(selectors.masonryBlog, this.masonryBlog(this.sections));
    }
  }

  BlogViewHandler.prototype.staticBlog = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new BlogStaticView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionDeselect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  BlogViewHandler.prototype.masonryBlog = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new BlogMasonryView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].onSectionUnload();
        return delete this.instances[instance.sectionId];
      }
    };
  };

  return BlogViewHandler;

})();


/* Static sections */

window.NavigationView = (function(superClass) {
  extend(NavigationView, superClass);

  function NavigationView() {
    return NavigationView.__super__.constructor.apply(this, arguments);
  }

  NavigationView.prototype.events = {
    'mouseover .mega-nav-list a': 'swapMegaNavImages',
    'click .has-dropdown [data-subnav-toggle]': 'toggleNavTier',
    'mouseleave .has-mega-nav': 'useDefaultImage',
    'click [data-header-nav-toggle]': 'handleMobileNavigationToggle'
  };

  NavigationView.prototype.initialize = function() {
    this.$navigationWrapper = this.$('[data-navigation-wrapper]');
    this.$navigationContent = this.$('[data-navigation-content]');
    this.$body = $(document.body);
    this.transitionend = (function(transition) {
      var transEndEventNames;
      transEndEventNames = {
        '-webkit-transition': 'webkitTransitionEnd',
        '-moz-transition': 'transitionend',
        '-o-transition': 'oTransitionEnd',
        transition: 'transitionend'
      };
      return transEndEventNames[transition];
    })(Modernizr.prefixed('transition'));
    this.setupNavigation();
    return $(window).on('resize.navigation', (function(_this) {
      return function() {
        _this.setupNavigation();
        if (!window.ThemeUtils.isMedium() && _this.$body.hasClass('mobile-nav-open')) {
          _this.$navigationWrapper.removeClass('visible');
          return _this.toggleMobileNavigation('close');
        }
      };
    })(this));
  };

  NavigationView.prototype.unload = function() {
    $(window).off('resize.navigation');
    return this.toggleMobileNavigation('close');
  };

  NavigationView.prototype.setupNavigation = function() {
    if (!window.ThemeUtils.isMedium()) {
      this.$navigationWrapper.detach().insertAfter('[data-header-branding]');
      this.$navigationContent.removeClass('navigation-mobile').addClass('navigation-desktop');
      return this.$('li[data-mega-nav="true"]').removeClass('has-dropdown').addClass('has-mega-nav');
    } else {
      this.$navigationWrapper.detach().insertAfter('[data-header-main]');
      this.$navigationContent.removeClass('navigation-desktop').addClass('navigation-mobile');
      return this.$('li[data-mega-nav="true"]').removeClass('has-mega-nav').addClass('has-dropdown');
    }
  };

  NavigationView.prototype.swapMegaNavImages = function(e) {
    var image, imageAlt;
    image = this.$(e.target).parent().data('image');
    imageAlt = this.$(e.target).parent().data('image-alt');
    return this.$('.mega-nav-image img').attr('src', image).attr('alt', imageAlt);
  };

  NavigationView.prototype.handleMobileNavigationToggle = function() {
    if (this.$body.hasClass('mobile-nav-open')) {
      return this.toggleMobileNavigation('close');
    } else {
      return this.toggleMobileNavigation('open');
    }
  };

  NavigationView.prototype.toggleMobileNavigation = function(direction) {
    if (direction === 'open') {
      this.$body.addClass('mobile-nav-open lock-scroll');
      this.$navigationContent.addClass('visible');
      this.$navigationWrapper.addClass('visible background');
      return this.setTierHeight();
    } else if (direction === 'close') {
      this.$navigationContent.removeAttr('style');
      this.$body.removeClass('mobile-nav-open');
      this.$navigationContent.removeClass('visible');
      if (Modernizr.csstransitions) {
        this.$navigationWrapper.removeClass('background').one(this.transitionend, (function(_this) {
          return function() {
            _this.$navigationWrapper.removeClass('visible');
            return _this.$body.removeClass('lock-scroll');
          };
        })(this));
      } else {
        this.$navigationWrapper.removeClass('visible background');
        this.$body.removeClass('lock-scroll');
      }
      return this.$navigationContent.find('.has-dropdown-open').removeClass('has-dropdown-open').find('.navigation-submenu-visible').removeClass('navigation-submenu-visible');
    }
  };

  NavigationView.prototype.toggleNavTier = function(e) {
    var $parentEl, $target, $targetLinkList, $trigger;
    if (this.$navigationContent.hasClass('navigation-mobile')) {
      e.preventDefault();
    }
    $target = $(e.currentTarget);
    $trigger = $target.closest('a');
    $parentEl = $trigger.parent('li');
    $targetLinkList = this.$("ul[data-linklist='" + ($trigger.data('linklist-trigger')) + "']");
    if ($parentEl.hasClass('has-dropdown-open')) {
      return this.closeNavTier({
        $parentEl: $parentEl,
        $targetLinkList: $targetLinkList
      });
    } else {
      this.closeSiblingTiers($parentEl);
      return this.openNavTier({
        $parentEl: $parentEl,
        $targetLinkList: $targetLinkList
      });
    }
  };

  NavigationView.prototype.closeSiblingTiers = function($openMenu) {
    return $openMenu.siblings('.has-dropdown-open').each((function(_this) {
      return function(index, el) {
        var $parentEl, $targetLinkList;
        $parentEl = $(el);
        $targetLinkList = $parentEl.find('.navigation-submenu-visible');
        return _this.closeNavTier({
          $parentEl: $parentEl,
          $targetLinkList: $targetLinkList
        });
      };
    })(this));
  };

  NavigationView.prototype.openNavTier = function(options) {
    var $parentEl, $targetLinkList;
    $parentEl = options.$parentEl, $targetLinkList = options.$targetLinkList;
    $targetLinkList.addClass('navigation-submenu-visible');
    $parentEl.addClass('has-dropdown-open');
    return this.setTierHeight();
  };

  NavigationView.prototype.closeNavTier = function(options) {
    var $parentEl, $targetLinkList;
    $parentEl = options.$parentEl, $targetLinkList = options.$targetLinkList;
    $targetLinkList.removeClass('navigation-submenu-visible').find('.navigation-submenu-visible').removeClass('navigation-submenu-visible');
    $parentEl.removeClass('has-dropdown-open').find('.has-dropdown-open').removeClass('has-dropdown-open');
    return this.setTierHeight();
  };

  NavigationView.prototype.setTierHeight = function() {
    return this.$navigationContent.css({
      'overflow-y': 'scroll',
      'height': '100%'
    });
  };

  NavigationView.prototype.useDefaultImage = function() {
    var megaNavImage;
    megaNavImage = this.$('.mega-nav-image img');
    return megaNavImage.attr('src', megaNavImage.data('image')).attr('alt', megaNavImage.data('alt'));
  };

  return NavigationView;

})(Backbone.View);

window.HeaderView = (function(superClass) {
  extend(HeaderView, superClass);

  function HeaderView() {
    return HeaderView.__super__.constructor.apply(this, arguments);
  }

  HeaderView.prototype.initialize = function() {
    this.$window = $(window);
    this.$body = $(document.body);
    this.$header = this.$('[data-section-type="header"]');
    this.$mainHeader = this.$('[data-header-main]');
    this.$headerContent = this.$('[data-header-content]');
    this.$navigationWrapper = this.$('[data-navigation-wrapper]');
    this.$navigationContent = this.$('[data-navigation-content]');
    this.$branding = this.$('[data-header-branding]');
    this.$headerTools = this.$('.header-tools');
    this.$headerRight = this.$('[data-header-content-right]');
    this.$headerSearch = this.$('[data-header-search]');
    this.$headerSearchSubmit = this.$('[data-header-search-button]');
    this.$headerSearchClose = this.$('[data-header-search-button-close]');
    this.isStickyHeader = this.$el.is('[data-sticky-header]');
    this.isCompactCenter = this.$el.is('[data-header-compact-center]');
    this.navHeight = 0;
    this.windowWidth = window.ThemeUtils.windowWidth();
    setTimeout((function(_this) {
      return function() {
        return _this.navHeight = _this.$navigationWrapper.height();
      };
    })(this), 100);
    if (this.isStickyHeader && !window.ThemeUtils.isMedium() && !this.$body.hasClass('alternate-index-layout')) {
      this._toggleStickyHeader(true);
    } else {
      this._toggleStickyHeader(false);
    }
    this._triggerStickyHeader();
    this.navigation = new NavigationView({
      el: this.$el
    });
    this._setSearchWidth();
    this._setupBranding();
    this._setCompactCenterHeights();
    return this._bindEvents();
  };

  HeaderView.prototype.onSectionDeselect = function() {
    return this.navigation.toggleMobileNavigation('close');
  };

  HeaderView.prototype.unload = function() {
    this.navigation.unload();
    this.$window.off('.header');
    this.$headerSearchSubmit.off('.header-search');
    this.$headerSearchClose.off('.header-search');
    return this._triggerStickyHeader();
  };

  HeaderView.prototype._bindEvents = function() {
    this.$window.on('resize.header', (function(_this) {
      return function() {
        if (window.ThemeUtils.windowWidth() === _this.windowWidth) {
          return;
        }
        _this.windowWidth = window.ThemeUtils.windowWidth();
        _this.navHeight = _this.$navigationWrapper.height();
        _this._triggerStickyHeader();
        _this._setSearchWidth();
        _this._setCompactCenterHeights();
        if (!window.ThemeUtils.isMedium()) {
          return _this._toggleSearchForm(false);
        }
      };
    })(this));
    this.$window.on('scroll.header', (function(_this) {
      return function() {
        if (!_this.isStickyHeader) {
          _this._setCompactCenterHeights();
        }
        return _this._triggerStickyHeader();
      };
    })(this));
    this.$headerSearchSubmit.on('click.header-search', (function(_this) {
      return function(event) {
        var $target;
        $target = $(event.currentTarget);
        if (!window.ThemeUtils.isMedium()) {
          return;
        }
        if ($target.data('clicked')) {
          return;
        }
        event.preventDefault();
        $target.data('clicked', true);
        _this._bindCloseSearch();
        return _this._toggleSearchForm(true);
      };
    })(this));
    return this.$headerSearchClose.on('click.header-search', (function(_this) {
      return function(event) {
        event.preventDefault();
        return _this._toggleSearchForm(false);
      };
    })(this));
  };


  /*
      When search form is open, and receives click outside of form, close
   */

  HeaderView.prototype._bindCloseSearch = function() {
    return this.$body.on('click.header-search-close', event, (function(_this) {
      return function() {
        var $parent;
        $parent = $(event.target).parents('[data-header-search]');
        if ($parent.length) {
          return;
        }
        return _this._toggleSearchForm(false);
      };
    })(this));
  };

  HeaderView.prototype._triggerStickyHeader = function() {
    var toggleOn;
    toggleOn = false;
    if (!this.isStickyHeader) {
      return this._toggleStickyHeader(false);
    }
    if (this.$window.scrollTop() > this.$el.outerHeight()) {
      toggleOn = true;
    }
    if (window.ThemeUtils.isMedium() || this.$body.hasClass('alternate-index-layout')) {
      toggleOn = false;
    }
    return this._toggleStickyHeader(toggleOn);
  };

  HeaderView.prototype._toggleStickyHeader = function(toggleOn) {
    var paddingTop;
    if (toggleOn == null) {
      toggleOn = false;
    }
    paddingTop = toggleOn ? this.navHeight : 0;
    this.$body.css({
      paddingTop: paddingTop
    }).toggleClass('sticky-header', toggleOn);
    return this._setCompactCenterHeights(!toggleOn);
  };


  /*
      Expand search form logic
   */

  HeaderView.prototype._toggleSearchForm = function(open) {
    var headerRightWidth, headerSearchWidth, logoCollision, navCollision, ref, searchButtonWidth;
    if (open == null) {
      open = false;
    }
    headerRightWidth = '';
    headerSearchWidth = parseInt(this.$headerSearch.data('width'), 10);
    searchButtonWidth = this.$headerSearchClose.outerWidth(true);
    logoCollision = false;
    navCollision = false;
    if (open) {
      ref = this._logoSearchCollision(headerSearchWidth), logoCollision = ref.logoCollision, navCollision = ref.navCollision;
      headerRightWidth = headerSearchWidth + searchButtonWidth;
      headerSearchWidth = '100%';
    } else {
      this.$headerSearchSubmit.data('clicked', false);
      this.$body.off('.header-search-close');
    }
    if (!open && this.$mainHeader.hasClass('header-search-expanded')) {
      this.$mainHeader.addClass('header-search-expanded-closing', true);
    }
    this.$mainHeader.toggleClass('header-search-expanded', open);
    this.$mainHeader.toggleClass('header-nav-toggle-covered', navCollision);
    this.$mainHeader.toggleClass('header-logo-covered', logoCollision).one('trend', (function(_this) {
      return function() {
        if (!open) {
          return _this.$mainHeader.removeClass('header-search-expanded-closing');
        }
      };
    })(this));
    this.$headerRight.css({
      width: headerRightWidth
    });
    return this.$headerSearch.css({
      width: headerSearchWidth
    });
  };


  /*
      Detect if Logo or nav toggle will be covered by expanded search form
   */

  HeaderView.prototype._logoSearchCollision = function(headerSearchWidth) {
    var logoCollision, logoRightEdge, navCollision, navRightEdge, searchLeftEdge;
    logoRightEdge = document.querySelector('[data-header-branding] .logo-link').getBoundingClientRect().right;
    navRightEdge = document.querySelector('[data-header-content] [data-header-nav-toggle]').getBoundingClientRect().right;
    searchLeftEdge = document.querySelector('[data-header-search]').getBoundingClientRect().left - headerSearchWidth;
    logoCollision = logoRightEdge > searchLeftEdge;
    navCollision = navRightEdge > searchLeftEdge;
    return {
      logoCollision: logoCollision,
      navCollision: navCollision
    };
  };


  /*
      Match Navigation and Branding heights
      Center navigation vertically if Branding is taller
   */

  HeaderView.prototype._setCompactCenterHeights = function(toggleOn) {
    var heights, minHeight, navHeight, navOffset;
    if (toggleOn == null) {
      toggleOn = true;
    }
    if (!this.isCompactCenter) {
      return;
    }
    minHeight = 'auto';
    navHeight = this.$navigationContent.outerHeight(true);
    navOffset = 0;
    if (!window.ThemeUtils.isMedium() && toggleOn) {
      heights = [];
      heights.push(navHeight);
      heights.push(this.$branding.outerHeight(true));
      minHeight = Math.max.apply(null, heights);
    }
    if (navHeight < minHeight) {
      navOffset = (minHeight - navHeight) / 2;
    }
    this.navHeight = this.$navigationWrapper.height();
    this.$navigationWrapper.css('margin-top', navOffset);
    return this.$headerContent.css({
      minHeight: minHeight
    });
  };

  HeaderView.prototype._setupBranding = function() {
    var $mobileBranding;
    $mobileBranding = this.$branding.clone();
    $mobileBranding.removeAttr('data-header-branding').removeClass('header-branding-desktop').addClass('header-branding-mobile');
    return this.$navigationContent.prepend($mobileBranding);
  };

  HeaderView.prototype._setSearchWidth = function() {
    var searchWidth;
    searchWidth = this.$mainHeader.find('.mini-cart-wrapper').outerWidth(true) + this.$mainHeader.find('.checkout-link').outerWidth(true);
    this.$headerSearch.width(searchWidth);
    return this.$headerSearch.data('width', searchWidth);
  };

  return HeaderView;

})(Backbone.View);

window.CollectionView = (function(superClass) {
  extend(CollectionView, superClass);

  function CollectionView() {
    return CollectionView.__super__.constructor.apply(this, arguments);
  }

  CollectionView.prototype.events = {
    'change [data-collection-tags]': 'filterCollection',
    'change [data-collection-sorting]': 'sortCollection'
  };

  CollectionView.prototype.initialize = function() {
    this.$masonry = this.$('[data-masonry-grid]');
    this.masonryGrid = null;
    this.$collectionTags = this.$('[data-collection-tags]');
    this.$collectionSorting = this.$('[data-collection-sorting]');
    if (this.$collectionTags.length) {
      new SelectView({
        el: this.$collectionTags
      });
    }
    if (this.$collectionSorting.length) {
      new SelectView({
        el: this.$collectionSorting
      });
    }
    if (this.$masonry.length) {
      return this.masonryGrid = new MasonryGrid({
        $el: this.$masonry,
        settings: {
          itemSelector: '.product-list-item'
        }
      });
    }
  };

  CollectionView.prototype.onSectionUnload = function() {
    if (this.masonryGrid) {
      return this.masonryGrid.unload();
    }
  };

  CollectionView.prototype.filterCollection = function(event) {
    var $target, tag, url;
    $target = $(event.currentTarget);
    tag = $target.val();
    url = $target.data('url');
    if (tag === "all") {
      return window.location.href = "/collections/" + url;
    } else {
      return window.location.href = "/collections/" + url + "/" + tag;
    }
  };

  CollectionView.prototype.sortCollection = function(event) {
    var $target, Sorting, currentSearch, i, index, len, part, search, searchParts;
    $target = $(event.currentTarget);
    Sorting = {};
    Sorting.sort_by = $target.val();
    if ($target.closest('.select-wrapper').hasClass('vendor-collection')) {
      currentSearch = location.search;
      searchParts = currentSearch.split('&');
      for (index = i = 0, len = searchParts.length; i < len; index = ++i) {
        part = searchParts[index];
        if (part.indexOf('sort_by') !== -1) {
          searchParts.splice(index, 1);
        }
      }
      search = searchParts.join('&');
      return location.search = search + "&" + (jQuery.param(Sorting));
    } else {
      return location.search = jQuery.param(Sorting);
    }
  };

  return CollectionView;

})(Backbone.View);

window.ArticleView = (function(superClass) {
  extend(ArticleView, superClass);

  function ArticleView() {
    return ArticleView.__super__.constructor.apply(this, arguments);
  }

  ArticleView.prototype.initialize = function() {
    this.initializedClass = 'article-initialized';
    return this._validate();
  };

  ArticleView.prototype.update = function($el) {
    this.$el = $el;
    return this._validate();
  };

  ArticleView.prototype.remove = function() {
    ArticleView.__super__.remove.apply(this, arguments);
    return $(window).off("resize.article-view");
  };

  ArticleView.prototype._validate = function() {
    if (window.innerWidth <= 1020) {
      this.positionSidebar("below");
    } else {
      this.positionSidebar();
    }
    this.$el.imagesLoaded((function(_this) {
      return function() {
        _this.setupFeaturedImage();
        return _this.setupFullWidthImages();
      };
    })(this));
    return $(window).on("resize.article-view", (function(_this) {
      return function() {
        _this.setupFullWidthImages();
        if (window.innerWidth <= 1020) {
          return _this.positionSidebar("below");
        } else {
          _this.positionSidebar();
          return _this.setupFeaturedImage();
        }
      };
    })(this));
  };

  ArticleView.prototype.setupFeaturedImage = function(setup) {
    var i, image, len, post, ref, results;
    ref = this.$(".blog-post");
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      post = ref[i];
      post = $(post);
      image = post.find("img.highlight").first();
      if (image.length) {
        results.push(post.find(".blog-post-inner").css({
          "paddingTop": image.height() - 60
        }));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  ArticleView.prototype.setupFullWidthImages = function() {
    var i, image, len, postContent, postContentMargin, postContentWidth, ref, results;
    postContent = this.$(".post-content");
    postContentWidth = postContent.outerWidth(true);
    postContentMargin = postContent.css("marginLeft");
    ref = this.$("img.full-width");
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      image = ref[i];
      image = $(image);
      results.push(image.css({
        "width": postContentWidth,
        "left": "-" + postContentMargin
      }));
    }
    return results;
  };

  ArticleView.prototype.positionSidebar = function(position) {
    var sidebar;
    sidebar = this.$(".blog-sidebar");
    if (position === "below") {
      return sidebar.insertAfter(".blog-post-wrapper");
    } else {
      return sidebar.insertBefore(".blog-post-wrapper");
    }
  };

  return ArticleView;

})(Backbone.View);

window.CartView = (function(superClass) {
  extend(CartView, superClass);

  function CartView() {
    return CartView.__super__.constructor.apply(this, arguments);
  }

  CartView.prototype.events = {
    "click .get-rates": "getRates",
    "change .cart-instructions textarea": "saveSpecialInstructions"
  };

  CartView.prototype.initialize = function() {
    this.initializedClass = 'cart-initialized';
    return this._validate();
  };

  CartView.prototype.update = function($el) {
    this.$el = $el;
    return this._validate();
  };

  CartView.prototype._validate = function() {
    this.hasShippingCalculator = this.$el.is("[data-shipping-calculator]");
    if (this.hasShippingCalculator) {
      this.shippingCalculator();
      if (Theme.customerLoggedIn && Theme.customerAddress && Theme.customerAddress.country) {
        this.calculateShipping(true);
      }
    }
    return Shopify.onError = (function(_this) {
      return function(XMLHttpRequest) {
        return _this.handleErrors(XMLHttpRequest);
      };
    })(this);
  };

  CartView.prototype.saveSpecialInstructions = function() {
    var newNote;
    newNote = $(".cart-instructions textarea").val();
    return Shopify.updateCartNote(newNote, function(cart) {});
  };

  CartView.prototype.updateShippingLabel = function(select) {
    var selectedVariant;
    if (select) {
      select = $(select);
      selectedVariant = select.find("option:selected").val();
      return select.prev(".selected-option").text(selectedVariant);
    }
  };

  CartView.prototype.shippingCalculator = function() {
    var selectableOptions;
    Shopify.Cart.ShippingCalculator.show({
      submitButton: Theme.shippingButton,
      submitButtonDisabled: Theme.shippingDisabled,
      customerIsLoggedIn: Theme.customerLoggedIn,
      moneyFormat: Theme.moneyFormat
    });
    selectableOptions = this.$(".cart-shipping-calculator select");
    setTimeout((function(_this) {
      return function() {
        var i, len, results, select;
        results = [];
        for (i = 0, len = selectableOptions.length; i < len; i++) {
          select = selectableOptions[i];
          results.push(_this.updateShippingLabel(select));
        }
        return results;
      };
    })(this), 500);
    return this.$(".cart-shipping-calculator select").change((function(_this) {
      return function(e) {
        var i, len, results, select;
        results = [];
        for (i = 0, len = selectableOptions.length; i < len; i++) {
          select = selectableOptions[i];
          results.push(_this.updateShippingLabel(select));
        }
        return results;
      };
    })(this));
  };

  CartView.prototype.getRates = function() {
    return this.calculateShipping();
  };

  CartView.prototype.calculateShipping = function(auto) {
    var ratesFeedback, shippingAddress, shippingCalculatorResponse;
    shippingCalculatorResponse = this.$(".cart-shipping-calculator-response");
    shippingCalculatorResponse.empty().append("<p class='shipping-calculator-response message'/><ul class='shipping-rates'/>");
    ratesFeedback = $(".shipping-calculator-response");
    this.$(".get-rates").val(Theme.shippingDisabled);
    if (auto) {
      shippingAddress = Theme.customerAddress;
    } else {
      shippingAddress = {};
      shippingAddress.zip = this.$(".address-zip").val() || "";
      shippingAddress.country = this.$(".address-country").val() || "";
      shippingAddress.province = this.$(".address-province").val() || "";
    }
    return Shopify.getCartShippingRatesForDestination(shippingAddress, function(rates) {
      var address, firstRate, i, len, price, rate, rateValues, response;
      address = shippingAddress.zip + ", " + shippingAddress.province + ", " + shippingAddress.country;
      if (!shippingAddress.province.length) {
        address = shippingAddress.zip + ", " + shippingAddress.country;
      }
      if (!shippingAddress.zip.length) {
        address = shippingAddress.province + ", " + shippingAddress.country;
      }
      if (!(shippingAddress.province.length && shippingAddress.zip.length)) {
        address = shippingAddress.country;
      }
      if (rates.length > 1) {
        firstRate = Shopify.Cart.ShippingCalculator.formatRate(rates[0].price);
        response = Theme.shippingCalcMultiRates.replace("**address**", address).replace("**number_of_rates**", rates.length).replace("**rate**", "<span class='money'>" + firstRate + "</span>");
        ratesFeedback.html(response);
      } else if (rates.length === 1) {
        response = Theme.shippingCalcOneRate.replace("**address**", address);
        ratesFeedback.html(response);
      } else {
        ratesFeedback.html(Theme.shippingCalcNoRates);
      }
      for (i = 0, len = rates.length; i < len; i++) {
        rate = rates[i];
        price = Shopify.Cart.ShippingCalculator.formatRate(rate.price);
        rateValues = Theme.shippingCalcRateValues.replace("**rate_title**", rate.name).replace("**rate**", "<span class='money'>" + price + "</span>");
        this.$(".shipping-rates").append("<li>" + rateValues + "</li>");
      }
      return this.$(".get-rates").val(Theme.shippingButton);
    });
  };

  CartView.prototype.handleErrors = function(errors) {
    var errorMessage;
    errorMessage = $.parseJSON(errors.responseText);
    errorMessage = Theme.shippingCalcErrorMessage.replace("**error_message**", errorMessage.zip);
    this.$(".cart-shipping-calculator-response").html("<p>" + errorMessage + "</p>");
    return this.$(".get-rates").val(Theme.shippingButton);
  };

  return CartView;

})(Backbone.View);

window.ListCollections = (function(superClass) {
  extend(ListCollections, superClass);

  function ListCollections($el) {
    this.$masonry = $el.find('[data-masonry-grid]');
    this.masonryGrid = null;
    if (this.$masonry.length) {
      this.masonryGrid = new MasonryGrid({
        $el: this.$masonry
      });
    }
  }

  ListCollections.prototype.onSectionUnload = function() {
    if (this.masonryGrid) {
      return this.masonryGrid.unload();
    }
  };

  return ListCollections;

})(Backbone.View);

window.ThemeView = (function(superClass) {
  extend(ThemeView, superClass);

  function ThemeView() {
    return ThemeView.__super__.constructor.apply(this, arguments);
  }

  ThemeView.prototype.el = document.body;

  ThemeView.prototype.events = {
    'submit .contact-form': 'spamCheck'
  };

  ThemeView.prototype.initialize = function() {
    var body;
    body = $(document.body);
    this.isHome = body.hasClass("template-index");
    this.isCollection = body.hasClass("template-collection");
    this.isListCollections = body.hasClass("template-list-collections");
    this.isProduct = body.hasClass("template-product");
    this.isCart = body.hasClass("template-cart");
    this.isPage = body.hasClass("template-page");
    this.isBlog = body.hasClass("template-blog");
    this.isArticle = body.hasClass("template-article");
    this.isAccount = body.attr("class").indexOf("-customers-") > 0;
    this.is404 = body.hasClass("template-404");
    this.isSearch = body.hasClass("template-search");
    this.isPasswordPage = body.hasClass("template-password");
    this.isGiftCardPage = body.hasClass("gift-card-template");
    this.sectionBinding();
    if (navigator.userAgent.indexOf("MSIE 10") !== -1) {
      this.$el.addClass("ie10");
    }
    $(window).load((function(_this) {
      return function() {
        return body.removeClass("loading");
      };
    })(this));
    return $(window).on('dragStart', (function(_this) {
      return function(event) {
        var $flickityEnabledEl, $target, flickity;
        $target = $(event.target);
        $flickityEnabledEl = $target.closest('.flickity-enabled');
        if (!$flickityEnabledEl.length) {
          return;
        }
        flickity = Flickity.data($flickityEnabledEl[0]);
        return window.removeEventListener('scroll', flickity);
      };
    })(this));
  };

  ThemeView.prototype.render = function() {
    var i, j, l, len, len1, len2, productItem, ref, ref1, ref2, rte, select;
    if (Theme.currencySwitcher) {
      this.currencyView = new CurrencyView({
        el: this.$(".currency-switcher")
      });
      this.$(".currency-switcher").trigger('switch-currency');
    }
    if (this.isHome) {
      new HomeView({
        el: this.$el
      });
    }
    if (this.isAccount) {
      new AccountView({
        el: this.$el
      });
    }
    if (this.is404) {
      new NotFoundView({
        el: this.$el
      });
    }
    if (this.isSearch && Theme.quickShop) {
      new QuickShopView({
        el: this.$(".search-results-products")
      });
    }
    if (this.isPasswordPage) {
      new PasswordView();
    }
    if (this.isGiftCardPage) {
      new GiftCardView();
    }
    if (!this.isProduct) {
      ref = $(".rte");
      for (i = 0, len = ref.length; i < len; i++) {
        rte = ref[i];
        new RTEView({
          el: rte
        });
      }
      ref1 = $("select");
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        select = ref1[j];
        new SelectView({
          el: select
        });
      }
    }
    if (!this.isHome) {
      ref2 = $(".product-list-item");
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        productItem = ref2[l];
        new ProductListItemView({
          el: productItem
        });
      }
    }
    if ($("html").hasClass("lt-ie10")) {
      return this.inputPlaceholderFix();
    }
  };

  ThemeView.prototype.sectionBinding = function() {
    this.sections = new ThemeEditor();
    this.sections.register('header', this.header(this.sections));
    if (this.isListCollections) {
      this.sections.register('collections-list', this.listCollections(this.sections));
    }
    if (this.isCollection) {
      this.sections.register('collection', this.collection(this.sections));
    }
    if (this.isBlog) {
      new BlogViewHandler(this.$el);
    }
    if (this.isArticle) {
      this.sections.register('article', this.article(this.sections));
    }
    if (this.isCart) {
      this.sections.register('cart', this.cart(this.sections));
    }
    if (this.isProduct) {
      this.sections.register('product', this.product(this.sections));
    }
    $(document).on('shopify:section:load', (function(_this) {
      return function() {
        if (_this.currencyView) {
          _this.currencyView.unload();
          _this.currencyView = null;
        }
        if (Theme.currencySwitcher) {
          _this.currencyView = new CurrencyView({
            el: _this.$(".currency-switcher")
          });
          return _this.$(".currency-switcher").trigger('switch-currency');
        }
      };
    })(this));
    return $(document).on('shopify:section:unload', (function(_this) {
      return function() {
        if (_this.currencyView) {
          _this.currencyView.unload();
          return _this.currencyView = null;
        }
      };
    })(this));
  };

  ThemeView.prototype.header = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new HeaderView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionDeselect: function(event) {
        var instance;
        instance = sections.getInstance(event);
        return this.instances[instance.sectionId].onSectionDeselect();
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].unload();
        return delete this.instances[instance.sectionId];
      }
    };
  };

  ThemeView.prototype.listCollections = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new ListCollections(instance.$container);
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].onSectionUnload();
        return delete this.instances[instance.sectionId];
      }
    };
  };

  ThemeView.prototype.collection = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new CollectionView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].onSectionUnload();
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  ThemeView.prototype.article = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new ArticleView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionDeselect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  ThemeView.prototype.cart = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new CartView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionSelect: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        return (ref = this.instances[instance.sectionId]) != null ? ref.update(instance.$container) : void 0;
      },
      onSectionDeselect: function(event) {
        return this.onSectionSelect(event);
      },
      onSectionUnload: function(event) {
        var instance, ref;
        instance = sections.getInstance(event);
        if ((ref = this.instances[instance.sectionId]) != null) {
          ref.remove();
        }
        return delete this.instances[instance.sectionId];
      }
    };
  };

  ThemeView.prototype.product = function(sections) {
    return {
      instances: {},
      init: function(instance) {
        return this.instances[instance.sectionId] = new ProductView({
          el: instance.$container
        });
      },
      onSectionLoad: function(event) {
        var instance;
        instance = sections.getInstance(event);
        if (this.instances[instance.sectionId] == null) {
          return this.init(instance);
        }
      },
      onSectionUnload: function(event) {
        var instance;
        instance = sections.getInstance(event);
        this.instances[instance.sectionId].onSectionUnload();
        this.instances[instance.sectionId].remove();
        return delete this.instances[instance.sectionId];
      }
    };
  };

  ThemeView.prototype.inputPlaceholderFix = function() {
    var i, input, len, placeholders, text;
    placeholders = $("[placeholder]");
    for (i = 0, len = placeholders.length; i < len; i++) {
      input = placeholders[i];
      input = $(input);
      if (!(input.val().length > 0)) {
        text = input.attr("placeholder");
        input.attr("value", text);
        input.data("original-text", text);
      }
    }
    placeholders.focus(function() {
      input = $(this);
      if (input.val() === input.data("original-text")) {
        return input.val('');
      }
    });
    return placeholders.blur(function() {
      input = $(this);
      if (input.val().length === 0) {
        return input.val(input.data("original-text"));
      }
    });
  };

  ThemeView.prototype.spamCheck = function(e) {
    if (this.$(e.target).find('.comment-check').val().length > 0) {
      return e.preventDefault();
    }
  };

  return ThemeView;

})(Backbone.View);

$(function() {
  window.theme = new ThemeView();
  return theme.render();
});

   $(document).ready(function() {
    $('ul.tabs').each(function(){
      var active, content, links = $(this).find('a');
      active = links.first().addClass('active');
      content = $(active.attr('href'));
      links.not(':first').each(function () {
        $($(this).attr('href')).hide();
      });
      $(this).find('a').click(function(e){
        active.removeClass('active');
        content.hide();
        active = $(this);
        content = $($(this).attr('href'));
        active.addClass('active');
        content.show();
        return false;
      });
    });
  });
  
  
  
 
  $(document).ready(function() {
    function close_accordion_section() {
        $('.accordion .accordion-section-title').removeClass('active');
        $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
    }
    
    $('.cls').click(function(e) {
      	$(".mini-cart").hide(); 
    });
    
     $('#purpose').on('change', function() {
      if ( this.value == '1')
      {
        $(".desc").hide();
      	$("#size-guide-wrapper-women").show(); 
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      }
      else if(this.value == '2')
      {
        $(".desc").hide();
      	$("#size-guide-wrapper-men").show(); 
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      }
      else if(this.value == '3')
      {
        $(".desc").hide();
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      	document.getElementById("demo").innerHTML = "";
      	document.getElementById("demo").innerHTML = '<img src="https://cdn.shopify.com/s/files/1/2135/4653/files/Unisex_Tank_Size_Chart_a04e9bdd-3e37-44d1-9fcf-f16499ad11d7.png?907676370675097067" />';
        
      }
      else if(this.value == '4')
      {
        $(".desc").hide();
      	$("#size-guide-wrapper-grip").show(); 
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      }
      else if(this.value == '5')
      {
        $(".desc").hide();
      	$("#size-guide-wrapper-gear").show(); 
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      }
      else if(this.value == '6')
      {
        $(".desc").hide();
      	$("#size-guide-wrapper-fortify").show();
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      }
       
    });
    
    $('#women').click(function(e) {
        $(".desc").hide();
      	$("#size-guide-wrapper-women").show(); 
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      	
      	
      
    });
    
    $('#men').click(function(e) {
      	$(".desc").hide();
      	$("#size-guide-wrapper-men").show(); 
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
    });
    
     
    $('#gear').click(function(e) {
      	$(".desc").hide();
      	$("#size-guide-wrapper-gear").show(); 
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
    });
    
    $('#grip-gloves').click(function(e) {
      	$(".desc").hide();
      	$("#size-guide-wrapper-grip").show(); 
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
    });
    
    $('#fortify').click(function(e) {
      	$(".desc").hide();
      	$("#size-guide-wrapper-fortify").show();
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
    });
    
    $('#unisex').click(function(e) {
      	$(".desc").hide();
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      	document.getElementById("demo").innerHTML = "";
      	document.getElementById("demo").innerHTML = '<img src="https://cdn.shopify.com/s/files/1/2135/4653/files/Unisex_Tank_Size_Chart_a04e9bdd-3e37-44d1-9fcf-f16499ad11d7.png?907676370675097067" />';
    });
    
    
    $('#general').click(function(e) {
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      	$('#women').css("background-color", "#2ca5cb", "color", "#fff");
      	document.getElementById("demo").innerHTML = '<img src="https://cdn.shopify.com/s/files/1/2135/4653/files/Women_general_-_All_Clothing_32abfc30-56a3-415e-837f-5207063c187b.png?16692068718882125492" />';
      	

    });
    
    $('#top').click(function(e) {
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      	$('#women').css({"background-color": "#2ca5cb", "color": "#fff"});
      	document.getElementById("demo").innerHTML = '<img src="https://cdn.shopify.com/s/files/1/2135/4653/files/Womens_top_end_measurements_size_chart-crops_ladies_tank_41e65811-ee72-467f-b767-0ab3179a1b06.png?16692068718882125492" />';

    });
    $('#bottom').click(function(e) {
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");	
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      	$('#women').css({"background-color": "#2ca5cb", "color": "#fff"});
      	document.getElementById("demo").innerHTML = '<img src="https://cdn.shopify.com/s/files/1/2135/4653/files/Womens_ankle_freezer_booty_shorts_measurements_size_chart_4718b8f3-c570-4ac3-bfc4-1514317386cd.png?16692068718882125492" />';

    });
    $('#general-men').click(function(e) {
      	document.getElementById("demo").innerHTML = "";
      	$('.btn').css("background-color", "#000");
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      	$('#men').css({"background-color": "#2ca5cb", "color": "#fff"});
      	document.getElementById("demo").innerHTML = '<img src="https://cdn.shopify.com/s/files/1/2135/4653/files/Mens_T-shirt_Measurements_Size_Chart_790a93c2-db83-4741-86ac-c62f8a466bf7.png?16692068718882125492" />';

    });
    $('#top-men').click(function(e) {
      	document.getElementById("demo").innerHTML = '';
      	$('.btn').css("background-color", "#000");	
      	$(this).css({"background-color": "#2ca5cb", "color": "#fff"});
      	$('#men').css({"background-color": "#2ca5cb", "color": "#fff"});
      	document.getElementById("demo").innerHTML = '<img src="https://cdn.shopify.com/s/files/1/2135/4653/files/Mens_Bottom_Measurement_Chart_6eca002a-ee61-4f6c-bd86-31324bfac7a1.png?16692068718882125492" />';

    });
    
    $('.accordion-section-title').click(function(e) {
        // Grab current anchor value
        var currentAttrValue = $(this).attr('href');
 
        if($(e.target).is('.active')) {
            close_accordion_section();
        }else {
            close_accordion_section();
 
            // Add active class to section title
            $(this).addClass('active');
            // Open up the hidden content panel
            $('.accordion ' + currentAttrValue).slideDown(300).addClass('open'); 
        }
 
        e.preventDefault();
    });
});
