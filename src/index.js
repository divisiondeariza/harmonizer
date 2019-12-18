import React from 'react';
import ReactDOM from 'react-dom';
import * as mm from '@magenta/music';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Async from "react-async"
import ChordInput from "./ChordInput"


class Improviser extends React.Component {

  render(){

    // Number of steps to play each chord.
    const STEPS_PER_CHORD = 8;
    const STEPS_PER_PROG = 4 * STEPS_PER_CHORD;

    // Number of times to repeat chord progression.
    const NUM_REPS = 4;
    const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
    const init_model = async ({model}) => {
      return await model.initialize();
    }

    const player = new mm.Player();
    var playing;

    // Current chords being played.
    var currentChords = undefined;
    // Sample over chord progression.
    const playOnce = () => {
      const chords = currentChords;

      // Prime with root note of the first chord.
      const seq = {
        quantizationInfo: {stepsPerQuarter: 4},
        notes: [],
        totalQuantizedSteps: 1
      };

      //document.getElementById('message').innerText = 'Improvising over: ' + chords;
      model.continueSequence(seq, STEPS_PER_PROG + (NUM_REPS-1)*STEPS_PER_PROG - 1, 0.9, chords)
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
            seq.notes.push({
              instrument: 1,
              program: 32,
              pitch: 36 + roots[0],
              quantizedStartStep: i*STEPS_PER_PROG,
              quantizedEndStep: i*STEPS_PER_PROG + STEPS_PER_CHORD
            });
            seq.notes.push({
              instrument: 1,
              program: 32,
              pitch: 36 + roots[1],
              quantizedStartStep: i*STEPS_PER_PROG + STEPS_PER_CHORD,
              quantizedEndStep: i*STEPS_PER_PROG + 2*STEPS_PER_CHORD
            });
            seq.notes.push({
              instrument: 1,
              program: 32,
              pitch: 36 + roots[2],
              quantizedStartStep: i*STEPS_PER_PROG + 2*STEPS_PER_CHORD,
              quantizedEndStep: i*STEPS_PER_PROG + 3*STEPS_PER_CHORD
            });
            seq.notes.push({
              instrument: 1,
              program: 32,
              pitch: 36 + roots[3],
              quantizedStartStep: i*STEPS_PER_PROG + 3*STEPS_PER_CHORD,
              quantizedEndStep: i*STEPS_PER_PROG + 4*STEPS_PER_CHORD
            });
          }

          // Set total sequence length.
          seq.totalQuantizedSteps = STEPS_PER_PROG * NUM_REPS;

          // Play it!
          player.start(seq, 120).then(() => {
            playing = false;
            //checkChords();
          });
        })
    }

    const play = () => {
      playing = true;
      document.getElementById('play').disabled = true;
      currentChords = [...ReactDOM.findDOMNode(this).querySelector('table').querySelectorAll('input')].map(e=>e.value);
      console.log(currentChords);
      mm.Player.tone.context.resume();
      player.stop();
      playOnce();
      document.getElementById('play').disabled = false;
    }



    return   <div>Nuestros hermanos Estadounidenses, Alemanes y Taiwaneses nos han hecho entrar
             en la era de la tecnología digital a tal punto que lo único que tenés que
             hacer es poner el dedo y apretar un botón...
                     <Async promiseFn={init_model} model={model}>
                       <Async.Pending>Loading...</Async.Pending>
                       <Async.Fulfilled>
                       <div id='chords'>
                         <table>
                          <tbody>
                             <tr>
                               <td><ChordInput value='C'/></td>
                               <td><ChordInput value='G'/></td>
                               <td><ChordInput value='Am'/></td>
                               <td><ChordInput value='F'/></td>
                             </tr>
                          </tbody>
                         </table>
                       </div>
                       <br/>
                       <input id='play' type='button' value='Play' onClick = {play}/>
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
