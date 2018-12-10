
module.exports = async (req, res, proceed) => {

    try {
        let { token } = req.param('data');
        let t = await Session.findOne({ token });
        if (t) {
            proceed();
        } else {
            return res.json({ code: 999, message: 'forbidden' });
        }
    } catch (error) {
        return res.json({ code: 999, message: 'forbidden' });
    }

}
