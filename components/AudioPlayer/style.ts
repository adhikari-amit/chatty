import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    sendAudioContainer:{
        marginVertical:10,
        padding:10,
        justifyContent:"space-between",
        borderWidth:1,
        borderColor:"lightgray",
        borderRadius:10,
        flexDirection:"row",
        alignItems:'center',
        alignSelf:'stretch',
        backgroundColor:'white' 
    },
    audioProgressBG:{
        height:3,
        flex:1,
        backgroundColor:'lightgray',
        borderRadius:5,
        margin:10 
    },
    audioProgressFG:{
        width:10,
        height:10,
        borderRadius:10,
        backgroundColor:"#3777f0",
        position:'absolute',
        top:-3,
    
    }
})

export default styles