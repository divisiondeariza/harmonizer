import React from 'react';
import ChordInput from "./ChordInput"

class Phrase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chords: []};
  }

  render(){
    const addChord = () => {
      this.setState({chords: [...this.state.chords, ""]});
    }

    const removeChord = () => {
      this.setState({chords: this.state.chords.slice(0,-1)});
    }

    return <div className="row" id={this.props.id}>
              {this.state.chords.map((chord, index) => <div key={index} className="col-1 chord"><ChordInput value={chord}/></div>)}
              <div className="col-1">
                 <input  type='button' value='Add Chord' onClick = {addChord}/>
               </div>
               <div className="col-1">
                  <input  type='button' value='Remove Chord' onClick = {removeChord}/>
                </div>
           </div>
  }
}

export default Phrase;
