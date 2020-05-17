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

    // Number of steps to play each chord.
    const STEPS_PER_QUARTER = 6;
    const CHORDS_PER_BAR = 2;
    const STEPS_PER_CHORD = STEPS_PER_QUARTER * 4 / CHORDS_PER_BAR;

    // Number of times to repeat chord progression.
    const NUM_REPS = 1;
    //const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
    const model =  new mm.Coconet('https://storage.googleapis.com/magentadata/js/checkpoints/coconet/bach');
    const init_model = async ({model}) => {
      return await model.initialize();
    }

    const sfUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus';
    const player = new mm.SoundFontPlayer(sfUrl);
    var playing;


    const getNoteSequence = ()=>{
      var sequence = {notes:[], quantizationInfo: {stepsPerQuarter: 4}};
      for (let i = 0; i < 24; i++) {


            sequence.notes.push(
              { pitch: 81 - i%12,
                instrument: "0",
                quantizedStartStep: i,
                quantizedEndStep: i
              },
            );
          }
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
        this.seq = output;
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
        console.log("done");
        this.forceUpdate()
    }

    const playOnce = () => {
      if(this.seq){
        player.start(this.seq, 120).then(() => {
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
