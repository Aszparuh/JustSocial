import React, { Component } from 'react';
import decode from 'jsonwebtoken';
import axios from "axios";
import './App.css';

/* Once the 'Authservice' and 'withAuth' componenets are created, import them into App.js */
import AuthHelperMethods from './components/AuthHelperMethods';

//Our higher order component
import withAuth from './components/withAuth';
const AppNav = () => (
  <nav class="navbar navbar-dark bg-dark">
    <a role="button" class="btn btn-outline-info navbar-btn" href="/logout">Logout</a>
  </nav>
);

const Card = ({ item, handleSubmit, handleEdit, handleDelete, handleCancel }) => {
  const { title, content, editMode } = item;

  if (editMode) {
    return (
      <div class="card mt-4" Style="width: 100%;">
        <div class="card-body">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={item.id} />
            <div class="input-group input-group-sm mb-3">
              <input type="text" name="title" class="form-control" placeholder="Title" defaultValue={title} />
            </div>
            <div class="input-group input-group-sm mb-3">
              <textarea name="content" class="form-control" placeholder="Content" defaultValue={content}></textarea>
            </div>
            <button type="button" class="btn btn-outline-secondary btn-sm" onClick={handleCancel}>Cancel</button>
            <button type="submit" class="btn btn-info btn-sm ml-2">Save</button>
          </form>
        </div>
      </div>
    )
  } else {
    return (
      <div class="card mt-4" Style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">{title || "No Title"}</h5>
          <p class="card-text">{content || "No Content"}</p>
          <button type="button" class="btn btn-outline-danger btn-sm" onClick={handleDelete}>Delete</button>
          <button type="submit" class="btn btn-info btn-sm ml-2" onClick={handleEdit}>Edit</button>
        </div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  state = {
    username: ''
  }
  /* Create a new instance of the 'AuthHelperMethods' compoenent*/
  Auth = new AuthHelperMethods();

  _handleLogout = () => {
    this.Auth.logout()
    this.props.history.push('/login');
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = async () => {
    const headers = new Headers();
    headers.append('Accept','application/json');
    headers.append('Content-Type', 'application/json');

    console.log(this.loggedIn());
    if (this.loggedIn()) {

      headers.append('Authorization', 'Bearer ' + this.getToken());
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.getToken();
    }
    console.log(headers);
    //const response = await fetch('http://localhost:3001/v1/api/posts', headers);

    axios.get("http://localhost:3001/v1/api/posts")
    .then(result => console.log(result));
            
    //const data = await response.json();
    // data.forEach(item => item.editMode = false);
    //this.setState({ data })
  }

  loggedIn = () => {
    const token = this.getToken()
    return !!token && !this.isTokenExpired(token)
  }

  getToken = () => {
    console.log(localStorage.getItem('id_token'));
    return localStorage.getItem('id_token')
  }

  isTokenExpired = (token) => {
    try {
        const decoded = decode.verify(token, 'somesecret');
        if (decoded.expiresIn > Date.now()) { 
            return true;
        }
        else
            return false;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
  addNewPost = () => {
    const data = this.state.data;
    data.unshift({
      editMode: true,
      title: "",
      content: ""
    })
    this.setState({ data })
  }

  handleCancel = async () => {
    await this.getPosts();
  }

  handleEdit = (postId) => {
    const data = this.state.data.map((item) => {
      if (item.id === postId) {
        item.editMode = true;
      }
      return item;
    });
    this.setState({ data });
  }

  handleDelete = async (postId) => {
    await fetch(`/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });
    await this.getPosts();
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const body = JSON.stringify({
      title: data.get('title'),
      content: data.get('content'),
    });

    const headers = {
      'content-type': 'application/json',
      accept: 'application/json',
    };

    if (data.get('id')) {
      await fetch(`/posts/${data.get('id')}`, {
        method: 'PUT',
        headers,
        body,
      });
    } else {
      await fetch('/posts', {
        method: 'POST',
        headers,
        body,
      });
    }
    await this.getPosts();
  }

  render() {
    let name = null;
    if (this.props.confirm) {
      name = this.props.confirm.username;
    }
    //let name = this.props.confirm.username;
    console.log("Rendering Appjs!")
    return (

      <div className="App">
        <div>
          <AppNav />
          <button type="button" class="mt-4 mb-2 btn btn-primary btn-sm float-right" onClick={this.addNewPost}>
            Add New Post
               </button>
          {
            this.state.data.length > 0 ? (
              this.state.data.map(item =>
                <Card item={item}
                  handleSubmit={this.handleSubmit}
                  handleEdit={this.handleEdit.bind(this, item.id)}
                  handleDelete={this.handleDelete.bind(this, item.id)}
                  handleCancel={this.handleCancel}
                />)
            ) : (
                <div class="card mt-5 col-sm">
                  <div class="card-body">You don't have any posts. Use the "Add New Post" button to add some new posts!</div>
                </div>
              )
          }
        </div >
        <div className="App">
          <div className="main-page">
            <div className="top-section">
              <h1>Welcome, {name}</h1>
            </div>
            <div className="bottom-section">
              <button onClick={this._handleLogout}>LOGOUT</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(App);
