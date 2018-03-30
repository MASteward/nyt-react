import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import SaveBtn from "../../components/SaveBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, FormBtn } from "../../components/Form";

class Articles extends Component {
  state = {
    topic: "",
    startYear: "",
    endYear: "",
    articles: [],
    page: '0',
    title: "",
    date: "",
    url: "",
    previousSearch: {},
    noResults: false
  };


  // componentDidMount() {
  //   this.loadArticles();
  // }
  //
  // loadArticles = () => {
  //   API.getArticles()
  //     .then(res =>
  //       this.setState({
  //         articles: res.data,
  //         topic: "",
  //         summary: "",
  //         date: "",
  //         url: ""
  //       })
  //     )
  //     .catch(err => console.log(err));
  // };

  handleInputChange = event => {
    let { name, value } = event.target;
    this.setState({[name] : value})
  };

  // handleInputChange = event => {
  //   const { name, value } = event.target;
  //   this.setState({
  //     [name]: value
  //   });
  // };

  handleFormSubmit = event => {
    event.preventDefault();
    let { topic, startYear, endYear } = this.state;
    let query = { topic, startYear, endYear }
    this.getHeadlines(query)
  };

  saveArticle = article => {
    let savedArticle = {
      title: article.headline.main,
      summary: article.snippet,
      url: article.web_url,
      date: article.pub_date
    }
    API.saveArticle(savedArticle)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

  getHeadlines = query => {
    if (query.topic !== this.state.previousSearch.topic) {
      this.setState({articles: []});
    }
    let { topic, startYear, endYear } = query;

    let queryUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest&page=${this.state.page}`;
    let key = `&api-key=b9f91d369ff59547cd47b931d8cbc56b:0:74623931`;
    if (topic.indexOf(' ')>=0) {
      topic = topic.replace(/\s/g, '+');
    }
    if (topic){
      queryUrl+= `&fq=${topic}`;
    }
    if (startYear) {
      queryUrl+= `&begin_date=${startYear}`;
    }
    if (endYear){
      queryUrl+= `&end_date=${endYear}`;
    }
    queryUrl+=key;

    //calling the API
    API
      .queryNYT(queryUrl)
      .then(articles => {
        this.setState({
          articles: [...this.state.articles, ...articles.data.response.docs],
          previousSearch: query,
          topic: "",
          startYear: "",
          endYear: "",
          title: "",
          date: "",
          url: ""
        }, function (){
          this.state.articles.length === 0 ? this.setState({noarticles: true}) : this.setState({noarticles: false})
        });
    })
    .catch(err=> console.log(err))
  }
  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>New York Times</h1>
            </Jumbotron>
            <form>
              <Input
                onChange={this.handleInputChange}
                name='topic'
                value={this.state.topic}
                placeholder='Topic'
              />
              <Input
                onChange={this.handleInputChange}
                type='date'
                name='startYear'
                value={this.state.startYear}
                placeholder='Start Year'
              />
              <Input
                onChange={this.handleInputChange}
                type='date'
                name='endYear'
                value={this.state.endYear}
                placeholder='End Year'
              />
              <FormBtn
                disabled={!(this.state.topic)}
                onClick={this.handleFormSubmit}
                type='info'
                >Submit
              </FormBtn>
            </form>
          </Col>
        </Row>
        <Row>
          <Col size="md-12 sm-12">
            <h1>Headlines</h1>
            {this.state.articles.length ? (
              <List>
                {this.state.articles.map(article => (
                  <ListItem key={article._id}>
                    <SaveBtn onClick={() => this.saveArticle(article)} />
                    <Link to={"/articles/" + article.web_url}>
                      <h3>
                        <strong>
                          {article.headline.main}
                        </strong>
                      </h3>
                    </Link>
                    <div>
                      <p>
                        {article.snippet}
                      </p>
                      <p>
                        {article.pub_date}
                      </p>
                    </div>

                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No articles to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Articles;
