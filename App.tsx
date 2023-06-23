/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// @ts-ignore
global.Buffer = global.Buffer || require('buffer').Buffer;

import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';

import Sound from 'react-native-sound';

import MidiPlayer from 'midi-player-js';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const midiBase64 = `data:audio/midi;base64,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YIAyAACQPFKDYIA8AACQO06BcIA7AACQOUuBcIA5AACQN0mDYIA3AACQN0uDYIA3AACQNkuDYIA2AACQNEuDYIA0AACQOU+DYIA5AACQMkqFUIAyAACQMEuDYIAwAACQMEyBcIAwAACQNE+BcIA0AACQN1KDYIA3AACQNU2DYIA1AACQNEyDYIA0AACQNk2BcIA2AACQOE+BcIA4AACQOU+DYIA5AACQN0uDYIA3AACQMkmBcIAyAACQMEmBcIAwAACQL0qBcIAvAACQLUmBcIAtAACQK0mDYIArAACQL02DYIAvAACQME2DYIAwAACQMk2DYIAyAACQN1CDYIA3AACQN02FUIA3AACQMEqDYIAwAACQMEyBcIAwAACQNE+BcIA0AACQN1KDYIA3AACQNU2DYIA1AACQNEyDYIA0AACQNk2BcIA2AACQOE+BcIA4AACQOU+DYIA5AACQN0uDYIA3AACQMkmBcIAyAACQMEmBcIAwAACQL0qBcIAvAACQLUmBcIAtAACQK0mDYIArAACQME6DYIAwAACQMk6DYIAyAACQMEyDYIAwAACQMk2DYIAyAACQK1AAN1CHcYArAAA3AAD/LwA=`;
const soundFiles = {
  A0: require('./sounds/A0.mp3'),
  A1: require('./sounds/A1.mp3'),
  A2: require('./sounds/A2.mp3'),
  A3: require('./sounds/A3.mp3'),
  A4: require('./sounds/A4.mp3'),
  A5: require('./sounds/A5.mp3'),
  A6: require('./sounds/A6.mp3'),
  A7: require('./sounds/A7.mp3'),
  Ab1: require('./sounds/Ab1.mp3'),
  Ab2: require('./sounds/Ab2.mp3'),
  Ab3: require('./sounds/Ab3.mp3'),
  Ab4: require('./sounds/Ab4.mp3'),
  Ab5: require('./sounds/Ab5.mp3'),
  Ab6: require('./sounds/Ab6.mp3'),
  Ab7: require('./sounds/Ab7.mp3'),
  B0: require('./sounds/B0.mp3'),
  B1: require('./sounds/B1.mp3'),
  B2: require('./sounds/B2.mp3'),
  B3: require('./sounds/B3.mp3'),
  B4: require('./sounds/B4.mp3'),
  B5: require('./sounds/B5.mp3'),
  B6: require('./sounds/B6.mp3'),
  B7: require('./sounds/B7.mp3'),
  Bb0: require('./sounds/Bb0.mp3'),
  Bb1: require('./sounds/Bb1.mp3'),
  Bb2: require('./sounds/Bb2.mp3'),
  Bb3: require('./sounds/Bb3.mp3'),
  Bb4: require('./sounds/Bb4.mp3'),
  Bb5: require('./sounds/Bb5.mp3'),
  Bb6: require('./sounds/Bb6.mp3'),
  Bb7: require('./sounds/Bb7.mp3'),
  C1: require('./sounds/C1.mp3'),
  C2: require('./sounds/C2.mp3'),
  C3: require('./sounds/C3.mp3'),
  C4: require('./sounds/C4.mp3'),
  C5: require('./sounds/C5.mp3'),
  C6: require('./sounds/C6.mp3'),
  C7: require('./sounds/C7.mp3'),
  C8: require('./sounds/C8.mp3'),
  D1: require('./sounds/D1.mp3'),
  D2: require('./sounds/D2.mp3'),
  D3: require('./sounds/D3.mp3'),
  D4: require('./sounds/D4.mp3'),
  D5: require('./sounds/D5.mp3'),
  D6: require('./sounds/D6.mp3'),
  D7: require('./sounds/D7.mp3'),
  Db1: require('./sounds/Db1.mp3'),
  Db2: require('./sounds/Db2.mp3'),
  Db3: require('./sounds/Db3.mp3'),
  Db4: require('./sounds/Db4.mp3'),
  Db5: require('./sounds/Db5.mp3'),
  Db6: require('./sounds/Db6.mp3'),
  Db7: require('./sounds/Db7.mp3'),
  Db8: require('./sounds/Db8.mp3'),
  E1: require('./sounds/E1.mp3'),
  E2: require('./sounds/E2.mp3'),
  E3: require('./sounds/E3.mp3'),
  E4: require('./sounds/E4.mp3'),
  E5: require('./sounds/E5.mp3'),
  E6: require('./sounds/E6.mp3'),
  E7: require('./sounds/E7.mp3'),
  Eb1: require('./sounds/Eb1.mp3'),
  Eb2: require('./sounds/Eb2.mp3'),
  Eb3: require('./sounds/Eb3.mp3'),
  Eb4: require('./sounds/Eb4.mp3'),
  Eb5: require('./sounds/Eb5.mp3'),
  Eb6: require('./sounds/Eb6.mp3'),
  Eb7: require('./sounds/Eb7.mp3'),
  F1: require('./sounds/F1.mp3'),
  F2: require('./sounds/F2.mp3'),
  F3: require('./sounds/F3.mp3'),
  F4: require('./sounds/F4.mp3'),
  F5: require('./sounds/F5.mp3'),
  F6: require('./sounds/F6.mp3'),
  F7: require('./sounds/F7.mp3'),
  G1: require('./sounds/G1.mp3'),
  G2: require('./sounds/G2.mp3'),
  G3: require('./sounds/G3.mp3'),
  G4: require('./sounds/G4.mp3'),
  G5: require('./sounds/G5.mp3'),
  G6: require('./sounds/G6.mp3'),
  G7: require('./sounds/G7.mp3'),
  Gb1: require('./sounds/Gb1.mp3'),
  Gb2: require('./sounds/Gb2.mp3'),
  Gb3: require('./sounds/Gb3.mp3'),
  Gb4: require('./sounds/Gb4.mp3'),
  Gb5: require('./sounds/Gb5.mp3'),
  Gb6: require('./sounds/Gb6.mp3'),
  Gb7: require('./sounds/Gb7.mp3'),
};

