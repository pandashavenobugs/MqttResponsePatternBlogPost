import { IClientPublishOptions } from "mqtt";
import { publishWithResponseBasic } from "./helpers/mqtt-async.helper";
import mqttServerClient from "./utils/connectMqtt";

const deviceName: string = "device_1";
const relayName: string = "relay_1";

setTimeout(() => {
  startSystem();
}, 1000);

const startSystem = () => {
  startResponsePatternExample();
};

const startResponsePatternExample = async () => {
  const responseTopic = `response/${deviceName}/${relayName}`;
  const requestTopic = `request/${deviceName}/${relayName}`;
  const publishOptions: IClientPublishOptions = {
    qos: 1,
    properties: {
      responseTopic,
      correlationData: Buffer.from("secret", "utf-8"),
    },
  };
  try {
    const responseMessage = await publishWithResponseBasic({
      client: mqttServerClient,
      publishOptions,
      requestTopic,
      responseTopic,
      message: 1,
    });
    console.log(responseMessage);
  } catch (error) {
    console.log(error);
  }
};
