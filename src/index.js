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

class Improviser extends React.Component {
  constructor(props) {
    super(props);
    this.chords = [];

  }

  render(){

    const model =  new mm.Coconet('https://storage.googleapis.com/magentadata/js/checkpoints/coconet/bach');
    const init_model = async ({model}) => {
      return await model.initialize();
    }

    const sfUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus';
    const player = new mm.SoundFontPlayer(sfUrl);
    var playing;


    const getNoteSequence = ()=>{
      var sequence = {notes:[], quantizationInfo: {stepsPerQuarter: 3}};
      var step = 0;
          this.chords.forEach((chord, i)=>{
            mm.chords.ChordSymbols.pitches(chord.value).forEach((pitch, j)=>{
                sequence.notes.push(
                  { pitch: pitch + 60,
                    instrument: "1",
                    quantizedStartStep: step,
                    quantizedEndStep: step + 1
                  }
                );
                step++;
          });
        });
        return sequence
      }


    // Sample over chord progression.
    const generate = () => {
      console.log("generating");

      var seed = getNoteSequence();
      model.infill(seed, {
        temperature: 0.99,
      }).then((output) =>{
        // output.notes.forEach((note) => {
        //   note.instrument = note.instrument.toString();
        // });
        this.seq = mm.sequences.mergeConsecutiveNotes(output);
        console.log(this.seq)
        this.forceUpdate();
        console.log("done");

        //saveAs(new File([seqmidi], 'bach.mid'));
      })

      // this.seq = {
      //               quantizationInfo: {stepsPerQuarter: STEPS_PER_QUARTER},
      //               notes: [],
      //               totalQuantizedSteps: 1
      //             };
      // const chords = this.chords.map(e=>e.value);
      // const STEPS_PER_PROG = chords.length * STEPS_PER_CHORD;
      //
      // // Prime with root note of the first chord.
      //
      // model.continueSequence(this.seq, ( NUM_REPS * STEPS_PER_PROG ) - 1, 1, chords)
      //   .then((contSeq) => {
      //
      //     // Add the continuation to the original.
      //     contSeq.notes.forEach((note) => {
      //       note.quantizedStartStep += 1;
      //       note.quantizedEndStep += 1;
      //       note.instrument = 0;
      //       this.seq.notes.push(note);
      //     });
      //
      //
      //     for (var i=0; i<NUM_REPS; i++) {
      //
      //       chords.forEach((chord, j)=>{
      //         // Add bass
      //         const root = mm.chords.ChordSymbols.root(chord);
      //         this.seq.notes.push({
      //           instrument: 1,
      //           program: 0,
      //           pitch: 36 + root,
      //           quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
      //           quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD
      //         });
      //
      //         // Add Chords
      //         mm.chords.ChordSymbols.pitches(chord).forEach((pitch, k)=>{
      //           this.seq.notes.push({
      //             instrument: 2,
      //             program: 0,
      //             pitch: 48 + pitch,
      //             quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
      //             quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD
      //           });
      //         })
      //
      //       })
      //
      //     }
      //
      //     // Set total sequence length.
      //     this.seq.totalQuantizedSteps = STEPS_PER_PROG * NUM_REPS;
      //     console.log(this.seq);
      //
      //   })

    }

    const playOnce = () => {
      if(this.seq){
        player.start(this.seq, 90).then(() => {
          playing = false;
        });
      }
    }

    const play = () => {

      playing = true;
      mm.Player.tone.context.resume();
      player.stop();
      playOnce();
    }

    const download = () => {
      if (!this.seq) {
        alert('You must generate a trio before you can download it!');
      } else {
        saveAs(new File([mm.sequenceProtoToMidi(this.seq)], 'seq.mid'));
      }
    }


    return   <div className="container">
                     <Async promiseFn={init_model} model={model}>
                       <Async.Pending>Loading...</Async.Pending>
                       <Async.Fulfilled>
                          <Phrase id='chords' className="row" chords={this.chords} onChange= {(chords)=>{this.chords=chords}}/>
                       <br/>
                        <Button variant="outline-primary" onClick = {generate}>Generate</Button>
                       {this.seq?(
                         <div>
                          <Button variant="outline-primary" onClick = {play}>Play</Button>
                          <Button variant="outline-primary" onClick = {download}>download</Button>
                         </div>
                       ):""
                       }
                       </Async.Fulfilled>
                       <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
                     </Async>
             </div>
  }
}



ReactDOM.render(<Improviser />,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
