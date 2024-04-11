import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, formValueSelector, change } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Actions
import { sortListPhotos } from '../../actions/sortListPhotos';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';


// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import {
  Grid,
  Button,
  Form,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import s from './ListRetreat.css';

// Internal Components
import CustomCheckbox from '../CustomCheckbox';
import ListPlaceTips from '../ListPlaceTips';
import Loader from '../Loader';

import submit from './submit';

// Helpers
import { listingBaseUrl } from '../../helpers/cdnImages';

// Drag and Drop
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


class PhotoCover extends Component {

  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any,
    listId: PropTypes.number.isRequired,
    listPhotos: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })),
    coverPhoto: PropTypes.number
  };

  static defaultProps = {
    listPhotos: []
  };

  onDragEnd = result => {
    const { destination, source, draggableId } = result;
    const { listPhotos, change, sortListPhotos } = this.props;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sortedPhotos = Array.from(listPhotos);

    const removedPhoto = sortedPhotos.splice(source.index, 1);
    sortedPhotos.splice(destination.index, 0, removedPhoto[0]);

    const photosSorting = sortedPhotos.map(photo => photo.id);

    // Change forms value
    change('photosSorting', photosSorting);

    // Change store value
    sortListPhotos(sortedPhotos);
  }

  radioGroup = ({ label, name, options, input }) => (
    <ul className={s.listContainer}>
      {options.map((option, index) => (
        <li className={s.listContent} key={index}>
          <span className={s.checkBoxSection}>
            <input
              type="radio"
              name={input.name}
              value={option.id}
              onChange={() => input.onChange(option.id)}
            />
          </span>
          <span className={cx(s.checkBoxSection, s.checkBoxLabel)}>
            <span className={cx(s.checkboxLabel, s.noPadding)}>
              <img
                src={listingBaseUrl() + option.name}
                style={{ height: 100, width: 100 }}
              />
            </span>
          </span>
        </li>))
      }
    </ul>
  );


  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage, previousPage } = this.props;
    const { listPhotos, listId, coverPhoto } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId='allListPhotos'>
          {(provided) => (
            <span ref={provided.innerRef} {...provided.droppableProps}>
              <ListGroup className={cx(s.photoListGroup)}>
                <div>
                  <h3 className={s.landingContentTitle}><FormattedMessage {...messages.setCoverPhoto} /></h3>
                  <p>
                    <FormattedMessage {...messages.photosSortingDescription} />
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className={s.landingMainContent}>
                      <FormGroup className={s.formGroup}>
                        <div className={cx('row')}>
                          {
                            listPhotos && listPhotos.map((photo, index) => (
                              <Draggable draggableId={photo.id.toString()} index={index} key={photo.id}>
                                {provided => (
                                  <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={cx('col-lg-6 col-md-6 col-sm-6 col-xs-12')}>
                                    <ListGroupItem className={s.listPhotoCover}>
                                      <div className={s.listPhotoMedia}>
                                        <img className={s.imgResponsive}
                                          src={listingBaseUrl() + 'x_medium_' + photo.name}
                                        />
                                      </div>
                                      <div className={s.coverPhotoSelection}>
                                        <Field
                                          className={cx(s.coverPhotoCheckbox, s.radioSize)}
                                          type="radio"
                                          component="input"
                                          name="coverPhoto"
                                          value={photo.id}
                                          checked={coverPhoto == photo.id ? true : false}
                                        />
                                        <span> Cover</span>
                                      </div>
                                    </ListGroupItem>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          }
                        </div>
                      </FormGroup>
                    </div>
                  </form>
                </div>
                {provided.placeholder}
              </ListGroup>
            </span>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

PhotoCover = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  onSubmit: submit
})(PhotoCover);

const selector = formValueSelector('RetreatForm'); // <-- same as form name
const mapState = (state) => ({
  coverPhoto: selector(state, 'coverPhoto'),
  listPhotos: state.location.listPhotos
});
const mapDispatch = { change, sortListPhotos };

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(PhotoCover)))
