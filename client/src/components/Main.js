import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import MediaCard from "./MediaCard.js";
import joinIcon from "../assets/joinIcon.png";
import createIcon from "../assets/createIcon.png";
import Grid from "@material-ui/core/Grid";
//import { Modal } from 'antd';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      createRedirect: false,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  createRoomClick = () => {
    this.setState({ createRedirect: true, visible: false });
  };

  render() {
    if (this.state.joinRedirect) {
      return <Redirect to={{ pathname: "/create" }} />;
    }
    if (this.state.createRedirect) {
      return <Redirect to={{ pathname: "/create" }} />;
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
              <h1>iGraduated</h1>
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