const sounds = Object.fromEntries(
  Object.entries(soundFiles).map(([name, file]) => {
    const sound = new Sound(file, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      console.log(sound.isLoaded());
    });
    console.log(sound.isLoaded());
    return [name, sound];
  }),
);

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [player, setPlayer] = useState<MidiPlayer.Player>();
  const [speed, setSpeed] = useState(1);
  const [lastTempo, setLastTempo] = useState<number>();

  const load = () => {
    const player = new MidiPlayer.Player(function (event: any) {
      if (event.name === 'Note on') {
        sounds[event.noteName].play();
      }

      if (event.name === 'Set Tempo') {
        console.log(event);
        setLastTempo(event.data);
        player.tempo = event.data * speed;
      }
    });

    // Load a MIDI file
    player.loadDataUri(midiBase64);

    setPlayer(player);
  };

  const play = () => {
    player?.play();
  };

  const pause = () => {
    player?.pause();
  };

  const stop = () => {
    player?.stop();
  };

  const jumpBackward = () => {
    if (!player) return;
    const totalTime = player.getSongTime();
    const remainingTime = player.getSongTimeRemaining();
    const currentTime = totalTime - remainingTime;

    console.log(
      totalTime,
      remainingTime,
      currentTime,
      Math.max(currentTime - 5, 0),
    );

    const wasPlaying = player.isPlaying();
    player.skipToSeconds(Math.max(currentTime - 5, 0));
    if (wasPlaying) player.play();
  };

  const jumpForward = () => {
    if (!player) return;
    const totalTime = player.getSongTime();
    const remainingTime = player.getSongTimeRemaining();
    const currentTime = totalTime - remainingTime;

    console.log(
      totalTime,
      remainingTime,
      currentTime,
      Math.min(currentTime + 5, totalTime),
    );

    const wasPlaying = player.isPlaying();
    player.skipToSeconds(Math.min(currentTime + 5, totalTime));
    if (wasPlaying) player.play();
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if (!player || !lastTempo) return;

    player.tempo = lastTempo * speed;
  }, [lastTempo, speed, player]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button onPress={load} title="Load midi" />
          {player && (
            <>
              <Button onPress={play} title="Play" />
              <Button onPress={pause} title="Pause" />
              <Button onPress={stop} title="Stop" />

              <Button onPress={jumpBackward} title="<< 5 sec" />
              <Button onPress={jumpForward} title=">> 5 sec" />

              <Button onPress={() => setSpeed(0.5)} title="Tempo 50%" />
              <Button onPress={() => setSpeed(1)} title="Tempo 100%" />
              <Button onPress={() => setSpeed(2)} title="Tempo 200%" />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
