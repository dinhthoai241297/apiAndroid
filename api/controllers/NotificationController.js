/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const notiType = sails.config.custom.notificationType;
const notiStatus = sails.config.custom.notificationStatus;

// 103 lỗi try catch
//

module.exports = {

    getList: async (req, res) => {
        res.status(200);
        let code = 500; message = 'error', data = undefined;
        try {
            let { page, user } = req.body.data;
            if (!page || page < 0) {
                page = 1;
            }
            let list = await Notification.find({ user }).sort([{ status: 'DESC' }, { createdAt: 'DESC' }]).skip((page - 1) * 10).limit(11);
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
            if (data && data.list) {
                let listID = data.list.map(noti => noti.id);
                await Notification.update({ id: { in: listID } }).set({ status: notiStatus.READED });
            }
        } catch (error) {
            code = 103;
            message = 'error';
            console.log(error);
        }

        return res.json({ code, message, data });
    },

};

