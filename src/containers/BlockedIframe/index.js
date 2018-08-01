import { h, Component } from 'preact';
import cookies from 'browser-cookies';
import injectSheet from 'preact-jss';
import Markup from 'preact-markup';

import Styles from '../../styles';
import style from './style';

function parseSize(size) {
  if (!size) {
    return size;
  }
  return size.includes('px') || size.includes('%') ? size : `${size}px`;
}

class BlockedIframe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blocked: true,
      category: props.type,
    };

    this.updateCookieMonsterState = this.updateCookieMonsterState.bind(this);
  }

  componentDidMount() {
    window.addEventListener('cookiemonster_state_changed', this.updateCookieMonsterState, false);
  }

  componentWillUnmount() {
    window.removeEventListener('cookiemonster_state_changed', this.updateCookieMonsterState, false);
  }

  updateCookieMonsterState() {
    const { category } = this.state;
    const cookiemonster = JSON.parse(cookies.get('cookiemonster'));

    if (cookiemonster[category]) {
      this.setState({ blocked: false });
    }
  }

  allowCookies(cookieName) {
    const event = document.createEvent('Event');
    const cookiemonster = JSON.parse(cookies.get('cookiemonster')) || {};

    cookiemonster.saved = true;
    cookiemonster[cookieName] = true;
    cookies.set('cookiemonster', JSON.stringify(cookiemonster), { expires: 365 });

    event.initEvent('cookiemonster_state_changed', true, true);
    document.dispatchEvent(event);

    this.setState({ blocked: false });
  }

  render() {
    const { blocked, category } = this.state;
    const {
      children, type, sheet: { classes }, tab, text, button, ...props
    } = this.props;
    let tabName;
    if (tab) {
      tabName = tab.title;
    } else {
      tabName = type;
    }

    if (!blocked) {
      return <iframe title='blockedIframe' {...props} />;
    }

    return (
      <div className={classes.root} style={{ width: parseSize(props.width), height: parseSize(props.height) }} >
        <h2 className={classes.text}>
          <Markup markup={text} />
        </h2>
        <button type='button' onClick={() => { this.allowCookies(category); }} >
          {`${button} ${tabName}`}
        </button>
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
  return injectSheet(style(theme))(BlockedIframe);
};
