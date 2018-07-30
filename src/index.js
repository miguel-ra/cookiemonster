import { h, render } from 'preact';

import jss from 'jss';
import preset from 'jss-preset-default';
import yett from './lib/yett';
import localcookie from './lib/localcookie';
import Styles, { generateTheme } from './styles';
import cookiemonster, { parseParams } from './lib/cookiemonster';

import App from './containers/App';

jss.setup(preset());

const defaultParams = {
  tabs: {},
  cookies: {},
  alertText: 'This website uses cookies to ensure you get the best experience on our website.',
  moreInformation: 'Cookie settings',
  acceptAll: 'Allow all cookies',
};


function loadApp(params) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  render(
    <App params={params} />,
    container
  );
}

function cookieMonster(params) {
  const mergedParams = {
    ...defaultParams,
    ...params,
    theme: new Styles(generateTheme(params.theme)),
  };

  const { blackList, blackListTypes, cookieNames } = parseParams(mergedParams);

  localcookie(cookieNames);
  yett(blackList, blackListTypes, params.tabs);
  cookiemonster();

  if (Object.keys(mergedParams.tabs).length === 0) {
    mergedParams.moreInformation = false;
  }

  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    loadApp(mergedParams);
  } else {
    document.addEventListener('DOMContentLoaded', () => { loadApp(mergedParams); });
  }
}

window.cookieMonster = { init: cookieMonster };
