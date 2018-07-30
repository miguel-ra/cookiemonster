import { h, Component } from 'preact';
import Markup from 'preact-markup';
import injectSheet from 'preact-jss';
import Styles from '../../styles';
import style from './style';

import { getComponent as Switch } from '../Switch';

const c = {};

class CookieConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: Object.keys(props.tabs)[0],
      config: props.config,
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.changeTab = this.changeTab.bind(this);

    c.Switch = Switch();
  }

  changeTab(tab) {
    return () => {
      this.setState({ active: tab });
    };
  }

  changeCookie(tab) {
    const { config } = this.state;
    return (value) => {
      this.setState({ config: { ...config, [tab]: value } });
    };
  }

  handleKeyPress(e, callback) {
    if (e.keyCode === 13) {
      callback();
    }
  }

  render() {
    const { active, config } = this.state;
    const {
      sheet: { classes }, onClose, onSave, tabs,
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.heading}>
            <h2>
              Cookie settings
            </h2>
          </div>
        <div className={classes.innercontent}>
          <div role='tablist' className={classes.left}>
            {Object.keys(tabs).map((key) => {
              const callback = this.changeTab(key);
              return (
                <div
                  role='tab'
                  tabIndex='0'
                  onClick={this.changeTab(key)}
                  onKeyPress={(e) => this.handleKeyPress(e, callback)}
                  className={`${classes.tab} ${active === key ? 'active' : ''}`}
                >
                  {tabs[key].title}
                </div>
              );
            })}
          </div>
          <div className={classes.right}>
            <div className={classes.tabHeader}>
              <h3>
                {tabs[active].title}
              </h3>
              {tabs[active].cookie ? (
                <c.Switch
                  active={config[active]}
                  callback={this.changeCookie(active)}
                />
              ) : false}
            </div>
            <div className={classes.tabContent}>
              <Markup markup={tabs[active].description} />
            </div>
          </div>
        </div>
          <div className={classes.footer}>
            <button type='button' onClick={onClose}>
              Close
            </button>
            <button type='button' onClick={() => onSave(config)} className='accent'>
              Save
            </button>
          </div>
        </div>
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
  return injectSheet(style(theme))(CookieConfig);
};
