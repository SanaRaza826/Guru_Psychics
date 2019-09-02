const {RENDER_BAD_REQUEST} = require('../common/utils');


const confirm_register_pin = async (req, res) => {

    let success = false;

    try {
        const received_pin = req.body['pin'];
        const user_pin = req.user.confirmation_code;

        if (received_pin === user_pin) {
            await req.user.validated_pin();
            success = true
        }
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }

    res.json({
        code: 200,
        validated: success
    });
};

module.exports = confirm_register_pin;
