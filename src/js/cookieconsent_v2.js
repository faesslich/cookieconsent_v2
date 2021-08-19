/* global $, ga, cookieConsent, piwikId */

const $q = document.querySelector.bind(document);

const defaultObj = {
  cookies: {
    necessary: {},
    analytics: {},
    marketing: {}
  }
};

const cookieConsent = {
  initobj: false,
  setupcomplete: false,
  allasked: false,
  checkedlocal: false,
  agreeAll: true,
  cookies: {},
  approved: {},
  settings: {
    cookieExpire: 365,
    position: 'bottom', // 'overlay', bottom', 'top' are available by default
    showTypeDescription: true // 'true' by default
  },
  strings: {
    notificationTitle: 'Diese Webseite verwendet Cookies',
    notificationDescription:
      'Diese Webseite verwendet Cookies, um Ihnen ein optimales Erlebnis bieten zu können. '
      + 'Dazu gehören ggf. notwendige Cookies, durch welche unsere Webseite alle Funktionen bereitstellen kann, '
      + 'und Performance Cookies um unsere Webseite schneller zu machen. '
      + 'Weiterhin setzen wir ggf. Cookies zur Erstellung anonymer Statistiken oder für die Anzeige und Funktion '
      + 'personalisierter (Werbe-) Inhalte. '
      + 'Weitere Informationen, auch zu Ihrem jederzeitigen Widerrufsrecht, finden Sie in unserer '
      + '<a href="{{ link }}">{{ linkText }}</a>.<br>',
    defaultTitle: 'Title',
    defaultDescription: 'Description',
    necessaryTitle: 'Notwendig',
    necessaryDescription: 'Diese Cookies sind notwendig, damit unsere Webseite wie z.B. das Navigieren oder der '
      + 'Zugang zu persönlichen Bereichen ordnungsgemäß funktioniert. Ohne diese Cookies würde unsere Webseite nicht '
      + 'einwandfrei funktionieren.',
    analyticsDefaultTitle: 'Statistik',
    analyticsDefaultDescription: 'Statistische Cookies helfen uns zu verstehen wie die Besucher mit unserer Webseite '
      + 'interagieren. Dazu erfassen wir Informationen wie Besucherzahlen, Aufenthaltszeiten und Ähnliches.',
    marketingTitle: 'Marketing / Tracking',
    marketingDescription: 'Diese Cookies nutzen wir, um Besucher über verschiedene Webseiten zu identifizieren. '
      + 'Ziel ist es den Besuchern für sie relevante und interessante Werbung anzeigen zu können.',
    seeDetails: 'Details anzeigen',
    hideDetails: 'Details ausblenden',
    savePreference: 'Einstellungen speichern',
    allowCookies: 'Alle Cookies akzeptieren',
    link: '/de/Datenschutzerklaerung.htm',
    linkText: 'Datenschutzerklärung'
  },

  initiliazePiwik: function (siteId, url) {
    const _paq = _paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    const u = url;
    _paq.push(['setTrackerUrl', u + 'piwik.php']);
    _paq.push(['setSiteId', siteId]);
    const g = document.createElement('script');
    const s = document.getElementsByTagName('script')[0];
    g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'piwik.js'; s.parentNode.insertBefore(g, s);
  },

  /**
   * setup consent box content
   */
  setup: function () {
    for (const [key, value] of Object.entries(cookieConsent.initobj.cookies)) {
      if (key === 'analytics') {
        cookieConsent.initobj.cookies[key].title = cookieConsent.strings.analyticsDefaultTitle;
        cookieConsent.initobj.cookies[key].description = cookieConsent.strings.analyticsDefaultDescription;
      } else if (key === 'marketing') {
        cookieConsent.initobj.cookies[key].title = cookieConsent.strings.marketingTitle;
        cookieConsent.initobj.cookies[key].description = cookieConsent.strings.marketingDescription;
      } else if (key === 'necessary') {
        cookieConsent.initobj.cookies[key].title = cookieConsent.strings.necessaryTitle;
        cookieConsent.initobj.cookies[key].description = cookieConsent.strings.necessaryDescription;
      } else {
        cookieConsent.initobj.cookies[key].title = cookieConsent.strings.defaultTitle;
        cookieConsent.initobj.cookies[key].description = cookieConsent.strings.defaultDescription;
      }

      if (!value.defaultstate) {
        cookieConsent.initobj.cookies[key].defaultstate = 'on';
      }

      cookieConsent.initobj.cookies[key].asked = false;
      cookieConsent.initobj.cookies[key].approved = false;
      cookieConsent.initobj.cookies[key].executed = false;
    }

    for (const [key, value] of Object.entries(cookieConsent.cookies)) {
      $q('#cookieConsent-checkbox-' + key).setAttribute('checked', 'checked');
      this.parentElement.classList.remove('cookie-consent-notification-permissions-inactive');
    }

    for (let attrname in cookieConsent.initobj.cookies) {
      cookieConsent.cookies[attrname] = cookieConsent.initobj.cookies[attrname];
    }
  },

  /**
   * initialise method
   * @param obj
   */
  initialise: function (obj) {
    cookieConsent.initobj = { ...defaultObj, ...obj };

    if (obj.settings !== undefined && obj.settings !== 'undefined') {
      for (let attrNameSettings in obj.settings) {
        this.settings[attrNameSettings] = obj.settings[attrNameSettings];
      }
    }

    if (obj.strings !== undefined && obj.strings !== 'undefined') {
      for (let attrNameStrings in obj.strings) {
        this.strings[attrNameStrings] = obj.strings[attrNameStrings];
      }
    }

    cookieConsent.setupcomplete = true;
    cookieConsent.setup();
  },

  /**
   * @returns {boolean}
   */
  triggerThirdpartyScripts: function () {
    /**
     * Place analytics scripts (eg. GA & Matomo) here
     */
    if (cookieConsent.getCookie('cc_analytics') === 'true') {
      // scripts here
    }

    /**
     * Place marketing/tracking scripts (eg. GTM or FBP) here
     */
    if (cookieConsent.getCookie('cc_marketing') === 'true') {
      // scripts here
    }

    /**
     * Place analytics or marketing/tracking scripts here if unnecessary if analytics or marketing cookies are allowed.
     */
    if (cookieConsent.getCookie('cc_analytics') === 'true' || cookieConsent.getCookie('cc_marketing') === 'true') {
      cookieConsent.initiliazePiwik(piwikId, '//analytics.hybrid-cms.de/');
    }

    return false;
  },


  /**
   * show Consent Box
   */
  showConsentBox: function (cookies) {
    let allCustom = true;
    let ccWrapper = $q('#cookie-consent-notification');
    let notificationDescription = cookieConsent.strings.notificationDescription
      .replace('{{ link }}', cookieConsent.strings.link)
      .replace('{{ linkText }}', cookieConsent.strings.linkText);
    let data = '<div id="cookie-consent-notification" class="position-' + cookieConsent.settings.position + '">'
      + '<div id="cookie-consent-notification-wrapper">'
      + '<div class="cookie-consent-notification-headline">' + cookieConsent.strings.notificationTitle + '</div>'
      + '<div class="cookie-consent-notification-content"><p>' + notificationDescription + '</p></div>'
      + '<div id="cookie-consent-notification-permissions"></div>'
      + '<ul class="cookie-consent-notification-buttons">'
      + '<li>'
      + '<a class="cookieConsent-link btn -primary -full-mobile" href="#" id="cookieConsent-approve-button-thissite">'
      + cookieConsent.strings.allowCookies
      + '</a>'
      + '</li>'
      + '</ul>'
      + '</div>'
      + '</div>';

    if (ccWrapper) {
      ccWrapper.remove();
    }

    document.body.innerHTML = data + document.body.innerHTML;
    if (ccWrapper) {
      ccWrapper.style.display = 'none';
    }

    var permissionsUl = document.createElement('ul');
    $q('#cookie-consent-notification-permissions').prepend(permissionsUl);
    for (const [key, value] of cookies) {
      if (!value.asked) {
        $q('#cookie-consent-notification-permissions ul').innerHTML
          += '<li>'
          + '<input type="checkbox" checked="checked" id="cookieConsent-checkbox-' + key + '" />'
          + '<label id="cookieConsent-label-' + key + '" for="cookieConsent-checkbox-' + key + '">'
          + '<strong>' + value.title + '</strong> '
          + (cookieConsent.settings.showTypeDescription ? value.description : '')
          + '</label>'
          + '</li>';

        if (key === 'analytics' || key === 'marketing') {
          allCustom = false;
        }

        let currentCheckbox = $q('#cookieConsent-checkbox-' + key);
        currentCheckbox.addEventListener('input', function (event) {
          if (this.checked) {
            this.parentElement.classList.remove(permissionsInactiveClass);
          } else {
            this.parentElement.classList.add(permissionsInactiveClass);
          }
        });

        if (value.defaultstate === 'off' && key !== 'necessary') {
          currentCheckbox.checked = false;
          currentCheckbox.parentElement.classList.add(permissionsInactiveClass);
        }

        if (key === 'necessary') {
          currentCheckbox.disabled = true;
        }
      }
    }

    $q('.cookie-consent-notification-buttons').innerHTML
      += '<li class="text-right">'
      + '<a class="cookieConsent-link btn -default -full-mobile" href="#" id="cookie-consent-notification-moreinfo">'
      + cookieConsent.strings.seeDetails
      + '</a>'
      + '</li>';

    const approveButtonThisSite = $q('#cookieConsent-approve-button-thissite');
    const permissionsInactiveClass = 'cookie-consent-notification-permissions-inactive';
    $q('#cookie-consent-notification-moreinfo').addEventListener('click', function () {
      if (this.innerHTML === cookieConsent.strings.seeDetails) {
        approveButtonThisSite.innerHTML = cookieConsent.strings.savePreference;
        this.innerHTML = cookieConsent.strings.hideDetails;

        for (const [key, value] of Object.entries(cookieConsent.cookies)) {
          if (key !== 'necessary') {
            $q('#cookieConsent-checkbox-' + key).checked = false;
            this.parentElement.classList.add(permissionsInactiveClass);
          }
        }
      } else {
        for (const [key, value] of Object.entries(cookieConsent.cookies)) {
          $q('#cookieConsent-checkbox-' + key).checked = true;
          this.parentElement.classList.remove(permissionsInactiveClass);
        }
        this.innerHTML = cookieConsent.strings.seeDetails;
        approveButtonThisSite.innerHTML = cookieConsent.strings.allowCookies;
      }

      cookieConsent.slideToggle($q('#cookie-consent-notification-permissions'));
      this.blur();

      return false;
    });

    if (ccWrapper) {
      cookieConsent.fadeIn(ccWrapper, 'block');
    }

    if (approveButtonThisSite) {
      approveButtonThisSite.addEventListener('click', cookieConsent.onLocalConsentGiven);
    }
  },


  /**
   * check if cookie consent was used, if not show consent box
   */
  checkapproval: function () {
    cookieConsent.allasked = true;
    for (const [key, value] of Object.entries(cookieConsent.cookies)) {
      if (cookieConsent.approved[key]) {
        if (cookieConsent.approved[key] === 'true') {
          cookieConsent.cookies[key].asked = true;
          cookieConsent.cookies[key].approved = true;
        } else if (cookieConsent.approved[key] === 'false') {
          cookieConsent.cookies[key].asked = true;
          cookieConsent.cookies[key].approved = false;
        } else {
          cookieConsent.allasked = false;
        }
      } else {
        cookieConsent.allasked = false;
      }
    }

    if (!cookieConsent.allasked) {
      if (!cookieConsent.checkedlocal) {
        cookieConsent.checklocal();
        return;
      }

      cookieConsent.showConsentBox(Object.entries(cookieConsent.cookies));
    }
  },


  checklocal: function () {
    this.checkedlocal = true;
    for (const [key, value] of Object.entries(cookieConsent.cookies)) {
      let cookieval = cookieConsent.getCookie('cc_' + key);
      if (cookieval) {
        cookieConsent.approved[key] = cookieval;
      }
    }

    this.checkapproval();
  },


  /**
   * get cookie
   * @param name
   * @returns {null}
   */
  getCookie(name) {
    let match;
    function escape(s) {
      return s.replace(/([.*+?^${}()|[\]/\\])/g, '\\$1');
    }

    match = document.cookie.match(new RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
  },


  /**
   * set new Cookie or edit Cookie method
   * @param name
   * @param value
   * @param daysToLive
   */
  setCookie(name, value, daysToLive) {
    let cookie = name + '=' + encodeURIComponent(value);

    if (typeof daysToLive === 'number') {
      cookie += '; max-age=' + (daysToLive * 24 * 60 * 60);
      document.cookie = cookie;
    }
  },


  /**
   * handle cookie status
   * @returns {boolean}
   */
  onLocalConsentGiven: function () {
    const elem = this;
    let enablejustone = false;

    for (const [key, value] of Object.entries(cookieConsent.cookies)) {
      if (elem.classList.contains('cookieConsent-button-enable-' + key)) {
        enablejustone = true;
        cookieConsent.approved[key] = 'true';
        cookieConsent.cookies[key].asked = true;
        cookieConsent.setCookie('cc_' + key, cookieConsent.approved[key], cookieConsent.settings.cookieExpire);
      }
    }

    cookieConsent.agreeAll = true;
    if (!enablejustone) {

      for (const [key, value] of Object.entries(cookieConsent.cookies)) {
        if (!value.approved && !value.asked) {
          if ($q('#cookieConsent-checkbox-' + key).checked) {
            cookieConsent.approved[key] = 'true';
            cookieConsent.cookies[key].asked = true;
          } else {
            cookieConsent.approved[key] = 'false';
            cookieConsent.cookies[key].asked = true;
            cookieConsent.agreeAll = false;
          }
          cookieConsent.setCookie('cc_' + key, cookieConsent.approved[key], cookieConsent.settings.cookieExpire);
        }
      }
    }

    cookieConsent.fadeOut($q('#cookie-consent-notification'));
    cookieConsent.checkapproval();
    cookieConsent.triggerThirdpartyScripts();

    return false;
  },


  /**
   * prepare init
   */
  onFirstLoad: function () {
    if (!cookieConsent.setupcomplete && cookieConsent.initobj) {
      cookieConsent.setupcomplete = true;
      cookieConsent.setup();
    }

    setTimeout(function () {
      for (const [key, value] of Object.entries(cookieConsent.cookies)) {
        let enableKey = $q('.cookieConsent-button-enable-' + key);
        if (enableKey) {
          enableKey.addEventListener('click', cookieConsent.onLocalConsentGiven);
          enableKey.classList.add('cookieConsent-link');
          cookieConsent.simulateClick($q('.cookieConsent-button-enable-' + key));
        }
      }
    }, 50);

    cookieConsent.checkapproval();
  },

  slideToggle: (target, duration = 500) => {
    if (window.getComputedStyle(target).display === 'none') {
      return cookieConsent.slideDown(target, duration);
    }
    return cookieConsent.slideUp(target, duration);
  },

  slideUp: (target, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  },

  slideDown: (target, duration = 500) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;

    if (display === 'none') {
      display = 'block';
    }

    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = '0';
    target.style.paddingTop = '0';
    target.style.paddingBottom = '0';
    target.style.marginTop = '0';
    target.style.marginBottom = '0';
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  },

  fadeOut: (el) => {
    el.style.opacity = 1;

    (function fade() {
      /* eslint-disable-next-line no-cond-assign */
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  },

  fadeIn: (el, display) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';

    (function fade() {
      var val = parseFloat(el.style.opacity);
      var elOpacity = val += 0.1;

      if (!elOpacity > 1) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  },

  simulateClick: (elem) => {
    // Create our event (with options)
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    // If cancelled, don't dispatch our event
    var canceled = !elem.dispatchEvent(evt);
  }
};

window.cookieConsent = cookieConsent;
export { cookieConsent };