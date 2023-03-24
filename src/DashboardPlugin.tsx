import React, { DragEvent, useCallback, useEffect } from 'react';
import shortid from 'shortid';
import {
  DashboardPluginComponentProps,
  LayoutUtils,
  PanelEvent,
  useListener,
} from '@deephaven/dashboard';
import { VariableDefinition } from '@deephaven/jsapi-types';
import Log from '@deephaven/log';
import CustomPanel from './CustomPanel';
import { ReactComponentConfig } from '@deephaven/golden-layout';
import { IrisGridEvent } from '@deephaven/dashboard-core-plugins';
import { IrisGridPanel } from '@deephaven/dashboard-core-plugins/dist/panels/IrisGridPanel';
import { RowDataMap } from '@deephaven/jsapi-utils';

/**
 * Create your own logger module to easily identify where logs are being printed from.
 * Update the name to match your package name.
 */
const log = Log.module('@deephaven/js-plugin-template.DashboardPlugin');

/**
 * Specify a plugin matching an expected custom object type to react to when that object type is opened.
 * See https://github.com/deephaven/deephaven-plugin for building a server side plugin for exporting a custom object.
 */
export const VARIABLE_TYPE = 'example.custom.MyVariableType';

/**
 * Dashboard Plugin. Registers with a dashboard. The rendered component will be rendered atop the dashboard layout.
 * Register custom components and listeners to open your own panels.
 * @param props The props passed in from the Dashboard
 * @returns A rendered dashboard component
 */
export const DashboardPlugin = ({
  id,
  layout,
  registerComponent,
}: DashboardPluginComponentProps): JSX.Element => {
  // TODO: This type should be defined in @deephaven packages
  // PanelOpenEventDetail
  const handlePanelOpen = useCallback(
    ({
      dragEvent,
      fetch,
      panelId = shortid.generate(),
      widget,
    }: {
      dragEvent?: DragEvent;
      fetch: () => Promise<unknown>;
      panelId?: string;
      widget: VariableDefinition;
    }) => {
      const { id: widgetId, name, type } = widget;
      if ((type as string) !== VARIABLE_TYPE) {
        // Only want to listen for your custom panel types
        return;
      }
      log.info('Panel opened of type', type);
      const metadata = { id: widgetId, name, type };
      const config: ReactComponentConfig = {
        type: 'react-component',
        component: CustomPanel.COMPONENT,
        props: {
          localDashboardId: id,
          id: panelId,
          metadata,
          fetch,
        },
        title: name,
        id: panelId,
      };

      const { root } = layout;
      LayoutUtils.openComponent({ root, config, dragEvent });
    },
    [id, layout]
  );

  // TODO: use IrisGridDataSelectedEventCallback type instead
  const handleDataSelected = useCallback(
    (panel: IrisGridPanel, data: RowDataMap) => {
      log.info('Data selected', data);
    },
    []
  );

  useEffect(() => {
    /**
     * Register our custom component type so the layout know hows to open it
     */
    const cleanups = [registerComponent(CustomPanel.COMPONENT, CustomPanel)];

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [registerComponent]);

  /**
   * Listen for panel open events so we know when to open a panel
   */
  useListener(layout.eventHub, PanelEvent.OPEN, handlePanelOpen);

  /**
   * Listen for when data is selected in a grid panel
   */
  useListener(layout.eventHub, IrisGridEvent.DATA_SELECTED, handleDataSelected);

  /**
   * Return a view here if you want something overlaid on top of the dashboard.
   */
  return <></>;
};

export default DashboardPlugin;
