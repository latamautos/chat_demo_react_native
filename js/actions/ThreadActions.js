/**
 * Created by xavier on 9/29/15.
 */

var ThreadActionConstants = require('../constants/ThreadActionConstants');
var ThreadDispatcher = require('../dispatchers/ThreadDispatcher');

var ThreadActions = {
    addMessageToThread: function (threadId, messageText) {
        ThreadDispatcher.handleViewAction({
            actionType: ThreadActionConstants.ADD_MESSAGE_TO_THREAD,
            threadId: threadId,
            messageText: messageText
        })
    },
    readThread: function (threadId) {
        ThreadDispatcher.handleViewAction({
            actionType: ThreadActionConstants.READ_THREAD,
            threadId: threadId
        })
    },

}

module.exports = ThreadActions;