const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Outcoming= db.Outcoming

module.exports = {
	delete: _delete
}

async function _delete(id) {
    await Outcoming.findByIdAndRemove(id);
}


