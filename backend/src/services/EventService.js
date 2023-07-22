const path = require('node:path');
const fs = require('node:fs');

const XmlService = require('./XmlService');
const { BaseModel } = require('../core/model');

const { Event } = require('../models/Event');
const { Region } = require('../models/Region');
const { Category } = require('../models/Category');
const { Tag } = require('../models/Tag');
const { Venue } = require('../models/Venue');
const { LinkEventTag } = require('../models/LinkEventTag');

const eventDefaultRelations = [
  { model: Category, as: 'category' },
  { model: Venue, as: 'venue' },
  { model: Region, as: 'region' },
  {
    model: Tag,
    as: 'tags',
    through: {
      attributes: [],
    },
  },
];

/**
 * @param {string} filename
 * @returns {string}
 * @throws {Error}
 */
function parseFile(filename) {
  const filepath = path.join(__dirname, '..', '..', 'data', filename);
  if (!fs.existsSync(filepath)) {
    throw new Error(`File does not exists: ${filepath}`);
  }

  const xmlContent = fs.readFileSync(filepath);
  return XmlService.toObject(xmlContent);
}

/**
 * @param {IParsedEventFrom} parsedEvent
 * @param {import('sequelize').Transaction?} parsedEvent
 * @returns {Promise<void>}
 */
async function insertParsedEvent(parsedEvent, transaction) {
  // create/fetch venue
  let venue = await Venue.findOne({
    where: { itemId: parsedEvent.venue_id },
    transaction: transaction,
  });
  if (!venue) {
    venue = await Venue.create(
      {
        itemId: parsedEvent.venue_id,
        venue: parsedEvent.venue,
        address: parsedEvent.venue_address,
        alias: parsedEvent.venue_alias,
      },
      { transaction: transaction }
    );
  }

  // create/fetch region
  let region = await Region.findOne({
    where: { region: parsedEvent.region },
    transaction: transaction,
  });
  if (!region) {
    region = await Region.create(
      {
        region: parsedEvent.region,
      },
      { transaction: transaction }
    );
  }

  // create/fetch category
  let category = null;
  if (parsedEvent.category) {
    category = await Category.findOne({
      where: { category: parsedEvent.category },
      transaction: transaction,
    });
    if (!category) {
      category = await Category.create(
        {
          category: parsedEvent.category,
        },
        { transaction: transaction }
      );
    }
  }

  const coordinates = parsedEvent.google_address.split(' ');

  // create event
  const event = await Event.create(
    {
      venueId: venue.getDataValue('id'),
      categoryId: category?.getDataValue('id'),
      regionId: region.getDataValue('id'),

      itemId: parsedEvent.id,
      url: parsedEvent.url,
      imageUrl: parsedEvent.image || null,
      title: parsedEvent.title,
      description: parsedEvent.description || null,
      date: parsedEvent.date,
      dateType: parsedEvent.date_type,
      age: parsedEvent.age,
      minPrice: parsedEvent.min_price || null,
      maxPrice: parsedEvent.max_price || null,
      latitude: coordinates?.[0] || null,
      longitude: coordinates?.[1] || null,
    },
    { transaction: transaction }
  );

  // create/fetch tags & assign to event
  const tagsSplitted = parsedEvent.web_tag_groups?.split(', ') || [];
  for (const tagItem of tagsSplitted) {
    let tag = await Tag.findOne({
      where: { tag: tagItem },
      transaction: transaction,
    });
    if (!tag) {
      tag = await Tag.create(
        {
          tag: tagItem,
        },
        { transaction: transaction }
      );
    }

    await LinkEventTag.create(
      {
        eventId: event.getDataValue('id'),
        tagId: tag.getDataValue('id'),
      },
      { transaction: transaction }
    );
  }
}

/**
 * @param {Array<IParsedEventFrom>} parsedEvents
 * @param {import('sequelize').Transaction?} parsedEvent
 * @returns {Promise<void>}
 */
async function insertParsedEvents(parsedEvents, transaction) {
  let isCustomTransaction = false;
  if (!transaction) {
    transaction = await BaseModel.buildTransaction();
    isCustomTransaction = true;
  }

  try {
    for (const parsedEvent of parsedEvents) {
      await insertParsedEvent(parsedEvent, transaction);
    }

    if (isCustomTransaction) {
      await transaction.commit();
    }
  } catch (e) {
    if (isCustomTransaction) {
      await transaction.rollback();
    }

    throw e;
  }
}

/**
 * @returns {Promise<void>}
 */
async function getPricingRange() {
  const result = await Event.findOne({
    attributes: [
      [Event.fn('MIN', Event.col('minPrice')), 'min'],
      [Event.fn('MAX', Event.col('maxPrice')), 'max'],
    ],
    hooks: false,
  });

  return {
    min: result.getDataValue('min'),
    max: result.getDataValue('max'),
  };
}

/**
 * @returns {Promise<{ count: number, events: Array<Event> }>}
 */
async function getAll(
  { search, minPrice, maxPrice, regionId, categoryId, venueId } = {},
  { limit, offset } = {}
) {
  const condition = Event.buildSearchableCondition(search, [
    'title',
    'description',
  ]);

  if (typeof minPrice !== 'undefined') {
    condition.minPrice = { [Event.Op.gte]: minPrice };
  }
  if (typeof maxPrice !== 'undefined') {
    condition.maxPrice = { [Event.Op.lte]: maxPrice };
  }
  if (typeof regionId !== 'undefined') {
    condition.regionId = regionId;
  }
  if (typeof categoryId !== 'undefined') {
    condition.categoryId = categoryId;
  }
  if (typeof venueId !== 'undefined') {
    condition.venueId = venueId;
  }

  const { rows: events, count } = await Event.findAndCountAll({
    include: eventDefaultRelations,
    where: condition,
    limit: limit,
    offset: offset,
  });

  return { events, count };
}

/**
 * @returns {Promise<{ event: Event }>}
 */
async function getById(id) {
  const event = await Event.findByPk(id, {
    include: eventDefaultRelations,
  });

  return { event };
}

module.exports.parseFile = parseFile;
module.exports.insertParsedEvent = insertParsedEvent;
module.exports.insertParsedEvents = insertParsedEvents;
module.exports.getPricingRange = getPricingRange;
module.exports.getAll = getAll;
module.exports.getById = getById;
