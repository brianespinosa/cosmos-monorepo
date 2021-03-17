import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'reakit';
import 'mutationobserver-shim';

import Table from './';
import { generateFakeEmployees } from '../../lib/mock/fakeData';

describe('Table', () => {
  // Component tree
  // This test suite addresses the very basics of testing the Table UI.
  //
  // The first test is the snapshot, nothing special.
  //
  // Table actions
  // An extra column is appended if any or both of these are true:
  //
  // a) at least one `action` is specified in `dataConfig.actions` array
  // b) at least one column in the `dataConfig.display` array is editable
  //
  // In either cases, the extra column displays the action modules.
  //
  // The test `row actions` corresponds to condition a, whilst the test
  // `editable records` addresses condition b.
  describe('component tree', () => {
    const datasetSize = 10;
    const data = generateFakeEmployees(datasetSize);
    const actions = {
      actionButtonMenuIndex: 2,
      modules: [
        {
          content: 'view',
          isLabeled: false,
          module: 'button',
          name: 'view',
          size: 'small',
        },
        {
          content: 'delete',
          isLabeled: false,
          module: 'button',
          name: 'delete',
          size: 'small',
        },
        {
          cancelLabel: 'Cancel',
          content: 'edit',
          isLabeled: false,
          module: 'edit',
          name: 'edit',
          saveLabel: 'Save',
          size: 'small',
        },
      ],
    };

    const dataConfig = {
      display: [
        {
          attribute: 'active',
          isEditable: true,
          isLabeled: false,
          label: 'Active',
          module: 'checkbox',
        },
        {
          attribute: 'eid',
          isEditable: false,
          isLabeled: false,
          label: 'ID',
          module: 'text',
        },
        {
          'aria-label': 'Email',
          attribute: 'email',
          isEditable: true,
          isLabeled: false,
          label: 'Email',
          module: 'email',
        },
        {
          attribute: 'country',
          isEditable: true,
          isLabeled: false,
          label: 'Country',
          module: 'select',
          options: [
            {
              label: 'Argentina',
              value: 'Argentina',
            },
            {
              label: 'Brazil',
              value: 'Brazil',
            },
            {
              label: 'USA',
              value: 'USA',
            },
          ],
        },
        {
          attribute: 'employeeNumber',
          isEditable: true,
          isLabeled: false,
          label: 'Employee Number',
          module: 'number',
        },
        {
          attribute: 'fullName',
          isEditable: true,
          isLabeled: false,
          label: 'Full Name',
          module: 'text',
        },
        {
          attribute: 'homePhone',
          isEditable: true,
          isLabeled: false,
          label: 'Home Phone',
          module: 'text',
        },
        {
          attribute: 'officePhone',
          isEditable: true,
          isLabeled: false,
          label: 'Office Phone',
          module: 'text',
        },
        {
          attribute: 'title',
          isEditable: true,
          isLabeled: false,
          label: 'Title',
          module: 'text',
        },
      ],
    };

    test('snapshot test', () => {
      const view = render(
        <Provider>
          <Table
            actions={actions}
            data={data}
            dataConfig={dataConfig}
            uniqueIdAttribute={'eid'}
          />
        </Provider>
      ).container;

      expect(view).toMatchSnapshot();
    });

    // The markup generated by the table must match the dataset characteristics.
    // All column definitions in this test suite `dataConfig.display` have a `data-testid`
    // attribute which is used here to do a simple test:
    //
    //   Does the number of (found) testIDs match the result of multiplying `datasetSize`
    //   by the number of columns in `dataConfig.display`?
    test('table markup vs. dataset', () => {
      const { display = [] } = dataConfig;
      const expectedRowCount = datasetSize;
      const expectedCellCount = (display.length + 1) * expectedRowCount;

      render(
        <Table
          actions={actions}
          data={data}
          dataConfig={dataConfig}
          uniqueIdAttribute={'eid'}
        />
      );

      const table = screen.getByRole('table');
      const bodyAndHeader = screen.getAllByRole('rowgroup');
      const rows = screen.getAllByRole('row');
      const cells = screen.getAllByRole('cell');

      expect(table).toBeInTheDocument();

      // thead and tbody are both rowgroup
      expect(bodyAndHeader).toHaveLength(2);

      // we expect all table columns + actions column
      expect(rows).toHaveLength(expectedRowCount + 1);

      expect(cells).toHaveLength(expectedCellCount);
    });

    test('without row actions', () => {
      const view = render(
        <Provider>
          <Table
            actions={actions}
            data={data}
            dataConfig={dataConfig}
            uniqueIdAttribute={'eid'}
          />
        </Provider>
      ).container;

      expect(view).toMatchSnapshot();
    });

    // Actions and onAction.
    //
    // When emitted, the `onAction` event contains two arguments, the first
    // one being the element that was clicked, the second is the data of the
    // row that was clicked.
    //
    // This test validates the Actions specified in `dataConfig.actions`.
    test('with row actions', async () => {
      const onAction = jest.fn();

      render(
        <Table
          actions={actions}
          data={data}
          dataConfig={dataConfig}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const [viewButton] = screen.getAllByRole('button', {
        name: 'view',
      });
      userEvent.click(viewButton);

      expect(onAction.mock.calls[0][0]).toHaveAttribute('name', 'view');
      expect(onAction.mock.calls[0][1]).toEqual({
        active: true,
        country: 'Argentina',
        eid: '024f2316-265a-46e8-965a-837e308ae678',
        email: 'Hayden.Zieme@espressive.com',
        employeeNumber: 93912,
        fullName: 'Hayden Zieme',
        homePhone: '887.983.0658',
        officePhone: '(980) 802-1086 x05469',
        title: 'District Operations Officer',
      });

      const [deleteButton] = screen.getAllByRole('button', {
        name: 'delete',
      });
      userEvent.click(deleteButton);

      expect(onAction.mock.calls[1][0]).toHaveAttribute('name', 'delete');
      expect(onAction.mock.calls[1][1]).toEqual({
        active: true,
        country: 'Argentina',
        eid: '024f2316-265a-46e8-965a-837e308ae678',
        email: 'Hayden.Zieme@espressive.com',
        employeeNumber: 93912,
        fullName: 'Hayden Zieme',
        homePhone: '887.983.0658',
        officePhone: '(980) 802-1086 x05469',
        title: 'District Operations Officer',
      });

      const [editButton] = await screen.findAllByRole('button', {
        name: 'Edit',
      });
      userEvent.click(editButton);

      expect(onAction.mock.calls[2][0]).toEqual({ name: 'edit.start' });
      expect(onAction.mock.calls[2][1]).toEqual({
        active: true,
        country: 'Argentina',
        eid: '024f2316-265a-46e8-965a-837e308ae678',
        email: 'Hayden.Zieme@espressive.com',
        employeeNumber: 93912,
        fullName: 'Hayden Zieme',
        homePhone: '887.983.0658',
        officePhone: '(980) 802-1086 x05469',
        title: 'District Operations Officer',
      });
    });

    // Actions wrapped in an ActionsMenu
    test('it renders no <ActionsMenu /> if actionButtonMenuIndex equals button actions number', () => {
      const onAction = jest.fn();

      render(
        <Table
          actions={actions}
          data={data}
          dataConfig={{
            ...dataConfig,
            actionButtonMenuIndex: 2,
          }}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const allEditButtons = screen.getAllByRole('button', {
        name: 'Edit',
      });
      expect(allEditButtons).toHaveLength(datasetSize);

      const allViewButtons = screen.getAllByRole('button', { name: 'view' });
      expect(allViewButtons).toHaveLength(datasetSize);

      const allDeleteButtons = screen.getAllByRole('button', {
        name: 'delete',
      });
      expect(allDeleteButtons).toHaveLength(datasetSize);
    });

    // Actions wrapped in an ActionsMenu
    test('it renders <ActionsMenu /> if actionButtonMenuIndex is less than the button actions number', () => {
      const onAction = jest.fn();

      render(
        <Table
          actions={actions}
          data={data}
          dataConfig={dataConfig}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const allEditButtons = screen.getAllByRole('button', {
        name: 'Edit',
      });
      expect(allEditButtons).toHaveLength(datasetSize);

      const allViewButtons = screen.getAllByRole('button', { name: 'view' });
      expect(allViewButtons).toHaveLength(datasetSize);

      const allDeleteButtons = screen.getAllByRole('button', {
        name: 'delete',
      });
      expect(allDeleteButtons).toHaveLength(datasetSize);
    });

    // Editable records and onAction.
    //
    // The table emmits certain events depending on the actions taken by the User.
    // In this scenario, the user enters the edit mode, updates the email and clicks the save button.
    //
    // This test validates that:
    //
    // 1.- the events are actualy emitted by the Table
    // 2.- the data reflects the changes made by the user
    // 3.- the number of buttons present in each case.
    test('editable records', async () => {
      const testEmail = 'engineering@espressive.com';
      const onAction = jest.fn();

      render(
        <Table
          actions={actions}
          data={data}
          dataConfig={dataConfig}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const [fistRow] = screen.getAllByRole('row');

      const [editButton] = screen.getAllByRole('button', {
        container: fistRow,
        name: 'Edit',
      });
      userEvent.click(editButton);

      userEvent.clear(
        screen.getByRole('textbox', {
          container: fistRow,
          name: 'Email',
        })
      );
      userEvent.type(
        screen.getByRole('textbox', {
          container: fistRow,
          name: 'Email',
        }),
        testEmail
      );

      userEvent.click(
        screen.getByRole('button', {
          container: fistRow,
          name: 'Save',
        })
      );

      await waitFor(() => expect(onAction).toHaveBeenCalledTimes(2));

      // The table first reacted with the edit.start event
      expect(onAction.mock.calls[0][0]).toEqual({ name: 'edit.start' });
      expect(onAction.mock.calls[0][1]).toEqual({
        active: true,
        country: 'Argentina',
        eid: '024f2316-265a-46e8-965a-837e308ae678',
        email: 'Hayden.Zieme@espressive.com',
        employeeNumber: 93912,
        fullName: 'Hayden Zieme',
        homePhone: '887.983.0658',
        officePhone: '(980) 802-1086 x05469',
        title: 'District Operations Officer',
      });

      // Lastly, the table emits the edit.save event
      expect(onAction.mock.calls[1][0]).toEqual({ name: 'edit.save' });
      expect(onAction.mock.calls[1][1]).toEqual({
        active: true,
        country: 'Argentina',
        eid: '024f2316-265a-46e8-965a-837e308ae678',
        email: testEmail,
        employeeNumber: '93912', // todo @manu: make sure the data is not touched!!!
        fullName: 'Hayden Zieme',
        homePhone: '887.983.0658',
        officePhone: '(980) 802-1086 x05469',
        title: 'District Operations Officer',
      });
    });

    // Cancelling the edition of a record.
    //
    // Upon exiting the edit mode via the cancel button, the Table must have emitted these events:
    //
    // edit.start - when clicking the edit button
    // edit.cancel - when clicking the cancel button
    //
    // This test validates the events are actualy emitted by the Table, as well
    // as the number of buttons present in each case.
    test('cancelling record edition', async () => {
      const onAction = jest.fn();

      render(
        <Table
          actions={actions}
          data={data}
          dataConfig={dataConfig}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const editButtons = screen.getAllByRole('button', { name: 'Edit' });
      fireEvent(
        editButtons[0],
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );

      await screen.findAllByRole('button', {
        name: 'Save',
      });

      expect(onAction).toBeCalledWith(
        expect.any(Object),
        expect.objectContaining({
          active: true,
          country: 'Argentina',
          eid: '024f2316-265a-46e8-965a-837e308ae678',
          email: 'Hayden.Zieme@espressive.com',
          employeeNumber: 93912,
          fullName: 'Hayden Zieme',
          homePhone: '887.983.0658',
          officePhone: '(980) 802-1086 x05469',
          title: 'District Operations Officer',
        })
      );

      fireEvent(
        screen.getByRole('button', {
          name: 'Cancel',
        }),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );

      await screen.findAllByRole('button', {
        name: 'Edit',
      });

      expect(onAction).toBeCalledWith(
        expect.any(Object),
        expect.objectContaining({
          active: true,
          country: 'Argentina',
          eid: '024f2316-265a-46e8-965a-837e308ae678',
          email: 'Hayden.Zieme@espressive.com',
          employeeNumber: 93912,
          fullName: 'Hayden Zieme',
          homePhone: '887.983.0658',
          officePhone: '(980) 802-1086 x05469',
          title: 'District Operations Officer',
        })
      );
    });

    test('actions without onAction handler', () => {
      render(
        <Table
          actions={actions}
          data={data}
          dataConfig={dataConfig}
          uniqueIdAttribute={'eid'}
        />
      );

      const allEditButtons = screen.getAllByRole('button', {
        name: 'Edit',
      });

      expect(allEditButtons).toHaveLength(datasetSize);
    });

    // FDS-164: table header not adding an extra column for actions
    test("deprecated dataConfig.actions prop doesn't break header number of columns", () => {
      const oldDataConfig = {
        ...dataConfig,
        actions: actions.modules,
      };

      render(
        <Table
          data={data}
          dataConfig={oldDataConfig}
          uniqueIdAttribute={'eid'}
        />
      );

      const renderedCells = screen.getAllByRole('cell');
      const expectedCells = (dataConfig.display.length + 1) * datasetSize;

      expect(renderedCells).toHaveLength(expectedCells);
    });

    // FDS-164: table header not adding an extra column for actions
    test("new actions prop doesn't break header number of columns", () => {
      render(
        <Table
          actions={actions}
          data={data}
          dataConfig={dataConfig}
          uniqueIdAttribute={'eid'}
        />
      );

      const renderedCells = screen.getAllByRole('cell');
      const expectedCells = (dataConfig.display.length + 1) * datasetSize;

      expect(renderedCells).toHaveLength(expectedCells);
    });

    // eslint-disable-next-line jest/no-commented-out-tests -- @manu todo: FDS-154 - resolve failint negative tests
    // test('actions with non-existent module', () => {
    //   const wrongModuleName = 'Superdooper';
    //   render(
    //     <Table
    //       data={data}
    //       dataConfig={{
    //         ...dataConfig,
    //         actions: [
    //           {
    //             content: 'view',
    //             'data-testid': 'view',
    //             isLabeled: false,
    //             module: wrongModuleName,
    //             name: 'view',
    //             size: 'small',
    //           },
    //         ],
    //       }}
    //       uniqueIdAttribute={'eid'}
    //     />
    //   );

    //   const moduleError = screen.findByText(
    //     `${wrongModuleName} is not a valid value for module. Try using one of [button, edit]`
    //   );

    //   expect(moduleError).toBeTruthy();
    // });

    // eslint-disable-next-line jest/no-commented-out-tests -- @manu todo: FDS-154 - resolve failint negative tests
    // test('columns with non-existent module', () => {
    //   const wrongModuleName = 'Superdooper';
    //   render(
    //     <Table
    //       data={data}
    //       dataConfig={{
    //         ...dataConfig,
    //         display: [
    //           {
    //             attribute: 'active',
    //             'data-testid': 'active',
    //             isEditable: true,
    //             isLabeled: false,
    //             label: 'Active',
    //             module: wrongModuleName,
    //           },
    //         ],
    //       }}
    //       uniqueIdAttribute={'eid'}
    //     />
    //   );

    //   const moduleError = screen.findByText(
    //     `${wrongModuleName} is not a valid value for module. Try using one of [button, edit]`
    //   );

    //   expect(moduleError).toBeTruthy();
    // });
  });
});
