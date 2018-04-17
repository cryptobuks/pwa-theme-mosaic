import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { Container, Header, Label, Icon, Modal, Transition } from 'semantic-ui-react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SocialMedia from './components/SocialMedia';
import { postPropType } from '../PostsCarousel/reducer';
import './style.css';

class PostDetails extends Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      modalOpen: false,
      visible: true,
    };
  }

  handleOpen() {
    this.setState({ modalOpen: true, visible: !this.state.visible });
  }

  handleClose() {
    this.setState({ modalOpen: false, visible: !this.state.visible });
  }

  render() {
    const { post } = this.props;
    const { author } = post._embedded;
    const categoriesList = post._embedded['wp:term'];
    const featuredMedia = post._embedded['wp:featuredmedia'];

    // set path routes
    let goBack = '/';
    let path = '';

    if (!_.isNil(this.props.category.categorySlug) && !_.isNil(this.props.category.categoryId)) {
      path = '/category/' + this.props.category.categorySlug + '/' + this.props.category.categoryId;
      goBack = path;
    }

    path = path + '/post/' + post.slug + '/' + post.id + '/comments/' + post.comment_status;

    return (
      <Container className="post">
        <Helmet>
          <link rel="canonical" href={post.link} />
        </Helmet>
        <Link to={goBack}>
          <Icon circular name="chevron left" />
        </Link>
        {featuredMedia ? <div className="post-image" style={{ backgroundImage: `url(${featuredMedia[0].source_url})` }} /> : null}
        <Container textAlign="justified">
          <Header>
            <div dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </Header>
          {categoriesList[0].map(category => (
            <Link to={`/category/${category.slug}/${category.id}`} key={category.name}>
              <Label color="teal">{category.name}</Label>
            </Link>
          ))}
          <Header.Subheader>
            &nbsp;{this.props.texts.TEXTS && this.props.texts.TEXTS.BY_AUTHOR}&nbsp;<b>{author[0].name}</b>,&nbsp;<Moment format="MMMM DD, YYYY">
              {post.date}
            </Moment>
          </Header.Subheader>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </Container>
        <Modal
          className="share"
          open={this.state.modalOpen}
          onClick={this.handleClose}
          trigger={
            <Transition.Group animation="fade up" duration="500" className="transition-container">
              {this.state.visible && <Icon circular name="share alternate" size="large" onClick={this.handleOpen} />}
            </Transition.Group>
          }
          basic
        >
          <Modal.Actions>
            <Link to={path}>
              <Icon name="comment" size="large" circular inverted color="grey" />
            </Link>
            <SocialMedia title={post.title.rendered} link={post.link} />
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

PostDetails.propTypes = {
  post: postPropType.isRequired,
  category: PropTypes.shape({
    categorySlug: PropTypes.string,
    categoryId: PropTypes.string,
  }).isRequired,
  texts: PropTypes.shape({
    TEXTS: PropTypes.shape({
      BY_AUTHOR: PropTypes.string,
    }),
  }),
};

PostDetails.defaultProps = {
  texts: {
    TEXTS: {
      BY_AUTHOR: 'by',
    },
  },
};

export default PostDetails;
