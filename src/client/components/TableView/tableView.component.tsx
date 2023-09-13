import React, { memo, useMemo, useState } from 'react';

import * as classes from './tableView.module.css';

export interface TableViewColumn<T extends Record<string, any>> {
  key: string;
  getValue?: (item: T) => string | number | JSX.Element;
  title: string;
  sortable?: boolean;
  width?: string;
  compare?: (a: T, b: T) => number;
  align?: AlignSetting;
}

export interface TableViewProps<T extends Record<string, any>> {
  items: T[];
  columns: Array<TableViewColumn<T>>;
  className?: string;
  selectedId?: string;
  getId: (item: T) => string;
  onRowClick?: (item: T) => void;
}

type ItemHead<T extends Record<string, any>> = {
  onClick: () => void;
} & Required<TableViewColumn<T>>;

export const TableView = memo(function TableView<
  T extends Record<string, any>
>({
  items,
  columns,
  className,
  selectedId,
  onRowClick,
  getId,
}: TableViewProps<T>) {
  const [sorting, setSorting] = useState<[keyof T, 'asc' | 'desc'] | null>(
    null
  );
  const head: Array<ItemHead<T>> = useMemo(
    () =>
      columns.map((column) => {
        const sortable = column.sortable ?? true;
        const isSorted =
          sortable && sorting != null && sorting[0] === column.key;
        const sortDirection = isSorted && sorting[1] === 'desc' ? 1 : -1;
        const title = `${column.title} ${
          isSorted ? (sorting[1] === 'asc' ? '▲' : '▼') : ''
        }`;

        const getValue = column.getValue ?? ((item) => item[column.key]);
        const compare =
          column.compare ??
          ((a, b) => (getValue(a) > getValue(b) ? -1 : 1) * sortDirection);
        const onClick = () => {
          if (!sortable) {
            return;
          }
          if (sorting == null || sorting[0] !== column.key) {
            setSorting([column.key, 'asc']);
          } else if (sorting && sorting[1] === 'asc') {
            setSorting([column.key, 'desc']);
          } else {
            setSorting(null);
          }
        };

        return {
          ...column,
          align: column.align ?? 'left',
          width: column.width ?? '',
          sortable,
          title,
          compare,
          getValue,
          onClick,
        };
      }),
    [columns, sorting]
  );

  const itemsSorted = useMemo(() => {
    if (sorting != null) {
      const compare = head.find((column) => column.key === sorting[0])?.compare;
      return [...items].sort(compare);
    }
    return items;
  }, [items, sorting, head]);

  return (
    <table className={[classes.root, className].join(' ')}>
      <thead>
        <tr>
          {head.map((column) => (
            <th
              key={column.key}
              className={column.sortable ? classes.sortable : ''}
              style={{ textAlign: column.align, width: column.width }}
              onClick={column.onClick}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {itemsSorted.map((item) => (
          <tr
            key={getId(item)}
            className={[
              onRowClick != null ? classes.clickable : '',
              selectedId && getId(item) === selectedId ? classes.selected : '',
            ].join(' ')}
            onClick={onRowClick?.bind(null, item)}
          >
            {head.map((column) => (
              <td
                key={`${getId(item)}_${column.key}`}
                style={{ textAlign: column.align }}
              >
                {column.getValue(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
