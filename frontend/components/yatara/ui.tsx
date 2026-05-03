import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

import { Colors, Shadows, Typography } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ───────── Screen wrapper ───────── */
export function Screen({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <View style={[styles.screen, dark && { backgroundColor: Colors.deepEmerald }]}>
      {children}
    </View>
  );
}

/* ───────── Typography ───────── */
export function Title({ children, light }: { children: ReactNode; light?: boolean }) {
  return <Text style={[styles.title, light && { color: Colors.white }]}>{children}</Text>;
}

export function Subtitle({ children, light }: { children: ReactNode; light?: boolean }) {
  return <Text style={[styles.subtitle, light && { color: Colors.mutedLight }]}>{children}</Text>;
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action ? (
        <Pressable onPress={action.onPress}>
          <Text style={styles.sectionAction}>{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ───────── Cards ───────── */
export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ImageCard({
  image,
  title,
  subtitle,
  badge,
  onPress,
  height = 200,
  children,
}: {
  image?: ImageSourcePropType | string;
  title?: string;
  subtitle?: string;
  badge?: string;
  onPress?: () => void;
  height?: number;
  children?: ReactNode;
}) {
  const imageSource =
    typeof image === 'string' ? { uri: image } : image;

  const content = (
    <View style={[styles.imageCard, { height }, Shadows.md]}>
      {imageSource ? (
        <Image source={imageSource} style={styles.imageCardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.imageCardImage, { backgroundColor: Colors.emerald }]} />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(6,63,50,0.85)']}
        style={styles.imageCardGradient}
      />
      <View style={styles.imageCardContent}>
        {badge ? (
          <View style={styles.imageCardBadge}>
            <Text style={styles.imageCardBadgeText}>{badge}</Text>
          </View>
        ) : null}
        {title ? <Text style={styles.imageCardTitle}>{title}</Text> : null}
        {subtitle ? <Text style={styles.imageCardSubtitle}>{subtitle}</Text> : null}
        {children}
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

export function CategoryCard({
  image,
  title,
  tags,
  onPress,
}: {
  image: ImageSourcePropType;
  title: string;
  tags?: string[];
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.categoryCard, Shadows.sm]}>
      <Image source={image} style={styles.categoryCardImage} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(6,63,50,0.9)']}
        style={styles.categoryCardGradient}
      />
      <View style={styles.categoryCardContent}>
        <Text style={styles.categoryCardTitle} numberOfLines={2}>
          {title}
        </Text>
        {tags && tags.length > 0 ? (
          <View style={styles.tagRow}>
            {tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagPillText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

/* ───────── Hero Banner ───────── */
export function HeroBanner({
  image,
  title,
  subtitle,
  children,
}: {
  image: ImageSourcePropType;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.heroBanner}>
      <Image source={image} style={styles.heroBannerImage} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(6,63,50,0.25)', 'rgba(6,63,50,0.92)']}
        style={styles.heroBannerGradient}
      />
      <View style={styles.heroBannerContent}>
        <Text style={styles.heroBannerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.heroBannerSubtitle}>{subtitle}</Text> : null}
        {children}
      </View>
    </View>
  );
}

/* ───────── Status Badge ───────── */
export function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const isSuccess = ['confirmed', 'active', 'approved', 'completed'].includes(lower);
  const isWarning = ['pending', 'processing', 'review'].includes(lower);
  const isDanger = ['cancelled', 'rejected', 'failed', 'inactive'].includes(lower);

  const bg = isSuccess
    ? Colors.successLight
    : isWarning
    ? Colors.warningLight
    : isDanger
    ? Colors.dangerLight
    : Colors.infoLight;
  const fg = isSuccess
    ? Colors.success
    : isWarning
    ? Colors.warning
    : isDanger
    ? Colors.danger
    : Colors.info;

  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <View style={[styles.statusDot, { backgroundColor: fg }]} />
      <Text style={[styles.statusText, { color: fg }]}>{status}</Text>
    </View>
  );
}

/* ───────── Tag / Pill ───────── */
export function Tag({ label, color }: { label: string; color?: string }) {
  return (
    <View style={[styles.tag, color ? { borderColor: color } : undefined]}>
      <Text style={[styles.tagText, color ? { color } : undefined]}>{label}</Text>
    </View>
  );
}

/* ───────── Buttons ───────── */
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  icon,
  fullWidth = true,
}: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}) {
  const isPrimary = variant === 'primary';
  const isGold = variant === 'gold';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        isGold && styles.goldButton,
        isSecondary && styles.secondaryButton,
        isDanger && styles.dangerButton,
        !fullWidth && { alignSelf: 'flex-start' as const, paddingHorizontal: 24 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}>
      {loading ? (
        <ActivityIndicator color={isSecondary ? Colors.deepEmerald : Colors.white} />
      ) : (
        <View style={styles.buttonInner}>
          {icon}
          <Text
            style={[
              styles.buttonText,
              isSecondary && styles.secondaryButtonText,
              isGold && { color: Colors.ink },
            ]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/* ───────── Form Fields ───────── */
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  icon?: ReactNode;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.textareaWrap]}>
        {icon ? <View style={styles.inputIcon}>{icon}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          style={[styles.input, multiline && styles.textarea, icon ? { paddingLeft: 40 } : undefined]}
          placeholderTextColor={Colors.mutedLight}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        />
      </View>
    </View>
  );
}

/* ───────── Empty State ───────── */
export function EmptyState({ text, icon }: { text: string; icon?: ReactNode }) {
  return (
    <View style={styles.emptyWrap}>
      {icon}
      <Text style={styles.empty}>{text}</Text>
    </View>
  );
}

/* ───────── Divider ───────── */
export function Divider() {
  return <View style={styles.divider} />;
}

/* ───────── Stat Card ───────── */
export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <View style={[styles.statCard, Shadows.sm]}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ───────── Styles ───────── */
export const styles = StyleSheet.create({
  // Screen
  screen: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    padding: 20,
  },

  // Typography
  title: {
    color: Colors.deepEmerald,
    ...Typography.h1,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.muted,
    ...Typography.body,
    marginBottom: 18,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Colors.deepEmerald,
    ...Typography.h3,
  },
  sectionSubtitle: {
    color: Colors.muted,
    ...Typography.caption,
    marginTop: 2,
  },
  sectionAction: {
    color: Colors.antiqueGold,
    ...Typography.captionBold,
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderColor: Colors.borderLight,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    ...Shadows.sm,
  },

  // Image Card
  imageCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: Colors.emerald,
  },
  imageCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  imageCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  imageCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
  },
  imageCardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.antiqueGold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  imageCardBadgeText: {
    color: Colors.ink,
    ...Typography.tiny,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  imageCardTitle: {
    color: Colors.white,
    ...Typography.h3,
  },
  imageCardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    ...Typography.caption,
    marginTop: 4,
  },

  // Category Card
  categoryCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    marginBottom: 12,
  },
  categoryCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  categoryCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  categoryCardTitle: {
    color: Colors.white,
    ...Typography.captionBold,
    fontSize: 14,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagPillText: {
    color: 'rgba(255,255,255,0.9)',
    ...Typography.tiny,
  },

  // Hero Banner
  heroBanner: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    marginHorizontal: -20,
    marginTop: -20,
  },
  heroBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroBannerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroBannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 22,
  },
  heroBannerTitle: {
    color: Colors.white,
    ...Typography.h2,
  },
  heroBannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    ...Typography.body,
    marginTop: 4,
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    ...Typography.captionBold,
    textTransform: 'capitalize',
  },

  // Tag
  tag: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: Colors.muted,
    ...Typography.tiny,
  },

  // Buttons
  button: {
    backgroundColor: Colors.deepEmerald,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...Shadows.sm,
  },
  goldButton: {
    backgroundColor: Colors.antiqueGold,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.deepEmerald,
    borderWidth: 1.5,
  },
  dangerButton: {
    backgroundColor: Colors.danger,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: Colors.white,
    ...Typography.bodyBold,
  },
  secondaryButtonText: {
    color: Colors.deepEmerald,
  },

  // Form
  fieldWrap: {
    marginBottom: 16,
  },
  label: {
    color: Colors.deepEmerald,
    ...Typography.overline,
    marginBottom: 8,
  },
  inputWrap: {
    position: 'relative',
  },
  textareaWrap: {},
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: 13,
    zIndex: 1,
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.ink,
    ...Typography.body,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Empty State
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  empty: {
    color: Colors.muted,
    textAlign: 'center',
    ...Typography.body,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 16,
  },

  // Stat Card
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    gap: 6,
  },
  statValue: {
    color: Colors.deepEmerald,
    ...Typography.h2,
  },
  statLabel: {
    color: Colors.muted,
    ...Typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
