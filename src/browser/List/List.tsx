import * as React from 'react';
import ReactJson from 'react-json-view'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Grid from '@material-ui/core/Grid';
import Zoom from '@material-ui/core/Zoom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandLess';
import Up from '@material-ui/icons/CallMade';
import Down from '@material-ui/icons/CallReceived';
import If from '@anissoft/react-helpers/components/If'
import useThrottle from '@anissoft/react-helpers/hooks/useThrottle'

import useStyles from './styles';
import { Response, Request } from '../../../types'
import { useRequests } from '../useRequests';
import { useSocket } from '../useSocket';
import { getMethod, getUrl, getHost, getPath } from '../exctractors';
import { AppBar } from '../AppBar';

export const List = () => {
  const classes = useStyles();
  const { socket, addSocketListener } = useSocket({
    port: +location.port + 1
  });
  const [_requests, _responses, times] = useRequests({ addSocketListener });
  const requests = useThrottle(_requests, 100);
  const responses = useThrottle(_responses, 100);

  function getStatusColor(status: number) {
    if (status < 300) {
      return classes.statusGreen;
    }
    if (status >= 400) {
      return classes.statusRed;
    }
    return classes.statusYellow;
  };

  // console.log(requests, responses);

  return React.useMemo(
    () => (
      <>
        <Grid
          container
          className={classes.root}
          direction="column"
          justify="flex-end"
        >
          {Object.values(requests).map((req) => {
            const res = responses[req.id];
            return (
              <Grid item key={req.id} xs={12}>
                <Zoom in mountOnEnter>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={
                        <If
                          condition={!res}
                          then={() => <CircularProgress size={24} color="secondary" />}
                          else={() => (
                            <ExpandMoreIcon />
                          )}
                        />

                      }>
                      <Grid container spacing={2} className={classes.row}>
                        <Grid item >
                          <If
                            condition={req.type === 'outgoing'}
                            then={() => <Up />}
                            else={() => <Down />}
                          />
                        </Grid>
                        <Grid item >
                          <Typography className={classes.heading}>
                            {`${new Date(times[req.id]).toLocaleTimeString()} - `}
                            {`${getMethod(req)}   `}
                            {`${getHost(req)}${getPath(req).slice(0, 60)}${getPath(req).length > 60 ? '...' : ''}`}
                          </Typography>
                        </Grid>
                        <Grid item >
                          <If
                            condition={!!res}
                            then={() => (
                              <Typography className={getStatusColor(res.response.statusCode as number)}>
                                {res.response.statusCode}
                              </Typography>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid
                        container
                        direction="row"
                      >
                        <Grid item xs={6}>
                          <Typography variant="body1" paragraph> Request: </Typography>
                          <ReactJson
                            name={null}
                            shouldCollapse={({ name }) => {
                              return !!name;
                            }}
                            iconStyle="triangle"
                            enableClipboard={false}
                            displayDataTypes={false}
                            src={req.request as object}
                            style={{ wordBreak: 'break-word' }}
                            collapseStringsAfterLength={600}
                          />
                        </Grid>
                        <If condition={!!res}>
                          <Grid item xs={6}>
                            <Typography variant="body1" paragraph> Response: </Typography>
                            <ReactJson
                              name={null}
                              shouldCollapse={({ name }) => {
                                return !!name;
                              }}
                              iconStyle="triangle"
                              enableClipboard={false}
                              displayDataTypes={false}
                              src={res && res.response}
                              style={{ wordBreak: 'break-word' }}
                              collapseStringsAfterLength={600}
                            />
                          </Grid>
                        </If>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Zoom>
              </Grid>
            );
          })}
          {/* <LinearProgress color="secondary" /> */}
        </Grid>
        <div style={{ flexGrow: 1 }}>
          <AppBar
            connected={!!socket}
          />
        </div>
      </>
    ),
    [requests, responses]);
}
