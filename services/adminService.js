const adminModel = require('../models/task.admin');
const bcrypt = require('bcrypt');


exports.findByUsername = (username) => {
    return adminModel.findOne({
        username: username
    }).lean();
}

exports.validPassword = async (password, admin) => {
    return bcrypt.compare(password, admin.password);
}

exports.register = async (username, email, name, password, number) => {
    const passwordHash = await bcrypt.hash(password, 10)
    return adminModel.create({
        username: username,
        email: email,
        name: name,
        password: passwordHash,
        number: number
    });
}

