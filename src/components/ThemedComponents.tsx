import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, TextInput } from 'react-native';
import { useTheme } from '../hooks/useThemes';
import { cn } from '../lib/utils';

// Themed Container Component
export const ThemedContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'surface' | 'elevated';
}> = ({ children, className, variant = 'default' }) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'surface':
        return isDark ? 'bg-dark-surface-DEFAULT' : 'bg-surface';
      case 'elevated':
        return isDark ? 'bg-dark-surface-elevated' : 'bg-surface-elevated';
      default:
        return isDark ? 'bg-dark-background-DEFAULT' : 'bg-background';
    }
  };
  
  return (
    <View className={cn(getVariantClasses(), className)}>
      {children}
    </View>
  );
};

// Themed Card Component - Clean design without glass or neumorphism
export const ThemedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  onPress?: () => void;
  style?: any;
}> = ({ children, className, variant = 'default', onPress, style }) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    const baseClasses = isDark 
      ? 'bg-dark-surface-card border-dark-border-DEFAULT' 
      : 'bg-surface-card border-border';
    
    switch (variant) {
      case 'elevated':
        return cn(
          baseClasses,
          'rounded-lg shadow-md border'
        );
      case 'outlined':
        return cn(
          isDark ? 'bg-transparent border-dark-border-DEFAULT' : 'bg-transparent border-border',
          'rounded-lg border'
        );
      default:
        return cn(
          baseClasses,
          'rounded-lg shadow-sm border'
        );
    }
  };
  
  if (onPress) {
    return (
      <Pressable onPress={onPress} className={cn(getVariantClasses(), 'p-4', className)} style={style}>
        {children}
      </Pressable>
    );
  }
  
  return (
    <View className={cn(getVariantClasses(), 'p-4', className)} style={style}>
      {children}
    </View>
  );
};

// Themed Text Component
export const ThemedText: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}> = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'base',
  weight = 'normal'
}) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return isDark ? 'text-dark-text-secondary' : 'text-text-secondary';
      case 'tertiary':
        return isDark ? 'text-dark-text-tertiary' : 'text-text-tertiary';
      case 'inverse':
        return isDark ? 'text-dark-text-inverse' : 'text-text-inverse';
      case 'success':
        return isDark ? 'text-dark-success-DEFAULT' : 'text-success';
      case 'warning':
        return isDark ? 'text-dark-warning-DEFAULT' : 'text-warning';
      case 'error':
        return isDark ? 'text-dark-error-DEFAULT' : 'text-error';
      default:
        return isDark ? 'text-dark-text-primary' : 'text-text-primary';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'text-xs';
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      case '2xl': return 'text-2xl';
      case '3xl': return 'text-3xl';
      default: return 'text-base';
    }
  };
  
  const getWeightClasses = () => {
    switch (weight) {
      case 'medium': return 'font-medium';
      case 'semibold': return 'font-semibold';
      case 'bold': return 'font-bold';
      default: return 'font-normal';
    }
  };
  
  return (
    <Text className={cn(
      getVariantClasses(),
      getSizeClasses(),
      getWeightClasses(),
      'font-sans',
      className
    )}>
      {children}
    </Text>
  );
};

