import React, { Component } from "react";
import "../App.css";
import TextField from "@material-ui/core/TextField";
import { Form, Button } from "antd";
import Logo from "../assets/logo.png";

class CreateRoom extends Component {
  onFinish = (values) => {
    console.log("Success:", values);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
      <body>
        <div class="split left">
          <div class="topleft">
            <img
              src={Logo}
              style={{ width: "22vh", height: "7vh" }}
              alt="Logo"
            />
            ;
          </div>
          <div class="centered">
            <h1 style={{ textAlign: "left", fontSize: 45 }}>
              <b>Let's Plan the Ceremony!</b>
            </h1>
            <h2 style={{ textAlign: "left", fontSize: 18, marginTop: "-2vh" }}>
              Give us some details so we can celebrate the graduates
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
                  I'am All Set!
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div class="split right"></div>
      </body>
    );
  }
}

export default CreateRoom;
