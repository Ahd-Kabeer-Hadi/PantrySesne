import React from 'react';
import { View, TouchableOpacity, Modal, Animated, Dimensions, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedContainer, ThemedText, ThemedButton } from './ThemedComponents';
import { AppError, getErrorIcon, getErrorColor } from '../utils/errorHandler';
import { cn } from '../lib/utils';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showSolution?: boolean;
  compact?: boolean;
}

export default function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  showSolution = true,
  compact = false 
}: ErrorDisplayProps) {
  const iconName = getErrorIcon(error.category);
  const colorVariant = getErrorColor(error.severity);

  if (compact) {
    return (
      <View className="bg-error/10 border border-error/20 rounded-xl p-4 mb-4">
        <View className="flex-row items-center">
          <View className={cn(
            "w-8 h-8 rounded-full items-center justify-center mr-3",
            colorVariant === 'error' ? 'bg-error/20' : 'bg-warning/20'
          )}>
            <Ionicons 
              name={iconName as any} 
              size={16} 
              color={colorVariant === 'error' ? '#dc2626' : '#e4fa5b'} 
            />
          </View>
          <View className="flex-1">
            <ThemedText size="sm" weight="semibold" variant="error">
              {error.title}
            </ThemedText>
            <ThemedText size="xs" variant="tertiary" className="mt-1">
              {error.userMessage}
            </ThemedText>
          </View>
          {onDismiss && (
            <TouchableOpacity onPress={onDismiss} className="ml-2">
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <ThemedContainer className="p-6">
      <View className="items-center">
        {/* Error Icon */}
        <View className={cn(
          "w-20 h-20 rounded-full items-center justify-center mb-4",
          colorVariant === 'error' ? 'bg-error/20' : 'bg-warning/20'
        )}>
          <Ionicons 
            name={iconName as any} 
            size={32} 
            color={colorVariant === 'error' ? '#dc2626' : '#e4fa5b'} 
          />
        </View>

        {/* Error Title */}
        <ThemedText size="xl" weight="bold" variant="error" className="text-center mb-2">
          {error.title}
        </ThemedText>

        {/* User Message */}
        <ThemedText size="md" variant="secondary" className="text-center mb-6">
          {error.userMessage}
        </ThemedText>

        {/* Solution */}
        {showSolution && (
          <View className="bg-surface-elevated border border-border rounded-xl p-4 mb-6 w-full">
            <View className="flex-row items-start">
              <Ionicons name="bulb-outline" size={20} color="#8fb716" className="mt-0.5 mr-3" />
              <View className="flex-1">
                <ThemedText size="sm" weight="semibold" className="mb-1">
                  How to fix this:
                </ThemedText>
                <ThemedText size="sm" variant="secondary">
                  {error.solution}
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row space-x-3 w-full">
          {onRetry && (
            <ThemedButton
              variant="primary"
              onPress={onRetry}
              className="flex-1"
            >
              <Ionicons name="refresh" size={16} color="white" className="mr-2" />
              Try Again
            </ThemedButton>
          )}
          
          {onDismiss && (
            <ThemedButton
              variant="ghost"
              onPress={onDismiss}
              className="flex-1"
            >
              Dismiss
            </ThemedButton>
          )}
        </View>
      </View>
    </ThemedContainer>
  );
}

// Compact error banner for inline use
export function ErrorBanner({ error, onDismiss }: { error: AppError; onDismiss?: () => void }) {
  return (
    <View className="bg-error/10 border-l-4 border-error rounded-r-lg p-3 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Ionicons name="alert-circle" size={16} color="#dc2626" className="mr-2" />
          <ThemedText size="sm" weight="medium" variant="error" className="flex-1">
            {error.title}
          </ThemedText>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss}>
            <Ionicons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
      <ThemedText size="xs" variant="tertiary" className="mt-1 ml-6">
        {error.userMessage}
      </ThemedText>
    </View>
  );
}

// Drawer Modal for Error Management
export function ErrorDrawerModal({
  visible,
  error,
  onRetry,
  onDismiss,
  showSolution = true,
}: {
  visible: boolean;
  error: AppError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  showSolution?: boolean;
}) {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!error) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Animated.View className="absolute inset-0 bg-black/30 z-10" style={{ opacity: slideAnim }} />
      <Animated.View
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl px-6 pt-3 pb-8 z-20"
        style={{
          transform: [{ translateY }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        <View className="w-12 h-1.5 rounded bg-gray-200 self-center mb-4" />
        <View className="items-center mb-4">
          <Ionicons
            name={getErrorIcon(error.category) as any}
            size={36}
            color={getErrorColor(error.severity) === 'error' ? '#dc2626' : '#e4fa5b'}
            style={{ marginBottom: 8 }}
          />
          <ThemedText size="xl" weight="bold" variant="error" className="text-center mb-2">
            {error.title}
          </ThemedText>
          <ThemedText size="md" variant="secondary" className="text-center mb-4">
            {error.userMessage}
          </ThemedText>
        </View>
        {showSolution && (
          <View className="bg-success/10 rounded-xl p-3 mb-2 flex-row items-start">
            <Ionicons name="bulb-outline" size={20} color="#8fb716" className="mr-2 mt-0.5" />
            <View className="flex-1">
              <ThemedText size="sm" weight="semibold" className="mb-1">
                How to fix this:
              </ThemedText>
              <ThemedText size="sm" variant="secondary">
                {error.solution}
              </ThemedText>
            </View>
          </View>
        )}
        {/* Improved Action Buttons */}
        <View className="flex flex-col items-stretch mt-6">
          {onRetry && (
            <ThemedButton
              variant="primary"
              onPress={onRetry}
              size="lg"
              className="mb-3 flex-row items-center justify-center"
            >
              <Ionicons name="refresh" size={18} color="#fff" className="mr-2" />
              <ThemedText variant="inverse" weight="semibold" size="lg">Try Again</ThemedText>
            </ThemedButton>
          )}
          {onRetry && onDismiss && <View className="h-2" />}
          <ThemedButton
            variant="ghost"
            onPress={onDismiss}
            size="lg"
            className="flex-row items-center justify-center"
          >
            <Ionicons name="close" size={18} color="#8fb716" className="mr-2" />
            <ThemedText variant="primary" weight="semibold" size="lg">Dismiss</ThemedText>
          </ThemedButton>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#e5e5e5',
    alignSelf: 'center',
    marginBottom: 16,
  },
  solutionBox: {
    backgroundColor: '#f7fdf0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 24,
    gap: 0,
  },
  buttonDivider: {
    height: 8,
  },
}); 