import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ResolvableContextAction,
} from '@deephaven/components';
import { Column, Table } from '@deephaven/jsapi-types';
import { GridRangeIndex } from '@deephaven/grid';
import { ColumnName, InputFilter, IrisGridModel } from '@deephaven/iris-grid';
import {
  IrisGridPanel,
  PanelState,
} from '@deephaven/dashboard-core-plugins/dist/panels/IrisGridPanel';
import { User, Workspace } from '@deephaven/redux';

// TODO: These types should be imported from iris-grid and core-plugins packages when they have them all defined
// https://github.com/deephaven/web-client-ui/pull/1176
export interface ContextMenuData {
  model: IrisGridModel;
  value: unknown;
  valueText: string | null;
  column: Column;
  rowIndex: GridRangeIndex;
  columnIndex: GridRangeIndex;
  modelRow: GridRangeIndex;
  modelColumn: GridRangeIndex;
}

export interface TablePluginElement {
  getMenu?: (data: ContextMenuData) => ResolvableContextAction[];
}

export interface TablePluginProps {
  /**
   * Apply filters to the table
   * @param filters Filters to apply to the table
   */
  filter: (filters: InputFilter[]) => void;

  /** @deprecated Use `filter` instead */
  onFilter: (filters: InputFilter[]) => void;

  /**
   * Set columns that should always be fetched, even if they're outside the viewport
   * @param pluginFetchColumns Names of columns to always fetch
   */
  fetchColumns: (pluginFetchColumns: ColumnName[]) => void;

  /** @deprecated Use `fetchColumns` instead */
  onFetchColumns: (pluginFetchColumns: ColumnName[]) => void;

  /**
   * The table this plugin was associated with
   */
  table: Table;

  /**
   * The IrisGridPanel displaying this table
   */
  panel: IrisGridPanel;

  /**
   * Current user information
   */
  user: User;

  /**
   * Current user workspace data
   */
  workspace: Workspace;

  /**
   * Notify of a state change in the plugin state. Will be saved with the panel data.
   * Should be an object that can be serialized to JSON.
   * @param pluginState State of the plugin to save
   */
  onStateChange: (pluginState: PanelState['pluginState']) => void;

  /**
   * Current plugin state. Use to load.
   */
  pluginState: PanelState['pluginState'];
}

export type TablePlugin = React.ForwardRefExoticComponent<
  TablePluginProps & React.RefAttributes<TablePluginElement>
>;

/**
 * A Table Plugin. TablePlugins are loaded with a table when it has the `PLUGIN_NAME` attribute specified.
 * The plugin is rendered above the table.
 * Can also add hooks or callbacks to control the table, context menu, etc.
 *
 * @example
 * from deephaven.TableTools import emptyTable
 * t = emptyTable(5).update("X=i")
 * t.setAttribute("PluginName", "@deephaven/js-plugin-template")
 */
export const TablePlugin = forwardRef<TablePluginElement, TablePluginProps>(
  function TablePlugin(props, ref): JSX.Element {
    const confirmButton = useRef<HTMLButtonElement>(null);
    /**
     * Controls when the modal dialog is shown.
     */
    const [isModalOpen, setIsModalOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => {
        /**
         * Return actions that are shown in the context menu when right-clicking on a table with this plugin
         */
        return {
          // TODO: Use `ContextMenuData` type from iris-grid package once available
          getMenu: (data: {
            model: IrisGridModel;
            value: unknown;
            valueText: string | null;
            column: Column;
            rowIndex: GridRangeIndex;
            columnIndex: GridRangeIndex;
            modelRow: GridRangeIndex;
            modelColumn: GridRangeIndex;
          }): ResolvableContextAction[] => {
            const { filter, table } = props;
            const { value, column, model } = data;
            const { name, type } = column;
            const actions: ResolvableContextAction[] = [];

            actions.push({
              title: 'Display value',
              group: 0,
              order: 0,
              action: () => alert(value),
            });

            actions.push({
              title: 'Show Dialog',
              group: 0,
              order: 10,
              action: () => setIsModalOpen(true),
            });

            actions.push({
              title: 'Display Table',
              group: 0,
              order: 20,
              action: () => alert(table),
            });

            actions.push({
              title: 'Display Model',
              group: 0,
              order: 30,
              action: () => alert(model),
            });

            const subMenu: ResolvableContextAction[] = [];

            subMenu.push({
              title: 'Filter by value',
              group: 0,
              order: 0,
              action: () =>
                filter([
                  {
                    name,
                    type,
                    value: `${value}`,
                  },
                ]),
            });

            subMenu.push({
              title: 'Clear Filter',
              group: 0,
              order: 10,
              action: () => filter([]),
            });

            actions.push({
              title: 'Filter Sub Menu',
              group: 0,
              order: 40,
              actions: subMenu,
            });

            return actions;
          },
        };
      },
      []
    );

    /**
     * Whatever is rendered here will be displayed above the table this plugin is registered with.
     * You can also display a modal dialog using this render method as shown below.
     */
    return (
      <div>
        <label>Example Plugin</label>
        <Modal
          isOpen={isModalOpen}
          className="theme-bg-light"
          onOpened={() => {
            confirmButton.current?.focus();
          }}
        >
          <ModalHeader>Plugin Modal Title</ModalHeader>
          <ModalBody>Plugin Modal Body</ModalBody>
          <ModalFooter>
            <Button
              kind="secondary"
              data-dismiss="modal"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              kind="primary"
              onClick={() => {
                setIsModalOpen(false);
              }}
              ref={confirmButton}
            >
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
);

export default TablePlugin;
