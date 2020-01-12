import React from 'react';
import ChordInput from "./ChordInput"
import Button from 'react-bootstrap/Button';

class Phrase extends React.Component {
  constructor(props) {
    super(props);
    this.chords = this.props.chords;
    this.onChange = this.props.onChange;
  }

  render(){

    const onChangeChords=()=>{
      this.onChange(this.chords);
      this.forceUpdate()
    }

    const addChord = (index) => {
      this.chords.splice(index, 0, {value: ""});
      onChangeChords()
    }

    const removeChord = (index) => {
      this.chords.splice(index, 1);
      onChangeChords()
    }

    const onChordUpdate = (newChord, index) => {
      this.chords.splice(index, 1, {value: newChord});
      onChangeChords()
    }

    const renderChords = () => {
      return this.chords.map((chord, index) => {
        return <div key={index} className="col-1 chord">
                  <ChordInput value={chord.value} onChordUpdate={(newChordValue)=>onChordUpdate(newChordValue, index)}/>
                  <Button variant="outline-danger" size="sm" onClick={()=>{removeChord(index)}}>-</Button>
                  {renderAddButton(index + 1)}
               </div>
      })
    }

    const renderAddButton = (index) =>{
        return <Button variant="outline-success" size="sm" onClick={()=>{addChord(index)}}>+</Button>
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
