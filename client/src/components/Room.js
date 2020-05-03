
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import ml5 from 'ml5';

class Room extends Component {

    componentDidMount(){
        const {
            studentId,
            universityName,
            classOf,
            email,
            roomId,
            name,
            isNewRoom
        } = this.props.location.state;

        const socket = io("http://localhost:5000");
        socket.emit("joinRoom", roomId, name, email, isNewRoom);
    }

    render(){
        console.log(this.props.location.state);
        return (
            <h1>Hello</h1>
        )
    }

}

export default withRouter(Room);