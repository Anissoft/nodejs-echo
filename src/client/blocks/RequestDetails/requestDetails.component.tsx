import React, { memo } from 'react';
import { RequestItem } from '../../../types';

import classes from './requestDetails.module.css';

export type RequestDetailsProps = {
  request: RequestItem
}

export const RequestDetails = memo(({ request }: RequestDetailsProps) => {
  return (
    <div className={classes.root}>
      
    </div>
  );
});
