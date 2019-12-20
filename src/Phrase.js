import React from 'react';
import ChordInput from "./ChordInput"

class Phrase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chords: []};
  }

  render(){
    const addChord = () => {
      this.setState({chords: [...this.state.chords, {value: ""}]});
    }

    const removeChord = (index) => {
      var chords = this.state.chords;
      chords.splice(index, 1);
      console.log(chords);
      this.setState({chords: chords});
    }

    const onChordChange = (newChord, index) => {
      var chords = this.state.chords;
      chords.splice(index, 1, {value: newChord});
      console.log(chords);
      this.setState({chords: chords});
    }



    const renderChords = () => {
      return this.state.chords.map((chord, index) => {
        return <div key={index} className="col-1 chord">
                  <ChordInput value={chord.value} onChordChange={(newChordValue)=>onChordChange(newChordValue, index)}/>
                  <div onClick={()=>{removeChord(index)}}> - </div>
               </div>
      })
    }

    return <div className="row" id={this.props.id}>
              {renderChords()}
              <div className="col-1">
                 <input  type='button' value='Add Chord' onClick = {addChord}/>
               </div>
           </div>
  }
}

export default Phrase;
