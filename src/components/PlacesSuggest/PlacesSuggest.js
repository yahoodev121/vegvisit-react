// General
import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Redux actions
import { getLocationData } from '../../actions/getLocation';

// Google Places Suggest Component
//import GoogleMapLoader from "react-google-maps-loader";
import ReactGoogleMapLoader from "react-google-maps-loader";
import GooglePlacesSuggest from "react-google-places-suggest";

// Styles
//import s from '!isomorphic-style-loader!css-loader!react-google-places-suggest/lib/index.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormControl } from 'react-bootstrap';

// Constants
import { googleMapAPI } from '../../config';

class PlacesSuggest extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.any,
    googleMaps: PropTypes.object,
    getLocationData: PropTypes.any,
  };

  handleSearchChange = (e) => {
    return e.target.value;
  }

  handleSelectSuggest = (suggest, coordinate) => {    
    this.props.getLocationData(suggest.formatted_address);
    return suggest.formatted_address;
  }

  /*renderDefaultSuggest = (suggest) => {
    const {description, structured_formatting} = suggest
    const firstMatchedString = structured_formatting.main_text_matched_substrings.shift()
    let labelParts = null

    if (firstMatchedString) {
      labelParts = {
        before: description.substr(0, firstMatchedString.offset),
        matched: description.substr(firstMatchedString.offset, firstMatchedString.length),
        after: description.substr(firstMatchedString.offset + firstMatchedString.length),
      }
    }

    return (
      <div>
        <span className="placesSuggest_suggestLabel">
          {labelParts
            ? <span>
                {labelParts.before.length > 0 ? <span>{labelParts.before}</span> : null}
                <span className="placesSuggest_suggestMatch">{labelParts.matched}</span>
                {labelParts.after.length > 0 ? <span>{labelParts.after}</span> : null}
              </span>
            : description
          }
        </span>
      </div>
    )
  }*/

  render() {

    const { value, onChange, label, className } = this.props;
    //const { googleMaps } = this.props;

    return (
      <div>
      <ReactGoogleMapLoader
        params={{
          key: googleMapAPI, // Define your api key here
          libraries: "places", // To request multiple libraries, separate them with a comma
        }}
        render={googleMaps =>
          googleMaps && (
            <GooglePlacesSuggest
              googleMaps={googleMaps}
              autocompletionRequest={{
                input: value,
              }}
              onSelectSuggest={(suggest, coordinate) => onChange(this.handleSelectSuggest(suggest, coordinate))}
              search={value}
              textNoResults={null}
            >
              <FormControl
                type="text"
                placeholder={label}
                onChange={(e) => onChange(this.handleSearchChange(e))}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }
                }
                className={className}
              />
            </GooglePlacesSuggest>
          )}
      />  
      </div> 
    );
  }
}

const mapState = (state) => ({
});

const mapDispatch = {
  getLocationData,
};

// export default GoogleMapLoader((connect(mapState, mapDispatch)(PlacesSuggest)), {
//   libraries: ["places"],
//   region: "US",
//   language: "en",
//   key: googleMapAPI,
// });

export default connect(mapState, mapDispatch)(PlacesSuggest);
