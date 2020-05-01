import React, { Component } from 'react'
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'
import FileModal from './FileModal'
import uuidv4 from 'uuid/v4'
import ProgressBar from './ProgressBar'

export default class MessageForm extends Component {

  state = {
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    modal: false,
    uploadState: '',
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0,
    typingRef: firebase.database().ref('typing')
  }

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false })

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    }

    if(fileUrl !== null){
      // message['image'] = fileUrl
      message.image = fileUrl
    } else {
      // message['content'] = this.state.message
      message.content = this.state.message
    }

    return message
  }

  sendMessage = () => {
    const { getMessagesRef } = this.props
    const { message, channel, typingRef, user } = this.state

    if (message) {
      this.setState({
        loading: true
      })
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({
            loading: false,
            message: '',
            errors: []
          })
          typingRef
            .child(channel.id)
            .child(user.uid)
            .remove()
        })
        .catch(err => {
          console.log(err)
          this.setState({
            errors: this.state.errors.concat(err)
          })
        })
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      })
    }
  }

  handleKeyDown = event => {
    const { message, typingRef, channel, user } = this.state
    if (message) {
      if(event.keyCode === 13){
        this.sendMessage()
      }
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName)
    } else{
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove()
    }
    
  }

  getPath = () => {
    if(this.props.isPrivateChannel){
      return `chat/private-${this.state.channel.id}`
    } else{
      return `chat/public`
    }
  }

  uploadFile = (file, metaData) => {
    const pathToUpload = this.state.channel.id
    const ref = this.props.getMessagesRef()
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`

    this.setState({
      uploadState: 'uploading',
      uploadTask: this.state.storageRef.child(filePath).put(file, metaData)
    }, () => {
      this.state.uploadTask.on('state_changed', snap => {
        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        this.setState({
          percentUploaded
        })
      },
        err => {
          console.log(err)
          this.setState({
            errors: this.state.errors.concat(err),
            uploadState: 'error',
            uploadTask: null
          })
        },
        () => {
          this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
            this.sendFileMessage(downloadUrl, ref, pathToUpload)
          })
            .catch(err => {
              console.log(err)
              this.setState({
                errors: this.state.errors.concat(err),
                uploadState: 'error',
                uploadTask: null
              })
            })
        })
    })
  }

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({
          uploadState: 'done'
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          errors: this.setState.errors.concat(err)
        })
      })
  }

  

  render() {
    const { errors, message, loading, modal, uploadState, percentUploaded } = this.state
    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          style={{ marginBottom: '0.7em' }}
          label={<Button icon={'add'} />}
          labelPosition='left'
          placeholder='Write your message'
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          className={
            errors.some(err => err.message.includes('message')) ? 'error' : ''
          }
          value={message}
        />

        <Button.Group icon widths='2'>
          <Button
            color='teal'
            content='Upload Media'
            labelPosition='left'
            icon='cloud upload'
            onClick={this.openModal}
            disabled = { uploadState === 'uploading' }
          />
          <Button
            color='orange'
            content='Add reply'
            labelPosition='right'
            icon='edit'
            onClick={this.sendMessage}
            disabled={loading}
          />

        </Button.Group>
          <FileModal
            modal={modal}
            closeModal={this.closeModal}
            uploadFile={this.uploadFile}
          />
          <ProgressBar
            uploadState = {uploadState}
            percentUploaded = {percentUploaded}
          />
      </Segment>
    )
  }
}
