/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// 101 session không tồn tại
// 102 có lỗi trong lúc tạo project
// 103 lỗi try catch
// 104 thiếu tham số
// 105 không tìm thấy dữ liệu

const projectStatus = sails.config.custom.projectStatus;
const memberStatus = sails.config.custom.memberStatus;
const ObjectId = require('mongodb').ObjectID;

module.exports = {

    add: async (req, res) => {
        res.status(200);
        let code, message;
        let { project, token } = req.body.data;
        let s = await Session.findOne({ token });
        if (s) {
            project.owner = s.userid;
            project.endTime = new Date(project.endTime);
            project.status = projectStatus.WORKON;
            let p = await Project.create(project).fetch();
            if (p) {
                code = 200;
                message = 'success';
            } else {
                code = 102;
                message = 'error';
            }
        } else {
            code = 101;
            message = 'error';
        }
        return res.json({ code, message });
    },

    getList: async (req, res) => {
        res.status(200);
        let code, message, data, list;
        try {
            let { key, project, status, page, id } = req.body.data;
            if (!page || page < 0) {
                page = 1;
            }
            console.log(key, project, status, page, id);
            let criteriaStatus = {}, criteriaProject = {};
            if (!project || project === 'all') {
                criteriaProject.$match = {};
            } else if (project === 'owner') {
                criteriaProject.$match = { owner: new ObjectId(id) };
            } else if (project === 'join') {
                // get list member
                let listP = await Member.find({ user: id, status: { in: [memberStatus.ONLINE, memberStatus.OFFLINE] } });
                console.log(listP);
                listP = listP.map(mem => new ObjectId(mem.project));
                criteriaProject.$match = {
                    _id: {
                        $in: listP
                    }
                }
            }
            criteriaStatus.$match = status ? { status: status } : {};
            let db = Project.getDatastore().manager;
            console.log(criteriaStatus, criteriaProject);
            list = await db.collection('project').aggregate([
                criteriaProject,
                criteriaStatus,
                {
                    $match: {
                        name: { $regex: key, $options: "i" }
                    }
                },
                {
                    $lookup: {
                        from: 'user',
                        localField: 'owner',
                        foreignField: '_id',
                        as: 'owner'
                    }
                },
                {
                    $skip: (page - 1) * 10
                },
                {
                    $limit: 11
                }
            ]).toArray();
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

    getOne: async (req, res) => {
        res.status(200);
        let code, message = 'error', data;

        try {
            let { id } = req.body.data;
            if (id) {
                let project = await Project.findOne({ id }).populate('owner').populate('members');
                if (project) {
                    let listId = project.members.map(mem => mem.user);
                    let members = await User.find({ id: { in: listId } });
                    for (let i = 0; i < members.length; i++) {
                        let id = members[i].id;
                        members[i].status = project.members.find(mem => mem.user === id).status;
                    }
                    project.members = members;
                    code = 200;
                    message = 'success';
                    data = { project };
                } else {
                    code = 105;
                }
            } else {
                code = 104;
            }
        } catch (error) {
            code = 103;
            console.log(error);
        }
        return res.json({ code, message, data });
    }

};

