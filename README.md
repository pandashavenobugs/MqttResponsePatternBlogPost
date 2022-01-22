Mqtt is a client server publish/subscribe messaging transport protocol [[1](https://www.hivemq.com/blog/mqtt-essentials-part-1-introducing-mqtt/#:~:text=MQTT%20is%20a%20Client%20Server%20publish/subscribe%20messaging%20transport%20protocol.)] and so popular in IoT projects. In this blog post I am going to get into MQTT response pattern [[2](https://www.hivemq.com/blog/mqtt5-essentials-part9-request-response-pattern/)] not the basic. To checkout the MQTT essentials please get to [link](https://www.hivemq.com/mqtt-essentials/).

## Warning: It is required that mqtt version is 5 to use mqtt response pattern

# Why Do We Need MQTT Response Pattern ?

MQTT is usually used for getting data from devices. Sometimes we may need to send data to devices, services, or people. Publishing the payload(message) is enough to send subscribers data but there are some questions. Is data received by subscribers or the broker ? what is the latest situation of the subscriber ? what happened when the subscriber gets the data from mqtt?
