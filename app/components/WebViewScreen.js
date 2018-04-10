import React, { Component } from 'react';
import { WebView, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux'

export default class WebViewThatOpensLinksInNavigator extends Component {
  componentDidMount() {
    Actions.pop()
  }

  render() {
    const uri = this.props.url
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri }}
        onNavigationStateChange={(event) => {
          if (event.url !== uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }
}
