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
    }
})

export default styles