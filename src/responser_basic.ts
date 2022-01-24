import { IClientSubscribeOptions } from "mqtt";
import mqttServerClient from "./utils/connectMqtt";

const opts: IClientSubscribeOptions = {
  qos: 1,
};
mqttServerClient.subscribe("request/device_1/relay_1", opts);

mqttServerClient.on("message", (topic, payload, packet) => {
  console.log(packet);
  const { relayState } = JSON.parse(payload.toString());
  console.log(payload.toString());
  if (packet.properties && packet.properties.responseTopic) {
    const responseData = {
      error: false,
      message: `${relayState === 1 ? "relay opened" : "relay can not opened"}`,
    };
    mqttServerClient.publish(
      packet.properties.responseTopic,
      JSON.stringify(responseData)
    );
  }
});
