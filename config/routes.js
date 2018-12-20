/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    '/': {
        view: 'pages/homepage'
    },

    'POST /user/login': 'user.login',
    'POST /user/logintoken': 'user.loginToken',
    'POST /user/register': 'user.add',
    'POST /user/update': 'user.update',
    'POST /user/logout': 'user.logout',
    'POST /user/updatepassword': 'user.updatePassword',
    'POST /user/getlist': 'user.getList',

    'POST /project/add': 'project.add',
    'POST /project/getlist': 'project.getList',
    'POST /project/getone': 'project.getOne',
    'POST /project/update': 'project.update',

    'POST /member/invite': 'member.inviteMember',
    'POST /member/getlistinvite': 'member.getListInvite',
    'POST /member/accessinvite': 'member.accessInvite',
    'POST /member/denyinvite': 'member.denyInvite',

    'POST /task/add': 'task.add',
    'POST /task/getlist': 'task.getList',
    'POST /task/report': 'task.report',

    'POST /notification/getlist': 'notification.getList',
};
