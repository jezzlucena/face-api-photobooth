import React from 'react';
import './App.scss';
import FaceDetectionContainer from './components/FaceDetectionContainer';

export default class App extends React.Component {

  render() {
      return (
        <div className="App">
          <FaceDetectionContainer/>
        </div>
      )
    }
}
