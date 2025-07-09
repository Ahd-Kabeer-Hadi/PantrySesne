import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useThemes';
import { cn } from '../lib/utils';

// Helper to wrap string children in <ThemedText>
function wrapStringChildren(children: React.ReactNode, textProps: any = {}) {
  if (typeof children === 'string') {
    return <ThemedText {...textProps}>{children}</ThemedText>;
  }
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === 'string' ? <ThemedText key={i} {...textProps}>{child}</ThemedText> : child
    );
  }
  return children;
}

// Themed Container Component
export const ThemedContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'surface' | 'elevated' | 'muted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, className, variant = 'default', padding = 'md' }) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'surface':
        return isDark ? 'bg-dark-surface-DEFAULT' : 'bg-surface';
      case 'elevated':
        return isDark ? 'bg-dark-surface-elevated' : 'bg-surface-elevated';
      case 'muted':
        return isDark ? 'bg-dark-surface-muted' : 'bg-surface-muted';
      default:
        return isDark ? 'bg-dark-background-DEFAULT' : 'bg-background';
    }
  };
  
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return '';
      case 'sm': return 'p-2';
      case 'lg': return 'p-6';
      default: return 'p-4';
    }
  };
  
  return (
    <View className={cn(getVariantClasses(), getPaddingClasses(), className)}>
      {wrapStringChildren(children)}
    </View>
  );
};

// Themed Card Component - Enhanced with better shadows and hover states
export const ThemedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  onPress?: () => void;
  style?: any;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
}> = ({ children, className, variant = 'default', onPress, style, padding = 'md', disabled = false }) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    const baseClasses = isDark 
      ? 'bg-dark-surface-card border-dark-border-DEFAULT' 
      : 'bg-surface-card border-border';
    
    switch (variant) {
      case 'elevated':
        return cn(
          baseClasses,
          'rounded-xl border'
        );
      case 'outlined':
        return cn(
          isDark ? 'bg-transparent border-dark-border-DEFAULT' : 'bg-transparent border-border',
          'rounded-xl border-2'
        );
      case 'ghost':
        return cn(
          'bg-transparent',
          'rounded-xl'
        );
      default:
        return cn(
          baseClasses,
          'rounded-xl border'
        );
    }
  };
  
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return '';
      case 'sm': return 'p-3';
      case 'lg': return 'p-6';
      default: return 'p-4';
    }
  };
  
  const content = wrapStringChildren(children);
  
  const getShadowStyle = () => {
    return {};
  };
  
  if (onPress) {
    return (
      <Pressable 
        className={cn(
          getVariantClasses(), 
          getPaddingClasses(), 
          className,
          disabled && 'opacity-50',
          'active:scale-98 transition-transform duration-150'
        )} 
        onPress={onPress} 
        style={[style, getShadowStyle()]}
        disabled={disabled}
        android_ripple={{ 
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderless: false 
        }}
      >
        {content}
      </Pressable>
    );
  }
  
  return (
    <View className={cn(getVariantClasses(), getPaddingClasses(), className)} style={[style, getShadowStyle()]}>
      {content}
    </View>
  );
};

// Themed Text Component - Enhanced with better typography
export const ThemedText: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'warning' | 'error' | 'muted';
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
}> = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'base',
  weight = 'normal',
  align = 'left',
  numberOfLines
}) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return isDark ? 'text-dark-text-secondary' : 'text-text-secondary';
      case 'tertiary':
        return isDark ? 'text-dark-text-tertiary' : 'text-text-tertiary';
      case 'muted':
        return isDark ? 'text-dark-text-muted' : 'text-text-muted';
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
      case 'xs': return 'text-xs leading-4';
      case 'sm': return 'text-sm leading-5';
      case 'md': return 'text-base leading-6';
      case 'lg': return 'text-lg leading-7';
      case 'xl': return 'text-xl leading-8';
      case '2xl': return 'text-2xl leading-9';
      case '3xl': return 'text-3xl leading-10';
      case '4xl': return 'text-4xl leading-tight';
      default: return 'text-base leading-6';
    }
  };
  
  const getWeightClasses = () => {
    switch (weight) {
      case 'light': return 'font-light';
      case 'medium': return 'font-medium';
      case 'semibold': return 'font-semibold';
      case 'bold': return 'font-bold';
      case 'extrabold': return 'font-extrabold';
      default: return 'font-normal';
    }
  };
  
  const getAlignClasses = () => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };
  
  return (
    <Text 
      className={cn(
      getVariantClasses(),
      getSizeClasses(),
      getWeightClasses(),
        getAlignClasses(),
      'font-sans',
      className
      )}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
    >
      {children}
    </Text>
  );
};

