import React, { Children, cloneElement } from 'react';
import InfoPopover from '../../InfoPopover';
import { Button } from 'semantic-ui-react';
import styles from '../Dashboard.module.scss';

const Widget = ({
  actions,
  children,
  className,
  description,
  height = 400,
  title = 'WidgetTitle',
  ...rest
}) => {
  return (
    <div className={className || styles.Widget}>
      {actions?.map((action, i) => (
        <Button key={i} {...action} basic floated='right' size='small' />
      ))}
      {description && (
        <InfoPopover message={description} style={{ float: 'right' }} />
      )}
      <h3 className={styles.Title}>{title}</h3>
      <div className={styles.Data} style={{ height: height }}>
        {Children.map(children, (child) => cloneElement(child, { ...rest }))}
      </div>
    </div>
  );
};

export default Widget;
