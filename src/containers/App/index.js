import { h, Component } from 'preact';
import cookies from 'browser-cookies';
import injectSheet from 'preact-jss';
import { unblock, updateBlacklistedPatterns } from '../../lib/yett';
import { getAllowedBlocked, getTabCookie, parseParams } from '../../lib/cookiemonster';
import Styles from '../../styles';
import { getComponent as CookieAlert } from '../../components/CookieAlert';
import CookieConfig from '../../components/CookieConfig';

import style from './style';

const c = {};

class App extends Component {
  constructor(props) {
    super(props);
    const cookiemonster = getTabCookie(props.params.tabs, JSON.parse(cookies.get('cookiemonster')));
    this.state = {
      alert: false,
      config: false,
      cookiemonster,
    };

    if (!cookiemonster.saved) {
      this.state.alert = true;
    }

    this.updateCookieMonsterState = this.updateCookieMonsterState.bind(this);
    this.openConfig = this.openConfig.bind(this);
    this.closeConfig = this.closeConfig.bind(this);
    this.saveCookie = this.saveCookie.bind(this);

    c.CookieAlert = CookieAlert();
  }

  componentDidMount() {
    window.addEventListener('cookiemonster_settings', this.openConfig, false);
    window.addEventListener('cookiemonster_state_changed', this.updateCookieMonsterState, false);
  }

  componentWillUnmount() {
    window.removeEventListener('cookiemonster_settings', this.openConfig, false);
    window.removeEventListener('cookiemonster_state_changed', this.updateCookieMonsterState, false);
  }

  updateCookieMonsterState() {
    const { params } = this.props;
    const { saved, ...cookiemonster } = getTabCookie(params.tabs, JSON.parse(cookies.get('cookiemonster')));

    this.saveCookie(cookiemonster, false);

    const { blackList, blackListTypes } = parseParams(params);
    updateBlacklistedPatterns(blackList, blackListTypes);
  }

  openConfig() {
    this.setState({ alert: false, config: true });
  }

  closeConfig() {
    const { cookiemonster } = this.state;
    this.setState({ alert: !cookiemonster.saved, config: false });
  }

  saveCookie(config, trigger = true) {
    const { params } = this.props;
    let { cookiemonster } = this.state;
    let parsedConfig = { ...config };

    Object.keys(parsedConfig).forEach((key) => {
      if (config[key] === cookiemonster[key]) {
        delete parsedConfig[key];
      }
    });

    if (parsedConfig) {
      if (!cookiemonster.saved) {
        parsedConfig = { ...cookiemonster, ...parsedConfig };
        cookiemonster = { saved: true, ...parsedConfig };
      } else {
        cookiemonster = { saved: true, ...cookiemonster, ...parsedConfig };
      }
      const { allowed, blocked, callbacks } = getAllowedBlocked(params, parsedConfig);
      const event = document.createEvent('Event');

      if (allowed.blockScript && allowed.blockScript[0]) {
        unblock(allowed.blockScript);
      }

      if (callbacks && callbacks[0]) {
        for (let i = 0; i < callbacks.length; i += 1) {
          callbacks[i]();
        }
      }

      Object.keys(blocked.cookieNames).forEach((key) => {
        cookies.erase(key);
      });

      cookies.set('cookiemonster', JSON.stringify(cookiemonster), { expires: 365 });

      if (trigger) {
        event.initEvent('cookiemonster_state_changed', true, true);
        document.dispatchEvent(event);
      }
    }
    this.setState({ alert: false, config: false, cookiemonster: { saved: true, ...cookiemonster } });
  }

  render() {
    const { alert, config, cookiemonster } = this.state;
    const { sheet: { classes }, params } = this.props;

    return (
      <div className={`cookiemonster ${classes.root}`}>
        { alert && (
          <c.CookieAlert
            onMoreInformation={this.openConfig}
            onAcceptAll={this.saveCookie}
            alertText={params.alertText}
            moreInformation={params.moreInformation}
            acceptAll={params.acceptAll}
          />
        ) }
        { config && (
          <CookieConfig
            tabs={params.tabs}
            config={cookiemonster}
            onClose={this.closeConfig}
            onSave={this.saveCookie}
          />
        ) }
      </div>
    );
  }
}

export default (props) => {
  const Styled = getComponent();
  return <Styled {...props} />;
};

export const getComponent = () => {
  const theme = new Styles().getTheme();
  return injectSheet(style(theme))(App);
};
