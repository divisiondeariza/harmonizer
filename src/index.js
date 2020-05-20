import React from 'react';
import ReactDOM from 'react-dom';
import * as mm from '@magenta/music';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Async from "react-async"
import { saveAs } from 'file-saver';
import Phrase from "./Phrase"
import Button from 'react-bootstrap/Button';
import Arpeggiator from './coconet-utils/arpeggios.js'
import harmonizerModel from './coconet-utils/harmonizer-model.js'


class ArpeggioHarmonizer extends React.Component {
  constructor(props) {
    super(props);
    this.chords = [];
    this.arpegiator = new Arpeggiator();

  }

  render(){

    const getModel = async() => harmonizerModel.getModel();

    const sfUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus';
    const player = new mm.SoundFontPlayer(sfUrl);

    // Sample over chord progression.
    const generate = (model) => {
      var seed = this.arpegiator.getNoteSequenceFromChords(this.chords.map(chord=>chord.value));

      console.log("generating");
      model.infill(seed, {
        temperature: 0.99,
      }).then((output) =>{
        this.seq = mm.sequences.mergeConsecutiveNotes(output);
        this.forceUpdate();
        console.log("done");
      })

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

                            {false?(
                              <Button variant="outline-primary" > Generating </Button>):
                              (<Button variant="outline-primary" onClick = {() => generate(model)}> Generate </Button>)
                            }

                             {this.seq?(
                               <div>
                                <Button variant="outline-primary" onClick = {()=>{ play(this.seq) } }>Play</Button>
                                <Button variant="outline-primary" onClick = {download}>download</Button>
                               </div>
                             ):""}
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
