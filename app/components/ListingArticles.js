import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  WebView,
  Linking,
  Button
} from 'react-native';
import { Actions } from 'react-native-router-flux'

export default class ListingArticles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: null,
      articles: [],
      fetch: false
    }
    this.getArticles = this.getArticles.bind(this)
    this.renderRow = this.renderRow.bind(this)
  }

  componentDidMount() {
    this.getArticles()
  }

  setSearch(text) {
    this.setState({
      search: text
    })
  }

  async getArticles() {
    try {
      this.setState({fetch: true})
      let api_key = '15410937072241ac91c95a599963e337'
      let params = this.state.search
      let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json"
      let response = await fetch(`${url}?api_key=${api_key}&q=${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      let responseJson = await response.json()
      // console.log('responseJson:', responseJson)
      if (responseJson.error) {
        console.log(responseJson.error);
      } else {
        let articles = responseJson
        this.setState({articles: articles.response.docs, fetch: false})
      }
    } catch (error) {
      console.log(error);
    }
  }

  goToWeb(articles) {
    Actions.webview({url: articles.item.web_url})
  }

  renderRow(articles) {
    return (
      <TouchableOpacity onPress={this.goToWeb.bind(this, articles)}>
        <View style={listingStyles.inspectionRow}>
          <View style={listingStyles.inspectionRowContent}>
            <Text style={listingStyles.inspectionRowInspectionName}>
              {articles.item.headline.main}
            </Text>
            <Text style={listingStyles.inspectionRowInspectionId}>
              {articles.item.snippet}
            </Text>
            <Text style={listingStyles.inspectionRowPropertyName}>
              Unit
            </Text>
            <Text style={listingStyles.inspectionRowInspectionStatus}>
              {articles.item.pub_date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderHeader() {
    return (
      <View style={styles.container}>
        <View style={{width:'75%'}}>
          <TextInput
            style={{backgroundColor:'#ffffff', height:30, paddingLeft: 10, paddingTop: 0, borderRadius: 10}}
            underlineColorAndroid="transparent"
            disableFullscreenUI={true}
            placeholder='Search'
            onChangeText={this.setSearch.bind(this)}
            value={this.state.search}
            keyboardType='ascii-capable'/>
        </View>
        <View style={{backgroundColor:'rgb(243, 55, 47)',   height:30, borderRadius: 10, justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.getArticles}        style={{marginLeft:10, marginRight: 10}}>
            <Text style={{color: '#FFFFFF'}}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    let data = []
    let content = null
    if (this.state.articles.length == 0 || this.state.fetch) {
      content = (
        <ActivityIndicator
          animating={true}
          style={{height: 80}}
          size="large" />
      )
    } else {
      content = (
        <FlatList
          data = {data.concat(this.state.articles)}
          keyExtractor = {this.keyExtractor}
          renderItem = {this.renderRow} />
      )
    }

    return (
      <View>
        <View style={[layoutStyles.body, listingStyles.body]}>
          {this.renderHeader()}
          {content}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#48D1CC',
    height: 90
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const listingStyles = StyleSheet.create({
  body: {
    backgroundColor: 'rgba(243, 243, 243, 1.0)',
  },
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  item: {
    width: 600,
    height: 50,
    backgroundColor: 'white',
  },
  inspectionRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    borderTopWidth:1.5,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  inspectionRowStatus: {
    height:45,
    width:45,
    borderRadius:10,
    backgroundColor:'lightgray',
    marginRight:6,
    alignItems:'center',
    justifyContent:'center',
  },
  inspectionRowStatusIcon: {
    fontSize: 20,
  },
  inspectionRowContent: {
    flex: 1
  },
  inspectionRowDateContainer: {
    flex: 0,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    maxWidth: 100,
    padding: 5,
  },
  inspectionRowDate: {
    color: 'blue',
    fontSize: 12
  },
  inspectionRowInspectionName: {
    color: '#107DCB',
    fontSize: 16,
  },
  inspectionRowPropertyName: {
    color: '#999999',
    fontSize: 12,
  },
  inspectionRowInspectionId: {
    color: '#999999',
    fontSize: 11,
  },
  inspectionRowInspectionStatus: {
    color: 'rgba(255, 96, 15, 1.0)',
    fontSize: 14,
  },
})

const layoutStyles = StyleSheet.create({
  body: {
    backgroundColor:'white',
    height: '100%',
  },
})
