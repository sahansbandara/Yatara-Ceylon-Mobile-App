import * as ImagePicker from 'expo-image-picker';

export async function pickImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library permission is required for upload');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName || `upload-${Date.now()}.jpg`,
    type: asset.mimeType || 'image/jpeg',
  };
}

export function appendImage(formData: FormData, image: { uri: string; name: string; type: string } | null) {
  if (!image) return;
  formData.append('image', image as unknown as Blob);
}
