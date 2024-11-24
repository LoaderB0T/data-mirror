[![npm](https://img.shields.io/npm/v/data-mirror?color=%2300d26a&style=for-the-badge)](https://www.npmjs.com/package/data-mirror)
[![Build Status](https://img.shields.io/github/actions/workflow/status/LoaderB0T/data-mirror/build.yml?branch=main&style=for-the-badge)](https://github.com/LoaderB0T/data-mirror/actions/workflows/build.yml)
[![Sonar Quality Gate](https://img.shields.io/sonar/quality_gate/LoaderB0T_data-mirror?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/summary/new_code?id=LoaderB0T_data-mirror)
[![bundle size](https://img.shields.io/bundlephobia/minzip/data-mirror?color=%23FF006F&label=Bundle%20Size&style=for-the-badge)](https://bundlephobia.com/package/data-mirror)

# data-mirror

Sync data across **any\*** boundaries.

<span style="font-size: 8px">\* = Browser tabs, windows, contexts, out of the box. Extensible for everything else!</span>

## Motivation 💥

**data-mirror** is a tool to synchronize data. It is extensible and can be used in various scenarios. Out of the box, it provides ways to synchronize within one window or across multiple tabs or windows (browser contexts).

## Features 🔥

✅ Synchronize data

✅ Framework agnostic

✅ Hashing for data comparison

✅ Synchronize with callbacks

✅ Synchronize within one window

✅ Sync across multiple tabs or windows (browser contexts)

✅ Extensible for custom synchronization scenarios

## Built With 🔧

- [TypeScript](https://www.typescriptlang.org/)

## Installation 📦

```console
pnpm i data-mirror
// or
yarn add data-mirror
// or
npm i data-mirror
```

## Usage Example 🚀

```typescript
import { DataMirror } from 'data-mirror';

const sync = new DataMirror('my-sync', a => a);
sync.listenForChanges(value => {
  console.log('new value:', value);
});
sync.update('test value');
```

### With strategies

```typescript
import { DataMirror, DataMirrorWindowStrategy, DataMirrorBroadcastStrategy } from 'data-mirror';

const sync = new DataMirror('my-sync', a => a).withStrategy(
  new DataMirrorWindowStrategy(),
  new DataMirrorBroadcastStrategy()
);
```

### Implement a custom strategy

```typescript
import { DataMirrorStrategy, Payload } from 'data-mirror';

export class DataMirrorBroadcastStrategy<T> extends DataMirrorStrategy<T> {

  public init() {
    // Initialize the strategy
  }

  public onUpdate(payload: Payload<T>) {
    // Handle the update to inform the remote instances about the change
  }
}

```

## Contributing 🧑🏻‍💻

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 🔑

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact 📧

Janik Schumacher - [@LoaderB0T](https://twitter.com/LoaderB0T) - [linkedin](https://www.linkedin.com/in/janikschumacher/)

Project Link: [https://github.com/LoaderB0T/data-mirror](https://github.com/LoaderB0T/data-mirror)
