/**
 * Task.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        owner: {
            model: 'user'
        },
        emp: {
            model: 'user'
        },
        project: {
            model: 'project'
        },
        startTime: {
            type: 'ref',
            columnType: 'datetime'
        },
        deadLine: {
            type: 'ref',
            columnType: 'datetime'
        },
        endTime: {
            type: 'ref',
            columnType: 'datetime'
        },
        status: {
            type: 'number'
        },
        report: {
            type: 'string'
        }
    },

};

