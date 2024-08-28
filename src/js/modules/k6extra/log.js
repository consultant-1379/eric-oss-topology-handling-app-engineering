
import exec from "k6/execution";

// log.event logs occurence of an event with the argument-supplied data, plus some metadata in the K6 console output.
// Useful for debugging.
// Params:
// - title: Log message is embraced between the title string to aid searching.
//          Please use only CAPITAL_LETTERS_AND_UNDERSCORES
//          Example value: "REQUEST_FAILED" which will show up in logs as:
//                         <<<-REQUEST_FAILED-:> REQUEST_RESPONSE_OBJECT <:-REQUEST_FAILED->>>
// - details: A dictionary of information deemed useful for debugging
export function event(title = "EVENT_HAPPENED", details = {}){
    let allInfo = {details}

    if (`${__VU}` != "0") {
        allInfo["scenario"] = exec.scenario.name;
        allInfo["iteration"] = exec.scenario.iterationInInstance;
    } else {
        allInfo["scenario"] = "setup or teardown";
    }

    if(details.stack){
        allInfo.stack = details.stack.split('\n').slice(1,-1);
    } else {
        var err = new Error();
        allInfo.stack = err.stack.split('\n').slice(1,-1);
    }

    allInfo.title = title

    console.error(`<<<-${title}-:> ${JSON.stringify(allInfo)} <:-${title}->>>`)
}
