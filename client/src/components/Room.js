
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import ml5 from 'ml5';
import { Button, Row, Col } from 'antd';
import Audio from './Audio';
import Chatroom from './Chatroom';
import Logo from '../assets/logo.png'
import Diploma from '../assets/diploma_1.png'
import Confetti from 'react-confetti'

class Room extends Component {
    constructor(props) {

        super(props);
        this.state = {
            socket: null,
            test: null,
            universityName: this.props.location.state.universityName,
            classOf: this.props.location.state.classOf,
            done: false
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

        socket.on('roomInfo',(univname,classo)=>{
            console.log(univname,classo)
            this.setState({
                universityName:univname,
                classOf:classo
            })
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

            let diplo = document.getElementById('diploma')
            diplo.setAttribute("class","diplomafly")
            diplo.style.animation = 'none'
            setTimeout(()=>{diplo.style.animation = ''},100)



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
            this.setState({done:true})

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
            console.log(results)
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
                {this.state.done ? <Confetti width={window.innerWidth} height={window.innerHeight}/>:null}
                <div className="roomContainer"> 
                    
                    <Row>
                    <Col span={16}>
                        <div>
                        <img src={Logo} style={{width:'40vh', height:'auto',display:'inline-block' }} />
                        {isNewRoom && <Button key="submit" type="default" onClick={() => this.startGraduation(this.state.socket)} style={{color:'white', backgroundColor:'#002A52', display:'inline-block', marginLeft:'20vh'}}>Start Graduation</Button>}
                        {isNewRoom && <Button key="submit" type="default" onClick={() => this.goNext(this.state.socket)} style={{color:'white', backgroundColor:'#002A52', display:'inline-block'}}>Next Student</Button>}
                        </div>
                        <div>
                        <h1 style={{display:'inline-block'}}>{`${this.state.universityName} class of ${this.state.classOf}`}</h1>
                        {this.props.location.state.isNewRoom ? <h1 style={{display:'inline-block'}}>&nbsp; | RoomID:{this.props.location.state.roomId}</h1>:null}
                        </div>
                        <div className="camBackground">
                            <canvas id="shared" width="400" height="400" style={{opacity:0,borderRadius:200,borderStyle: "solid",borderWidth:15,borderColor:"white"}}></canvas>
                            <img src={Diploma} id="diploma" style={{width:60, height:'auto', opacity:0}}></img>
                        </div>
                        <video id="video" height="1000" width="1000" autoPlay style={{display:"none"}}></video>
                        {debug ? <button onClick={this.fadeCanvasin}>in</button>:null}
                        {debug ? <button onClick={this.fadeCanvasout}>out</button>:null}
                        
                        <canvas id="canvas" width="400" height="400" style={{display:"none"}}></canvas>
                        <audio id="cheerAudio" src={Audio.data}/>
                        
                        <audio id="ttsAudio" src=""/>
                    </Col>
                    <Col span={8} style={{marginTop:'12vh'}}>
                        <div>
                            <h1 style={{color: '#002A52', display:'inline-block'}}>Chat&nbsp;&nbsp;</h1>
                        </div>
                        {socket && <Chatroom name={name} socket={socket} roomId={roomId}/>}
                    </Col>     

                    </Row>

                </div>
                
            </div>

        )
    }

}

export default withRouter(Room);