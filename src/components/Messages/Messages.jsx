import React, { Component } from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import firebase from '../../firebase'
import Message from './Message'
import { connect } from 'react-redux'
import { setUserPosts } from '../../actions'
import MessagesLoader from './MessagesLoader'


class Messages extends Component {

  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref('privateMessages'),
    isMessagesLoading: true
  }


  componentDidMount(){
    const { channel, user } = this.state

    if(channel && user){
      this.addListeners(channel.id)
    }
    
  }

  addListeners = channelId => {
    this.addMessageListener(channelId)
  }

  addMessageListener = channelId => {
    let loadedMessages = []
    const ref = this.getMessagesRef()
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val())
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      })
      this.countUniqueUsers(loadedMessages)
      this.countUserPosts(loadedMessages)
      this.setState({ isMessagesLoading: false })
    })
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if(!acc.includes(message.user.name)){
        acc.push(message.user.name)
      }
      return acc
    }, [])
    const plural = uniqueUsers.length === 0 || uniqueUsers.length === 1
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? '' : 's'}`
    this.setState({
      numUniqueUsers
    })
  }

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if(message.user.name in acc){
        acc[message.user.name].count += 1  
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc
    }, {})
    this.props.setUserPosts(userPosts)
  }

  displayMessages = messages => {
    return (
      messages.length > 0 && messages.map(message => (
        <Message 
          key = { message.timestamp }
          message = { message }
          user = { this.state.user }
        />
      ))
    )
  }

  displayChannelName = channel => {
    return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''
  }

  handleSearchChange = event => {
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages() )
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages]
    const regex = new RegExp(this.state.searchTerm, 'gi')
    const searchResults = channelMessages.reduce((acc, message) => {
      if(message.content && (message.content.match(regex) || message.user.name.match(regex))){
        acc.push(message)
      }
      return acc
    }, [])
    
    if(this.state.searchTerm.includes('image')){
      channelMessages.forEach(message => {
        if(message.image){
          searchResults.push(message)
        }
      })
    }

    this.setState({
      searchResults
    })
    setTimeout(() => this.setState({ searchLoading: false }), 700)
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state
    return privateChannel ? privateMessagesRef : messagesRef
  }

  render() {

    const { messagesRef, channel, user, messages, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isMessagesLoading } = this.state

    return (
      <React.Fragment>
        <MessagesHeader 
          displayChannelName = { this.displayChannelName(channel) }
          numUniqueUsers = { numUniqueUsers }
          handleSearchChange = { this.handleSearchChange }
          searchLoading = { searchLoading }
          isPrivateChannel = { privateChannel }
        />

        <Segment>
          { 
            isMessagesLoading ?  
              <MessagesLoader />
            :
              <Comment.Group className = 'messages' >
                {/* Messages */} 
                { 
                  searchTerm ? 
                    this.displayMessages(searchResults) 
                  : 
                    this.displayMessages(messages) 
                }
              </Comment.Group>
          }
          
        </Segment>

        <MessageForm 
          messagesRef = { messagesRef }
          currentChannel = { channel }
          currentUser = { user }
          isPrivateChannel = { privateChannel }
          getMessagesRef = { this.getMessagesRef }
        />
      </React.Fragment>
    )
  }
}


export default connect(null, { setUserPosts })(Messages)