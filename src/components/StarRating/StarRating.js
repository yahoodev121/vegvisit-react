import React from 'react';
import PropTypes from 'prop-types';

import StarRatingComponent from 'react-star-rating-component';
import * as FontAwesome from 'react-icons/lib/fa';

import isValidNumber from '../../helpers/isValidNumber';

class StarRating extends React.Component {

    static propTypes = {
      name: PropTypes.string.isRequired,
      className: PropTypes.string,
      change: PropTypes.any,
      editing: PropTypes.bool,
      value: PropTypes.number
    }; 

    static defaultProps = {
      editing: false,
      value: 0 
    };

    constructor (props) {
      super (props);  
      this.state = {
        rating: 0
      }
      this.onStarClick= this.onStarClick.bind(this);
    }
  
    onStarClick(nextValue, prevValue, name) {
      const {change} = this.props;
      this.setState({rating: nextValue});
      change(nextValue);
    }

    roundHalf(num) {
      if (isValidNumber(num)) {
        return Math.round(num*2)/2;
      } else {
        return 0
      }
    }

    render() {
      const { rating } = this.state;
      const { className, name, editing, value } = this.props;
      const starValue = this.roundHalf(value);
      const starColor = `#fbb342`;
      const emptyStarColor=`#767676`;

      return (
        <div className={className}>
          <StarRatingComponent 
            name={name}
            starCount={5}
            editing={editing}
            value={editing ? rating : starValue}
            starColor={starColor}
            emptyStarColor={emptyStarColor}
            onStarClick={this.onStarClick}
            renderStarIcon={(index, value) => {
              return (
                <span>
                  <FontAwesome.FaStar />
                </span>
              );
            }}
            renderStarIconHalf={(index, value) => {
              return (
                <span style={{color: starColor}}>
                  <FontAwesome.FaStarHalfEmpty />
                </span>
              );
            }}
          />
        </div>
      );
    }
}

export default StarRating;
 

