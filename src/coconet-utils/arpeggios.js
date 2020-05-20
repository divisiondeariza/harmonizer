import { chords as mmChords } from '@magenta/music' ;
import { sequences as mmSequences } from '@magenta/music' ;

class Arpeggiator{

  getNoteSequenceFromChords(chords){
      var chordsSequences = chords.map((chord)=>this.generateArpeggio(chord));
      return mmSequences.concatenate(chordsSequences);
  }

  generateArpeggio(chord){
    var sequence = {notes:[], quantizationInfo: {stepsPerQuarter: 4}};
    var pitches = mmChords.ChordSymbols.pitches(chord);

    // Black magic in order to keep arpegios simple and keep them inside the requirements for the model
    var scaledPitches = pitches.map( pitch => pitch + 60);

    if(Math.min.apply(scaledPitches) === scaledPitches[0]){
      scaledPitches.push(scaledPitches[0] + 12)
    }else{
      scaledPitches.push(scaledPitches[0] - 12)
    }

    scaledPitches.sort();

    var numNotes = 8;
    for (var i = 0; i < numNotes; i++) {
      sequence.notes.push(
        { pitch: scaledPitches[i%4],
          instrument: this.getInstrument(scaledPitches[i%4]),
          quantizedStartStep: i,
          quantizedEndStep: i + 1
        }
      );
    }
    sequence.totalQuantizedSteps = numNotes;
    return sequence;
  }

  getInstrument(pitch){
    // this order is intentional
    if(pitch < 75 && pitch > 51) return 1;
    else if(pitch < 70 && pitch > 45) return 2;
    else if(pitch > 59) return 0;
    else return 3;
  }
}

export default Arpeggiator;
