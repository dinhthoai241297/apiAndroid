/**
 * Notification.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        user: {
            model: 'user'
        },
        notification: {
            type: 'string'
        },
        notiType: {
            type: 'number'
        },
        status: {
            type: 'number'
        }

    },

};

