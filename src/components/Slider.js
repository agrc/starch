import * as React from 'react';
import config from '../config';
import propTypes from 'prop-types';

function getSliderValueFromSpeed(speed) {
  let returnValue;
  Object.keys(config.speedValues).some((key) => {
    if (config.speedValues[key].value === speed) {
      returnValue = key;
      return true;
    }

    return false;
  });

  return returnValue;
}

const Slider = function ({ label, value, dispatch, dispatchType }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const init = async () => {
      // reverse the styles to show active from right to left
      const style = document.createElement('style');
      style.innerHTML = `
          .track {
            background-color: var(--calcite-ui-brand) !important;
          }
          .track .track__range {
            background-color: var(--calcite-ui-border-2) !important;
          }
          .track .tick.tick--active {
            background-color: var(--calcite-ui-border-1) !important;
          }
          .track .tick {
            background-color: var(--calcite-ui-brand) !important;
          }
        `;
      ref.current.shadowRoot.appendChild(style);

      ref.current.addEventListener('calciteSliderChange', (event) => {
        dispatch({
          type: 'speed',
          meta: dispatchType,
          payload: config.speedValues[event.target.value].value,
        });
      });

      // wait until calcite loads all of the nodes
      const check = window.setInterval(() => {
        const labels = ref.current.shadowRoot.querySelectorAll('.tick__label');
        if (labels.length) {
          labels.forEach((label) => (label.innerHTML = config.speedValues[label.innerHTML].label));
          window.clearInterval(check);
        }
      }, 100);
    };

    // not sure why but calcite slide is not fully loaded at this point...
    customElements.whenDefined('calcite-slider').then(init);
  }, [dispatch, dispatchType]);

  return (
    <calcite-label>
      Minimum {label} Speed
      <calcite-slider
        ref={ref}
        min="0"
        min-label="speed, lower bound"
        max="8"
        max-label="speed, upper bound"
        step="1"
        ticks="1"
        snap=""
        id="upload-slider"
        theme="switch-slider"
        value={getSliderValueFromSpeed(value)}
        label-ticks=""
      />
    </calcite-label>
  );
};
Slider.propTypes = {
  label: propTypes.string.isRequired,
  value: propTypes.number,
  dispatch: propTypes.func.isRequired,
  dispatchType: propTypes.string.isRequired,
};

export default Slider;