// Themed Button Component - Clean design with new color palette
export const ThemedButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
}> = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false
}) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    if (disabled) {
      return isDark 
        ? 'bg-dark-surface-elevated text-dark-text-tertiary' 
        : 'bg-surface text-text-tertiary';
    }
    
    switch (variant) {
      case 'secondary':
        return isDark
          ? 'bg-dark-secondary-DEFAULT text-dark-text-inverse'
          : 'bg-secondary text-text-primary';
      case 'accent':
        return isDark
          ? 'bg-dark-accent-DEFAULT text-dark-text-inverse'
          : 'bg-accent text-text-primary';
      case 'success':
        return isDark
          ? 'bg-dark-success-DEFAULT text-dark-text-inverse'
          : 'bg-success text-text-inverse';
      case 'warning':
        return isDark
          ? 'bg-dark-warning-DEFAULT text-dark-text-inverse'
          : 'bg-warning text-text-primary';
      case 'error':
        return isDark
          ? 'bg-dark-error-DEFAULT text-dark-text-inverse'
          : 'bg-error text-text-inverse';
      case 'ghost':
        return isDark
          ? 'bg-transparent text-dark-text-primary border border-dark-border-DEFAULT'
          : 'bg-transparent text-text-primary border border-border';
      default:
        return isDark
          ? 'bg-dark-primary-DEFAULT text-dark-text-inverse'
          : 'bg-primary text-text-inverse';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm';
      case 'lg': return 'px-6 py-4 text-lg';
      default: return 'px-4 py-3 text-base';
    }
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'rounded-lg font-medium items-center justify-center transition-smooth',
        getVariantClasses(),
        getSizeClasses(),
        disabled ? 'opacity-50' : 'active:opacity-80',
        className
      )}
    >
      {children}
    </TouchableOpacity>
  );
};

// Themed Input Component
export const ThemedInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  variant?: 'default' | 'outlined';
  disabled?: boolean;
  secureTextEntry?: boolean;
}> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  className, 
  variant = 'default',
  disabled = false,
  secureTextEntry = false
}) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    const baseClasses = isDark 
      ? 'bg-dark-surface text-dark-text-primary border-dark-border-DEFAULT' 
      : 'bg-surface text-text-primary border-border';
    
    if (disabled) {
      return isDark 
        ? 'bg-dark-surface-elevated text-dark-text-tertiary border-dark-border-light' 
        : 'bg-surface-elevated text-text-tertiary border-border-light';
    }
    
    switch (variant) {
      case 'outlined':
        return cn(
          'bg-transparent',
          isDark ? 'border-dark-border-DEFAULT text-dark-text-primary' : 'border-border text-text-primary'
        );
      default:
        return baseClasses;
    }
  };
  
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={isDark ? '#6b7280' : '#6b7280'}
      className={cn(
        'w-full px-3 py-2 rounded-lg border text-base',
        getVariantClasses(),
        'focus:ring-2 focus:ring-primary focus:border-transparent',
        className
      )}
    />
  );
};

// Themed Badge Component
export const ThemedBadge: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}> = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md'
}) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return isDark
          ? 'bg-dark-secondary-DEFAULT text-dark-text-inverse'
          : 'bg-secondary text-text-primary';
      case 'success':
        return isDark
          ? 'bg-dark-success-DEFAULT text-dark-text-inverse'
          : 'bg-success text-text-inverse';
      case 'warning':
        return isDark
          ? 'bg-dark-warning-DEFAULT text-dark-text-inverse'
          : 'bg-warning text-text-primary';
      case 'error':
        return isDark
          ? 'bg-dark-error-DEFAULT text-dark-text-inverse'
          : 'bg-error text-text-inverse';
      default:
        return isDark
          ? 'bg-dark-primary-DEFAULT text-dark-text-inverse'
          : 'bg-primary text-text-inverse';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs';
      default: return 'px-3 py-1 text-sm';
    }
  };
  
  return (
    <View className={cn(
      'rounded-full font-medium',
      getVariantClasses(),
      getSizeClasses(),
      className
    )}>
      <ThemedText variant="inverse" size={size === 'sm' ? 'xs' : 'sm'} weight="medium">
        {children}
      </ThemedText>
    </View>
  );
};

// Themed Divider Component
export const ThemedDivider: React.FC<{
  className?: string;
  variant?: 'horizontal' | 'vertical';
}> = ({ className, variant = 'horizontal' }) => {
  const { isDark } = useTheme();
  
  const getClasses = () => {
    const colorClass = isDark ? 'bg-dark-border-DEFAULT' : 'bg-border';
    
    if (variant === 'vertical') {
      return cn('w-px', colorClass, className);
    }
    
    return cn('h-px w-full', colorClass, className);
  };
  
  return <View className={getClasses()} />;
}; 