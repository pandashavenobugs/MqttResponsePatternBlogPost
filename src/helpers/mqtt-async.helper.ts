import { IClientPublishOptions, MqttClient } from "mqtt";
import {
  RelayRequestMessage,
  RelayResponseMessage,
} from "../interfaces/relay.interface";

export function publishWithResponseBasic({
  client,
  message,
  publishOptions,
  requestTopic,
  responseTopic,
}: {
  client: MqttClient;
  message: 0 | 1;
  publishOptions: IClientPublishOptions;
  requestTopic: string;
  responseTopic: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const relayRequestMessage: RelayRequestMessage = {
      relayState: message,
    };
    client.subscribe(responseTopic);
    client.once("message", (topic, payload) => {
      client.unsubscribe(responseTopic);
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
