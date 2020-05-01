import React from 'react'
import ContentLoader from 'react-content-loader'

const MessagesLoader = () => (
  <ContentLoader
      height={350}
      width={'100%'}
      speed={2}
      // primaryColor="#d9d9d9"
      // secondaryColor="#ecebeb"
      // {...props}
    >
      <circle cx="24" cy="24" r="24" />
      <rect x="64" y="12" rx="3" ry="3" width="30%" height="7" />
      <rect x="64" y="40" rx="3" ry="3" width="80%" height="6" />

      <circle cx="24" cy="84" r="24" />
      <rect x="64" y="72" rx="3" ry="3" width="30%" height="7" />
      <rect x="64" y="100" rx="3" ry="3" width="80%" height="6" />

      <circle cx="24" cy="144" r="24" />
      <rect x="64" y="132" rx="3" ry="3" width="30%" height="7" />
      <rect x="64" y="160" rx="3" ry="3" width="80%" height="6" />

      <circle cx="24" cy="204" r="24" />
      <rect x="64" y="192" rx="3" ry="3" width="30%" height="7" />
      <rect x="64" y="220" rx="3" ry="3" width="80%" height="6" />

      <circle cx="24" cy="264" r="24" />
      <rect x="64" y="252" rx="3" ry="3" width="30%" height="7" />
      <rect x="64" y="280" rx="3" ry="3" width="80%" height="6" />
      
      <circle cx="24" cy="324" r="24" />
      <rect x="64" y="312" rx="3" ry="3" width="30%" height="7" />
      <rect x="64" y="340" rx="3" ry="3" width="80%" height="6" />

    </ContentLoader>
)

export default MessagesLoader