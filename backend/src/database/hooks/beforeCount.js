function beforeCount(options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true;
    options.col =
      this._scope.col || options.col || `"${this.options.name.singular}".id`;
  }

  if (
    options.include &&
    Array.isArray(options.include) &&
    options.include.length > 0
  ) {
    delete options.include;
  }
}

module.exports = beforeCount;
