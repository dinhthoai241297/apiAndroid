/**
 * MemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const ROLE_MEMBER = sails.config.custom.memberRole;
const STATUS_MEMBER = sails.config.custom.memberStatus;

// 101 thiếu tham số
// 102 lỗi try catch
// 103 có lỗi trong quá trình lưu xuống db

module.exports = {

    inviteMember: async (req, res) => {
        res.status(200);
        let code, message = 'error', data;

        try {
            let { project, user } = req.body.data;
            if (project && user) {
                let member = await Member.create({ project, user, role: ROLE_MEMBER.EMP, status: STATUS_MEMBER.INVITE }).fetch();
                if (member) {
                    code = 200;
                    message = 'success';
                    data = { member };
                } else {
                    code = 103;
                }
            } else {
                code = 101;
            }
        } catch (error) {
            code = 102;
            console.log(error);
        }

        return res.json({ code, message, data });
    },

    getListInvite: async (req, res) => {
        res.status(200);
        let code, message = 'error', data;

        try {
            let { page, user } = req.body.data;
            if (!page || page < 0) {
                page = 1;
            }
            if (user) {
                let list = await Member.find({ user, status: STATUS_MEMBER.INVITE }).skip((page - 1) * 10).limit(11).populate('project');
                code = 200;
                message = 'success';
                if (list.length > 10) {
                    data = {
                        list: list.slice(0, 10),
                        next: true,
                    }
                } else {
                    data = {
                        list,
                        next: false
                    }
                }
            } else {
                code = 101;
            }
        } catch (error) {
            code = 102;
            console.log(error);
        }
        return res.json({ code, message, data });
    },

    accessInvite: async (req, res) => {
        res.status(200);
        let code, message = 'error', data;
        try {
            let { id } = req.body.data;
            let m = await Member.updateOne({ id }).set({ status: STATUS_MEMBER.ONLINE });
            if (m) {
                code = 200;
                message = 'success';
            } else {
                code = 103;
            }
        } catch (error) {
            code = 102;
            console.log(error);
        }
        return res.json({ code, message, data });
    },


    denyInvite: async (req, res) => {
        res.status(200);
        let code, message = 'error', data;
        try {
            let { id } = req.body.data;
            let m = await Member.destroyOne({ id });
            if (m) {
                code = 200;
                message = 'success';
            } else {
                code = 103;
            }
        } catch (error) {
            code = 102;
            console.log(error);
        }
        return res.json({ code, message, data });
    },
};

