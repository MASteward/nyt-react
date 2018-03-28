import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, TextArea, FormBtn } from "../../components/Form";

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


  componentDidMount() {
    this.loadArticles();
  }

  loadArticles = () => {
    API.getArticles()
      .then(res =>
        this.setState({ articles: res.data, topic: ""})
        // this.setState({ articles: res.data, topic: "", date: "", url: "" })
      )
      .catch(err => console.log(err));
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.loadArticles())
      .catch(err => console.log(err));
  };

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
    this.getArticles(query)
  };
    // if (this.state.title && this.state.date) {
    //   API.saveArticle({
    //     title: this.state.title,
    //     date: this.state.date,
    //     url: this.state.url
    //   })
    //     .then(res => this.loadArticles())
    //     .catch(err => console.log(err));
    // }
  // };
  getArticles = query => {
    //clearing the articles array if the user changes search terms
    if (query.topic !== this.state.previousSearch.topic ||
        query.endYear !==this.state.previousSearch.endYear ||
        query.startYear !==this.state.previousSearch.startYear) {
      this.setState({articles: []})
    }
    let { topic, startYear, endYear } = query

    let queryUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest&page=${this.state.page}`
    let key = `&api-key=33c676fd7fd14e90a532f9698ab4dd4a`

    //removing spaces and building the query url conditionally
    //based on presence of optional search terms
    if (topic.indexOf(' ')>=0) {
      topic = topic.replace(/\s/g, '+');
    }
    if (topic){
      queryUrl+= `&fq=${topic}`
    }
    if (startYear) {
      queryUrl+= `&begin_date=${startYear}`
    }
    if (endYear){
      queryUrl+= `&end_date=${endYear}`
    }
    queryUrl+=key;

    //calling the API
    API
      .queryNYT(queryUrl)
      .then(articles => {
          //concatenating new articles to the current state of articles.  If empty will just show articles,
          //but if search was done to get more, it shows all articles.  Also stores current search terms
          //for conditional above, and sets the noarticles flag for conditional rendering of components below
        this.setState({
          articles: [...this.state.articles, ...articles.data.response.docs],
          previousSearch: query,
          topic: "",
          startYear: "",
          endYear: ""
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
          <Col size="md-6">
            <Jumbotron>
              <h1>What Articles Should I Read?</h1>
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
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Articles On My List</h1>
            </Jumbotron>
            {this.state.articles.length ? (
              <List>
                {this.state.articles.map(article => (
                  <ListItem key={article._id}>
                    <Link to={"/articles/" + article._id}>
                      <strong>
                        {article.title} by {article.date}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteArticle(article._id)} />
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
