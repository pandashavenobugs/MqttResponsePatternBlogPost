import EventEmitter from "events";
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

export function publishWithResponse({
  client,
  data,
  publishOptions,
  responseEventName,
  requestTopic,
  eventEmitter,
}: {
  client: MqttClient;
  data: 0 | 1;
  publishOptions: IClientPublishOptions;
  requestTopic: string;
  responseEventName: string;
  eventEmitter: EventEmitter;
}): Promise<RelayResponseMessage> {
  return new Promise((resolve, reject) => {
    const timeOutCheck = setTimeout(() => {
      const relayResponseMessage: RelayResponseMessage = {
        error: true,
        message: "timeOut",
      };

      eventEmitter.emit(responseEventName, relayResponseMessage);
    }, 5000);
    eventEmitter.once(
      responseEventName,
      (relayResponseMessage: RelayResponseMessage) => {
        clearTimeout(timeOutCheck);
        relayResponseMessage.error
          ? reject(relayResponseMessage.message)
          : resolve(relayResponseMessage);
      }
    );

    const payload = { relayState: data };
    client.publish(requestTopic, JSON.stringify(payload), publishOptions);
  });
}
