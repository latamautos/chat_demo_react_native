/**
 * Created by xavier on 9/27/15.
 */
var React = require('react-native');
var ThreadActions = require('../actions/ThreadActions');
var ThreadStore = require('../stores/thread-store');
var UserStore = require('../stores/user-store');
var VibrancyView = require('react-native-blur').BlurView;

var {
    ScrollView,
    Text,
    StyleSheet,
    View,
    TextInput,
    ListView,
    TouchableHighlight,
    Image
    } = React;
function getConversationItems(thread_id) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var thread = ThreadStore.getThread(thread_id)
    return {
        text: "",
        dataSource: ds.cloneWithRows(Object.keys(thread.messages).map(function (key) {
            return thread.messages[key]
        })),
        messages: Object.keys(thread.messages).map(function (key) {
            return thread.messages[key]
        })
    };
}
var Conversation = React.createClass({

    getInitialState: function () {
        return getConversationItems(this.props.route.thread_id)
    },
    componentWillMount: function () {
        return ThreadStore.addChangeListener(this._onChange)
    },
    _onChange: function () {
        this.setState(getConversationItems(this.props.route.thread_id))
    },
    iterateFunction: function (rowData, something, index) {
        console.log(rowData);
        return (<Text style={{color: "#fff", alignSelf: 'flex-end'}}>{rowData.text}</Text>)
    },
    render(){


        var messageViews = this.state.messages.map(function (message) {
            var isMyMessage = message.creator_id == UserStore.getUser().id && message.creator_type == UserStore.getUser().type
            return (<View style={{alignSelf:isMyMessage?'flex-end':'flex-start', margin:3,
            padding:8, borderRadius:15, backgroundColor: isMyMessage?'#B03230':'#E5E5EA',
            marginHorizontal: 12}}>
                <Text style={{ color:isMyMessage?'#fff':'#222', fontSize:15}}>
                    {message.text}
                </Text>
            </View>)
        })
        return (
            /*
             <ListView style={{marginTop: 50, flex: 1, flexDirection:'column'}}
             dataSource={this.state.dataSource}
             renderRow={this.iterateFunction}
             ></ListView>
             */

            <Image
                source={{uri: 'https://fd-files-production.s3.amazonaws.com/private/105043/108212/UwUFNd4o0PVSvca2K1Pqkg?X-Amz-Expires=300&X-Amz-Date=20150930T162101Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIA2QBI5WP5HA3ZEA/20150930/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=21c315e3d8be2a8a7cb55234616574187a6ecf3ff3855a607fcf65d7be468e40'}}
                style={styles.imageContainer}>
                <View style={{   bottom: 65,width: 377,
                    position: 'absolute'}}>
                    {messageViews}
                </View>

                <View blurType="xlight" style={
                                      {
                                        flexDirection: 'row', height:50, position: 'absolute',
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                         padding: 9,
                                        backgroundColor: '#eee',
                                     }}>

                    <TextInput
                        style={{height: 35, width: 280, borderColor: '#dddddd', borderWidth: 1,
                        borderRadius: 7, paddingLeft: 10, backgroundColor: '#fff', color: '#999'}}
                        value={this.state.text}
                        onChangeText={(text) => this.setState({text:text})}
                        />
                    <TouchableHighlight
                        onPress={this._addMessageToThread}
                        underlayColor="#e5e5e5"
                        style={{paddingHorizontal: 14, paddingVertical: 5}}>
                        <Text style={{fontSize: 20, color: "#1E79FA"}}>Enviar</Text>
                    </TouchableHighlight>

                </View>
            </Image>

        )
    },
    _addMessageToThread(){
        if (this.state.text.trim().length > 0) {
            ThreadActions.addMessageToThread(this.props.route.thread_id, this.state.text.trim());
            this.setState({text: ""})
        }

    }
});
var styles = StyleSheet.create({

    imageContainer: {
        flex: 1,
        // remove width and height to override fixed static size
        // make the background transparent so you actually see the image
        backgroundColor: 'transparent',
    }
});
module.exports = Conversation;