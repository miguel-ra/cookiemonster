import { colorLuminance } from '../../styles';

const style = (theme) => ({
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  root: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    fontFamily: 'sans-serif',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 99999,
    animation: 'fadeIn .5s linear forwards',
    overflow: 'auto',
    padding: '2.5vh 5vw',
    boxSizing: 'border-box',
  },
  content: {
    position: 'relative',
    left: '50%',
    top: '50%',
    right: 0,
    bottom: 0,
    transform: 'translate(-50%, -50%)',
    maxWidth: '50em',
    width: '90vw',
    minHeight: '50vh',
    color: theme.color,
    backgroundColor: theme.backgroundColor,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    '@media screen and (max-width: 800px)': {
      width: '100%',
      minHeight: '100%',
      top: 0,
      left: 0,
      transform: 'translate(0, 0)',
    },
  },
  innercontent: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    '@media screen and (max-width: 800px)': {
      flexDirection: 'column',
    },
  },
  heading: {
    width: '100%',
    textAlign: 'center',
    borderBottom: `1px solid ${theme.separator};`,
    padding: '20px 0',
    '& h2': {
      margin: 0,
    },
  },
  left: {
    width: '30%',
    verticalAlign: 'top',
    backgroundColor: colorLuminance(theme.separator, 0.1),
    '@media screen and (max-width: 800px)': {
      width: '100%',
    },
  },
  right: {
    flex: 1,
    verticalAlign: 'top',
    padding: '10px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    '& h3': {
      margin: '0',
    },
    '@media screen and (max-width: 800px)': {
      padding: '5px 10px',
    },
  },
  tab: {
    padding: '10px',
    cursor: 'pointer',
    color: theme.color,
    backgroundColor: colorLuminance(theme.separator, 0.1),
    borderBottom: `1px solid ${theme.separator};`,
    transition: 'all .1s ease-in-out',
    '&.active, &:hover': {
      backgroundColor: theme.backgroundColor,
    },
  },
  tabHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1em',
  },
  tabContent: {
    marginTop: '1em',
    marginBottom: '1em',
  },
  footer: {
    width: '100%',
    borderTop: `1px solid ${theme.separator};`,
    textAlign: 'right',
    marginTop: '-1px',
  },
});

export default style;
