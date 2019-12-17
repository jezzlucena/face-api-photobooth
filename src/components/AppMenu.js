import React from 'react'
import PropTypes from 'prop-types'
import './AppMenu.scss'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

export default class AppMenu extends React.Component {
  constructor() {
    super()

    this.state = {
      menuAnchor: false,
    }
  }

  handleOpenMenu(event) {
    this.setState({menuAnchor: event.currentTarget})
  }

  handleCloseMenu() {
    this.setState({menuAnchor: null})
  }

  render() {
    return <div>
      <Fab
        className="AppMenu-button"
        color="default"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={event => this.handleOpenMenu(event)}
      ><MenuIcon/></Fab>
      {this.state.menuAnchor &&
        <Menu
          id="simple-menu"
          anchorEl={this.state.menuAnchor}
          keepMounted
          style={{transform: "translate(35px, 35px)"}}
          open={Boolean(this.state.menuAnchor)}
          onClose={() => this.handleCloseMenu()}
        >
          <Tooltip title="Coming Soon" placement="right">
            <MenuItem
              aria-label="admin"
              style={{color: "#ccc"}}
              onClick={() => this.handleCloseMenu()}
            >Sign In</MenuItem>
          </Tooltip>
          <MenuItem
            onClick={this.props.onOpenAbout}
          >About Photobooth</MenuItem>
        </Menu>
      }
    </div>
  }
}

AppMenu.propTypes = {
  onOpenAbout: PropTypes.func
}
