const { Client } = require("pg");

module.exports = {
	connect: async function () {
		try {
			const config = {
				user: process.env.DB_USERNAME,
				password: process.env.DB_PASSWORD,
				host: process.env.DB_HOST,
				port: process.env.DB_PORT,
				database: process.env.DB_NAME,
				ssl: {
					rejectUnauthorized: false,
				},
			};

			const client = new Client(config);

			await client.connect();

			return client;
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
	endConnection: async function (client) {
		try {
			client
				.end()
				.then(() => {
					console.log("Connection to PostgreSQL closed");
				})
				.catch((err) => {
					console.error("Error closing connection", err);
				});
		} catch (error) {
			console.log("Error encountered", error);
		}
	},
};
