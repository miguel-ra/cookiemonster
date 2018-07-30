import cookies from 'browser-cookies';

export default function () {
  const events = {
    openSettings: () => {
      const event = document.createEvent('Event');
      event.initEvent('cookiemonster_settings', true, true);
      document.dispatchEvent(event);
    },
  };

  window.cookieMonster = { ...window.cookieMonster, ...events };
}

export function getTabCookie(tabs, savedCookie) {
  const cookie = savedCookie || {};
  Object.keys(tabs).forEach((key) => {
    if (tabs[key].cookie) {
      cookie[key] = cookie && cookie[key] !== undefined ? cookie[key] : true;
    }
  });
  return cookie;
}

export function parseParams(params) {
  const blackList = [];
  const blackListTypes = {};
  const cookieNames = {};
  const cookiemonster = JSON.parse(cookies.get('cookiemonster'));

  if (params.cookies) {
    Object.keys(params.cookies).forEach((type) => {
      if (!cookiemonster || (cookiemonster && !cookiemonster[type])) {
        Object.keys(params.cookies[type]).forEach((key) => {
          if (params.cookies[type][key].blockScript) {
            blackList.push(params.cookies[type][key].blockScript);
            blackListTypes[params.cookies[type][key].blockScript] = type;
          }
          if (params.cookies[type][key].cookieNames) {
            for (let i = 0; i < params.cookies[type][key].cookieNames.length; i += 1) {
              cookieNames[params.cookies[type][key].cookieNames[i]] = type;
            }
          }
        });
      }
    });
  }

  return {
    blackList,
    blackListTypes,
    cookieNames,
  };
}

export function getAllowedBlocked(params, cookiemonster) {
  const blocked = {
    blockScript: [],
    cookieNames: {},
  };
  const allowed = {
    blockScript: [],
    cookieNames: {},
  };
  const callbacks = [];

  if (params.cookies) {
    Object.keys(cookiemonster).forEach((type) => {
      Object.keys(params.cookies[type]).forEach((key) => {
        if (!cookiemonster || (cookiemonster && !!cookiemonster[type])) {
          if (params.cookies[type][key].blockScript) {
            allowed.blockScript.push(params.cookies[type][key].blockScript);
          }

          if (params.cookies[type][key].cookieNames) {
            for (let i = 0; i < params.cookies[type][key].cookieNames.length; i += 1) {
              allowed.cookieNames[params.cookies[type][key].cookieNames[i]] = type;
            }
          }
          if (params.cookies[type][key].onAccept) {
            callbacks.push(params.cookies[type][key].onAccept);
          }
        } else {
          if (params.cookies[type][key].blockScript) {
            blocked.blockScript.push(params.cookies[type][key].blockScript);
          }

          if (params.cookies[type][key].cookieNames) {
            for (let i = 0; i < params.cookies[type][key].cookieNames.length; i += 1) {
              blocked.cookieNames[params.cookies[type][key].cookieNames[i]] = type;
            }
          }
          if (params.cookies[type][key].onRevoke) {
            callbacks.push(params.cookies[type][key].onRevoke);
          }
        }
      });
    });
  }

  return { allowed, blocked, callbacks };
}
