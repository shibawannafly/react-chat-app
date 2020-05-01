import React, { Component } from 'react'
import { Segment, Accordion, Header, Icon, Image, List, Message } from 'semantic-ui-react'

export default class MetaPanel extends Component {

  state = {
    activeIndex: 0,
    privateChannel: this.props.isPrivateChannel,
    channel: this.props.currentChannel
  }

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }

  displayopPosters = userPosts => (
    Object.entries(userPosts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i} >
          <Image src={val.avatar} avatar />
          <List.Content>
            <List.Header as='a'>{key}</List.Header>
            <List.Description>{this.formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5)
  )

  formatCount = count => count === 0 || count === 1 ? `${count} post` : `${count} posts`

  render() {
    const { activeIndex, privateChannel, channel } = this.state
    const { userPosts } = this.props

    if (privateChannel) return null
    return (
      <>
        <Segment loading={!channel} >
          <Header as='h3' attached='top'>
            About # {channel && channel.name}
          </Header>
          <Accordion styled attached='top'>

            <Accordion.Title
              active={activeIndex === 0}
              index={0}
              onClick={this.setActiveIndex}
            >
              <Icon name='dropdown' />
              <Icon name='info' />
            Channel Details
          </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              {channel && channel.details}
            </Accordion.Content>

            <Accordion.Title
              active={activeIndex === 1}
              index={1}
              onClick={this.setActiveIndex}
            >
              <Icon name='dropdown' />
              <Icon name='user circle' />
            Top Posters
          </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <List>
                {userPosts && this.displayopPosters(userPosts)}
              </List>
            </Accordion.Content>

            <Accordion.Title
              active={activeIndex === 2}
              index={2}
              onClick={this.setActiveIndex}
            >
              <Icon name='dropdown' />
              <Icon name='pencil alternate' />
            Created By
          </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
              <Header as='h3'>
                <Image src={channel && channel.createBy.avatar} circular />
                {channel && channel.createBy.name}
              </Header>
            </Accordion.Content>

          </Accordion>
        </Segment>
        <Message
          attached = 'bottom'
          warning
          header='</> Development notification'
          content='Add user typing effect '
        />
      </>
    )
  }
}
