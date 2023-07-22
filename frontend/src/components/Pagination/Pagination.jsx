import React from 'react';
import { ButtonGroup, Button, Box, Text } from '@chakra-ui/react';
import usePagination from '~hooks/usePagination';

const dots = '…'; //'U+2026';

function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit);
  const pagination = usePagination(totalPages, page, 2, dots);

  if (pagination.length < 2) {
    return null;
  }

  const from = (page - 1) * limit + 1;
  const to = page * limit;

  return (
    <Box>
      <Box marginY={8}>
        <ButtonGroup>
          {pagination.map((pageItem) => (
            <Button
              key={`page/${pageItem}`}
              onClick={() => onChange(pageItem)}
              isDisabled={pageItem === dots}
            >
              {pageItem}
            </Button>
          ))}
        </ButtonGroup>

        <Text marginTop={4} textAlign="center" opacity={0.85} fontSize="12px">
          Displaying {from}-{to > total ? total : to} from {total} items.
        </Text>
      </Box>
    </Box>
  );
}

export default Pagination;
