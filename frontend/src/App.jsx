import React, { useCallback, useEffect, useState } from 'react';
import { Box, Divider, VStack } from '@chakra-ui/react';
import useDebounced from '~hooks/useDebounced';
import useToaster from '~hooks/useToaster';
import api, { mergeFilterAndPagination } from '~api';
import Filter from '~components/Filter';
import Pagination from '~components/Pagination';
import Events from '~components/Events';

const itemsPerPage = 30;

function App() {
  const toaster = useToaster();

  const [filterCriteria, setFilterCriteria] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    offset: 0,
    page: 1,
  });

  const onPageChange = useCallback((page) => {
    setPagination((old) => ({
      ...old,
      offset: itemsPerPage * (page - 1),
      page: page,
    }));
  }, []);

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const loadEventsCancelable = useDebounced(
    async function (abortSignal) {
      setLoading(true);
      try {
        const response = await api.get('/events', {
          params: mergeFilterAndPagination(filterCriteria, {
            limit: itemsPerPage,
            offset: pagination.offset,
          }),
          signal: abortSignal,
        });

        setEvents(response.data.events);
        setPagination((old) => ({
          ...old,
          total: response.data.count,
        }));
      } catch (e) {
        toaster.error(e.message);
      }

      setLoading(false);
    },
    [filterCriteria, pagination.offset]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadEventsCancelable(controller.signal);

    return () => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };
  }, [filterCriteria, pagination.offset]);

  return (
    <VStack>
      <Box maxWidth="992px" width="100%" marginX="auto">
        <Filter
          region={filterCriteria.region}
          minPrice={filterCriteria.minPrice}
          maxPrice={filterCriteria.maxPrice}
          onUpdate={setFilterCriteria}
        />
      </Box>

      <Divider marginY="40px !important" />

      <Box maxWidth="992px" width="100%" marginX="auto">
        <VStack>
          <Events loading={loading} events={events} />

          <Pagination
            limit={itemsPerPage}
            total={pagination.total}
            page={pagination.page}
            onChange={onPageChange}
          />
        </VStack>
      </Box>
    </VStack>
  );
}

export default App;
