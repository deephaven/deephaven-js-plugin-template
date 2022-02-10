import React from 'react';

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
export const TablePlugin = (): JSX.Element => <></>;

export default TablePlugin;
