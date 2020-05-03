import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import MediaCard from "./MediaCard.js";
import joinIcon from "../assets/joinIcon.png";
import createIcon from "../assets/createIcon.png";
import Grid from "@material-ui/core/Grid";
import { Modal, Row, Col, Button } from 'antd';
import TextField from '@material-ui/core/TextField';
import Logo from '../assets/logo.png';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      createRedirect: false,
      visible: false,
      roomId: '',
      name: '',
      studentId: '',
      email: '',
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(this.state);

    this.setState({
      visible: false,
      joinRedirect: true,
      createRedirect: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  roomIdOnChange = (e) => {
    // console.log(`Room Id change: ${e.target.value}`);
    this.setState({
      roomId: e.target.value,
    })
  }

  nameOnChange = (e) => {
    // console.log(`Name change: ${e.target.value}`);
    this.setState({
      name: e.target.value,
    })
  }

  studentIdOnChange = (e) => {
    // console.log(`Student Id change: ${e.target.value}`);
    this.setState({
      studentId: e.target.value,
    })
  }

  emailOnChange = (e) => {
    // console.log(`Email Address change: ${e.target.value}`);
    this.setState({
      email: e.target.value,
    })
  }

  createRoomClick = () => {
    this.setState({ createRedirect: true, visible: false });
  };

  render() {
    const {
      studentId,
      name,
      roomId,
      email
    } = this.state;

    if (this.state.joinRedirect) {
      return <Redirect to={{ pathname: "/room", state: { studentId, name, roomId, email, isNewRoom: false } }} />;
    }
    if (this.state.createRedirect) {
      return <Redirect to={{ pathname: "/createRoom" }} />;
    }

    return (
      <div>
        <Grid
          container
          spacing={10}
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid style = {{textAlign: 'left'}} item xs={4}>
            <div>
              <img src={Logo} style={{width:'50vh', height:'auto'}}/>
              {/* <h1>iGraduated</h1> */}
              <p>
                A virtual graduation to celebrate students who have successfully
                met the academic and extracurricular requirements for
                graduation. This celebration with family, friends, and
                close-ones demonstrates their hard work being recognized and
                valued.
              </p>
            </div>
          </Grid>
          <Grid item xs={3}>
            <MediaCard
              image={joinIcon}
              title={"Join a Ceremony"}
              subText={"Student, Family, Friends"}
              action = {this.showModal}
            />
            <Modal
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="submit" type="default" onClick={this.handleOk} style={{color:'white', backgroundColor:'#002A52'}}>
                    Join Room!
                </Button>,
              ]}
            >
              <Row>
                <Col span={12}>
                  <h2>Let's Get Your Diploma</h2>
                  <p>Give us some details so you can *virtually* throw your cap in the air!</p>
                  <p></p>
                  <TextField id="standard-basic" label="Room ID" onChange={this.roomIdOnChange}/>
                  <p></p>
                  <TextField id="standard-basic" label="Full Name" onChange={this.nameOnChange}/>
                  <p></p>
                  <TextField id="standard-basic" label="Student ID" onChange={this.studentIdOnChange}/>
                  <p></p>
                  <TextField id="standard-basic" label="Email Address" onChange={this.emailOnChange}/>
                </Col>
                <Col span={12} className="joinRoom-background"/>
              </Row>
              
            </Modal>
          </Grid>
          <Grid item xs={3}>
            <MediaCard
              image={createIcon}
              title={"Create a Ceremony"}
              subText={"School Faculty"}
              action = {this.createRoomClick}
            />
          </Grid>
        </Grid>
        
        {/* <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal> */}

      </div>
    );
  }
}

export default Main;
