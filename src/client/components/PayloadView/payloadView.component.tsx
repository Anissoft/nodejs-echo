import React, { memo } from 'react';
import ReactJson from 'react-json-view';
import { cls } from '../../../utils/classname';
import { useTheme } from '../../hooks/useTheme';

import classes from './payloadVIew.module.css';

export type PayloadViewProps = {
  data?: string;
  contentType?: string | string[] ;
};

export const PayloadView = memo(({ data, contentType = '', ...props }: PayloadViewProps) => {
  const [theme] = useTheme();

  if (!data) {
    return <pre className={cls(classes.root, classes.empty)}>Empty</pre>
  }

  const type = Array.isArray(contentType) ? contentType.join(' ') : contentType;
  
  if (type.indexOf('json') !== -1) {
    try {
      const json = JSON.parse(data);
      return (
        <pre className={classes.root}>
          <ReactJson 
            src={json} 
            name={false}
            iconStyle='square'
            displayObjectSize
            enableClipboard={false}
            displayDataTypes={false}
            style={{ backgroundColor: 'none' }}
            theme={theme === 'light' ? 'rjv-default' : 'railscasts'} 
          />
        </pre>
      )
    } catch(error) {
      
    }
  }

  return (
    <pre className={classes.root}>
      {data}
    </pre>
  );
});
