import React from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import './UploadDialog.scss'

import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ErrorIcon from '@material-ui/icons/Error'
import ClearIcon from '@material-ui/icons/Clear'
import DoneIcon from '@material-ui/icons/Done'

export default class UploadDialog extends React.Component {
  render() {
    let uploadDialogContent

    if (this.props.error) {
      uploadDialogContent = <div>
        <ErrorIcon color="secondary" style={{ fontSize: 40 }}/>
        <h3>Oops...</h3>
        <div className="UploadDialog-text">
          There was an error uploading your photo to the cloud.
        </div>
        <div>
          <Button
            className="UploadDialog-button"
            variant="contained"
            color="default"
            onClick={() => this.props.onReset()}
            startIcon={<ClearIcon/>}
          >Cancel</Button>
          <Button
            className="UploadDialog-button"
            variant="contained"
            color="primary"
            onClick={() => this.props.onRetry()}
            startIcon={<CloudUploadIcon />}
          >Try Again</Button>
        </div>
      </div>
    } else if (!this.props.imageUrl) {
      uploadDialogContent = <div>
        <CircularProgress/>
        <h3>Uploading...</h3>
        <div className="UploadDialog-text">
          Your download QR Code will appear in a few seconds.
        </div>
        <Button
          className="UploadDialog-button"
          variant="contained"
          color="default"
          onClick={() => this.props.onReset()}
          startIcon={<ClearIcon/>}
        >Cancel</Button>
      </div>
    } else {
      uploadDialogContent = <div>
        <QRCode value={this.props.imageUrl}/>
        <h3>Your photo has been uploaded!</h3>
        <div className="UploadDialog-text">
          Point your phone camera at the QR Code above to download it.
        </div>
        <Button
          className="UploadDialog-button"
          variant="contained"
          color="primary"
          onClick={() => this.props.onReset()}
          startIcon={<DoneIcon/>}
        >All Done</Button>
      </div>
    }

    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.onReset()}
      >
        <div className="UploadDialog-content">
          {uploadDialogContent}
        </div>
      </Dialog>
    )
  }
}

UploadDialog.propTypes = {
  open: PropTypes.bool,
  error: PropTypes.bool,
  onReset: PropTypes.func,
  onRetry: PropTypes.func
}
