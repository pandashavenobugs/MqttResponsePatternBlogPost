import EventEmitter from "events";
import mqttServerClient from "./utils/connectMqtt";

const eventEmitter = new EventEmitter();

// ==> response/deviceName/relayName
mqttServerClient.subscribe("response/+/+");
mqttServerClient.subscribe("otherTopics/#");
mqttServerClient.on("message", (topic, payload) => {
  const topicArr = topic.split("/"); //spliting the topic
  if (topicArr[0] === "response") {
  }
});
