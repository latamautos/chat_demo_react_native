/**
 * Created by xavier on 9/27/15.
 */
var React = require('react-native');

var {
    ScrollView,
    Text,
    StyleSheet
    } = React;

var Conversation = React.createClass({
    render(){
        return (
            <ScrollView style={styles.conversationContainer}>
                <Text style={{height: 91}}>
                    Hola como estas miercoles
                </Text>
            </ScrollView>
        )
    }
});
var styles = StyleSheet.create({
    conversationContainer: {
        flex: 1,
    },
    threadItem: {
        height: 91,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 7,
        flex: 1,
        flexDirection: 'row'

    }});
module.exports = Conversation;