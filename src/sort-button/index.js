import React from 'react';
import './index.css';

export default class SortButton extends React.Component {
    render () {
      return (
        <button onClick={this.props.onSortClick} >
          Sort : {this.props.sortBy ? 'Inverted' : 'Normal'}
        </button>
      );
    }
}