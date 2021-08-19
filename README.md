# Cookie Consent V2 - by Faesslich

## Add JavaScript

#### JS (ES6 import):
```javascript
import cookieConsent from './src/js/cookieconsent_v2'; // path may depend on your installation

var ccObjOverride = {}; // can override all given options in cookieConsent object
document.addEventListener('DOMContentLoaded', cookieConsent.onFirstLoad);
cookieConsent.initialise(ccObjOverride);
```

#### JS static include:
```html
<script src="./dist/js/cookieconsent_v2.min.js"></script>
<script>
    var ccObjOverride = {}; // can override all given options in cookieConsent object
    document.addEventListener('DOMContentLoaded', cookieConsent.onFirstLoad);
    cookieConsent.initialise(ccObjOverride);
</script>
```

## Add styling (optional if you'd like to style by yourself)
#### SCSS
```scss
@import 'cookieconsent_v2.scss';
```

#### CSS
```html
<link rel="stylesheet" href="./dist/css/cookieconsent_v2.min.css">
```


## (S)CSS & JavaScript

- For changing and compiling SCSS and JavaScript we need to work with webpack.

> navigate to root folder where `package.json` is located and type in:

```shell
npm install
```


Obviously we need Node.js and npm installed on our machine. 

---

> Now webpack needs to be triggered to watch the specific files. Therefore use:
```shell
npm run watcher
```

Webpack will now watch all of the files in the subfolder `scss` and `js` and will compile them to a browser ready 
file you're NOT allowed to change anymore!

The compiled files will be placed inside `dist/css` and `dist/js`.

## Browsers support

| [![](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png)]() IE / Edge | [![](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)]() Firefox | [![](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)]() Chrome | [![](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)]() Safari | [![](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png)]() iOS Safari | [![](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png)]() Opera |
| ----------- | --------------- | --------------- | --------------- | --------------- | --------------- |
| IE11, Edge  | last 5 versions | last 5 versions | last 2 versions | last 2 versions | last 5 versions |
