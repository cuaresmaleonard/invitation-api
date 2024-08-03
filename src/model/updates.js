const { connect, endConnection } = require("../db/connect");

module.exports = {
	insert: async function ({ updateTable, updateData }) {
		const { update_date, registration_id } = updateData;
		try {
			const client = await connect();
			const result = await client.query({
				text: `INSERT INTO ${updateTable}(update_date, registration_id) VALUES($1, $2)`,
				values: [update_date, registration_id],
			});
			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
};
