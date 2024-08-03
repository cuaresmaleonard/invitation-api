const {
	read,
	readById,
	insert,
	updateById,
	deleteById,
} = require("../model/register");

// const { insert: insertUpdate } = require("../model/updates");
const { updates: insertUpdate } = require("./updates");
const date = require("date-and-time");
const dateTime = date.format(new Date(), "YYYY-MM-DD HH:mm:ss");
const registrationTable = "registration";

module.exports = {
	getRegister: function () {
		return read({
			registrationTable,
		});
	},
	getRegisterId: async function (id) {
		const data = await readById({ id, registrationTable });
		if (data !== undefined && data.length > 0) {
			return readById({ id, registrationTable });
		} else {
			return { status: 400, message: "ID does not exist or invalid." };
		}
	},
	postRegister: async function (req) {
		try {
			const { fname, lname, family_id } = req.body;
			const id = Math.floor(1000000000 + Math.random() * 900000);
			const registerData = {
				id,
				fname,
				lname,
				family_id,
				create_date: dateTime,
			};
			const resultInsert = await insert({
				registrationTable,
				registerData,
			});

			await insertUpdate({
				result: resultInsert,
				update_date: dateTime,
				registration_id: id,
			});

			return resultInsert;
		} catch (error) {}
	},
	updateRegister: async function (req) {
		const id = req.params.id;
		const { fname, lname, family_id } = req.body;
		const update = {
			id,
			fname,
			lname,
			family_id,
		};
		const data = await readById({ id, registrationTable });
		if (data !== undefined && data.length > 0) {
			const resultUpdate = await updateById({
				registrationTable,
				update,
			});

			await insertUpdate({
				result: resultUpdate,
				update_date: dateTime,
				registration_id: id,
			});

			return resultUpdate;
		} else {
			return { status: 400, message: "ID does not exist or invalid." };
		}
	},
	deleteRegister: async function (id) {
		const data = await readById({ id, registrationTable });
		if (data !== undefined && data.length > 0) {
			const deleteData = await deleteById({
				registrationTable,
				id,
			});

			await insertUpdate({
				result: deleteData,
				update_date: dateTime,
				registration_id: id,
			});

			return { status: 200, message: `ID ${id} deleted.` };
		} else {
			return { status: 400, message: "ID does not exist or invalid." };
		}
	},
};
