import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { PickedImage } from '@/features/contracts/api';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

interface ImageInputBoxProps {
  image: PickedImage | null;
  onPick: (image: PickedImage) => void;
  onSizeExceeded: () => void;
  disabled?: boolean;
}

function toPickedImage(asset: ImagePicker.ImagePickerAsset): PickedImage {
  return {
    uri: asset.uri,
    mimeType: asset.mimeType ?? 'image/jpeg',
    fileName: asset.fileName ?? `contract-${Date.now()}.jpg`,
  };
}

export default function ImageInputBox({
  image,
  onPick,
  onSizeExceeded,
  disabled,
}: ImageInputBoxProps) {
  const handlePickResult = (result: ImagePicker.ImagePickerResult): void => {
    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE_BYTES) {
      onSizeExceeded();
      return;
    }
    onPick(toPickedImage(asset));
  };

  const handleTakePhoto = async (): Promise<void> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    handlePickResult(result);
  };

  const handlePickFromLibrary = async (): Promise<void> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    handlePickResult(result);
  };

  if (image) {
    return (
      <View style={styles.box}>
        <Image source={{ uri: image.uri }} style={styles.preview} resizeMode="contain" />
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => void handlePickFromLibrary()}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.retakeText}>다시 선택</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Ionicons name="document-text-outline" size={32} color={colors.brand.primary} />
      <Text style={styles.caption}>계약서 사진을 등록해주세요</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.pickButton}
          onPress={() => void handleTakePhoto()}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.pickButtonText}>카메라로 촬영</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pickButton}
          onPress={() => void handlePickFromLibrary()}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.pickButtonText}>갤러리에서 선택</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 220,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.brand.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.brand.primaryGhost,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    overflow: 'hidden',
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pickButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.base,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  pickButtonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.brand.primary,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  retakeButton: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: colors.text.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  retakeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.inverse,
  },
});
