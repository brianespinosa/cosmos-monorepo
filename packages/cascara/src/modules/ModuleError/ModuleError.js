import React from 'react';
import pt from 'prop-types';
import styles from '../DataModule.module.scss';

const propTypes = {
  moduleName: pt.string.isRequired,
  moduleOptions: pt.array.isRequired,
};

const ModuleError = ({ moduleName, moduleOptions }) => {
  const message = `${moduleName} is not a invalid value for module. Try using one of [${moduleOptions.join(
    ', '
  )}]`;
  // eslint-disable-next-line no-console
  console.error(message);

  return <div className={styles.Error}>Invalid module name</div>;
};

ModuleError.propTypes = propTypes;

export default ModuleError;