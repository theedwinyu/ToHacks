
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import ml5 from 'ml5';
import { Button, Row, Col } from 'antd';
import Audio from './Audio';
import Chatroom from './Chatroom';
import Logo from '../assets/logo.png'

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
        this.setState({socket:socket})
        let isFocused = false
        let recieved = false
        socket.emit("joinRoom", roomId, name, email, isNewRoom, universityName, classOf);

        socket.on("shareVideo",(image64)=>{
            let shared = document.getElementById('shared')
            let sharedctx = shared.getContext('2d')
            let img = new Image
            img.onload = () => {
                sharedctx.drawImage(img,0,0)
            }
            img.src = image64
        })

        socket.on("processPersonName",(currName)=>{

            let shared = document.getElementById('shared')
            shared.setAttribute("class","fadeinclass")
            shared.style.animation = 'none'
            setTimeout(()=>{shared.style.animation = ''},100)

            isFocused = (name == currName)
        })
    
        socket.on("playCheer",()=>{
            setTimeout(()=>{
                this.fadeCanvasout()
            },3000)

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

        socket.on("done",()=>{
            //confetti

        })

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

        const options = {
            multiplier:0.50,
            detectionType:"single",
            imageScaleFactor:0.2
        }
        const poseNet = ml5.poseNet(document.getElementById('video'),options, modelLoaded);
        function modelLoaded() {
            // console.log('Model Loaded!');
        }
        poseNet.on('pose', (poses) => {
            if(poses){
                if(isFocused && handsPresent(poses) && !recieved){
                    recieved = true
                    console.log("fuck")
                    socket.emit("getDiploma",roomId)
                    setTimeout(()=>{
                        socket.emit("processPerson",this.props.location.state.roomId)
                    },5000)
                }
            }
        
        });

        let intervalID = window.setInterval(
            ()=>{
                let video = document.getElementById('video')
                let canvas = document.getElementById('canvas')
                let ctx = canvas.getContext('2d')
                let shortside = Math.min(video.videoWidth,video.videoHeight)
                let ydiff = (video.videoHeight - shortside)/2
                let xdiff = (video.videoWidth - shortside)/2
                ctx.drawImage(video,xdiff,ydiff,shortside,shortside,
                    0,0,canvas.width,canvas.height)
                if(isFocused){
                    socket.emit("sendVideoFrames",roomId,canvas.toDataURL())
                }

            },1000/FPS)

        function handsPresent(results){
            let sensitivity = 0.5
            return (results[0].pose.leftWrist.confidence > sensitivity || results[0].pose.rightWrist.confidence > sensitivity)
        }
    
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

    goNext = (socket) => {
        if(socket){
            socket.emit("processPerson",this.props.location.state.roomId)
        }
    }
  
    startGraduation = (socket) => {
        const {
            universityName,
            classOf,
            roomId,
        } = this.props.location.state;
        socket.emit("startGraduation", roomId, universityName, classOf);
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
        const debug = false
        return (
            <div>

                <div className="roomContainer"> 
                    
                    <Row>
                    <Col span={16} style={{marginTop:'10vh'}}>
                        <img src={Logo} style={{width:'30vh', height:'auto' }}></img>
                        <div>
                        <h1 style={{display:'inline-block'}}>{`${universityName} class of ${classOf}`}</h1>
                        {this.props.location.state.isNewRoom ? <h1 style={{display:'inline-block'}}>&nbsp; | RoomID:{this.props.location.state.roomId}</h1>:null}
                        </div>
                        <div className="camBackground">
                            <canvas id="shared" width="300" height="300" style={{opacity:0,borderRadius:150,borderStyle: "solid",borderWidth:15,borderColor:"white"}}></canvas>
                        </div>
                        <video id="video" height="1000" width="1000" autoPlay style={{display:"none"}}></video>
                        {debug ? <button onClick={this.fadeCanvasin}>in</button>:null}
                        {debug ? <button onClick={this.fadeCanvasout}>out</button>:null}
                        {/* {this.props.location.state.isNewRoom ? <button onClick={()=>{this.goNext(this.state.socket)}}>next</button>:null} */}

                        {isNewRoom && <Button key="submit" type="default" onClick={() => this.goNext(this.state.socket)} style={{color:'white', backgroundColor:'#002A52'}}>Next Student</Button>}
                        <canvas id="canvas" width="300" height="300" style={{display:"none"}}></canvas>
                        <audio id="cheerAudio" src={Audio.data}/>
                        
                        <audio id="ttsAudio" src=""/>
                    </Col>
                    <Col span={8} style={{marginTop:'10vh'}}>
                        {socket && <Chatroom name={name} socket={socket} roomId={roomId}/>}

                        {isNewRoom && <Button key="submit" type="default" onClick={() => this.startGraduation(this.state.socket)} style={{color:'white', backgroundColor:'#002A52'}}>Start Graduation</Button>}

                    </Col>     

                    </Row>

                </div>
                
            </div>

        )
    }

}

export default withRouter(Room);