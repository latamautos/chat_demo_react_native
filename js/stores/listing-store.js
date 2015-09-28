/**
 * Created by xavier on 9/23/15.
 */
var AppDispatcher = require('../dispatchers/thread-dispatcher');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Firebase = require('firebase');

var CHANGE_THREAD_LIST = "CHANGE_LISTING_LIST";

var firebaseWasInitiallize = false;

var ListingItems = [];

var initializeFirebase = function () {
	firebaseWasInitiallize = true;
	var threadsRef = new Firebase('https://latamautos-chat.firebaseio.com/ecuador/threads');
	threadsRef.orderBy('genre')
		.startAt('comedy').endAt('comedy')
		.on('value', function(snapshot) {
			var movie = snapshot.val();
			if (movie.lead == 'Jack Nicholson') {
				console.log(movie);
			}
		});
};

var ThreadStore = assign(new EventEmitter(), {
	emitChange: function () {
		this.emit(CHANGE_THREAD_LIST)
	},

	addChangeListener: function (callback) {
		this.on(CHANGE_THREAD_LIST, callback)
	},

	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_THREAD_LIST, callback)
	},

	getThreadItems: function () {
		if (!firebaseWasInitiallize) {
			initializeFirebase();
		}
		return threadItems;
	}
});

module.exports = ThreadStore;