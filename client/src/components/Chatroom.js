import React, { Component } from 'react';

import { Button, Input, List, Card, Typography, message } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;
const { Search } = Input;

class Chatroom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
        }
    }

    componentDidMount() {
        const {
            socket,
        } = this.props;
        
        const myName = this.props.name;

        socket.on("newMessage", (name, message) => {
            // if(name !== myName){
            this.setState({
                comments: [...this.state.comments, {name, message}]
            })
            // }  
        })

    }

    handleSubmit = (text) => {
        console.log(text);
        const {
            socket, 
            name,
            roomId,
        } = this.props;

        socket.emit("chat", roomId, name, text);

        axios.get(`/api/googleLanguage?text=${text}`, ).then((res) => {
            
            const score = res.data.score;
            console.log(score);
            if(score < 0) {
                message.error(`Sentiment score too low (${score}), please send a more positive message =D`, 1.5);
            }
        });
        
        // this.setState({
        //     comments: [...this.state.comments, {name, message}]
        // })
    }

    render() {
    
        const {
            name,
        } = this.props;
        return (
            <div>
                <Card style={{ width: '50vh', height: '57vh', backgroundColor: '#A2BBD5', borderRadius: '10px' }}>
                    <List
                    style={{overflowY:'scroll', height: '45vh', textAlign: 'left'}}
                    split={false}
                    bordered
                    dataSource={this.state.comments}
                    renderItem={item => (
                        <List.Item>
                        <Text code>{item.name}:</Text> {item.message}
                        </List.Item>
                    )}
                    />
                    <br/>
                    <Search
                        prefix={<b>{name}</b>}
                        placeholder="Type a message"
                        enterButton="Send"
                        onSearch={value => this.handleSubmit(value)}
                    />
                </Card>
            </div>
            
        )
    }
    
}

export default Chatroom;