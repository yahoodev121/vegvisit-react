import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
// Redux
import { connect } from 'react-redux';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Reviews.css';
import {
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';

// Components
import StarRating from '../../StarRating';
import Avatar from '../../Avatar';
import Loader from '../../Loader';

// Locale
import messages from '../../../locale/messages';

class Reviews extends React.Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    listId: PropTypes.number.isRequired,
    reviewsCount: PropTypes.number.isRequired,
    reviewsStarRating: PropTypes.number.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      moreListReviews: PropTypes.arrayOf(PropTypes.shape({
        reservationId: PropTypes.number.isRequired,
        importUserName: PropTypes.string,
        authorData: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          picture: PropTypes.string,
          profileId: PropTypes.number.isRequired,
        }),
        reviewContent: PropTypes.string.isRequired,
        parentId: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
      })),
    })
  };

  static defaultProps = {
    loading: true
  };

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(ownerType){
    const { data: { moreListReviews, fetchMore }, listId } = this.props;
    fetchMore({
      //query: UserReviewsQuery,
      variables: {
        listId,
        offset: moreListReviews.length,
        loadCount: 5,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return previousResult; }

        return {
            moreListReviews: [...previousResult.moreListReviews, ...fetchMoreResult.moreListReviews],
        };
      },
    });
  }

  render() {
    const { data: { loading, moreListReviews} } = this.props;
    const { reviewsCount, reviewsStarRating} = this.props;
    const { siteName } = this.props;
    const { formatMessage } = this.props.intl;
    let starRatingValue = 0, showLoadMore = true;
    if (reviewsCount > 0 && reviewsStarRating > 0) {
      starRatingValue = Number(reviewsStarRating / reviewsCount)
    }

    if(moreListReviews && reviewsCount === moreListReviews.length) {
      showLoadMore = false;
    }

    if(loading){
      return <Loader type={"text"} />
    }

    if (reviewsCount === 0) {
      return (
        <Row className={cx(s.pageContent)}>
          <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space4, s.spaceTop4)}>
            <h2 className={cx(s.sectionTitleText)}><FormattedMessage {...messages.noReviewTitle} /></h2>
            <p className={s.textMuted}><FormattedMessage {...messages.noReviewInfo} /></p>
          </Col>
        </Row>
      );
    }

    return (
	    <Row className={cx(s.pageContent)}>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space2, s.spaceTop4)}>
          <h2 className={cx(s.sectionTitleText)}>
            <span className={s.textLeft}>{reviewsCount} {reviewsCount > 1 ? formatMessage(messages.reviews) : formatMessage(messages.review)}</span> 
            <span> <StarRating value={starRatingValue} className={s.starReview} name={'review'}/> </span>
          </h2>
          {
            !loading && moreListReviews && moreListReviews.map((item, index) => {
                const date = moment(item.createdAt).format('MMMM YYYY');
                const isAirbnbImportUser = item.authorId === '00001' ;
                const authorName = !isAirbnbImportUser ? item.authorData && item.authorData.firstName : item.importUserName;
                const withLink = !isAirbnbImportUser;
                return (
                  <Row className={cx(s.spaceTop2, s.space3, s.horizontalLineThrough)} key={index}>
                    {
                      !item.isAdmin && item.authorData && <Col sm={12} className={s.reviewContainer}>
                        <div className={cx(s.alignMiddle)}>
                          <div className={cx(s.pullLeft, s.mediaContainer, s.textCenter)} >
                            <Avatar
                              source={item.authorData.picture}
                              height={48}
                              width={48}
                              title={authorName}
                              className={s.profileAvatar}
                              withLink={withLink}
                              linkClassName={s.profileAvatarLink}
                              profileId={item.authorData.profileId}
                              useRandomPicture={isAirbnbImportUser}
                            /> 
                          </div>
                        </div>
                        <div className={s.alignMiddle}>
                          <div className={s.infoAlign}>
                            <span className={s.textBold}>{authorName}</span><br />
                            {/* <span>{date}</span> */}
                          </div>
                        </div>
                      </Col>
                    }
                    {
                      item.isAdmin && <Col sm={12} className={s.reviewContainer}>
                        <div className={cx(s.alignMiddle)}>
                          <div className={cx(s.pullLeft, s.mediaContainer, s.textCenter)} >
                            <Avatar
                              source={'../../../../adminAvatar.png'}
                              height={48}
                              width={48}
                              title={formatMessage(messages.verifiedBy) + ' ' + siteName}
                              className={cx(s.profileAvatar, s.noBackground)}
                              linkClassName={s.profileAvatarLink}
                              staticImage
                            />
                          </div>
                        </div>
                        <div className={s.alignMiddle}>
                          <div className={s.infoAlign}>
                            <span className={s.textBold}>{formatMessage(messages.verifiedBy) + ' ' + siteName}</span><br />
                            <span>{date}</span>
                          </div>
                        </div>
                      </Col>
                    }
                    <Col sm={12} className={cx(s.space3, s.spaceTop2)}>
                      <div className={s.commentSection}>
                        {
                          item.reviewContent && (item.reviewContent.trim()).split("\n").map(function (content, index) {
                            return (
                              <span key={index}>
                                {content}
                                <br />
                              </span>
                            )
                          })
                        }
                      </div>
                    </Col>
                    {isAirbnbImportUser && <Col sm={12} className={s.textLight}>
                        <div className={cx(s.textRight)}>
                          from Airbnb
                        </div>
                    </Col>}
                  </Row>
                )
            })
          }
          {
            showLoadMore && <div className={cx(s.space2, s.textCenter)}>
                              <a className={cx(s.btn, s.btnPrimary)} onClick={() => this.loadMore()}>
                                <FormattedMessage {...messages.loadMore} /><span>...</span>
                              </a>
                            </div>
          }

        </Col>
      </Row>
      
    );
  }
}

const mapState = state => ({
  siteName: state.siteSettings.data.siteName
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Reviews)));
