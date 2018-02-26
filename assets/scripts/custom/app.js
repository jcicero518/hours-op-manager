//import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
	ConnectedRouter
} from 'react-router-redux';
//import { AppContainer } from "react-hot-loader";
import createHistory from 'history/createBrowserHistory';
import FontFaceObserver from "fontfaceobserver";
import toastr from "toastr";

import configureStore from "./store/configureStore";
import App from "./components/App";
import DepartmentsContainer from "./components/DepartmentsContainerRedux";

toastr.options = {
	"closeButton": true,
	"debug": false,
	"newestOnTop": false,
	"progressBar": false,
	"positionClass": "toast-top-right",
	"preventDuplicates": false,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut",
	"target": ".wrap"
};

const sansObserver = new FontFaceObserver( 'Open Sans', {} );

sansObserver.load().then( result => {
	console.log(result, 'result');
}).catch( error => {
	console.warn( error );
});

const initialState = {};
const history = createHistory();
const store = configureStore( initialState, history );
const MOUNT_NODE = document.getElementById( 'app-container' );


const render = () => {
	ReactDOM.render(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<DepartmentsContainer />
			</ConnectedRouter>
		</Provider>,
		MOUNT_NODE
	)
};

if (module.hot) {
	// Hot reloadable React components and translation json files
	// modules.hot.accept does not accept dynamic dependencies,
	// have to be constants at compile-time
	module.hot.accept(['./components/DepartmentsContainerRedux'], () => {
		ReactDOM.unmountComponentAtNode(MOUNT_NODE);
		render();
	});
} else {
	render();
}


if ( MOUNT_NODE ) {
	//ReactDOM.render( <DepartmentsContainer />, MOUNT_NODE );

}