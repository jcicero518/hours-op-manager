import React, {Component} from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import TestPage from "./TestPage";
import DepartmentsContainer from "./DepartmentsContainerRedux";
import {
	Router,
	Route,
	Switch,
	Link,
	NavLink,
	withRouter
} from "react-router-dom";

const App = () => {
	return (
		<div>
			<Link to="/wp-admin/admin.php?page=manage-hours-of-operation">Home</Link>
			<Link to="/wp-admin/admin.php?page=manage-hours-of-operation/#main">Main</Link>
			<Link to="/wp-admin/admin.php?page=manage-hours-of-operation/#departments">Departments</Link>
			<Switch>
				<Route exact path="/" component={TestPage}>Home</Route>
				<Route path="/#main" component={TestPage}>Main</Route>
				<Route path="/#departments" component={DepartmentsContainer}>Departments</Route>
			</Switch>
		</div>
	);
};

export default App;
