/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { mobile } from "../Utilities/responsive";
import Alert from "@mui/material/Alert";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebaseConfig";
import QrReader from "react-qr-scanner";
import firebase from "firebase";
import Radar from "radar-sdk-js";
import * as faceapi from "face-api.js";

const Video = () => {
  Radar.initialize("prj_test_pk_ad25bb14abde206df225e7f696d5427ea5bf752b");
  const [user] = useAuthState(auth);
  Radar.setUserId(`${user.email}`);

  const [id, setID] = useState("");
  const [accid, setAccid] = useState("");
  const [privatekey, setPrivatekey] = useState("");
  const [initialise, setInitialise] = useState(false);
  const webcamRef = useRef();
  const canvasRef = useRef();
  const videoElm = useRef();

  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(640);
  const [data, setData] = useState([]);
  const [location, setLocation] = useState();
  const [date, setDate] = useState(new Date());

  const [thisMonth, setthisMonth] = useState();
  const [verifyQR, setVerifyQR] = useState();
  const [verify, setVerify] = useState(false);
  const [college, setCollege] = useState("");
  const [att, setAtt] = useState();

  const [latestDate, setLatestDate] = useState();
  const [scan, setScan] = useState(false);
  const [alert, setAlert] = useState("");
  const [latestToken, setLatestToken] = useState("");

  const [attendence, setAttendence] = useState(false);
  const [dbAttendence, setdbAttendence] = useState(false);

  const [scanResultWebCam, setScanResultWebCam] = useState("");

  const [userImg, setUserImg] = useState("");

  useEffect(() => {
    db.collection("QRTokens")
      .where("cdomain", "==", college)
      .onSnapshot((snap) => setVerifyQR(snap.docs[0].data()));
    // console.log(verifyQR);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [college]);

  useEffect(() => {
    db.collection("students").onSnapshot((snapshot) => {
      setData(
        snapshot.docs.map((doc) => ({
          name: doc.data().sname,
          imgURL:
            doc.data().imgURL[0] || "https://i.insider.com/59ea578149e1cf5f038b47af?width=1000&format=jpeg&auto=webp",
        }))
      );
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLocation(position.coords);
        },
        function (error) {
          setAlert(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    db.collection("students")
      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach((snap) => {
          setID(snap.id);
          const month = mygetMonth(date.getMonth());
          setAccid(snap.data().accid);
          setPrivatekey(snap.data().privatekey);
          setUserImg(snap.data().imgURL[0]);
          setCollege(snap.data().cdomain);
          setVerify(snap.data().verified);
          setAtt(snap.data().totalAtt);
          setLatestToken(snap.data().latestToken);

          const latestAttendence = snap.data().attendence[month][snap.data().attendence[month].length - 1];
          setLatestDate(latestAttendence);
          // let dat = date.getDate();
          // dat === latestAttendence && setdbAttendence(true);
          setthisMonth(snap.data().attendence);
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const loadModels = async () => {
      const startVideo = async () => {
        navigator.getUserMedia(
          {
            video: true,
          },
          (stream) => (webcamRef.current.srcObject = stream),
          (err) => console.log(err)
        );

        navigator.mediaDevices.getUserMedia(
          { video: true },
          (stream) => (videoElm.current.srcObject = stream),
          (err) => console.log(err)
        );
      };
      const MODEL = process.env.PUBLIC_URL + "/models";
      setInitialise(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL),
      ]).then(startVideo);
    };
    loadModels();
  }, [scan]);

  function mygetMonth(monthNum) {
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    return monthNames[monthNum];
  }

  async function addAttendence(attended) {
    let hours = date.getHours();
    let dat = date.getDate();
    if (attended && hours <= 19 && hours >= 0) {
      const variable = db.collection("students").doc(id);
      const month = mygetMonth(date.getMonth());

      if (!thisMonth[month].includes(dat)) {
        thisMonth[month].push(dat);
      }

      if (latestToken !== verifyQR.token || latestToken.length === 0) {
        setLatestToken(verifyQR.token);

        await variable
          .update({
            attendence: thisMonth,
            totalAtt: att + 1,
            latestToken: verifyQR.token,
          })
          .then(() => setdbAttendence(true));
      }
    }
  }

  const detect = async () => {
    const labeledFaceDescriptors = await loadImage();

    setInterval(async () => {
      if (initialise) {
        setInitialise(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(webcamRef.current);

      const faceMat = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

      const displaySize = { width: width, height: height };

      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi
        .detectAllFaces(webcamRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors()
        .withAgeAndGender();

      const resizeDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext("2d").clearRect(0, 0, width, height);
      faceapi.draw.drawDetections(canvasRef.current, resizeDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizeDetections);

      const results = resizeDetections.map((detect) => {
        return faceMat.findBestMatch(detect.descriptor);
      });

      !attendence &&
        results.map((result) => {
          setAttendence(result.label === user.displayName);
          return (
            result.label === user.displayName && latestToken !== verifyQR.token && !dbAttendence && addAttendence(true)
          );
        });

      results.forEach((result, i) => {
        const box = resizeDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvasRef.current);
      });
    }, 1000);
  };

  async function loadImage() {
    return Promise.all(
      data.map(async ({ name, imgURL }) => {
        const descriptions = [];
        for (let i = 0; i <= 1; i++) {
          const img = await faceapi.fetchImage(`${imgURL || userImg}`);
          const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
          detections.length !== 0 && descriptions.push(detections[0].descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(name || user.displayName, descriptions);
      })
    );
  }

  const handleScan = (data) => {
    if (data) {
      // setScanResultWebCam(data.text);
      // console.log(data.text);
      data = JSON.parse(data.text);
      // console.log(data);
      // console.log(location);
      if (latestToken === data.token) {
        setAlert("Attendance for the class already given");
      } else if (verifyQR.token !== data.token) {
        setAlert("Token is invalid");
      } else if (
        verifyQR.validStartTime.toDate().getTime() > new Date().getTime() ||
        verifyQR.validEndTime.toDate().getTime() < new Date().getTime()
      ) {
        setAlert("Attendence period over");
      } else {
        Radar.getDistance(
          {
            origin: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            destination: {
              latitude: data.location.lat,
              longitude: data.location.lng,
            },
            modes: ["foot", "car"],
            units: "metric",
          },
          function (err, result) {
            if (!err) {
              // console.log(result);
              if (result.routes.geodesic.distance.value < 1100) {
                setAlert("QR Verified");
                setScan(true);
              } else {
                setAlert("Person is out of bounds");
              }
              // do something with result.routes
            }
          }
        );
      }
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <>
      {alert && <Alert style={{ position: "absolute", zIndex: 3, top: 0 }}>{alert}</Alert>}
      {dbAttendence && (
        <>
          <Alert style={{ position: "absolute", zIndex: 3, top: 0 }}>Your attendece has been recorded for today</Alert>
        </>
      )}
      {verify ? (
        <Camera style={{ position: "relative" }}>
          {scan ? (
            <video ref={webcamRef} autoPlay muted style={{ width: "100%" }} onPlay={detect} />
          ) : (
            <>
              {/* <video id="scan" ref={videoElm}></video> */}
              <QrReader
                scandelay={300}
                style={{ width: "70%" }}
                constraints={{
                  video: { facingMode: "environment" },
                }}
                onError={handleError}
                onScan={handleScan}
              />
            </>
          )}
          {scan && <canvas ref={canvasRef} style={{ position: "absolute", width: "100%" }} />}
        </Camera>
      ) : (
        "You are not verified. Please Contact college"
      )}
      <LatestAttendence style={{ color: "#658ec6" }}>Last attendence was submitted on: {latestDate}th</LatestAttendence>
    </>
  );
};

export default Video;

const Camera = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: contain;
  ${mobile({ minWidth: "120%" })}
`;

const LatestAttendence = styled.h5`
  position: absolute;
  bottom: 0;
  padding: 3px 5px;
  border-radius: 10px;
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
`;

// {!scan ? (
//   <video
//     ref={webcamRef}
//     autoPlay
//     muted
//     style={{ width: "100%" }}
//     onPlay={detect}
//   />
// ) : (
//   <>
//     {/* <video id="scan" ref={videoElm}></video> */}
//     <QrReader
//       scanDelay={300}
//       style={{ width: "70%" }}
//       onError={handleError}
//       onScan={handleScan}
//     />
//   </>
// )}
// {scan && (
//   <canvas
//     ref={canvasRef}
//     style={{ position: "absolute", width: "100%" }}
//   />
// )}
