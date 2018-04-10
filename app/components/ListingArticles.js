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
  Linking
} from 'react-native';
import { Actions } from 'react-native-router-flux'

export default class ListingArticles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: null,
      articles: []
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
        this.setState({articles: articles.response.docs})
      }
    } catch (error) {
      console.log(error);
    }
  }

  goToWeb(articles) {
    Actions.webview({url: articles.item.web_url})
  }

    // <Text>{articles.item.headline.main}</Text>
  renderRow(articles) {
    return (
      <TouchableOpacity onPress={this.goToWeb.bind(this, articles)}>
        <View style={listingStyles.inspectionRow}>
          <View style={listingStyles.inspectionRowStatus}>
          <Text>
            Image
          </Text>
          </View>
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

  render() {
    console.log('state: ', this.state.articles);
    let data = []
    let content = null
    if (this.state.articles.length == 0) {
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
        <View styles={{}}>
          <TextInput
            style={{backgroundColor:'skyblue', height:40, width: '90%'}}
            underlineColorAndroid="transparent"
            disableFullscreenUI={true}
            placeholder='Search'
            onChangeText={this.setSearch.bind(this)}
            value={this.state.search}
            keyboardType='ascii-capable'/>
          <View>
            <TouchableOpacity onPress={this.getArticles}>
              <Text>Search Articles</Text>
            </TouchableOpacity>
          </View>
          {content}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  titleBar: {
    width: 50,
    padding: 16,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'gray'
  },
  logoArea: {
    width: 50,
    height: 150,
    backgroundColor: 'blue',
  },
  typeButton: {
    padding: 5,
  },
  mainBody: {

  },
  bodyMenu: {
    width: 600,
    height: 80,
    backgroundColor: 'rgb(23,136,205)',
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
  inspectionRowAssigneeName: {
    fontSize: 12,
    color: 'rgba(170, 170, 170, 1.0)',
  },
  filterToolbar: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  assigneeToolbar:{
    justifyContent:'flex-start',
    top:5
  },
  filterToolbarIcon: {
    paddingRight: 12,
    paddingTop: 10,
    fontSize: 15
  },
  filterContent: {
  },
  filterGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterGroupLabel: {
    flex: 1,
    maxWidth: 80,
    alignItems: 'flex-end',
    paddingTop: 5,
    paddingRight: 10,
  },
  filterGroupControl: {
    flex: 2,
    maxWidth: 400,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  assigneeContent: {
  },
  assigneeGroup:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  assigneeLabel: {
    flex: 1,
    maxWidth: 140,
    alignItems: 'flex-end',
    paddingTop: 5,
    paddingRight: 10,
  },
  assigneeGroupControl: {
    flex: 2,
    maxWidth: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fetchNewInspection: {
    margin: 5,
    marginBottom: 2,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#7986CB',
    alignItems: 'center',
  },
  fetchNewInspectionText: {
    color: '#FFFFFF',
  },
  filterForm: {
    width: '80%',
    marginRight: 10,
    borderBottomWidth: 0.5
  },
  filterLabel: {
    width: 70,
    top: 10
  }
})
