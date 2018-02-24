import React, {Component} from "react";
import ReactDOM from "react-dom";
import {
	BrowserRouter,
	Route,
	Switch,
	Link
}  from "react-router-dom";
import App from "./App";

class Manager extends Component {

	constructor( props ) {
		super( props );
	}


	render() {
		return (
			<BrowserRouter>
				<App/>
			</BrowserRouter>
		)
	}
}

ReactDOM.render( <Manager/>, document.getElementById( 'app-container' ) );
/*ReactDOM.render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>, document.getElementById( 'app-container' )
);*/