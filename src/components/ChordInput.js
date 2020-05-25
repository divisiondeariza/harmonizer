import React from 'react';
import { chords as mmChords } from '@magenta/music' ;
import "./chord-input.css"

class ChordInput extends React.Component {

  constructor(props){
    super(props);
    this.value = this.props.value;
    this.duration = this.props.duration;
  }

  render(){

    this.value = this.props.value;
    this.duration = this.props.duration;

    const updateDuration = (duration)=>{
      this.duration = duration;
      this.props.onChordUpdate({ value: this.value, duration: this.duration });
    }

    const updateValue = (value)=>{
      this.value = value;
      this.props.onChordUpdate({ value: this.value, duration: this.duration });
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
              <div className="lenght-measure">
                  { this.duration }
              </div>
              <input type='text'
                     value={this.value}
                     className={ isGood(this.props.value)?"correct":"incorrect"  }
                     onChange = { event => updateValue(event.target.value) }
                     tabIndex="1"/>
              <input type='number'
                     value={this.duration}
                     onChange = { event => updateDuration(event.target.value) }/>
            </div>
  }
}

export default ChordInput;
