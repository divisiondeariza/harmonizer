import React from 'react';
import { Button } from 'react-bootstrap';
import * as mm from '@magenta/music';
import { saveAs } from 'file-saver';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloudDownloadRoundedIcon from '@material-ui/icons/CloudDownloadRounded';

class PlayerComponent extends React.Component {
  constructor(props){
    super(props);
    this.player = new mm.SoundFontPlayer(props.soundfontUrl);
    this.state = { sequence: null }
  }

  updateSequence(sequence){
    this.setState({
      sequence: sequence,
    })
  }

  render(){
    const play = () => {
      this.player.start(this.state.sequence, 90);
    }

    const download = () => {
        saveAs(new File([mm.sequenceProtoToMidi(this.state.sequence)], 'seq.mid'));
    }

    return (<div>
              {this.state.sequence?(
                <div>
                 <Button variant="outline-primary" onClick = { play }>
                    <PlayArrowIcon/>
                 </Button>
                 <Button variant="outline-primary" onClick = { download }>
                    <CloudDownloadRoundedIcon/>
                 </Button>
                </div>
              ):""}
           </div>)
  }
}

export default PlayerComponent;
