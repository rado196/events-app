import React, { useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import RegionalFilter from './RegionalFilter';
import PricingFilter from './PricingFilter';

function Filter({ onUpdate, ...props }) {
  const updateFilterCriteria = useCallback(
    function (newCriteria) {
      const updatedCriteria = Object.keys(newCriteria).reduce(function (
        acc,
        key
      ) {
        if (
          typeof newCriteria[key] !== 'undefined' &&
          newCriteria[key] !== '' &&
          newCriteria[key] !== null
        ) {
          acc[key] = newCriteria[key];
        }

        return acc;
      },
      {});

      onUpdate(updatedCriteria);
    },
    [onUpdate]
  );

  const onRegionUpdate = (newRegion) => {
    updateFilterCriteria({
      ...props,
      region: newRegion,
    });
  };

  const onPriceRangeUpdate = ({
    minPrice: newMinPrice,
    maxPrice: newMaxPrice,
  }) => {
    updateFilterCriteria({
      ...props,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
    });
  };

  return (
    <Flex gap={4}>
      <RegionalFilter region={props.region} onUpdate={onRegionUpdate} />

      <PricingFilter
        minPrice={props.minPrice}
        maxPrice={props.maxPrice}
        onUpdate={onPriceRangeUpdate}
      />
    </Flex>
  );
}

export default Filter;
