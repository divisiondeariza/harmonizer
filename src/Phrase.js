import React from 'react';
import ChordInput from "./ChordInput"

class Phrase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chords: []};
  }

  render(){
    const addChord = (index) => {
      var chords = this.state.chords;
      chords.splice(index, 0, {value: ""});
      console.log(chords);
      this.setState({chords: chords});
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
                  {renderAddButton(index + 1)}
                  <div onClick={()=>{removeChord(index)}}> - </div>
               </div>
      })
    }

    const renderAddButton = (index) =>{
        return <span onClick={()=>{addChord(index)}}> + </span>
    }

    return <div className="row" id={this.props.id}>
              <div className="col-1">
                  {renderAddButton(0)}
              </div>

              {renderChords()}
           </div>
  }
}

export default Phrase;
