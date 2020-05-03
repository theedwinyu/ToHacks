
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import ml5 from 'ml5';
import { Button } from 'antd';
import Audio from './Audio';
import Chatroom from './Chatroom';

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

        const FPS = 15
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

        // if (navigator.mediaDevices.getUserMedia) {
        //     navigator.mediaDevices.getUserMedia({ video: true })
        //         .then(function (stream) {
        //         let video = document.getElementById('video')
        //         video.srcObject = stream;
        //         video.play();
        //         })
        //         .catch(function (error) {
        //         console.log(error);
        //     });
        // }

        
        // const poseNet = ml5.poseNet(document.getElementById('video'),"single", modelLoaded);
        // function modelLoaded() {
        //     // console.log('Model Loaded!');
        // }
        // poseNet.on('pose', (poses) => {
        //     if(poses){
        //         if(isFocused && handsPresent(poses) && !recieved){
        //             recieved = true
        //             console.log("fuck")
        //             socket.emit("getDiploma",roomId)
        //             this.setState({test:"fuck"})
        //         }
        //     }
        
        // });

        // let intervalID = window.setInterval(
        //     ()=>{
        //         let video = document.getElementById('video')
        //         let canvas = document.getElementById('canvas')
        //         let ctx = canvas.getContext('2d')
        //         let shortside = Math.min(video.videoWidth,video.videoHeight)
        //         let ydiff = (video.videoHeight - shortside)/2
        //         let xdiff = (video.videoWidth - shortside)/2
        //         ctx.drawImage(video,xdiff,ydiff,shortside,shortside,
        //             0,0,canvas.width,canvas.height)
                
        //         socket.emit("sendVideoFrames",roomId,canvas.toDataURL())

        //     },1000/FPS)

        // function handsPresent(results){
        //     let sensitivity = 0.4
        //     return (results[0].pose.leftWrist.confidence > sensitivity || results[0].pose.rightWrist.confidence > sensitivity)
        // }
    
        this.setState({
            socket,
        })
    }

    fadeCanvasin(){
        console.log("askjdhbakjsdh")
        let shared = document.getElementById('shared')
        shared.setAttribute("class","fadeinclass")
        shared.style.animation = 'none'
        setTimeout(()=>{shared.style.animation = ''},100)
    }

    fadeCanvasout(){
        console.log("askjdhbakjsdh")
        let shared = document.getElementById('shared')
        shared.setAttribute("class","fadeoutclass")
        shared.style.animation = 'none'
        setTimeout(()=>{shared.style.animation = ''},100)
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
        const {
            socket
        } = this.state;
        console.log(this.props.location.state);
        return (
            <div>
                <h1>Hello</h1>
                {/* <video id="video" height="1000" width="1000" autoPlay style={{display:"none"}}></video>
                <button onClick={this.fadeCanvasin}>in</button>
                <button onClick={this.fadeCanvasout}>out</button>
                <canvas id="canvas" width="250" height="250" style={{display:"none"}}></canvas>
                <canvas id="shared" width="250" height="250" style={{borderRadius:175,borderStyle: "double",borderWidth:15}}></canvas>
                <audio id="cheerAudio" src={Audio.data}/>
                <audio id="ttsAudio" src=""/> */}
                {socket && <Chatroom name={name} socket={socket} roomId={roomId}/>}

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