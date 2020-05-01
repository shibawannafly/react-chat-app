import React, { Component } from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'


export default class MessagesHeader extends Component {
  render() {

    const { displayChannelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel } = this.props

    return (
      <Segment clearing>
        <Header fluid = 'true' as = 'h2' floated = 'left' style = {{ marginBottom: 0 }} >
          <span>
            { displayChannelName }
            {!isPrivateChannel && <Icon name = {'star outline'} color = 'black' />}
          </span>
          <Header.Subheader>{ numUniqueUsers }</Header.Subheader>
        </Header>

        {/* Channel search input */}
        <Header floated = 'right'>
          <Input 
            size = 'mini' 
            icon = 'search'
            name = 'searchTerm'
            placeholder = 'Search Messages'
            onChange = { handleSearchChange }
            loading = { searchLoading }
          />
        </Header>
      </Segment>
    )
  }
}
