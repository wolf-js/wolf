/* global window */
import en from './en';

let $lang = 'en';
const $messages = {
  en,
};

function translate(key, messages, ...args) {
  if (messages && messages[$lang]) {
    let message = messages[$lang];
    const keys = key.split('.');
    for (let i = 0; i < keys.length; i += 1) {
      const property = keys[i];
      const value = message[property];
      if (i === keys.length - 1) {
        if (typeof value === 'string') {
          return value.replace(/\{(\d+)\}/g, (m, index) => args[index]);
        }
        return value;
      }
      if (!value) return undefined;
      message = value;
    }
  }
  return undefined;
}

function t(key, ...args) {
  let v = translate(key, $messages, ...args);
  if (!v && window && window.wolf && window.wolf.$messages) {
    v = translate(key, window.wolf.$messages, ...args);
  }
  return v || '';
}

function tf(key) {
  return () => t(key);
}

function locale(lang, message) {
  $lang = lang;
  if (message) {
    $messages[lang] = message;
  }
}

export default {
  t,
};

export {
  locale,
  t,
  tf,
};
