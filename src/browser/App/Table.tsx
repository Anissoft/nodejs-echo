import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { CompleteItem } from '../../types';
import useStyles from './styles';
import { If, Then, Else } from '@anissoft/react-helpers/components/If';

interface Column {
  id: 'method' | 'direction' | 'url' | 'status' | 'time';
  label: React.ReactNode;
  get: (item: CompleteItem) => React.ReactNode;
  minWidth?: number;
  align?: 'right';
}

const columns: Column[] = [
  {
    id: 'direction',
    get: item => (
      <If condition={item.type === 'incoming'}>
        <Then>
          <ArrowForward fontSize="small" />
        </Then>
        <Else>
          <ArrowBack fontSize="small" />
        </Else>
      </If>
    ),
    label: '',
    minWidth: 20,
  },
  { id: 'method', get: item => item.request.method, label: 'Method', minWidth: 70 },
  {
    id: 'url',
    label: 'URL',
    get: item => {
      const outgoingUrl =
        item.request.href ||
        `${item.request.protocol || 'http://'}${item.request.hostname}${item.request.path}`;
      const incomingUrl = item.request.url;
      return (
        <div
          style={{
            width: 'calc(100vw - 350px)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <If condition={item.type === 'incoming'}>
            <Then>{incomingUrl}</Then>
            <Else>{outgoingUrl}</Else>
          </If>
        </div>
      );
    },
    minWidth: 170,
  },
  {
    id: 'status',
    label: 'Status',
    get: item => item.response?.statusCode,
    minWidth: 60,
    align: 'right',
  },
  {
    id: 'time',
    label: 'Time',
    minWidth: 100,
    get: item =>
      new Date(item.request.time)
        .toLocaleTimeString()
        .replace(
          /[AMP\s]+/,
          `::${(1e15 + new Date(item.request.time).getMilliseconds() + '').slice(-3)}`,
        ),
    align: 'right',
  },
];

export default ({
  items,
  onClick,
}: {
  items: CompleteItem[];
  onClick: (item: CompleteItem) => void;
}) => {
  const classes = useStyles({});
  return (
    <TableContainer style={{ marginTop: 50 }}>
      <Table stickyHeader size="small" padding="checkbox">
        <TableHead>
          <TableRow>
            {columns.map(function(column) {
              return (
                <TableCell
                  size="small"
                  padding="checkbox"
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(function(item) {
            return (
              <TableRow
                onClick={onClick.bind(null, item)}
                hover
                role="checkbox"
                tabIndex={-1}
                key={item.id}
                className={classes.row}
              >
                {columns.map(function(column) {
                  return (
                    <TableCell key={column.id} align={column.align} size="small" padding="checkbox">
                      {column.get(item)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
