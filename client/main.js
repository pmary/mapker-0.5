/**
 * Valadation of form fields
 * @param: fields -> A JSON object containing the fields description like [{node: email, type: "email",required: true, message: "Required Field"}, {...}, ...]
 * @return: true/false
 */
fieldsValidation = function(fields) {
	var status = true;
	for (var i = fields.length - 1; i >= 0; i--) {
		// Reinitialize all the fields error
		fields[i].node.className = fields[i].node.className.replace(" error", "");
		fields[i].node.parentNode.className = fields[i].node.parentNode.className.replace(" error", "");
		fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].style.display = "none";

		// If the field is required but the node is empty
		if (fields[i].required && !fields[i].node.value) {
			status = false;

			fields[i].node.className = fields[i].node.className + " error";
			fields[i].node.parentNode.className = fields[i].node.parentNode.className + " error";
			fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].style.display = "block";
			fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].innerHTML = fields[i].message;
		};
	};

	return status;
}