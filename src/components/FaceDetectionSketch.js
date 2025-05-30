import "p5/lib/addons/p5.dom"
import * as faceapi from 'face-api.js'
import { toast } from 'react-toastify'

const MODELS_URL = '/models'

let CAPTURE_WIDTH = 1280
let CAPTURE_HEIGHT = 720

let FRAMING_BOX_WIDTH = 500
let FRAMING_BOX_HEIGHT = 500

const TINY_FACE_OPTIONS = new faceapi.TinyFaceDetectorOptions({
  inputSize: 512,
  scoreThreshold: 0.5,
})

const CAPTURE_CONSTRAINTS = {
  video: {
    facingMode: "user",
    width: { ideal: CAPTURE_WIDTH },
    height: { ideal: CAPTURE_HEIGHT },
    frameRate: { ideal: 24, max: 60 }
  },
  audio: false
}

export default function sketch (p) {
  let capture, canvas, p5Filter, readyToDetect = null
  let faceDrawings = []

  let capturing, detecting, filter
  let onTakePicture

  function drawCapture() {
    p.background(255)
    p.image(capture, 0, 0)
    p.fill(0,0,0,0)
    if (p5Filter) p.filter(p5Filter)
  }

  function mapFaceDetectionData(data) {
    if (detecting) faceDrawings = data
    readyToDetect = true
  }

  function resizeCanvas() {
    if (!canvas) return

    const canvasWidthFactor =  p.windowWidth / CAPTURE_WIDTH
    const canvasHeightFactor = p.windowHeight / CAPTURE_HEIGHT

    const maxFactor = Math.max(canvasWidthFactor, canvasHeightFactor)

    canvas.style("transform", `scale(${maxFactor})`)
  }

  function mapFilter() {
    switch (filter) {
      case 'THRESHOLD':
        return p.THRESHOLD
      case 'GRAY':
        return p.GRAY
      case 'INVERT':
        return p.INVERT
      case 'OPAQUE':
        return p.OPAQUE
      default:
        return
    }
  }

  async function getFrontCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // "user" specifies the front camera
        audio: false, // Optional: set to true if you need audio as well
      });
      return stream;
    } catch (error) {
      toast.error("Error accessing the camera.", { position: toast.POSITION.BOTTOM_RIGHT })
      console.error("Error accessing the camera:", error);
      return null;
    }
  }

  p.windowResized = async function() {
    resizeCanvas()
  }

  p.setup = async function () {
    getFrontCamera()

    capture = p.createCapture(CAPTURE_CONSTRAINTS, async stream => {
      await faceapi.loadTinyFaceDetectorModel(MODELS_URL)
      await faceapi.loadFaceExpressionModel(MODELS_URL)

      capture.id("video_element")
      capture.hide()

      const videoEl = document.getElementById('video_element')
      const newCaptureWidth = videoEl.videoWidth
      const newCaptureHeight = videoEl.videoHeight

      FRAMING_BOX_HEIGHT = FRAMING_BOX_HEIGHT*newCaptureHeight/CAPTURE_HEIGHT
      FRAMING_BOX_WIDTH = FRAMING_BOX_HEIGHT

      CAPTURE_WIDTH = newCaptureWidth
      CAPTURE_HEIGHT = newCaptureHeight

      capture.size(CAPTURE_WIDTH, CAPTURE_HEIGHT)

      canvas = p.createCanvas(CAPTURE_WIDTH, CAPTURE_HEIGHT)
      canvas.id('canvas_element')

      readyToDetect = true
      resizeCanvas()

      setTimeout(function() {
        faceapi
          .detectAllFaces(capture.id(), TINY_FACE_OPTIONS)
          .withFaceExpressions()
          .then((data) => mapFaceDetectionData(data))
      }, 100)
    })
  }

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.onTakePicture) {
      onTakePicture = props.onTakePicture
    }

    capturing = props.capturing
    detecting = props.detecting
    filter = props.filter
    faceDrawings = []

    p5Filter = mapFilter()
  }

  p.draw = async () => {
    if (!canvas || !capturing) return

    if (!capture || !capture.loadedmetadata) {
      p.fill('red')
      p.text("Camera not available", CAPTURE_WIDTH/2, CAPTURE_HEIGHT/2)
      return
    }

    p.translate(CAPTURE_WIDTH, 0)
    p.scale(-1, 1)
    drawCapture()

    if (!detecting) return

    let framingBoxWidthFactor = 1
    if (faceDrawings.length > 1) framingBoxWidthFactor = 2

    const FRAMING_BOX = {
      _width: FRAMING_BOX_WIDTH*framingBoxWidthFactor,
      _height: FRAMING_BOX_HEIGHT,
      _x: CAPTURE_WIDTH/2 - (FRAMING_BOX_WIDTH*framingBoxWidthFactor)/2,
      _y: CAPTURE_HEIGHT/2 - FRAMING_BOX_HEIGHT/2,
    }

    p.stroke('red')
    p.strokeWeight(5)
    p.rect(FRAMING_BOX._x, FRAMING_BOX._y, FRAMING_BOX._width, FRAMING_BOX._height)

    let allFacesWithinBoundaries = faceDrawings.reduce((acc, drawing) => {
      p.stroke('white')
      p.strokeWeight(1)
      p.rect(drawing.detection.box._x, drawing.detection.box._y, drawing.detection.box._width, drawing.detection.box._height)

      return acc && (drawing.expressions.happy >= 0.9) &&
        FRAMING_BOX._x < drawing.detection.box._x
        && FRAMING_BOX._y < drawing.detection.box._y
        && FRAMING_BOX._x + FRAMING_BOX._width > drawing.detection.box._x + drawing.detection.box._width
        && FRAMING_BOX._y + FRAMING_BOX._height > drawing.detection.box._y + drawing.detection.box._height
    }, readyToDetect)

    if (!!faceDrawings.length && allFacesWithinBoundaries && capturing) {
      faceDrawings = []
      drawCapture()
      onTakePicture(document.getElementById('canvas_element').toDataURL())
      return
    }

    if (readyToDetect) {
      readyToDetect = false

      setTimeout(function() {
        faceapi
          .detectAllFaces(capture.id(), TINY_FACE_OPTIONS)
          .withFaceExpressions()
          .then((data) => mapFaceDetectionData(data))
      }, 0)
    }
  }
}
