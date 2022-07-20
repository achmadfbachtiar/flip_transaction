/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const SUCCESS_COLOR = '#50b986';
const PENDING_COLOR = '#f86742';

var sortingOptions = [
  {
    label: "URUTKAN",
    value: ""
  },
  {
    label: "Nama A-Z",
    value: "asc"
  },
  {
    label: "Nama Z-A",
    value: "desc"
  },
  {
    label: "Tanggal Terbaru",
    value: "newest"
  },
  {
    label: "Tanggal Terlama",
    value: "oldest"
  },
];

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

var TRANSACTION_DATA = [];


const App = () => {
  const [search, setSearch] = useState("");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const [detailData, setDetailData] = useState({});
  const [transactionsData, setTransactionsData] = useState([]);

  useEffect(() => {
    getTransactionList();
  }, []);

  const getTransactionList = () => {
    return fetch('https://recruitment-test.flip.id/frontend-test')
      .then((response) => response.json())
      .then((json) => {
        let tempData = [];
        for (let value of Object.values(json)) {
          tempData.push(value);
        }
        TRANSACTION_DATA = tempData;
        setTransactionsData(TRANSACTION_DATA);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const currencyConverter = (value) => {
    return `Rp${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  const dateConverter = (value) => {
    const dateTime = (value).split(" ");
    let date = dateTime[0];
    let dateSplit = date.split("-");
    let month = parseInt(dateSplit[1]);
    let monthName = MONTHS[month - 1];
    return `${dateSplit[2]} ${monthName} ${dateSplit[0]}`;
  };

  // SEARCH BAR START ===
  // Search Transaction List
  useEffect(() => {
    if(search.length > 0) {
      let filtered = transactionsData.filter((data) => {
        return data.beneficiary_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || 
        data.beneficiary_bank.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || 
        data.sender_bank.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        data.amount.toString().includes(search)
      });
      setTransactionsData(filtered);
    } else {
      setTransactionsData(TRANSACTION_DATA);
    }
  }, [search]);
  
  // Sort Transaction List
  useEffect(() => {
    let index = sortingOptions.findIndex(x => x.value === selectedSort);
    setSortIndex(index);
    let sorted = [];
    switch(selectedSort) {
      case "asc":
        sorted = transactionsData.sort((a, b) => a.beneficiary_name.localeCompare(b.beneficiary_name));
        setTransactionsData(sorted);
        break;
      case "desc":
        sorted = transactionsData.sort((a, b) => b.beneficiary_name.localeCompare(a.beneficiary_name));
        setTransactionsData(sorted);
        break;
      case "newest":
        sorted = transactionsData.sort((a, b) => a.created_at.localeCompare(b.created_at));
        setTransactionsData(sorted);
        break;
      case "oldest":
        sorted = transactionsData.sort((a, b) => b.created_at.localeCompare(a.created_at));
        setTransactionsData(sorted);
        break;
      default:
        setTransactionsData(TRANSACTION_DATA);
    }
  }, [selectedSort]);
  

  const sortTransactionList = (value) => {
    setSelectedSort(value);
    setSortModalVisible(!sortModalVisible);
  };

  const onChangeSearch = (value) => {
    setSearch(value.nativeEvent.text);
  };

  const txtHandler = (enteredName) => {
    setSearch(enteredName);
  };
  
  // Sorting Modal Component
  const SortModal = () => {
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => {
          setSortModalVisible(!sortModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={searchbarStyles.modalView}>
            <RadioForm
              initial={sortIndex}
              radio_props={sortingOptions}
              formHorizontal={false}
              labelHorizontal={true}
              buttonColor={PENDING_COLOR}
              selectedButtonColor={PENDING_COLOR}
              animation={true}
              onPress={sortTransactionList}
              buttonSize={13}
              buttonOuterSize={25}
              labelStyle={{fontSize: 18, marginVertical: 5}}
            />
          </View>
        </View>
      </Modal>
    );
  };

  // Searchbar Style
  const searchbarStyles = StyleSheet.create({
    container: {
      height: 55, 
      backgroundColor: '#ffffff', 
      flexDirection: 'row', 
      marginVertical: 8, 
      marginHorizontal: 16, 
      borderRadius: 10,
    },
    searchIconContainer: {
      width: '15%', 
    },
    searchIcon: {
      height: 30, 
      width: 30, 
      resizeMode: 'contain'
    },
    searchContainer: {
      width: '50%'
    },
    input: {
      height: '100%',
      color: '#20232a',
      fontSize: 16
    },
    sortContainer: {
      width: '35%',
      paddingRight: 15
    },
    sortLabel: {
      color: PENDING_COLOR,
      marginRight: 5
    },
    sortIcon: {
      height: 15, 
      width: 15, 
      resizeMode: 'contain', 
      marginTop: 2
    },
    modalView: {
      margin: 20,
      backgroundColor: "#ffffff",
      borderRadius: 10,
      padding: 35,
      alignItems: "flex-start",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: Dimensions.get('screen').width - 40
    },
  });
  // SEARCH BAR END ===

  // === TRANSACTION LIST START
  const _onCardPress = (data) => {
    setDetailData(data);
    setIsDetailVisible(true);
  };

  // Transaction List FlatList Render Item
  const renderItem = ({ item }) => (
    <Pressable onPress={() => _onCardPress(item)}>
      <TransactionCard data={item} />
    </Pressable>
  );

  // Transaction List Card Component
  const TransactionCard = ({ data }) => (
    <View style={transactionListStyles.cardContainer}>
      <StatusIndicator status={data.status} />
      <View style={transactionListStyles.transactionDataContainer}>
        <Text style={[styles.text, styles.bold]}>
          {data.sender_bank.toUpperCase()}
          <Image source={require('../assets/icons/arrow_right.png')} style={styles.arrow} />
          {data.beneficiary_bank.toUpperCase()}
        </Text>
        <Text style={[styles.text]}>
          {data.beneficiary_name}
        </Text>
        <View style={[styles.row, styles.alignCenter]}>
          <Text style={[styles.text]}>
            {currencyConverter(data.amount)}
          </Text>
          <Image source={require('../assets/icons/circle.png')} style={styles.dot} />
          <Text style={[styles.text]}>
            {dateConverter(data.created_at)}
          </Text>
        </View>
      </View>
      <StatusLabel status={data.status} />
    </View>
  );
  
  // Transaction List Card Status Indicator
  const StatusIndicator = ({status}) => {
    if(status === 'SUCCESS') {
      return(
        <View style={[transactionListStyles.statusIndicator, {backgroundColor: SUCCESS_COLOR}]} />
      )
    } else {
      return(
        <View style={[transactionListStyles.statusIndicator, {backgroundColor: PENDING_COLOR}]} />
      )
    }
  };

  // Transaction List Card Status Label
  const StatusLabel = ({status}) => {
    if(status === 'SUCCESS') {
      return(
        <View style={transactionListStyles.transactionStatusLabelContainer}>
          <View style={[transactionListStyles.label, transactionListStyles.labelSuccess]}>
            <Text style={[styles.text, styles.bold, {color: '#ffffff'}]}>
              Berhasil
            </Text>
          </View>
        </View>
      )
    } else {
      return(
        <View style={transactionListStyles.transactionStatusLabelContainer}>
          <View style={[transactionListStyles.label, transactionListStyles.labelPending ]}>
            <Text style={[styles.text, styles.bold]}>
              Pengecekan
            </Text>
          </View>
        </View>
      )
    }
  };

  // Transaction List Style
  const transactionListStyles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#ffffff',
      padding: 14,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden'
    },
    transactionDataContainer: {
      width: '70%',
      paddingLeft: 10
    },
    transactionStatusLabelContainer: {
      width: '30%', 
      alignItems: 'flex-end', 
      justifyContent: 'center'
    },
    statusIndicator: {
      height: '150%', 
      width: 10,
      position: 'absolute', 
      top: 0, 
      left: 0
    },
    label: {
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    labelSuccess: {
      backgroundColor: SUCCESS_COLOR,
    },
    labelPending: {
      borderColor: PENDING_COLOR,
      borderWidth: 1,
      backgroundColor: '#ffffff'
    },
  });
  // TRANSACTION LIST END ===

  // === TRANSACTION DETAIL START

  const copyToClipboard = (value) => {
    Clipboard.setString(value);
  };

  // Transaction Detail Component
  const TransactionDetail = () => {
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={isDetailVisible}
        onRequestClose={() => {
          setIsDetailVisible(!isDetailVisible);
        }}
        presentationStyle="fullScreen"
      >
        <View style={[StyleSheet.absoluteFill, styles.backgroundStyle, {paddingTop: 20}]}>
          <View style={[transactionDetailStyles.transactionIDContainer, styles.justifyCenter]}>
            <Pressable style={styles.row} onPress={() => {copyToClipboard(detailData.id)}}>
              <Text style={[styles.text, styles.bold]}>
                ID TRANSAKSI: #{detailData.id ? detailData.id : ''}
              </Text>
              <Image source={require('../assets/icons/copy.png')} style={transactionDetailStyles.copyIcon} />
            </Pressable>
          </View>
          <View style={transactionDetailStyles.titleContainer}>
            <Text style={[styles.text, styles.bold]}>
              DETAIL TRANSAKSI
            </Text>
            <Pressable
              onPress={() => setIsDetailVisible(!isDetailVisible)}
            >
              <Text style={[styles.text, {color: PENDING_COLOR}]}>
                Tutup
              </Text>
            </Pressable>
          </View>
          <View style={transactionDetailStyles.transactionDataContainer}>
            <View style={styles.row}>
              <Text style={[styles.text, styles.bold]}>
                {detailData.sender_bank ? detailData.sender_bank.toUpperCase() : '-'}
                <Image source={require('../assets/icons/arrow_right.png')} style={styles.arrow} />
                {detailData.beneficiary_bank ? detailData.beneficiary_bank.toUpperCase() : '-'}
              </Text>
            </View>
            <View style={[styles.row, {paddingVertical: 10}]}>
              <View style={{flex: 2}}>
                <Text style={[styles.text, styles.bold]}>
                  {detailData.beneficiary_name ? detailData.beneficiary_name : '-'}
                </Text>
                <Text style={styles.text}>
                  {detailData.account_number ? detailData.account_number : '-'}
                </Text>
              </View>
              <View style={{flex: 1}}>
              <Text style={[styles.text, styles.bold]}>
                  NOMINAL
                </Text>
                <Text style={styles.text}>
                  {detailData.amount ? currencyConverter(detailData.amount) : currencyConverter(0)}
                </Text>
              </View>
            </View>
            <View style={[styles.row, {paddingVertical: 10}]}>
              <View style={{flex: 2}}>
              <Text style={[styles.text, styles.bold]}>
                  BERITA TRANSFER
                </Text>
                <Text style={styles.text}>
                  {detailData.remark ? detailData.remark : '-'}
                </Text>
              </View>
              <View style={{flex: 1}}>
              <Text style={[styles.text, styles.bold]}>
                  KODE UNIK
                </Text>
                <Text style={styles.text}>
                  {detailData.unique_code ? detailData.unique_code : '-'}
                </Text>
              </View>
            </View>
            <View style={[styles.row, {paddingVertical: 10}]}>
              <View>
              <Text style={[styles.text, styles.bold]}>
                  WAKTU DIBUAT
                </Text>
                <Text style={styles.text}>
                  {detailData.created_at ? dateConverter(detailData.created_at) : '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Transaction Detail Style
  const transactionDetailStyles = StyleSheet.create({
    transactionIDContainer: {
      height: 70, 
      width: Dimensions.get('screen').width, 
      backgroundColor: '#ffffff', 
      marginBottom: 2, 
      paddingHorizontal: 20
    },
    copyIcon: {
      height: 15, 
      width: 15, 
      resizeMode: 'contain', 
      marginLeft: 5
    },
    titleContainer: {
      flexDirection: 'row',
      height: 70, width: Dimensions.get('screen').width, 
      backgroundColor: 'white', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      marginBottom: 2, 
      paddingHorizontal: 20
    },
    transactionDataContainer: {
      width: Dimensions.get('screen').width, 
      backgroundColor: 'white', 
      marginBottom: 2, 
      padding: 20
    }
  });
  // TRANSACTION DETAIL END ===

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      {/* Search Bar Component */}
      <StatusBar barStyle={'light-content'} />
       <View style={searchbarStyles.container}> 
        <View style={[searchbarStyles.searchIconContainer, styles.alignCenter, styles.justifyCenter]}>
          <Image source={require('../assets/icons/search.png')} style={searchbarStyles.searchIcon} />
        </View>
        <View style={searchbarStyles.searchContainer}>
          <TextInput
            style={searchbarStyles.input}
            // onChange={(value) => onChangeSearch(value)}
            onChangeText={txtHandler}
            value={search}
            placeholder="Cari nama, bank, atau nominal"
            placeholderTextColor="#aeaeae" 
          />
        </View>
        <View style={[searchbarStyles.sortContainer, styles.row, styles.alignCenter, styles.justifyEnd]}>
          <Pressable style={styles.row} onPress={() => setSortModalVisible(true)}>
            <Text style={[styles.text, styles.bold, searchbarStyles.sortLabel]}>
              {sortingOptions[sortIndex].label}
            </Text>
            <Image source={require('../assets/icons/chevron_down.png')} style={searchbarStyles.sortIcon} />
          </Pressable>
        </View>
      </View>
      <SortModal />
      <FlatList
        data={transactionsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={{marginBottom: 70}}
      />
      <TransactionDetail />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#f0f0f0f0',
    height: Dimensions.get('screen').height
  },
  row: {
    flexDirection: 'row'
  },
  alignStart: {
    alignItems: 'flex-start'
  },
  alignEnd: {
    alignItems: 'flex-end'
  },
  alignCenter: {
    alignItems: 'center'
  },
  justifyStart: {
    justifyContent: 'flex-start'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  justifyAround: {
    justifyContent: 'space-around'
  },
  justifyBetween: {
    justifyContent: 'space-between'
  },
  justifyEvenly: {
    justifyContent: 'space-evenly'
  },
  text: {
    fontSize: 16,
    color: "#20232a"
  },
  bold: {
    fontWeight: '800'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  arrow: {
    height: 15, 
    width: 15, 
    resizeMode: 'contain'
  },
  dot: {
    height: 7, 
    width: 7, 
    resizeMode: 'contain',
    marginHorizontal: 3
  }
});

export default App;
