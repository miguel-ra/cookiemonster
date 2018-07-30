const style = (theme) => ({
  '@global ::-moz-focus-inner': { border: 0 },
  root: {
    fontSize: '14px',
    fontFamily: 'Helvetica,Calibri,Arial,sans-serif',
    '& *:focus': {
      position: 'relative',
      zIndex: 999999,
    },
    '& a, & button': {
      transition: 'all .2s ease-in-out',
    },
    '& button': {
      fontFamily: 'inherit',
      padding: '.6em .8em',
      fontSize: '.9em',
      fontWeight: '700',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent',
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
      '&.accent': {
        color: theme.accent.color,
        backgroundColor: theme.accent.backgroundColor,
        borderColor: 'transparent',
        '&:hover': {
          textDecoration: 'none',
          backgroundColor: theme.accent.hover.backgroundColor,
        },
      },
    },
    '& a': {
      color: theme.color,
      opacity: 0.8,
      padding: '.2em',
      textDecoration: 'underline',
      '&:hover': {
        opacity: 1,
        textDecoration: 'none',
      },
    },
  },
});

export default style;