// Themed Button Component - Enhanced with loading states and better accessibility
export const ThemedButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'ghost' | 'outline' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}> = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon
}) => {
  const { isDark } = useTheme();
  const isDisabled = disabled || loading;
  
  const getVariantClasses = () => {
    if (isDisabled) {
      return isDark 
        ? 'bg-dark-surface-elevated text-dark-text-tertiary' 
        : 'bg-surface text-text-tertiary';
    }
    
    switch (variant) {
      case 'secondary':
        return isDark
          ? 'bg-dark-secondary-DEFAULT text-dark-text-inverse active:bg-dark-secondary-pressed'
          : 'bg-secondary text-text-primary active:bg-secondary-pressed';
      case 'accent':
        return isDark
          ? 'bg-dark-accent-DEFAULT text-dark-text-inverse active:bg-dark-accent-pressed'
          : 'bg-accent text-text-primary active:bg-accent-pressed';
      case 'success':
        return isDark
          ? 'bg-dark-success-DEFAULT text-dark-text-inverse active:bg-dark-success-pressed'
          : 'bg-success text-text-inverse active:bg-success-pressed';
      case 'warning':
        return isDark
          ? 'bg-dark-warning-DEFAULT text-dark-text-inverse active:bg-dark-warning-pressed'
          : 'bg-warning text-text-primary active:bg-warning-pressed';
      case 'error':
        return isDark
          ? 'bg-dark-error-DEFAULT text-dark-text-inverse active:bg-dark-error-pressed'
          : 'bg-error text-text-inverse active:bg-error-pressed';
      case 'ghost':
        return isDark
          ? 'bg-transparent text-dark-text-primary active:bg-dark-surface-elevated'
          : 'bg-transparent text-text-primary active:bg-surface-elevated';
      case 'outline':
        return isDark
          ? 'bg-transparent text-dark-text-primary border-2 border-dark-border-DEFAULT active:bg-dark-surface-elevated'
          : 'bg-transparent text-text-primary border-2 border-border active:bg-surface-elevated';
      case 'link':
        return isDark
          ? 'bg-transparent text-dark-primary-DEFAULT active:text-dark-primary-pressed'
          : 'bg-transparent text-primary active:text-primary-pressed';
      default:
        return isDark
          ? 'bg-dark-primary-DEFAULT text-dark-text-inverse active:bg-dark-primary-pressed'
          : 'bg-primary text-text-inverse active:bg-primary-pressed';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'px-2 py-1 text-xs min-h-6';
      case 'sm': return 'px-3 py-2 text-sm min-h-8';
      case 'lg': return 'px-6 py-4 text-lg min-h-12';
      case 'xl': return 'px-8 py-5 text-xl min-h-14';
      default: return 'px-4 py-3 text-base min-h-10';
    }
  };
  
  const getRoundedClasses = () => {
    switch (size) {
      case 'xs': return 'rounded-md';
      case 'sm': return 'rounded-md';
      case 'lg': return 'rounded-xl';
      case 'xl': return 'rounded-xl';
      default: return 'rounded-lg';
    }
  };
  
  return (
    <Pressable
      className={cn(
        getVariantClasses(),
        getSizeClasses(),
        getRoundedClasses(),
        'flex-row items-center justify-center',
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
        'active:scale-98 transition-transform duration-150',
        className
      )}
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ 
        color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderless: false 
      }}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={isDark ? '#ffffff' : '#000000'} 
          className="mr-2"
        />
      )}
      {leftIcon && !loading && (
        <View className="mr-2">
          {leftIcon}
        </View>
      )}
      {wrapStringChildren(children, { 
        size, 
        variant: variant === 'ghost' || variant === 'outline' || variant === 'link' ? 'primary' : variant,
        weight: 'medium'
      })}
      {rightIcon && (
        <View className="ml-2">
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
};

// Themed Input Component - Enhanced with better focus states and validation
export const ThemedInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  variant?: 'default' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
}> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  className, 
  variant = 'default',
  size = 'md',
  disabled = false,
  secureTextEntry = false,
  multiline = false,
  error = false,
  errorMessage,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  returnKeyType,
  onSubmitEditing
}) => {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };
  
  const getVariantClasses = () => {
    const errorClasses = error 
      ? (isDark ? 'border-dark-error-DEFAULT' : 'border-error')
      : '';
    
    const focusClasses = isFocused && !error
      ? (isDark ? 'border-dark-primary-DEFAULT' : 'border-primary')
      : '';
    
    const baseClasses = isDark 
      ? 'bg-dark-surface text-dark-text-primary border-dark-border-DEFAULT' 
      : 'bg-surface text-text-primary border-border';
    
    if (disabled) {
      return cn(
        isDark ? 'bg-dark-surface-elevated text-dark-text-tertiary border-dark-border-light' 
               : 'bg-surface-elevated text-text-tertiary border-border-light',
        'opacity-50'
      );
    }
    
    switch (variant) {
      case 'outlined':
        return cn(
          'bg-transparent border-2',
          isDark ? 'text-dark-text-primary' : 'text-text-primary',
          errorClasses || focusClasses || (isDark ? 'border-dark-border-DEFAULT' : 'border-border')
        );
      case 'ghost':
        return cn(
          'bg-transparent border-0',
          isDark ? 'text-dark-text-primary' : 'text-text-primary'
        );
      default:
        return cn(
          baseClasses,
          'border',
          errorClasses || focusClasses
        );
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm min-h-8';
      case 'lg': return 'px-4 py-4 text-lg min-h-12';
      default: return 'px-3 py-3 text-base min-h-10';
    }
  };
  
  const getRoundedClasses = () => {
    switch (size) {
      case 'sm': return 'rounded-md';
      case 'lg': return 'rounded-xl';
      default: return 'rounded-lg';
    }
  };
  
  return (
    <View className="w-full">
      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {leftIcon}
          </View>
        )}
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
      secureTextEntry={secureTextEntry}
          multiline={multiline}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
      placeholderTextColor={isDark ? '#6b7280' : '#6b7280'}
      className={cn(
            'w-full',
        getVariantClasses(),
            getSizeClasses(),
            getRoundedClasses(),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
        className
      )}
    />
        {rightIcon && (
          <View className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {rightIcon}
          </View>
        )}
      </View>
      {error && errorMessage && (
        <ThemedText 
          variant="error" 
          size="sm" 
          className="mt-1 ml-1"
        >
          {errorMessage}
        </ThemedText>
      )}
    </View>
  );
};

