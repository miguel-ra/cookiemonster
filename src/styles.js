import merge from 'deepmerge';

const themeLight = {
  backgroundColor: '#ffffff',
  color: '#000000',
  accent: {
    backgroundColor: '#EF6924',
    color: '#ffffff',
  },
};

// const themeBlack = {
//   backgroundColor: '#333333',
//   color: '#ffffff',
//   separator: colorLuminance('#333333', 0.25),
//   accent: {
//     backgroundColor: '#EF6924',
//     color: '#ffffff',
//     hover: {
//       backgroundColor: colorLuminance('#EF6924', 0.25),
//     },
//   },
// };

var _styles = {}; // eslint-disable-line

class styles {
  constructor(props) {
    if (props) {
      _styles = props;
    }
  }

  setTheme(props) {
    _styles = props;
  }

  getTheme() {
    return _styles;
  }
}

export default styles;

export const defaultTheme = themeLight;

export function mergeThemes(baseTheme, customTheme) {
  if (!customTheme) {
    return baseTheme;
  }
  if (!baseTheme) {
    return customTheme;
  }
  return merge(baseTheme, customTheme);
}

export function generateTheme(params) {
  let merged;
  if (!params) {
    merged = defaultTheme;
  } else {
    merged = merge(defaultTheme, params);
  }
  return {
    backgroundColor: merged.backgroundColor,
    color: merged.color,
    separator: merged.separator || colorLuminance(merged.backgroundColor, -0.25),
    accent: {
      backgroundColor: merged.accent.backgroundColor,
      color: merged.accent.color,
      hover: {
        backgroundColor: merged.accent.hover && merged.accent.hover.backgroundColor ? merged.accent.hover : colorLuminance(merged.accent.backgroundColor, 0.25),
      },
    },
  };
}

export function colorLuminance(hexString, lumString) {
  let hex = String(hexString).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const lum = lumString || 0;

  let rgb = '#';
  let c;
  let i;

  for (i = 0; i < 3; i += 1) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += (`00${c}`).substr(c.length);
  }

  return rgb;
}
