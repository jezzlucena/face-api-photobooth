import "p5/lib/addons/p5.dom";
import * as faceapi from 'face-api.js';

const MODELS_URL = '/models'

const TINY_FACE_OPTIONS = new faceapi.TinyFaceDetectorOptions({
  inputSize: 256,
  scoreThreshold: 0.5,
})

const CAPTURE_WIDTH = 1280
const CAPTURE_HEIGHT = 720

const FRAMING_BOX_WIDTH = 400
const FRAMING_BOX_HEIGHT = 400

export default function sketch (p) {
  let capture, canvas, p5Filter = null;
  let faceDrawings = [];

  let capturing, detecting, filter;
  let onTakePicture;

  function drawCapture() {
    p.background(255);
    p.image(capture, 0, 0);
    p.fill(0,0,0,0);
    if (p5Filter) p.filter(p5Filter)
  }

  function mapFaceDetectionData(data) {
    if (detecting) faceDrawings = data;
  }

  function resizeCanvas() {
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
      case 'ERODE':
        return p.ERODE
      default:
        return
    }
  }

  p.windowResized = async function() {
    resizeCanvas();
  }

  p.setup = async function () {
    await faceapi.loadTinyFaceDetectorModel(MODELS_URL)
    await faceapi.loadFaceExpressionModel(MODELS_URL)

    canvas = p.createCanvas(CAPTURE_WIDTH, CAPTURE_HEIGHT)
    canvas.id('canvas_element')

    resizeCanvas()

    const constraints = {
      video: {
        mandatory: {
          minWidth: CAPTURE_WIDTH,
          minHeight: CAPTURE_HEIGHT
        },
        optional: [{ maxFrameRate: 24 }]
      },
      audio: false
    };

    capture = p.createCapture(constraints, () => {})

    capture.id("video_element")
    capture.size(CAPTURE_WIDTH, CAPTURE_HEIGHT)
    capture.hide()
  };

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
    if (!capture || !capturing) return

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

    p.stroke('white');
    p.strokeWeight(4);
    p.rect(FRAMING_BOX._x, FRAMING_BOX._y, FRAMING_BOX._width, FRAMING_BOX._height);

    let allFacesWithinBoundaries = faceDrawings.reduce((acc, drawing) => {
      p.strokeWeight(2);
      p.rect(drawing.detection.box._x, drawing.detection.box._y, drawing.detection.box._width, drawing.detection.box._height);

      return acc && (drawing.expressions.happy >= 0.9) &&
        FRAMING_BOX._x < drawing.detection.box._x
        && FRAMING_BOX._y < drawing.detection.box._y
        && FRAMING_BOX._x + FRAMING_BOX._width > drawing.detection.box._x + drawing.detection.box._width
        && FRAMING_BOX._y + FRAMING_BOX._height > drawing.detection.box._y + drawing.detection.box._height
    }, true);

    if (!!faceDrawings.length && allFacesWithinBoundaries && capturing) {
      drawCapture()

      faceDrawings = []

      onTakePicture(document.getElementById('canvas_element').toDataURL())

      return
    }

    faceapi
      .detectAllFaces(capture.id(), TINY_FACE_OPTIONS)
      .withFaceExpressions()
      .then((data) => mapFaceDetectionData(data));
  }
};