// Themed Badge Component - Enhanced with better variants and animations
export const ThemedBadge: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'dot';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}> = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  onPress,
  removable = false,
  onRemove
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
      case 'outline':
        return isDark
          ? 'bg-transparent text-dark-text-primary border border-dark-border-DEFAULT'
          : 'bg-transparent text-text-primary border border-border';
      case 'dot':
        return isDark
          ? 'bg-dark-primary-DEFAULT'
          : 'bg-primary';
      default:
        return isDark
          ? 'bg-dark-primary-DEFAULT text-dark-text-inverse'
          : 'bg-primary text-text-inverse';
    }
  };
  
  const getSizeClasses = () => {
    if (variant === 'dot') {
      switch (size) {
        case 'xs': return 'w-2 h-2';
        case 'sm': return 'w-3 h-3';
        case 'lg': return 'w-4 h-4';
        default: return 'w-3 h-3';
      }
    }
    
    switch (size) {
      case 'xs': return 'px-1.5 py-0.5 text-xs';
      case 'sm': return 'px-2 py-1 text-xs';
      case 'lg': return 'px-4 py-2 text-base';
      default: return 'px-3 py-1 text-sm';
    }
  };
  
  const content = variant === 'dot' ? null : (
    <View className="flex-row items-center">
      {wrapStringChildren(children, { size, variant: variant === 'outline' ? 'secondary' : variant })}
      {removable && (
        <Pressable
          onPress={onRemove}
          className="ml-2 -mr-1"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <ThemedText size="xs" variant={variant === 'outline' ? 'secondary' : variant}>×</ThemedText>
        </Pressable>
      )}
    </View>
  );
  
  const Component = onPress ? Pressable : View;
  
  return (
    <Component
      className={cn(
      'rounded-full font-medium',
        variant === 'dot' ? 'rounded-full' : 'flex-row items-center',
      getVariantClasses(),
      getSizeClasses(),
        onPress && 'active:scale-95',
      className
      )}
      onPress={onPress}
      disabled={!onPress}
    >
      {content}
    </Component>
  );
};

