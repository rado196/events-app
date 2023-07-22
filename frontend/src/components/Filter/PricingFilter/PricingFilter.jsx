import React, { useCallback, useEffect, useState } from 'react';
import {
  Center,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Spinner,
} from '@chakra-ui/react';
import api from '~api';
import useToaster from '~hooks/useToaster';

function PricingFilter({ minPrice, maxPrice, onUpdate }) {
  const toaster = useToaster();
  const [loading, setLoading] = useState(true);

  const [existingMinPrice, setExistingMinPrice] = useState(-Infinity);
  const [existingMaxPrice, setExistingMaxPrice] = useState(+Infinity);

  const loadPricing = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get('/events/pricing');
      setExistingMinPrice(response.data.minPrice);
      setExistingMaxPrice(response.data.maxPrice);

      onUpdate({
        minPrice: response.data.minPrice,
        maxPrice: response.data.maxPrice,
      });
    } catch (e) {
      toaster.error(e.message);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadPricing();
  }, []);

  const onMinChange = useCallback(
    (e) => {
      onUpdate({
        minPrice: e.target.value,
        maxPrice: maxPrice,
      });
    },
    [onUpdate, maxPrice]
  );

  const onMaxChange = useCallback(
    (e) => {
      onUpdate({
        minPrice: minPrice,
        maxPrice: e.target.value,
      });
    },
    [onUpdate, minPrice]
  );

  return (
    <Center width="100%" height="100%" padding={4}>
      {loading ? (
        <Spinner />
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Min Price</FormLabel>
              <Input
                type="number"
                value={minPrice}
                min={existingMinPrice}
                max={existingMaxPrice}
                onChange={onMinChange}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Max Price</FormLabel>
              <Input
                type="number"
                value={maxPrice}
                min={existingMinPrice}
                max={existingMaxPrice}
                onChange={onMaxChange}
              />
            </FormControl>
          </GridItem>
        </Grid>
      )}
    </Center>
  );
}

export default PricingFilter;
