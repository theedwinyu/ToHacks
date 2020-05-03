
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import ml5 from 'ml5';
import { Button } from 'antd';

class Room extends Component {
    constructor(props) {

        super(props);
        this.state = {
            socket: null,
            test: null,
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

        const FPS = 10
        const socket = io("http://localhost:5000");
        const isFocused = true
        let recieved = false
        socket.emit("joinRoom", roomId, name, email, isNewRoom);

        socket.on("shareVideo",(image64)=>{
            let shared = document.getElementById('shared')
            let sharedctx = shared.getContext('2d')
            let img = new Image
            img.onload = () => {
                sharedctx.drawImage(img,0,0)
            }
            img.src = image64
        })
    
        socket.on("playCheer",()=>{
            let cheerAudio = document.getElementById('cheerAudio')
            cheerAudio.pause()
            cheerAudio.currentTime = 0
            cheerAudio.play()
        })

        socket.on("tts",(audio)=>{
            let ttsAudio = document.getElementById('ttsAudio')
            ttsAudio.pause()
            ttsAudio.currentTime = 0
            const blob = new Blob([audio], { type: "audio/wav" });
            const url = window.URL.createObjectURL(blob);
            ttsAudio.src = url;
            ttsAudio.play()
        })

        const poseNet = ml5.poseNet(()=>{console.log("ready!")});

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                let video = document.getElementById('video')
                video.srcObject = stream;
                video.play();
                })
                .catch(function (error) {
                console.log(error);
            });
        }

        let intervalID = window.setInterval(
            ()=>{
                console.log(this.state.test)
                let video = document.getElementById('video')
                let canvas = document.getElementById('canvas')
                let ctx = canvas.getContext('2d')
                let shortside = Math.min(video.videoWidth,video.videoHeight)
                let ydiff = (video.videoHeight - shortside)/2
                let xdiff = (video.videoWidth - shortside)/2
                ctx.drawImage(video,xdiff,ydiff,shortside,shortside,
                    0,0,canvas.width,canvas.height)
                
                socket.emit("sendVideoFrames",roomId,canvas.toDataURL())
                poseNet.singlePose(canvas)
                .then(results => {
                    if(isFocused && handsPresent(results) && !recieved){
                        recieved = true
                        console.log("fuck")
                        socket.emit("getDiploma",roomId)
                        this.setState({test:"fuck"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            },1000/FPS)

        function handsPresent(results){
            return (results[0].pose.leftWrist.confidence > 0.6 || results[0].pose.rightWrist.confidence > 0.6)
        }
        

    
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

            <video id="video" height="1000" width="1000" autoPlay style={{display:"none"}}></video>
            <canvas id="canvas" width="250" height="250" style={{display:"none"}}></canvas>
            <canvas id="shared" width="250" height="250"></canvas>
            <audio id="cheerAudio" src=""/>
            <audio id="ttsAudio" src=""/>
            </div>

        )
    }

}

export default withRouter(Room);