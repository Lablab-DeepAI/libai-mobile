# Welcome to your libai mobile app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Connect android device to the machine to run the wifi signal check

   ```bash
   npm run android
   ```

3. For IOS devices

   ```bash
    npx expo prebuild
    npm run ios
   ```

4. Check wifi scanner tab

5. Check `app/(tabs)/WifiScanner.tsx` page

6. Connect `https API endpoint` and send `wifiNetworks` state to the backend

<hr>

NOTE

- In case of issue

```bash
  - cd android
  - ./gradlew clean
  - npm run android
```
