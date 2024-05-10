import { useStyles } from "./Student.styles";
import { useParams } from "react-router-dom";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import StudentGraph from "./StudentGraph";
import { IconFileOff, IconFileCheck, IconEye, IconTrophy } from "@tabler/icons";
import { doc, updateDoc } from "firebase/firestore";
import { Accordion, Alert, Button, Image, ScrollArea, Text } from "@mantine/core";
import { db } from "../../firebase.config";

export function StudentLeaveApplications({ data }) {
  const { classes } = useStyles();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  let { id } = useParams();

  async function handleAccept(e, i, value) {
    e.preventDefault();
    let list = data.student.applications;
    list[i].verify = value;
    const docRef = doc(db, "students", id);
    await updateDoc(docRef, {
      applications: list,
    });
  }

  if (data.student.applications.length === 0) {
    return (
      <Alert color="green" variant="outline" style={{ marginTop: "2rem" }}>
        No Leave Applications found
      </Alert>
    );
  }
  return (
    <>
      {data.student.verified === true ? (
        <div className={classes.studentContainer}>
          <Text className={classes.text} style={{ marginTop: "50px" }}>
            Leave applications
          </Text>
          <ScrollArea className={classes.leaveApplications}>
            <Accordion>
              {data.student.applications.length !== 0 &&
                data.student.applications.map((file, i) => (
                  <Accordion.Item value={`leave application ${i + 1}`}>
                    <Accordion.Control>
                      {file.fileName} <p style={{ fontSize: "0.8rem" }}>({file.fileDate})</p>
                      {file.verify ? <IconFileCheck color="green" /> : <IconFileOff />}
                    </Accordion.Control>
                    <Accordion.Panel>
                      div className={classes.main}
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.js">
                        <div style={{ height: "750px" }}>
                          <Viewer fileUrl={file.filePDF} plugins={[defaultLayoutPluginInstance]} />
                        </div>
                      </Worker>
                      <br></br>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={(e) => {
                          handleAccept(e, i, true);
                        }}
                      >
                        Accept
                      </Button>
                      <br></br>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={(e) => {
                          handleAccept(e, i, false);
                        }}
                      >
                        Reject
                      </Button>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
            </Accordion>
          </ScrollArea>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export function StudentStats({ data, theme }) {
  const { classes } = useStyles();

  return (
    <>
      <Text className={classes.text}>Stats</Text>
      <div className={classes.statsContainer}>
        <StudentGraph data={data} color={theme.primaryColor} attendance={data.student.attendence} />
      </div>
    </>
  );
}

export function StudentsReceipts({ data, user }) {
  const { classes } = useStyles();
  console.log(data.student.receipts);

  if (data.student.receipts.length === 0 || data.student.receipts.length === 0) {
    return (
      <Alert color="green" variant="outline" style={{ marginTop: "2rem" }}>
        No Receipts Found
      </Alert>
    );
  }

  return (
    <>
      {data.student.receipts.length !== 0 && data.student.verified === true ? (
        <div className={classes.studentContainer}>
          <Text className={classes.text} style={{ marginTop: "50px" }}>
            Receipts
          </Text>
          <ScrollArea style={{ height: "auto", maxHeight: 900 }} className={classes.leaveApplications}>
            <Accordion>
              {data.student.receipts.map((file, i) => (
                <Accordion.Item value={`leave application ${i + 1}`}>
                  <Accordion.Control>
                    {file.fileName} <IconTrophy />
                  </Accordion.Control>
                  <Accordion.Panel style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "100%", maxWidth: "500px" }}>
                      <Image radius="md" alt={file.fileName} src={file.filePDF} />
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
