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

Editing tscofnig.json. tsconfig.json in this project is like below.

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Enable incremental compilation */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./",                          /* Specify the folder for .tsbuildinfo incremental compilation files. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es6" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h' */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.` */
    // "reactNamespace": "",                             /* Specify the object invoked for `createElement`. This only applies when targeting `react` JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */

    /* Modules */
    "module": "commonjs" /* Specify what module code is generated. */,
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    "moduleResolution": "node" /* Specify how TypeScript looks up a file from a given module specifier. */,
    "baseUrl": "." /* Specify the base directory to resolve non-relative module names. */,
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like `./node_modules/@types`. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "resolveJsonModule": true,                        /* Enable importing .json files */
    // "noResolve": true,                                /* Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from `node_modules`. Only applicable with `allowJs`. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    "sourceMap": true /* Create source map files for emitted JavaScript files. */,
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output. */
    "outDir": "./build" /* Specify an output folder for all emitted files. */,
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have `@internal` in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like `__extends` in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing `const enum` declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied `any` type.. */
    // "strictNullChecks": true,                         /* When type checking, take into account `null` and `undefined`. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for `bind`, `call`, and `apply` methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when `this` is given the type `any`. */
    // "useUnknownInCatchVariables": true,               /* Type catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when a local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Include 'undefined' in index signature results */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
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

The properties object in option is supported by just MQTT 5.0. So we set the protocolVersion 5 to use properties object. In this options. At this point we have 2 necessary options, requestResponseInformation and requestProblemInformation. The [RequestResponseInformation](https://www.hivemq.com/blog/mqtt5-essentials-part9-request-response-pattern/#:~:text=sender%20and%20receiver.-,Response%20Information,-In%20the%20spirit) is used for the broker sending the clients the response information in the CONNACK packet. The requestProblemInformation is used by clients to indicate any failures.

Creating utils/relay.interface.ts

```typescript
export interface RelayResponseMessage {
  error: boolean;
  message: string;
}

export interface RelayRequestMessage {
  relayState: number;
}
```

Creating helpers/mqtt-async.helper.ts

```ts
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
```

mqtt-async.helpers.ts is a wrapper that turns the mqttClient callbacks into the async await function. It is required to subscribe to the response topic before publishing the message to the request topic. So that the publisher can receive the response data from the subscriber. In this situation the subscriber has to publish the response message to the response topic, otherwise, the publishWithResponseBasic function will not be closed and it will cause errors, memory leaks, etc. This is the weakness of this wrapper.

Creating requester_basic.ts

```ts
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
```

we have two optional parameters,[responseTopic](https://www.hivemq.com/blog/mqtt5-essentials-part9-request-response-pattern/#:~:text=a%20concrete%20example.-,Response%20Topic,-A%20response%20topic) and [correlationData](https://www.hivemq.com/blog/mqtt5-essentials-part9-request-response-pattern/#:~:text=out%20the%20request.-,Correlation%20Data,-Correlation%20data%20is). The responseTopic option represents the topic that the subscriber uses to publish the response message.The correlationData is a buffer data in nodeJS and used for additional information about the request message or a specific request. Also, it can be used for identifying by using a secret word as buffer data.

creating subscriber_basic.ts

```ts
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
```

We focus on the packet parameter that contains the responseTopic and the correlationData. I use the correlationData as a secret code.The response message is published if the converted correlationData is 'secret'.

Compiling the typescript codes.

```bash
tsc
```

Compiled project is in build folder.

First of all we start the subscriber.

```bash
node build/subscriber_basic.js
```

Then we start the requester.

```bash
node build/requester_basic.js
```

The console log of the subscriber_basic.js.

```bash
Packet {
  cmd: 'publish',
  retain: false,
  qos: 1,
  dup: false,
  length: 82,
  topic: 'request/device_1/relay_1',
  payload: <Buffer 7b 22 72 65 6c 61 79 53 74 61 74 65 22 3a 31 7d>,
  messageId: 1,
  properties: {
    responseTopic: 'response/device_1/relay_1',
    correlationData: <Buffer 73 65 63 72 65 74>
  }
}
```

As you can see the subscriber receives the responseTopic and correlationData in the properties object in the packet. The subscriber can use these informations to publish the response message. This example works well within certain limits. We have one topic to request and response. what would happen if the publisher subscribed to multiple response topics or other topics ? We can not listen to the specific topics while using nodeJS MQTT package. The message coming from the subscribed topics can trigger the listener in the publishWithResponseBasic function. We need a solution more complex than before.

### Solution

For complex MQTT subscribe structures in nodeJS projects we take advanced of the nodeJS events. So we could pick out the specific topic by using event listeners with unique event names.

Creating relayResponseEvent.helper.ts

```ts
import EventEmitter from "events";
import { RelayResponseMessage } from "src/interfaces/relay.interface";

export function relayResponseEvent({
  eventEmitter,
  deviceName,
  relayName,
  payload,
}: {
  eventEmitter: EventEmitter;
  deviceName: string;
  relayName: string;
  payload: Buffer;
}) {
  const eventName = `responseEvent/${deviceName}/${relayName}`;
  const eventData: RelayResponseMessage = JSON.parse(payload.toString());
  return eventEmitter.emit(eventName, eventData);
}
```

The function that emits the eventData to the eventName.

Creating the publishWithResponse function in mqtt-async.helper.ts

```ts
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
    const checkTimeOut = setTimeout(() => {
      const relayResponseMessage: RelayResponseMessage = {
        error: true,
        message: "timeOut",
      };

      eventEmitter.emit(responseEventName, relayResponseMessage);
    }, 5000);
    eventEmitter.once(
      responseEventName,
      (relayResponseMessage: RelayResponseMessage) => {
        clearTimeout(checkTimeOut);
        relayResponseMessage.error
          ? reject(relayResponseMessage.message)
          : resolve(relayResponseMessage);
      }
    );

    const payload = { relayState: data };
    client.publish(requestTopic, JSON.stringify(payload), publishOptions);
  });
}
```
