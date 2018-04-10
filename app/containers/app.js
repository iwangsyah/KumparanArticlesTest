import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Router, Scene, Stack } from 'react-native-router-flux'
import ListingArticles from '../components/ListingArticles'
import WebViewScreen from '../components/WebViewScreen'

export default class KumparanArticlesTest extends React.Component {

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key='listing'
                 component={ListingArticles}
                 title='ListingArticles'
                 panHandlers={null}
                 hideNavBar={true} />
          <Scene key='webview'
                 component={WebViewScreen}
                 title='WebViewScreen'
                 panHandlers={null}
                 hideNavBar={true} />
        </Scene>
      </Router>
    )
  }
}
