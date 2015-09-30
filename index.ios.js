// https://github.com/facebook/react-native/issues/846


'use strict';
var React = require('react-native');
var RouteConstants = require('./js/constants/RouteConstants');
var ThreadSection = require('./js/components/ThreadSection');
var Conversation = require('./js/components/Conversation');
var NavigationBar = require('./js/components/NavigationBar');
var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStyles');

var {
    AppRegistry,
    StyleSheet,
    NavigatorIOS,
    View,
    Navigator,
    Text,
    TouchableHighlight
    } = React;

var NavigationBarRouteMapper = {

    LeftButton: function (route, navigator, index, navState) {
        navigator.pop()
        return (
            <TouchableHighlight onPress={() =>navigator.pop()}>
                <Text >
                    {route.id}
                </Text>
            </TouchableHighlight>
        );
    },

    RightButton: function (route, navigator, index, navState) {

        return (
            <VibrancyView blurType="light" style={{ backgroundColor: 'transparent',}}><Text >
                Estamos en la derecha
            </Text></VibrancyView>
        );
    },

    Title: function (route, navigator, index, navState) {
        return (
            <Text>
                Soy un titulo
            </Text>
        );
    },

};

var ChatApp = React.createClass({

    renderScene: function (route, nav) {
        switch (route.id) {
            case RouteConstants.THREAD_LIST:
                return <ThreadSection navigator={nav}> </ThreadSection>;
            case RouteConstants.THREAD:
                return <Conversation navigator={nav} route={route}/>;
            default:
                return <Conversation navigator={nav} route={route}/>;
        }
    },

    render() {
        return (
            <Navigator
                style={styles.appContainer}
                renderScene={(route, nav)=>this.renderScene(route, nav)}
                initialRoute={{ id: RouteConstants.THREAD_LIST, }}
                navigationBar={
          //<Navigator.NavigationBar
          //  routeMapper={NavigationBarRouteMapper}
          //  style={styles.navBar}
          ///>
           <NavigationBar routeMapper={NavigationBarRouteMapper}></NavigationBar>
        }
                />

        );
    }
});

var styles = StyleSheet.create({
    navBar: {
        //backgroundColor: "grey",
        height: 60
    },
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


