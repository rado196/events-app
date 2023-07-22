/* eslint-disable no-console */

const { Sequelize, Utils } = require('sequelize');
const dataTypes = require('./dataTypes');

const withCommonFields = function (fields, sequenceName = null) {
  const idField = dataTypes.identifier({ sequenceName });

  const createdAtField = dataTypes.dateTime({
    defaultValue: Sequelize.fn('now'),
    field: 'created_at',
  });

  const updatedAtField = dataTypes.dateTime({
    defaultValue: Sequelize.fn('now'),
    field: 'updated_at',
  });

  const deletedAtField = dataTypes.dateTime({
    field: 'deleted_at',
    allowNull: true,
  });

  for (const fieldName in fields) {
    fields[fieldName].allowNull = fields[fieldName].allowNull || false;
  }

  const mergedField = {
    id: idField,
    createdAt: createdAtField,
    updatedAt: updatedAtField,
    deletedAt: deletedAtField,
    ...fields,
  };

  return Object.keys(mergedField).reduce(function (acc, val) {
    acc[val] = {
      field: Utils.underscoredIf(val, true),
      ...mergedField[val],
    };

    return acc;
  }, {});
};

async function transactionable(query, migrationCallback) {
  const transaction = await query.sequelize.transaction({
    autocommit: false,
  });

  try {
    const migrationResult = await migrationCallback(transaction);
    await transaction.commit();

    return migrationResult;
  } catch (e) {
    console.error('>>> >>> FAILED TO RUN MIGRATION <<< <<<');
    console.error(e);

    await transaction.rollback();
    throw e;
  }
}

const buildTableInfo = function (modelClass, startingValue = 10_210) {
  const tableName = modelClass.tableName
    ? modelClass.tableName
    : Utils.pluralize(Utils.underscoredIf(modelClass.name, true));

  return {
    schema: modelClass.schemaName || process.env.DB_SCHEMA,
    tableName: tableName,
    starting: startingValue,
  };
};

const createSchema = async function (query, schemaName) {
  return transactionable(query, async function (transaction) {
    return query.createSchema(schemaName, { transaction });
  });
};

const dropSchema = async function (query, schemaName) {
  return transactionable(query, async function (transaction) {
    return query.dropSchema(schemaName, { transaction });
  });
};

const createTable = async function (query, tableInfo, fields, tableOptions) {
  return transactionable(query, async function (transaction) {
    const initialAutoIncrement = tableInfo.starting || 1;
    const schemeName = tableInfo.schema || 'public';
    const charset = tableInfo.charset || 'utf8mb4';
    const collate = tableInfo.collate || 'utf8mb4_general_ci';

    const dialect = query.sequelize.getDialect().toLowerCase();
    const isPostgreSQL = dialect === 'postgres';
    const sequenceName = `${tableInfo.tableName}_id_sequence`;

    const options = {
      schema: schemeName,
      charset,
      collate,

      initialAutoIncrement,
      ...tableOptions,
    };

    if (isPostgreSQL) {
      const sqlQuery = `
          CREATE SEQUENCE "${schemeName}"."${sequenceName}"
            INCREMENT 1
            START ${initialAutoIncrement};
        `;

      await query.sequelize.query(sqlQuery, { transaction });
    }

    const mappedFields = withCommonFields(
      fields,
      isPostgreSQL ? `${schemeName}.${sequenceName}` : null
    );

    await query.createTable(tableInfo.tableName, mappedFields, {
      ...options,
      transaction,
    });

    if (isPostgreSQL) {
      const sqlQuery = `
          ALTER SEQUENCE "${schemeName}"."${sequenceName}"
            OWNED BY "${schemeName}"."${tableInfo.tableName}"."id"
        `;

      await query.sequelize.query(sqlQuery, { transaction });
    }
  });
};

const dropTable = async function (query, tableInfo) {
  return transactionable(query, async function (transaction) {
    await query.dropTable(
      {
        tableName: tableInfo.tableName,
        schema: tableInfo.schema || 'public',
      },
      { transaction }
    );
  });
};

const addColumn = async function (query, tableInfo, fields) {
  return transactionable(query, async function (transaction) {
    const tableOptions = {
      tableName: tableInfo.tableName,
      schema: tableInfo.schema || 'public',
    };

    for (const field in fields) {
      const value = fields[field];
      value.allowNull = value.allowNull || false;

      await query.addColumn(
        tableOptions,
        Utils.underscoredIf(field, true),
        value,
        { transaction }
      );
    }
  });
};

const dropColumn = async function (query, tableInfo, fields) {
  return transactionable(query, async function (transaction) {
    const tableOptions = {
      tableName: tableInfo.tableName,
      schema: tableInfo.schema || 'public',
    };

    for (const field of fields) {
      await query.removeColumn(tableOptions, field, { transaction });
    }
  });
};

const addConstraint = async function (
  query,
  tableInfo,
  constraintName,
  options
) {
  return transactionable(query, async function (transaction) {
    const tableOptions = {
      tableName: tableInfo.tableName,
      schema: tableInfo.schema || 'public',
    };

    await query.addConstraint(tableOptions, {
      ...options,
      name: constraintName,
      transaction,
    });
  });
};

const addForeignKeyConstraint = async function (
  query,
  tableInfo,
  constraintName,
  options
) {
  return addConstraint(query, tableInfo, constraintName, {
    ...options,
    type: 'FOREIGN KEY',
  });
};

const dropConstraint = async function (query, tableInfo, constraintNames) {
  return transactionable(query, async function (transaction) {
    const tableOptions = {
      tableName: tableInfo.tableName,
      schema: tableInfo.schema || 'public',
    };

    if (!Array.isArray(constraintNames)) {
      constraintNames = [constraintNames];
    }

    for (const constraintName of constraintNames) {
      await query.removeColumn(tableOptions, constraintName, {
        transaction,
      });
    }
  });
};

module.exports.buildTableInfo = buildTableInfo;
module.exports.createSchema = createSchema;
module.exports.dropSchema = dropSchema;
module.exports.createTable = createTable;
module.exports.dropTable = dropTable;
module.exports.addColumn = addColumn;
module.exports.dropColumn = dropColumn;
module.exports.addConstraint = addConstraint;
module.exports.addForeignKeyConstraint = addForeignKeyConstraint;
module.exports.dropConstraint = dropConstraint;
