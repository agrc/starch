import * as React from 'react';
import propTypes from 'prop-types';
import { Sherlock, LocatorSuggestProvider } from '@agrc/sherlock';
import config from '../config';
import Graphic from '@arcgis/core/Graphic';
import Extent from '@arcgis/core/geometry/Extent';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import './AOIModal.scss';

const AOIModal = ({ setExtent }) => {
  const onMatch = (graphics) => {
    setExtent(new Extent(graphics[0].attributes.extent));
  };

  return (
    <div>
      <Modal isOpen={true} className="aoi-modal">
        <ModalHeader>What is your area of interest?</ModalHeader>
        <ModalBody>
          <p>Search for things like counties, cities, addresses, place names, etc...</p>
          <Sherlock
            provider={new LocatorSuggestProvider(config.urls.masquerade, 3857)}
            modules={{ Graphic }}
            onSherlockMatch={onMatch}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

AOIModal.propTypes = {
  setExtent: propTypes.func.isRequired,
};

export default AOIModal;
