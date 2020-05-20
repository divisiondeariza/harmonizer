import { Coconet } from '@magenta/music' ;

class HarmonizerModel{
  constructor(){
    this.model = new Coconet('https://storage.googleapis.com/magentadata/js/checkpoints/coconet/bach');
  }

  async getModel(){
    if(!this.model.isInitialized()){
      await this.model.initialize();
    }
    return this.model
  }
}

export default new HarmonizerModel();
