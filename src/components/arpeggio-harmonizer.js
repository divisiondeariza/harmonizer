import React from 'react';
import * as mm from '@magenta/music';
import Async from "react-async"
import Arpeggiator from '../coconet-utils/arpeggios.js'
import harmonizerModel from '../coconet-utils/harmonizer-model'
import Phrase from "./Phrase"
import GeneratorButton from './generator-button'
import PlayerComponent from './player-component'

import './arpeggio-harmonizer.css'

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
                      <Phrase className="row" onChange= {(chords)=>{this.chords=chords}}/>
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

export default ArpeggioHarmonizer
