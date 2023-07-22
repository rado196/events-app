import React from 'react';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import EventCard from './EventCard';

function Events({ loading, events }) {
  if (loading) {
    return (
      <Center minHeight={80}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (events.length === 0) {
    return (
      <Center minHeight={80} flexDirection="column">
        <Text fontSize="14px" fontWeight="bold">
          No events found by provided filtering criteria.
        </Text>

        <Text fontSize="82px">😞</Text>
      </Center>
    );
  }

  return (
    <VStack spacing={8} width="100%" marginY={8}>
      {events.map((event) => (
        <EventCard key={`event/${event.id}`} event={event} />
      ))}
    </VStack>
  );
}

export default Events;
