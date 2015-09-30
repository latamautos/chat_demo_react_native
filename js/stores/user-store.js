/**
 * Created by xavier on 9/23/15.
 */
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;


var UserStore = assign(new EventEmitter(), {
    getUser: function () {
        return {id: 1, type: 'user'}
    }
});

module.exports = UserStore;