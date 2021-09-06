import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Keyboard, TextInput, TouchableOpacity, Touchable } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import useColorScheme from '../hooks/useColorScheme';

const windowWidth = Dimensions.get('window').width;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [boardData, setBoardData] = useState([] as any);
  const theme = useColorScheme();
  const [gameStatus, setGameStatus] = useState('');
  const themeColor = theme == 'dark' ? 'white' : 'black';
  const reverseColor = theme == 'dark' ? 'black' : 'white';

  const fetchGame = () => {
    fetch('https://sugoku.herokuapp.com/board?difficulty=easy')
      .then(response => response.json())
      .then(data => setBoardData(data.board));
  }

  useEffect(() => {
    fetchGame();
  }, []);

  const handleBoxPressed = (parentIndex: number, childIndex: number, boxNumber: any) => {
    console.log('ok', parentIndex, childIndex, boxNumber);
    boardData[parentIndex][childIndex]
    Keyboard.dismiss();
  };

  const encodeBoard = (board: any) => board.reduce((result: any, row: any, i: any) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')

  const encodeParams = (params: any) =>
    Object.keys(params)
      .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
      .join('&');

  const handleNewGame = () => {
    fetchGame();
    setGameStatus('');
  }

  const handleValidate = () => {
    const checkData = { board: boardData };
    console.log('checkData', checkData)
    fetch('https://sugoku.herokuapp.com/validate', {
      method: 'POST',
      body: encodeParams(checkData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        setGameStatus(response.status)
      })
      // .then(response => setGameStatus(response.status))
      .catch(console.warn)
  }

  const handleSolved = () => {
    const submitData = { board: boardData };
    fetch('https://sugoku.herokuapp.com/solve', {
      method: 'POST',
      body: encodeParams(submitData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(response => response.json())
      .then(response => {
        setBoardData(response.solution)
        setGameStatus('solved');
      })
      .catch(console.warn)
  }

  return (
    <View style={styles.container}>
      <Text>Status : {gameStatus}</Text>
      <View style={styles.boxContainer}>
        {boardData?.map((obj: any, index: number) => {
          return (
            <View
              key={index + 'box'}
              style={styles.itemContainer}
            >
              {obj?.map((number: any, i: number) => {
                const uniqueKey = index + 'num' + i + 'key' + number;
                return (
                  <View
                    key={uniqueKey}
                    style={styles.itemNumber}
                  >
                    {number == 0 ?
                      <TextInput
                        key={uniqueKey}
                        style={{ ...styles.inputSize, color: themeColor }}
                        onChangeText={text => handleBoxPressed(index, i, text)}
                        keyboardType="number-pad"
                      />
                      :
                      <Text style={{ color: themeColor }}>{number}</Text>
                    }
                  </View>
                )
              })}
            </View>
          )
        })}
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={() => handleNewGame()}
          style={{ ...styles.button, backgroundColor: themeColor }}
        >
          <Text style={{ color: reverseColor }}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleValidate()}
          style={{ ...styles.button, backgroundColor: themeColor }}
        >
          <Text style={{ color: reverseColor }}>Validate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSolved()}
          style={{ ...styles.button, backgroundColor: themeColor }}
        >
          <Text style={{ color: reverseColor }}>Solve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '5%'
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
  inputSize: {
    height: '100%',
    width: '100%',
    textAlign: 'center'
  },
  itemNumber: {
    height: '33%',
    width: '33%',
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 20
  },
  button: {
    borderRadius: 5,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center'
  }
});