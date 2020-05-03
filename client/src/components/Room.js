
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import ml5 from 'ml5';

class Room extends Component {

    componentDidMount(){
        const {
            studentId,
            email,
            roomId,
            name,
            isNewRoom
        } = this.props.location.state;
    }

    render(){
        console.log(this.props.location.state);
        return (
            <h1>Hello</h1>
        )
    }

}

export default withRouter(Room);