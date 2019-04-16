import * as React from 'react';
import ReactJson from 'react-json-view'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Grid from '@material-ui/core/Grid';
import Zoom from '@material-ui/core/Zoom';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandLess';
import Up from '@material-ui/icons/CallMade';
import Down from '@material-ui/icons/CallReceived';
import If from '@anissoft/react-helpers/components/If'

import useStyles from './styles';
import { Response, Request } from '../../../types'
import { useRequests } from '../useRequests';
import { useSocket } from '../useSocket';

export const List = () => {
  const classes = useStyles();
  const { socket, addSocketListener } = useSocket({
    port: +location.port + 1
  });
  const [requests, responses, times] = useRequests({ addSocketListener });
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

  return (
    <Grid
      container
      className={classes.root}
      direction="column"
      justify="flex-end"
    >
      {Object.values(requests).map((req) => {
        const res = responses[req.id];
        return (
          <Grid item key={req.id}>
            <Zoom in mountOnEnter unmountOnExit>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
                        <If
                          condition={typeof req.request === 'string'}
                          then={() => <>[GET]</>}
                          else={() => <>{`[${(req.request as any).method}]   `}</>}
                        />
                        <If
                          condition={typeof req.request === 'string'}
                          then={() => <>{req.request as string}</>}
                          else={() => <>{(req.request as any).href}</>}
                        />
                      </Typography>
                    </Grid>
                    <Grid item >
                      <If
                        condition={!res}
                        then={() => <CircularProgress size={24} color="secondary" />}
                        else={() => (
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
                    <Grid item xs={5}>
                      <Typography> Response Headers </Typography>
                      <ReactJson
                        iconStyle="triangle"
                        enableClipboard={false}
                        displayDataTypes={false}
                        collapseStringsAfterLength={350}
                        src={res && res.response.headers}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography> Response Body</Typography>
                      <If
                        condition={!!res}
                        then={() => {
                          try {
                            const json = JSON.parse(res.response.data as string);
                            return (
                              <ReactJson
                                iconStyle="triangle"
                                enableClipboard={false}
                                src={json}
                              />
                            )
                          } catch (e) {
                            return <>{res.response.data as string}</>
                          }
                        }}
                        else={() => (
                          <Typography>{'{Empty}'}</Typography>
                        )}
                      />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Zoom>
          </Grid>
        );
      })}
      <If condition={!socket}>
        <LinearProgress color="secondary" />
      </If>
      {/* <LinearProgress color="secondary" /> */}
    </Grid>
  );
}
