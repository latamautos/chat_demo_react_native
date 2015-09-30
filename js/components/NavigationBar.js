/**
 * Created by xavier on 9/28/15.
 */
var React = require('react-native');
var VibrancyView = require('react-native-blur').BlurView;
var ThreadStore = require('../stores/thread-store');
var UserStore = require('../stores/user-store');
var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStyles');
var RouteConstants = require('../constants/RouteConstants');
var {
    Text,
    View,
    StyleSheet,
    TouchableHighlight
    } = React;

var NavigationBar = React.createClass({

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
    render(){
        var route = this.props.navState.routeStack[this.props.navState.routeStack.length - 1]
        var isMain = route.id == RouteConstants.THREAD_LIST
        var treatedThread = {}
        if (!isMain) {
            treatedThread = this._getTreatedThread(ThreadStore.getThread(route.thread_id));
        }

        return (<VibrancyView blurType="light" style={styles.navBar}>
            <View style={{width:50}}>
                {isMain ? <View></View> :
                    <TouchableHighlight onPress={() =>this.props.navigator.pop()} underlayColor="#e5e5e5">
                        <Text style={{fontSize: 18, paddingTop:5, color:"#eee"}}>
                            Atras
                        </Text>
                    </TouchableHighlight> }
            </View>
            <View style={{alignItems: 'center',marginHorizontal: 20}}>
                <Text style={{fontSize: 18, color: isMain?'#222':'#eee',alignItems: 'center',paddingTop:isMain?10:0}}>
                    {isMain ? "Mensajes" : treatedThread.interlocutor
                    }
                </Text>
                {isMain ? <View style={{alignItems: 'center',}}></View> : <Text style={{alignItems: 'center',}}>{treatedThread.listingName}</Text>}
            </View>
            <View style={{width:50}}>
                <Text >
                </Text>
            </View>
        </VibrancyView>)

    }

})
var styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        height: 60,
        top: 4,
        left: 0,
        right: 0,
        marginTop: -4,
        paddingTop: 20,
        flex: 1,
        flexDirection: 'row',
        fontSize: 18,
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
    }

});
module.exports = NavigationBar;