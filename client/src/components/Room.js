
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import ml5 from 'ml5';
import { Button } from 'antd';

class Room extends Component {

    constructor(props){
        super(props);
        this.state = {
            socket: null,
        };
    }

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

    nextStudent = (e) => {
        
    }

    startGraduation = (e) => {

    }

    render(){
        const {
            studentId,
            universityName,
            classOf,
            email,
            roomId,
            name,
            isNewRoom
        } = this.props.location.state;
        console.log(this.props.location.state);
        return (
            <div>
            <h1>Hello</h1>

            <Button key="submit" type="default" onClick={this.startGraduation} style={{color:'white', backgroundColor:'#002A52'}}>
                Start Graduation
            </Button>

            <Button key="submit" type="default" onClick={this.nextStudent} style={{color:'white', backgroundColor:'#002A52'}}>
                Next Student
            </Button>

            </div>
        )
    }

}

export default withRouter(Room);