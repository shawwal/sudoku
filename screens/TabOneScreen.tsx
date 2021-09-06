import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

const windowWidth = Dimensions.get('window').width;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [boardData, setBoardData] = useState([]);
  const fetchGame = () => {
    fetch('https://sugoku.herokuapp.com/board?difficulty=easy')
      .then(response => response.json())
      .then(data => setBoardData(data.board));
  }

  useEffect(() => {
    fetchGame();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        {boardData?.map((obj: any, index: number) => {
          return (
            <View
              key={index}
              style={styles.itemContainer}
            >
              {obj.map((number: any, i: number) => {
                return (
                  <View
                    key={index + i + 'num'}
                    style={styles.itemNumber}
                  >
                    <Text>{number == 0 ? '' : number }</Text>
                  </View>
                )
              })}
            </View>
          )
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContainer: {
    height: windowWidth,
    width: windowWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: 'green',
    height: '33%',
    width: '33%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemNumber: {
    borderWidth: 1,
    borderColor: 'red',
    height: '33%',
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
