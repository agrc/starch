import * as React from 'react';
import './Sidebar.scss';
import { FormGroup, Label, CustomInput, Button } from 'reactstrap';
import propTypes from 'prop-types';
import Slider from './Slider';

const Sidebar = ({ filter, dispatchFilter }) => {
  function onTransTechChange(event) {
    dispatchFilter({
      type: 'transType',
      meta: event.target.value,
      payload: event.target.checked,
    });
  }

  const wirelineChecked = filter.transType.cable && filter.transType.dsl && filter.transType.fiber;
  const wirelineCheckbox = React.useRef(null);
  React.useEffect(() => {
    const indeterminate =
      !wirelineChecked && (filter.transType.cable || filter.transType.dsl || filter.transType.fiber);

    if (wirelineCheckbox.current) {
      wirelineCheckbox.current.indeterminate = indeterminate;
    }
  }, [filter.transType.cable, filter.transType.dsl, filter.transType.fiber, wirelineChecked]);

  return (
    <div className="sidebar">
      <h2>Utah Residential Broadband</h2>
      <FormGroup>
        <Label>Technology Type</Label>
        <div>
          <CustomInput
            id="wirelineCheckbox"
            type="checkbox"
            label="Wireline"
            checked={wirelineChecked}
            innerRef={wirelineCheckbox}
            onChange={onTransTechChange}
            value="wireline"
          />
          <div className="ml-4">
            <CustomInput
              id="cableCheckbox"
              type="checkbox"
              label="Cable"
              checked={filter.transType.cable}
              onChange={onTransTechChange}
              value="cable"
            />
            <CustomInput
              id="dslCheckbox"
              type="checkbox"
              label="DSL"
              checked={filter.transType.dsl}
              onChange={onTransTechChange}
              value="dsl"
            />
            <CustomInput
              id="fiberCheckbox"
              type="checkbox"
              label="Fiber"
              checked={filter.transType.fiber}
              onChange={onTransTechChange}
              value="fiber"
            />
          </div>
          <CustomInput
            id="fixedCheckbox"
            type="checkbox"
            label="Fixed Wireless"
            checked={filter.transType.fixed}
            onChange={onTransTechChange}
            value="fixed"
          />
          <CustomInput
            id="mobileCheckbox"
            type="checkbox"
            label="Mobile Wireless"
            checked={filter.transType.mobile}
            onChange={onTransTechChange}
            value="mobile"
          />
        </div>
      </FormGroup>

      <Slider label="Upload" value={filter.speed.up} dispatch={dispatchFilter} dispatchType="up" />
      <Slider label="Download" value={filter.speed.down} dispatch={dispatchFilter} dispatchType="down" />

      <Button className="w-100" onClick={() => dispatchFilter({ type: 'reset' })}>
        Reset Filter
      </Button>
    </div>
  );
};
Sidebar.propTypes = {
  filter: propTypes.object.isRequired,
  dispatchFilter: propTypes.func.isRequired,
};

export default Sidebar;
