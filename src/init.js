/* Example of cookieMonster init, this file it's only used when development mode is active */
/* eslint-disable */
cookieMonster.init(
  {
    theme: {
      accent: {
        backgroundColor: '#009688',
      },
    },
    tabs: {
      privacy: {
        title: 'Your Privacy',
        description: 'Any web site that you visit may store or retrieve information on your browser, mostly through the use of cookies. The stored or retrieved information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but aims at giving you a more personalized web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings.',
      },
      necessary: {
        title: 'Strictly Necessary Cookies',
        description: 'These cookies are essential in order to enable you to move around the site and use its features, such as accessing secure areas of the site. Without these cookies, services you have asked for cannot be provided.',
      },
      analytics: {
        title: 'Analytics Cookies',
        description: 'These cookies allow us to employ data analytics so we can measure and improve the performance of our site. These cookies don\'t collect information that identifies a visitor. These cookies are not passing personally identifiable information to any external vendor or supplier, but are used for internal purposes only.',
        cookie: true,
      },
      social: {
        title: 'Social Media Cookies',
        description: 'Advertising and social media cookies are used to (1) deliver advertisements more relevant to you and your interests; (2) limit the number of times you see an advertisement; (3) help measure the effectiveness of the advertising campaign; and (4) understand people’s behavior after they view an advertisement. They are usually placed on behalf of advertising networks with the site operator’s permission. They remember that you have visited a site and quite often they will be linked to site functionality provided by the other organization. This may impact the content and messages you see on other websites you visit. If you do not allow these cookies you may not be able to use or see these sharing tools or play certain videos on our site.',
        cookie: true,
      },
    },
    cookies: {
      analytics: {
        analytics: {
          label: 'Analytical Cookies',
          // cookieNames: ['_ga', '_gid', '_gat', '__utma', '__utmt', '__utmb', '__utmc', '__utmz', '__utmv', '_gat_gtag_UA_44786119_2'],
          blockScript: /gtag/,
          onAccept: function() {
            window['ga-disable-UA_44786119_2'] = false;
          },
          onRevoke: function() {
            window['ga-disable-UA_44786119_2'] = true;
          },
        },
      },
      social: {
        vimeo: {
          label: 'Vimeo',
          cookieNames: ['vuid'],
          blockScript: /vimeo/,
        },
      },
      blocked: {
        gec: {
          label: 'Gec',
          cookieNames: ['gec'],
        },
      },
    },
    texts: {
      // cookieSettings: false,
    },
  }
);