// Themed Divider Component - Enhanced with better styling options
export const ThemedDivider: React.FC<{
  className?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'thin' | 'medium' | 'thick';
  style?: 'solid' | 'dashed' | 'dotted';
  color?: 'default' | 'muted' | 'accent';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ 
  className, 
  variant = 'horizontal',
  size = 'thin',
  style = 'solid',
  color = 'default',
  spacing = 'md'
}) => {
  const { isDark } = useTheme();
  
  const getColorClasses = () => {
    switch (color) {
      case 'muted':
        return isDark ? 'bg-dark-border-light' : 'bg-border-light';
      case 'accent':
        return isDark ? 'bg-dark-accent-DEFAULT' : 'bg-accent';
      default:
        return isDark ? 'bg-dark-border-DEFAULT' : 'bg-border';
    }
  };
  
  const getSizeClasses = () => {
    if (variant === 'vertical') {
      switch (size) {
        case 'medium': return 'w-0.5';
        case 'thick': return 'w-1';
        default: return 'w-px';
      }
    }
    
    switch (size) {
      case 'medium': return 'h-0.5';
      case 'thick': return 'h-1';
      default: return 'h-px';
    }
  };
  
  const getSpacingClasses = () => {
    if (variant === 'vertical') {
      switch (spacing) {
        case 'none': return '';
        case 'sm': return 'mx-2';
        case 'lg': return 'mx-6';
        default: return 'mx-4';
      }
    }
    
    switch (spacing) {
      case 'none': return '';
      case 'sm': return 'my-2';
      case 'lg': return 'my-6';
      default: return 'my-4';
    }
  };
  
  const getStyleClasses = () => {
    // Note: React Native doesn't support CSS border styles like dashed/dotted
    // This would need to be implemented with custom components or SVG
    return '';
  };
  
  const getDimensionClasses = () => {
    return variant === 'vertical' ? 'h-full' : 'w-full';
  };
  
  return (
    <View 
      className={cn(
        getDimensionClasses(),
        getSizeClasses(),
        getColorClasses(),
        getSpacingClasses(),
        getStyleClasses(),
        className
      )} 
    />
  );
};

// New: Themed Avatar Component
export const ThemedAvatar: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square' | 'rounded';
  fallback?: string;
  className?: string;
  onPress?: () => void;
}> = ({ 
  size = 'md',
  variant = 'circle',
  fallback = '?',
  className,
  onPress
}) => {
  const { isDark } = useTheme();
  
  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'w-6 h-6';
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      case 'xl': return 'w-16 h-16';
      default: return 'w-10 h-10';
    }
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-lg';
      default: return 'rounded-full';
    }
  };
  
  const getTextSize = () => {
    switch (size) {
      case 'xs': return 'xs';
      case 'sm': return 'sm';
      case 'lg': return 'lg';
      case 'xl': return 'xl';
      default: return 'base';
    }
  };
  
  const Component = onPress ? Pressable : View;
  
  return (
    <Component
      className={cn(
        getSizeClasses(),
        getVariantClasses(),
        'flex items-center justify-center',
        isDark ? 'bg-dark-surface-elevated' : 'bg-surface-elevated',
        onPress && 'active:scale-95',
        className
      )}
      onPress={onPress}
    >
      <ThemedText 
        size={getTextSize() as any}
        variant="secondary"
        weight="medium"
      >
        {fallback}
      </ThemedText>
    </Component>
  );
};

