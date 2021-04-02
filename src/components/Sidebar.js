import * as React from 'react';
import './Sidebar.scss';
import { FormGroup, Label, CustomInput, Button } from 'reactstrap';
import propTypes from 'prop-types';

const Sidebar = ({ filter, dispatchFilter }) => {
  function onTransTechClick(event) {
    dispatchFilter({
      type: 'transType',
      meta: event.target.value,
      payload: event.target.checked,
    });
  }

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
            checked={filter.transType.wireline}
            onChange={onTransTechClick}
            value="wireline"
          />
          <CustomInput
            id="fixedCheckbox"
            type="checkbox"
            label="Fixed Wireless"
            checked={filter.transType.fixed}
            onChange={onTransTechClick}
            value="fixed"
          />
          <CustomInput
            id="mobileCheckbox"
            type="checkbox"
            label="Mobile Wireless"
            checked={filter.transType.mobile}
            onChange={onTransTechClick}
            value="mobile"
          />
        </div>
      </FormGroup>
      <Button className="w-100" onClick={() => dispatchFilter({ type: 'reset' })}>
        reset filter
      </Button>
    </div>
  );
};
Sidebar.propTypes = {
  filter: propTypes.object.isRequired,
  dispatchFilter: propTypes.func.isRequired,
};

export default Sidebar;
