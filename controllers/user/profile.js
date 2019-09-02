const profile = (req, res) => {

    res.json(req.user);

};

module.exports = profile;
