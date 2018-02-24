import React from "react";
import toastr from "toastr";

function copyText( event ) {
	let
		target = event.target,
		copier = target.getAttribute( 'data-copytarget' ),
		input = copier ? document.getElementById( copier ) : null;

	// check for select support
	if ( input && input.select ) {
		// select text
		input.select();

		try {
			// copy to clipboard if possible
			document.execCommand( 'copy' );
			input.blur();
			// let the user know it worked
			toastr.success( 'The shortcode has been copied to your clipboard', 'Success!' );
		} catch ( exception ) {
			console.warn( exception );
			alert( `Sorry, your browser doesn't support this. You can highlight and copy it here: ${input.value}`);
		}
	}
}

const Actions = ( {copyTarget, displayButton } ) => {
	return displayButton ? ( <button onClick={copyText} data-copytarget={`${copyTarget}`}>Copy Shortcode</button> ) : null;
};


export default Actions;