
const get_server_time = async (req, res) => {
    res.json({
        code: 200,
        time: Date.now()
    });
};

module.exports = get_server_time;