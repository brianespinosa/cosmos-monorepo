import React, { useContext } from 'react';

import Button from '../Button';
import DownloadButton from '../../modules/DownloadButton';

import TableContext from './context';
import SelectionToggle from './atoms/SelectionToggle';
import ActionBar from './ActionBar';

const TableFooter = () => {
  const {
    actions,
    bulkActions,
    dataConfig,
    handleOnAction,
    selection,
    selectionIsEnabled,
  } = useContext(TableContext);
  const selectionCell = (
    <th key={'main-toggle'}>
      <SelectionToggle id={'__ALL__'} />
    </th>
  );
  const headerCells = dataConfig.display.map((column) => (
    <th key={column.attribute}>{column.label}</th>
  ));

  if (selectionIsEnabled) {
    headerCells.unshift(selectionCell);
  }
  if (actions.length) {
    headerCells.push(<th key={'action-bar-slot'} />);
  }

  const actionBar =
    selection.length && bulkActions.length ? (
      <tr>
        <th
          colSpan={headerCells.length}
          scope={'colgroup'}
          style={{
            background: '#5FB59D',
            display: 'flex',
            gridColumn: `1/${headerCells.length + 1}`,
            justifyContent: 'space-between',
          }}
        >
          <ActionBar
            actions={bulkActions.map((action) => {
              let Component;

              switch (action.module.type) {
                case 'download':
                  Component = DownloadButton;
                  break;

                default:
                  Component = Button;
              }

              return (
                <Component
                  {...action}
                  content={action.label}
                  key={action.label}
                  onClick={() => handleOnAction(action)}
                />
              );
            })}
            title={`${selection.length} selected`}
          />
        </th>
      </tr>
    ) : (
      ''
    );

  return (
    <tfoot>
      <tr>{headerCells}</tr>
      {actionBar}
    </tfoot>
  );
};

export default TableFooter;