import React, { useCallback } from 'react';
import {
  DashboardPluginComponentProps,
  useComponent,
  useListener,
} from '@deephaven/dashboard';
import Log from '@deephaven/log';
import CustomPanel from './CustomPanel';
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
export const DashboardPlugin = (
  props: DashboardPluginComponentProps
): JSX.Element => {
  const { layout } = props;

  /** Register our custom panel to open when an object of `VARIABLE_TYPE` is created */
  useComponent(props, CustomPanel.COMPONENT, CustomPanel, VARIABLE_TYPE);

  /**
   * Call back for use when data is selected.
   * We declare this using `useCallback` so that it does not trigger re-renders when passed into `useListener`.
   */
  const handleDataSelected = useCallback(
    (panel: IrisGridPanel, data: RowDataMap) => {
      log.info('Data selected', data);
    },
    []
  );

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
