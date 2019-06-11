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
import Freeze from '@anissoft/react-helpers/components/Freeze'
import useThrottle from '@anissoft/react-helpers/hooks/useThrottle'

import useStyles from './styles';
import { Response, Request, WSListener } from '../../../types'
import { getMethod, getUrl, getHost, getPath } from '../exctractors';
import { useRequests } from '../useRequests';

// function Freeze({
//   enabled,
//   children,
// }: {
//   enabled?: boolean;
//   children: (() => JSX.Element);
// }) {
//   // tslint:disable-next-line: no-boolean-literal-compare
//   const shouldUpdate = enabled === false ? 'no' : Symbol('yes');
//   debugger;
//   return React.useMemo(() => <>{children()}</>, [shouldUpdate]);
// };

const Request = ({ req, res, time }: { req: Request, res: Response, time: number }) => {
  const classes = useStyles({});
  function getStatusColor(status: number) {
    if (status < 300) {
      return classes.statusGreen;
    }
    if (status >= 400) {
      return classes.statusRed;
    }
    return classes.statusYellow;
  };

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
                  {`${new Date(time).toLocaleTimeString()} - `}
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
};

let RENDER: {
  [key in 'prev' | 'new']: JSX.Element | null
} = {
  prev: null,
  new: null,
};
export const List = (props: {
  addSocketListener: (arg0: WSListener) => (() => void),
  filter?: string,
  enabled?: boolean,
}) => {
  const classes = useStyles({});
  const { filter, addSocketListener, enabled } = props;
  const [_requests, _responses, times] = useRequests({ addSocketListener });
  const requests = useThrottle(_requests, 300);
  const responses = useThrottle(_responses, 300);

  return React.useMemo(
    () => (
      <>
        <Freeze enabled={enabled}>
          <Grid
            container
            className={classes.root}
            direction="column"
            justify="flex-end"
          >
            {(Object as any).values(requests)
              .map((request: Request) =>
                <If
                  key={request.id}
                  condition={filter ? JSON.stringify(request).includes(filter) : true}
                  then={() => <Request
                    req={request}
                    res={responses[request.id]}
                    time={times[request.id]}
                  />}
                />
              )}
          </Grid>
        </Freeze>
      </>
    ),
    [requests, responses, filter, enabled]);
}
