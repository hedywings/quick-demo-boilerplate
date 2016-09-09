import React from 'react';
import FireIcon from '../Icons/FireIcon'

var csshake = require('../../styles/csshake.css');

var fgColor = "#FFF",
    bgColor = '#E55934',
    fgColorDisabled = "#EEEEEE",
    bgColorDisabled = "#BDBDBD",
    fgColorOn = "#FF7C80",
    fgColorOff = "#FFF";

const Flame = ({ enable, triggered, onClick }) => {
    enable = !!enable;
    triggered = !!triggered;
    onClick = onClick || function () {
        console.log('Flame clicked');
    };

    let cardBgColor = enable ? bgColor : bgColorDisabled;
    let cardFgColor = enable ? (triggered ? fgColorOn : fgColorOff) : fgColorDisabled;
    
    let reallyTriggered = enable && triggered;
    let icon = reallyTriggered ? <FireIcon fill={cardFgColor} /> : <FireIcon fill={cardFgColor} />;
    let shakeClass = reallyTriggered ? (csshake['shake-opacity'] + ' ' + csshake['shake-constant'] + ' ' + csshake['shake-constant--hover']) : '';

    return (
        <div className={shakeClass} style={{width: '100%', height: '100%', backgroundColor: cardBgColor}} onClick={onClick}>
            {icon}
        </div>
    );

}

// Flame.propTypes = {
//     enable: PropTypes.bool.isRequired,
//     triggered: PropTypes.bool.isRequired,
// //    onClick    // optional
// };

export default Flame

