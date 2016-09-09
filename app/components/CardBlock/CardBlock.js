import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import GridLayout from 'react-grid-layout';
import {WidthProvider} from 'react-grid-layout';

import {getDevs, write} from '../../redux/modules/cardBlock';

import {Light, Buzzer, Flame, Pir, Switch, Temperature, 
        Humidity, Illuminance , Weather} from '../Card/Card';

var ReactGridLayout = WidthProvider(GridLayout);

var keyCounter,
    layoutDataGrids;

var CardBlock = React.createClass({
    propTypes: {
        getDevs: PropTypes.func.isRequired
    },
    
    componentDidMount: function () {
        this.props.getDevs();
    },

    getKeyAndDataGrid: function (type) {
        var cardProps = {
            key: null,
            dataGrid: null
        };

        switch (type) {
            case 'Light':
            case 'Buzzer':
            case 'Flame':
            case 'Pir':
            case 'Switch':
                cardProps.key = 'smallCard' + keyCounter.small;
                keyCounter.small += 1;

                if (layoutDataGrids.smallCard.length > 0) 
                    cardProps.dataGrid = layoutDataGrids.smallCard.splice(-(layoutDataGrids.smallCard.length), 1)[0];
                else 
                    cardProps.dataGrid = {x: Math.floor(Math.random() * 5) + 3, y: 4, w: 1, h: 2};
                break;

            case 'Temperature':
            case 'Humidity':
            case 'Illuminance':
                cardProps.key = 'bigCard' + keyCounter.big;
                keyCounter.big += 1;

                if (layoutDataGrids.bigCard.length > 0) 
                    cardProps.dataGrid = layoutDataGrids.bigCard.splice(-(layoutDataGrids.bigCard.length), 1)[0];
                else 
                    cardProps.dataGrid = {x: Math.floor(Math.random() * 5) + 3, y: 4, w: 2, h: 2};
                break;

            default:
                break;
        }

        return cardProps;
    },

    onClickCallback: function (permAddr, auxId, value) {
        var self = this;

        return function () {
            self.props.write(permAddr, auxId, !value);
        };
    },

    getCard: function (type, permAddr, status, auxId, value) {
        var card,
            enable = false,
            cardProps = this.getKeyAndDataGrid(type);

        if (status === 'online') {
            enable = true;
        }

        switch (type) {
            case 'Light':
                card = (<Light enable={enable} onOff={value} onClick={this.onClickCallback(permAddr, auxId, value)} />);
                break;
            case 'Buzzer':
                card = (<Buzzer enable={enable} onOff={value} onClick={this.onClickCallback(permAddr, auxId, value)} />);
                break;
            case 'Flame':
                card = (<Flame enable={enable} triggered={value} />);
                break;
            case 'Pir':
                card = (<Pir enable={enable} triggered={value} />);
                break;
            case 'Switch':
                card = (<Switch enable={enable} onOff={value} />);
                break;
            case 'Temperature':
                card = (<Temperature enable={enable} temp={value} />);
                break;
            case 'Humidity':
                card = (<Humidity enable={enable} humid={value} />);
                break;
            case 'Illuminance':
                card = (<Illuminance enable={enable} lux={value} />);
                break;
            default:
                break;
        }

        return (
            <div key={cardProps.key} data-grid={cardProps.dataGrid}>
                {card}
            </div>
        );
    },

    getRowHeight: function () {
        var rowHeight;

        if (window.matchMedia("(min-width: 1800px)").matches) {
            rowHeight = 70;
        } else if (window.matchMedia("(min-width: 1400px)").matches) {
            rowHeight = 60;
        } else if (window.matchMedia("(min-width: 1000px)").matches) {
            rowHeight = 45;
        } else if (window.matchMedia("(min-width: 600px)").matches) {
            rowHeight = 35;
        } else {
            rowHeight = 20;
        }

        return rowHeight;
    },

    render: function () {
        var allGadRender = [],
            rowHeight = this.getRowHeight();

        keyCounter = {
            small: 0,
            big: 0
        };

        layoutDataGrids = {
            smallCard: [
                {x: 7, y: 2, w: 1, h: 2},
                {x: 5, y: 0, w: 1, h: 2},
                {x: 6, y: 2, w: 1, h: 2},
                {x: 5, y: 1, w: 1, h: 2},
                {x: 5, y: 2, w: 1, h: 2}
            ],
            bigCard: [
                {x: 3, y: 0, w: 2, h: 2},
                {x: 3, y: 2, w: 2, h: 2},
                {x: 3, y: 1, w: 2, h: 2}
            ]
        };

        for (var permAddr in this.props.devs) {
            for (var auxId in this.props.devs[permAddr].gads) {
                var type = this.props.devs[permAddr].gads[auxId].type,
                    status = this.props.devs[permAddr].status,
                    value = this.props.devs[permAddr].gads[auxId].value,
                    card = this.getCard(type, permAddr, status, auxId, value);

                allGadRender.push(card);
            }
        }

        allGadRender.push(
            <div key='Weather' data-grid={{x: 6, y: 0, w: 2, h: 4}}>
                <Weather />
            </div>
        );

        return (
            <div style={{margin:'1% 0%'}}>
                <ReactGridLayout rowHeight={rowHeight} isDraggable={false}>
                    {allGadRender}
                </ReactGridLayout>
            </div>
        );
    }
});
                    
function mapStateToProps (state) {
    return { 
        devs: state.cardBlock.devs 
    };
}

export default connect(
    mapStateToProps, 
    {getDevs, write}
)(CardBlock)
