import { useCallback, useRef, useEffect, useMemo } from 'react'
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import BottomSheetProps from './type'

const BottomSheet = ({ children, isOpen, setIsOpen, height }: BottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => {
    if (!height) {
      return ['50%']
    }

    let percentage: number | undefined
    if (typeof height === 'string') {
      const parsed = parseFloat(height.replace(/[%vh]/g, ''))
      if (!isNaN(parsed)) percentage = parsed
    } else if (typeof height === 'number') {
      percentage = height
    }

    const capped = Math.min(percentage ?? 50, 90)
    return [`${capped}%`]
  }, [height])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.72}
        style={{ backgroundColor: '#1B1F26' }}
        pressBehavior="none"
      />
    ),
    [],
  )

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [isOpen])

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      index={0}
      enableOverDrag={false}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      enablePanDownToClose={true}
      onDismiss={() => setIsOpen(false)}
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="h-full pb-safe-offset-0">{children}</BottomSheetView>
    </BottomSheetModal>
  )
}

export default BottomSheet
