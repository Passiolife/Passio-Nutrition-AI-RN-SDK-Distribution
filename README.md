# React Native Passio SDK

This project provides React Native bindings for the Passio SDK. It also includes the RN Quickstart application which serves as a test harness for the SDK.

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

1. Install the package using npm install @passiolife/nutritionai-react-native-sdk-v2 or yarn add @passiolife/nutritionai-react-native-sdk-v2

2. Ensure the native dependencies are linked to your app.

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

## Method to obtain food item detail

```typescript
import {
  PassioSDK,
  type PassioFoodItem,
  type PassioID,
} from '@passiolife/nutritionai-react-native-sdk-v2'
```

```typescript
/**
   * Look up the nutrition attributes for a given Passio ID.
   * @param passioID - The Passio ID for the attributes query.
   * @returns A `Promise` resolving to a `PassioFoodItem` object if the record exists in the database or `null` if not.
   */
  getAttributesForPassioID(passioID: PassioID): Promise<PassioFoodItem | null>
```

```typescript
/**
   * Query Passio's UPC web service for nutrition attributes of a given barcode.
   * @param barcode - The barcode value for the attributes query, typically taken from a scanned `BarcodeCandidate`.
   * @returns A `Promise` resolving to a `PassioFoodItem` object if the record exists in the database or `null` if not.
   */
  fetchAttributesForBarcode(barcode: Barcode): Promise<PassioFoodItem | null>
```

```typescript
/**
   * Query Passio's web service for nutrition attributes given an package food identifier.
   * @param packagedFoodCode - The code identifier for the attributes query, taken from the list of package food candidates on a `FoodDetectionEvent`.
   * @returns A `Promise` resolving to a `PassioFoodItem` object if the record exists in the database or `null` if not.
   */
  fetchPassioIDAttributesForPackagedFood(
    packagedFoodCode: PackagedFoodCode
  ): Promise<PassioFoodItem | null>
```
### Example
```typescript

const getFoodItemByPassioID = async (passioID: PassioID) => {
  try {
    const passioFoodItem = await PassioSDK.getAttributesForPassioID(passioID)
  } catch (error) {
    console.log('error', error)
  }
}


const getFoodItemByBarcode = async (barcode: Barcode) => {
  try {
    const passioFoodItem = await PassioSDK.fetchAttributesForBarcode(barcode)
  } catch (error) {
    console.log('error', error)
  }
}

const getFoodItemByPackageFoodCode = async (packagedFoodCode: PackagedFoodCode) => {
  try {
    const passioFoodItem = await PassioSDK.fetchPassioIDAttributesForPackagedFood(packagedFoodCode)
  } catch (error) {
    console.log('error', error)
  }
}
````

## Migration
[Click here](https://github.com/Passiolife/NutritionAI-React-Native-SDK-v2/blob/main/MigrationV2ToV3.md)

## Support V2 Structure
[Click here](https://github.com/Passiolife/NutritionAI-React-Native-SDK-v2/blob/main/supportV2Structure.md)

## Known Issues / Workarounds

If your project does not currently contain any Swift, you might get an undefined symbol errors for the Swift standard library when adding the Passio SDK. Since the Passio SDK is a Swift framework, your app needs to link against the Swift standard library. You can accomplish this by [adding a single Swift file to your project](https://stackoverflow.com/questions/57903395/about-100-error-in-xcode-undefined-symbols-for-architecture-x86-64-upgraded-re).

Because the Passio SDK is a Swift framework and depends on `React-Core`, we need a modular header for this dependency. If you get an error regarding a missing module header for `React-Core`, update your Podfile to produce one:

```ruby
pod 'React-Core', :path => '../node_modules/react-native/', :modular_headers => true
```

## Steps to Publish:

https://github.com/Passiolife/React-Native-Passio-SDK-Internal/wiki/Steps-To-Publish-RN-SDK

## Notes

With XCFramework, we do not need to maintain multiple SDKs for different version of XCode.
