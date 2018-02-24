import React, {Component} from "react";
import ReactDOM from "react-dom";
import Form from "./Form";

class FormContainer extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			file: null
		};

		this.uploadFile = this.uploadFile.bind( this );
	}

	componentDidMount() {

	}

	uploadFile( file ) {

	}

	render() {
		return (
			<Form onUpload={this.uploadFile} file={this.state.file} />
		)
	}
}

/*if ( document.getElementById( 'app-container' ) ) {
	ReactDOM.render( <FormContainer/>, document.getElementById( 'app-container' ) );
}*/
export default FormContainer;