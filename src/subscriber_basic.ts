import { IClientSubscribeOptions } from "mqtt";
import mqttServerClient from "./utils/connectMqtt";

const opts: IClientSubscribeOptions = {
  qos: 1,
};
mqttServerClient.subscribe("request/+/+", opts);

mqttServerClient.on("message", (topic, payload, packet) => {
  console.log(packet);
  const { relayState } = JSON.parse(payload.toString());
  console.log(payload.toString());
  if (
    packet.properties &&
    packet.properties.responseTopic &&
    packet.properties.correlationData &&
    packet.properties.correlationData.toString() === "secret"
  ) {
    const responseData = {
      error: false,
      message: `${relayState === 1 ? "relay opened" : "relay closed"}`,
    };
    mqttServerClient.publish(
      packet.properties.responseTopic,
      JSON.stringify(responseData)
    );
  }
});
