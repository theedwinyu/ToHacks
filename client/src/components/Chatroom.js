import React, { Component } from 'react';

import { Button, Input, List, Card, Typography } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Search } = Input;

class Chatroom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: [
                {message: 'I love you.', name:"Bob"},
                {message: 'I also love you.', name:"Joe"},
                {message: 'We are happy.', name:"Sam"},
                {message: 'very happy.', name:"Andy"},
                {message: 'yay us!!!.', name:"Steve"},
            ],
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

    handleSubmit = (message) => {
        console.log(message);
        const {
            socket, 
            name,
            roomId,
        } = this.props;

        socket.emit("chat", roomId, name, message);
        
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
                <h1 style={{color: '#002A52'}}>Card</h1>
                <Card style={{ width: '70vh', height: '80vh', backgroundColor: '#A2BBD5', borderRadius: '10px' }}>
                    <List
                    style={{overflowY:'scroll', height: '60vh', textAlign: 'left'}}
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