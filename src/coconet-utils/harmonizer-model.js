import { Coconet } from '@magenta/music' ;

class HarmonizerModel{
  constructor(){
    console.log("brand new model!");
    this.model = new Coconet('https://storage.googleapis.com/magentadata/js/checkpoints/coconet/bach');
    this.init_promise = this.model.initialize();
  }

  async getModel(){
    if(!this.model.isInitialized()){
      console.log("initializing!");
      await this.model.initialize();
    }
    return this.model
  }
}

export default new HarmonizerModel();
