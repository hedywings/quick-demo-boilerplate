import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import ioClient from './helpers/ioClient';

import reducer from './redux/reducer';
import clientMiddleware from './redux/clientMiddleware';
import {permitJoining} from './redux/modules/navBar';
import {devIncoming, devStatus, attrsChange} from './redux/modules/cardBlock';
import {notice, requestClose} from './redux/modules/noticeBar';

import NavBar from './components/NavBar/NavBar';
import CardBlock from './components/CardBlock/CardBlock';
import NoticeBar from './components/NoticeBar/NoticeBar';

/*********************************************/
/* client app                                */
/*********************************************/
var store = createStore(reducer, applyMiddleware(clientMiddleware)),
    title = 'ble-shepherd';

ioClient.start('http://' + window.location.hostname + ':3030');

ioClient.on('permitJoining', function (msg) {
    // msg = { timeLeft }
    store.dispatch(permitJoining(msg.timeLeft));
});

ioClient.on('devIncoming', function (msg) {
    // msg =  { dev}
    store.dispatch(devIncoming(msg.dev));  
});

ioClient.on('devStatus', function (msg) {
    // msg = { permAddr, status }
    store.dispatch(devStatus(msg.permAddr, msg.status));
});

ioClient.on('attrsChange', function (msg) {
    // msg = { permAddr, gad } 
    store.dispatch(attrsChange(msg.permAddr, msg.gad));
});

ioClient.on('toast', function (msg) {
    // msg = { msg }
    store.dispatch(notice(true, msg.msg));
});

/*********************************************/
/* App component                             */
/*********************************************/
var App = React.createClass({
    render: function () {
        return (
            <MuiThemeProvider>
                <div>
                    <NavBar title={this.props.title} />
                    <CardBlock />
                    <NoticeBar />
                </div>     
            </MuiThemeProvider>
        );
    }
});

/*********************************************/
/* render                                    */
/*********************************************/
ReactDOM.render(
    <Provider store={store}>
        <App title={title} />
    </Provider>, 
    document.getElementById('root')
);
