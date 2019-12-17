import React from 'react'
import PropTypes from 'prop-types'
import './AboutDialog.scss'

import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import CameraIcon from '@material-ui/icons/CameraAlt'
import DoneIcon from '@material-ui/icons/Done'

export default class AboutDialog extends React.Component {
  render() {
    return <Dialog
      open={this.props.open}
      maxWidth="md"
      fullWidth
      onClose={this.props.onClose}
    >
      <div className="AboutDialog-content">
        <CameraIcon color="primary" style={{ fontSize: 100 }}/>
        <h1 style={{marginBottom: 40, marginTop: 0}}>Photobooth</h1>
        <div className="AboutDialog-text">
          <p>
            Photobooth is web application that recognizes a person's facial
            expressions and takes a photo once the user smiles within a
            bounding box in the captured image.
          </p>
          <p>
            A set of open-source frameworks, tools, and APIs were used to
            achieve this. Here is a list of some of these solutions:
          </p>
          <Grid container justify="center" spacing={2} style={{textAlign: "center"}}>
            <Grid xs={12} sm={6} item>
              <Paper className="AboutDialog-list">
                <h3>Front End</h3>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="React"
                      secondary="Facebook's JavaScript library for building user interfaces"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Sass"
                      secondary="A preprocessor scripting language that is interpreted or compiled into Cascading Style Sheets (CSS)."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Material-UI"
                      secondary="Google's solution that provides React components for faster and easier web development."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="p5.js"
                      secondary="A JS client-side library for creating graphic and interactive experiences based on the core principles of Processing."
                    />
                  </ListItem>
                </List>
              </Paper>
              <Paper className="AboutDialog-list">
                <h3>Back End</h3>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Node.js"
                      secondary="An open-source, cross-platform, server-side JavaScript runtime environment."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Express"
                      secondary="A web application framework for Node.js designed for building web applications and APIs."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="nodemailer"
                      secondary="A module for Node.js applications to allow email sending."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="MongoDB"
                      secondary="A cross-platform NoSQL document-oriented database program."
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid xs={12} sm={6} item>
              <Paper className="AboutDialog-list">
                <h3>Machine Learning</h3>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="TensorFlow.js"
                      secondary="A library for machine learning in JavaScript."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="face-api.js"
                      secondary="Face recognition API for the browser built on top of TensorFlow.js."
                    />
                  </ListItem>
                </List>
              </Paper>
              <Paper className="AboutDialog-list">
                <h3>Services</h3>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="GitHub"
                      secondary="A global software development version control provider using Git."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="AWS / S3"
                      secondary="A service offered by Amazon Web Services that provides object storage through a web service interface."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Sendgrid"
                      secondary="A customer communication platform for transactional and marketing email."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Heroku"
                      secondary="A cloud platform as a service supporting several programming languages."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="mLab"
                      secondary="A fully managed cloud database service that hosts MongoDB databases."
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
        <Button
          className="AboutDialog-button"
          variant="contained"
          color="primary"
          onClick={() => this.props.onClose()}
          startIcon={<DoneIcon/>}
        >Done</Button>
      </div>
    </Dialog>
  }
}

AboutDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}
