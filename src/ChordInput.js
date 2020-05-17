import React from 'react';
import ReactDOM from 'react-dom';
import { chords as mmChords } from '@magenta/music' ;
import { extended } from "@tonaljs/chord";


class ChordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value};
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.value !== nextProps.value);
  }

  render(){
    const handleChange = () =>{
      checkChord();
      var newChord = this.input.value
      this.props.onChordUpdate(newChord);
    }

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
        mmChords.ChordSymbols.pitches(chord); // odd way of testing, should be improved
        return true;
      }
      catch(e) {
        return false;
      }
    }

    return  <input ref={(ref) => this.input = ref}
                   type='text'
                   value={this.props.value}
                   onChange = {handleChange}/>
  }
}

export default ChordInput;
