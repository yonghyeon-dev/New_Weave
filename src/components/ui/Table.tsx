'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Table Root Component
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm",
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

// Table Header
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "border-b border-border-medium bg-bg-secondary",
      className
    )} 
    {...props} 
  />
));
TableHeader.displayName = "TableHeader";

// Table Body
export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("bg-white", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

// Table Footer
export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-bg-secondary font-medium text-txt-primary",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// Table Row
export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border-light transition-colors hover:bg-bg-secondary data-[state=selected]:bg-weave-primary-light",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

// Table Head Cell
export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-txt-secondary",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// Table Cell
export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-txt-primary",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// Table Caption
export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm text-txt-tertiary",
      className
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// Create compound component
const TableComponent = Table as typeof Table & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Footer: typeof TableFooter;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Cell: typeof TableCell;
  Caption: typeof TableCaption;
};

TableComponent.Header = TableHeader;
TableComponent.Body = TableBody;
TableComponent.Footer = TableFooter;
TableComponent.Row = TableRow;
TableComponent.Head = TableHead;
TableComponent.Cell = TableCell;
TableComponent.Caption = TableCaption;

export default TableComponent;