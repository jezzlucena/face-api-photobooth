# Photobooth

Photobooth is web application that recognizes a person's facial expressions and takes a photo once the user smiles within a bounding box in the captured image.

## [Live Demo >](https://photobooth.jezzlucena.com/)

## Quick Start

To run this application in development mode, first install all dependencies using `npm install` in the terminal.

Aditionally, to enable picture uploading, it is necessary to create a local `.env` file in the root folder of this project. The basic structure of that file should look as follows:

```
S3_BUCKET=YOUR_BUCKET_NAME
AWS_ACCESS_KEY=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
```

To run this in development mode, simply run
`npm run dev`

In development mode, you can open `http://localhost:8080` to view it in the browser. The page will reload if you make edits to the React or Sass portions of the app. You will also see any lint errors in the console.

## Stack

A set of open-source frameworks, tools, and services were used to complete this project. Here is a list of some of these solutions:

##### Front End
| | |
| --- | --- |
| React | Facebook's declarative, efficient, and flexible JavaScript library for building user interfaces. |
| Sass | A preprocessor scripting language that is interpreted or compiled into Cascading Style Sheets (CSS). |
| Material-UI | Google's solution that provides React components for faster and easier web development. |
| p5.js | A JS client-side library for creating graphic and interactive experiences based on the core principles of Processing. |

#### Machine Learning
| | |
| --- | --- |
| TensorFlow.js | A library for machine learning in JavaScript |
| face-api.js | Face recognition API for the browser built on top of TensorFlow.js |

#### Back End
| | |
| --- | --- |
| Node.js | An open-source, cross-platform, server-side JavaScript runtime environment. |
| Express | A web application framework for Node.js designed for building web applications and APIs. |

#### Services
| | |
| --- | --- |
| GitHub | A global software development version control provider using Git. |
| AWS / S3 | A service offered by Amazon Web Services that provides object storage through a web service interface. |
| Heroku | A cloud platform as a service supporting several programming languages. |

## Compatibility
Any modern web browser with support to HTML5 and the WebRTC API should be able to run this app. (E.g. Chrome 71+, Edge 18+, Firefox 71+, Opera 64+)

## Known Issues
| Browser | OS | Issue |
| --- | --- | --- |
| Safari | macOS | Safari's JavaScript engine is only able to process one frame after the "Take a Photo" button is clicked |
| Safari | iOS | The WebRTC API is only accessible to websites that have SSL encryption enabled on Safari for iOS |
| Any Other | iOS | Due to security constraints, the WebRTC API is not accessible to web browsers other than Safari on iOS |

## References
| | |
| --- | --- |
| Overflowjs - Face Detection Using JavaScript API — face-api.js | [External Link](https://overflowjs.com/posts/Face-Detection-Using-JavaScript-API-face-apijs.html) |
| Inside the Labyrinth - Uploading Images to S3 from a React Single Page Application | [External Link](https://www.koan.co/blog/uploading-images-to-s3-from-a-react-spa) |
| freeCodeCamp.org - How to create a React frontend and a Node/Express backend and connect them | [External Link](https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/) |
