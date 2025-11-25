/**
 * Breadcrumb Components
 * 
 * Basic breadcrumb components following shadcn/ui API.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ children, className = '' }) => (
  <nav aria-label="breadcrumb" className={className}>
    {children}
  </nav>
);
Breadcrumb.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const BreadcrumbList = ({ children, className = '' }) => (
  <ol className={`flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 ${className}`}>
    {children}
  </ol>
);
BreadcrumbList.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const BreadcrumbItem = ({ children, className = '' }) => (
  <li className={`inline-flex items-center gap-1.5 ${className}`}>
    {children}
  </li>
);
BreadcrumbItem.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const BreadcrumbLink = ({ children, href, className = '' }) => (
  <a
    href={href}
    className={`transition-colors hover:text-foreground ${className}`}
  >
    {children}
  </a>
);
BreadcrumbLink.propTypes = { children: PropTypes.node, href: PropTypes.string, className: PropTypes.string };

export const BreadcrumbPage = ({ children, className = '' }) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={`font-normal text-foreground ${className}`}
  >
    {children}
  </span>
);
BreadcrumbPage.propTypes = { children: PropTypes.node, className: PropTypes.string };

export const BreadcrumbSeparator = ({ children, className = '' }) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={`[&>svg]:size-3.5 ${className}`}
  >
    {children || <ChevronRight className="h-4 w-4" />}
  </li>
);
BreadcrumbSeparator.propTypes = { children: PropTypes.node, className: PropTypes.string };

