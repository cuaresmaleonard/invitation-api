const { connect, endConnection } = require("../db/connect");

module.exports = {
	read: async function ({ table }) {
		try {
			const client = await connect();

			const result = await client.query(
				`SELECT * FROM ${table} WHERE deleted = false`
			);
			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	readById: async function ({ uuid, table }) {
		try {

			console.log("uuid", uuid)

			const client = await connect();
			const result = await client.query({
				text: `SELECT * FROM ${table} WHERE uuid = $1 AND deleted = false`,
				values: [uuid],
			});

			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	insert: async function ({ table, data }) {
		const { id, uuid, family, deleted } = data;
		try {
			const client = await connect();
			const result = await client.query({
				text: `INSERT INTO ${table}(id, uuid, family, deleted) VALUES($1, $2, $3, $4) RETURNING *`,
				values: [id, uuid, family, deleted],
			});
			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	updateById: async function ({ table, update }) {
		const { uuid, family } = update;
		try {
			const client = await connect();
			const result = await client.query({
				text: `UPDATE ${table} SET family = $1 WHERE uuid = $2 RETURNING *`,
				values: [family, uuid],
			});

			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	deleteById: async function ({ table, uuid }) {
		try {
			console.log("delete by id")
			const client = await connect();
			console.log("table", table);
			console.log("uuid", uuid);
			const result = await client.query({
				text: `UPDATE ${table} SET deleted = $1 WHERE uuid = $2 RETURNING *`,
				values: [true, uuid],
			});
			console.log("result", result);
			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
};
