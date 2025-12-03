import { useState, useMemo, useEffect } from 'react'
import { Pressable, Text, View, TextInput, FlatList, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import LanguageBottomSheetProps from './type'
import { CheckIcon, SearchIcon } from '@/assets'
import { BottomSheet } from '@/components'
import useConfigurationStore from '@/store/configuration'

const ItemSeparatorComponent = () => <View className="h-[1px] w-full bg-[#EDEDED]" />

const LanguageBottomSheet = ({
  open,
  setOpen,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
}: LanguageBottomSheetProps) => {
  const { t } = useTranslation()
  const { configuration } = useConfigurationStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'source' | 'target'>()

  useEffect(() => {
    if (open) {
      setSelectedType(open)
    }
  }, [open])

  const popularLanguages = useMemo(() => {
    const popular = [
      { id: 'en', name: 'English' },
      { id: 'ar', name: 'Arabic' },
      { id: 'zh', name: 'Chinese' },
      { id: 'es', name: 'Spanish' },
      { id: 'fr', name: 'French' },
      { id: 'de', name: 'German' },
      { id: 'it', name: 'Italian' },
    ]

    if (!searchQuery.trim()) {
      return popular
    }

    return popular.filter(language =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  const filteredLanguages = useMemo(() => {
    if (!configuration?.supportedLanguages) return []

    let languages = configuration.supportedLanguages

    if (selectedType === 'source') {
      const detectLanguageOption = {
        id: 'detect',
        name: t('LanguageBottomSheet.detect_language'),
      }
      languages = [detectLanguageOption, ...languages]
    }

    if (!searchQuery.trim()) {
      return languages
    }

    return languages.filter(language =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [configuration?.supportedLanguages, searchQuery, selectedType, t])

  const handleLanguageSelect = (language: { id: string; name: string }) => {
    if (selectedType === 'source') {
      setSourceLanguage(language)
    } else {
      setTargetLanguage(language)
    }
  }

  return (
    <BottomSheet
      isOpen={open ? true : false}
      setIsOpen={value => setOpen(value as 'source' | 'target' | false)}
      height="90%"
    >
      <View className="px-6 py-4 flex-1">
        <View className="w-full flex-row justify-between mb-4">
          <Text className="text-[14px] font-semibold text-primary-main opacity-0">
            {t('LanguageBottomSheet.done')}
          </Text>
          <Text className="text-[16px] font-bold">{t('LanguageBottomSheet.title')}</Text>
          <Pressable onPress={() => setOpen(false)}>
            <Text className="text-[14px] font-semibold text-primary-main">
              {t('LanguageBottomSheet.done')}
            </Text>
          </Pressable>
        </View>

        <View className="mb-4">
          <View className="relative">
            <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <SearchIcon width={20} height={20} color="#4B5563" />
            </View>
            <TextInput
              className="bg-gray-100 rounded-lg pl-12 pr-4 py-3 text-[14px] bg-[#EEEEEF]"
              placeholder={t('LanguageBottomSheet.search')}
              placeholderTextColor="#4B5563"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="flex-row items-center mb-4 p-1 bg-[#EEEEEF] rounded-[9px]">
          <Pressable
            className={`flex-1 rounded-[7px] py-1 ${selectedType === 'source' ? 'bg-text-onPrimary' : ''}`}
            onPress={() => setSelectedType('source')}
          >
            <Text
              className={`text-[13px] text-gray-800 text-center ${selectedType === 'source' ? 'font-semibold' : 'font-normal'}`}
            >
              {sourceLanguage.name}
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 rounded-[7px] py-1 ${selectedType === 'target' ? 'bg-text-onPrimary' : ''}`}
            onPress={() => setSelectedType('target')}
          >
            <Text
              className={`text-[13px] text-gray-800 text-center ${selectedType === 'target' ? 'font-semibold' : 'font-normal'}`}
            >
              {targetLanguage.name}
            </Text>
          </Pressable>
        </View>

        <ScrollView>
          {popularLanguages.length > 0 && (
            <>
              <Text className="text-[14px] font-bold text-text-secondary mb-2 ml-2">Popular</Text>
              <View className="bg-bg-elevated rounded-2xl px-6 py-4 mb-4">
                {popularLanguages.map((item, index) => (
                  <View key={item.id}>
                    <Pressable
                      className="flex-row items-center py-3 gap-2"
                      onPress={() => handleLanguageSelect(item)}
                    >
                      <Text className="h-[24px] text-[14px] font-semibold">{item.name}</Text>
                      {((selectedType === 'source' && item.id === sourceLanguage.id) ||
                        (selectedType === 'target' && item.id === targetLanguage.id)) && (
                        <CheckIcon width={24} height={24} color="#2563EB" />
                      )}
                    </Pressable>
                    {index < popularLanguages.length - 1 && <ItemSeparatorComponent />}
                  </View>
                ))}
              </View>
            </>
          )}

          <Text className="text-[14px] font-bold text-text-secondary mb-2 ml-2">
            {t('LanguageBottomSheet.all')}
          </Text>
          <FlatList
            data={filteredLanguages}
            className="bg-bg-elevated rounded-2xl px-6 py-4"
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
            renderItem={({ item }) => (
              <Pressable
                className="flex-row items-center py-3 gap-2"
                onPress={() => handleLanguageSelect(item)}
              >
                <Text className="h-[24px] text-[14px] font-semibold">{item.name}</Text>
                {((selectedType === 'source' && item.id === sourceLanguage.id) ||
                  (selectedType === 'target' && item.id === targetLanguage.id)) && (
                  <CheckIcon width={24} height={24} color="#2563EB" />
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="py-8 items-center">
                <Text className="text-[14px] font-semibold">
                  {t('LanguageBottomSheet.no_languages_found')}
                </Text>
              </View>
            }
          />
        </ScrollView>
      </View>
    </BottomSheet>
  )
}

export default LanguageBottomSheet
