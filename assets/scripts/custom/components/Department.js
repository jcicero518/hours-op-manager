import PropTypes from 'prop-types'
import React, {Component} from "react";
import ReactDOM from "react-dom";
import DepartmentPane from "./DepartmentPane";

class Department extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			expanded: false
		};
		this.handleClick = this.handleClick.bind( this );
		this.handleDelete = this.handleDelete.bind( this );
	}

	componentDidMount() {
		let comp = ReactDOM.findDOMNode( this );
		//console.log(comp, 'comp');
	}

	handleClick( clickedPane, expanded ) {
		let _ = this;
		let paneId = clickedPane.getAttribute( 'aria-controls' ).replace( 'dept_pane_', '' );
		_.props.setActivePane( paneId, expanded );

		_.showHidePanel();
	}

	handleDelete( event ) {
		let _ = this;
		_.props.handleDelete( event );
	}

	showHidePanel() {
		let _ = this;
		this.setState({
			expanded: !this.state.expanded
		})
	}

	render() {
		const {expanded} = this.state;
		const {activePane, id} = this.props;

		const isExpanded = activePane === id;

		return (
			<DepartmentPane expanded={isExpanded} handleDeleteClick={this.handleDelete} handlePaneClick={this.handleClick} {...this.props} />
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