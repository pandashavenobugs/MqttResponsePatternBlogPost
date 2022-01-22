[Mqtt](https://www.hivemq.com/blog/mqtt-essentials-part-1-introducing-mqtt/#:~:text=MQTT%20is%20a%20Client%20Server%20publish/subscribe%20messaging%20transport%20protocol.) is a client server publish/subscribe messaging transport protocol and so popular in IoT projects. In this blog post I am going to get into [MQTT response pattern](https://www.hivemq.com/blog/mqtt5-essentials-part9-request-response-pattern/) not the basic. To checkout the MQTT essentials please get to [link](https://www.hivemq.com/mqtt-essentials/).

### Warning: It is required that mqtt version is 5 to use mqtt response pattern

## Why Do We Need MQTT Response Pattern ?

MQTT is usually used for getting data from devices. Sometimes we may need to send data to devices, services, or people. Publishing the message(payload as Buffer) is enough to send subscribers data but there are some issues. For instance, we have a device that has a 3.3V relay and this device subscribes to the "device_1/relay_1".When the message ("1" or "0") is published to the "device_1/relay_1" topic the state of the relay changes depending on the message.

![publishImage](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z6lj4z84zkshxory82bh.png) _publishing message_

So far so good but there are some issues with it. Is data received by the subscriber? what is the latest situation of the subscriber? what happened when the subscriber gets the data from the broker? The publisher is not sure if the subscriber receives the message. The publisher can only ensure that the message is delivered to the broker by changing the level of the [QoS](https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/).
