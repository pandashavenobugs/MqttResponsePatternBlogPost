import { IClientPublishOptions, MqttClient } from "mqtt";
import {
  RelayRequestMessage,
  RelayResponseMessage,
} from "src/interfaces/relay.interface";

export function publishWithResponseBasic({
  client,
  deviceName,
  relayName,
  message,
  publishOptions,
}: {
  client: MqttClient;
  deviceName: string;
  relayName: string;
  message: 0 | 1;
  publishOptions: IClientPublishOptions;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const requestTopic = `request/${deviceName}/${relayName}`;
    const relayRequestMessage: RelayRequestMessage = {
      relayState: 1,
    };
    client.subscribe(`response/${deviceName}/${relayName}`);
    client.once("message", (topic, payload) => {
      try {
        const relayResponseMessage: RelayResponseMessage = JSON.parse(
          payload.toString()
        );
        relayResponseMessage.error
          ? reject(relayResponseMessage.message)
          : resolve(relayResponseMessage.message);
      } catch (error) {
        resolve("JsonConvertError");
      }
    });
    client.publish(
      requestTopic,
      JSON.stringify(relayRequestMessage),
      publishOptions
    );
  });
}
