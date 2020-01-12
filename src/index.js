import React from 'react';
import ReactDOM from 'react-dom';
import * as mm from '@magenta/music';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Async from "react-async"
import { saveAs } from 'file-saver';
import Phrase from "./Phrase"

class Improviser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chords: []};
  }

  render(){

    // Number of steps to play each chord.
    const STEPS_PER_QUARTER = 6;
    const CHORDS_PER_BAR = 2;
    const STEPS_PER_CHORD = STEPS_PER_QUARTER * 4 / CHORDS_PER_BAR;


    // Number of times to repeat chord progression.
    const NUM_REPS = 1;
    const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
    const init_model = async ({model}) => {
      return await model.initialize();
    }

    const sfUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus';
    const player = new mm.SoundFontPlayer(sfUrl);
    var playing;

    // Current chords being played.
    var currentChords = undefined;
    var seq;

    // Sample over chord progression.
    const generate = () => {
      console.log("generating");
      currentChords = [...ReactDOM.findDOMNode(this).querySelector('#chords').querySelectorAll('.chord > input')].map(e=>e.value);
      console.log(currentChords);
      const chords = currentChords;
      const STEPS_PER_PROG = chords.length * STEPS_PER_CHORD;

      // Prime with root note of the first chord.
      seq = {
        quantizationInfo: {stepsPerQuarter: STEPS_PER_QUARTER},
        notes: [],
        totalQuantizedSteps: 1
      };

      model.continueSequence(seq, ( NUM_REPS * STEPS_PER_PROG ) - 1, 1, chords)
        .then((contSeq) => {

          // Add the continuation to the original.
          contSeq.notes.forEach((note) => {
            note.quantizedStartStep += 1;
            note.quantizedEndStep += 1;
            note.instrument = 0;
            seq.notes.push(note);
          });


          for (var i=0; i<NUM_REPS; i++) {

            chords.forEach((chord, j)=>{
              // Add bass
              const root = mm.chords.ChordSymbols.root(chord);
              seq.notes.push({
                instrument: 1,
                program: 0,
                pitch: 36 + root,
                quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
                quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD
              });

              // Add Chords
              mm.chords.ChordSymbols.pitches(chord).forEach((pitch, k)=>{
                seq.notes.push({
                  instrument: 2,
                  program: 0,
                  pitch: 48 + pitch,
                  quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
                  quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD
                });
              })

            })

          }

          // Set total sequence length.
          seq.totalQuantizedSteps = STEPS_PER_PROG * NUM_REPS;
          console.log(seq);

        })
        console.log("done");
        play()
    }

    const playOnce = () => {
      if(seq){
        player.start(seq, 120).then(() => {
          playing = false;
        });
      }
    }

    const play = () => {
      playing = true;
      console.log(currentChords);
      mm.Player.tone.context.resume();
      player.stop();
      playOnce();
    }

    const download = () => {
      if (!seq) {
        alert('You must generate a trio before you can download it!');
      } else {
        saveAs(new File([mm.sequenceProtoToMidi(seq)], 'seq.mid'));
      }
    }


    return   <div className="container">
                     <Async promiseFn={init_model} model={model}>
                       <Async.Pending>Loading...</Async.Pending>
                       <Async.Fulfilled>
                          <Phrase id='chords' className="row" />
                       <br/>
                       <input  type='button' value='Generate & Play' onClick = {() => {generate(); play();}}/>
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
