const { connect, endConnection } = require("../db/connect");

module.exports = {
	read: async function ({ registrationTable }) {
		try {
			const client = await connect();
			const result = await client.query(
				`SELECT * FROM ${registrationTable} WHERE deleted = false`
			);
			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	readById: async function ({ id, registrationTable }) {
		try {
			const client = await connect();
			const result = await client.query({
				text: `SELECT * FROM ${registrationTable} WHERE id = $1 AND deleted = false`,
				values: [id],
			});

			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	insert: async function ({ registrationTable, registerData }) {
		const { fname, lname, family_id, id, create_date } = registerData;
		try {
			const client = await connect();
			const result = await client.query({
				text: `INSERT INTO ${registrationTable}(id, fname, lname, family_id, create_date) VALUES($1, $2, $3, $4, $5) RETURNING *`,
				values: [id, fname, lname, family_id, create_date],
			});
			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	updateById: async function ({ registrationTable, update }) {
		const { fname, lname, family_id, id } = update;
		try {
			const client = await connect();
			const result = await client.query({
				text: `UPDATE ${registrationTable} SET fname = $1, lname = $2, family_id = $3 WHERE id = $4 RETURNING *`,
				values: [fname, lname, family_id, id],
			});

			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	deleteById: async function ({ registrationTable, id }) {
		try {
			const client = await connect();
			const result = await client.query({
				text: `UPDATE ${registrationTable} SET deleted = $1 WHERE id = $2 RETURNING *`,
				values: [true, id],
			});
			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
};
