import React from 'react';
import {
  Badge,
  Box,
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import useFormat from '~hooks/useFormat';
import Map, { Marker } from '~components/Map';
import {
  getImageUrl,
  buildMapUrl,
  imgNoImage,
  currency,
  shadow,
} from './helpers';

function EventCard({ event }) {
  const format = useFormat();

  return (
    <Box
      width="100%"
      padding={4}
      boxShadow=" 0px 2px 7px 0px rgba(0,0,0,0.15)"
      borderRadius="10px"
    >
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        <GridItem>
          <VStack spacing={4}>
            <Image
              draggable={false}
              borderRadius="10px"
              height={40}
              width="100%"
              objectFit="cover"
              src={getImageUrl(event.imageUrl)}
              fallbackSrc={imgNoImage}
              boxShadow={shadow}
            />

            {event.latitude && event.longitude && (
              <Box
                as="a"
                target="_blank"
                href={buildMapUrl(event.latitude, event.longitude)}
                borderRadius="10px"
                height={40}
                width="100%"
                boxShadow={shadow}
                overflow="hidden"
                position="relative"
                css={{
                  '.gm-style': {
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box position="relative" height="185px">
                  <Map
                    center={{
                      lat: event.latitude,
                      lng: event.longitude,
                    }}
                    zoom={15}
                    options={{
                      controlSize: false,
                      draggable: false,
                      gestureHandling: 'none',
                      mapTypeControl: false,
                      panControl: false,
                      rotateControl: false,
                      scaleControl: false,
                      streetViewControl: false,
                      zoomControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    <Marker
                      draggable={false}
                      position={{ lat: event.latitude, lng: event.longitude }}
                    />
                  </Map>
                </Box>
              </Box>
            )}
          </VStack>
        </GridItem>

        <GridItem colSpan={3}>
          <HStack justifyContent="space-between" marginBottom={2}>
            <VStack alignItems="flex-start">
              <Text
                as={'a'}
                fontSize="20px"
                fontWeight="bold"
                target="_blank"
                href={event.url}
              >
                {event.title}
              </Text>

              <HStack>
                {event.category && (
                  <Badge variant="solid" colorScheme="purple" marginRight={2}>
                    {event.category.category}
                  </Badge>
                )}
                {event.region && (
                  <Badge variant="solid" colorScheme="cyan" marginRight={2}>
                    {event.region.region}
                  </Badge>
                )}
                {event.venue && (
                  <Badge variant="solid" colorScheme="cyan" marginRight={2}>
                    {event.venue.venue}
                  </Badge>
                )}
              </HStack>
            </VStack>

            <VStack alignItems="flex-end">
              <Badge colorScheme="green" fontSize="16px" display="inline-flex">
                <Text>
                  {currency} {format.number(event.minPrice, 0)}
                </Text>
                <Text marginX={2}>-</Text>
                <Text>
                  {currency} {format.number(event.maxPrice, 0)}
                </Text>
              </Badge>

              <HStack>
                {event.date && (
                  <Tooltip label={format.date(event.date)}>
                    <Badge colorScheme="blue">
                      {format.dateHumanize(event.date)}
                    </Badge>
                  </Tooltip>
                )}

                <Badge colorScheme="blue">{event.age}+</Badge>
              </HStack>
            </VStack>
          </HStack>

          <Text
            minHeight="20px"
            fontSize="14px"
            dangerouslySetInnerHTML={{ __html: event.description || '' }}
            css={{
              '& > ul': {
                marginLeft: '15px',
              },
            }}
          />

          {event.tags?.length > 0 && (
            <HStack spacing={1} marginTop={4}>
              {event.tags.map((tag) => (
                <Badge key={`tag/${tag.id}`} variant="solid" colorScheme="gray">
                  {tag.tag}
                </Badge>
              ))}
            </HStack>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
}

export default EventCard;
