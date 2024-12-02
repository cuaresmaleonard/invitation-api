const {
	read,
	readById,
	insert,
	updateById,
	deleteById,
} = require("../model/family");

// const { insert: insertUpdate } = require("../model/updates");
const { updates: insertUpdate } = require("./updates");
const date = require("date-and-time");
const dateTime = date.format(new Date(), "YYYY-MM-DD HH:mm:ss");
const table = "family";
const { v4: uuidv4 } = require("uuid");

module.exports = {
	getFamily: function () {
		return read({
			table,
		});
	},
	getFamilyId: async function (uuid) {
		const data = await readById({ uuid, table });

		if (data && data.length > 0) {
			const { id, family, uuid, count } = data[0];
			const registration = data
				.filter(({ name }) => name !== undefined)
				.map(({ name }) => ({ name }));

			return { id, family, uuid, count, registration };
		} else {
			return { status: 400, message: "ID does not exist or invalid." };
		}
	},
	postFamily: async function (req) {
		try {
			const { family } = req.body;
			const id = Math.floor(1000000000 + Math.random() * 900000);
			const uuid = uuidv4();
			const data = {
				id,
				uuid,
				family,
				deleted: false,
			};
			const resultInsert = await insert({
				table,
				data,
			});

			return resultInsert;
		} catch (error) {}
	},
	updateFamily: async function (req) {
		const id = req.params.id;
		const { family } = req.body;
		const update = {
			id,
			family,
		};
		const data = await readById({ id, table });
		if (data !== undefined && data.length > 0) {
			const resultUpdate = await updateById({
				table,
				update,
			});

			// await insertUpdate({
			// 	result: resultUpdate,
			// 	update_date: dateTime,
			// 	registration_id: id,
			// });

			return resultUpdate;
		} else {
			return { status: 400, message: "ID does not exist or invalid." };
		}
	},
	deleteFamily: async function (uuid) {
		const data = await readById({ uuid, table });
		if (data !== undefined && data.length > 0) {
			await deleteById({
				table,
				uuid,
			});

			return { status: 200, message: `ID ${uuid} deleted.` };
		} else {
			return { status: 400, message: "ID does not exist or invalid." };
		}
	},
};
