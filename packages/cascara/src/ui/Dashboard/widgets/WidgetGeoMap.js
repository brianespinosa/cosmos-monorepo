import React from 'react';
import pt from 'prop-types';
import { ResponsiveChoroplethCanvas } from '@nivo/geo';
import Widget, { propTypes as widgetPT } from './Widget';
import { CHART_DEFAULTS } from './widgetConfig';
import GeoMapFeatures from './GeoMapFeatures';

const propTypes = {
  ...widgetPT,
  /** Data to display in a widget */
  data: pt.oneOfType([pt.array, pt.object]).isRequired,
};

/**
 * Widget for @nivo/geo (Chloropleth).
 */
const WidgetGeoMap = ({ data, ...rest }) => {
  const largestValue = Math.max(...data.map((object) => object.value));

  const CHART_CONFIG = {
    ...CHART_DEFAULTS,
    borderWidth: 0,
    domain: [0, largestValue],
    enableGraticule: true,
    graticuleLineColor: 'rgba(0,0,0,.125)',
    label: 'properties.name',
    projectionScale: 88,
    projectionTranslation: [0.5, 0.65],
    unknownColor: 'rgba(0,0,0,.05)',
  };

  return (
    <Widget {...rest} height={320}>
      <ResponsiveChoroplethCanvas
        {...CHART_CONFIG}
        data={data}
        features={GeoMapFeatures.features}
      />
    </Widget>
  );
};

WidgetGeoMap.propTypes = propTypes;
WidgetGeoMap.displayName = 'geo-map';

export { propTypes };

export default WidgetGeoMap;
