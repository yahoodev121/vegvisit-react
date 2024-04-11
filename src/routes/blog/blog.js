import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './blog.css';
import {
    Grid,
    Row,
    Col
} from 'react-bootstrap';
import cx from 'classnames';

// Components
import BlogContent from '../../components/BlogContent/BlogContent';


class Blog extends React.Component {
    
    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    render() {
        const { title,image,initialValues } = this.props;
        return (
                <div>
                 <BlogContent initialValues={initialValues} />
                </div>
        );
    }

}

export default withStyles(s)(Blog);
