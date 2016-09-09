import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Snackbar from 'material-ui/Snackbar';

import {notice, requestClose} from '../../redux/modules/noticeBar';

var Notice = React.createClass({
    propTypes: {
        open: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired
    },

    handleRequestClose: function () {
        this.props.requestClose();
    },

    render: function () {
        return (
            <div>
                <Snackbar
                    open={this.props.open}
                    message={this.props.message}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                    bodyStyle={{fontFamily: 'Lato'}}
                />
            </div>
        );
    }
});

function mapStateToProps (state) {
    return { 
        open: state.noticeBar.open,
        message: state.noticeBar.message,
    };
}

export default connect(
    mapStateToProps , 
    {notice, requestClose}
)(Notice)
