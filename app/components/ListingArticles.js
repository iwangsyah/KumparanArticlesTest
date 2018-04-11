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
import _ from 'lodash'

export default class ListingArticles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: null,
      articles: [],
      fetch: false,
      newest: false,
      older: false
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

  renderRow(article) {
    let date =  article.item.pub_date
    date = date.substring(0, 10)

    return (
      <TouchableOpacity onPress={this.goToWeb.bind(this, article)}>
        <View style={listingStyles.inspectionRow}>
          <View style={listingStyles.inspectionRowContent}>
            <Text style={listingStyles.inspectionRowInspectionName}>
              {article.item.headline.main}
            </Text>
            <Text style={listingStyles.inspectionRowInspectionId}>
              {article.item.snippet}
            </Text>
            <Text style={listingStyles.inspectionRowInspectionStatus}>
              {date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onClickButtonNewest() {
    let { articles, newest, older } = this.state
    if (!newest) {
      articles = _.orderBy(articles, ['pub_date'],['asc'])
      this.setState({ newest: true, older: false, articles: articles })
    }
  }

  onClickButtonOlder() {
    let { articles, newest, older } = this.state
    if (!older) {
      articles = _.orderBy(articles, ['pub_date'],['desc'])
      this.setState({ older: true, newest: false, articles: articles })
    }
  }

  renderHeader() {
    let { search, newest, older } = this.state

    return (
      <View style={styles.container}>

        <View style={styles.container1}>
          <View style={{width:'75%'}}>
            <TextInput
              style={{backgroundColor:'#ffffff', height:30, paddingLeft: 10, paddingTop: 0, borderRadius: 10}}
              underlineColorAndroid="transparent"
              disableFullscreenUI={true}
              placeholder={search}
              keyboardType='ascii-capable'/>
          </View>
          <View style={{backgroundColor:'rgb(243, 55, 47)',   height:30, borderRadius: 10, justifyContent: 'center' }}>
            <TouchableOpacity onPress={this.getArticles}        style={{marginLeft:10, marginRight: 10}}>
              <Text style={{color: '#FFFFFF'}}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container1}>
          <TouchableOpacity onPress={this.onClickButtonNewest.bind(this)} style={newest ? styles.buttonActive : styles.buttonInActive}>
              <Text style={{color: '#FFFFFF'}}>Newest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onClickButtonOlder.bind(this)} style={older ? styles.buttonActive : styles.buttonInActive}>
            <Text style={{color: '#FFFFFF'}}>Older</Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }

  render() {
    let { articles, newest, older } = this.state
    console.log('ART: ', articles);

    let data = []
    let content = null
    if (articles.length == 0 || this.state.fetch) {
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
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#48D1CC',
    height: 100,
    paddingTop: 20,
  },
  container1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  buttonActive: {
    backgroundColor:'rgb(0, 126, 105)',
    height:30,
    width: '46%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonInActive: {
    backgroundColor:'rgb(40, 84, 245)',
    height:30,
    width: '46%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
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
