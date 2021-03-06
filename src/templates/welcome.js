// welcome.js
const splitPath = (path = "") => path.split(/[,\[\]\.]+?/).filter(Boolean);

/**
 * Extract the property value at the designed path
 * @example getProperty({ person: { firstName: "John" }}, "person.firstName", "")
 * @param {Object} source Object to extract the property from
 * @param {String} path Usings dots and [] to access sub properties
 * @param {Object} [defaultValue] what to return if the property is not found (undefined)
 * @return {Any}
 */
const getProperty = (source = {}, path = "", defaultValue) => {
	const result = splitPath(path).reduce(
		(result, key) => (result !== null && result !== undefined ? result[key] : result),
		source
	);

	return result === undefined || result === null || result === source
		? defaultValue
		: result;
};

/**
 * Apply the data to the compiled TEXT template
 * @param {Object} data
 * @return {String}
 */
export const text = function anonymous(data) {
	var out =
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" />\n\nLes Mureaux, le ' +
		new Date().toISOString().substr(0, 10) +
		"\n\nVos références : " +
		getProperty(data, "adhesion.no", "") +
		" - " +
		getProperty(data, "nom", "") +
		"\n\nBonjour,\n\nVous venez de valider votre demande d'adhésion en ligne.\n\nNous vous remercions pour votre confiance.\n\nAfin de finaliser votre adhésion, le règlement (d’un montant de 200€) peut se réaliser par :\n\n* Chèque à l’ordre d’INVIE  \n* Virement bancaire via l’IBAN FR76 1751 5006 0008 0019 2244 430  \n\n \nPour toute question complémentaire, vous pouvez nous contacter par téléphone au 01 39 29 43 48 ou par mail mpace@agence-autonomy.fr\n\nCordialement,\n\nL’équipe d’INVIE\n";
	return out.replace(/(<([^>]+)>)/gi, "");
};

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = function anonymous(data) {
	var out =
		'<img src="https://invie78.fr/images/logo.jpg" alt="logo" /><p>Les Mureaux, le ' +
		new Date().toISOString().substr(0, 10) +
		"</p><p>Vos références : " +
		getProperty(data, "adhesion.no", "") +
		" - " +
		getProperty(data, "nom", "") +
		'</p><p>Bonjour,</p><p>Vous venez de valider votre demande d\'adhésion en ligne.</p><p>Nous vous remercions pour votre confiance.</p><p>Afin de finaliser votre adhésion, le règlement (d’un montant de 200€) peut se réaliser par :</p><ul><li><p>Chèque à l’ordre d’INVIE</p></li><li><p>Virement bancaire via l’IBAN FR76 1751 5006 0008 0019 2244 430</p></li></ul><p>Pour toute question complémentaire, vous pouvez nous contacter par téléphone au 01 39 29 43 48 ou par mail <a href="mailto:mpace@agence-autonomy.fr">mpace@agence-autonomy.fr</a></p><p>Cordialement,</p><p>L’équipe d’INVIE</p>';
	return out;
};

/**
 * Front matter subject
 * @param {Object} data
 * @return {String}
 */
export const subject = function anonymous(data) {
	var out = "Votre adhésion INVIE (" + getProperty(data, "nom", "") + ")";
	return out;
};

/**
 * Front matter to
 * @param {Object} data
 * @return {String}
 */
export const to = function anonymous(data) {
	var out =
		'"' +
		getProperty(data, "representant.prenom", "") +
		" " +
		getProperty(data, "representant.nom", "") +
		'" <' +
		getProperty(data, "representant.email", "") +
		">";
	return out;
};

/**
 * Front matter bcc
 * @param {Object} data
 * @return {String}
 */
export const bcc = function anonymous(data) {
	var out = "zipang <christophe.desguez@gmail.com>";
	return out;
};

const welcome = {
	text,
	html,
	subject,
	to,
	bcc
};

const render = (data) =>
	Object.keys(welcome).reduce((prev, key) => {
		prev[key] = welcome[key](data);
		return prev;
	}, {});

export default render;
