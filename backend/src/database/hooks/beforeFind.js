function beforeFind(options) {
  options = options || {};
  options.order = options.order || [];

  if (!Array.isArray(options.order)) {
    options.order = [options.order];
  }

  // check if order by id already exists.
  const idFilter = options.order.find(function (orderItem) {
    // skip literal queries
    if (!Array.isArray(orderItem)) {
      return false;
    }

    // nested filter: [relation, field, orderType]
    if (orderItem.length === 3) {
      return orderItem[1] === 'id';
    }

    // direct filter: [field, orderType]
    return orderItem[0] === 'id';
  });

  if (!idFilter) {
    options.order.push(['id', 'DESC']);
  }
}

module.exports = beforeFind;
