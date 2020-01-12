import React from 'react';
import ChordInput from "./ChordInput"
import Button from 'react-bootstrap/Button';

class Phrase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chords: []};
  }

  render(){
    const addChord = (index) => {
      var chords = this.state.chords;
      chords.splice(index, 0, {value: ""});
      this.setState({chords: chords});
    }

    const removeChord = (index) => {
      var chords = this.state.chords;
      chords.splice(index, 1);
      this.setState({chords: chords});
    }

    const onChordChange = (newChord, index) => {
      var chords = this.state.chords;
      chords.splice(index, 1, {value: newChord});
      this.setState({chords: chords});
    }

    const renderChords = () => {
      return this.state.chords.map((chord, index) => {
        return <div key={index} className="col-1 chord">
                  <ChordInput value={chord.value} onChordChange={(newChordValue)=>onChordChange(newChordValue, index)}/>
                  <Button variant="outline-danger" size="sm" onClick={()=>{removeChord(index)}}> -  </Button>
                  {renderAddButton(index + 1)}
               </div>
      })
    }

    const renderAddButton = (index) =>{
        return <Button variant="outline-primary" size="sm" onClick={()=>{addChord(index)}}> + </Button>
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
