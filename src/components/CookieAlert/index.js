import { h } from 'preact';
import Markup from 'preact-markup';
import injectSheet from 'preact-jss';

import Styles from '../../styles';
import style from './style';

function CookieAlert({
  sheet, onCookieSettings, onAcceptAll, texts,
}) {
  const { classes } = sheet;
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Markup markup={texts.banner} />
      </div>
      <div className={classes.buttons}>
        {texts.cookieSettings && (
          <button type='button' className={classes.button} onClick={onCookieSettings} tabIndex='0'>
            {texts.cookieSettings}
          </button>
        )}
        <button type='button' className={`${classes.button} accent`} onClick={() => onAcceptAll()} tabIndex='0'>
          {texts.acceptAll}
        </button>
      </div>
    </div>
  );
}

export default (props) => {
  const Styled = getComponent();
  return <Styled {...props} />;
};

export const getComponent = () => {
  const theme = new Styles().getTheme();
  return injectSheet(style(theme))(CookieAlert);
};
