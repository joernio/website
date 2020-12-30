import React from "react"
import Prism from "prismjs"
import {usePluginData} from '@docusaurus/useGlobalData';
import Highlight, { defaultProps } from "prism-react-renderer";

import dracula from 'prism-react-renderer/themes/dracula';

const PrismCode = ({ codeId, language }) => {
  const myPluginData = usePluginData('staticcode');
  const theCode = myPluginData.code[codeId];

  return (
    <Highlight {...defaultProps} code={theCode} theme={dracula} language={language}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre className={className} style={style}>
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
  )
};

export default PrismCode;

