/**
 * Table Components
 * 
 * Basic table components following shadcn/ui API.
 * Replace with shadcn/ui Table when ready.
 */

import React from 'react';
import PropTypes from 'prop-types';

export const Table = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});
Table.displayName = 'Table';
Table.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const TableHeader = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <thead
      ref={ref}
      className={`[&_tr]:border-b ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
});
TableHeader.displayName = 'TableHeader';
TableHeader.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const TableBody = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <tbody
      ref={ref}
      className={`[&_tr:last-child]:border-0 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
});
TableBody.displayName = 'TableBody';
TableBody.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const TableRow = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <tr
      ref={ref}
      className={`
        border-b transition-colors
        hover:bg-muted/50
        data-[state=selected]:bg-muted
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
});
TableRow.displayName = 'TableRow';
TableRow.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const TableHead = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <th
      ref={ref}
      className={`
        h-12 px-4 text-left align-middle font-medium text-muted-foreground
        [&:has([role=checkbox])]:pr-0
        ${className}
      `}
      {...props}
    >
      {children}
    </th>
  );
});
TableHead.displayName = 'TableHead';
TableHead.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const TableCell = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <td
      ref={ref}
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
});
TableCell.displayName = 'TableCell';
TableCell.propTypes = { className: PropTypes.string, children: PropTypes.node };

