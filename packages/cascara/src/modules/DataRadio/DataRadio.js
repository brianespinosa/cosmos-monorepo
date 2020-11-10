import React, { useContext } from 'react';
import pt from 'prop-types';
import { Radio, RadioGroup, useRadioState } from 'reakit/Radio';
import { ModuleContext } from '../context';
import styles from '../DataModule.module.scss';

import ErrorBoundary from '../../shared/ErrorBoundary';
import { getAttributeValueFromRecord } from '../../shared/recordUtils';

const propTypes = {
  /** A module can have an Attribute, which will be used as form field name */
  attribute: pt.string,
  /** A module can have a data test id, which will be used in tests */
  'data-testid': pt.string,
  /** A Module can be defined to not present an editing state */
  isEditable: pt.bool,
  /** Presents the input without a label. NOT USER CONFIGURABLE */
  isLabeled: pt.bool,
  /** A Module needs to have a unique label relative to its context */
  label: pt.string,
  /** A Module can have a value */
  value: pt.bool,
};

const DataRadio = ({
  attribute,
  isEditable = true,
  isLabeled = true,
  label,
  options,
  value,
  ...rest
}) => {
  const { isEditing, formMethods, record } = useContext(ModuleContext);
  const finalValue =
    attribute && record
      ? getAttributeValueFromRecord(attribute, record)
      : value;
  const radio = useRadioState({ state: finalValue });

  const renderRadio = (option) => (
    <label htmlFor={option.label}>
      <Radio
        {...radio}
        className={styles.Input}
        id={option.label}
        name={option.label}
        ref={formMethods?.register}
        type='radio'
        value={option.label}
      />
      {option.label && isLabeled && (
        <span className={styles.LabelText}>{option.label}</span>
      )}
    </label>
  );

  const renderEditing = (
    <RadioGroup
      {...radio}
      {...rest}
      aria-label='fruits'
      className={styles.Radio}
    >
      {options
        ? options.map((option) => renderRadio(option))
        : renderRadio(finalValue)}
    </RadioGroup>
  );

  const renderDisplay = (
    <ErrorBoundary>
      <div className={styles.Radio}>
        <span>
          <span className={styles.Input} {...rest}>
            {finalValue}
          </span>
          {label && isLabeled && (
            <span className={styles.LabelText}>{label}</span>
          )}
        </span>
      </div>
    </ErrorBoundary>
  );

  // Do not render an editable input if the module is not editable
  return isEditing && isEditable ? renderEditing : renderDisplay;
};

DataRadio.propTypes = propTypes;

export { propTypes };
export default DataRadio;
