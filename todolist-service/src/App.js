import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Layout, Button } from 'antd';
import config from '../../config.json'

const { Header, Content } = Layout;

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      phase: true,
      todo: "",
      todolist: []
    };
  }

  render() {
    return (
      <div className="App" style={{ margin: "0px" }}>
        {this.state.phase ?
          <div>
            <Layout>
              <Header>
                <div style={{
                  backgroundColor: "#1C72F7",
                  padding: "20px"
                }}>
                  <h1 style={{ color: "#FFFFFFF" }}>TODO Lists</h1>
                </div>
              </Header>
              <Content>
                <div style={{ display: "inline", width: "100%", height: "100%" }}>
                  <h3>Input Username: </h3>
                  <input onChange={e => {
                    this.setState({ username: e.target.value })
                  }}
                    value={this.state.username}></input>
                  <Button onClick={e => {
                    this.setState({ phase: !this.state.phase })
                    let new_user = { username: this.state.username }
                    axios.post(`http://localhost:${config.PORT.USER_SERVICE}/user`, new_user).then(result => {
                      axios.get(`http://localhost:${config.PORT.TODO_MANAGEMENT_SERVICE}/todo?username=${new_user.username}`)
                        .then(result => {
                          this.setState({ todolist: result.data })
                        })
                    })

                  }}>OK</Button>
                </div>
              </Content>
            </Layout>
          </div>
          :
          <div>
            <h1>TODO</h1>
            <input onChange={
              e => this.setState({ todo: e.target.value })
            }
              value={this.state.todo}></input>
            <Button onClick={e => {
              axios.post(`http://localhost:${config.PORT.TODO_MANAGEMENT_SERVICE}/todo`, {
                username: this.state.username,
                todo: this.state.todo
              }).then(result => {
                this.setState({ todolist: result.data })
              })
              this.setState({ todo: "" })
            }}>ADD</Button>
            <ul>
              {this.state.todolist.map((val, idx) => {
                return val.complete ? null :
                  <div>
                    <li key={val.todo}>{val.todo}</li>
                    <Button onClick={e => {
                      axios.post(`http://localhost:${config.PORT.TODO_MANAGEMENT_SERVICE}/change-state`, {
                        username: this.state.username,
                        todo: val.todo
                      }).then(result => {
                        this.setState({ todolist: result.data })
                      })
                    }}>Remove</Button>
                  </div>
              })}
            </ul>
          </div>}
      </div>
    );
  }
}

export default App;
