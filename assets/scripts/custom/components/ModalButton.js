import React, {Component} from "react";


class ModalButton extends Component {

	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		this.props.handleClick();
	}

	render() {
		return (
			<button onClick={this.handleClick} className="page-title-action">Add New Department</button>
		)
	}
}

export default ModalButton;