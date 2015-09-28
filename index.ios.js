// https://github.com/facebook/react-native/issues/846


'use strict';
var React = require('react-native');
var ThreadSection = require('./js/components/ThreadSection');
var {
    AppRegistry,
    StyleSheet,
    NavigatorIOS,
    View
    } = React;

var ThreadsPage = React.createClass({

    render() {
        return (
            <View style={styles.nav}><ThreadSection navigator={this.props.navigator}> </ThreadSection></View>
        );
    }
});


var ChatApp = React.createClass({

    render() {
        return (
            <NavigatorIOS ref="nav"
                          itemWrapperStyle={styles.navWrap}
                          style={styles.nav}
                          navigator={this.props.navigator}
                          initialRoute={{
                            title: "Mensajes",
                            component: ThreadsPage
                          }}/>
        );
    }
});

var styles = StyleSheet.create({
    navWrap: {
        flex: 1,
    },
    nav: {
        flex: 1,
    },
    button: {
        backgroundColor: "#009DDD",
        padding: 10,
        margin: 10,
    },
    buttonText: {
        color: "#fff"
    }
});

AppRegistry.registerComponent('chat_demo_react_native', () => ChatApp);

module.exports = ChatApp;


