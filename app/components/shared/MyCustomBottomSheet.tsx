import React, { ReactNode, useCallback, forwardRef, useRef } from 'react';
import CustomBottomSheet, {
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { 
    Keyboard, 
    KeyboardAvoidingView, 
    Platform, 
    StyleSheet, 
    TouchableWithoutFeedback,
    View,
    ScrollView,
    StyleProp,
    ViewStyle,
    TextInput
} from 'react-native';

interface BottomSheetProps {
    children: ReactNode;
    snapPoints?: (string | number)[];
    onCloseSheet?: () => void;
    contentContainerStyle?: StyleProp<ViewStyle>;
    avoidKeyboard?: boolean;
    scrollable?: boolean;
    header?: ReactNode;
    footer?: ReactNode;
}

const MyCustomBottomSheet = forwardRef<CustomBottomSheet, BottomSheetProps>(
    ({ 
        children, 
        snapPoints = ['50%', '75%'], 
        onCloseSheet, 
        contentContainerStyle,
        avoidKeyboard = true,
        scrollable = true,
        header,
        footer
    }, ref) => {
        const scrollViewRef = useRef<ScrollView>(null);

        const handleSheetChanges = useCallback((index: number) => {
            if (index === -1 && onCloseSheet) {
                TextInput.State.blurTextInput();
                setTimeout(() => Keyboard.dismiss(), 10);
                onCloseSheet();
            }
        }, [onCloseSheet]);

        const renderBackdrop = useCallback(
            (props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={1}
                />
            ),
            []
        );

        const ContentWrapper = avoidKeyboard ? KeyboardAvoidingView : View;
        const ScrollComponent = scrollable ? BottomSheetScrollView : View;

        return (
            <CustomBottomSheet
                ref={ref}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                enableContentPanningGesture={false}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
            >
                <ContentWrapper
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                >
                    <TouchableWithoutFeedback 
                        onPress={Keyboard.dismiss} 
                        accessible={false}
                    >
                        <View style={[{ flex: 1, padding: 20 }]}>
                            {header}
                            
                            <ScrollComponent
                                ref={scrollViewRef}
                                style={{ flex: 1 }}
                                contentContainerStyle={[
                                    styles.bottomSheetContent,
                                    contentContainerStyle
                                ]}
                                keyboardShouldPersistTaps="handled"
                                automaticallyAdjustKeyboardInsets={true}
                            >
                                {children}
                            </ScrollComponent>
                            
                            {footer}
                        </View>
                    </TouchableWithoutFeedback>
                </ContentWrapper>
            </CustomBottomSheet>
        );
    }
);

const styles = StyleSheet.create({
    bottomSheetContent: {
        flexGrow: 1,
    },
});

export default MyCustomBottomSheet;