// New: Themed Switch Component
export const ThemedSwitch: React.FC<{
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  value, 
  onValueChange, 
  disabled = false,
  size = 'md',
  className
}) => {
  const { isDark } = useTheme();
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return { track: 'w-8 h-5', thumb: 'w-4 h-4' };
      case 'lg': return { track: 'w-14 h-8', thumb: 'w-7 h-7' };
      default: return { track: 'w-12 h-6', thumb: 'w-5 h-5' };
    }
  };
  
  const sizes = getSizeClasses();
  
  const getTrackClasses = () => {
    if (disabled) {
      return isDark ? 'bg-dark-surface-elevated' : 'bg-surface-elevated';
    }
    
    if (value) {
      return isDark ? 'bg-dark-primary-DEFAULT' : 'bg-primary';
    }
    
    return isDark ? 'bg-dark-border-DEFAULT' : 'bg-border';
  };
  
  const getThumbClasses = () => {
    if (disabled) {
      return isDark ? 'bg-dark-text-tertiary' : 'bg-text-tertiary';
    }
    
    return isDark ? 'bg-dark-text-inverse' : 'bg-text-inverse';
  };
  
  const getThumbPosition = () => {
    if (value) {
      switch (size) {
        case 'sm': return 'translate-x-3';
        case 'lg': return 'translate-x-6';
        default: return 'translate-x-6';
      }
    }
    return 'translate-x-0.5';
  };
  
  return (
    <Pressable
      className={cn(
        'relative',
        sizes.track,
        getTrackClasses(),
        'rounded-full',
        disabled && 'opacity-50',
        className
      )}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
    >
      <View
        className={cn(
          'absolute top-0.5 left-0.5',
          sizes.thumb,
          getThumbClasses(),
          'rounded-full',
          getThumbPosition(),
          'transition-transform duration-200'
        )}
      />
    </Pressable>
  );
};

// New: Themed Modal Component
export const ThemedModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sheet' | 'dialog' | 'fullscreen';
  showBackdrop?: boolean;
  backdropOpacity?: number;
}> = ({ 
  visible, 
  onClose, 
  children, 
  className,
  variant = 'default',
  showBackdrop = true,
  backdropOpacity = 0.5
}) => {
  const { isDark } = useTheme();
  
  if (!visible) return null;
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'sheet':
        return cn(
          'absolute bottom-0 left-0 right-0',
          'bg-surface-card border-t border-border',
          'rounded-t-3xl',
          'max-h-3/4'
        );
      case 'dialog':
        return cn(
          'mx-4',
          'bg-surface-card border border-border',
          'rounded-2xl',
          'max-w-sm'
        );
      case 'fullscreen':
        return cn(
          'absolute inset-0',
          'bg-background'
        );
      default:
        return cn(
          'mx-4',
          'bg-surface-card border border-border',
          'rounded-xl'
        );
    }
  };
  
  const getShadowStyle = () => {
    return {};
  };

  return (
    <View className="absolute inset-0 z-50">
      {showBackdrop && (
        <Pressable
          className="absolute inset-0 bg-black"
          style={{ opacity: backdropOpacity }}
          onPress={onClose}
        />
      )}
      <View className="flex-1 justify-center items-center">
        <View className={cn(getVariantClasses(), className)} style={getShadowStyle()}>
          {children}
        </View>
      </View>
    </View>
  );
};

// New: Themed List Component
export const ThemedList: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'bordered';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ 
  children, 
  className,
  variant = 'default',
  spacing = 'md'
}) => {
  const { isDark } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return cn(
          'bg-surface-card border border-border',
          'rounded-xl'
        );
      case 'bordered':
        return cn(
          'border border-border',
          'rounded-lg'
        );
      default:
        return '';
    }
  };
  
  const getSpacingClasses = () => {
    switch (spacing) {
      case 'none': return '';
      case 'sm': return 'divide-y divide-border-light';
      case 'lg': return 'divide-y divide-border';
      default: return 'divide-y divide-border';
    }
  };
  
  const getShadowStyle = () => {
    return {};
  };

  return (
    <View className={cn(getVariantClasses(), getSpacingClasses(), className)} style={getShadowStyle()}>
      {children}
    </View>
  );
};

