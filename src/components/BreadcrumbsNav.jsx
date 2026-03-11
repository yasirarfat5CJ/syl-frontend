import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BreadcrumbsNav = ({ items = [] }) => {
  if (!items.length) {
    return null;
  }

  return (
    <Breadcrumb className="app-breadcrumb mb-3">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Breadcrumb.Item
            key={`${item.label}-${index}`}
            active={isLast || !item.to}
            linkAs={item.to && !isLast ? Link : undefined}
            linkProps={item.to && !isLast ? { to: item.to } : undefined}
          >
            {item.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadcrumbsNav;
