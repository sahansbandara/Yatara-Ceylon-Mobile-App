import * as ImagePicker from 'expo-image-picker';

export type PickedImage = {
  uri: string;
  name: string;
  type: string;
  file?: Blob;
};

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
  const file = 'file' in asset ? (asset.file as Blob | undefined) : undefined;
  return {
    uri: asset.uri,
    name: asset.fileName || `upload-${Date.now()}.jpg`,
    type: asset.mimeType || 'image/jpeg',
    file,
  };
}

export function appendImage(formData: FormData, image: PickedImage | null) {
  if (!image) return;
  if (image.file) {
    formData.append('image', image.file, image.name);
    return;
  }
  formData.append('image', image as unknown as Blob);
}