// New: Themed List Item Component
export const ThemedListItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ 
  children, 
  className,
  onPress,
  leftIcon,
  rightIcon,
  disabled = false,
  padding = 'md'
}) => {
  const { isDark } = useTheme();
  
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return '';
      case 'sm': return 'px-3 py-2';
      case 'lg': return 'px-6 py-4';
      default: return 'px-4 py-3';
    }
  };
  
  const content = (
    <View className="flex-row items-center flex-1">
      {leftIcon && (
        <View className="mr-3">
          {leftIcon}
        </View>
      )}
      <View className="flex-1">
        {wrapStringChildren(children)}
      </View>
      {rightIcon && (
        <View className="ml-3">
          {rightIcon}
        </View>
      )}
    </View>
  );
  
  if (onPress) {
    return (
      <Pressable
        className={cn(
          getPaddingClasses(),
          disabled && 'opacity-50',
          'active:bg-surface-elevated',
          className
        )}
        onPress={onPress}
        disabled={disabled}
        android_ripple={{ 
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderless: false 
        }}
      >
        {content}
      </Pressable>
    );
  }
  
  return (
    <View className={cn(getPaddingClasses(), className)}>
      {content}
    </View>
  );
};

// New: Themed Progress Component
export const ThemedProgress: React.FC<{
  value: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}> = ({ 
  value, 
  max = 100, 
  className,
  variant = 'default',
  size = 'md',
  showLabel = false
}) => {
  const { isDark } = useTheme();
  
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return isDark ? 'bg-dark-success-DEFAULT' : 'bg-success';
      case 'warning':
        return isDark ? 'bg-dark-warning-DEFAULT' : 'bg-warning';
      case 'error':
        return isDark ? 'bg-dark-error-DEFAULT' : 'bg-error';
      default:
        return isDark ? 'bg-dark-primary-DEFAULT' : 'bg-primary';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-1';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };
  
  return (
    <View className="w-full">
      <View className={cn(
        'w-full rounded-full overflow-hidden',
        getSizeClasses(),
        isDark ? 'bg-dark-surface-elevated' : 'bg-surface-elevated',
        className
      )}>
        <View
          className={cn(
            'h-full rounded-full',
            getVariantClasses()
          )}
          style={{ width: `${percentage}%` }}
        />
      </View>
      {showLabel && (
        <ThemedText 
          size="sm" 
          variant="secondary" 
          className="mt-1 text-center"
        >
          {Math.round(percentage)}%
        </ThemedText>
      )}
    </View>
  );
};

// New: Themed Spinner Component
export const ThemedSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ 
  size = 'md',
  variant = 'primary',
  className
}) => {
  const { isDark } = useTheme();
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };
  
  const getVariantColor = () => {
    switch (variant) {
      case 'secondary':
        return isDark ? '#6b7280' : '#6b7280';
      case 'success':
        return isDark ? '#10b981' : '#059669';
      case 'warning':
        return isDark ? '#f59e0b' : '#d97706';
      case 'error':
        return isDark ? '#ef4444' : '#dc2626';
      default:
        return isDark ? '#3b82f6' : '#2563eb';
    }
  };
  
  return (
    <View className={cn('items-center justify-center', className)}>
      <ActivityIndicator 
        size={size === 'xl' ? 'large' : 'small'}
        color={getVariantColor()}
        className={getSizeClasses()}
      />
    </View>
  );
};

// New: Themed Tooltip Component
export const ThemedTooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}> = ({ 
  children, 
  content, 
  position = 'top',
  className
}) => {
  const { isDark } = useTheme();
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };
  
  return (
    <View className="relative">
      <Pressable
        onPressIn={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
        className={className}
      >
        {children}
      </Pressable>
      {showTooltip && (
        <View
          className={cn(
            'absolute z-50',
            getPositionClasses(),
            'px-2 py-1',
            'bg-surface-card border border-border',
            'rounded-md',
            'max-w-xs'
          )}

        >
          <ThemedText size="sm" variant="secondary">
            {content}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

