import React, { useCallback, useEffect, useState } from 'react';
import {
  Center,
  FormControl,
  FormLabel,
  Select,
  Spinner,
} from '@chakra-ui/react';
import api from '~api';
import useToaster from '~hooks/useToaster';

function RegionalFilter({ region, onUpdate }) {
  const toaster = useToaster();
  const [loading, setLoading] = useState(true);

  const [regions, setRegions] = useState([]);
  const loadRegions = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get('/regions');
      setRegions(response.data.regions);
    } catch (e) {
      toaster.error(e.message);
    }

    setLoading(false);
  }, []);

  const onChange = useCallback(
    (e) => {
      onUpdate(e.target.value);
    },
    [onUpdate]
  );

  useEffect(() => {
    loadRegions();
  }, []);

  return (
    <Center width="100%" height="100%" padding={4}>
      {loading ? (
        <Spinner />
      ) : (
        <FormControl>
          <FormLabel>Region</FormLabel>
          <Select width="100%" value={region} onChange={onChange}>
            <option value={null} />
            {regions.map((region) => (
              <option key={`region/${region.id}`} value={region.id}>
                {region.region}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
    </Center>
  );
}

export default RegionalFilter;
