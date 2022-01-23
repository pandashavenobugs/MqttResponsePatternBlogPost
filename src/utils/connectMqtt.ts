import mqtt, { IClientOptions, MqttClient } from "mqtt";

const options: IClientOptions = {
  port: 1883,
  protocolVersion: 5,
  keepalive: 60,
  properties: {
    requestResponseInformation: true,
    requestProblemInformation: true,
  },
};

const mqttServerClient: MqttClient = mqtt.connect("mqtt:/127.0.0.1", options);

mqttServerClient.on("connect", () => {
  console.log(`connected to mqtt  ${new Date()}`);
});

mqttServerClient.on("error", (err) => {
  console.log(err);
});

export default mqttServerClient;
