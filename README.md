[Mqtt](https://www.hivemq.com/blog/mqtt-essentials-part-1-introducing-mqtt/#:~:text=MQTT%20is%20a%20Client%20Server%20publish/subscribe%20messaging%20transport%20protocol.) is a client server publish/subscribe messaging transport protocol and so popular in IoT projects. In this blog post I am going to get into [MQTT response pattern](https://www.hivemq.com/blog/mqtt5-essentials-part9-request-response-pattern/) not the basic. To checkout the MQTT essentials please get to [link](https://www.hivemq.com/mqtt-essentials/).

### Warning: It is required that mqtt version is 5 to use mqtt response pattern in this tutorial

## Why Do We Need MQTT Response Pattern ?

MQTT is usually used for getting data from devices. Sometimes we may need to send data to devices, services, or people. Publishing the message(payload as Buffer) is enough to send subscribers data but there are some issues. For instance, we have a device that has a 3.3V relay and this device subscribes to the "device_1/relay_1".When the message ("1" or "0") is published to the "device_1/relay_1" topic the state of the relay changes depending on the message.

![publishImage](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z6lj4z84zkshxory82bh.png) _publishing message_

So far so good but there are some issues with it. Is data received by the subscriber? what is the latest situation of the subscriber? The publisher is not sure if the subscriber receives the message. The publisher needs the response coming from the subscriber to be sure, however, only can make certain that the message is delivered to the broker by changing the level of the [QoS](https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/).At this point the MQTT response pattern becomes necessary.

![basic_mqtt_response_pattern_logic](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3vc0jzj3adacmwa3jbvl.png) _basic_mqtt_response_pattern_logic_

In MQTT response pattern we work on 2 main topics, request and response topics. the publisher subscribes to the response topic and the subscriber subscribes to the request topic. Note that! **Response and Request topics have to be unique otherwise it could cause confusion.**. When the subscriber receives the message coming from the request topic immediately it creates and publishes a new response message to the response topic. The response message coming from the response topic is received by the publisher. So the publisher is sure that the subscriber has received the message. This is why we need MQTT response pattern.

## Let's Practice

- In this tutorial we're going to use just the mqtt package. The other packages are relevant to typescript.

Creating package.json

```bash
npm init -y
```

Installing mqtt package

```bash
npm install mqtt
```

Packges for typescript. **Note that: mqtt npm package doesn't need @types/mqtt. So we dont intsall @types/mqtt.**

```bash
npm install @types/node ts-node typescript -D
```

Creating tsconfig.json

```bash
tsc --init
```

Creating connectMqtt.ts util

```ts
// utils/connectMqtt.ts file
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
```

Properties object in IClientOptions is supported by just MQTT 5.0. So we set the protocolVersion 5 to use properties object. In this options. At this point we have 2 necessary options, requestResponseInformation and requestProblemInformation. The [RequestResponseInformation](https://www.hivemq.com/blog/mqtt5-essentials-part9-request-response-pattern/#:~:text=sender%20and%20receiver.-,Response%20Information,-In%20the%20spirit) is used for the broker sending the clients the response information in the CONNACK packet. The requestProblemInformation is used by clients to indicate any failures.
