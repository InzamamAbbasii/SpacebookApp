import React from "react";
import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles=StyleSheet.create({
    inputContainer:{
        alignItems:'center',
        flexDirection:'column',
        marginVertical:20,
        height:hp('10%'),
        marginHorizontal:20
    },
    input:{
        height:hp('5%'),
        width:wp('60%'),
        padding:5, 
        borderWidth:1,
        marginVertical:5
    },
    logo:{
        height:hp('20%'),
        width:wp('15%'),
        alignItems:'center',
        marginHorizontal:wp('45%')
    },

    buttonContainer:{
        marginTop:6,
        marginHorizontal:wp('5%')
    },
    button:{
        marginVertical:5
    }
});
  

export default styles;