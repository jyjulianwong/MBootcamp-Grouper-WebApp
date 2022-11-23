import axios from 'axios';
import {useState} from "react";

function App() {
  const [configFile, setConfigFile] = useState(null);
  const [res, setRes] = useState("");

  const onFileChange = (event) => {
    setConfigFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const data = {};

    console.log("App: onFileUpload: configFile: " + configFile);
    const fileReader = new FileReader();
    fileReader.readAsText(configFile, "utf-8");
    fileReader.onload = async (event) => {
      const configLines = event.target.result.split("\n");
      console.log("App: onFileUpload: configLines: " + configLines);
      let linePtr = 0;
      data["groupCount"] = parseInt(configLines[linePtr]);
      linePtr += 2;

      data["people"] = [];
      while (true) {
        if (linePtr >= configLines.length) {
          break;
        }
        const configLine = configLines[linePtr];
        if (configLine === "") {
          linePtr++;
          break;
        }

        const args = configLine.split(",");
        const voices = args.slice(2).map((v) => {
          switch (v) {
            case "sop":
              return "SOPRANO";
            case "alt":
              return "ALTO";
            case "ten":
              return "TENOR";
            case "bas":
              return "BASS";
            default:
              return "VP";
          }
        })
        const member = {
          "name": args[0],
          "voices": voices,
          "newMember": args[1] === "new"
        }
        data["people"].push(member);

        linePtr++;
      }

      data["constraints"] = [];
      while (true) {
        if (linePtr >= configLines.length) {
          break;
        }
        const configLine = configLines[linePtr];
        if (configLine === "") {
          linePtr++;
          break;
        }

        const args = configLine.split(",");
        const cType = args[0].toUpperCase();
        const cArgs = args.slice(1);
        if (cType === "MIN_COUNT") {
          cArgs[0] = cArgs[0] === "new" ? "NEW_MEMBER" : "OLD_MEMBER";
          cArgs[1] = parseInt(cArgs[1]);
        }
        const constraint = {
          "type": cType,
          "args": cArgs
        }
        data["constraints"].push(constraint);

        linePtr++;
      }

      console.log("App: onFileUpload: data: " + data);
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      axios
        .post("http://mbootcamp-grouper-server-env.eba-dqkgzebf.eu-west-2.elasticbeanstalk.com/grouper", data, config)
        .then((response) => {
          setRes(JSON.stringify(response));
        })
    };
  };

  return (
    <div className="App">
      <input type="file" onChange={onFileChange}/>
      <button onClick={onFileUpload}>Upload!</button>
      <p>MBootcamp Grouper (Server): {res}</p>
    </div>
  );
}

export default App;
