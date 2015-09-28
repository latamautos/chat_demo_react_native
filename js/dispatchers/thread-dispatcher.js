/**
 * Created by xavier on 9/23/15.
 */
var Dispatcher = require('flux').Dispatcher;
var assign = require('react/lib/Object.assign');

var ThreadDispatcher = assign(new Dispatcher(), {
	handleViewAction: function(action){
		this.dispatch({
			source: 'VIEW_ACTION',
			action:action
		})
	}
})

module.exports = ThreadDispatcher;