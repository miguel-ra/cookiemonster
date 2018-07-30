/* eslint no-underscore-dangle: ["error", { "allow": ["__lookupGetter__", "__lookupSetter__"] }] */
import cookies from 'browser-cookies';

export default function (cookieServiceNames) {
  // TODO - implement buffer

  let cookieDescriptor = Object.getOwnPropertyDescriptor(document, 'cookie')
                         || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

  if (!cookieDescriptor) {
    cookieDescriptor = {};
    cookieDescriptor.get = document.__lookupGetter__('cookie');
    cookieDescriptor.set = document.__lookupSetter__('cookie');
  }

  Object.defineProperty(document, 'cookie', {
    get() {
      return cookieDescriptor.get.apply(document);
    },
    set(...args) {
      const cookieName = args[0].split('=')[0];
      const cookiemonster = JSON.parse(cookies.get('cookiemonster'));
      let block = true;

      if (!cookieServiceNames[cookieName]) {
        block = false;
      } else if (cookiemonster && cookiemonster[cookieServiceNames[cookieName]]) {
        block = false;
      }

      if (!block) {
        return cookieDescriptor.set.apply(document, args);
      }
      return false;
    },
  });
}
