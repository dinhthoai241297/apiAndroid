/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

    /***************************************************************************
    *                                                                          *
    * Any other custom config this Sails app should use during development.    *
    *                                                                          *
    ***************************************************************************/
    // mailgunDomain: 'transactional-mail.example.com',
    // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
    // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
    // …

    secretKey: 'pdt24211997',

    projectStatus: {
        ALL: 0,
        WORKON: 1,
        PAUSE: 2,
        END: 3
    },

    memberStatus: {
        ALL: 0,
        ONLINE: 1,
        OFFLINE: 2,
        INVITE: 3,
        WAIT: 4
    },

    memberRole: {
        ALL: 0,
        EMP: 1
    },

    taskStatus: {
        ALL: 0,
        WAITING: 1,
        DOING: 2,
        STOPED: 3
    }

};
