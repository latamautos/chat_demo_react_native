var React = require('react-native');
var ThreadStore = require('../stores/thread-store');
var ThreadActions = require('../actions/ThreadActions');
var Conversation = require('./Conversation');
var UserStore = require('../stores/user-store');
var RouteConstants = require('../constants/RouteConstants');


var {
    AppRegistry,
    ListView,
    Text,
    View,
    StyleSheet,
    Image,
    TouchableHighlight
    } = React;

function getThreadItems() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
        dataSource: ds.cloneWithRows(ThreadStore.getThreadItems()),
    };
}
var { Icon, } = require('react-native-icons');

var styles = StyleSheet.create({
    threadContainer: {
        flex: 1,
        marginTop: 42
    },
    threadItem: {
        height: 91,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 7,
        flex: 1,
        flexDirection: 'row'

    },
    threadSeparator: {
        height: 1,
        backgroundColor: '#ddd'
    },
    threadStatus: {
        width: 25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 5

    },
    threadAvatar: {
        height: 60,
        borderRadius: 30,
        width: 60,
        marginTop: 8
    },
    threadDetail: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 5
    },
    threadDetailRow: {
        flexDirection: 'row',
        height: 20,
        paddingLeft: 7,
        paddingRight: 7,
        justifyContent: 'space-between',

    },
    threadLastMessage: {
        flex: 1,
        height: 40,
        paddingLeft: 7,
        paddingRight: 7,
        justifyContent: 'space-between',


    },
    threadLastMessageText: {
        color: '#989A9B'
    },
    threadHour: {
        color: '#989A9B'
    },
    threadTitleText: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    status: {
        height: 14,
        borderRadius: 7,
        width: 14,
        backgroundColor: '#DA413D',
    },

});
var ThreadSection = React.createClass({
    getInitialState: function () {
        return getThreadItems()
    },
    componentWillMount: function () {
        return ThreadStore.addChangeListener(this._onChange)
    },
    _onChange: function () {
        this.setState(getThreadItems())
    },
    _getTreatedThread(rowData){

        var user = UserStore.getUser();
        var iAmTheCreator = rowData.creator.id == user.id && rowData.creator.type == user.type;
        var lastMessage = rowData.messages[rowData.messages.length - 1]
        var lastMessageText = lastMessage["text"];
        var maxLenght = 60;
        if (lastMessageText.length > maxLenght) {
            lastMessageText = lastMessageText.substring(0, maxLenght - 3) + "..."
        }
        return {
            interlocutor: iAmTheCreator ? rowData.recipient.name : rowData.creator.name,
            relationString: iAmTheCreator ? " respondió en " : " preguntó por ",
            listingName: rowData.listing.brand + " " + rowData.listing.model + " " + rowData.listing.year,
            lastMessageCreatedAt: rowData.last_message_created_at,
            lastMessage: lastMessageText,
            showAsNew: (rowData.status == 'PENDING' &&
            (lastMessage.creator_id != UserStore.getUser().id || lastMessage.creator_type != UserStore.getUser().type)),
            avatar: rowData.listing.avatar

        }
    },

    getStatusComponent(showAsNew){
        if (showAsNew) {
            return <View style={styles.status}></View>
        }
    },

    iterateFunction: function (rowData, something, index) {
        var treatedThread = this._getTreatedThread(rowData);
        return (

            <TouchableHighlight onPress={() =>this._goToThread(rowData)} underlayColor="#e5e5e5">

                <View>
                    {<View style={index==0?styles.threadSeparator:{}}></View>}
                    <View style={styles.threadItem}>
                        <View style={styles.threadStatus}>
                            {this.getStatusComponent(treatedThread.showAsNew)}
                        </View>
                        <Image style={styles.threadAvatar} source={{uri: rowData.listing.avatar}}/>
                        <View style={styles.threadDetail}>
                            <View style={styles.threadDetailRow}>
                                <View style={styles.threadTitleText}>
                                    <Text style={{fontSize:15, fontWeight: 'bold'}}>{treatedThread.interlocutor}</Text>
                                    <Text style={{fontSize:14,color: '#666666'}}>{treatedThread.relationString}</Text>
                                </View>
                                <Text style={styles.threadHour}>{treatedThread.lastMessageCreatedAt}</Text>
                            </View>
                            <View style={styles.threadDetailRow}>
                                <View style={styles.threadTitleText}>
                                    <Text
                                        style={{fontSize:15, fontWeight: 'bold',color: '#666666'}}>{treatedThread.listingName} </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.threadHour}>8</Text>

                                </View>
                            </View>
                            <View style={styles.threadLastMessage}>
                                <Text style={styles.threadLastMessageText}>{treatedThread.lastMessage}</Text>
                            </View>


                        </View>
                    </View>
                    <View style={styles.threadSeparator}></View>
                </View>
            </TouchableHighlight>

        )

    },


    render: function () {


        return (


            <ListView style={styles.threadContainer}
                      dataSource={this.state.dataSource}
                      renderRow={this.iterateFunction}
                ></ListView>
        );
    },
    _goToThread(rowData){
        ThreadActions.readThread(rowData.key)
        this.props.navigator.push(
            {id: RouteConstants.THREAD, thread_id: rowData.key})
    }

});
module.exports = ThreadSection;
