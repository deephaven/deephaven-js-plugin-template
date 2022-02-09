import React, { useCallback, useEffect } from 'react';
import shortid from 'shortid';
import {
  DashboardPluginComponentProps,
  LayoutUtils,
  PanelEvent,
  useListener,
} from '@deephaven/dashboard';
import JsonPanel from './JsonPanel';

export const DashboardPlugin = ({
  id,
  layout,
  registerComponent,
}: DashboardPluginComponentProps): JSX.Element => {
  const handlePanelOpen = useCallback(
    ({
      name = '',
      makeModel,
      metadata = {},
      id: panelId = shortid.generate(),
      dragEvent,
    }: {
      name: string;
      makeModel: () => Promise<unknown>;
      metadata: Record<string, unknown>;
      id: string;
      dragEvent?: DragEvent;
    }) => {
      const config = {
        type: 'react-component',
        component: JsonPanel.COMPONENT,
        props: {
          localDashboardId: id,
          id: panelId,
          metadata,
          makeModel,
        },
        title: name,
        id: panelId,
      };

      const { root } = layout;
      LayoutUtils.openComponent({ root, config, dragEvent });
    },
    [id, layout]
  );

  useEffect(() => {
    const cleanups = [registerComponent(JsonPanel.COMPONENT, JsonPanel)];

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [registerComponent]);

  useListener(layout.eventHub, PanelEvent.OPEN, handlePanelOpen);

  return <></>;
};

export default DashboardPlugin;
