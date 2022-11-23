import { StyleSheet } from "react-native"
const blue = '#3777f0';
const grey = 'lightgrey';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: "75%",
    // display:"flex",
  },
  row:{
     flexDirection:"row"
  },
  messageReply: {
    backgroundColor: "gray",
    padding: 5,
    borderRadius: 5,
  },
  leftContainer: {
    backgroundColor: blue,
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: "auto",
    marginRight: 10,
    alignItems: "flex-end",
  },
  });
  

export default styles