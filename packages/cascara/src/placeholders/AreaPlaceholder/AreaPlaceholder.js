import React from 'react';
import pt from 'prop-types';
import styles from './AreaPlaceholder.module.scss';

const propTypes = {
  children: pt.oneOfType([pt.element, pt.arrayOf(pt.element)]),
  /** Color of the border */
  color: pt.string,
  /** Label for the container */
  label: pt.string,
  /** Label can have style */
  style: pt.shape({}),
};

const AreaPlaceholder = ({
  children,
  label,
  style,
  color = '#333',
  ...rest
}) => (
  <div
    {...rest}
    className={styles.Container}
    style={{ ...style, borderColor: color }}
  >
    <h4 className={styles.Label} style={{ borderColor: color }}>
      {label}
    </h4>
    {children}
  </div>
);

AreaPlaceholder.propTypes = propTypes;

export default AreaPlaceholder;
