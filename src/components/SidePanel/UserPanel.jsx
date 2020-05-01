import React, { Component } from 'react'
import { Grid, GridColumn, GridRow, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react'
import firebase from '../../firebase'
import './UserPanel.css'
import AvatarEditor from 'react-avatar-editor'
import { Slider } from 'react-semantic-ui-range'

export default class UserPanel extends Component {

  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: '',
    imageScale: 1.5,
    storageRef: firebase.storage().ref(''),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('users'),
    metaData: {
      contentType: 'image/jpeg'
    },
    uploadedCroppedImage: ''
  }

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ 
    modal: false,
    previewImage: '',
    croppedImage: ''
  })

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
  }

  handleChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    if(file) {
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result })
      })
    }
  }

  handleCropImage = () => {
    if(this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob)
        this.setState({ 
          croppedImage: imageUrl,
          blob
         })
      })
    }
  }

  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metaData } = this.state
    storageRef
      .child(`avatar/user-${userRef.uid}`)
      .put(blob, metaData)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadURL => {
          this.setState({ uploadedCroppedImage: downloadURL }, () => this.changeAvatar())
        })
      })
  }

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage,
      })
      .then(() => {
        console.log('photoURL updated')
        this.closeModal()
      })
      .catch(err => {
        console.error(err)
      })

    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadedCroppedImage })
      .then(() => {
        console.log('User avatar updated')
        this.setState({ 
          croppedImage: '',
          previewImage: ''
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {

    const { user, modal, previewImage, croppedImage, imageScale } = this.state
    const { primaryColor } = this.props

    const dropdownOptions = [
      {
        key: 'user',
        text: <span>Sign in as <strong>{user.displayName}</strong></span>,
        disabled: true
      },
      {
        key: 'avatar',
        text: <span onClick = { this.openModal }>Change Avatar</span>
      },
      {
        key: 'signout',
        text: <span onClick={this.handleSignout}>Sign out</span>
      }
    ]


    return (
      <Grid style={{ background: primaryColor }}>
        <GridColumn>
          <GridRow style={{ padding: '1.2em', margin: 0 }}>
            <Header inverted floated='left' as='h2'>
              <Icon name='code' />
              <Header.Content>DevChat</Header.Content>
            </Header>
            {/* User dropdown */}
            <Header style={{ padding: '0.25em' }} as='h4' inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image
                      src={user.photoURL}
                      spaced='right'
                      avatar
                    />
                    {user.displayName}
                  </span>
                }
                options={dropdownOptions}
              />
            </Header>
          </GridRow>
          {/* Change User avatar modal */}
          <Modal
            basic
            open = { modal }
            onClose = { this.closeModal }
          >
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input 
                fluid
                type = 'file'
                label = 'New Avatar'
                name = 'previewImage'
                onChange = { this.handleChange }
              /> 
              <Grid centered  stackable columns = {2}>
                <Grid.Row centered>
                  <Grid.Column className = 'ui center aligned grid'>
                    {
                      previewImage && (
                          <>
                            <AvatarEditor 
                              ref = { node => (this.avatarEditor = node) }
                              image = { previewImage }
                              width = { 120 }
                              height = { 120 } 
                              border = { 50 }
                              scale = { imageScale }
                            />
                            <Slider 
                              value={imageScale} 
                              color="blue" 
                              settings={{
                                min: 1,
                                max: 2,
                                start: 1.5,
                                step: 0.1,
                                onChange: value => {
                                  this.setState({ imageScale: value });
                                }
                              }} 
                            />
                          </>
                      )
                    }
                  </Grid.Column>
                  <Grid.Column>
                    {/* Cropped image preview */} 
                    {
                      croppedImage && (
                        <Image 
                          style = {{ margin: '3.5em auto' }}
                          width = { 150 }
                          height = { 150 }
                          src = { croppedImage }
                        /> 
                      )
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {
                croppedImage && (
                  <Button
                    color = 'green'
                    inverted
                    onClick = { this.uploadCroppedImage }
                  >
                    <Icon name = 'save'/> Change Avatar
                  </Button>
                )
              }

              <Button
                color = 'blue'
                inverted
                onClick = { this.handleCropImage }
              >
                <Icon name = 'image'/> Preview
              </Button>

              <Button
                color = 'red'
                inverted
                onClick = { this.closeModal }
              >
                <Icon name = 'cancel' /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </GridColumn>
      </Grid>
    )
  }
}

