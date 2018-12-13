/**
 * Project.js
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
        endTime: {
            type: 'ref',
            columnType: 'datetime'
        },
        status: {
            type: 'number'
        }

    },

};

