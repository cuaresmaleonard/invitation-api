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
		try {
			const client = await connect();
			const text = ` INSERT INTO ${registrationTable}(id, name, family_id, create_date, email) SELECT * FROM UNNEST ( $1::integer[], $2::text[], $3::integer[], $4::timestamptz[], $5::text[] ) RETURNING * `;
			const result = await client.query({
				text: text,
				values: [
					registerData.map((v) => v[0]), // ids
					registerData.map((v) => v[1]), // names
					registerData.map((v) => v[2]), // family_ids
					registerData.map((v) => v[3]), // create_dates
					registerData.map((v) => v[4]), // email
				],
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
	deleteByFamily: async function ({ registrationTable, familyId }) {
		console.log(registrationTable, familyId);
		try {
			const client = await connect();
			const result = await client.query({
				text: `UPDATE ${registrationTable} SET deleted = $1 WHERE family_id = $2 RETURNING *`,
				values: [true, familyId],
			});
			endConnection(client);
			return result.rows;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
};
