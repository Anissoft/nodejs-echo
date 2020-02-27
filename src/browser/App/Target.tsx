import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactJson from 'react-json-view';

import { If } from '@anissoft/react-helpers/components/If';
import { useTheme, Typography } from '@material-ui/core';

import { CompleteItem } from '../../types';

export default ({ target, onClose }: { target?: CompleteItem; onClose: () => void }) => {
  const theme = useTheme();
  console.log(target);
  return (
    <Dialog open={!!target} onClose={onClose} fullWidth maxWidth="lg">
      <Grid container>
        <Grid item container xs={6}>
          <If condition={!!target?.request}>
            {() => (
              <ReactJson
                style={{ width: '100%', padding: theme.spacing(3, 0, 3, 3) }}
                sortKeys
                name="request"
                theme={theme.palette.type === 'dark' ? 'twilight' : 'bright:inverted'}
                src={target?.request || {}}
                iconStyle="triangle"
                enableClipboard={false}
                displayDataTypes
                displayObjectSize
                shouldCollapse={({ namespace }) => namespace.length > 1}
                collapseStringsAfterLength={100}
                groupArraysAfterLength={10}
              />
            )}
          </If>
        </Grid>
        <Grid item container xs={6}>
          <ReactJson
            style={{ width: '100%', padding: theme.spacing(3, 3, 3, 0) }}
            sortKeys
            name="response"
            theme={theme.palette.type === 'dark' ? 'twilight' : 'bright:inverted'}
            src={target?.response || {}}
            iconStyle="triangle"
            enableClipboard={false}
            displayDataTypes
            displayObjectSize
            shouldCollapse={({ namespace }) => namespace.length > 1}
            collapseStringsAfterLength={100}
            groupArraysAfterLength={10}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};
