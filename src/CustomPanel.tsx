import React, { useEffect, useState } from 'react';
import dh, { Table } from '@deephaven/jsapi-shim';
import Log from '@deephaven/log';
import './MatPlotLibPanel.scss';
import { PanelProps } from '@deephaven/dashboard';

const log = Log.module('@deephaven/js-plugin-template.CustomPanel');

/**
 * Displays a custom panel. Props passed in are determined by your `DashboardPlugin` that registers this panel.
 */
export const CustomPanel = (props: PanelProps): JSX.Element => {
  return <div className="custom-panel">This is a custom panel</div>;
};

CustomPanel.COMPONENT = '@deephaven/js-plugin-template.CustomPanel';

export default CustomPanel;
