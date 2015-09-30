/**
 * Created by xavier on 9/23/15.
 */
var ThreadDispatcher = require('../dispatchers/ThreadDispatcher');
var ThreadActionConstants = require('../constants/ThreadActionConstants');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Firebase = require('firebase');
var UserStore = require('./user-store');

var CHANGE_THREAD_LIST = "CHANGE_THREAD_LIST";

var firebaseWasInitiallize = false;

var threadItems = [];
var threadItemsById = {};

var extracted = function (snapshot) {
    var thread = snapshot.val();
    thread.key = snapshot.key();
    threadItemsById[snapshot.key()] = thread
    ThreadStore.emitChange()
}
var initializeFirebase = function () {
    firebaseWasInitiallize = true;
    var threadsRef = new Firebase('https://latamautos-chat.firebaseio.com/ecuador/threads');
    threadsRef.orderByChild(UserStore.getUser().type + "_" + UserStore.getUser().id).startAt(true).endAt(true).on("child_added", function (snapshot, prevChildKey) {
        extracted(snapshot);
    });
    threadsRef.orderByChild(UserStore.getUser().type + "_" + UserStore.getUser().id).startAt(true).endAt(true).on("child_changed", function (snapshot, prevChildKey) {
        extracted(snapshot);
    });
};
var addMessageToThread= function (threadId, messageText) {
    var thread = threadItemsById[threadId]

    var messages = thread.messages;
    var formattedDate = ThreadStore._formatActualDate()
    var messageObject = {
        created_at: formattedDate, text: messageText,
        creator_id: UserStore.getUser().id, creator_type: UserStore.getUser().type
    }
    messages.push(messageObject)
    var threadUpdate = {messages: messages, last_message_created_at: formattedDate, status: 'PENDING'}
    var threadRef = new Firebase('https://latamautos-chat.firebaseio.com/ecuador/threads/' + threadId);
    threadRef.update(threadUpdate);
    ThreadStore.emitChange()
}
var changeThreadToReadStatus=function(threadId) {
    var thread = threadItemsById[threadId]

    var lastMessage = thread.messages[Object.keys(thread.messages).length - 1];
    if (lastMessage.creator_id != UserStore.getUser().id ||
        lastMessage.creator_type != UserStore.getUser().type) {
    }
    var threadRef = new Firebase('https://latamautos-chat.firebaseio.com/ecuador/threads/' + threadId);
    threadRef.update({status: 'READ'});
    ThreadStore.emitChange()
}

var ThreadStore = assign(new EventEmitter(), {
    emitChange: function () {
        this.reorderItems()
        this.emit(CHANGE_THREAD_LIST)
    },
    _formatActualDate(){
        var date = new Date()
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        hours = hours < 10 ? '0' + hours : hours;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },


    getThread: function (threadId) {
        return threadItemsById[threadId]
    },


    reorderItems: function () {
        threadItems = []
        var keys = []
        var k

        for (k in threadItemsById) {
            if (threadItemsById.hasOwnProperty(k)) {
                threadItems.push(threadItemsById[k]);
            }
        }
        threadItems.sort(function (a, b) {
            if (a.last_message_created_at < b.last_message_created_at) {
                return 1;
            }
            if (a.last_message_created_at > b.last_message_created_at) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })

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
    },
    dispatcherIndex: ThreadDispatcher.register(function (payload) {
        var action = payload.action; // this is our action from handleViewAction
        switch (action.actionType) {
            case ThreadActionConstants.READ_THREAD:
                changeThreadToReadStatus(payload.action.threadId);
                break;

            case ThreadActionConstants.ADD_MESSAGE_TO_THREAD:
                addMessageToThread(payload.action.threadId, payload.action.messageText)
                break;


        }

        ThreadStore.emitChange();

        return true;
    })
});

module.exports = ThreadStore;