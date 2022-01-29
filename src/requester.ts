import EventEmitter from "events";
import mqttServerClient from "./utils/connectMqtt";

const eventEmitter = new EventEmitter();

// ==> response/deviceName/relayName
mqttServerClient.subscribe("response/+/+");

mqttServerClient.on("message", (topic, payload) => {});
