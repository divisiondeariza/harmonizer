import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

class GeneratorButton extends React.Component {
  constructor(props) {
    super(props);
    this.promiseFn = props.promiseFn;
    this.state = { isGenerating: false };
  }

  render(){
    const onClick = ()=>{
      this.props.promiseFn().then(()=>{
        this.setState({ isGenerating: false });
      });
        this.setState({ isGenerating: true });
      };

    return <div>
              {this.state.isGenerating?(
                <Button variant="outline-primary" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                <span>  </span>
                Generating... </Button>):
                (<Button variant="outline-primary" onClick = { onClick }> Generate </Button>)
              }
            </div>
  }
}

export default GeneratorButton;
