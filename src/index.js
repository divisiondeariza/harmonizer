import React from 'react';
import ReactDOM from 'react-dom';
import * as mm from '@magenta/music';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Async from "react-async"
import Phrase from "./components/Phrase"
import Arpeggiator from './coconet-utils/arpeggios.js'
import harmonizerModel from './coconet-utils/harmonizer-model'
import GeneratorButton from './components/generator-button'
import PlayerComponent from './components/player-component'

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

    const generate = (model) => {
      var seed = this.arpegiator.getNoteSequenceFromChords(this.chords.map(chord=>chord));

      return model.infill(seed, {
                temperature: 0.99,
              }).then((output) =>{
                this.playerElement.current.updateSequence(mm.sequences.mergeConsecutiveNotes(output));
              });
    }
    return   <div className="container">
               <Async promiseFn={getModel}>
                 <Async.Pending>Loading...</Async.Pending>
                 <Async.Fulfilled>
                 { model => (
                    <div>
                      <Phrase id='chords' className="row" onChange= {(chords)=>{this.chords=chords}}/>
                      <GeneratorButton promiseFn = {() => generate(model)} />
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
