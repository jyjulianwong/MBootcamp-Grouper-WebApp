class DataTranslator {
  constructor(configData) {
    this.configData = configData;
  }

  translate() {
    let data = {};

    let configLines = this.configData.split("\n");
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

    return data;
  }
}

export default DataTranslator;