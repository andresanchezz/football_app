import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

import QRCode from 'react-native-qrcode-svg';

import { colors } from '../../../styles/colors';

import { useHistory } from './hooks/useHistory';

import MatchCardQr from '../../components/history/MatchCardQr';
import MyCustomBottomSheet from '../../components/shared/MyCustomBottomSheet';

export const HistoryScreen = () => {

  const {
    userMatches,
    qrBotomSheetRef,
    generateQr,
    qrValue,
    setQrValue,

  } = useHistory();



  return (
    <View style={styles.mainView}>

      <FlatList
        data={userMatches}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => (
          <MatchCardQr
            match={item}
            showQr={generateQr}
            key={item.id} />
        )}
      />




      <MyCustomBottomSheet ref={qrBotomSheetRef} snapPoints={['25%', '50%']}>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center' }} variant='headlineSmall'>Use following QR as ticket</Text>
          {
            qrValue && <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
              <QRCode size={200} value={qrValue} />
            </View>
          }

        </View>
      </MyCustomBottomSheet>


    </View>
  )
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.light,
    paddingVertical: 20,
    paddingHorizontal: 10,
  }
})
