import { h } from 'preact';
import Markup from 'preact-markup';
import injectSheet from 'preact-jss';

import Styles from '../../styles';
import style from './style';

function CookieAlert({
  sheet, onMoreInformation, onAcceptAll, moreInformation, alertText, acceptAll,
}) {
  const { classes } = sheet;
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Markup markup={alertText} />
      </div>
      <div className={classes.buttons}>
        {moreInformation && (
          <button type='button' className={classes.button} onClick={onMoreInformation} tabIndex='0'>
            {moreInformation}
          </button>
        )}
        <button type='button' className={`${classes.button} accent`} onClick={() => onAcceptAll()} tabIndex='0'>
          {acceptAll}
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
