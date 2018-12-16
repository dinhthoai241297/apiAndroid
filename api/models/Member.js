/**
 * Member.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        project: {
            model: 'project'
        },
        user: {
            model: 'user'
        },
        role: {
            type: 'number'
        },
        status: {
            type: 'number'
        }
    },

};

