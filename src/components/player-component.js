import React from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import * as mm from '@magenta/music';
import { saveAs } from 'file-saver';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloudDownloadRoundedIcon from '@material-ui/icons/CloudDownloadRounded';

class PlayerComponent extends React.Component {
  constructor(props){
    super(props);
    this.player = new mm.SoundFontPlayer(props.soundfontUrl);
    this.state = { sequence: null, bpm: 90 }
  }

  updateSequence(sequence){
    this.setState({
      sequence: sequence,
    })
  }

  updateBpm(bpm){
    this.setState({
      bpm: bpm,
    })
  }

  render(){
    const play = () => {
      this.player.start(this.state.sequence, this.state.bpm);
    }

    const download = () => {
        saveAs(new File([mm.sequenceProtoToMidi(this.state.sequence)], 'seq.mid'));
    }

    const updateBmp = this.updateBpm.bind(this);

    return (<div className="content">
              {this.state.sequence?(
                <div className="row justify-content-center">
                   <InputGroup className="col-2" >
                     <InputGroup.Prepend>
                       <InputGroup.Text id="bpm-label">bpm:</InputGroup.Text>
                     </InputGroup.Prepend>
                     <FormControl
                       placeholder=""
                       value= { `${this.state.bpm}` }
                       aria-describedby="bpm-label"
                       type="number"
                       onChange= { event => updateBmp( event.target.value ) }
                     />
                   </InputGroup>
                   <div className="col-1" >
                     <Button variant="outline-primary" onClick = { play }>
                        <PlayArrowIcon/>
                     </Button>
                   </div>
                   <div className="col-1">
                     <Button variant="outline-primary" onClick = { download }>
                        <CloudDownloadRoundedIcon/>
                     </Button>
                   </div>
                </div>
              ):""}
           </div>)
  }
}

export default PlayerComponent;
