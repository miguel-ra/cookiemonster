import { h, render } from 'preact';
import BlockedIframe from '../containers/BlockedIframe';

// Variables //
let blacklistedTypes;
let blacklistedPatterns = [];
let blacklistedTabs;
const TYPE_ATTRIBUTE = 'blocked/javascript';

// Disables the checks
let disableBlocker = false;
// Backup of the blacklisted script nodes
let blackListedScripts = [];

let observer;

export default function (blacklist, blacklistTypes, tabs) {
  blacklistedTabs = tabs;
  blacklistedTypes = blacklistTypes;
  blacklistedPatterns = blacklist;

  const needsToBeBlacklisted = (src, type, text) => (
    !disableBlocker
      && (!type || type !== TYPE_ATTRIBUTE)
      && blacklistedPatterns.some((pattern) => pattern.test(src) || pattern.test(text))
  );

  const needsToBeLoad = (src, type, text) => (
    type === TYPE_ATTRIBUTE
      && !blacklistedPatterns.some((pattern) => pattern.test(src) || pattern.test(text))
  );

  const getType = (src) => {
    for (let i = 0; i < blacklistedPatterns.length; i += 1) {
      if (blacklistedPatterns[i].test(src)) {
        return blacklistedTypes[blacklistedPatterns[i]];
      }
    }
    return false;
  };

  const fetchAttributes = (node) => (
    (node && Array.prototype.reduce.call(node.attributes, (list, attribute) => {
      list[attribute.name] = attribute.value; // eslint-disable-line
      return list;
    }, {})) || {}
  );

  /* 1st part - setup a mutation observer to track DOM insertion */

  observer = new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      for (let i = 0; i < addedNodes.length; i += 1) {
        const node = addedNodes[i];
        // For each added script tag
        console.log(node);

        if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
          const src = node.src || '';
          const { type, text } = node;

          // If the src is inside the blacklist
          if (needsToBeBlacklisted(src, type, text)) {
            // We backup a copy of the script node
            const copiedNode = node.cloneNode();
            copiedNode.text = text;
            blackListedScripts.push(copiedNode);

            // Blocks inline script execution in Safari & Chrome
            node.type = TYPE_ATTRIBUTE;

            // Firefox has this additional event which prevents scripts from beeing executed
            const beforeScriptExecuteListener = (event) => {
              // Prevent only marked scripts from executing
              if (node.getAttribute('type') === TYPE_ATTRIBUTE) event.preventDefault();
              node.removeEventListener('beforescriptexecute', beforeScriptExecuteListener);
            };
            node.addEventListener('beforescriptexecute', beforeScriptExecuteListener);

            // Remove the node from the DOM
            node.parentElement.removeChild(node);
          } else if (needsToBeLoad(src, type, text)) {
            const copiedNode = node.cloneNode();
            node.parentElement.removeChild(node);
            copiedNode.text = text;
            copiedNode.type = 'application/javascript';
            loadScript(copiedNode);
          }
        } if (node.nodeType === 1 && node.tagName === 'IFRAME' && needsToBeBlacklisted(node.getAttribute('src'))) {
          const type = getType(node.getAttribute('src'));
          if (type) {
            let nodeToReplace = node;

            while (nodeToReplace.parentElement.className === 'blockediframe') {
              nodeToReplace = nodeToReplace.parentElement;
            }

            const container = document.createElement('span');
            container.className = 'blockediframe';

            nodeToReplace.parentElement.replaceChild(container, nodeToReplace);

            render(
              <BlockedIframe
                {...fetchAttributes(node)}
                type={type}
                tab={blacklistedTabs[type]}
              />,
              container
            );
          }
        }
      }
    });
  });

  // Starts the monitoring
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  /* 2nd part - Monkey patch the createElement method to prevent dynamic scripts from executing */

  const originalDescriptors = {
    src: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src'),
    type: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'type'),
  };
  const createElementBackup = document.createElement;

  document.createElement = (...args) => {
    // If this is not a script tag, bypass
    if (args[0].toLowerCase() !== 'script') return createElementBackup.bind(document)(...args);

    const scriptElt = createElementBackup.bind(document)(...args);

    // Use the prototype descriptors
    Object.defineProperties(scriptElt, {
      src: {
        get() {
          return originalDescriptors.src.get.call(this);
        },
        set(value) {
          if (needsToBeBlacklisted(value, scriptElt.type)) {
            scriptElt.type = TYPE_ATTRIBUTE;
          }
          return originalDescriptors.src.set.call(this, value);
        },
      },
      type: {
        set(value) {
          return originalDescriptors.type.set.call(
            this,
            needsToBeBlacklisted(scriptElt.src, scriptElt.type)
              ? TYPE_ATTRIBUTE
              : value
          );
        },
      },
    });

    // Monkey patch the setAttribute function so that the setter is called instead
    scriptElt.setAttribute = (name, value) => {
      if (name === 'type' || name === 'src') scriptElt[name] = value;
      else HTMLScriptElement.prototype.setAttribute.call(scriptElt, name, value);
    };

    return scriptElt;
  };
}


/* Expose a function that resumes the blacklisted scripts execution. */

export const updateBlacklistedPatterns = (newBlacklistedPatterns, blacklistTypes) => {
  blacklistedPatterns = newBlacklistedPatterns;
  blacklistedTypes = blacklistTypes;
};

const unblockCheck = (script) => {
  const src = script.getAttribute('src');
  const { text } = script;
  return (
    disableBlocker
        || blacklistedPatterns.every((entry) => !entry.test(src) && !entry.test(text))
  );
};

const loadScript = (script) => {
  const scriptNode = document.createElement('script');
  if (script.src) {
    scriptNode.setAttribute('src', script.src);
  }
  if (script.text) {
    try {
      scriptNode.appendChild(document.createTextNode(script.text));
    } catch (e) {
      scriptNode.text = script.text;
    }
  }
  scriptNode.setAttribute('type', 'application/javascript');
  document.head.appendChild(scriptNode);
};

export const unblock = (...scriptUrls) => {
  if (disableBlocker) return;

  observer.disconnect();

  if (!scriptUrls || scriptUrls.length < 1) {
    disableBlocker = true;
  } else {
    blacklistedPatterns = blacklistedPatterns.filter((pattern) => scriptUrls.every((url) => !pattern.test(url)));
  }

  // Parse existing script tags with a marked type
  const tags = document.querySelectorAll(`script[type="${TYPE_ATTRIBUTE}"]`);
  for (let i = 0; i < tags.length; i += 1) {
    const script = tags[i];
    if (unblockCheck(script)) {
      script.type = 'application/javascript';
      blackListedScripts.push(script);
      script.parentElement.removeChild(script);
    }
  }

  // Exclude 'whitelisted' scripts from the blacklist and append them to <head>
  blackListedScripts = blackListedScripts.reduce((acc, script) => {
    if (unblockCheck(script)) {
      loadScript(script);
      return acc;
    }
    return [...acc, script];
  }, []);
};
