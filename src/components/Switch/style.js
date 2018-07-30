const style = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    margin: '1px 10px 0px',
    fontWeight: 'bold',
  },
  switch: {
    width: '40px',
    height: '20px',
    display: 'inline-block',
    position: 'relative',
  },
  input: {
    cursor: 'inherit',
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    backgroundColor: theme.separator,
    transition: '.4s',
    display: 'inline-block',
    width: '100%',
    height: '100%',
    '&.active': {
      backgroundColor: theme.accent.backgroundColor,
      '&:before': {
        transform: 'translateX(20px)',
      },
      '&:hover': {
        backgroundColor: theme.accent.hover.backgroundColor,
      },
    },
    '&:before': {
      position: 'absolute',
      content: '""',
      height: '12px',
      width: '12px',
      left: '4px',
      bottom: '4px',
      backgroundColor: theme.backgroundColor,
      transition: '.4s',
    },
  },
});

export default style;
