import React from 'react'
import './App.scss'
import PhotoboothContainer from './components/PhotoboothContainer'
import AboutDialog from './components/AboutDialog'
import AppMenu from './components/AppMenu'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      aboutDialogOpen: false,
    }
  }

  render() {
    return (
      <div className="App">
        <PhotoboothContainer/>
        <AppMenu
          onOpenAbout={() => this.setState({aboutDialogOpen: true})}
        />
        <AboutDialog
          onClose={() => this.setState({aboutDialogOpen: false})}
          open={this.state.aboutDialogOpen}
        />
        <ToastContainer autoClose={3000} />
      </div>
    )
  }
}
