import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';


const ReviewAnalyzeBarChart = ({ reviews }) => {

    if (!reviews) {
        return <Text>No review data available</Text>;
    }
    

    const satisfactoryPercent = reviews.positive_percent || 0;
    const neutralPercent = reviews.neutral_percent || 0;
    const poorPercent = reviews.poor_percent || 0;


    const nonFilledSatisfactoryWidth = 100 - satisfactoryPercent;
    const nonFilledNeutralWidth = 100 - neutralPercent;
    const nonFilledPoorWidth = 100 - poorPercent;

    console.log('Fetched review data1:',reviews)
    console.log('satisfactoryPercent',satisfactoryPercent)
    console.log('neutralPercent',neutralPercent)
    console.log('poorPercent',poorPercent)
    
    const maxWidth = '90%';

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Review Analysis</Text> */}
            <View style={styles.chart}>

                {/* Positive Bar */}
                <Text style={{fontWeight:'bold'}}>Satisfactory {`${satisfactoryPercent.toFixed(1)}%`}</Text>
                <Svg height={25} width={maxWidth} style={{marginBottom:-16}}>
                    {/* Non-filled background */}
                    <Rect x={`${satisfactoryPercent}%`} y="0%" width={`${nonFilledSatisfactoryWidth}%`} height="15%" fill="#e9ebe8" />

                    {/* filled background */}
                    <Rect x="0%" y="0%" width={`${satisfactoryPercent}%`} height="15%" fill="#4CAF50" />
                   
                </Svg>

                
                {/* Neutral Bar */}
                <Text style={{fontWeight:'bold'}}>Neutral {`${neutralPercent.toFixed(1)}%`}</Text>
                <Svg height={25} width={maxWidth} style={{marginBottom:-16}}>
                    {/* Non-filled background */}
                    <Rect x={`${neutralPercent}%`} y="0%" width={`${nonFilledNeutralWidth}%`} height="15%" fill="#e9ebe8" />

                     {/* filled background */}
                    <Rect x="0%" y="0%" width={`${neutralPercent}%`} height="15%" fill="#FFC107" />

            
                </Svg>

                {/* Negative Bar */}
                <Text style={{fontWeight:'bold'}}>Poor {`${poorPercent.toFixed(1)}%`}</Text>
                <Svg height={25} width={maxWidth}>
                     {/* Non-filled background */}
                     <Rect x={`${poorPercent}%`} y="0%" width={`${nonFilledPoorWidth}%`} height="15%" fill="#e9ebe8" />

                     {/* filled background */}
                    <Rect x="0%" y="0%" width={`${poorPercent}%`} height="15%" fill="#f07373" />
                </Svg>
            </View>
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    chart: {
        marginTop: 6,
        width: '100%',
        alignSelf:'flex-start',
    },
});

export default ReviewAnalyzeBarChart;
