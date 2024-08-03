const router = require("express").Router();
const {
	getRegister,
	getRegisterId,
	postRegister,
	updateRegister,
	deleteRegister,
} = require("../controller/register");

router
	.route("/register")
	// to create new resources
	.post(async function (req, res, next) {
		const data = await postRegister(req);
		res.json(data).status(201).send();
	})
	// to retrieve resource
	.get(async function (req, res, next) {
		const data = await getRegister();
		res.json(data);
	});
router
	.route("/register/:id")
	// to retrieve a single resource
	.get(async function (req, res, next) {
		const data = await getRegisterId(req.params.id);
		res.json(data);
	})
	.patch(async function (req, res, next) {
		const data = await updateRegister(req);
		res.json(data);
	})
	.delete(async function (req, res, next) {
		const data = await deleteRegister(req.params.id);
		res.status(data.status).send(data);
	});

module.exports = router;
