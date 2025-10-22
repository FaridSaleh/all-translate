import { useState, useMemo } from 'react'
import { Pressable, Text, View, TextInput, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import LanguageBottomSheetProps from './type'
import { BottomSheet } from '@/components'
import useConfigurationStore from '@/store/configuration'

const LanguageBottomSheet = ({ isOpen, setIsOpen }: LanguageBottomSheetProps) => {
  const { t } = useTranslation()
  const { configuration } = useConfigurationStore()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!configuration?.supportedLanguages) return []

    if (!searchQuery.trim()) {
      return configuration.supportedLanguages
    }

    return configuration.supportedLanguages.filter(language =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [configuration?.supportedLanguages, searchQuery])

  const handleLanguageSelect = (language: { id: string; name: string }) => {
    console.log('Selected language:', language)
    // TODO: Handle language selection
    setIsOpen(false)
  }

  return (
    <BottomSheet isOpen={isOpen} setIsOpen={setIsOpen} height="100%">
      <View className="px-6 py-4 flex-1">
        <View className="w-full flex-row justify-between mb-4">
          <View />
          <Text className="text-[16px] font-bold">{t('LanguageBottomSheet.title')}</Text>
          <Pressable onPress={() => setIsOpen(false)}>
            <Text className="text-[14px] font-semibold text-primary-main">
              {t('LanguageBottomSheet.done')}
            </Text>
          </Pressable>
        </View>

        <View className="mb-4">
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3 text-[14px] bg-[#EEEEEF]"
            placeholder={t('LanguageBottomSheet.search')}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        <FlatList
          data={filteredLanguages}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              className="py-3 px-2 border-b border-gray-100"
              onPress={() => handleLanguageSelect(item)}
            >
              <Text className="text-[14px] text-gray-800">{item.name}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Text className="text-[14px] text-gray-500">
                {t('LanguageBottomSheet.no_languages_found')}
              </Text>
            </View>
          }
        />
      </View>
    </BottomSheet>
  )
}

export default LanguageBottomSheet
