import React from 'react';
import './FaceDetectionContainer.scss';
import FaceDetectionSketch from './FaceDetectionSketch';

import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/CameraAlt';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ReplayIcon from '@material-ui/icons/Replay';
import CloseIcon from '@material-ui/icons/Close';

import P5Wrapper from 'react-p5-wrapper';

const FILTERS = [
  'NO FILTER',
  'THRESHOLD',
  'GRAY',
  'OPAQUE',
  'INVERT',
  'ERODE',
]

const STAND_BY = 'STAND_BY'
const DETECT = 'DETECTING'
const FINISHED = 'FINISHED'

export default class FaceDetectionContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      filter: FILTERS[0],
      currentFilter: 0,
      mode: STAND_BY
    }
  }

  render() {
    let actionButtons

    switch (this.state.mode) {
      case STAND_BY:
        actionButtons = <Button
          className="FaceDetectionContainer-button"
          variant="contained"
          color="primary"
          onClick={() => { this.setState({mode: DETECT}) }}
          startIcon={<CameraIcon/>}
        >Let's get started!</Button>
        break
      case DETECT:
        actionButtons = <div>
          <Fab
            className="FaceDetectionContainer-button "
            color="primary"
            onClick={() => { this.setState({currentFilter: (this.state.currentFilter+FILTERS.length-1) % FILTERS.length}) }}
          ><NavigateBeforeIcon/></Fab>
          <Button
            className="FaceDetectionContainer-button"
            variant="outlined"
            onClick={() => { this.setState({currentFilter: 0}) }}
            style={{color: "white", borderColor: "white"}}
          >{FILTERS[this.state.currentFilter]}</Button>
          <Fab
            className="FaceDetectionContainer-button"
            color="primary"
            onClick={() => { this.setState({currentFilter: (this.state.currentFilter+1) % FILTERS.length}) }}
          ><NavigateNextIcon/></Fab>
        </div>
        break
      case FINISHED:
        actionButtons = <div>
          <Button
            className="FaceDetectionContainer-button"
            variant="contained"
            color="default"
            onClick={() => { this.setState({mode: DETECT}) }}
            startIcon={<ReplayIcon/>}
          >Retake</Button>
          <Button
            className="FaceDetectionContainer-button"
            variant="contained"
            color="primary"
            onClick={() => {
              fetch('https://face-api-photobooth.herokuapp.com/upload', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  base64Image: this.state.imageData,
                })
              })
              .then(response => response.json())
              .then(data => console.log(data))

              this.setState({mode: STAND_BY, currentFilter: 0})
            }}
            startIcon={<CloudUploadIcon />}
          >Upload Photo</Button>
        </div>
        break
    }

    return (
      <div className="FaceDetectionContainer">
        <div className={`FaceDetectionContainer-wrapper ${this.state.mode == 'FINISHED' ? 'finished' : ''}`}>
          <P5Wrapper
            sketch={FaceDetectionSketch}
            capturing={[STAND_BY, DETECT].includes(this.state.mode)}
            detecting={this.state.mode == DETECT}
            filter={FILTERS[this.state.currentFilter]}
            onTakePicture={imageData => { this.setState({imageData, mode: FINISHED}) }}
          />
        </div>
        {[FINISHED, DETECT].includes(this.state.mode) &&
          <Fab
            className="FaceDetectionContainer-close"
            onClick={() => { this.setState({mode: STAND_BY, currentFilter: 0}) }}
          ><CloseIcon/></Fab>
        }
        <div className="FaceDetectionContainer-actions">
          {actionButtons}
        </div>
      </div>
    )
  }
}
