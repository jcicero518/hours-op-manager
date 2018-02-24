import React from "react";

export default ({children, props}) => {

	return (
		<div className="accordion__pane--panel-row" {...props}>
			{children}
		</div>
	);
}