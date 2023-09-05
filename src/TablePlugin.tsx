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
import { IrisGridContextMenuData } from '@deephaven/iris-grid';
import {
  TablePluginElement,
  TablePluginProps,
} from '@deephaven/dashboard-core-plugins';

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
          getMenu: (
            data: IrisGridContextMenuData
          ): ResolvableContextAction[] => {
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
