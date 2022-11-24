import axios from 'axios';
import {useState} from "react";
import "./App.css";
import DataTranslator from "./models/dataTranslator";

function App() {
  const placeholder1 = `Enter the number of groups you would like to have...
  `;
  const placeholder2 = `Enter all the members who will be coming, whether they are new or not, and their voice parts.

For example...
janice,old,sop
stephanie,new,sop
esther,new,sop
jessie,new,sop
megan,new,alt
amy,old,alt
priscilla,old,alt
aaron,old,ten
joseph,old,ten
squiz,old,bas,vp
cyrus,new,bas,vp
adrian,new,bas,vp
  `;
  const placeholder3 = `Enter all the constraints that an ideal group combination should follow.

For example...
min_count,new,2
min_count,old,1
same_group,jessie,priscilla
diff_group,janice,stephanie
diff_group,amy,stephanie
diff_group,esther,joseph
diff_group,janice,megan
diff_group,janice,squiz
diff_group,joseph,squiz
  `;

  const [textArea1, setTextArea1] = useState("");
  const [textArea2, setTextArea2] = useState("");
  const [textArea3, setTextArea3] = useState("");
  const [configFile, setConfigFile] = useState(null);
  const [result, setResult] = useState([]);

  const sendCalcRequest = (configData) => {
    const dataTranslator = new DataTranslator(configData);
    const data = dataTranslator.translate();

    console.log("App: onSubmit: data: " + data);
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    axios
      .post("http://mbootcamp-grouper-server-env.eba-dqkgzebf.eu-west-2.elasticbeanstalk.com/grouper", data, config)
      .then((response) => {
        setResult(response["data"]["combinations"]);
      })
  }

  const onTextArea1Change = (event) => {
    setTextArea1(event.target.value);
  }
  const onTextArea2Change = (event) => {
    setTextArea2(event.target.value);
  }
  const onTextArea3Change = (event) => {
    setTextArea3(event.target.value);
  }

  const onFileChange = (event) => {
    setConfigFile(event.target.files[0]);
  };

  const onSubmit = () => {
    if (configFile !== null) {
      console.log("App: onSubmit: configFile: " + configFile);
      const fileReader = new FileReader();
      fileReader.readAsText(configFile, "utf-8");
      fileReader.onload = async (event) => {
        sendCalcRequest(event.target.result);
      };
    } else {
      let configData = "";
      configData += textArea1;
      configData.replace(/\n+$/, "");
      configData += "\n";
      configData += textArea2;
      configData.replace(/\n+$/, "");
      configData += "\n";
      configData += textArea3;
      configData.replace(/\n+$/, "");
      sendCalcRequest(configData);
    }
  };

  return (
    <div className="App">
      <div className={"container"}>
        <div className={"row my-3"}>
          <div className="col align-self-start">
            <img
              src={require("./assets/themockingbird.png")}
              alt={"The Mockingbird"}
              width={255}
              height={100}
            />
            <hr/>
          </div>
        </div>
        <div className={"row my-3 g-3"}>
          <div className={"col-xs-12 col-lg-4"}>
            <textarea
              className={"w-100"}
              rows={15}
              placeholder={placeholder1}
              onChange={onTextArea1Change}
            >
              {textArea1}
            </textarea>
          </div>
          <div className={"col-xs-12 col-lg-4"}>
            <textarea
              className={"w-100"}
              rows={15}
              placeholder={placeholder2}
              onChange={onTextArea2Change}
            >
              {textArea2}
            </textarea>
          </div>
          <div className={"col-xs-12 col-lg-4"}>
            <textarea
              className={"w-100"}
              rows={15}
              placeholder={placeholder3}
              onChange={onTextArea3Change}
            >
              {textArea3}
            </textarea>
          </div>
        </div>
        <div className={"row my-3"}>
          <p>Alternatively, upload a complete configuration file here...</p>
          <br/>
          <input type="file" onChange={onFileChange}/>
        </div>
        <div className={"row my-3"}>
          <button onClick={onSubmit}>Calculate!</button>
        </div>
        <div className={"row my-3"}>
          {
            result.map((combo, comboIdx) => {
              return (
                <div className={"bg-info my-1 py-3"}>
                  <p><b>COMBINATION {comboIdx + 1}</b></p>
                  {
                    combo.map((group, groupIdx) => {
                      return (
                        <div>
                          <p>Group {groupIdx + 1}</p>
                          <p>{group.toString()}</p>
                        </div>
                      )
                    })
                  }
                </div>
              );
            })
          }
        </div>
        <div className={"row my-5"}>
          <hr/>
          Authored by Julian Wong in 2022.
          <br/>
          I need a UX designer. Please send help.
        </div>
      </div>
    </div>
  );
}

export default App;
