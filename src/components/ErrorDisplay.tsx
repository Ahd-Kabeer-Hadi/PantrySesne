import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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