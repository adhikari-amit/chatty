import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    root: {
        padding: 10,
    },
    row:{
        flexDirection: 'row',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        borderColor: '#dedede',
        marginRight: 10,
        borderRadius: 25,
        alignItems: 'center',
        padding:5
    },
    icon:{
        marginHorizontal:3
    },
    input: {
        flex:1,
        marginHorizontal:5
    },

    buttonContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#3777f0',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendImageContainer:{
        flexDirection:'row',
        marginVertical:10,
        alignSelf:"stretch",
        justifyContent:"space-between",
        borderWidth:1,
        borderColor:"lightgray",
        borderRadius:10
    },
    sendAudioContainer:{
        marginVertical:10,
        padding:10,
        justifyContent:"space-between",
        borderWidth:1,
        borderColor:"lightgray",
        borderRadius:10,
        flexDirection:"row",
        alignItems:'center'
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