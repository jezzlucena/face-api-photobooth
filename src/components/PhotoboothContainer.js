import React from 'react'
import FaceDetectionSketch from './FaceDetectionSketch'
import UploadDialog from './UploadDialog'
import P5Wrapper from 'react-p5-wrapper'
import './PhotoboothContainer.scss'

import Fab from '@material-ui/core/Fab'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import CameraIcon from '@material-ui/icons/CameraAlt'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import ReplayIcon from '@material-ui/icons/Replay'
import CloseIcon from '@material-ui/icons/Close'


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
const UPLOAD = 'UPLOAD'

export default class PhotoboothContainer extends React.Component {
  constructor() {
    super()

    this.state = {
      currentFilter: 0,
      mode: STAND_BY
    }
  }

  handleUpload() {
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
    .then(data => this.setState({imageUrl: data.imageUrl}))
    .catch(err => this.setState({uploadError: true}))

    this.setState({mode: UPLOAD, uploadError: false, imageUrl: null})
  }

  handlePreviousFilter() {
    this.setState({
      currentFilter: (this.state.currentFilter+FILTERS.length-1) % FILTERS.length
    })
  }

  handleNextFilter() {
    this.setState({
      currentFilter: (this.state.currentFilter+1) % FILTERS.length
    })
  }

  handleReset() {
    this.setState({
      mode: STAND_BY,
      currentFilter: 0,
      uploadError: false,
      imageUrl: null,
    })
  }

  renderActionButtons() {
    switch (this.state.mode) {
      case STAND_BY:
        return <Button
          className="PhotoboothContainer-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => { this.setState({mode: DETECT}) }}
          startIcon={<CameraIcon/>}
        >Take a photo</Button>
      case DETECT:
        return <ButtonGroup
          size="large"
          variant="contained"
          aria-label="large contained button group"
        >
            <Button
              color="default"
              onClick={() => this.handlePreviousFilter()}
            ><NavigateBeforeIcon/></Button>
            <Button
              onClick={() => { this.setState({currentFilter: 0}) }}
              style={{width: 200}}
            >{FILTERS[this.state.currentFilter]}</Button>
            <Button
              onClick={() => this.handleNextFilter()}
            ><NavigateNextIcon/></Button>
        </ButtonGroup>
      case FINISHED:
        return <div>
          <Button
            className="PhotoboothContainer-button"
            variant="contained"
            color="default"
            size="large"
            onClick={() => { this.setState({mode: DETECT}) }}
            startIcon={<ReplayIcon/>}
          >Retake</Button>
          <Button
            className="PhotoboothContainer-button"
            variant="contained"
            color="primary"
            size="large"
            onClick={() => this.handleUpload()}
            startIcon={<CloudUploadIcon />}
          >Upload Photo</Button>
        </div>
      default:
        return null
    }
  }

  render() {
    let wrapperFinishedClass = [FINISHED, UPLOAD].includes(this.state.mode) ? 'finished' : ''

    return (
      <div className="PhotoboothContainer">
        <div className={`PhotoboothContainer-wrapper ${wrapperFinishedClass}`}>
          <P5Wrapper
            sketch={FaceDetectionSketch}
            capturing={[STAND_BY, DETECT].includes(this.state.mode)}
            detecting={this.state.mode === DETECT}
            filter={FILTERS[this.state.currentFilter]}
            onTakePicture={imageData => { this.setState({imageData, mode: FINISHED}) }}
          />
        </div>

        <div className="PhotoboothContainer-actions">
          {this.renderActionButtons()}
        </div>

        {this.state.mode === DETECT &&
          <Paper className="PhotoboothContainer-instructions">
            Smile within the frame to take a picture
          </Paper>
        }

        <UploadDialog
          open={this.state.mode === UPLOAD}
          imageUrl={this.state.imageUrl}
          error={this.state.uploadError}
          onRetry={() => this.handleUpload()}
          onReset={() => this.handleReset()}
        />

        {[FINISHED, DETECT].includes(this.state.mode) &&
          <Fab
            className="PhotoboothContainer-close"
            color="secondary"
            onClick={() => this.handleReset()}
          ><CloseIcon/></Fab>
        }
      </div>
    )
  }
}