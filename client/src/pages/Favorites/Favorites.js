import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { List, ListItem } from "../../components/List";
import DeleteBtn from "../../components/DeleteBtn";


class Favorites extends Component {
  state = {
    savedArticles: []
  };

  componentDidMount() {
    this.loadArticles()
  };

  loadArticles() {
    API.getSavedArticles()
      .then(res => this.setState({ savedArticles: res.data }))
      .catch(err => console.log(err));
      console.log(this.state.savedArticles);
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => {
        let savedArticles = this.state.savedArticles.filter(article => article._id !== id);
        this.setState({savedArticles: savedArticles});
        this.loadArticles();
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12 sm-12">
            <Jumbotron>
              <h1>Favorite Headlines</h1>
            </Jumbotron>
            {this.state.savedArticles.length ? (
              <List>
                {this.state.savedArticles.map(article => (
                  <ListItem key={article._id}>
                    <DeleteBtn onClick={() => this.deleteArticle(article)} />
                    <Link to={"/articles/" + article.url}>
                      <h3>
                        <strong>
                          {article.title}
                        </strong>
                      </h3>
                    </Link>
                    <div>
                      <p>
                        {article.summary}
                      </p>
                      <p>
                        {article.date}
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

export default Favorites;
