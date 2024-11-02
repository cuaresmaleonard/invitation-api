const router = require("express").Router();
const {
	getFamily,
	getFamilyId,
	postFamily,
	updateFamily,
	deleteFamily,
} = require("../controller/family");

router
	.route("/family")
	// to create new resources
	.post(async function (req, res, next) {
		const data = await postFamily(req);
		res.json(data).status(201).send();
	})
	// to retrieve resource
	.get(async function (req, res, next) {
		const data = await getFamily();
		res.json(data);
	});
router
	.route("/family/:uuid")
	// to retrieve a single resource
	.get(async function (req, res, next) {
		const data = await getFamilyId(req.params.uuid);
		res.json(data);
	})
	.patch(async function (req, res, next) {
		const data = await updateFamily(req);
		res.json(data);
	})
	.delete(async function (req, res, next) {
		const data = await deleteFamily(req.params.uuid);
		res.status(data.status).send(data);
	});

module.exports = router;
