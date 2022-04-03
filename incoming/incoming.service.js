const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Incoming= db.Incoming

module.exports = {
	delete: _delete
}

async function _delete(id) {
	console.log('jetzt bin ich hier zum löschen!')
    await Incoming.findByIdAndRemove(id);
}


