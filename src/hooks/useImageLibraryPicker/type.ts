export default interface UseImageLibraryPickerDto {
  selectedImageUri: string | null
  setSelectedImageUri: (uri: string | null) => void
  openGallery: () => Promise<void>
  clearSelectedImage: () => void
}
