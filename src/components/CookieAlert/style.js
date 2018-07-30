const style = (theme) => ({
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  root: {
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.20);',
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    right: '1em',
    bottom: '1em',
    position: 'fixed',
    boxSizing: 'border-box',
    lineHeight: '1.5em',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    maxWidth: '25em',
    zIndex: 9999,
    opacity: 1,
    animation: 'fadeIn .5s linear forwards',
    fontWeight: 300,
    '@media screen and (max-width: 432px) and (orientation: portrait), screen and (max-width: 736px) and (orientation: landscape)': {
      left: 0,
      right: 0,
      bottom: 0,
      maxWidth: 'none',
    },
  },
  content: {
    margin: '1em 1.5em',
    textAlign: 'justify',
  },
  buttons: {
    display: 'flex',
  },
  button: {
    flex: 1,
    textTransform: 'uppercase',
  },
});

export default style;
