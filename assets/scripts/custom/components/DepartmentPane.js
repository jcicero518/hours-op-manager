import React, {Component} from "react";
import PropTypes from 'prop-types'
import Form from "./Form";
import styled, {css} from "styled-components";
import DivPanel from "../styled-components/DIV";
import H3 from "../styled-components/H3";
import {CSSTransitionGroup} from "react-transition-group";

class DepartmentPane extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			height: 0,
			currentPaneExpanded: null
		};

		this.onPaneClick = this.onPaneClick.bind( this );
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
		_.setState({
			currentPaneExpanded: expanded
		});

		_.props.handlePaneClick( clickedPane, expanded );
	}

	render() {
		const {height, currentPaneExpanded} = this.state;
		const {id, label, expanded, handleDeleteClick} = this.props;

		const panePanelStyle = {
			height: expanded ? `${height}px` : `height:0px`
		};

		return (

			<DivPanel>
				<H3
					onClick={this.onPaneClick}
					className="accordion__pane--header"
					aria-controls={`dept_pane_${id}`}
					aria-expanded={!!expanded && !currentPaneExpanded}>{label}<button className="toggle">toggle</button> </H3>
				<div
					id={`dept_pane_${id}`}
					className="accordion__pane--panel"
					aria-hidden={!expanded}
					aria-expanded={!!expanded}
					aria-selected={!!expanded}>

					<Form handleDelete={handleDeleteClick} departmentId={id} departmentLabel={label} />

				</div>
			</DivPanel>

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

