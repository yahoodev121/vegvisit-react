import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Content.css';
import { getContent as getContentAction } from '../../actions/content';
import { selectContent } from '../../reducers/content';

class Content extends Component {

  static propTypes = {
    path: PropTypes.string.isRequired,
    locale: PropTypes.string,
    content: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      title: PropTypes.string,
      content: PropTypes.string,
    }),
    getContent: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.maybeFetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    this.maybeFetchData(this.props);
  }

  maybeFetchData(props) {
    const { path, locale, content, getContent } = props || this.props;
    if (!content) {
      getContent({ path, locale });
    }
  }

  render() {
    const { path, content } = this.props;
    return (
      <div className={s.root}>
        {(!content || content.isFetching) ? (
          <div className={`${s.container} ${s.fetching}`}>
            {path !== '/' && <h1>...</h1>}
          </div>
        ) : (
          // github.com/yannickcr/eslint-plugin-react/issues/945
          // eslint-disable-next-line react/jsx-indent
          <div className={s.container}>
            {content.title && path !== '/' && <h1>{content.title}</h1>}
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        )}
      </div>
    );
  }
}

const mapState = (state, props) => ({
  content: selectContent(state, props),
});

const mapDispatch = {
  getContent: getContentAction,
};

const EnhancedContent = connect(mapState, mapDispatch)(Content);

export default withStyles(s)(EnhancedContent);
