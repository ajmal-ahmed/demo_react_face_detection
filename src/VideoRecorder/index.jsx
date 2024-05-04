import React, {useRef, useEffect} from 'react';
import * as faceapi from 'face-api.js';
import { Card, Col, Container, Row} from "react-bootstrap";
import {toast} from "react-toastify";



const VideoRecorder = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const videoHeight = 480;
    const videoWidth = 640;
    const [modelsLoaded, setModelsLoaded] = React.useState(false);


    useEffect(() => {
        const loadModels = async () => {
            const id = toast.loading("Loading Dependencies, Please wait...")
            const MODEL_URL = '/models';
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]).then(()=>{
                setModelsLoaded(true)
                toast.update(id, { render: "Dependencies loaded", type: "success", isLoading: false, autoClose: 2000});
            });
        }
        loadModels();


    }, []);


    useEffect(() => {
        if(modelsLoaded){
            startCamera()
        }
    }, [modelsLoaded]);





    /**
     * Method to start the camera and set the stream to the video element
     */
    const startCamera = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        handleVideoOnPlay()
                    }
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Error occurred while accessing the camera, Please allow the camera access and refresh the page.", {toastId: "cameraError"});
                });
        }
    }

    /**
     * Method to handle the video on play event and draw the face detection on the canvas
     */
    const handleVideoOnPlay = () => {
        setInterval(async () => {
            if (canvasRef && canvasRef.current) {
                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
                const displaySize = {
                    width: videoWidth,
                    height: videoHeight
                }

                faceapi.matchDimensions(canvasRef.current, displaySize);

                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
                canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                // canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                // canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
            }
        }, 100)
    }

    /**
     * Method to stop the camera and clear the stream
     * @param videoRef
     */
    const stopCamera = (videoRef) => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };


    return (
        <Card className="mb-4 box-shadow">
            <Card.Header>
                Video Face detection
            </Card.Header>
            <Card.Body>
                <Container>
                    <Row className="justify-content-md-center" >
                        <Col md="auto">
                            <div className="d-flex justify-content-center">
                                <div style={{display: 'flex', justifyContent: 'center', padding: '10px'}}>
                                    <video ref={videoRef} autoPlay muted/>
                                    <canvas ref={canvasRef} style={{position: "absolute"}}/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>

    );
};

export default VideoRecorder;