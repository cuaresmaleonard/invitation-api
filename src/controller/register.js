const {
	read,
	readById,
	insert,
	updateById,
	deleteById,
	deleteByFamily,
} = require("../model/register");

const { readById: readByIdFamily } = require("../model/family");
const { updates: insertUpdate } = require("./updates");
const date = require("date-and-time");
const { isArrayOfObjects } = require("../utilities/validationUtils");
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
			return data;
		} else {
			return { status: 400, message: "ID does not exist or invalid." };
		}
	},
	postRegister: async function (req) {
		const familyId = req.params.familyId;
		const namesPayload = req.body;

		// Function to check if variable is an array of objects
		if (!isArrayOfObjects(namesPayload))
			return { status: 400, message: "Invalid payload" };

		const family = await readByIdFamily({
			uuid: familyId,
			table: "family",
		});
		console.log("family", family)

		const allowedCount = family.length > 0 ? family[0]?.count : 0;

		if (namesPayload.length > allowedCount) {
			return { status: 403, message: "Maximum allowed guest is reached" };
		}
		await deleteByFamily({ registrationTable, familyId });

		try {
			const registerData = namesPayload.map(({ name }) => {
				return [
					Math.floor(1000000000 + Math.random() * 900000),
					name,
					familyId,
					dateTime,
				];
			});

			// validate if the number of guest is valid and check if there is an existing registration

			const resultInsert = await insert({
				registrationTable,
				registerData,
			});

			// fix this issue when inserting an update
			// const insertUpdate = insertUpdate({
			// 	result: resultInsert,
			// 	update_date: dateTime,
			// 	registration_id: id,
			// });

			return { status: 200, message: resultInsert };
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
