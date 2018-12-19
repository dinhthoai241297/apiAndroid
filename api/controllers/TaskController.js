/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// 101 Có lỗi trong quá trình lưu vào db
// 102 Thiếu tham số
// 103 lỗi try catch


const TASK_STATUS = sails.config.custom.taskStatus;

module.exports = {

    add: async (req, res) => {
        res.status(200);
        let code = 500; message = 'error', data = undefined;
        try {
            let { task } = req.body.data, today = new Date();
            task.startTime = new Date(task.startTime);
            task.deadLine = new Date(task.deadLine);
            task.status = today.getTime() >= task.startTime.getTime() ? TASK_STATUS.DOING : TASK_STATUS.WAITING;
            if (task) {
                let t = await Task.create(task).fetch();
                if (t) {
                    data = { task: t };
                    code = 200;
                    message = 'success';
                } else {
                    code = 101;
                }
            } else {
                code = 102;
            }
        } catch (error) {
            console.log(error);
            code = 103;
        }
        return res.json({ code, message, data });
    },

    getList: async (req, res) => {
        res.status(200);
        let code = 500; message = 'error', data = undefined;
        try {
            let { page, project, emp, key = '' } = req.body.data;
            if (!page || page < 0) {
                page = 1;
            }
            let list = await Task.find({ project, emp, name: { contains: key } }).sort('createdAt DESC').skip((page - 1) * 10).limit(11).populate('emp');
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
        } catch (error) {
            code = 103;
            message = 'error';
            console.log(error);
        }

        return res.json({ code, message, data });
    },

    report: async (req, res) => {
        res.status(200);
        let code = 500; message = 'error', data = undefined;
        try {
            let { report, id } = req.body.data;
            if (id && report) {
                let r = await Task.updateOne({ id }).set({ report, status: TASK_STATUS.STOPED, endTime: new Date() });
                if (r) {
                    code = 200;
                    message = 'success';
                } else {
                    code = 101;
                }
            } else {
                code = 102;
            }
        } catch (error) {
            code = 103;
            console.log(error);
        }
        return res.json({ code, message, data });
    }

};

