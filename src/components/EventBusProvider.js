import { useContext, createContext } from "react";
import EventEmitter from "@lib/utils/EventEmitter.js";

/**
 * @typedef EventEmitter
 * @property {Function} addEventListener Register an event listener
 * @property {Function} on Same as addEventListener
 * @property {Function} removeEventListener Remove an event listener
 * @property {Function} off Same as removeEventListener
 * @property {Function} emit Send an event
 * @property {Function} send Same as emit()
 */

const EventBusContext = createContext();

/**
 * NOTE : Don't forget the {children} when writing a context provider !
 * @param props
 * @param
 */
const EventBusProvider = ({ listeners = {}, children }) => {
	const eb = new EventEmitter();

	Object.keys(listeners).map((eventName) => eb.on(eventName, listeners[eventName]));
	return <EventBusContext.Provider value={eb}>{children}</EventBusContext.Provider>;
};

export default EventBusProvider;

/**
 * Make en EventBus accessible inside this component
 * with the useEventBus() hook
 * @param {JSX.Element} Component
 */
export const withEventBus = (Component) => (props) => {
	return (
		<EventBusProvider>
			<Component {...props} />
		</EventBusProvider>
	);
};

/**
 * useEventBus() Hook
 * @return {EventEmitter}
 */
export const useEventBus = () => {
	const eb = useContext(EventBusContext);
	// if (!eb) {
	// 	throw new Error(
	// 		`useEventBus() hook can only be used from inside a <EventBusProvider/> parent`
	// 	);
	// }
	return eb;
};
