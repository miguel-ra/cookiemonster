import { h, Component } from 'preact';
import injectSheet from 'preact-jss';
import Styles from '../../styles';
import style from './style';

class Switch extends Component {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  handleKeyPress(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      this.changeValue();
    }
  }

  changeValue() {
    const { active, callback } = this.props;
    callback(!active);
  }

  render() {
    const {
      active, sheet, on, off,
    } = this.props;
    const { classes } = sheet;
    return (
      <div className={classes.root}>
        <span className={classes.status}>
          {active ? on : off}
        </span>
        <div
          className={classes.switch}
          onClick={this.changeValue}
          onKeyPress={this.handleKeyPress}
          role='checkbox'
          aria-checked='false'
          tabIndex='0'
        >
          <span className={`${classes.slider} ${active ? 'active' : false}`}></span>
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
  return injectSheet(style(theme))(Switch);
};
