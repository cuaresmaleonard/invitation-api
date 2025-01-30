const { connect, endConnection } = require("../db/connect");
const { isValidUUID } = require("../utilities/validationUtils");

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
			const client = await connect();
			const isUUID = isValidUUID(uuid);
			const column = isUUID ? "uuid" : "id";

			let text = `
			SELECT a.id, family, a.deleted, uuid, count, b.name 
			FROM ${table} a
			LEFT JOIN registration b ON a.id = b.family_id
			WHERE a.${column} = $1
			AND a.deleted = false
			AND (b.deleted = false OR b.deleted IS NULL)
		`;

			let result = await client.query({
				text,
				values: [uuid],
			});

			if (result.rows.length === 0) {
				text = `
				SELECT id, family, deleted, uuid, count 
				FROM ${table}
				WHERE ${column} = $1
				AND deleted = false
			`;

				result = await client.query({
					text,
					values: [uuid],
				});
			}

			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	insert: async function ({ table, data }) {
		const { id, uuid, family, count, deleted } = data;
		try {
			const client = await connect();
			const result = await client.query({
				text: `INSERT INTO ${table}(id, uuid, family, count, deleted) VALUES($1, $2, $3, $4, $5) RETURNING *`,
				values: [id, uuid, family, count, deleted],
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
			console.log("delete by id");
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
