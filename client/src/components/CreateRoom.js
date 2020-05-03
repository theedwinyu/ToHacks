import React, { Component } from "react";
import "../App.css";
import TextField from "@material-ui/core/TextField";
import { Form, Button } from "antd";
import Logo from "../assets/logo.png";
import { Redirect } from "react-router-dom";
import uniqid from 'uniqid'
import axios from 'axios';


class CreateRoom extends Component {

  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      values: null,
    }
  }

  onFinish = (values) => {
    console.log("Success:", values);
    this.setState({
      redirect: true,
      values,
    });

    const graduationInfo = {
        collegeName: values.universityName,
        creator: values.fullName,
        classOf: values.classOf,
        timeStarted: new Date().toLocaleString()
      };
  
      axios.post("http://localhost:5000/graduations/add", graduationInfo).then((res) => {
        console.log(res);
      });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const {
      redirect,
      values,
    } = this.state;
    if (redirect) {
      const {
        fullName,
        universityName,
        classOf,
      } = values;
      const roomId = uniqid()
      return <Redirect to={{ pathname: "/room", state: { universityName, classOf, name: fullName, roomId, isNewRoom: true } }} />;
    }
    return (
      <div>
        <div className="split left">
          <div className="topleft">
            <img
              src={Logo}
              style={{ marginTop: '2vh', marginLeft: '10vh', width: "30vh", height: 'auto' }}
              alt="Logo"
            />
          </div>
          <div className="centered" style={{marginTop: '10vh'}}>
            <h1 style={{ textAlign: "left", fontSize: 45 }}>
              <b>Let's Plan the Ceremony!</b>
            </h1>
            <h2 style={{ textAlign: "left", fontSize: 18, marginTop: "-2vh" }}>
              Give us some details so we can celebrate the graduates!
            </h2>

            <Form
              style={{ textAlign: "left" }}
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                style = {{marginTop: '3vh'}}
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Please input your full name!",
                  },
                ]}
              >
                <TextField
                  id="standard-basic"
                  label="Full Name"
                  style={{ width: "55vh" }}
                />
              </Form.Item>

              <Form.Item
              style = {{marginTop: '3vh'}}
                name="universityName"
                rules={[
                  {
                    required: true,
                    message: "Please input your university name!",
                  },
                ]}
              >
                <TextField
                  id="standard-basic"
                  label="University"
                  style={{ width: "55vh" }}
                />
              </Form.Item>

              <Form.Item
              style = {{marginTop: '3vh'}}
                name="classOf"
                rules={[
                  {
                    required: true,
                    message: "Please input your class of!",
                  },
                ]}
              >
                <TextField
                  id="standard-basic"
                  label="Class Of"
                  style={{ width: "55vh" }}
                />
              </Form.Item>

              <Form.Item style = {{marginTop: '5vh', textAlign: 'right'}}>
                  
                <Button
                  type="default"
                  htmlType="submit"
                  style={{
                    width: "20vh",
                    color: "white",
                    backgroundColor: "#002A52",
                    height: "7vh",
                    fontSize: 20,
                    borderRadius: '10px'
                  }}
                >
                  I'm All Set!
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="split right"></div>
      </div>
    );
  }
}

export default CreateRoom;
