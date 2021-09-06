import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Keyboard, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import useColorScheme from '../hooks/useColorScheme';

const windowWidth = Dimensions.get('window').width;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [boardData, setBoardData] = useState([]);
  const theme = useColorScheme();
  const themeColor = theme == 'dark' ? 'white' : 'black';

  const fetchGame = () => {
    fetch('https://sugoku.herokuapp.com/board?difficulty=easy')
      .then(response => response.json())
      .then(data => setBoardData(data.board));
  }

  useEffect(() => {
    fetchGame();
  }, []);

  const handleBoxPressed = (index: number, i: number, boxNumber: any, insert: any) => {
    console.log('ok', index, i, boxNumber, insert);
    Keyboard.dismiss();
  }

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
                const numberChecked = number == 0 ? '' : number.toString(); 
                return (
                  <TextInput
                    key={index + i + 'num'}
                    style={{...styles.itemNumber, color: themeColor}}
                    defaultValue={numberChecked}
                    onChangeText={text => handleBoxPressed(index, i, number, text)}
                    keyboardType="number-pad"
                  />
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
    borderColor: 'gray',
    textAlign: 'center',
    height: '33%',
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
