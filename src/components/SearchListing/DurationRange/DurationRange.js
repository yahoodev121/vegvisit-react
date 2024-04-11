import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// External component
import { Range } from 'rc-slider';


// Redux form
import { change } from 'redux-form';

// Helper
import { convert } from '../../../helpers/currencyConvertion';

// Styles
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!rc-slider/assets/index.css';

class durationRange extends Component {
    static propTypes = {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        from: PropTypes.string.isRequired,
        base: PropTypes.string.isRequired,
        rates: PropTypes.object.isRequired,
        change: PropTypes.any.isRequired,
        handleSubmit: PropTypes.any
    };

    static defaultProps = {
        min: 0,
        max: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            minDuration: 0,
            maxDuration: 0
        };
        this.updateValue = this.updateValue.bind(this);
        this.onAfterChange = this.onAfterChange.bind(this);
    }

    componentDidMount() {
        const { min, max, minDuration, maxDuration } = this.props;
        if (minDuration && maxDuration) {
            this.setState({
                minDuration,
                maxDuration
            });
        } else if (min && max) {
            this.setState({
                minDuration: min,
                maxDuration: max
            });
        }
    }

    async updateValue(sliderState) {
        const { change, min, max } = this.props;

        if (sliderState && sliderState.length) {
            this.setState({
                minDuration: sliderState[0],
                maxDuration: sliderState[1]
            });
            if (sliderState[0] == min && sliderState[1] == max) {
                await change('SearchForm', 'durationRangeLabel', [min, max]);
            } else {
                await change('SearchForm', 'durationRangeLabel', sliderState);
            }
        }
    }

    async onAfterChange(sliderState) {
        const { change, min, max } = this.props;
        let minDuration, maxDuration;
        let values = sliderState;

        if (sliderState) {
            this.setState({
                minDuration: sliderState[0],
                maxDuration: sliderState[1]
            });
        }

        minDuration = sliderState[0];
        maxDuration = sliderState[1];
        values = [minDuration, maxDuration];
        if (sliderState[0] == min && sliderState[1] == max) {
            await change('SearchForm', 'durationRange', null);
        } else {
            await change('SearchForm', 'durationRange', values);
        }
        await change('SearchForm', 'durationRangeLabel', sliderState);
        await change('SearchForm', 'currentPage', 1);
    }

    render() {
        const { min, max } = this.props;
        const { minDuration, maxDuration } = this.state;

        return (
            <div>
                <Range
                    min={min}
                    max={max}
                    defaultValue={[min, max]}
                    value={[minDuration, maxDuration]}
                    onChange={this.updateValue}
                    onAfterChange={this.onAfterChange}
                    allowCross={true}
                    step={1}
                />
            </div>
        );
    }
}

const mapState = (state) => ({
    base: state.currency.base,
    rates: state.currency.rates
});

const mapDispatch = {
    change
};

export default withStyles(s)(connect(mapState, mapDispatch)(durationRange));