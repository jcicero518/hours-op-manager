import PropTypes from 'prop-types'
import React, {Component} from "react";
import ReactDOM from "react-dom";
import DepartmentPane from "./DepartmentPane";

class Department extends Component {

	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	componentDidMount() {
		let comp = ReactDOM.findDOMNode( this );
		//console.log(comp, 'comp');
	}

	handleClick( clickedPane, expanded ) {
		let _ = this;
		let paneId = clickedPane.getAttribute( 'aria-controls' ).replace( 'dept_pane_', '' );
		_.props.setActivePane( paneId, expanded );
	}

	render() {
		const _ = this;
		const {activePane, id, handleDelete} = _.props;
		const isExpanded = activePane === id;

		return (
			<DepartmentPane expanded={isExpanded} handleDeleteClick={handleDelete} handlePaneClick={_.handleClick} {...this.props} />
		)
	}
}

Department.propTypes = {
  activePane: PropTypes.string,
  handleDelete: PropTypes.func,
  id: PropTypes.string,
  setActivePane: PropTypes.func
};

export default Department;