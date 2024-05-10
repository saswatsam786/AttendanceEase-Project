import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import "./Home.css";
import { mobile } from "../Utilities/responsive";
import Video from "../components/Video";
import Modal from "../components/Modal";
import Statistics from "../components/Statistics";
import Hbar from "../components/Hbar";
import Settings from "../components/Settings";
import axios from "axios";
import { requestForToken } from "../firebaseNotifications/firebase";
import Application from "../components/Application";
import Receipt from "../components/Receipt";

const Home = () => {
  const [user] = useAuthState(auth);
  const [attendence, setAttendence] = useState(false);
  const [stats, setStats] = useState(false);
  const [hbar, setHbar] = useState(false);
  const [application, setApplication] = useState(false);
  const [achievements, setAchievements] = useState(false);
  const [settings, setSettings] = useState(true);
  const [fact, setFact] = useState("Click for random facts");

  // fact generator function
  async function factGenerator() {
    setFact("");
    const result = await axios.get("https://api.api-ninjas.com/v1/facts", {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.REACT_APP_FACT_KEY,
      },
    });
    setFact(result.data[0].fact);
  }

  const style = {
    // Adding media query..
    "@media (maxWidth: 656px)": {
      fontSize: "15px",
    },
  };

  return (
    <Container>
      <Modal />
      <Dashboard>
        <User>
          <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 70, height: 70 }} />

          <h2>{user.displayName}</h2>
        </User>
        <Links>
          <Child
            onClick={() => {
              setStats(false);
              setHbar(false);
              setSettings(false);
              setApplication(false);
              setAttendence(true);
              setAchievements(false);
            }}
            style={{
              background: attendence && "linear-gradient(to right top, #65dfc9, #6cdbeb)",
            }}
          >
            <h2 style={style}>Attendance</h2>
          </Child>
          {
            <Child
              onClick={() => {
                setAttendence(false);
                setHbar(false);
                setSettings(false);
                setApplication(false);
                setStats(true);
                setAchievements(false);
              }}
              style={{
                background: stats && "linear-gradient(to right top, #65dfc9, #6cdbeb)",
              }}
            >
              <h2 style={style}>Statistics</h2>
            </Child>
          }
          {/* {
            <Child
              onClick={() => {
                setAttendence(false);
                setStats(false);
                setSettings(false);
                setApplication(false);
                setHbar(true);
              }}
              style={{
                background: hbar && "linear-gradient(to right top, #65dfc9, #6cdbeb)",
              }}
            >
              <h2 style={style}>Hbar</h2>
            </Child>
          } */}

          {
            <Child
              onClick={() => {
                setStats(false);
                setHbar(false);
                setSettings(false);
                setApplication(true);
                setAttendence(false);
                setAchievements(false);
              }}
              style={{
                background: application && "linear-gradient(to right top, #65dfc9, #6cdbeb)",
              }}
            >
              <h2 style={style}>Application</h2>
            </Child>
          }

          {
            <Child
              onClick={() => {
                setStats(false);
                setHbar(false);
                setSettings(false);
                setApplication(false);
                setAttendence(false);
                setAchievements(true);
              }}
              style={{
                background: achievements && "linear-gradient(to right top, #65dfc9, #6cdbeb)",
              }}
            >
              <h2 style={style}>Achievements</h2>
            </Child>
          }

          <Child
            onClick={() => {
              setAttendence(false);
              setStats(false);
              setHbar(false);
              setApplication(false);
              setSettings(true);
              setAchievements(false);
            }}
          >
            <h2 style={style}>Settings</h2>
          </Child>
        </Links>
        {
          <Pro onClick={factGenerator}>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 0,
              }}
            >
              {!fact ? (
                <lottie-player
                  src="https://assets8.lottiefiles.com/packages/lf20_fl4lnt7z.json"
                  background="transparent"
                  loop
                  autoplay
                  style={{ width: "10%" }}
                ></lottie-player>
              ) : (
                `${fact}`
              )}
            </p>
          </Pro>
        }
      </Dashboard>
      <Details>
        {attendence && <Video play={attendence} style={{ padding: "10px" }} />}
        {stats && <Statistics />}
        {/* {hbar && <Hbar />} */}
        {settings && <Settings />}
        {application && <Application />}
        {achievements && <Receipt />}
      </Details>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  min-height: 80vh;
  ${mobile({ flexDirection: "column", minHeight: "95vh" })}
`;

const Dashboard = styled.div`
  flex: 0.4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2));
  border-radius: 2rem;
  padding: 5px 0;
  ${mobile({ justifyContent: "flex-start", flex: "0.1", padding: "0" })}
`;

const User = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > h2 {
    color: #426696;
    font-weight: 600;
    opacity: 0.8;
    font-size: 30px;
    padding: 10px;
    text-align: center;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
  ${mobile({
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  })}
`;

const Child = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  transition: color 6s ease-in-out;
  border-radius: 10px;
  cursor: pointer;
  & > h2 {
    color: #658ec6;
    font-weight: 500;
    opacity: 0.8;
    ${mobile({ padding: "1px" })}
  }

  &:hover {
    background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  }
  ${mobile({ padding: "5px", fontSize: "10px" })}
`;

const Pro = styled.div`
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  border-radius: 2rem;
  color: white;
  padding: 1rem;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: "100%";
  &:hover {
  }

  ${mobile({ marginTop: "2px" })}
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  margin: 2rem 0rem;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  width: 100%;
  position: relative;
`;
