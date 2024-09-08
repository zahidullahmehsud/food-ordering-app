import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const ReverseProgressBar = () => {
  const totalDuration = 19; // total countdown duration in seconds
  const [countdown, setCountdown] = useState(totalDuration);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => {
          const newCountdown = prevCountdown - 1;
          setProgress(newCountdown / totalDuration);
          return newCountdown;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      timeUp();
    }
  }, [countdown]);

  const timeUp = () => {
    alert('Time is up');
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          width={250}
          height={30}
          color="#3b5998"
          unfilledColor="#e0e0e0"
          borderWidth={1}
          borderColor="#000"
          style={styles.progressBar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.timerText}>{countdown}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    borderRadius: 5,
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250, // Same width as the ProgressBar
    height: 30, // Same height as the ProgressBar
    borderRadius: 5,
  },
  timerText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ReverseProgressBar;
