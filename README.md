# React Native Passio SDK

This project provides React Native bindings for the Passio SDK. It also includes the RN Quickstart application which serves as a test harness for the SDK.

## Documentation

See the [API docs](https://passio.gitbook.io/nutrition-ai/guides/react-native-sdk-docs/getting-started-v2/installation) for more details.


## Requirements

- React Native v0.60.0 or higher
- Xcode 13 or higher
- iOS 13 or higher (the SDK will build against iOS 11 or higher but features are limited to >= iOS 13)
- Android API level 26 or higher
- Cocoapods 1.10.1 or higher

Please note that the SDK will currently not run in the iOS simulator. We hope to change this in the future, but an iOS test device is required for now.


## Testing the SDK with Example App

1. run `yarn` in the root of the project (not the example folder).
2. `cd example/ios/` and run `pod install`
3. Add your license key into the key section of LoadingContainerView.tsx. The key should be in single quotes: `'yourkey'`.
4. `open ReactNativeQuickstart.xcworkspace/` to open up Xcode & build the app in Xcode
5. Run `yarn start` in the example folder to start the metro server
6. Run on your physical device. The app will not run in a simulator.

7. To run on Android, exit out of the iOS work and stop the metro server (CNTR-C)
8. In example folder `run yarn android`
9. In a separate terminal open example/android/ and run `open -a /Applications/Android\ Studio.app .`
10. Run Gradle Sync before building on your Android device

## Installation

1. Create an `.npmrc` file in the root of your project with the following lines, replacing `GITHUB_ACCESS_TOKEN` with the token provided to you by Passio. This grants you access to the SDK's private listing on Github Package Registry.

```
//npm.pkg.github.com/:_authToken=GITHUB_ACCESS_TOKEN
@passiolife:registry=https://npm.pkg.github.com
```

2. Install the package using npm install @passiolife/nutritionai-react-native-sdk-v2 or yarn add @passiolife/nutritionai-react-native-sdk-v2

3. Ensure the native dependencies are linked to your app.

For Android, add below dependencies into build.gradle file.

```bash
implementation files("$rootDir/../node_modules/@passiolife/nutritionai-react-native-sdk-v2/android/libs/passiolib-release.aar")
```

For iOS, run pod install.

```bash
cd ios; pod install
```

For Android, auto-linking should handle setting up the Gradle dependency for your project.

## Usage

1. Enter a value for `NSCameraUsageDescription` in your Info.plist so the camera may be utilized.

2. Import the SDK

```js
import {
  PassioSDK,
  DetectionCameraView,
} from '@passiolife/nutritionai-react-native-sdk-v2';
```

3. To show the live camera preview, add the DetectionCameraView to your view

```js
// Somewhere in your component (inside of a flex container)

<DetectionCameraView style={{ flex: 1, width: '100%' }} />
```

4. When your component mounts, configure the SDK using your Passio provided developer key and start food detection.

```js
// In your component

const [isReady, setIsReady] = useState(false);

// Effect to configure the SDK and request camera permission
// We are adding our developer key in LoadingContainerView
useEffect(() => {
  Promise.all([
    PassioSDK.configure({
      key: 'your-developer-key',
      autoUpdate: true,
    }),
    PassioSDK.requestCameraAuthorization(),
  ]).then(([sdkStatus, cameraAuthorized]) => {
    console.log(
      `SDK configured: ${sdkStatus.mode} Camera authorized: ${cameraAuthorized}`
    );
    setIsReady(sdkStatus.mode === 'isReadyForDetection' && cameraAuthorized);
  });
}, []);

// Once the SDK is ready, start food detection
useEffect(() => {
  if (!isReady) {
    return;
  }
  const config: FoodDetectionConfig = {
    detectBarcodes: true,
    detectPackagedFood: true,
    detectNutritionFacts: true,
  };
  const subscription = PassioSDK.startFoodDetection(
    config,
    async (detection: FoodDetectionEvent) => {
      console.log('Got food detection event: ', detection);

      const { candidates, nutritionFacts } = detection;

      if (candidates?.barcodeCandidates?.length) {
        // show barcode candidates to the user
      } else if (candidates?.packagedFoodCode?.length) {
        // show package food code candidates to the user
      } else if (candidates?.detectedCandidates?.length) {
        // show visually recognized candidates to the user
      } else if (nutritionFacts) {
        // Show scanned nutrition facts to the user
      }
    }
  );

  // stop food detection when component unmounts
  return () => subscription.remove();
}, [isReady]);
```
