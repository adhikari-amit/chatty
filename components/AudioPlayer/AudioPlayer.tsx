import { View, Text,Pressable } from 'react-native'
import { SimpleLineIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Audio, AVPlaybackStatus } from 'expo-av'
import styles from './style'

const AudioPlayer = ({soundURI}:any) => {
    const [pause, setPause] = useState(true)
    const [audioProgress,setAudioProgress]=useState(0)
    const [audioDuration,setAudioDuration]=useState(0)
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    
    useEffect(()=>{
       const loadSound=async()=>{
        if(!soundURI) {return}
           const { sound } = await Audio.Sound.createAsync({ uri:soundURI },{}, onPlaybackStatusUpdate)
           setSound(sound)
       }
       loadSound();

       ()=>{
        if(sound){
            sound.unloadAsync()
        }
       }

    },[soundURI])
    const onPlaybackStatusUpdate=(status:AVPlaybackStatus)=>{
        if(!status.isLoaded){
             return
        }
 
        setAudioProgress(status.positionMillis/(status.durationMillis || 1))
        setPause(!status.isPlaying)
        setAudioDuration(status.durationMillis || 0)
     }


    const playPauseSound = async () => {
        if (!sound) {
            return
        }
        if (pause) {
            await sound.playFromPositionAsync(0)
        }
        else {
            await sound.playAsync()
        }
    }
    
    const getDuration=()=>{
        const minutes=Math.floor(audioDuration / (60*1000))
        const seconds=Math.floor((audioDuration % (60*1000)) /1000)
        return `${minutes}:${seconds<10 ? "0":""}${seconds.toPrecision()}`
    }

  return (
    <View style={styles.sendAudioContainer}>
                    <Pressable onPress={playPauseSound}>
                        <Feather name={pause?'play':'pause'} size={24} color="black" />
                    </Pressable>
                    <View style={styles.audioProgressBG}>
                        <View style={[styles.audioProgressFG,{left:`${audioProgress*100}%`}]} />
                    </View>
                    <Text>{getDuration()}</Text>
                </View>
  )
}

export default AudioPlayer