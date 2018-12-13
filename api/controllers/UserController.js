/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const md5 = require('md5');

// 101 session không tìm thấy
// 102 username đã tồn tại
// 103 username hoặc password không đúng
// 104 mật khẩu cũ không đúng

module.exports = {

    add: async (req, res) => {
        res.status(200);
        let code = 500; message = 'error', data = undefined;
        try {
            let { user } = req.body.data;
            let { username } = user;
            let u1 = await User.findOne({ username });
            if (u1) {
                code = 102;
                message = 'Tên đăng nhập này đã có người sử dụng!';
            } else {
                // md5 just for product
                // user.password = md5(user.password);
                let u = await User.create(user).fetch();
                if (u) {
                    data = { user: u };
                    code = 200;
                    message = 'success';
                }
            }
        } catch (error) {
            console.log(error);
        }
        return res.json({ code, message, data });
    },

    update: async (req, res) => {
        res.status(200);
        let code = 500; message = 'error', data = undefined;

        try {
            let { user, token } = req.body.data;
            let se = await Session.findOne({ token });
            if (se) {
                let u = await User.updateOne({ id: se.userid }).set({ fullName: user.fullName });
                if (u) {
                    data = { user: u };
                    code = 200;
                    message = 'success';
                }
            }
        } catch (error) {
            console.log(error);
        }
        return res.json({ code, message, data });
    },

    login: async (req, res) => {
        res.status(200);

        let secretKey = sails.config.custom.secretKey;

        let code = 500, message = 'error', data = undefined;

        try {
            let { username, password } = req.body.data;
            let u = await User.findOne({ username, password });
            if (u) {
                let token = jwt.sign({ user: { username, password }, date: new Date() }, secretKey);
                await Session.create({ userid: u.id, token });
                code = 200;
                message = 'success';
                data = { token, user: u };
            } else {
                code = 103;
                message = 'Tài khoản hoặc mật khẩu không đúng!';
            }
        } catch (error) {
            console.log(error);
        }
        return res.json({ code, message, data });
    },

    loginToken: async (req, res) => {
        res.status(200);

        let secretKey, code, message, data;
        secretKey = sails.config.custom.secretKey;
        code = 500;
        message = 'error';
        data = undefined;

        let { token } = req.body.data;

        try {
            let se = await Session.findOne({ token });
            if (se) {
                jwt.verify(token, secretKey, async (error, result) => {
                    if (!error) {
                        let user, { username, password } = result.user;
                        user = await User.findOne({ username, password });
                        if (user) {
                            code = 200;
                            message = 'success';
                            data = { user };
                        }
                    }
                    return res.json({ code, message, data });
                });
            } else {
                code = 101;
                message = 'không tìm thấy session';
                return res.json({ code, message, data });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code, message, data });
        }
    },

    logout: async (req, res) => {
        res.status(200);
        let code, message, data;
        code = 500;
        message = 'error';
        data = undefined;

        let { token } = req.body.data;
        try {
            await Session.destroy({ token });
            code = 200;
            message = 'success';
        } catch (error) {
            console.log(error);
        }
        return res.json({ code, message, data });
    },

    updatePassword: async (req, res) => {
        res.status(200);
        let code = 500; message = 'error', data = undefined;
        let secretKey = sails.config.custom.secretKey;

        try {
            let { passwordOld, passwordNew, token } = req.body.data;
            let se = await Session.findOne({ token });
            if (se) {
                let u = await User.updateOne({ id: se.userid, password: passwordOld }).set({ password: passwordNew });
                if (u) {
                    let tokenNew = jwt.sign({ user: { username: u.username, password: u.password }, date: new Date() }, secretKey);
                    await Session.destroyOne({ token });
                    await Session.create({ userid: u.id, token: tokenNew });
                    data = { user: u, token: tokenNew };
                    code = 200;
                    message = 'success';
                } else {
                    code = 104;
                    message = 'Mật khẩu cũ không đúng!';
                }
            }
        } catch (error) {
            console.log(error);
        }
        return res.json({ code, message, data });
    },
};

