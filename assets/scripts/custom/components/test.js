const React = require('react');
const { render } = require('react-dom');

render(

	<h1 id='title'
	    className='header'
	    style={{backgroundColor: 'orange', color: 'white', fontFamily:
		    'verdana'}}>
		Hello World
	</h1>,
	document.getElementById('react-container')
);
