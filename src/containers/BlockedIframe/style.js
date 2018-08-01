const style = (theme) => ({
  root: {
    fontSize: '14px',
    fontFamily: 'Helvetica,Calibri,Arial,sans-serif',
    backgroundColor: theme.accent.backgroundColor,
    color: theme.accent.color,
    boxSizing: 'border-box',
    padding: '5%',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    '& button': {
      transition: 'all .2s ease-in-out',
      fontFamily: 'inherit',
      padding: '.6em .8em',
      fontSize: '.9em',
      fontWeight: '700',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      lineHeight: '1.5em',
      cursor: 'pointer',
      textDecoration: 'none',
      margin: 0,
      border: 0,
      borderRadius: 0,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  text: {
    marginBottom: '2em',
    color: theme.accent.color,
  },
});

export default style;
