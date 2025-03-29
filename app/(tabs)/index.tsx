import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Button, 
  Platform, 
  Text, 
  Dimensions, 
  View 
} from 'react-native';
import * as Location from 'expo-location';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView, SafeAreaView } from 'react-native';
import * as Updates from 'expo-updates';


let MapView = null;
let Marker = null;
let Polygon = null;

if (Platform.OS !== 'web') {
  const ReactNativeMaps = require('react-native-maps');
  MapView = ReactNativeMaps.default;
  Marker = ReactNativeMaps.Marker;
  Polygon = ReactNativeMaps.Polygon;
}

export default function HomeScreen() {
  const[user, setUser] = useState("gage");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [isFirstUpdate, setIsFirstUpdate] = useState(true);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);  // Store polygon coordinates
  const [mapKey, setMapKey] = useState(0); // State for forcing re-render of MapView

  const handleRefresh = () => {
    setMapKey((prevKey) => prevKey + 1); // Update key to force re-render
  };
  const locationTolerance = 0.001; 

  const isSignificantMovement = (newCoords, prevCoords) => {
    return (
      Math.abs(newCoords.latitude - prevCoords.latitude) > locationTolerance ||
      Math.abs(newCoords.longitude - prevCoords.longitude) > locationTolerance
    );
  };

  const cirs = [
    { latitude: 49.261703, longitude: -123.2532929 },
    { latitude: 49.2616361, longitude: -123.2526167 },
    { latitude: 49.2617227, longitude: -123.2523606 },
    { latitude: 49.263018, longitude: -123.2534389 },
    { latitude: 49.2627917, longitude: -123.2534822 },
    { latitude: 49.2628114, longitude: -123.2539378 },
    { latitude: 49.2621633, longitude: -123.2534366 },
    { latitude: 49.261703, longitude: -123.2532929 },
  ];

  const scrf = [
    { latitude: 49.2637561, longitude: -123.2536637 },
    { latitude: 49.263476, longitude: -123.2544791 },
    { latitude: 49.2628319, longitude: -123.2539891 },
    { latitude: 49.2627917, longitude: -123.2534822 },
    { latitude: 49.2631516, longitude: -123.2534171 },
    { latitude: 49.2632181, longitude: -123.2529289 },
    { latitude: 49.2635787, longitude: -123.2518185 },
    { latitude: 49.264704, longitude: -123.2527192 },
    { latitude: 49.2642546, longitude: -123.2540337 },
    { latitude: 49.2637561, longitude: -123.2536637 },
  ];
  

  const beaty = [
    { latitude: 49.2625743, longitude: -123.250664 },
    { latitude: 49.2627633, longitude: -123.2501759 },
    { latitude: 49.2623887, longitude: -123.2498379 },
    { latitude: 49.2629524, longitude: -123.2482876 },
    { latitude: 49.2637393, longitude: -123.2489317 },
    { latitude: 49.2635431, longitude: -123.2495858 },
    { latitude: 49.2633891, longitude: -123.2497092 },
    { latitude: 49.2632829, longitude: -123.2496311 },
    { latitude: 49.2631919, longitude: -123.24991 },
    { latitude: 49.263291, longitude: -123.2499989 },
    { latitude: 49.262962, longitude: -123.251002 },
    { latitude: 49.2625743, longitude: -123.250664 }
  ];

  const esb = [
    { latitude: 49.263018, longitude: -123.2534389 },
    { latitude: 49.2617227, longitude: -123.2523606 },
    { latitude: 49.2622799, longitude: -123.2507242 },
    { latitude: 49.2635787, longitude: -123.2518185 },
    { latitude: 49.2632181, longitude: -123.2529289 },
    { latitude: 49.2631516, longitude: -123.2534171 },
    { latitude: 49.263018, longitude: -123.2534389 },
  ];




  useEffect(() => {
    let locationSubscription;

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        // Watch location for updates
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,  
            timeInterval: 0,  
            distanceInterval: 1, 
          },
          (newLocation) => {
            if (!location || isSignificantMovement(newLocation.coords, location.coords)) {
              setLocation(newLocation);
              setRegion((prevRegion) =>
                isFirstUpdate
                  ? { ...prevRegion, latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude }
                  : prevRegion 
              );
              setIsFirstUpdate(false);

             
            }
          }
        );
      } catch (error) {
        setErrorMsg('Error getting location: ' + error.message);
      }
    })();

    // Cleanup on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();  // Remove the subscription to stop tracking
      }
    };
  }, [location, isFirstUpdate]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Hello Gage! 
            <HelloWave />
          </ThemedText>
          <ThemedText type="default">
            Welcome to Hide and Seek! You are eric!
          </ThemedText>
          <Button title="Refresh" onPress={handleRefresh} />


          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : location ? (
            <>
              <ThemedText style={styles.locationText}>
                Latitude: {location.coords.latitude.toFixed(4)}
                {'\n'}
                Longitude: {location.coords.longitude.toFixed(4)}
              </ThemedText>
              
              {Platform.OS !== 'web' && MapView && Marker && Polygon && (
                <MapView
                  key={mapKey}
                  mapType="satellite"
                  style={styles.map}
                  region={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    title="Your Location"
                    description="You are here"
                  />

                  <Polygon
                    coordinates={beaty}  
                    fillColor="rgba(200, 93, 0, 0.5)"
                    strokeColor="rgb(200, 90, 0)"
                    strokeWidth={2}
                  />

                  <Polygon
                    coordinates={esb}  
                    fillColor="rgba(0, 200, 0, 0.5)"
                    strokeColor="rgba(0, 200, 0, 1)"
                    strokeWidth={2}
                  />
            
                  {/* <Polygon
                    coordinates={cirs}  
                    fillColor="rgba(0, 3, 200, 0.5)"
                    strokeColor="rgb(40, 0, 200)"
                    strokeWidth={2}
                  /> */}

                  <Polygon
                    coordinates={scrf}  
                    fillColor="rgba(200, 0, 0, 0.5)"
                    strokeColor="rgb(200, 0, 0)"
                    strokeWidth={2}
                  />
                  


                  






                </MapView>
              )}

              {Platform.OS === 'web' && (
                <View style={styles.webLocationNotice}>
                  <Text style={styles.webLocationText}>
                    Map view is not available on web platforms
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.loadingText}>Loading location...</Text>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "black",
    justifyContent: 'center',
  },
  content: {
    backgroundColor: "black",
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    color: "white",
    textAlign: 'center',
  },
  locationText: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  map: {
    width: Dimensions.get('window').width * 0.9,
    height: 300,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  webLocationNotice: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'dark',
  },
  webLocationText: {
    color: 'white',
    textAlign: 'center',
  },
});
