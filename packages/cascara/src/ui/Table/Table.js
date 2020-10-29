import React from 'react';
import pt from 'prop-types';
import styles from './Table.module.scss';

import ErrorBoundary from '../../shared/ErrorBoundary';
import TableProvider from './context/TableProvider';

import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';

// Action modules
import { propTypes as actionButtonPT } from '../../modules/ActionButton';
import { propTypes as actionEditPT } from '../../modules/ActionEdit';

// Data modules
import { propTypes as dataCheckboxPT } from '../../modules/DataCheckbox';
import { propTypes as dataEmailPT } from '../../modules/DataEmail';
import { propTypes as dataNumberPT } from '../../modules/DataNumber';
import { propTypes as dataRadioPT } from '../../modules/DataRadio';
import { propTypes as dataSelectPT } from '../../modules/DataSelect';
import { propTypes as dataTextPT } from '../../modules/DataText';
import { propTypes as dataTextAreaPT } from '../../modules/DataTextArea';

const propTypes = {
  data: pt.arrayOf(pt.shape({})),
  dataConfig: pt.shape({
    actions: pt.arrayOf(pt.oneOfType([actionButtonPT, actionEditPT])),
    display: pt.arrayOf(
      pt.oneOfType([
        dataCheckboxPT,
        dataEmailPT,
        dataNumberPT,
        dataRadioPT,
        dataSelectPT,
        dataTextPT,
        dataTextAreaPT,
      ])
    ),
  }),
  onAction: pt.func,
  uniqueIdAttribute: pt.string.isRequired,
};

const Table = ({
  data,
  dataConfig,
  // eslint-disable-next-line no-console
  onAction = (type, data) => console.log(`Action ${type}:`, data),
  uniqueIdAttribute = 'eid',
  ...rest
}) => {
  const { actions, display } = dataConfig;
  let columnCount = display.length;

  if (actions.length) {
    columnCount++;
  }

  return (
    <ErrorBoundary>
      <TableProvider
        value={{ data, dataConfig, onAction, uniqueIdAttribute }}
        {...rest}
      >
        <table
          className={styles.Table}
          style={{
            gridTemplateColumns: `repeat(${columnCount}, auto)`,
          }}
        >
          <TableHeader />
          <TableBody />
          <TableFooter />
        </table>
      </TableProvider>
    </ErrorBoundary>
  );
};

Table.propTypes = propTypes;

export default Table;
