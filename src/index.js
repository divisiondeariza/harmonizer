import React from 'react';
import ReactDOM from 'react-dom';
import * as mm from '@magenta/music';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Async from "react-async"
import { saveAs } from 'file-saver';
import Phrase from "./Phrase"
import { Button, Spinner } from 'react-bootstrap';
import Arpeggiator from './coconet-utils/arpeggios.js'
import harmonizerModel from './coconet-utils/harmonizer-model.js'


class GenerateButton extends React.Component {
  constructor(props) {
    super(props);
    this.promiseFn = props.promiseFn;
    this.state = { isGenerating: false };
    this.promise = null
  }

  render(){
    const onClick = ()=>{
      var promise = this.props.promiseFn().then(()=>{
        this.setState({ isGenerating: false });
      });
      this.setState({ isGenerating: true });
    };

    return <div>
              {this.state.isGenerating?(
                <Button variant="outline-primary" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                <span>  </span>
                Generating... </Button>):
                (<Button variant="outline-primary" onClick = { onClick }> Generate </Button>)
              }
            </div>
  }
}

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
                 <Button variant="outline-primary" onClick = { play }>Play</Button>
                 <Button variant="outline-primary" onClick = { download }>Download</Button>
                </div>
              ):""}
           </div>)
  }
}

class ArpeggioHarmonizer extends React.Component {
  constructor(props) {
    super(props);
    this.chords = [];
    this.arpegiator = new Arpeggiator();
    this.playerElement = React.createRef();
  }

  render(){
    const getModel = async() => harmonizerModel.getModel();

    const sfUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus';
    const player = new mm.SoundFontPlayer(sfUrl);

    // Sample over chord progression.
    const generate = (model) => {
      var seed = this.arpegiator.getNoteSequenceFromChords(this.chords.map(chord=>chord.value));

      console.log("generating");
      return model.infill(seed, {
                temperature: 0.99,
              }).then((output) =>{
                this.playerElement.current.updateSequence(mm.sequences.mergeConsecutiveNotes(output));
                console.log("done");
              });
    }

    const play = (seq) => {
      player.start(seq, 90);
    }

    const download = () => {
        saveAs(new File([mm.sequenceProtoToMidi(this.seq)], 'seq.mid'));
    }

    return   <div className="container">
                     <Async promiseFn={getModel}>
                       <Async.Pending>Loading...</Async.Pending>
                       <Async.Fulfilled>
                       { model => (
                          <div>
                            <Phrase id='chords' className="row" chords={this.chords} onChange= {(chords)=>{this.chords=chords}}/>
                            <br/>
                            <GenerateButton promiseFn = {() => generate(model)} />
                            <PlayerComponent ref={ this.playerElement } soundfontUrl = {sfUrl} />
                           </div>
                          )}
                       </Async.Fulfilled>
                       <Async.Rejected>{error => `Something went wrong: ${error}`}</Async.Rejected>
                     </Async>
             </div>
  }
}

ReactDOM.render(<ArpeggioHarmonizer />,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
