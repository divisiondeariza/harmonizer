import React from 'react';
import ReactDOM from 'react-dom';
import * as mm from '@magenta/music';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Async from "react-async"
import ChordInput from "./ChordInput"
import { saveAs } from 'file-saver';


class Improviser extends React.Component {

  render(){

    // Number of steps to play each chord.

    const STEPS_PER_CHORD = 8;

    // Number of times to repeat chord progression.
    const NUM_REPS = 1;
    const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
    const init_model = async ({model}) => {
      return await model.initialize();
    }

    const player = new mm.Player();
    var playing;

    // Current chords being played.
    var currentChords = undefined;
    var seq;

    // Sample over chord progression.
    const generate = () => {
      console.log("generating");
      currentChords = [...ReactDOM.findDOMNode(this).querySelector('#chords').querySelectorAll('input')].map(e=>e.value);
      const chords = currentChords;
      const STEPS_PER_PROG = chords.length * STEPS_PER_CHORD;

      // Prime with root note of the first chord.
      seq = {
        quantizationInfo: {stepsPerQuarter: 4},
        notes: [],
        totalQuantizedSteps: 1
      };

      model.continueSequence(seq, ( NUM_REPS * STEPS_PER_PROG ) - 1, 1, chords)
        .then((contSeq) => {

          // Add the continuation to the original.
          contSeq.notes.forEach((note) => {
            note.quantizedStartStep += 1;
            note.quantizedEndStep += 1;
            seq.notes.push(note);
          });

          const roots = chords.map(mm.chords.ChordSymbols.root);
          for (var i=0; i<NUM_REPS; i++) {
            // Add the bass progression.
            for (var j=0; j<chords.length; j++){
              seq.notes.push({
                instrument: 1,
                program: 32,
                pitch: 36 + roots[j],
                quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
                quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD
              });
            }
          }

          // Set total sequence length.
          seq.totalQuantizedSteps = STEPS_PER_PROG * NUM_REPS;

        })
        console.log("done");
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
      document.getElementById('play').disabled = true;
      console.log(currentChords);
      mm.Player.tone.context.resume();
      player.stop();
      playOnce();
      document.getElementById('play').disabled = false;
    }

    const download = () => {
      if (!seq) {
        alert('You must generate a trio before you can download it!');
      } else {
        saveAs(new File([mm.sequenceProtoToMidi(seq)], 'seq.mid'));
      }
    }


    return   <div class="container">Nuestros hermanos Estadounidenses, Alemanes y Taiwaneses nos han hecho entrar
             en la era de la tecnología digital a tal punto que lo único que tenés que
             hacer es poner el dedo y apretar un botón...
                     <Async promiseFn={init_model} model={model}>
                       <Async.Pending>Loading...</Async.Pending>
                       <Async.Fulfilled>
                       <div id='chords' class="row">
                               <div class="col-1"><ChordInput value='D'/></div>
                               <div class="col-1"><ChordInput value='Cm'/></div>
                               <div class="col-1"><ChordInput value='Gm'/></div>
                               <div class="col-1"><ChordInput value='D'/></div>
                               <div class="col-1"><ChordInput value='F'/></div>
                               <div class="col-1"><ChordInput value='F'/></div>
                               <div class="col-1"><ChordInput value='F'/></div>
                               <div class="col-1"><ChordInput value='F'/></div>
                               <div class="col-1"><ChordInput value='Em'/></div>
                               <div class="col-1"><ChordInput value='Em'/></div>
                               <div class="col-1"><ChordInput value='Eb'/></div>
                               <div class="col-1"><ChordInput value='Eb'/></div>
                               <div class="col-1"><ChordInput value='D'/></div>
                               <div class="col-1"><ChordInput value='D'/></div>
                               <div class="col-1"><ChordInput value='Gm'/></div>
                               <div class="col-1"><ChordInput value='Gm'/></div>
                               <div class="col-1"><ChordInput value='D'/></div>
                               <div class="col-1"><ChordInput value='D'/></div>
                               <div class="col-1"><ChordInput value='Gm'/></div>
                               <div class="col-1"><ChordInput value='F'/></div>
                       </div>
                       <br/>
                       <input id='play' type='button' value='Generate' onClick = {generate}/>
                       <input id='play' type='button' value='Play' onClick = {play}/>
                       <input id='play' type='button' value='Download' onClick = {download}/>
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
