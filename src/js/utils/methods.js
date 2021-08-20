/**
 * slideToggle function
 * @param target
 * @param duration
 */
export function slideToggle(target, duration = 500) {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  }
  return slideUp(target, duration);
}

/**
 * slideUp function
 * @param target
 * @param duration
 */
export function slideUp(target, duration = 500) {
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
}

/**
 * slideDown function
 * @param target
 * @param duration
 */
export function slideDown(target, duration = 500) {
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
}

/**
 * fadeOut function
 * @param el
 */
export function fadeOut(el) {
  el.style.opacity = '1';

  (function fade() {
    /* eslint-disable-next-line no-cond-assign */
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

/**
 * fadeIn function
 * @param el
 * @param display
 */
export function fadeIn(el, display) {
  el.style.opacity = '0';
  el.style.display = display || 'block';

  (function fade() {
    var val = parseFloat(el.style.opacity);
    var elOpacity = val += 0.1;

    if (!elOpacity > 1) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}
