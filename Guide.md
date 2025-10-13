# Developer Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Implementing New Features](#implementing-new-features)
- [Publishing Package](#publishing-package)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- Yarn package manager
- Xcode (for iOS development)
- Android Studio (for Android development)
- JDK 17 (required for Android development)
- CocoaPods (for iOS dependencies)

## Getting Started

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project root
cd NutritionAI-React-Native-SDK-v3

# Install dependencies
yarn
```

Add `.env` at root `example` directory

```
ENV_PASSIO_KEY = YOUR_PASSIO_KEY
```

### Step 2: iOS Setup

1. Install iOS dependencies:

```bash
cd example/ios
pod install
cd ../..
```

2. Open the iOS project in Xcode:

```bash
cd example && xed ios
```

3. Build and run the project in Xcode

**Note**: If you encounter a Yoga error during iOS compilation:

- Option 1: Add an extra `|` character in the affected file
- Option 2: Click the "Fix" button in Xcode
- If a second error appears, click "Fix" again

### Step 3: Android Setup

1. Open Android Studio
2. Navigate to `example/android` and open the project
3. Sync Gradle files
4. Build and run the project

**Important**:

- Android Studio requires JDK 17
- Ensure your JAVA_HOME environment variable points to JDK 17
- If you encounter build issues, try invalidating caches and restarting Android Studio

## Development Workflow

### Project Structure

```
├── android/           # Android native code
├── ios/              # iOS native code
├── src/              # React Native bridge code
├── example/          # Example application
└── package.json      # Project configuration
```

## Implementing New Features

### 1. Updating SDK Versions

#### Android SDK Update

Update the SDK version in two locations:

1. Example project (`example/android/app/build.gradle`):

```gradle
implementation 'ai.passio.passiosdk:nutrition-ai:3.2.6-1'
```

2. Root project (`android/build.gradle`):

```gradle
implementation 'ai.passio.passiosdk:nutrition-ai:3.2.6-1'
```

#### iOS Framework Update

1. Replace the framework file in `ios/Frameworks` directory
2. Clean and rebuild the project

### 2. Adding New API Methods

#### Android Implementation

1. Open `android/src/main/java/com/reactnativepassiosdk/PassioSDKBridge.kt`
2. Add new method with `@ReactMethod` annotation:

```kotlin
@ReactMethod
fun searchForFoodSemantic(searchQuery: String, promise: Promise) {
    PassioSDK.instance.searchForFoodSemantic(
        term = searchQuery,
        callback = { results, alternatives ->
            val map = WritableNativeMap()
            val mapAlternatives = alternatives.mapToStringArray()
            val mapPassioSearchResult = results.mapBridged(::bridgePassioFoodDataInfo)
            map.putIfNotNull("results", mapPassioSearchResult)
            map.putIfNotNull("alternatives", mapAlternatives)
            promise.resolve(map)
        })
}
```

#### iOS Implementation

1. Add method to `PassioSDKBridge.swift`:

```swift
@objc(searchForFoodSemantic:withResolver:withRejecter:)
func searchForFoodSemantic(term: String,
                   resolve: @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock) {
    sdk.searchForFoodSemantic(searchTerm: term) { searchResponse in
        if let searchResponse = searchResponse {
            resolve(bridgeSearchResponse(searchResponse))
        } else {
            resolve(NSNull())
        }
    }
}
```

2. Add method declaration in `PassioSDKBridge.m`:

```objc
RCT_EXTERN_METHOD(searchForFoodSemantic:(NSString *)term
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
```

#### React Native Interface

1. Update `PassioSDKInterface.ts`:

```typescript
/**
 * Search for food semantic will return a list of alternate search and search result
 * @param searchQuery - User typed text
 * @returns A Promise resolving to an array of food item result
 */
searchForFoodSemantic(searchQuery: string): Promise<PassioSearchResult | null>
```

2. Implement in `SDKBridge.ts`:

```typescript
async searchForFoodSemantic(
    searchQuery: string
): Promise<PassioSearchResult | null> {
    return PassioSDKBridge.searchForFoodSemantic(searchQuery)
}
```

## Publishing Package

### Prerequisites

- GitHub account with write access to the repository
- GitHub access token with `write:packages` permission
- NPM account with access to the organization

### Publishing Steps

1. **Prepare Release**

   ```bash
   # Ensure you're on main branch
   git checkout main

   # Create and switch to release branch
   git checkout -b release
   ```

2. **Update Version**

   - Update version in `package.json`
   - Commit changes:
     ```bash
     git add package.json
     git commit -m "Bump version to X.Y.Z"
     ```

3. **Create Release**

   ```bash
   # Tag the release
   git tag -a 'X.Y.Z' -m 'X.Y.Z'

   # Push changes and tags
   git push origin release --tags
   ```

4. **Publish to NPM**

   ```bash
   # Login to GitHub Package Registry
   npm login --scope=@passiolife --registry=https://npm.pkg.github.com

   # Publish package
   npm publish
   ```

5. **Cleanup**
   ```bash
   # Merge release branch back to main
   git checkout main
   git merge release
   git push origin main
   ```

## Troubleshooting

### Common Issues

#### iOS

- **Yoga Error**: Add extra `|` character or use Xcode's "Fix" button
- **Build Failures**:
  - Clean build folder (Xcode → Product → Clean Build Folder)
  - Delete derived data
  - Run `pod install` again

#### Android

- **JDK Version Issues**:
  - Verify JDK 17 installation: `java -version`
  - Update JAVA_HOME environment variable
- **Build Failures**:
  - Clean project in Android Studio
  - Invalidate caches and restart
  - Sync project with Gradle files

#### General

- **Dependency Issues**:
  - Delete `node_modules` and `yarn.lock`
  - Run `yarn install`
  - Clear Metro bundler cache: `yarn start --reset-cache`

### Getting Help

- Check existing issues in the repository
- Create a new issue with:
  - Detailed description of the problem
  - Steps to reproduce
  - Environment information
  - Relevant logs
