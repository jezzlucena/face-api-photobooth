import React from 'react'
import PropTypes from 'prop-types'
import './EmailDialog.scss'

import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import EmailIcon from '@material-ui/icons/Email'
import ClearIcon from '@material-ui/icons/Clear'

export default class EmailDialog extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.onReset()}
      >
        <div className="EmailDialog-content">
          <h2>One more step</h2>
          <div className="EmailDialog-text">
            Please tell us your email address so we can send you this amazing photo.
          </div>
          <TextField
            className="EmailDialog-input"
            error={this.props.error}
            onChange={event => this.props.onChange(event.target.value)}
            onKeyPress={event => {
              if(event.charCode === 13 && this.props.email && !this.props.error)
                this.props.onConfirm()
            }}
            label="Your Email"
            helperText={this.props.error && "Please enter a valid email address."}
            variant="outlined"
            value={this.props.email || ""}
          />
          <div>
            <Button
              className="EmailDialog-button"
              variant="contained"
              color="default"
              onClick={() => this.props.onReset()}
              startIcon={<ClearIcon/>}
            >Cancel</Button>
            <Button
              className="EmailDialog-button"
              variant="contained"
              color="primary"
              disabled={!this.props.email || this.props.error}
              onClick={() => this.props.onConfirm()}
              startIcon={<EmailIcon />}
            >Upload & Send</Button>
          </div>
        </div>
      </Dialog>
    )
  }
}

EmailDialog.propTypes = {
  open: PropTypes.bool,
  error: PropTypes.bool,
  email: PropTypes.string,
  onConfirm: PropTypes.func,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  onSend: PropTypes.func
}
