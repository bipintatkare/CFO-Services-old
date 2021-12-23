import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logoutUser } from '../../store/actions';

class Logout extends Component {
    /**
     * Redirect to login
     */
    componentDidMount = () => {
        // emit the event
        //  this.props.logoutUser(this.props.history);
        fetch(process.env.REACT_APP_BASEURL_BACKEND + '/api/v1/logout')
            .then(response => {
                console.log(response);
                localStorage.removeItem("authUser");                
                this.props.history.push("/login")
            })
            .catch(err => {
                console.log(err)
            })
    };

    render() {
        return <React.Fragment></React.Fragment>;
    }
}

export default withRouter(
    Logout
);
