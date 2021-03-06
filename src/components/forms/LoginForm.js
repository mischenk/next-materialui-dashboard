import { useRouter } from "next/router";
import { useAuthentication } from "../AuthenticationProvider.js";

import APIForm from "@forms/APIForm.js";
import User from "@models/User.js";
import Email from "./inputs/Email.js";
import Password from "./inputs/Password.js";
import Submit from "./inputs/Submit.js";
import { useState } from "react";

/**
 * Displays a form to log the user
 */
const LoginForm = () => {
	const auth = useAuthentication();
	const router = useRouter();
	const [redirecting, setRedirecting] = useState(false);

	/**
	 * After a successful login, the full User is returned by the API
	 * @param {Object} userData
	 */
	const onSuccess = (userData) => {
		setRedirecting(true);
		const loggedUser = new User(userData);
		auth.setLoggedUser(loggedUser);

		if (auth.redirectAfterLogin) {
			// We know where the disconnected user wanted to be
			router.push(auth.redirectAfterLogin);
		} else {
			// Redirection depends of the user's profile
			router.push(loggedUser.isAdmin() ? "/admin/adherents" : "/member");
		}
	};

	return redirecting ? null : (
		<APIForm action="/api/user/login" onSuccess={onSuccess}>
			<Email
				label="Email"
				name="username"
				autoFocus={true}
				required="Saisissez votre email"
			/>
			<Password
				label="Mot de passe"
				name="password"
				required="Saisissez votre mot de passe"
			/>
			<Submit />
		</APIForm>
	);
};

export default LoginForm;
