import React from 'react';
import ChordInput from "./ChordInput"
import Button from 'react-bootstrap/Button';

class Phrase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chords: [] }
  }

  componentDidUpdate(prevProps) {
    this.props.onChange(this.state.chords);
  }

  render(){

    const addChord = (index) => {
      var chords = this.state.chords.slice();
      chords.splice(index, 0, {value: ""})
      this.setState({ chords: chords });
    }

    const removeChord = (index) => {
      var chords = this.state.chords.slice();
      chords.splice(index, 1);
      this.setState({ chords: chords });
    }

    const onChordUpdate = (newChord, index) => {
      var chords = this.state.chords.slice();
      chords.splice(index, 1, newChord);
      this.setState({ chords: chords });
    }

    const renderChords = () => {
      return this.state.chords.map((chord, index) => {
        return <div key={index} className="col-3 chord">
                  <ChordInput value={chord.value} onChordUpdate={(newChordValue)=>onChordUpdate(newChordValue, index)}/>
                  <Button variant="outline-danger" size="sm" onClick={()=>{removeChord(index)}}>-</Button>
                  {renderAddButton(index + 1)}
               </div>
      })
    }

    const renderAddButton = (index) =>{
        return <Button variant="outline-success" size="sm" onClick={()=>{addChord(index)}}>+</Button>
    }

    return <div className="row">
              <div className="col-1">
                  {renderAddButton(0)}
              </div>
              <div className="col-11">
                <div className="row">
                  {renderChords()}
                </div>
              </div>
           </div>
  }
}

export default Phrase;
