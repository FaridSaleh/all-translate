export default interface UseImageLibraryPickerDto {
  selectedImageUri: string | null
  openGallery: () => Promise<void>
  clearSelectedImage: () => void
}
