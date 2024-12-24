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
const { sendEmail } = require("../utilities/sendEmail");
const dateTime = date.format(new Date(), "YYYY-MM-DD HH:mm:ss");
const registrationTable = "registration";
const validator = require("validator");

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

	postRegister: async function (req, res) {
		const familyId = req.params.familyId;
		const registration = req.body.registration;
		const email = req.body.email;

		// Sanitize email
		const sanitizedEmail = validator.normalizeEmail(email);

		// Validate email
		if (!validator.isEmail(sanitizedEmail)) {
			return res
				.status(400)
				.json({ status: 400, message: "Invalid email format" });
		}

		// Sanitize and validate registration
		if (!isArrayOfObjects(registration)) {
			return res.status(400).json({ status: 400, message: "Invalid payload" });
		}

		// Sanitize names
		const sanitizedRegistration = registration.map((item) => {
			return {
				name: validator.escape(item.name.trim()),
			};
		});

		const family = await readByIdFamily({
			uuid: familyId,
			table: "family",
		});

		const allowedCount = family.length > 0 ? family[0]?.count : 0;

		if (sanitizedRegistration.length > allowedCount) {
			return res
				.status(403)
				.json({ status: 403, message: "Maximum allowed guest is reached" });
		}
		await deleteByFamily({ registrationTable, familyId });

		try {
			const registerData = sanitizedRegistration.map(({ name }) => {
				return [
					Math.floor(1000000000 + Math.random() * 900000),
					name,
					familyId,
					dateTime,
				];
			});

			// Validate if the number of guests is valid and check if there is an existing registration
			const resultInsert = await insert({
				registrationTable,
				registerData,
			});

			sendEmail({ email: sanitizedEmail, registration: sanitizedRegistration });

			// Fix this issue when inserting an update
			// const insertUpdate = await insertUpdate({
			//     result: resultInsert,
			//     update_date: dateTime,
			//     registration_id: familyId,
			// });

			res.status(200).json({ status: 200, message: resultInsert });
		} catch (error) {
			res.status(500).json({ status: 500, message: error.message });
		}
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
