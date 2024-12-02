function isValidUUID(uuid) {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}
function isArrayOfObjects(arr) {
	return (
		Array.isArray(arr) && arr.every((item) => item && typeof item === "object")
	);
}

module.exports = { isValidUUID, isArrayOfObjects };
