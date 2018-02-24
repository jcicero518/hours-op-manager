import React, {Component} from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types'
import Form from "./Form";
import {CSSTransitionGroup} from "react-transition-group";

class DepartmentPane extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			height: 0,
			currentPaneExpanded: null
		};

		this.onPaneClick = this.onPaneClick.bind( this );
		this.handleDelete = this.handleDelete.bind( this );
	}

	/*componentDidMount() {
		setTimeout( () => {
			const panel = ReactDOM.findDOMNode( this );
			console.log(panel, 'panel');
			const height = panel.querySelector( '.accordion__pane--panel' ).scrollHeight;
			this.setState({
				height: height
			});
		}, 333 );
	}*/

	onPaneClick( event ) {
		let _ = this;
		let clickedPane = event.target;
		let expanded = clickedPane.getAttribute( 'aria-expanded' ) === "true";
		_.setState( prevState => ({
			currentPaneExpanded: prevState.currentPaneExpanded === expanded ? -1 : expanded
		}));

		_.props.handlePaneClick( clickedPane, expanded );
	}

	handleDelete( event ) {
		let _ = this;
		_.props.handleDeleteClick( event );
	}

	render() {
		const {height, currentPaneExpanded} = this.state;
		const {id, label, expanded, activePane} = this.props;

		const panePanelStyle = {
			height: expanded ? `${height}px` : `height:0px`
		};

		return (

			<div>
				<h3
					onClick={this.onPaneClick}
					className="accordion__pane--header"
					aria-controls={`dept_pane_${id}`}
					aria-expanded={!!expanded && !currentPaneExpanded}>{label}<button className="toggle">toggle</button> </h3>
				<div
					id={`dept_pane_${id}`}
					className="accordion__pane--panel"
					aria-hidden={!expanded}
					aria-expanded={!!expanded}
					aria-selected={!!expanded}>

					<Form handleDelete={this.handleDelete} departmentId={id} departmentLabel={label} />

				</div>
			</div>

		)
	}
}

DepartmentPane.propTypes = {
  activePane: PropTypes.any,
  expanded: PropTypes.bool.isRequired,
  handleDeleteClick: PropTypes.func,
  handlePaneClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default DepartmentPane;

