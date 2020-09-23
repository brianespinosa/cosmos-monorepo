/* eslint-disable react/no-multi-comp */
import React from 'react';
import DataString from '../DataString';
import ActionButton from '../ActionButton';
import { Divider } from 'semantic-ui-react';
import ContextPlaceholder from '../../placeholders/ContextPlaceholder';
import FormProvider from '../../ui/Form/context/FormProvider';
import RowProvider from '../../ui/Table/context/RowProvider';
import TableProvider from '../../ui/Table/context/TableProvider';

const fakeTableData = [
  {
    defaultValue: 'green',
    key: 0,
    label: 'color',
  },
  {
    defaultValue: 'blue',
    key: 1,
    label: 'color',
  },
  {
    defaultValue: 'purple',
    key: 2,
    label: 'color',
  },
];

const FakeRow = ({ defaultValue, label, ...rest }) => (
  <RowProvider
    value={{
      data: { defaultValue, label, ...rest },
    }}
  >
    <ContextPlaceholder color='green' label='RowProvider'>
      <DataString label={label} value={defaultValue} />
      <ActionButton content='Edit' />
    </ContextPlaceholder>
  </RowProvider>
);

const fakeInputLayout = {
  display: 'block',
};

const ContextComposableActions = ({ data, dataConfig }) => {
  return (
    <div style={{ margin: '1em' }}>
      <div>
        <h1>ContextComposableActions POC</h1>
        <p>
          See ContextComposability for more simplified, data only examples about
          context composing patterns. In this example, all of these Form, Table,
          and Row Contexts are created from the same initial context and have
          some special logic happening inside of each of the providers. The use
          cases become more unique in each provider, which allows all of the
          Modules to look for the same base context.
        </p>
        <ul>
          <li>
            Show how using an actual form would work in these scenarios as well
          </li>
        </ul>
      </div>

      <FormProvider>
        <ContextPlaceholder color='cyan' label='FormProvider'>
          <div>
            <DataString
              label='First Name'
              style={fakeInputLayout}
              value='Bobby'
            />
          </div>
          <div>
            <DataString
              label='Last Name'
              style={fakeInputLayout}
              value='Johnson'
            />
          </div>
          <div>
            <DataString
              isEditable={false}
              label='Title'
              style={fakeInputLayout}
              value='Good Worker'
            />
          </div>
          <div
            style={{
              backgroundColor: '#f3f3f3',
              margin: '0 -1em -1em',
              padding: '1em',
            }}
          >
            <ActionButton content='Save' type='submit' />
            <ActionButton content='Cancel' />
            <Divider clearing fitted hidden />
          </div>
        </ContextPlaceholder>
      </FormProvider>

      <TableProvider
        value={{
          // This unique value will get added to the provider below
          fromGrandparent: 'hello',
          // The type will get overridden in the provider below
          type: 'grandparent',
        }}
      >
        <ContextPlaceholder color='pink' label='TableProvider'>
          <DataString value='Table' />
          {fakeTableData.map((row, i) => (
            <FakeRow {...row} />
          ))}
        </ContextPlaceholder>
      </TableProvider>
    </div>
  );
};

const Fixture = <ContextComposableActions />;

export default Fixture;