const { insert } = require("../model/updates");
const updateTable = "updates";

module.exports = {
	updates: async function ({ result, update_date, registration_id }) {
		console.log("123" );
		try {
			const updateData = {
				update_date,
				registration_id,
			};

			if (result.length > 0) {
				await insert({ updateTable, updateData });
			}

			return true;
		} catch (error) {
			return false;
		}
	},
};
