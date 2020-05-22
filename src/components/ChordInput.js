import React from 'react';
import { chords as mmChords } from '@magenta/music' ;

class ChordInput extends React.Component {

  constructor(props){
    super(props);
    this.valueRef = React.createRef();
    this.durationRef = React.createRef();
  }

  render(){
    const handleChange = (event) =>{
      check();
      this.props.onChordUpdate({ value: this.valueRef.current.value, duration: this.durationRef.current.value });
    }

    const check = () => {
      const input = this.valueRef.current;
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

    return  <div>
              <input ref={ this.valueRef }
                   type='text'
                   value={this.props.value}
                   onChange = {handleChange}/>
              <input ref={ this.durationRef }
                   type='number'
                   value={this.props.duration}
                   onChange = {handleChange}/>
            </div>
  }
}

export default ChordInput;
