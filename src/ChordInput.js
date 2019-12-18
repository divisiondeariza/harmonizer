import React from 'react';
import ReactDOM from 'react-dom';
import { chords as mmChords } from '@magenta/music' ;


class ChordInput extends React.Component {

  render(){
    const checkChord = () => {
      const input = ReactDOM.findDOMNode(this);
      const chord = input.value;

      if (isGood(chord)) {
        input.style.color = 'black';
      } else {
        input.style.color = 'red';
      }
    }

    const isGood = (chord) => {
      if (!chord) {
        return false;
      }
      try {
        mmChords.ChordSymbols.pitches(chord);
        return true;
      }
      catch(e) {
        return false;
      }
    }

    return  <input type='text' defaultValue={this.props.value} onChange = {checkChord}/>
  }
}

export default ChordInput;
