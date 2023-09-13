import React, { memo, useState } from 'react';
import ReactJson from 'react-json-view';

import { cls } from '../../../utils/classname';
import { useTheme } from '../../hooks/useTheme';
import * as classes from './payloadVIew.module.css';

export interface PayloadViewProps {
  data?: string;
  contentType?: string | string[];
}

export const PayloadView = memo(function PayloadView({
  data,
  contentType = '',
}: PayloadViewProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [theme] = useTheme();

  if (!data) {
    return <pre className={cls(classes.root, classes.empty)}>Empty</pre>;
  }

  const type = Array.isArray(contentType) ? contentType.join(' ') : contentType;

  if (type.includes('json') || type.includes('application/javascript')) {
    try {
      const text = window.atob(data);
      return (
        <>
          <pre className={classes.root}>
            {showRaw ? (
              text
            ) : (
              <ReactJson
                src={JSON.parse(text)}
                name={false}
                collapsed={3}
                iconStyle="square"
                displayObjectSize
                enableClipboard={false}
                displayDataTypes={false}
                collapseStringsAfterLength={100}
                style={{ backgroundColor: 'none' }}
                theme={theme === 'light' ? 'rjv-default' : 'railscasts'}
              />
            )}
          </pre>
          <div
            className={classes['raw-toggle']}
            onClick={() => {
              setShowRaw((v) => !v);
            }}
          >
            <i>{showRaw ? 'Preview' : 'Raw'}</i>
          </div>
        </>
      );
    } catch (error) {}
  }

  if (type.startsWith('image/')) {
    return (
      <img className={classes.image} src={`data:${type};base64,${data}`} />
    );
  }

  return <pre className={classes.root}>{window.atob(data)}</pre>;
});
